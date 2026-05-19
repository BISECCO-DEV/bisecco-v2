import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Globe, EyeOff } from "lucide-react";
import { requireUser } from "@/lib/db/current-user";
import { fetchMyCv } from "@/lib/db/cv";
import { fetchAllMetiers } from "@/lib/db/metiers";
import { CVEditor } from "./CVEditor";

export const metadata: Metadata = {
  title: "Mon CV — Mon profil",
  description: "Créez ou modifiez votre CV Bisecco pour postuler aux offres d'emploi dans l'artisanat.",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

type SearchParams = Promise<{
  saved?: string;
  published?: string;
  unpublished?: string;
  error?: string;
}>;

export default async function MonCVPage({ searchParams }: { searchParams: SearchParams }) {
  const user = await requireUser();
  const params = await searchParams;

  if (!user.id) {
    return (
      <div className="container-default py-20 text-center">
        <p>Compte non trouvé.</p>
      </div>
    );
  }

  const [cv, metiers] = await Promise.all([
    fetchMyCv(user.id),
    fetchAllMetiers(),
  ]);

  return (
    <div className="bg-ink-50 min-h-screen pb-16">
      <div className="container-default py-10">
        <Link href="/mon-profil" className="inline-flex items-center gap-1.5 text-sm text-ink-500 hover:text-brand-500 font-semibold transition">
          <ArrowLeft size={14} /> Mon profil
        </Link>

        <div className="mt-5 flex items-start justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-3xl font-bold text-ink-700 tracking-tight">
              Mon <span className="text-brand-500">CV</span>
            </h1>
            <p className="text-ink-400 mt-2 max-w-2xl">
              Créez votre CV professionnel et publiez-le dans la <strong className="text-ink-700">Banque de CV Bisecco</strong>.
              Visible uniquement par les artisans/recruteurs vérifiés SIREN.
            </p>
          </div>
          <div className="flex gap-2">
            {cv?.cv_published ? (
              <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm font-bold">
                <Globe size={14} /> CV publié
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-ink-100 border border-ink-200 text-ink-600 text-sm font-bold">
                <EyeOff size={14} /> Non publié
              </span>
            )}
          </div>
        </div>

        {/* Feedback bandeaux */}
        {params.saved && (
          <div className="mt-5 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl px-4 py-3 text-sm font-semibold">
            ✓ CV sauvegardé avec succès.
          </div>
        )}
        {params.published && (
          <div className="mt-5 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl px-4 py-3 text-sm font-semibold">
            🎉 Ton CV est maintenant visible dans la Banque de CV par les recruteurs Bisecco.
          </div>
        )}
        {params.unpublished && (
          <div className="mt-5 bg-amber-50 border border-amber-200 text-amber-800 rounded-xl px-4 py-3 text-sm font-semibold">
            Ton CV a été retiré de la banque (il reste enregistré mais privé).
          </div>
        )}
        {params.error && (
          <div className="mt-5 bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm font-semibold">
            ⚠ Erreur : {params.error}
          </div>
        )}

        <CVEditor initialCv={cv} metiers={metiers} />
      </div>
    </div>
  );
}
