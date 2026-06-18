import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, MapPin } from "lucide-react";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { CoversGrid } from "./CoversGrid";

export const metadata: Metadata = {
  title: "Admin · Gérer les covers métiers",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

type MetierWithCover = {
  id: number;
  name: string;
  slug: string;
  category: string;
  icon: string | null;
  cover_url: string | null;
};

async function fetchAllMetiersWithCovers(): Promise<MetierWithCover[]> {
  const supabase = createSupabaseAdminClient();
  const { data } = await supabase
    .from("metiers")
    .select("id, name, slug, category, icon, cover_url")
    .order("category", { ascending: true })
    .order("name", { ascending: true });
  return (data ?? []) as MetierWithCover[];
}

export default async function AdminMetiersCoversPage() {
  const metiers = await fetchAllMetiersWithCovers();
  const withCover = metiers.filter((m) => m.cover_url).length;
  const withoutCover = metiers.length - withCover;

  return (
    <div className="bg-ink-50 min-h-screen">
      <div className="container-default py-10">
        <Link
          href="/admin"
          className="inline-flex items-center gap-1.5 text-sm text-ink-500 hover:text-brand-500 font-semibold transition"
        >
          <ArrowLeft size={14} /> Dashboard admin
        </Link>

        <div className="mt-4 flex items-start justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-3xl font-bold text-ink-700 tracking-tight flex items-center gap-2">
              <MapPin size={24} className="text-brand-500" /> Covers métiers
            </h1>
            <p className="text-ink-400 mt-2">
              Visualise toutes les couvertures actuelles. Clique sur &quot;Régénérer&quot; pour relancer
              la génération d&apos;un métier avec un seed aléatoire (sortira une image différente).
            </p>
          </div>

          <div className="flex gap-3 text-sm">
            <div className="bg-emerald-50 border border-emerald-200 px-4 py-2 rounded-xl">
              <div className="text-[0.65rem] text-emerald-700 font-bold uppercase">Avec cover</div>
              <div className="text-2xl font-bold text-emerald-700">{withCover}</div>
            </div>
            <div className="bg-amber-50 border border-amber-200 px-4 py-2 rounded-xl">
              <div className="text-[0.65rem] text-amber-700 font-bold uppercase">Sans cover</div>
              <div className="text-2xl font-bold text-amber-700">{withoutCover}</div>
            </div>
            <div className="bg-ink-100 border border-ink-200 px-4 py-2 rounded-xl">
              <div className="text-[0.65rem] text-ink-600 font-bold uppercase">Total</div>
              <div className="text-2xl font-bold text-ink-700">{metiers.length}</div>
            </div>
          </div>
        </div>

        <CoversGrid metiers={metiers} />
      </div>
    </div>
  );
}
