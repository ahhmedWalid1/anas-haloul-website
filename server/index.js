import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import multer from "multer";
import nodemailer from "nodemailer";
import { nanoid } from "nanoid";
import fs from "fs";
import path from "path";

const app = express();
const PORT = process.env.PORT || 5174;
const ADMIN_TOKEN = process.env.ADMIN_TOKEN || "changeme";

// Email configuration (optional - can be disabled)
let transporter = null;
try {
  transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.MAIL_USER || 'anas.halou@outlook.com',
      pass: process.env.MAIL_PASS || 'your-app-password'
    }
  });
} catch (error) {
  console.log('Email configuration disabled:', error.message);
}

const dataDir = path.join(process.cwd(), "server", "data");
const uploadsDir = path.join(process.cwd(), "public", "uploads");
const dataFile = path.join(dataDir, "posts.json");

app.use(cors());
app.use(bodyParser.json());
app.use('/uploads', express.static(uploadsDir));
// Serve frontend build (for production hosting)
const distDir = path.join(process.cwd(), 'dist');
if (fs.existsSync(distDir)) {
  app.use(express.static(distDir));
}

// Ensure uploads directory exists
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'), false);
    }
  },
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
});

function ensureDataFile() {
  if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });
  if (!fs.existsSync(dataFile)) fs.writeFileSync(dataFile, JSON.stringify([]));
}

function readPosts() {
  ensureDataFile();
  const raw = fs.readFileSync(dataFile, "utf-8");
  return JSON.parse(raw);
}

function writePosts(posts) {
  ensureDataFile();
  fs.writeFileSync(dataFile, JSON.stringify(posts, null, 2));
}

// Public endpoints
app.get("/api/posts", (req, res) => {
  const posts = readPosts();
  res.json(posts);
});

app.get("/api/posts/:id", (req, res) => {
  const posts = readPosts();
  const found = posts.find((p) => p.id === req.params.id);
  if (!found) return res.status(404).json({ message: "Not found" });
  res.json(found);
});

// Admin endpoints
function requireAuth(req, res, next) {
  const auth = req.headers.authorization || "";
  const token = auth.startsWith("Bearer ") ? auth.slice(7) : "";
  if (token !== ADMIN_TOKEN) return res.status(401).json({ message: "Unauthorized" });
  next();
}

app.post("/api/posts", requireAuth, (req, res) => {
  const { title, excerpt, content, category, image } = req.body || {};
  if (!title || !excerpt || !content) return res.status(400).json({ message: "Missing fields" });
  const post = {
    id: nanoid(),
    title,
    excerpt,
    content,
    category: category || "عام",
    image: image || null,
    date: new Date().toLocaleDateString("ar-EG", { year: "numeric", month: "long", day: "numeric" }),
  };
  const posts = readPosts();
  posts.unshift(post);
  writePosts(posts);
  res.status(201).json(post);
});

app.delete("/api/posts/:id", requireAuth, (req, res) => {
  const posts = readPosts();
  const next = posts.filter((p) => p.id !== req.params.id);
  writePosts(next);
  res.json({ ok: true });
});

// File upload endpoint
app.post("/api/upload", requireAuth, upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded" });
  }
  
  const imageUrl = `/uploads/${req.file.filename}`;
  res.json({ imageUrl });
});

