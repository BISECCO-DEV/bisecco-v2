import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { requireUser } from "@/lib/db/current-user";
import { fetchMyCv } from "@/lib/db/cv";
import { fetchAllMetiers } from "@/lib/db/metiers";
import { CVEditor } from "./CVEditor";

export const metadata: Metadata = {
  title: "Mon CV · Mon profil",
  description: "Créez ou modifiez votre CV Bisecco pour le déposer directement chez les professionnels qui vous intéressent.",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

type SearchParams = Promise<{
  saved?: string;
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

        <div className="mt-5">
          <h1 className="text-3xl font-bold text-ink-700 tracking-tight">
            Mon <span className="text-brand-500">CV</span>
          </h1>
          <p className="text-ink-400 mt-2 max-w-2xl">
            Créez votre CV professionnel et déposez-le directement chez les professionnels
            qui vous intéressent depuis leur fiche.
          </p>
        </div>

        {/* Feedback bandeaux */}
        {params.saved && (
          <div className="mt-5 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl px-4 py-3 text-sm font-semibold">
            ✓ CV sauvegardé avec succès.
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
