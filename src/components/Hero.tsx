import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import heroImage from "@/assets/hero-bg.jpg";

const Hero = () => {
  return (
    <section className="relative min-h-[600px] md:min-h-[700px] flex items-center">
      {/* Background Image with Overlay */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${heroImage})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-primary/95 via-primary/85 to-primary/70"></div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-3xl">
          <div className="inline-block mb-4 px-4 py-2 bg-accent/20 border-2 border-accent rounded-full">
            <span className="text-accent font-bold text-sm md:text-base">
              مرشح مجلس النواب المصري (فردي) – حزب مستقبل وطن – الرمز: القلم
            </span>
          </div>
          
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-primary-foreground mb-6 leading-tight animate-fade-in">
            أنس هلول
          </h1>
          
          <p className="text-xl md:text-2xl text-accent font-semibold mb-4 animate-fade-in">
            دائرة أطفيح - محافظة الجيزة
          </p>
          
          <p className="text-base md:text-lg text-primary-foreground/95 mb-6 animate-fade-in">
            يعلن المرشح أنس هلول ترشحه لانتخابات مجلس النواب عن دائرة أطفيح بنظام الفردي،
            تحت مظلة حزب مستقبل وطن، وبالرمز الانتخابي: القلم.
          </p>
          
          <p className="text-lg md:text-xl text-primary-foreground/90 mb-8 leading-relaxed animate-fade-in">
            معًا نبني مستقبلًا أفضل لأطفيح. التزامنا هو خدمة المواطنين وتحقيق التنمية
            المستدامة لمجتمعنا من خلال العمل البرلماني الفعال.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 animate-fade-in">
            <Button
              asChild
              size="lg"
              className="bg-accent hover:bg-accent/90 text-accent-foreground font-bold text-lg px-8 py-6 transition-all duration-300 hover:scale-105"
            >
              <Link to="/contact">تواصل معنا</Link>
            </Button>
            
            <Button
              asChild
              variant="outline"
              size="lg"
              className="border-2 border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary font-bold text-lg px-8 py-6 transition-all duration-300 hover:scale-105"
            >
              <Link to="/blog">اقرأ المزيد</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
