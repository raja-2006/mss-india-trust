import { motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { useLanguage } from "../../hooks/useLanguage";
import { tr, translations } from "../../translations";

const stats = [
  { value: 10000, suffix: "+", labelKey: "people" as const },
  { value: 5000, suffix: "+", labelKey: "eyeTests" as const },
  { value: 25000, suffix: "+", labelKey: "meals" as const },
  { value: 200, suffix: "+", labelKey: "volunteers" as const },
];

function useCountUp(target: number, started: boolean, duration = 2000) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!started) return;
    let startTime: number | null = null;
    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const eased = 1 - (1 - progress) ** 3;
      setCount(Math.floor(eased * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [started, target, duration]);
  return count;
}

function StatCard({
  value,
  suffix,
  labelKey,
  started,
}: {
  value: number;
  suffix: string;
  labelKey: "people" | "eyeTests" | "meals" | "volunteers";
  started: boolean;
}) {
  const count = useCountUp(value, started);
  const { lang } = useLanguage();
  const t = translations.impact;

  return (
    <div className="text-center">
      <p className="font-heading text-4xl md:text-5xl font-bold text-white mb-2">
        {count.toLocaleString()}
        {suffix}
      </p>
      <p className="text-white/80 text-sm md:text-base font-medium">
        {tr(t[labelKey], lang)}
      </p>
    </div>
  );
}

export default function ImpactSection() {
  const { lang } = useLanguage();
  const t = translations.impact;
  const ref = useRef<HTMLDivElement>(null);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setStarted(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 },
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={ref} className="section-padding gradient-blue-green">
      <div className="container-narrow">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-white mb-3">
            {tr(t.title, lang)}
          </h2>
          <p className="text-white/75 max-w-md mx-auto">
            {tr(t.subtitle, lang)}
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-6">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.labelKey}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
            >
              <StatCard
                value={stat.value}
                suffix={stat.suffix}
                labelKey={stat.labelKey}
                started={started}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
