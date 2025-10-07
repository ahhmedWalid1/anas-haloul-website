import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { MessageSquare, Send } from "lucide-react";

const Complaints = () => {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    message: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.name.trim() || !formData.phone.trim() || !formData.message.trim()) {
      toast.error("من فضلك املأ جميع الحقول");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (result.success) {
        toast.success(result.message);
        setFormData({ name: "", phone: "", message: "" });
      } else {
        toast.error(result.message || "حدث خطأ في إرسال الرسالة");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("حدث خطأ في إرسال الرسالة. يرجى المحاولة مرة أخرى.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1">
        {/* Header */}
        <section className="bg-primary py-16">
          <div className="container mx-auto px-4">
            <div className="text-center animate-fade-in">
              <div className="inline-flex items-center justify-center mb-4">
                <MessageSquare className="h-12 w-12 text-accent" />
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-primary-foreground mb-4">
                تواصل معنا
              </h1>
              <p className="text-lg text-primary-foreground/90 max-w-2xl mx-auto">
                يسعدنا تواصلك معنا لأي استفسار أو اقتراح أو شكوى، وسنرد في أقرب وقت
              </p>
            </div>
          </div>
        </section>

        {/* Form Section */}
        <section className="py-16 bg-background">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto">
              <Card className="shadow-2xl border-border animate-fade-in">
                <CardHeader className="bg-secondary/30">
                  <CardTitle className="text-2xl text-center text-foreground">
                    نموذج التواصل
                  </CardTitle>
                </CardHeader>
                
                <CardContent className="p-8">
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Name Field */}
                    <div className="space-y-2">
                      <Label htmlFor="name" className="text-base font-semibold text-foreground">
                        الاسم الكامل <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        id="name"
                        name="name"
                        type="text"
                        placeholder="أدخل اسمك الكامل"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="text-base border-border focus:border-primary"
                      />
                    </div>

                    {/* Phone Field */}
                    <div className="space-y-2">
                      <Label htmlFor="phone" className="text-base font-semibold text-foreground">
                        رقم الهاتف <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        id="phone"
                        name="phone"
                        type="tel"
                        placeholder="01xxxxxxxxx"
                        value={formData.phone}
                        onChange={handleChange}
                        required
                        className="text-base border-border focus:border-primary"
                      />
                    </div>

                    {/* Message Field */}
                    <div className="space-y-2">
                      <Label htmlFor="message" className="text-base font-semibold text-foreground">
                        الرسالة <span className="text-destructive">*</span>
                      </Label>
                      <Textarea
                        id="message"
                        name="message"
                        placeholder="اكتب شكواك أو مقترحك هنا..."
                        value={formData.message}
                        onChange={handleChange}
                        required
                        rows={6}
                        className="text-base border-border focus:border-primary resize-none"
                      />
                    </div>

                    {/* Submit Button */}
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-accent hover:bg-accent/90 text-accent-foreground font-bold text-lg py-6 transition-all duration-300 hover:scale-105"
                    >
                      {isSubmitting ? (
                        <span>جاري الإرسال...</span>
                      ) : (
                        <span className="flex items-center justify-center gap-2">
                          <Send className="h-5 w-5" />
                          إرسال الرسالة
                        </span>
                      )}
                    </Button>
                  </form>

                  {/* Info Box */}
                  <div className="mt-8 p-6 bg-secondary/50 rounded-xl border border-border">
                    <p className="text-sm text-muted-foreground leading-relaxed text-center">
                      <strong className="text-foreground">ملاحظة:</strong> سيتم التعامل مع جميع
                      الرسائل بسرية تامة. سنبذل قصارى جهدنا للرد عليك في أقرب وقت ممكن.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Complaints;
