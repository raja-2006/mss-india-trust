import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { motion } from "motion/react";
import { useEffect, useState } from "react";
import type { TeamMember } from "../../backend";
import { getBlobUrl } from "../../hooks/useFileUpload";
import { useLanguage } from "../../hooks/useLanguage";
import { useTeamMembers } from "../../hooks/useQueries";
import { tr, translations } from "../../translations";

const FALLBACK_MEMBERS: TeamMember[] = [
  {
    id: "1",
    name: "Dr. R. B. Goswami",
    role: "Chairman",
    order: 1n,
    isActive: true,
  },
  {
    id: "2",
    name: "Smt. Guddi Devi",
    role: "Adviser",
    order: 2n,
    isActive: true,
  },
  {
    id: "3",
    name: "Smt. Munni Devi",
    role: "Cashier",
    order: 3n,
    isActive: true,
  },
  {
    id: "4",
    name: "Raja Babu",
    role: "Vice Chairman",
    order: 4n,
    isActive: true,
  },
  { id: "5", name: "Madhu Kumari", role: "Teacher", order: 5n, isActive: true },
  {
    id: "6",
    name: "Kuldeep Kumar",
    role: "Optometrist",
    order: 6n,
    isActive: true,
  },
  {
    id: "7",
    name: "Sani Goswami",
    role: "Head of Temple",
    order: 7n,
    isActive: true,
  },
  {
    id: "8",
    name: "Narendar Kumar",
    role: "Member",
    order: 8n,
    isActive: true,
  },
  { id: "9", name: "Anil Bharti", role: "Member", order: 9n, isActive: true },
];

function getInitials(name: string) {
  return name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

function MemberCard({ member, index }: { member: TeamMember; index: number }) {
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);

  useEffect(() => {
    if (member.photoBlobId) {
      getBlobUrl(member.photoBlobId)
        .then(setPhotoUrl)
        .catch(() => setPhotoUrl(null));
    }
  }, [member.photoBlobId]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.06 }}
      data-ocid={`team.item.${index + 1}`}
      className="bg-card rounded-2xl p-6 text-center border border-border shadow-card hover:shadow-card-hover transition-all duration-300 group"
    >
      <div className="flex justify-center mb-4">
        <Avatar className="w-20 h-20 ring-4 ring-primary/10 group-hover:ring-primary/30 transition-all">
          {photoUrl && <AvatarImage src={photoUrl} alt={member.name} />}
          <AvatarFallback className="bg-primary/10 text-primary font-heading font-bold text-lg">
            {getInitials(member.name)}
          </AvatarFallback>
        </Avatar>
      </div>
      <h3 className="font-heading font-bold text-base text-foreground mb-1">
        {member.name}
      </h3>
      <p className="text-secondary text-sm font-semibold">{member.role}</p>
    </motion.div>
  );
}

export default function TeamSection() {
  const { lang } = useLanguage();
  const t = translations.team;
  const { data: members, isLoading } = useTeamMembers();
  const displayMembers =
    members && members.length > 0
      ? members.filter((m) => m.isActive)
      : FALLBACK_MEMBERS;

  return (
    <section id="team" className="section-padding bg-white">
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

        {isLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {["a", "b", "c", "d", "e", "f", "g", "h", "i"].map((k) => (
              <div
                key={k}
                className="bg-muted rounded-2xl h-40 animate-pulse"
              />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {displayMembers.map((m, i) => (
              <MemberCard key={m.id} member={m} index={i} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
