import { Calendar, Eye, MapPin, Target } from "lucide-react";
import { motion } from "motion/react";
import { useLanguage } from "../../hooks/useLanguage";
import { tr, translations } from "../../translations";

export default function AboutSection() {
  const { lang } = useLanguage();
  const t = translations.about;

  return (
    <section id="about" className="section-padding bg-white">
      <div className="container-narrow">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <div className="inline-flex items-center gap-2 text-secondary text-sm font-semibold uppercase tracking-widest mb-3">
            <span className="w-8 h-0.5 bg-secondary" />
            {tr(t.estd, lang)}
            <span className="w-8 h-0.5 bg-secondary" />
          </div>
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-4">
            {tr(t.title, lang)}
          </h2>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left: Description */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <p className="text-muted-foreground text-lg leading-relaxed mb-8">
              {tr(t.description, lang)}
            </p>
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="w-4 h-4 text-secondary" />
                <span>Est. 2010</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <MapPin className="w-4 h-4 text-secondary" />
                <span>North East Delhi</span>
              </div>
            </div>
          </motion.div>

          {/* Right: Mission & Vision */}
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="bg-primary/5 border border-primary/15 rounded-2xl p-6"
            >
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-primary/15 flex items-center justify-center flex-shrink-0">
                  <Target className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-heading font-bold text-lg text-foreground mb-2">
                    {tr(t.missionTitle, lang)}
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {tr(t.missionText, lang)}
                  </p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="bg-secondary/5 border border-secondary/15 rounded-2xl p-6"
            >
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-secondary/15 flex items-center justify-center flex-shrink-0">
                  <Eye className="w-5 h-5 text-secondary" />
                </div>
                <div>
                  <h3 className="font-heading font-bold text-lg text-foreground mb-2">
                    {tr(t.visionTitle, lang)}
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {tr(t.visionText, lang)}
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
