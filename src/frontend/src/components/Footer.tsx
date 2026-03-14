import { Heart, Mail, MapPin, Phone } from "lucide-react";
import { SiFacebook, SiInstagram, SiX, SiYoutube } from "react-icons/si";
import { useLanguage } from "../hooks/useLanguage";
import { tr, translations } from "../translations";

const quickLinks = [
  { key: "home" as const, href: "#home" },
  { key: "about" as const, href: "#about" },
  { key: "activities" as const, href: "#activities" },
  { key: "donate" as const, href: "#donate" },
  { key: "volunteer" as const, href: "#volunteer" },
  { key: "contact" as const, href: "#contact" },
];

export default function Footer() {
  const { lang } = useLanguage();
  const t = translations.footer;
  const navT = translations.nav;

  const scrollTo = (href: string) => {
    document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="max-w-6xl mx-auto px-4 py-14">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <img
                src="/assets/uploads/LOGO-1.jpeg"
                alt="MECO SEWA SANSTHAN INDIA TRUST Logo"
                className="w-10 h-10 rounded-full object-cover"
              />
              <div>
                <p className="font-heading font-bold text-sm leading-tight">
                  MECO SEWA SANSTHAN
                </p>
                <p className="text-[10px] text-white/60 leading-tight">
                  INDIA TRUST
                </p>
              </div>
            </div>
            <p className="text-white/70 text-sm leading-relaxed mb-5">
              {tr(t.tagline, lang)}
            </p>
            <div>
              <p className="text-white/60 text-xs uppercase tracking-widest mb-3">
                {tr(t.followUs, lang)}
              </p>
              <div className="flex gap-3">
                {[
                  { icon: SiFacebook, href: "#", label: "Facebook" },
                  { icon: SiX, href: "#", label: "X (Twitter)" },
                  { icon: SiInstagram, href: "#", label: "Instagram" },
                  { icon: SiYoutube, href: "#", label: "YouTube" },
                ].map(({ icon: Icon, href, label }) => (
                  <a
                    key={label}
                    href={href}
                    aria-label={label}
                    className="w-8 h-8 rounded-full bg-white/15 hover:bg-white/30 flex items-center justify-center transition-colors"
                  >
                    <Icon className="w-4 h-4" />
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <p className="font-heading font-bold text-sm uppercase tracking-widest text-white/80 mb-4">
              {tr(t.quickLinks, lang)}
            </p>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.key}>
                  <button
                    type="button"
                    onClick={() => scrollTo(link.href)}
                    className="text-white/70 hover:text-white text-sm transition-all hover:translate-x-1 inline-block"
                    data-ocid={`footer.${link.key}.link`}
                  >
                    {tr(navT[link.key], lang)}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="sm:col-span-2 lg:col-span-2">
            <p className="font-heading font-bold text-sm uppercase tracking-widest text-white/80 mb-4">
              {tr(t.contactInfo, lang)}
            </p>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-secondary mt-0.5 flex-shrink-0" />
                <p className="text-white/70 text-sm">
                  B-212 Street No-2, Chand Bagh,
                  <br />
                  North East Delhi – 110094
                </p>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-secondary flex-shrink-0" />
                <a
                  href="mailto:mssindiatrust@gmail.com"
                  className="text-white/70 hover:text-white text-sm transition-colors"
                >
                  mssindiatrust@gmail.com
                </a>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-secondary flex-shrink-0" />
                <a
                  href="tel:8447598015"
                  className="text-white/70 hover:text-white text-sm transition-colors"
                >
                  +91 8447598015
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/15">
        <div className="max-w-6xl mx-auto px-4 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-white/60 text-xs">{tr(t.copyright, lang)}</p>
          <a
            href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-white/50 hover:text-white/80 text-xs transition-colors flex items-center gap-1"
          >
            Built with <Heart className="w-3 h-3 text-red-400" /> using
            caffeine.ai
          </a>
        </div>
      </div>
    </footer>
  );
}