// Contact form endpoint
app.post("/api/contact", async (req, res) => {
  try {
    const { name, phone, message } = req.body;
    
    if (!name || !phone || !message) {
      return res.status(400).json({ message: "جميع الحقول مطلوبة" });
    }

    // Save contact message to file
    const contactFile = path.join(dataDir, "contacts.json");
    const contacts = fs.existsSync(contactFile) ? JSON.parse(fs.readFileSync(contactFile, 'utf-8')) : [];
    
    const newContact = {
      id: nanoid(),
      name,
      phone,
      message,
      date: new Date().toISOString(),
      status: 'new'
    };
    
    contacts.unshift(newContact);
    fs.writeFileSync(contactFile, JSON.stringify(contacts, null, 2));

    // Send email notification (optional - can be disabled if email not configured)
    if (transporter) {
      try {
        const mailOptions = {
          from: 'anas.halou@outlook.com',
          to: 'anas.halou@outlook.com',
          subject: `رسالة جديدة من ${name}`,
          html: `
            <h2>رسالة جديدة من موقع الحملة</h2>
            <p><strong>الاسم:</strong> ${name}</p>
            <p><strong>الهاتف:</strong> ${phone}</p>
            <p><strong>الرسالة:</strong></p>
            <p>${message.replace(/\n/g, '<br>')}</p>
            <p><strong>التاريخ:</strong> ${new Date().toLocaleString('ar-EG')}</p>
          `
        };
        
        await transporter.sendMail(mailOptions);
        console.log('Email sent successfully');
      } catch (emailError) {
        console.log('Email sending failed (this is optional):', emailError.message);
      }
    } else {
      console.log('Email sending disabled - no transporter configured');
    }

    res.json({ 
      success: true, 
      message: "تم إرسال رسالتك بنجاح! سنتواصل معك قريبًا." 
    });
    
  } catch (error) {
    console.error('Contact form error:', error);
    res.status(500).json({ 
      success: false, 
      message: "حدث خطأ في إرسال الرسالة. يرجى المحاولة مرة أخرى." 
    });
  }
});

// Get contact messages (admin only)
app.get("/api/contacts", requireAuth, (req, res) => {
  try {
    const contactFile = path.join(dataDir, "contacts.json");
    const contacts = fs.existsSync(contactFile) ? JSON.parse(fs.readFileSync(contactFile, 'utf-8')) : [];
    res.json(contacts);
  } catch (error) {
    res.status(500).json({ message: "خطأ في تحميل الرسائل" });
  }
});

// Server-side Open Graph for blog detail (for link previews)
app.get(/^\/blog\/(.+)$/i, (req, res, next) => {
  try {
    const id = req.params[0];
    const posts = readPosts();
    const post = posts.find((p) => p.id === id);
    if (!post) return next();

    const imageUrlRegex = /https?:\/\/[^\s]+\.(jpg|jpeg|png|gif|webp)/gi;
    const contentImages = (post.content || '').match(imageUrlRegex) || [];
    const ogImageRel = post.image || contentImages[0] || '';
    const inferredBase = `${req.protocol}://${req.get('host')}`;
    const baseUrl = (process.env.SITE_URL || inferredBase).replace(/\/$/, '');
    const ogImage = ogImageRel
      ? (ogImageRel.startsWith('http') ? ogImageRel : `${baseUrl}${ogImageRel}`)
      : (baseUrl ? `${baseUrl}/assets/candidate-portrait.jpg` : '');

    const pageUrl = baseUrl ? `${baseUrl}${req.originalUrl}` : req.originalUrl;

    const html = `<!doctype html>
<html lang="ar" dir="rtl">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${post.title}</title>
    <meta name="description" content="${(post.excerpt || '').replace(/"/g, '\\"')}" />
    <meta property="og:type" content="article" />
    <meta property="og:title" content="${post.title}" />
    <meta property="og:description" content="${(post.excerpt || '').replace(/"/g, '\\"')}" />
    ${ogImage ? `<meta property=\"og:image\" content=\"${ogImage}\" />` : ''}
    <meta property="og:url" content="${pageUrl}" />
    <meta name="twitter:card" content="summary_large_image" />
    ${ogImage ? `<meta name=\"twitter:image\" content=\"${ogImage}\" />` : ''}
    <meta http-equiv="refresh" content="0; url=${req.originalUrl}" />
    <script>location.replace(${JSON.stringify(req.originalUrl)});</script>
  </head>
  <body></body>
</html>`;

    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    return res.status(200).send(html);
  } catch (e) {
    return next();
  }
});

// SPA fallback to index.html for non-API routes (production)
app.get('*', (req, res, next) => {
  if (req.path.startsWith('/api') || req.path.startsWith('/uploads')) return next();
  if (fs.existsSync(distDir)) {
    return res.sendFile(path.join(distDir, 'index.html'));
  }
  return next();
});

app.listen(PORT, () => {
  console.log(`API server running on http://localhost:${PORT}`);
});


