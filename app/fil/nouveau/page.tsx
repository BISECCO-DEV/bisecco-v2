import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, PenSquare, ShieldCheck } from "lucide-react";
import { requireUser } from "@/lib/db/current-user";
import { fetchAllMetiers } from "@/lib/db/metiers";
import { getMetierOptions } from "@/lib/db/metier-options";
import { FeedComposer } from "@/components/features/feed/FeedComposer";

export const metadata: Metadata = {
  title: "Nouvelle publication · Fil Bisecco",
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
      <div className="bg-[#f4f5f9] min-h-screen py-16">
        <div className="container-default max-w-md text-center">
          <div className="bg-white rounded-3xl border border-ink-100 p-10">
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
    <div className="bg-[#f4f5f9] min-h-screen pb-16">
      <div className="container-default py-6 max-w-6xl">
        {/* Breadcrumb */}
        <Link
          href="/fil"
          className="inline-flex items-center gap-1.5 text-sm text-ink-500 hover:text-brand-500 font-semibold transition"
        >
          <ArrowLeft size={14} /> Retour au fil
        </Link>

        {/* Header */}
        <header className="mt-5 mb-6 flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-brand-500 to-brand-600 text-white flex items-center justify-center flex-shrink-0 shadow-[0_8px_20px_-4px_rgba(240,122,47,0.45)]">
            <PenSquare size={20} />
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="text-2xl sm:text-[1.7rem] font-extrabold text-ink-700 tracking-tight leading-tight">
              Nouvelle publication
            </h1>
            <p className="text-ink-500 text-sm mt-1 leading-relaxed">
              Partagez avec la communauté Bisecco · publication immédiate.
              Visualisez le rendu final en temps réel sur la droite.
            </p>
          </div>
        </header>

        {/* Composer + Preview */}
        <FeedComposer
          userRole={user.role}
          userDisplayName={user.display_name || user.name}
          userAvatar={user.profile_photo}
          metierOptions={metierOptions}
          metiers={metiers.map((m) => ({ id: m.id, name: m.name, slug: m.slug }))}
          initialKind={initialKind}
        />
      </div>
    </div>
  );
}
