import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Calendar, ArrowLeft, ChevronLeft, ChevronRight, X } from "lucide-react";
import { useEffect, useState } from "react";

type BlogPost = {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  date: string;
  category: string;
  image?: string;
};

const fetchPosts = async (): Promise<BlogPost[]> => {
  const res = await fetch("/api/posts");
  if (!res.ok) return [];
  return res.json();
};

const Blog = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);
  const [allImages, setAllImages] = useState<string[]>([]);

  useEffect(() => {
    fetchPosts().then(setPosts).catch(() => setPosts([]));
  }, []);

  // Extract all images from all posts
  useEffect(() => {
    const images: string[] = [];
    posts.forEach(post => {
      if (post.image) images.push(post.image);
      // Extract images from content
      const imageUrlRegex = /https?:\/\/[^\s]+\.(jpg|jpeg|png|gif|webp)/gi;
      const contentImages = post.content?.match(imageUrlRegex) || [];
      images.push(...contentImages);
    });
    setAllImages(images);
  }, [posts]);

  const openImageSlider = (imageUrl: string) => {
    const index = allImages.findIndex(img => img === imageUrl);
    setSelectedImageIndex(index >= 0 ? index : 0);
  };

  const closeImageSlider = () => {
    setSelectedImageIndex(null);
  };

  const nextImage = () => {
    if (selectedImageIndex !== null) {
      setSelectedImageIndex((selectedImageIndex + 1) % allImages.length);
    }
  };

  const prevImage = () => {
    if (selectedImageIndex !== null) {
      setSelectedImageIndex(selectedImageIndex === 0 ? allImages.length - 1 : selectedImageIndex - 1);
    }
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (selectedImageIndex === null) return;
      
      switch (e.key) {
        case 'Escape':
          closeImageSlider();
          break;
        case 'ArrowLeft':
          prevImage();
          break;
        case 'ArrowRight':
          nextImage();
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [selectedImageIndex]);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1">
        {/* Header */}
        <section className="bg-primary py-16">
          <div className="container mx-auto px-4">
            <div className="text-center animate-fade-in">
              <h1 className="text-4xl md:text-5xl font-bold text-primary-foreground mb-4">
                الأخبار
              </h1>
              <p className="text-lg text-primary-foreground/90 max-w-2xl mx-auto">
                أحدث الأخبار والمنشورات حول النشاط المجتمعي والبرلماني
              </p>
            </div>
          </div>
        </section>

        {/* Blog Posts Grid */}
        <section className="py-16 bg-background">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-2 gap-8">
              {posts.map((post) => {
                // Get first image from content if no main image
                const imageUrlRegex = /https?:\/\/[^\s]+\.(jpg|jpeg|png|gif|webp)/gi;
                const contentImages = post.content?.match(imageUrlRegex) || [];
                const displayImage = post.image || contentImages[0];
                
                return (
                  <Card
                    key={post.id}
                    className="group overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 cursor-pointer animate-fade-in border-border"
                  >
                    <div className="relative h-80 overflow-hidden">
                      {displayImage ? (
                        <img
                          src={displayImage}
                          alt={post.title}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 cursor-pointer"
                          onClick={() => openImageSlider(displayImage)}
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                          }}
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                          <div className="text-4xl text-primary/60">📰</div>
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-primary/90 to-transparent"></div>
                      <div className="absolute top-4 right-4">
                        <span className="px-3 py-1 bg-accent text-accent-foreground text-sm font-semibold rounded-full">
                          {post.category}
                        </span>
                      </div>
                      <div className="absolute bottom-4 left-4 text-white text-sm opacity-0 group-hover:opacity-100 transition-opacity">
                        اضغط على الصورة لعرضها بحجم أكبر
                      </div>
                      {contentImages.length > 0 && (
                        <div className="absolute top-4 left-4 bg-black/50 text-white px-2 py-1 rounded-full text-xs">
                          +{contentImages.length} صورة
                        </div>
                      )}
                    </div>
                    
                    <CardHeader>
                    <div className="flex items-center gap-2 text-muted-foreground text-sm mb-2">
                      <Calendar className="h-4 w-4" />
                      <span>{post.date}</span>
                    </div>
                    <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors leading-tight">
                      {post.title}
                    </h3>
                  </CardHeader>
                  
                  <CardContent>
                    <p className="text-muted-foreground leading-relaxed mb-4">
                      {post.excerpt}
                    </p>
                    <a href={`/blog/${post.id}`} className="flex items-center gap-2 text-primary font-semibold group-hover:gap-3 transition-all">
                      <span>اقرأ المزيد</span>
                      <ArrowLeft className="h-4 w-4" />
                    </a>
                  </CardContent>
                    </Card>
                  );
                })}
              </div>
           
          </div>
        </section>
      </main>

      <Footer />

      {/* Image Slider Modal */}
      {selectedImageIndex !== null && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
          <div className="relative max-w-6xl max-h-full">
            {/* Close Button */}
            <button
              onClick={closeImageSlider}
              className="absolute top-4 right-4 z-10 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors"
            >
              <X className="h-6 w-6" />
            </button>

            {/* Navigation Buttons */}
            {allImages.length > 1 && (
              <>
                <button
                  onClick={prevImage}
                  className="absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors"
                >
                  <ChevronLeft className="h-6 w-6" />
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors"
                >
                  <ChevronRight className="h-6 w-6" />
                </button>
              </>
            )}

            {/* Image */}
            <img
              src={allImages[selectedImageIndex]}
              alt={`صورة ${selectedImageIndex + 1}`}
              className="max-w-full max-h-[90vh] object-contain rounded-lg"
            />

            {/* Image Counter */}
            {allImages.length > 1 && (
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 text-white px-4 py-2 rounded-full text-sm">
                {selectedImageIndex + 1} من {allImages.length}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Blog;
