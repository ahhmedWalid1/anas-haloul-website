import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useEffect, useMemo, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

type BlogPost = {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  date: string;
  category: string;
  image?: string;
};

const BlogDetail = () => {
  const { id } = useParams();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [loadError, setLoadError] = useState<string>("");
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);
  const [allImages, setAllImages] = useState<string[]>([]);

  useEffect(() => {
    if (!id) return;
    setIsLoading(true);
    setLoadError("");
    fetch(`/api/posts/${id}`)
      .then(async (r) => {
        if (!r.ok) {
          const text = await r.text().catch(() => "");
          throw new Error(text || `Failed to load post ${id}`);
        }
        return r.json();
      })
      .then((data) => {
        setPost(data);
        if (data) {
          const imageUrlRegex = /https?:\/\/[^\s]+\.(jpg|jpeg|png|gif|webp)/gi;
          const contentImages = data.content?.match(imageUrlRegex) || [];
          const images = data.image ? [data.image, ...contentImages] : contentImages;
          setAllImages(images);
        }
      })
      .catch((e) => {
        setPost(null);
        setLoadError(e?.message || "فشل في تحميل الخبر");
      })
      .finally(() => setIsLoading(false));
  }, [id]);

  const contentBlocks = useMemo(() => (post?.content || "").split(/\n{2,}/g), [post]);

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
        <section className="bg-primary py-16">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-primary-foreground">{post?.title || "منشور غير موجود"}</h1>
            {post && (
              <p className="mt-2 text-primary-foreground/90">{post.date} • {post.category}</p>
            )}
          </div>
        </section>
        <section className="py-12 bg-background">
          <div className="container mx-auto px-4 max-w-4xl">
            {isLoading ? (
              <p className="text-muted-foreground">جاري تحميل الخبر...</p>
            ) : !post ? (
              <div className="text-muted-foreground space-y-2">
                <p>لم يتم العثور على المنشور.</p>
                {loadError && <p className="text-destructive text-sm">{loadError}</p>}
                <p>
                  <Link to="/blog" className="text-primary">العودة للأخبار</Link>
                </p>
              </div>
            ) : (
              <article className="bg-card rounded-xl border border-border overflow-hidden shadow-lg">
                {post.image && (
                  <div className="relative h-80 md:h-96 overflow-hidden">
                    <img
                      src={post.image}
                      alt={post.title}
                      className="w-full h-full object-cover cursor-pointer hover:opacity-90 transition-opacity"
                      onClick={() => openImageSlider(post.image)}
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                    <div className="absolute top-4 right-4">
                      <span className="px-3 py-1 bg-accent text-accent-foreground text-sm font-semibold rounded-full">
                        {post.category}
                      </span>
                    </div>
                    <div className="absolute bottom-4 left-4 text-white text-sm">
                      اضغط على الصورة لعرضها بحجم أكبر
                    </div>
                  </div>
                )}
                <div className="p-6 md:p-8">
                  <div className="flex items-center gap-2 text-muted-foreground text-sm mb-4">
                    <span>{post.date}</span>
                    {post.category && <span>•</span>}
                    {post.category && <span>{post.category}</span>}
                  </div>
                  <div className="prose prose-lg max-w-none rtl:prose-p:text-right">
                    {contentBlocks.map((block, i) => {
                      // Check if block contains multiple image URLs
                      const imageUrlRegex = /https?:\/\/[^\s]+\.(jpg|jpeg|png|gif|webp)/gi;
                      const imageUrls = block.match(imageUrlRegex);
                      
                      if (imageUrls && imageUrls.length > 0) {
                        // Split text by image URLs
                        let textParts = block;
                        imageUrls.forEach(url => {
                          textParts = textParts.replace(url, '|||IMAGE_URL|||');
                        });
                        const textSegments = textParts.split('|||IMAGE_URL|||');
                        
                        return (
                          <div key={i} className="mb-6">
                            {textSegments.map((segment, segmentIndex) => (
                              <div key={segmentIndex}>
                                {segment.trim() && (
                                  <p className="mb-4 text-foreground leading-relaxed">{segment.trim()}</p>
                                )}
                                {imageUrls[segmentIndex] && (
                                  <div className="my-6">
                                    <img
                                      src={imageUrls[segmentIndex]}
                                      alt={`صورة ${segmentIndex + 1} في الخبر`}
                                      className="w-full h-[500px] object-cover rounded-lg shadow-lg mx-auto cursor-pointer hover:opacity-90 transition-opacity"
                                      onClick={() => openImageSlider(imageUrls[segmentIndex])}
                                      onError={(e) => {
                                        e.currentTarget.style.display = 'none';
                                      }}
                                    />
                                    <p className="text-center text-sm text-muted-foreground mt-2">
                                      اضغط على الصورة لعرضها بحجم أكبر
                                    </p>
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        );
                      }
                      
                      return (
                        <p key={i} className="mb-4 text-foreground leading-relaxed">{block}</p>
                      );
                    })}
                  </div>
                </div>
              </article>
            )}
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

export default BlogDetail;





