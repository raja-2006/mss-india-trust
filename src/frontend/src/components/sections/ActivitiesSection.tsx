import {
  BookOpen,
  Eye,
  Landmark,
  Stethoscope,
  Users,
  Utensils,
} from "lucide-react";
import { motion } from "motion/react";
import { useLanguage } from "../../hooks/useLanguage";
import { tr, translations } from "../../translations";

const activities = [
  {
    icon: Eye,
    titleKey: "eyeCamps" as const,
    descKey: "eyeDesc" as const,
    color: "bg-blue-50 text-blue-600",
    border: "border-blue-100",
    image: "/assets/generated/activity-eye-camp.dim_600x400.jpg",
  },
  {
    icon: Stethoscope,
    titleKey: "medical" as const,
    descKey: "medicalDesc" as const,
    color: "bg-green-50 text-green-600",
    border: "border-green-100",
    image: null,
  },
  {
    icon: BookOpen,
    titleKey: "education" as const,
    descKey: "educationDesc" as const,
    color: "bg-amber-50 text-amber-600",
    border: "border-amber-100",
    image: "/assets/generated/activity-education.dim_600x400.jpg",
  },
  {
    icon: Utensils,
    titleKey: "food" as const,
    descKey: "foodDesc" as const,
    color: "bg-orange-50 text-orange-600",
    border: "border-orange-100",
    image: "/assets/generated/activity-food.dim_600x400.jpg",
  },
  {
    icon: Landmark,
    titleKey: "temple" as const,
    descKey: "templeDesc" as const,
    color: "bg-purple-50 text-purple-600",
    border: "border-purple-100",
    image: null,
  },
  {
    icon: Users,
    titleKey: "community" as const,
    descKey: "communityDesc" as const,
    color: "bg-teal-50 text-teal-600",
    border: "border-teal-100",
    image: null,
  },
];

export default function ActivitiesSection() {
  const { lang } = useLanguage();
  const t = translations.activities;

  return (
    <section id="activities" className="section-padding bg-background">
      <div className="container-narrow">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <div className="inline-flex items-center gap-2 text-secondary text-sm font-semibold uppercase tracking-widest mb-3">
            <span className="w-8 h-0.5 bg-secondary" />
            {tr(t.title, lang)}
            <span className="w-8 h-0.5 bg-secondary" />
          </div>
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-3">
            {tr(t.title, lang)}
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            {tr(t.subtitle, lang)}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {activities.map((activity, i) => {
            const Icon = activity.icon;
            return (
              <motion.div
                key={activity.titleKey}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className={`bg-card rounded-2xl overflow-hidden border ${activity.border} shadow-card hover:shadow-card-hover transition-all duration-300 group`}
              >
                {activity.image && (
                  <div className="h-40 overflow-hidden">
                    <img
                      src={activity.image}
                      alt={tr(t[activity.titleKey], lang)}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                  </div>
                )}
                <div className="p-6">
                  <div
                    className={`w-12 h-12 rounded-xl ${activity.color} flex items-center justify-center mb-4`}
                  >
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="font-heading font-bold text-lg text-foreground mb-2">
                    {tr(t[activity.titleKey], lang)}
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {tr(t[activity.descKey], lang)}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
