import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { CheckCircle, Loader2, Mail, MapPin, Phone } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import { useLanguage } from "../../hooks/useLanguage";
import { useSubmitContact } from "../../hooks/useQueries";
import { tr, translations } from "../../translations";

export default function ContactSection() {
  const { lang } = useLanguage();
  const t = translations.contact;
  const submitContact = useSubmitContact();

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await submitContact.mutateAsync(form);
      setSubmitted(true);
      toast.success(tr(t.successMsg, lang));
    } catch {
      toast.error(tr(translations.common.error, lang));
    }
  };

  return (
    <section id="contact" className="section-padding bg-white">
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

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Left: Contact info + Map */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="font-semibold text-foreground text-sm">
                    {tr(t.addressLabel, lang)}
                  </p>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    B-212 Street No-2, Chand Bagh,
                    <br />
                    North East Delhi – 110094
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-secondary/10 flex items-center justify-center flex-shrink-0">
                  <Mail className="w-5 h-5 text-secondary" />
                </div>
                <div>
                  <p className="font-semibold text-foreground text-sm">
                    {tr(t.emailLabel, lang)}
                  </p>
                  <a
                    href="mailto:mssindiatrust@gmail.com"
                    className="text-secondary hover:underline text-sm"
                  >
                    mssindiatrust@gmail.com
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Phone className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="font-semibold text-foreground text-sm">
                    {tr(t.phoneLabel, lang)}
                  </p>
                  <a
                    href="tel:8447598015"
                    className="text-primary hover:underline text-sm"
                  >
                    +91 8447598015
                  </a>
                </div>
              </div>
            </div>

            {/* Map */}
            <div className="rounded-2xl overflow-hidden border border-border shadow-card">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3498.9!2d77.29!3d28.68!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjjCsDQwJzQ4LjAiTiA3N8KwMTcnMjQuMCJF!5e0!3m2!1sen!2sin!4v1234567890!5m2!1sen!2sin"
                width="100%"
                height="280"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="MSS India Trust Location"
                data-ocid="contact.map_marker"
              />
            </div>
          </motion.div>

          {/* Right: Contact form */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <div className="bg-card border border-border rounded-2xl p-8 shadow-card">
              <h3 className="font-heading font-bold text-xl text-foreground mb-6">
                {tr(t.formTitle, lang)}
              </h3>

              {submitted ? (
                <div className="text-center py-10">
                  <CheckCircle className="w-14 h-14 text-secondary mx-auto mb-3" />
                  <p className="text-foreground font-semibold">
                    {tr(t.successMsg, lang)}
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label htmlFor="ct-name">{tr(t.nameLabel, lang)}</Label>
                      <Input
                        id="ct-name"
                        value={form.name}
                        onChange={(e) =>
                          setForm({ ...form, name: e.target.value })
                        }
                        required
                        data-ocid="contact.name.input"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="ct-phone">{tr(t.phoneField, lang)}</Label>
                      <Input
                        id="ct-phone"
                        type="tel"
                        value={form.phone}
                        onChange={(e) =>
                          setForm({ ...form, phone: e.target.value })
                        }
                        data-ocid="contact.phone.input"
                      />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="ct-email">{tr(t.emailField, lang)}</Label>
                    <Input
                      id="ct-email"
                      type="email"
                      value={form.email}
                      onChange={(e) =>
                        setForm({ ...form, email: e.target.value })
                      }
                      required
                      data-ocid="contact.email.input"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="ct-message">
                      {tr(t.messageLabel, lang)}
                    </Label>
                    <Textarea
                      id="ct-message"
                      value={form.message}
                      onChange={(e) =>
                        setForm({ ...form, message: e.target.value })
                      }
                      required
                      rows={4}
                      data-ocid="contact.message.textarea"
                    />
                  </div>
                  <Button
                    type="submit"
                    disabled={submitContact.isPending}
                    className="w-full bg-primary hover:bg-primary/90 text-white font-semibold"
                    data-ocid="contact.submit_button"
                  >
                    {submitContact.isPending ? (
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
        </div>
      </div>
    </section>
  );
}
