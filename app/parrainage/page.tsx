import type { Metadata } from "next";
import { ParrainageClient } from "./ParrainageClient";
import { Gift, Users, Sparkles, Award, Share2 } from "lucide-react";
import { getCurrentDbUser } from "@/lib/auth/current-user";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

export const metadata: Metadata = {
  title: "Programme de parrainage",
  description: "Invitez vos proches et vos professionnels à vous rejoindre sur bisecco.fr · le 1er réseau social de professionnels français vérifiés SIREN.",
  alternates: { canonical: "/parrainage" },
};

export const dynamic = "force-dynamic";

export default async function ParrainagePage() {
  const me = await getCurrentDbUser();
  let referralCode: string | null = null;
  let stats = { validated: 0, signed_up: 0 };

  if (me) {
    const admin = createSupabaseAdminClient();
    // Récupère le code (ou le génère côté DB normalement)
    const { data: userRow } = await admin
      .from("users")
      .select("referral_code")
      .eq("id", me.id)
      .maybeSingle();
    referralCode = (userRow?.referral_code as string | null) ?? null;

    const [{ count: validated }, { count: signed_up }] = await Promise.all([
      admin.from("referrals").select("*", { count: "exact", head: true })
        .eq("referrer_user_id", me.id).eq("status", "validated"),
      admin.from("referrals").select("*", { count: "exact", head: true })
        .eq("referrer_user_id", me.id).eq("status", "signed_up"),
    ]);
    stats = { validated: validated ?? 0, signed_up: signed_up ?? 0 };
  }
  return (
    <div className="bg-ink-50 min-h-screen pb-16">
      <section className="bg-gradient-to-br from-ink-800 via-ink-700 to-ink-800 text-white py-16 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[400px] rounded-full bg-brand-500/20 blur-[140px]" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[300px] rounded-full bg-blue-500/10 blur-[100px]" />

        <div className="container-default text-center relative">
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/15 border border-brand-500/30 text-brand-400 text-[0.65rem] font-bold tracking-[0.14em] uppercase">
            <Gift size={11} /> Programme de parrainage
          </span>
          <h1 className="text-3xl md:text-[2.8rem] font-bold mt-4 tracking-[-0.02em] leading-[1.05]">
            Invitez vos proches<br />
            <span className="text-brand-500">
              et vos professionnels
            </span>
            <br />à vous rejoindre sur bisecco.fr
          </h1>
        </div>
      </section>

      <div className="container-default -mt-12 relative">
        <ParrainageClient referralCode={referralCode} stats={stats} signedIn={!!me} />

        {/* How it works */}
        <section className="mt-12">
          <h2 className="text-xl font-bold text-ink-700 tracking-tight mb-5 text-center">Comment ça marche ?</h2>
          <div className="grid md:grid-cols-3 gap-4">
            {[
              { num: "01", icon: Share2,   title: "Partagez votre lien", text: "Envoyez votre lien unique à vos amis par email, SMS, WhatsApp, ou réseaux sociaux." },
              { num: "02", icon: Users,    title: "Vos amis s'inscrivent", text: "Quand quelqu'un crée son compte via votre lien, le parrainage est validé automatiquement." },
              { num: "03", icon: Award,    title: "Vous gagnez 5€",       text: "Crédités sur votre compte dès qu'ils complètent leur profil. Récupérables en virement ou crédit." },
            ].map((s) => (
              <div key={s.num} className="bg-white rounded-2xl p-6 border border-ink-100 relative">
                <span className="absolute top-4 right-4 text-3xl font-bold text-ink-100">{s.num}</span>
                <div className="w-11 h-11 rounded-xl bg-brand-50 flex items-center justify-center mb-4">
                  <s.icon size={20} className="text-brand-500" />
                </div>
                <h3 className="font-bold text-ink-700">{s.title}</h3>
                <p className="text-sm text-ink-500 mt-2 leading-relaxed">{s.text}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Pour les artisans */}
        <section className="mt-12 bg-gradient-to-br from-ink-800 to-ink-700 rounded-3xl p-8 md:p-10 text-white relative overflow-hidden">
          <div className="absolute -top-12 -right-12 w-60 h-60 rounded-full bg-brand-500/20 blur-3xl" />
          <div className="relative grid md:grid-cols-[1fr_auto] gap-6 items-center">
            <div>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-brand-500/20 border border-brand-500/40 text-brand-400 text-[0.65rem] font-bold tracking-wider uppercase mb-3">
                <Sparkles size={10} /> Bonus professionnel
              </span>
              <h2 className="text-2xl md:text-3xl font-bold tracking-tight leading-tight">
                Vous êtes professionnel ?<br />
                <span className="text-brand-400">1 mois Pro offert</span> par parrainage.
              </h2>
              <p className="text-white/65 mt-3 max-w-md">
                Chaque professionnel parrainé qui s&apos;inscrit vous offre <strong className="text-white">1 mois gratuit</strong> sur votre abonnement Pro (19€/mois).
              </p>
            </div>
            <button className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white text-ink-700 font-bold hover:bg-brand-500 hover:text-white transition shadow-card flex-shrink-0">
              Activer le bonus
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}
