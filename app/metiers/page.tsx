import type { Metadata } from "next";
import { Briefcase } from "lucide-react";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { MetiersDirectory, type MetierWithCount } from "./MetiersDirectory";
import { JsonLd } from "@/components/ui/JsonLd";

export const metadata: Metadata = {
  title: "Tous les métiers artisanaux · Spécialités vérifiées SIREN",
  description:
    "Plombier, électricien, maçon, menuisier, peintre, couvreur, boulanger, fromager… Découvrez tous les métiers du réseau Bisecco. Trouvez un artisan vérifié SIREN près de chez vous.",
};

export const dynamic = "force-dynamic";

async function fetchMetiersWithCounts(): Promise<MetierWithCount[]> {
  const supabase = createSupabaseAdminClient();

  // 1. Récupère tous les métiers
  const { data: metiers } = await supabase
    .from("metiers")
    .select("id, name, slug, category, icon, description")
    .order("name", { ascending: true });

  if (!metiers) return [];

  // 2. Récupère le nombre d'artisans par métier via la table pivot
  const { data: pivots } = await supabase
    .from("artisan_profile_metier")
    .select("metier_id");

  const counts = new Map<number, number>();
  for (const p of pivots ?? []) {
    counts.set(p.metier_id, (counts.get(p.metier_id) ?? 0) + 1);
  }

  return metiers.map((m) => ({
    ...m,
    artisanCount: counts.get(m.id) ?? 0,
  }));
}

export default async function MetiersPage() {
  const metiers = await fetchMetiersWithCounts();

  // JSON-LD : ItemList pour SEO
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Métiers artisanaux Bisecco",
    description: `${metiers.length} métiers artisanaux vérifiés sur Bisecco`,
    numberOfItems: metiers.length,
    itemListElement: metiers.slice(0, 50).map((m, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: m.name,
      url: `https://bisecco.fr/metiers/${m.slug}`,
    })),
  };

  return (
    <>
      <JsonLd data={jsonLd} />

      <main className="bg-ink-50 min-h-screen pb-16">
        {/* ═════════ HERO ═════════ */}
        <section className="relative bg-gradient-to-br from-ink-900 via-ink-800 to-ink-900 text-white overflow-hidden">
          <div className="absolute top-0 left-1/4 w-[600px] h-[400px] rounded-full bg-brand-500/15 blur-[140px] pointer-events-none" />
          <div className="absolute bottom-0 right-1/4 w-[500px] h-[400px] rounded-full bg-blue-500/15 blur-[140px] pointer-events-none" />

          <div className="container-default relative pt-20 pb-48 text-center">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-500/15 border border-brand-500/30 text-brand-400 text-[0.72rem] font-extrabold tracking-[0.14em] uppercase">
              <Briefcase size={11} strokeWidth={2.8} />
              Annuaire des métiers
            </span>

            <h1 className="mt-6 text-[36px] sm:text-[52px] lg:text-[64px] leading-[1.05] font-extrabold tracking-[-0.025em]">
              <span className="text-brand-500">
                {metiers.length}
              </span>{" "}
              métiers artisanaux
              <br />
              <span className="text-white/85 text-[28px] sm:text-[36px] lg:text-[44px] font-bold">
                à portée de clic.
              </span>
            </h1>

            <p className="mt-6 text-[1rem] sm:text-[1.1rem] text-white/70 max-w-2xl mx-auto leading-[1.6]">
              De l&apos;<strong className="text-white">apiculteur</strong> au{" "}
              <strong className="text-white">vitrailliste</strong>, en passant par le{" "}
              <strong className="text-white">plombier</strong>,{" "}
              <strong className="text-white">électricien</strong> ou{" "}
              <strong className="text-white">boulanger</strong> · Bisecco référence{" "}
              <strong className="text-white">tous les métiers artisanaux français</strong> vérifiés SIREN.
            </p>
          </div>
        </section>

        {/* ═════════ DIRECTORY (stats + recherche + grille) ═════════ */}
        <MetiersDirectory metiers={metiers} />
      </main>
    </>
  );
}
