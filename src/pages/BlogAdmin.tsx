import { useEffect, useState, useRef } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Upload, X, Image as ImageIcon } from "lucide-react";

type BlogPost = {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  date: string;
  category: string;
  image?: string;
};

const ADMIN_TOKEN = "changeme"; // In production, this should be from environment variables

const BlogAdmin = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [form, setForm] = useState({ title: "", excerpt: "", content: "", category: "", image: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchPosts = async () => {
    try {
      const res = await fetch("/api/posts");
      if (res.ok) {
        const data = await res.json();
        setPosts(data);
      }
    } catch (error) {
      console.error("Error fetching posts:", error);
      toast.error("خطأ في تحميل المنشورات");
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const addPost = async () => {
    if (!form.title.trim() || !form.excerpt.trim() || !form.content.trim()) {
      toast.error("من فضلك املأ الحقول المطلوبة");
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch("/api/posts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${ADMIN_TOKEN}`,
        },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        const newPost = await res.json();
        setPosts([newPost, ...posts]);
        setForm({ title: "", excerpt: "", content: "", category: "", image: "" });
        toast.success("تم إضافة المنشور");
      } else {
        toast.error("خطأ في إضافة المنشور");
      }
    } catch (error) {
      console.error("Error adding post:", error);
      toast.error("خطأ في إضافة المنشور");
    } finally {
      setIsLoading(false);
    }
  };

  const removePost = async (id: string) => {
    try {
      const res = await fetch(`/api/posts/${id}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${ADMIN_TOKEN}`,
        },
      });

      if (res.ok) {
        setPosts(posts.filter((p) => p.id !== id));
        toast.success("تم حذف المنشور");
      } else {
        toast.error("خطأ في حذف المنشور");
      }
    } catch (error) {
      console.error("Error deleting post:", error);
      toast.error("خطأ في حذف المنشور");
    }
  };

  const handleFileUpload = async (file: File) => {
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error("يرجى اختيار ملف صورة فقط");
      return;
    }

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("حجم الملف يجب أن يكون أقل من 5 ميجابايت");
      return;
    }

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append('image', file);

      const res = await fetch("/api/upload", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${ADMIN_TOKEN}`,
        },
        body: formData,
      });

      if (res.ok) {
        const data = await res.json();
        setForm({ ...form, image: data.imageUrl });
        setPreviewImage(data.imageUrl);
        toast.success("تم رفع الصورة بنجاح");
      } else {
        toast.error("خطأ في رفع الصورة");
      }
    } catch (error) {
      console.error("Error uploading file:", error);
      toast.error("خطأ في رفع الصورة");
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  const removeImage = () => {
    setForm({ ...form, image: "" });
    setPreviewImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <section className="bg-primary py-16">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-primary-foreground">إدارة المدونة</h1>
          </div>
        </section>
        <section className="py-12 bg-background">
          <div className="container mx-auto px-4 grid gap-8 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>إضافة منشور جديد</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>العنوان</Label>
                  <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label>مقتطف</Label>
                  <Textarea rows={3} value={form.excerpt} onChange={(e) => setForm({ ...form, excerpt: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label>المحتوى</Label>
                  <Textarea 
                    rows={8} 
                    value={form.content} 
                    onChange={(e) => setForm({ ...form, content: e.target.value })}
                    placeholder="اكتب محتوى الخبر هنا...

لإدراج صورة واحدة:
https://example.com/image1.jpg

لإدراج عدة صور:
هذا النص قبل الصورة الأولى.
https://example.com/image1.jpg
هذا النص بين الصور.
https://example.com/image2.jpg
هذا النص بعد الصورة الثانية.
https://example.com/image3.jpg

يمكنك إدراج عدد غير محدود من الصور!"
                  />
                  <div className="space-y-2">
                    <p className="text-xs text-muted-foreground">
                      💡 <strong>نصيحة:</strong> لإدراج عدة صور، ضع رابط كل صورة في سطر منفصل
                    </p>
                    <p className="text-xs text-muted-foreground">
                      🖼️ <strong>أنواع الصور المدعومة:</strong> JPG, PNG, GIF, WebP
                    </p>
                    <p className="text-xs text-muted-foreground">
                      📏 <strong>الحجم المثالي:</strong> 800x400 بكسل أو أكبر
                    </p>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>التصنيف</Label>
                  <Input value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label>صورة المنشور</Label>
                  
                  {/* File Upload Area */}
                  <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-primary transition-colors">
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                    
                    {previewImage ? (
                      <div className="space-y-4">
                        <div className="relative inline-block">
                          <img
                            src={previewImage}
                            alt="Preview"
                            className="w-32 h-32 object-cover rounded-lg mx-auto"
                          />
                          <button
                            type="button"
                            onClick={removeImage}
                            className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground rounded-full p-1 hover:bg-destructive/90"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                        <p className="text-sm text-muted-foreground">تم رفع الصورة بنجاح</p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <ImageIcon className="h-12 w-12 text-muted-foreground mx-auto" />
                        <div>
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => fileInputRef.current?.click()}
                            disabled={isUploading}
                            className="mb-2"
                          >
                            <Upload className="h-4 w-4 mr-2" />
                            {isUploading ? "جاري الرفع..." : "اختر صورة من الجهاز"}
                          </Button>
                          <p className="text-sm text-muted-foreground">
                            أو اسحب الصورة هنا (حد أقصى 5 ميجابايت)
                          </p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Manual URL Input */}
                  <div className="mt-4">
                    <Label className="text-sm text-muted-foreground">أو أدخل رابط الصورة يدوياً</Label>
                    <Input 
                      value={form.image} 
                      onChange={(e) => {
                        setForm({ ...form, image: e.target.value });
                        setPreviewImage(e.target.value);
                      }}
                      placeholder="https://example.com/image.jpg"
                      className="mt-1"
                    />
                  </div>
                </div>
                <Button onClick={addPost} disabled={isLoading} className="w-full">
                  {isLoading ? "جاري الإضافة..." : "إضافة"}
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>المنشورات</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {posts.length === 0 && <p className="text-muted-foreground">لا توجد منشورات بعد</p>}
                {posts.map((p) => (
                  <div key={p.id} className="border border-border rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-bold">{p.title}</div>
                        <div className="text-sm text-muted-foreground">{p.date} • {p.category}</div>
                      </div>
                      <div className="flex gap-2">
                        <a href={`/blog/${p.id}`} className="text-primary">عرض</a>
                        <button className="text-destructive" onClick={() => removePost(p.id)}>حذف</button>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default BlogAdmin;


