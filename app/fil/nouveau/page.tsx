import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, ShieldCheck } from "lucide-react";
import { requireUser } from "@/lib/db/current-user";
import { fetchAllMetiers } from "@/lib/db/metiers";
import { getMetierOptions } from "@/lib/db/metier-options";
import { FeedComposer } from "@/components/features/feed/FeedComposer";

export const metadata: Metadata = {
  title: "Nouvelle publication · Le Fil",
  robots: { index: false, follow: false },
};

type SearchParams = Promise<{ kind?: string }>;

export default async function NouveauPostPage({ searchParams }: { searchParams: SearchParams }) {
  const user = await requireUser();
  const { kind: initialKindRaw } = await searchParams;
  const initialKind =
    initialKindRaw === "realisation" || initialKindRaw === "conseil" || initialKindRaw === "question"
      ? initialKindRaw
      : undefined;

  if (user.validation_status !== "approved") {
    return (
      <div className="bg-[#fafbfc] min-h-screen py-16">
        <div className="container-default max-w-md text-center">
          <div className="bg-white rounded-3xl border border-ink-100 p-10 shadow-[0_4px_24px_-4px_rgba(13,30,74,0.08)]">
            <div className="w-14 h-14 rounded-2xl bg-amber-50 flex items-center justify-center mx-auto mb-4">
              <ShieldCheck size={24} className="text-amber-500" />
            </div>
            <h1 className="text-xl font-bold text-ink-700">Compte non validé</h1>
            <p className="text-ink-500 mt-2 text-sm leading-relaxed">
              Votre compte doit être validé par notre équipe avant de pouvoir publier dans le fil.
              Vous recevrez un email dès validation.
            </p>
            <Link
              href="/mon-profil"
              className="mt-6 inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-brand-500 hover:bg-brand-600 text-white font-bold text-sm"
            >
              ← Retour à mon espace
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const [metiers, metierOptions] = await Promise.all([
    fetchAllMetiers(),
    getMetierOptions(),
  ]);

  return (
    <div className="bg-[#fafbfc] min-h-screen pb-16">
      {/* Header sticky minimal style LinkedIn modal */}
      <header className="sticky top-0 z-20 bg-white/85 backdrop-blur-xl border-b border-ink-100">
        <div className="container-default py-3 max-w-2xl flex items-center gap-3">
          <Link
            href="/fil"
            className="w-9 h-9 rounded-xl hover:bg-ink-100 text-ink-700 inline-flex items-center justify-center transition"
            aria-label="Retour au fil"
          >
            <ArrowLeft size={18} />
          </Link>
          <h1 className="text-base font-extrabold text-ink-700">Créer un post</h1>
        </div>
      </header>

      {/* Composer centré, modal-style */}
      <div className="container-default py-6 max-w-2xl">
        <FeedComposer
          userRole={user.role}
          userDisplayName={user.display_name || user.name}
          userAvatar={user.profile_photo}
          metierOptions={metierOptions}
          metiers={metiers.map((m) => ({ id: m.id, name: m.name, slug: m.slug }))}
          initialKind={initialKind}
        />

        {/* Footer info règles */}
        <p className="mt-4 text-center text-[0.72rem] text-ink-400 leading-relaxed">
          En publiant, vous acceptez les <strong className="text-ink-500">règles de la communauté</strong> :
          contenu lié aux travaux ou à l&apos;artisanat, respect des autres membres, pas de publicité.
        </p>
      </div>
    </div>
  );
}
