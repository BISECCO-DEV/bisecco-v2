import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, MapPin, Award, Clock, CheckCircle2, ArrowRight, Briefcase } from "lucide-react";

type Props = { params: Promise<{ slug: string }> };

const JOBS: Record<string, {
  title: string; type: string; location: string; salary: string; team: string;
  description: string; missions: string[]; profile: string[]; benefits: string[];
}> = {
  "developpeur-euse-full-stack-h-f": {
    title: "Développeur·euse Full-Stack (H/F)",
    type: "CDI",
    location: "Meaux ou Full Remote",
    salary: "45-65K€ + stock options",
    team: "Tech",
    description: "Vous rejoindrez notre équipe tech (3 personnes) pour construire la prochaine génération de fonctionnalités Bisecco. Stack moderne : Next.js 15, Supabase, IA Claude.",
    missions: [
      "Développer de nouvelles features end-to-end (front + back + DB)",
      "Participer à l'architecture technique et aux choix stratégiques",
      "Code review, mentoring, partage de connaissances",
      "Optimiser performance, SEO, accessibilité",
      "Intégrer des features IA (chatbot, suggestion, estimation devis)",
    ],
    profile: [
      "3+ ans d'expérience en développement web",
      "Maîtrise Next.js / React / TypeScript",
      "Expérience PostgreSQL (Supabase ou autre)",
      "Sens du produit, attention aux détails",
      "Anglais lu/écrit",
    ],
    benefits: [
      "Full remote ou bureaux à Meaux",
      "Stock options dès le 1er jour",
      "Budget formation 2000€/an",
      "Mac M3 + écran 4K + setup complet",
      "Mutuelle premium",
      "Tickets resto Swile",
    ],
  },
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const job = JOBS[slug];
  if (!job) return { title: "Offre introuvable" };
  return { title: `${job.title} — Carrières`, description: job.description };
}

export default async function JobPage({ params }: Props) {
  const { slug } = await params;
  const job = JOBS[slug];
  if (!job) notFound();

  return (
    <div className="bg-ink-50 min-h-screen pb-16">
      <div className="container-default max-w-3xl py-10">
        <Link href="/carrieres" className="inline-flex items-center gap-1.5 text-sm text-ink-500 hover:text-brand-500 font-semibold transition">
          <ArrowLeft size={14} /> Toutes les offres
        </Link>

        <article className="bg-white rounded-3xl shadow-card border border-ink-100 p-8 md:p-10 mt-5">
          <div className="flex items-center gap-2 flex-wrap mb-3">
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-brand-50 border border-brand-200 text-brand-700 text-[0.65rem] font-bold uppercase tracking-wider">
              {job.team}
            </span>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-ink-50 border border-ink-200 text-ink-700 text-[0.65rem] font-bold uppercase tracking-wider">
              {job.type}
            </span>
          </div>
          <h1 className="text-3xl md:text-[2.2rem] font-bold text-ink-700 tracking-[-0.02em] leading-tight">{job.title}</h1>
          <div className="flex items-center gap-3 mt-3 text-sm text-ink-500 flex-wrap">
            <span className="flex items-center gap-1"><MapPin size={13} /> {job.location}</span>
            <span>·</span>
            <span className="flex items-center gap-1"><Award size={13} /> {job.salary}</span>
            <span>·</span>
            <span className="flex items-center gap-1"><Clock size={13} /> Recrutement actif</span>
          </div>

          {/* Description */}
          <section className="mt-8">
            <h2 className="text-xl font-bold text-ink-700 mb-3">Le poste</h2>
            <p className="text-ink-600 leading-relaxed">{job.description}</p>
          </section>

          {/* Missions */}
          <section className="mt-8">
            <h2 className="text-xl font-bold text-ink-700 mb-4 flex items-center gap-2">
              <Briefcase size={18} /> Vos missions
            </h2>
            <ul className="space-y-2.5">
              {job.missions.map((m) => (
                <li key={m} className="flex items-start gap-2.5 text-ink-600">
                  <CheckCircle2 size={17} className="text-brand-500 flex-shrink-0 mt-0.5" />
                  <span>{m}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* Profil */}
          <section className="mt-8">
            <h2 className="text-xl font-bold text-ink-700 mb-4">Profil recherché</h2>
            <ul className="space-y-2.5">
              {job.profile.map((p) => (
                <li key={p} className="flex items-start gap-2.5 text-ink-600">
                  <span className="text-brand-500 font-bold mt-0.5">→</span>
                  <span>{p}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* Bénéfices */}
          <section className="mt-8">
            <h2 className="text-xl font-bold text-ink-700 mb-4">Ce qu&apos;on offre</h2>
            <div className="grid sm:grid-cols-2 gap-2">
              {job.benefits.map((b) => (
                <div key={b} className="flex items-center gap-2.5 px-3 py-2 rounded-xl bg-emerald-50/40 border border-emerald-200/50 text-sm">
                  <CheckCircle2 size={14} className="text-emerald-500 flex-shrink-0" />
                  <span className="text-ink-700">{b}</span>
                </div>
              ))}
            </div>
          </section>

          {/* CTA */}
          <section className="mt-10 p-6 rounded-2xl bg-gradient-to-br from-brand-50 to-amber-50/30 border border-brand-200/60 text-center">
            <h3 className="font-bold text-ink-700 text-lg">Intéressé·e ?</h3>
            <p className="text-sm text-ink-500 mt-1">
              Envoyez CV + lien GitHub/portfolio à <strong>jobs@bisecco.fr</strong>
            </p>
            <a href="mailto:jobs@bisecco.fr?subject=Candidature%20Développeur" className="btn-primary mt-4 inline-flex">
              Postuler <ArrowRight size={14} />
            </a>
          </section>
        </article>
      </div>
    </div>
  );
}
