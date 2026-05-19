import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, MapPin, Briefcase, Euro, ShieldCheck, Flame, CheckCircle2, Share2, Heart, Users, Building2, ArrowRight, Calendar } from "lucide-react";
import { findJob } from "@/lib/emploi";
import { ShareButtons } from "@/components/ui/ShareButtons";
import { JsonLd } from "@/components/ui/JsonLd";

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const j = findJob(id);
  if (!j) return { title: "Offre introuvable" };
  return {
    title: `${j.title} — ${j.company} · ${j.city}`,
    description: `${j.contractType} · ${j.metier} · ${j.city}. ${j.description}`,
    openGraph: {
      title: `${j.title} · ${j.company}`,
      description: j.description,
      type: "article",
    },
  };
}

export default async function JobOfferPage({ params }: Props) {
  const { id } = await params;
  const j = findJob(id);
  if (!j) notFound();

  // Schema.org JobPosting pour SEO
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "JobPosting",
    title: j.title,
    description: j.description,
    datePosted: new Date().toISOString(),
    validThrough: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    employmentType: j.contractType,
    hiringOrganization: { "@type": "Organization", name: j.company },
    jobLocation: {
      "@type": "Place",
      address: { "@type": "PostalAddress", addressLocality: j.city, postalCode: j.postalCode, addressCountry: "FR" },
    },
    baseSalary: j.salaryMin ? {
      "@type": "MonetaryAmount",
      currency: "EUR",
      value: {
        "@type": "QuantitativeValue",
        minValue: j.salaryMin,
        maxValue: j.salaryMax,
        unitText: j.salaryPeriod === "an" ? "YEAR" : j.salaryPeriod === "mois" ? "MONTH" : "HOUR",
      },
    } : undefined,
  };

  return (
    <>
      <JsonLd data={jsonLd} />

      <div className="bg-ink-50 min-h-screen pb-16">
        <div className="container-default max-w-5xl py-10">
          <Link href="/emploi" className="inline-flex items-center gap-1.5 text-sm text-ink-500 hover:text-brand-500 font-semibold transition">
            <ArrowLeft size={14} /> Toutes les offres
          </Link>

          <div className="grid lg:grid-cols-[1fr_320px] gap-6 mt-5">
            {/* Main */}
            <article className="bg-white rounded-3xl shadow-card border border-ink-100 p-7 md:p-9">
              {/* Header */}
              <div className="flex items-start gap-4">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={j.companyAvatar} alt={j.company} className="w-16 h-16 rounded-2xl border border-ink-100 flex-shrink-0" loading="lazy" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-2">
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-brand-50 border border-brand-200 text-brand-700 text-[0.65rem] font-bold uppercase tracking-wider">
                      {j.contractType}
                    </span>
                    {j.urgent && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-red-50 border border-red-200 text-red-700 text-[0.65rem] font-bold uppercase tracking-wider">
                        <Flame size={10} /> Urgent
                      </span>
                    )}
                    {j.verified && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-[0.65rem] font-bold uppercase tracking-wider">
                        <ShieldCheck size={10} /> Vérifié
                      </span>
                    )}
                  </div>
                  <h1 className="text-2xl md:text-3xl font-bold text-ink-700 tracking-tight leading-tight">{j.title}</h1>
                  <p className="text-ink-500 mt-1 font-medium">
                    {j.company} · <span className="text-brand-500">{j.metier}</span>
                  </p>
                </div>
              </div>

              {/* Key info */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-6 pt-6 border-t border-ink-100">
                {[
                  { icon: MapPin,   label: "Lieu",        value: `${j.city} (${j.postalCode})` },
                  { icon: Briefcase,label: "Expérience",  value: j.experience },
                  { icon: Euro,     label: "Salaire",     value: j.salaryMin ? `${j.salaryMin.toLocaleString("fr-FR")} – ${j.salaryMax?.toLocaleString("fr-FR")} €/${j.salaryPeriod}` : "À négocier" },
                  { icon: Calendar, label: "Expire",      value: j.expiresAt },
                ].map((k) => (
                  <div key={k.label}>
                    <div className="flex items-center gap-1.5 text-[0.7rem] text-ink-400 font-bold tracking-wider uppercase">
                      <k.icon size={11} /> {k.label}
                    </div>
                    <div className="font-bold text-ink-700 text-sm mt-1">{k.value}</div>
                  </div>
                ))}
              </div>

              {/* Description */}
              <section className="mt-8">
                <h2 className="text-xl font-bold text-ink-700 mb-3">Le poste</h2>
                <p className="text-ink-600 leading-relaxed">{j.description}</p>
              </section>

              {/* Missions */}
              <section className="mt-7">
                <h2 className="text-xl font-bold text-ink-700 mb-3">Missions</h2>
                <ul className="space-y-2">
                  {j.missions.map((m) => (
                    <li key={m} className="flex items-start gap-2.5 text-ink-600">
                      <CheckCircle2 size={17} className="text-brand-500 flex-shrink-0 mt-0.5" />
                      <span>{m}</span>
                    </li>
                  ))}
                </ul>
              </section>

              {/* Profil */}
              <section className="mt-7">
                <h2 className="text-xl font-bold text-ink-700 mb-3">Profil recherché</h2>
                <ul className="space-y-2">
                  {j.profile.map((p) => (
                    <li key={p} className="flex items-start gap-2.5 text-ink-600">
                      <span className="text-brand-500 font-bold mt-0.5">→</span>
                      <span>{p}</span>
                    </li>
                  ))}
                </ul>
              </section>

              {/* Benefits */}
              <section className="mt-7">
                <h2 className="text-xl font-bold text-ink-700 mb-3">Avantages</h2>
                <div className="grid sm:grid-cols-2 gap-2">
                  {j.benefits.map((b) => (
                    <div key={b} className="flex items-center gap-2.5 px-3 py-2 rounded-xl bg-emerald-50/40 border border-emerald-200/50 text-sm">
                      <CheckCircle2 size={14} className="text-emerald-500 flex-shrink-0" />
                      <span className="text-ink-700">{b}</span>
                    </div>
                  ))}
                </div>
              </section>
            </article>

            {/* Sidebar */}
            <aside className="space-y-4 lg:sticky lg:top-24 lg:self-start">
              {/* CTA principal */}
              <div className="bg-gradient-to-br from-ink-800 to-ink-700 rounded-2xl p-6 text-white relative overflow-hidden">
                <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-brand-500/20 blur-2xl" />
                <div className="relative">
                  <h3 className="font-bold">Intéressé·e ?</h3>
                  <p className="text-white/65 text-sm mt-1">Postulez en 2 minutes avec votre CV.</p>
                  <div className="text-[0.7rem] text-white/55 mt-3 inline-flex items-center gap-1">
                    <Users size={11} /> {j.applications} candidat{j.applications > 1 ? "s" : ""}
                  </div>
                  <Link href={`/emploi/${j.id}/postuler`} className="mt-4 inline-flex w-full items-center justify-center gap-2 px-5 py-3 rounded-xl bg-brand-500 text-white font-bold hover:bg-brand-600 transition">
                    Postuler maintenant <ArrowRight size={15} />
                  </Link>
                  <Link href="/mon-profil/cv" className="mt-2 inline-flex w-full items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-white/10 border border-white/15 text-white text-sm font-semibold hover:bg-white/15 transition">
                    Je n&apos;ai pas encore de CV
                  </Link>
                </div>
              </div>

              {/* Entreprise */}
              <div className="bg-white rounded-2xl p-5 border border-ink-100">
                <h3 className="font-bold text-ink-700 text-sm mb-3 flex items-center gap-2">
                  <Building2 size={14} /> L&apos;entreprise
                </h3>
                <div className="flex items-center gap-3">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={j.companyAvatar} alt={j.company} className="w-10 h-10 rounded-xl flex-shrink-0" />
                  <div>
                    <div className="font-bold text-ink-700 text-sm">{j.company}</div>
                    <div className="text-xs text-ink-400">{j.metier} · {j.city}</div>
                  </div>
                </div>
                <Link href={`/profil/1`} className="block mt-3 text-xs font-bold text-brand-500 hover:underline">
                  Voir le profil →
                </Link>
              </div>

              {/* Sauvegarder / partager */}
              <div className="flex gap-2">
                <button className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl bg-white border border-ink-200 text-ink-700 text-sm font-bold hover:border-brand-500 transition">
                  <Heart size={13} /> Sauvegarder
                </button>
                <button className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl bg-white border border-ink-200 text-ink-700 text-sm font-bold hover:border-brand-500 transition">
                  <Share2 size={13} /> Partager
                </button>
              </div>

              <ShareButtons url={`/emploi/${j.id}`} title={`${j.title} chez ${j.company}`} description={j.description} compact={false} />
            </aside>
          </div>
        </div>
      </div>
    </>
  );
}
