import Link from "next/link";
import { Gift, TrendingUp, Users, CheckCircle2, Clock } from "lucide-react";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";

type ReferralRow = {
  id: number;
  referral_code: string;
  channel: string | null;
  status: "pending" | "signed_up" | "validated";
  created_at: string;
  signed_up_at: string | null;
  validated_at: string | null;
  referrer: { id: number; name: string; client_number: string | null } | null;
  referred_user: { id: number; name: string; email: string } | null;
};

async function fetchReferrals() {
  const supabase = createSupabaseAdminClient();
  const { data } = await supabase
    .from("referrals")
    .select(
      `id, referral_code, channel, status, created_at, signed_up_at, validated_at,
       referrer:referrer_id (id, name, client_number),
       referred_user:referred_user_id (id, name, email)`,
    )
    .order("created_at", { ascending: false })
    .limit(200);
  return (data ?? []) as unknown as ReferralRow[];
}

async function fetchTopReferrers() {
  const supabase = createSupabaseAdminClient();
  // Récupère tous les referrals avec leur referrer
  const { data } = await supabase
    .from("referrals")
    .select(
      `referrer_id, status, referrer:referrer_id (id, name, client_number, referral_code)`,
    )
    .limit(5000);

  // Group côté Node
  type R = { referrer_id: number; status: string; referrer: { id: number; name: string; client_number: string | null; referral_code: string | null } | null };
  const map = new Map<number, { name: string; client_number: string | null; referral_code: string | null; clicks: number; signed_up: number; validated: number }>();
  for (const r of ((data ?? []) as unknown as R[])) {
    if (!r.referrer) continue;
    const entry = map.get(r.referrer_id) ?? {
      name: r.referrer.name,
      client_number: r.referrer.client_number,
      referral_code: r.referrer.referral_code,
      clicks: 0,
      signed_up: 0,
      validated: 0,
    };
    entry.clicks += 1;
    if (r.status === "signed_up") entry.signed_up += 1;
    if (r.status === "validated") entry.validated += 1;
    map.set(r.referrer_id, entry);
  }

  return Array.from(map.entries())
    .map(([id, v]) => ({ id, ...v }))
    .sort((a, b) => b.validated - a.validated || b.signed_up - a.signed_up || b.clicks - a.clicks)
    .slice(0, 10);
}

function StatusBadge({ status }: { status: string }) {
  if (status === "validated")
    return <span className="px-2 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-[0.65rem] font-bold uppercase tracking-wider">Validé</span>;
  if (status === "signed_up")
    return <span className="px-2 py-0.5 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-[0.65rem] font-bold uppercase tracking-wider">Inscrit</span>;
  return <span className="px-2 py-0.5 rounded-full bg-ink-100 text-ink-600 text-[0.65rem] font-bold uppercase tracking-wider">Click</span>;
}

