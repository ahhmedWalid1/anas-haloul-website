import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  const navLinks = [
    { path: "/", label: "الرئيسية" },
    { path: "/program", label: "البرنامج الانتخابي" },
    { path: "/blog", label: "الأخبار" },
    { path: "/contact", label: "تواصل معنا" },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-primary shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3">
            <div className="flex flex-col items-end">
              <span className="text-xl md:text-2xl font-bold text-primary-foreground">
                أنس هلول
              </span>
              <span className="text-xs md:text-sm text-accent font-semibold">
                مرشح مجلس النواب (فردي) – مستقبل وطن – الرمز: القلم
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`text-base font-semibold transition-all duration-300 hover:text-accent ${
                  isActive(link.path)
                    ? "text-accent border-b-2 border-accent pb-1"
                    : "text-primary-foreground"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden text-primary-foreground hover:text-accent hover:bg-primary-hover"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden pb-4 animate-fade-in">
            <div className="flex flex-col gap-4">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsOpen(false)}
                  className={`text-base font-semibold py-2 px-4 rounded-lg transition-all duration-300 ${
                    isActive(link.path)
                      ? "bg-accent text-accent-foreground"
                      : "text-primary-foreground hover:bg-primary-hover"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
