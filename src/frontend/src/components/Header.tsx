import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useLanguage } from "../hooks/useLanguage";
import { tr, translations } from "../translations";

const navLinks = [
  { key: "home" as const, href: "#home" },
  { key: "about" as const, href: "#about" },
  { key: "activities" as const, href: "#activities" },
  { key: "team" as const, href: "#team" },
  { key: "gallery" as const, href: "#gallery" },
  { key: "donate" as const, href: "#donate" },
  { key: "volunteer" as const, href: "#volunteer" },
  { key: "emergency" as const, href: "#emergency" },
  { key: "contact" as const, href: "#contact" },
];

function scrollToSection(href: string) {
  const el = document.querySelector(href);
  if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
}

export default function Header() {
  const { lang, setLang } = useLanguage();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/95 backdrop-blur-md shadow-md border-b border-border"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo */}
        <button
          type="button"
          className="flex items-center gap-2 group"
          onClick={() => scrollToSection("#home")}
          data-ocid="nav.home.link"
        >
          <img
            src="/assets/uploads/LOGO-1.jpeg"
            alt="MECO SEWA SANSTHAN INDIA TRUST Logo"
            className="w-10 h-10 rounded-full object-cover shadow-sm group-hover:scale-105 transition-transform"
          />
          <div>
            <p className="font-heading font-bold text-sm leading-tight text-primary">
              MECO SEWA SANSTHAN
            </p>
            <p className="text-[10px] text-muted-foreground leading-tight">
              INDIA TRUST
            </p>
          </div>
        </button>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-1">
          {navLinks.map((link) => (
            <button
              key={link.key}
              type="button"
              onClick={() => scrollToSection(link.href)}
              data-ocid={`nav.${link.key}.link`}
              className="px-3 py-1.5 text-sm font-medium rounded-md text-foreground/80 hover:text-primary hover:bg-primary/8 transition-all duration-200"
            >
              {tr(translations.nav[link.key], lang)}
            </button>
          ))}
        </nav>

        {/* Right Controls */}
        <div className="flex items-center gap-2">
          {/* Language Toggle */}
          <div className="flex rounded-full border border-border overflow-hidden text-xs">
            <button
              type="button"
              onClick={() => setLang("en")}
              data-ocid="nav.lang-en.toggle"
              className={`px-3 py-1.5 font-medium transition-colors ${
                lang === "en"
                  ? "bg-primary text-white"
                  : "bg-transparent text-foreground hover:bg-muted"
              }`}
            >
              EN
            </button>
            <button
              type="button"
              onClick={() => setLang("hi")}
              data-ocid="nav.lang-hi.toggle"
              className={`px-3 py-1.5 font-medium transition-colors ${
                lang === "hi"
                  ? "bg-primary text-white"
                  : "bg-transparent text-foreground hover:bg-muted"
              }`}
            >
              HI
            </button>
          </div>

          {/* Donate CTA */}
          <Button
            size="sm"
            className="hidden sm:flex bg-secondary hover:bg-secondary/90 text-white font-semibold"
            onClick={() => scrollToSection("#donate")}
            data-ocid="nav.donate.primary_button"
          >
            {tr(translations.hero.donateCta, lang)}
          </Button>

          {/* Mobile Menu Toggle */}
          <button
            type="button"
            className="lg:hidden p-2 rounded-md hover:bg-muted transition-colors"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
            data-ocid="nav.menu.toggle"
          >
            {menuOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Nav */}
      {menuOpen && (
        <div className="lg:hidden bg-white/98 backdrop-blur-md border-t border-border px-4 py-3 shadow-lg">
          <nav className="flex flex-col gap-1">
            {navLinks.map((link) => (
              <button
                key={link.key}
                type="button"
                onClick={() => {
                  scrollToSection(link.href);
                  setMenuOpen(false);
                }}
                data-ocid={`nav.mobile.${link.key}.link`}
                className="px-4 py-2.5 text-sm font-medium rounded-lg text-foreground hover:text-primary hover:bg-primary/8 transition-all text-left"
              >
                {tr(translations.nav[link.key], lang)}
              </button>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