export default async function AdminParrainagesPage() {
  const [referrals, topReferrers] = await Promise.all([fetchReferrals(), fetchTopReferrers()]);

  const totalClicks = referrals.length;
  const totalSignedUp = referrals.filter((r) => r.status === "signed_up").length;
  const totalValidated = referrals.filter((r) => r.status === "validated").length;
  const conversionRate = totalClicks > 0 ? Math.round(((totalSignedUp + totalValidated) / totalClicks) * 100) : 0;

  return (
    <div className="space-y-6 max-w-7xl">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-ink-700 tracking-tight flex items-center gap-2">
          <Gift size={26} /> Parrainages
        </h1>
        <p className="text-ink-500 text-sm mt-1">
          Suivre la performance du programme de parrainage.
        </p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <StatBox icon={Users} label="Clicks totaux" value={totalClicks} color="from-blue-500 to-blue-700" />
        <StatBox icon={Clock} label="Inscrits" value={totalSignedUp} color="from-amber-500 to-orange-600" />
        <StatBox icon={CheckCircle2} label="Validés" value={totalValidated} color="from-emerald-500 to-emerald-700" />
        <StatBox icon={TrendingUp} label="Conversion" value={`${conversionRate}%`} color="from-brand-500 to-brand-600" />
      </div>

      <div className="grid lg:grid-cols-[1fr_360px] gap-6">
        {/* Liste référrals */}
        <section className="bg-white rounded-2xl border border-ink-100 overflow-hidden">
          <div className="px-5 py-4 border-b border-ink-100">
            <h2 className="font-extrabold text-ink-700">Activité récente</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-ink-50 text-ink-500 uppercase text-[0.66rem] tracking-wider">
                <tr>
                  <th className="text-left px-4 py-2 font-bold">Parrain</th>
                  <th className="text-left px-4 py-2 font-bold">Filleul</th>
                  <th className="text-left px-4 py-2 font-bold">Code</th>
                  <th className="text-left px-4 py-2 font-bold">Canal</th>
                  <th className="text-left px-4 py-2 font-bold">Statut</th>
                  <th className="text-left px-4 py-2 font-bold">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ink-100">
                {referrals.length === 0 ? (
                  <tr><td colSpan={6} className="text-center py-10 text-ink-400">Aucun parrainage pour l&apos;instant</td></tr>
                ) : (
                  referrals.map((r) => (
                    <tr key={r.id} className="hover:bg-ink-50/50">
                      <td className="px-4 py-2">
                        {r.referrer ? (
                          <Link href={`/admin/utilisateurs/${r.referrer.id}`} className="text-ink-700 font-bold hover:text-brand-600 text-xs">
                            {r.referrer.name}
                          </Link>
                        ) : <span className="text-ink-300">·</span>}
                      </td>
                      <td className="px-4 py-2">
                        {r.referred_user ? (
                          <Link href={`/admin/utilisateurs/${r.referred_user.id}`} className="text-ink-700 font-semibold hover:text-brand-600 text-xs">
                            {r.referred_user.name}
                          </Link>
                        ) : <span className="text-ink-300 text-xs">Anonyme</span>}
                      </td>
                      <td className="px-4 py-2"><span className="font-mono text-xs text-ink-600">{r.referral_code}</span></td>
                      <td className="px-4 py-2"><span className="text-[0.66rem] text-ink-500">{r.channel ?? "·"}</span></td>
                      <td className="px-4 py-2"><StatusBadge status={r.status} /></td>
                      <td className="px-4 py-2 text-[0.7rem] text-ink-500">
                        {new Date(r.created_at).toLocaleDateString("fr-FR")}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>

        {/* Top parrains */}
        <aside className="bg-white rounded-2xl border border-ink-100 p-5 h-fit">
          <h2 className="font-extrabold text-ink-700 mb-4 text-sm uppercase tracking-wider">Top parrains</h2>
          {topReferrers.length === 0 ? (
            <p className="text-ink-400 text-sm">Aucun parrain pour l&apos;instant.</p>
          ) : (
            <div className="space-y-2">
              {topReferrers.map((t, i) => (
                <Link
                  key={t.id}
                  href={`/admin/utilisateurs/${t.id}`}
                  className="flex items-center gap-3 p-2 rounded-lg hover:bg-ink-50 transition"
                >
                  <span className="font-extrabold text-ink-300 text-xs w-5 text-center">#{i + 1}</span>
                  <div className="flex-1 min-w-0">
                    <div className="font-bold text-ink-700 text-xs truncate">{t.name}</div>
                    <div className="text-[0.66rem] text-ink-400 font-mono truncate">{t.referral_code}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-emerald-600 text-sm">{t.validated}</div>
                    <div className="text-[0.6rem] text-ink-400 uppercase">validés</div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}

function StatBox({
  icon: Icon, label, value, color,
}: {
  icon: React.ComponentType<{ size?: number; className?: string }>;
  label: string;
  value: string | number;
  color: string;
}) {
  return (
    <div className="bg-white rounded-2xl p-4 sm:p-5 border border-ink-100">
      <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center mb-3`}>
        <Icon size={18} className="text-white" />
      </div>
      <div className="text-2xl sm:text-3xl font-extrabold text-ink-700 leading-tight">{value}</div>
      <div className="text-xs text-ink-500 font-semibold mt-1">{label}</div>
    </div>
  );
}
