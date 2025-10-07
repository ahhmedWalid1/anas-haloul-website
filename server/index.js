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
  transporter = nodemailer.createTransporter({
    service: 'gmail',
    auth: {
      user: 'anas.halou@outlook.com', // This will be updated to use proper email
      pass: 'your-app-password' // This should be an app-specific password
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

app.listen(PORT, () => {
  console.log(`API server running on http://localhost:${PORT}`);
});


