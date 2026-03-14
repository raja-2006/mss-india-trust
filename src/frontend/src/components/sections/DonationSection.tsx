import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { CheckCheck, Copy, Heart } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import { useLanguage } from "../../hooks/useLanguage";
import {
  useDonors,
  useSiteSettings,
  useSubmitDonation,
} from "../../hooks/useQueries";
import { tr, translations } from "../../translations";

const BANK_DETAILS = [
  { label: "Account Name", value: "MECO SEWA SANSTHAN INDIA TRUST" },
  { label: "Bank", value: "Punjab National Bank" },
  { label: "Account Number", value: "4564000100064178" },
  { label: "IFSC Code", value: "PNB0456400" },
];

function CopyableRow({ label, value }: { label: string; value: string }) {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <div className="flex items-center justify-between py-3 border-b border-border last:border-0">
      <div>
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="font-semibold text-foreground text-sm">{value}</p>
      </div>
      <button
        type="button"
        onClick={copy}
        className="p-1.5 rounded-md hover:bg-muted transition-colors"
        aria-label={`Copy ${label}`}
      >
        {copied ? (
          <CheckCheck className="w-4 h-4 text-secondary" />
        ) : (
          <Copy className="w-4 h-4 text-muted-foreground" />
        )}
      </button>
    </div>
  );
}

export default function DonationSection() {
  const { lang } = useLanguage();
  const t = translations.donate;
  const { data: donors } = useDonors();
  const { data: settings } = useSiteSettings();
  const submitDonation = useSubmitDonation();

  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [message, setMessage] = useState("");
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const qrBlobId = settings?.find(([k]) => k === "qrCodeBlobId")?.[1];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    try {
      await submitDonation.mutateAsync({
        donorName: name.trim(),
        amount: amount ? BigInt(Math.round(Number(amount))) : null,
        message: message.trim() || null,
        isAnonymous,
      });
      setSubmitted(true);
      setName("");
      setAmount("");
      setMessage("");
      toast.success(tr(t.successMsg, lang));
    } catch {
      toast.error(tr(translations.common.error, lang));
    }
  };

  const publicDonors = donors?.filter((d) => !d.isAnonymous) ?? [];

  return (
    <section id="donate" className="section-padding bg-white">
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

        <div className="grid lg:grid-cols-2 gap-10">
          {/* Left: Bank details + QR */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            <div className="bg-primary/5 border border-primary/15 rounded-2xl p-6">
              <h3 className="font-heading font-bold text-lg text-foreground mb-4">
                {tr(t.bankTitle, lang)}
              </h3>
              {BANK_DETAILS.map((row) => (
                <CopyableRow
                  key={row.label}
                  label={row.label}
                  value={row.value}
                />
              ))}
            </div>

            <div className="bg-secondary/5 border border-secondary/15 rounded-2xl p-6 text-center">
              <h3 className="font-heading font-bold text-lg text-foreground mb-4">
                {tr(t.qrTitle, lang)}
              </h3>
              <div className="flex justify-center">
                <img
                  src={
                    qrBlobId
                      ? `/api/blob/${qrBlobId}`
                      : "/assets/generated/donation-qr-placeholder.dim_300x300.png"
                  }
                  alt="UPI QR Code"
                  className="w-48 h-48 object-contain rounded-xl border border-border"
                />
              </div>
            </div>
          </motion.div>

          {/* Right: Donation form + Donor list */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="space-y-6"
          >
            <div className="bg-card border border-border rounded-2xl p-6 shadow-card">
              <h3 className="font-heading font-bold text-lg text-foreground mb-5">
                {tr(t.formTitle, lang)}
              </h3>

              {submitted ? (
                <div className="text-center py-8">
                  <Heart className="w-12 h-12 text-secondary mx-auto mb-3" />
                  <p className="text-foreground font-semibold">
                    {tr(t.successMsg, lang)}
                  </p>
                  <button
                    type="button"
                    onClick={() => setSubmitted(false)}
                    className="mt-4 text-sm text-primary underline"
                  >
                    {tr(
                      {
                        en: "Submit another",
                        hi: "\u092b\u093f\u0930 \u0938\u0947 \u091c\u092e\u093e \u0915\u0930\u0947\u0902",
                      },
                      lang,
                    )}
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="donor-name">{tr(t.nameLabel, lang)}</Label>
                    <Input
                      id="donor-name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      placeholder="Ramesh Kumar"
                      data-ocid="donate.name.input"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="donor-amount">
                      {tr(t.amountLabel, lang)}
                    </Label>
                    <Input
                      id="donor-amount"
                      type="number"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      placeholder="500"
                      data-ocid="donate.amount.input"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="donor-message">
                      {tr(t.messageLabel, lang)}
                    </Label>
                    <Textarea
                      id="donor-message"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Your message..."
                      rows={3}
                      data-ocid="donate.message.textarea"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <Checkbox
                      id="anon"
                      checked={isAnonymous}
                      onCheckedChange={(v) => setIsAnonymous(!!v)}
                      data-ocid="donate.anonymous.checkbox"
                    />
                    <Label htmlFor="anon" className="cursor-pointer">
                      {tr(t.anonymousLabel, lang)}
                    </Label>
                  </div>
                  <Button
                    type="submit"
                    disabled={submitDonation.isPending}
                    className="w-full bg-secondary hover:bg-secondary/90 text-white font-semibold"
                    data-ocid="donate.submit_button"
                  >
                    {submitDonation.isPending
                      ? tr(translations.common.submitting, lang)
                      : tr(t.submitBtn, lang)}
                  </Button>
                </form>
              )}
            </div>

            {/* Donor list */}
            {publicDonors.length > 0 && (
              <div className="bg-card border border-border rounded-2xl p-6">
                <h3 className="font-heading font-bold text-base text-foreground mb-3">
                  {tr(t.thankyouTitle, lang)}
                </h3>
                <div className="flex flex-wrap gap-2">
                  {publicDonors.slice(0, 20).map((d) => (
                    <span
                      key={d.id}
                      className="inline-flex items-center gap-1 bg-secondary/10 text-secondary text-xs font-medium px-3 py-1 rounded-full"
                    >
                      <Heart className="w-3 h-3" /> {d.donorName}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
