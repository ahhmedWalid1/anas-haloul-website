import { Mail, Phone, MapPin, Facebook, Instagram } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* About Section */}
          <div>
            <h3 className="text-2xl font-bold mb-4 text-accent">أنس هلول</h3>
            <p className="text-sm leading-relaxed opacity-90">
              مرشح مجلس النواب المصري عن دائرة أطفيح. نعمل معًا من أجل مستقبل أفضل
              لأطفيح ومصر.
            </p>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-xl font-bold mb-4 text-accent">تواصل معنا</h4>
            <div className="space-y-3">
              <a
                href="tel:+2001005117411"
                className="flex items-center gap-2 hover:text-accent transition-colors"
              >
                <Phone className="h-4 w-4" />
                <span className="text-sm">01005117411</span>
              </a>
              <a
                href="mailto:Anas.halou@outlook.com"
                className="flex items-center gap-2 hover:text-accent transition-colors"
              >
                <Mail className="h-4 w-4" />
                <span className="text-sm">Anas.halou@outlook.com</span>
              </a>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                <span className="text-sm">الكداية، أطفيح، الجيزة</span>
              </div>
            </div>
          </div>

          {/* Social Media */}
          <div>
            <h4 className="text-xl font-bold mb-4 text-accent">تابعنا</h4>
            <div className="flex gap-4">
              <a
                href="https://www.facebook.com/profile.php?id=61574024900042&sk=reviews"
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 bg-primary-hover rounded-full hover:bg-accent hover:text-accent-foreground transition-all duration-300 hover:scale-110"
                aria-label="Facebook"
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="p-3 bg-primary-hover rounded-full hover:bg-accent hover:text-accent-foreground transition-all duration-300 hover:scale-110"
                aria-label="Instagram"
              >
                <Instagram className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-primary-foreground/20 text-center">
          <p className="text-sm opacity-80">
            © 2025 أنس هلول - مرشح مجلس النواب. جميع الحقوق محفوظة.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
