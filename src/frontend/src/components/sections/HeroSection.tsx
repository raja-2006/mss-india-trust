import { Button } from "@/components/ui/button";
import { ArrowDown } from "lucide-react";
import { motion } from "motion/react";
import { useLanguage } from "../../hooks/useLanguage";
import { tr, translations } from "../../translations";

export default function HeroSection() {
  const { lang } = useLanguage();

  const scrollTo = (id: string) => {
    document.querySelector(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage:
            "url('/assets/generated/hero-banner.dim_1400x700.jpg')",
        }}
      />
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/85 via-primary/70 to-secondary/75" />
      {/* Texture overlay */}
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, white 1px, transparent 0)",
          backgroundSize: "32px 32px",
        }}
      />

      <div className="relative z-10 max-w-5xl mx-auto px-4 text-center">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm border border-white/30 rounded-full px-4 py-2 text-white/90 text-sm font-medium mb-8"
        >
          <span className="w-2 h-2 rounded-full bg-secondary animate-pulse" />
          {tr(translations.hero.since, lang)}
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="font-heading text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-tight mb-6 text-balance"
        >
          {tr(translations.hero.headline, lang)}
        </motion.h1>

        {/* Subtext */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="text-lg md:text-xl text-white/85 mb-10 font-medium tracking-wide"
        >
          {tr(translations.hero.subtext, lang)}
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
        >
          <Button
            size="lg"
            className="bg-secondary hover:bg-secondary/90 text-white font-bold px-8 py-6 text-base rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-105"
            onClick={() => scrollTo("#donate")}
            data-ocid="hero.donate.primary_button"
          >
            {tr(translations.hero.donateCta, lang)}
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="bg-white/15 backdrop-blur-sm border-white/50 text-white hover:bg-white/25 font-bold px-8 py-6 text-base rounded-full shadow-lg transition-all hover:scale-105"
            onClick={() => scrollTo("#volunteer")}
            data-ocid="hero.volunteer.secondary_button"
          >
            {tr(translations.hero.volunteerCta, lang)}
          </Button>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        onClick={() => scrollTo("#about")}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/70 hover:text-white transition-colors animate-bounce"
        aria-label="Scroll down"
        data-ocid="hero.scroll.button"
      >
        <ArrowDown className="w-6 h-6" />
      </motion.button>
    </section>
  );
}
