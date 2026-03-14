import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { AlertTriangle, CheckCircle, Loader2, Phone } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import { useLanguage } from "../../hooks/useLanguage";
import { useSubmitEmergency } from "../../hooks/useQueries";
import { tr, translations } from "../../translations";

export default function EmergencySection() {
  const { lang } = useLanguage();
  const t = translations.emergency;
  const submitEmergency = useSubmitEmergency();

  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    name: "",
    phone: "",
    location: "",
    problem: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.phone || !form.location || !form.problem) return;
    try {
      await submitEmergency.mutateAsync(form);
      setSubmitted(true);
      toast.success(tr(t.successMsg, lang));
    } catch {
      toast.error(tr(translations.common.error, lang));
    }
  };

  return (
    <section id="emergency" className="section-padding emergency-gradient">
      <div className="container-narrow">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10"
        >
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center">
              <AlertTriangle className="w-8 h-8 text-white" />
            </div>
          </div>
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-white mb-4">
            {tr(t.title, lang)}
          </h2>
          <p className="text-white/80 max-w-lg mx-auto mb-8">
            {tr(t.subtitle, lang)}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="bg-white text-red-600 hover:bg-white/90 font-bold px-8 rounded-full shadow-lg text-base"
              onClick={() => setShowForm(!showForm)}
              data-ocid="emergency.open_modal_button"
            >
              {tr(t.openBtn, lang)}
            </Button>
            <a
              href="tel:8447598015"
              className="inline-flex items-center gap-2 bg-white/20 border border-white/40 text-white font-semibold px-8 py-3 rounded-full hover:bg-white/30 transition-all text-base"
              data-ocid="emergency.call.button"
            >
              <Phone className="w-5 h-5" /> 8447598015
            </a>
          </div>
        </motion.div>

        {/* Form */}
        <AnimatePresence>
          {showForm && (
            <motion.div
              initial={{ opacity: 0, y: 20, height: 0 }}
              animate={{ opacity: 1, y: 0, height: "auto" }}
              exit={{ opacity: 0, y: -20, height: 0 }}
              transition={{ duration: 0.4 }}
              className="max-w-xl mx-auto overflow-hidden"
              data-ocid="emergency.dialog"
            >
              <div className="bg-white rounded-2xl p-8 shadow-2xl">
                {submitted ? (
                  <div className="text-center py-8">
                    <CheckCircle className="w-16 h-16 text-secondary mx-auto mb-4" />
                    <p className="font-semibold text-foreground">
                      {tr(t.successMsg, lang)}
                    </p>
                    <button
                      type="button"
                      onClick={() => {
                        setSubmitted(false);
                        setShowForm(false);
                        setForm({
                          name: "",
                          phone: "",
                          location: "",
                          problem: "",
                        });
                      }}
                      className="mt-4 text-sm text-primary underline"
                      data-ocid="emergency.close_button"
                    >
                      {tr({ en: "Close", hi: "बंद करें" }, lang)}
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <h3 className="font-heading font-bold text-lg text-foreground mb-2">
                      {tr(t.title, lang)}
                    </h3>
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <Label htmlFor="em-name">{tr(t.nameLabel, lang)}</Label>
                        <Input
                          id="em-name"
                          value={form.name}
                          onChange={(e) =>
                            setForm({ ...form, name: e.target.value })
                          }
                          required
                          data-ocid="emergency.name.input"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <Label htmlFor="em-phone">
                          {tr(t.phoneLabel, lang)}
                        </Label>
                        <Input
                          id="em-phone"
                          type="tel"
                          value={form.phone}
                          onChange={(e) =>
                            setForm({ ...form, phone: e.target.value })
                          }
                          required
                          data-ocid="emergency.phone.input"
                        />
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="em-location">
                        {tr(t.locationLabel, lang)}
                      </Label>
                      <Input
                        id="em-location"
                        value={form.location}
                        onChange={(e) =>
                          setForm({ ...form, location: e.target.value })
                        }
                        required
                        data-ocid="emergency.location.input"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="em-problem">
                        {tr(t.problemLabel, lang)}
                      </Label>
                      <Textarea
                        id="em-problem"
                        value={form.problem}
                        onChange={(e) =>
                          setForm({ ...form, problem: e.target.value })
                        }
                        required
                        rows={4}
                        data-ocid="emergency.problem.textarea"
                      />
                    </div>
                    <Button
                      type="submit"
                      disabled={submitEmergency.isPending}
                      className="w-full bg-red-600 hover:bg-red-700 text-white font-bold"
                      data-ocid="emergency.submit_button"
                    >
                      {submitEmergency.isPending ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          {tr(translations.common.submitting, lang)}
                        </>
                      ) : (
                        tr(t.submitBtn, lang)
                      )}
                    </Button>
                  </form>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
