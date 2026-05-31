import { Hammer, Users, ShieldCheck, MapPin } from "lucide-react";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

type CommunityCounts = {
  artisans: number;
  particuliers: number;
  villes: number;
};

async function fetchCommunityCounts(): Promise<CommunityCounts> {
  const supabase = createSupabaseAdminClient();

  const [artisansRes, particuliersRes, villesRes] = await Promise.all([
    supabase
      .from("users")
      .select("id", { count: "exact", head: true })
      .eq("role", "artisan")
      .eq("validation_status", "approved")
      .is("deleted_at", null),
    supabase
      .from("users")
      .select("id", { count: "exact", head: true })
      .eq("role", "particulier")
      .eq("validation_status", "approved")
      .is("deleted_at", null),
    supabase
      .from("users")
      .select("city")
      .eq("validation_status", "approved")
      .is("deleted_at", null)
      .not("city", "is", null),
  ]);

  const villesSet = new Set<string>();
  for (const row of (villesRes.data ?? []) as { city: string | null }[]) {
    if (row.city) villesSet.add(row.city.trim().toLowerCase());
  }

  return {
    artisans: artisansRes.count ?? 0,
    particuliers: particuliersRes.count ?? 0,
    villes: villesSet.size,
  };
}

function formatCount(n: number): string {
  if (n >= 1000) return `${(n / 1000).toFixed(n >= 10000 ? 0 : 1)}k`;
  return n.toLocaleString("fr-FR");
}

export async function HomeCommunityStats() {
  const { artisans, particuliers, villes } = await fetchCommunityCounts();
  const total = artisans + particuliers;

  const stats = [
    {
      icon: Hammer,
      value: artisans,
      label: artisans > 1 ? "artisans inscrits" : "artisan inscrit",
      sub: "Profils vérifiés SIREN",
      gradient: "from-brand-500 to-brand-600",
      ring: "ring-brand-200",
    },
    {
      icon: Users,
      value: particuliers,
      label: particuliers > 1 ? "particuliers actifs" : "particulier actif",
      sub: "À la recherche d'un pro",
      gradient: "from-blue-500 to-blue-700",
      ring: "ring-blue-200",
    },
    {
      icon: MapPin,
      value: villes,
      label: villes > 1 ? "villes couvertes" : "ville couverte",
      sub: "Partout en France",
      gradient: "from-emerald-500 to-emerald-700",
      ring: "ring-emerald-200",
    },
  ];

  return (
    <section className="relative bg-white py-12 sm:py-16 border-b border-ink-100">
      <div className="container-default">
        {/* Head */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-[0.7rem] font-bold tracking-[0.14em] uppercase">
            <span className="relative inline-flex w-2 h-2">
              <span className="absolute inset-0 rounded-full bg-emerald-500 animate-ping opacity-75" />
              <span className="relative w-2 h-2 rounded-full bg-emerald-500" />
            </span>
            La communauté en direct
          </span>
          <h2 className="mt-4 text-[32px] lg:text-[38px] leading-[1.25] font-semibold text-ink-700 tracking-[-0.025em]">
            {total > 0 ? (
              <>
                Déjà <span className="text-brand-500">{formatCount(total)}</span> membres
                {" "}sur Bisecco
              </>
            ) : (
              <>Une communauté qui grandit chaque jour</>
            )}
          </h2>
          <p className="mt-3 text-[0.94rem] text-ink-500 leading-relaxed">
            Chiffres mis à jour en temps réel · particuliers et artisans réunis dans un seul réseau.
          </p>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5 max-w-4xl mx-auto">
          {stats.map((s) => {
            const Icon = s.icon;
            return (
              <div
                key={s.label}
                className="relative group bg-white rounded-2xl border border-ink-100 p-6 hover:border-brand-300 hover:-translate-y-1 hover:shadow-[0_20px_40px_-15px_rgba(13,30,74,0.18)] transition-all"
              >
                <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br ${s.gradient} text-white shadow-[0_8px_20px_-4px_rgba(0,0,0,0.18),inset_0_1px_0_rgba(255,255,255,0.25)] mb-4`}>
                  <Icon size={20} strokeWidth={2.2} />
                </div>
                <div className="flex items-baseline gap-1.5">
                  <span className="text-[2.4rem] sm:text-[2.7rem] font-extrabold text-ink-700 leading-none tracking-tight tabular-nums">
                    {formatCount(s.value)}
                  </span>
                </div>
                <div className="mt-1.5 text-[0.92rem] font-bold text-ink-700">
                  {s.label}
                </div>
                <div className="mt-0.5 text-[0.78rem] text-ink-500 leading-snug">
                  {s.sub}
                </div>
              </div>
            );
          })}
        </div>

        {/* Trust line */}
        <div className="mt-8 flex items-center justify-center gap-2 text-[0.78rem] text-ink-500">
          <ShieldCheck size={13} className="text-emerald-500" />
          <span>Tous les comptes sont validés manuellement par notre équipe</span>
        </div>
      </div>
    </section>
  );
}
