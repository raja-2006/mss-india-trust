import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { CheckCircle, Loader2, Upload } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import { useFileUpload } from "../../hooks/useFileUpload";
import { useLanguage } from "../../hooks/useLanguage";
import { useSubmitVolunteer } from "../../hooks/useQueries";
import { tr, translations } from "../../translations";

export default function VolunteerSection() {
  const { lang } = useLanguage();
  const t = translations.volunteer;
  const submitVolunteer = useSubmitVolunteer();
  const { uploadFile, isUploading } = useFileUpload();

  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
  });
  const [idFile, setIdFile] = useState<File | null>(null);
  const [eduFile, setEduFile] = useState<File | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [uploading, setUploading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.phone || !form.email || !form.address || !idFile)
      return;

    setUploading(true);
    try {
      const idProofBlobId = await uploadFile(idFile);
      const eduProofBlobId = eduFile ? await uploadFile(eduFile) : null;

      await submitVolunteer.mutateAsync({
        name: form.name,
        phone: form.phone,
        email: form.email,
        address: form.address,
        idProofBlobId,
        eduProofBlobId,
      });
      setSubmitted(true);
      toast.success(tr(t.successMsg, lang));
    } catch {
      toast.error(tr(translations.common.error, lang));
    } finally {
      setUploading(false);
    }
  };

  const isLoading = uploading || isUploading || submitVolunteer.isPending;

  return (
    <section id="volunteer" className="section-padding bg-background">
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

        <div className="max-w-2xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="bg-card border border-border rounded-2xl p-8 shadow-card"
          >
            {submitted ? (
              <div className="text-center py-10">
                <CheckCircle className="w-16 h-16 text-secondary mx-auto mb-4" />
                <h3 className="font-heading font-bold text-xl text-foreground mb-2">
                  {tr({ en: "Thank You!", hi: "धन्यवाद!" }, lang)}
                </h3>
                <p className="text-muted-foreground">
                  {tr(t.successMsg, lang)}
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid sm:grid-cols-2 gap-5">
                  <div className="space-y-1.5">
                    <Label htmlFor="vol-name">{tr(t.nameLabel, lang)}</Label>
                    <Input
                      id="vol-name"
                      value={form.name}
                      onChange={(e) =>
                        setForm({ ...form, name: e.target.value })
                      }
                      required
                      data-ocid="volunteer.name.input"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="vol-phone">{tr(t.phoneLabel, lang)}</Label>
                    <Input
                      id="vol-phone"
                      type="tel"
                      value={form.phone}
                      onChange={(e) =>
                        setForm({ ...form, phone: e.target.value })
                      }
                      required
                      data-ocid="volunteer.phone.input"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="vol-email">{tr(t.emailLabel, lang)}</Label>
                  <Input
                    id="vol-email"
                    type="email"
                    value={form.email}
                    onChange={(e) =>
                      setForm({ ...form, email: e.target.value })
                    }
                    required
                    data-ocid="volunteer.email.input"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="vol-address">
                    {tr(t.addressLabel, lang)}
                  </Label>
                  <Textarea
                    id="vol-address"
                    value={form.address}
                    onChange={(e) =>
                      setForm({ ...form, address: e.target.value })
                    }
                    required
                    rows={3}
                    data-ocid="volunteer.address.textarea"
                  />
                </div>

                <div className="grid sm:grid-cols-2 gap-5">
                  <div className="space-y-1.5">
                    <Label htmlFor="vol-id">{tr(t.idProofLabel, lang)}</Label>
                    <label
                      htmlFor="vol-id"
                      className="flex flex-col items-center justify-center border-2 border-dashed border-border rounded-lg p-4 cursor-pointer hover:border-primary hover:bg-primary/5 transition-all"
                      data-ocid="volunteer.id.dropzone"
                    >
                      <Upload className="w-5 h-5 text-muted-foreground mb-1" />
                      <span className="text-xs text-muted-foreground text-center">
                        {idFile ? idFile.name : "Click to upload"}
                      </span>
                    </label>
                    <input
                      id="vol-id"
                      type="file"
                      className="sr-only"
                      accept="image/*,.pdf"
                      onChange={(e) => setIdFile(e.target.files?.[0] ?? null)}
                      required
                      data-ocid="volunteer.id.upload_button"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="vol-edu">{tr(t.eduProofLabel, lang)}</Label>
                    <label
                      htmlFor="vol-edu"
                      className="flex flex-col items-center justify-center border-2 border-dashed border-border rounded-lg p-4 cursor-pointer hover:border-primary hover:bg-primary/5 transition-all"
                      data-ocid="volunteer.edu.dropzone"
                    >
                      <Upload className="w-5 h-5 text-muted-foreground mb-1" />
                      <span className="text-xs text-muted-foreground text-center">
                        {eduFile ? eduFile.name : "Click to upload (optional)"}
                      </span>
                    </label>
                    <input
                      id="vol-edu"
                      type="file"
                      className="sr-only"
                      accept="image/*,.pdf"
                      onChange={(e) => setEduFile(e.target.files?.[0] ?? null)}
                      data-ocid="volunteer.edu.upload_button"
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-primary hover:bg-primary/90 text-white font-semibold py-3"
                  data-ocid="volunteer.submit_button"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      {tr(t.uploading, lang)}
                    </>
                  ) : (
                    tr(t.submitBtn, lang)
                  )}
                </Button>
              </form>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
