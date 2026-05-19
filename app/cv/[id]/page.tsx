import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import {
  ArrowLeft, Briefcase, GraduationCap, Languages, Award, MapPin, Calendar,
  MessageCircle, Lock, KeyRound, ArrowRight, Mail,
} from "lucide-react";
import { getCurrentUser } from "@/lib/db/current-user";
import { fetchCvById } from "@/lib/db/cv";

type Props = { params: Promise<{ id: string }> };

export const metadata: Metadata = {
  title: "CV · Bisecco Pro",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function CVPublicPage({ params }: Props) {
  const user = await getCurrentUser();
  const isAuthorized = user?.role === "artisan" || user?.role === "admin";

  if (!user) {
    redirect("/connexion?redirect=/cv");
  }
  if (!isAuthorized) {
    return <GatedCV />;
  }

  const { id } = await params;
  const userId = Number(id);
  if (!userId) notFound();

  const cv = await fetchCvById(userId);
  if (!cv) notFound();

  const avatarUrl = cv.profile_photo
    ? cv.profile_photo.startsWith("http")
      ? cv.profile_photo
      : `https://bisecco.fr/storage/${cv.profile_photo}`
    : `https://api.dicebear.com/9.x/initials/svg?seed=${encodeURIComponent(cv.name)}`;

  return (
    <main className="bg-ink-50 min-h-screen pb-16">
      <div className="container-default max-w-4xl py-10">
        <Link href="/banque-cv" className="inline-flex items-center gap-1.5 text-sm text-ink-500 hover:text-brand-600 font-semibold">
          <ArrowLeft size={14} /> Retour à la banque de CV
        </Link>

        {/* Header */}
        <header className="mt-5 bg-white rounded-3xl border border-ink-100 p-6 sm:p-8 shadow-card">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={avatarUrl}
              alt=""
              className="w-24 h-24 rounded-2xl object-cover bg-ink-100 border border-ink-100 flex-shrink-0"
            />
            <div className="flex-1 min-w-0">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-ink-700 tracking-tight">
                {cv.name}
              </h1>
              {cv.cv_title && (
                <p className="mt-1 text-ink-500 font-semibold">{cv.cv_title}</p>
              )}
              <div className="flex flex-wrap items-center gap-3 mt-3 text-sm text-ink-500">
                {cv.metier && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-50 border border-brand-200 text-brand-700 text-xs font-bold">
                    {cv.metier.icon} {cv.metier.name}
                  </span>
                )}
                {cv.cv_search_city && (
                  <span className="inline-flex items-center gap-1 text-xs">
                    <MapPin size={12} /> {cv.cv_search_city}
                    {cv.cv_search_radius && ` (${cv.cv_search_radius} km)`}
                  </span>
                )}
                {cv.cv_available_from && (
                  <span className="inline-flex items-center gap-1 text-xs">
                    <Calendar size={12} /> Dispo dès le {new Date(cv.cv_available_from).toLocaleDateString("fr-FR")}
                  </span>
                )}
              </div>
            </div>

            {/* Actions contact */}
            <div className="w-full sm:w-auto flex flex-col gap-2">
              <Link
                href={`/messagerie/${cv.client_number ?? cv.id}`}
                className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-br from-brand-500 to-brand-600 text-white font-bold text-sm hover:-translate-y-0.5 shadow-[0_8px_22px_-6px_rgba(240,122,47,0.5)] transition"
              >
                <MessageCircle size={14} /> Contacter
              </Link>
              {cv.client_number && (
                <Link
                  href={`/profil/${cv.client_number}`}
                  className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-white border-2 border-ink-100 text-ink-700 text-sm font-bold hover:border-brand-300 transition"
                >
                  Voir profil public
                </Link>
              )}
            </div>
          </div>

          {cv.cv_about && (
            <div className="mt-6 pt-6 border-t border-ink-100">
              <h2 className="text-xs font-extrabold text-ink-400 uppercase tracking-wider mb-2">À propos</h2>
              <p className="text-ink-600 leading-relaxed whitespace-pre-line">{cv.cv_about}</p>
            </div>
          )}
        </header>

        {/* Body */}
        <div className="grid lg:grid-cols-[1fr_320px] gap-5 mt-5">
          <div className="space-y-5">
            {/* Expériences */}
            {(cv.cv_data?.experiences ?? []).length > 0 && (
              <Section icon={<Briefcase size={16} />} title="Expériences professionnelles">
                <div className="space-y-4">
                  {(cv.cv_data?.experiences ?? []).map((e) => (
                    <div key={e.id} className="relative pl-5 border-l-2 border-brand-200">
                      <div className="absolute -left-[7px] top-1 w-3 h-3 rounded-full bg-brand-500 border-2 border-white" />
                      <div className="font-extrabold text-ink-700">{e.poste || "Poste"}</div>
                      <div className="text-sm text-ink-500">{e.entreprise || "—"}</div>
                      <div className="text-xs text-ink-400 mt-0.5">
                        {e.debut} {e.fin ? `→ ${e.fin}` : ""}
                      </div>
                      {e.description && (
                        <p className="mt-2 text-sm text-ink-600 leading-relaxed">{e.description}</p>
                      )}
                    </div>
                  ))}
                </div>
              </Section>
            )}

            {/* Formations */}
            {(cv.cv_data?.formations ?? []).length > 0 && (
              <Section icon={<GraduationCap size={16} />} title="Formations & diplômes">
                <div className="space-y-3">
                  {(cv.cv_data?.formations ?? []).map((f) => (
                    <div key={f.id} className="flex items-start gap-3">
                      <div className="w-9 h-9 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0">
                        <GraduationCap size={15} />
                      </div>
                      <div>
                        <div className="font-bold text-ink-700">{f.diplome}</div>
                        <div className="text-xs text-ink-500">{f.ecole} {f.annee && `· ${f.annee}`}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </Section>
            )}
          </div>

          {/* Sidebar */}
          <aside className="space-y-5">
            {(cv.cv_data?.competences ?? []).length > 0 && (
              <Section icon={<Award size={16} />} title="Compétences">
                <div className="flex flex-wrap gap-2">
                  {(cv.cv_data?.competences ?? []).map((c, i) => (
                    <span key={`${c}-${i}`} className="inline-flex items-center px-3 py-1.5 rounded-full bg-brand-50 border border-brand-200 text-brand-700 text-xs font-bold">
                      {c}
                    </span>
                  ))}
                </div>
              </Section>
            )}

            {(cv.cv_data?.langues ?? []).length > 0 && (
              <Section icon={<Languages size={16} />} title="Langues">
                <ul className="space-y-2 text-sm">
                  {(cv.cv_data?.langues ?? []).map((l) => (
                    <li key={l.id} className="flex items-center justify-between">
                      <span className="font-semibold text-ink-700">{l.nom}</span>
                      <span className="text-xs px-2 py-0.5 rounded-full bg-ink-100 text-ink-600 font-bold">{l.niveau}</span>
                    </li>
                  ))}
                </ul>
              </Section>
            )}

            <Section icon={<Lock size={16} />} title="Confidentialité">
              <p className="text-xs text-ink-500 leading-relaxed">
                Ce CV est <strong className="text-ink-700">visible uniquement</strong> par les artisans Bisecco vérifiés SIREN.
                Le candidat reçoit une notification lorsque vous le contactez.
              </p>
            </Section>
          </aside>
        </div>
      </div>
    </main>
  );
}

function Section({ icon, title, children }: { icon: React.ReactNode; title: string; children: React.ReactNode }) {
  return (
    <section className="bg-white rounded-2xl border border-ink-100 p-5 shadow-card">
      <h2 className="font-extrabold text-ink-700 inline-flex items-center gap-2 mb-4">
        <span className="w-7 h-7 rounded-lg bg-brand-50 text-brand-600 flex items-center justify-center">
          {icon}
        </span>
        {title}
      </h2>
      {children}
    </section>
  );
}

function GatedCV() {
  return (
    <main className="bg-ink-50 min-h-screen">
      <section className="bg-gradient-to-br from-ink-900 via-ink-800 to-ink-900 text-white py-20">
        <div className="container-default max-w-xl mx-auto text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-3xl bg-brand-500/15 border border-brand-500/30 mb-5">
            <KeyRound size={26} className="text-brand-400" />
          </div>
          <h1 className="text-3xl font-extrabold">CV réservé aux pros</h1>
          <p className="mt-3 text-white/70">
            Ce CV est visible uniquement par les artisans recruteurs vérifiés SIREN.
            Inscrivez-vous gratuitement pour accéder à la banque complète.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link href="/inscription" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-brand-500 text-white font-bold hover:bg-brand-600 transition">
              <Mail size={14} /> M&apos;inscrire comme artisan <ArrowRight size={14} />
            </Link>
            <Link href="/connexion?redirect=/banque-cv" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white/[0.08] border border-white/[0.18] text-white font-bold hover:bg-white/[0.14] transition">
              J&apos;ai un compte
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
