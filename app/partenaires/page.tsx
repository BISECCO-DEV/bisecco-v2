import type { Metadata } from "next";
import Link from "next/link";
import {
  Users, ShieldCheck, TrendingUp, Sparkles, MessageCircle, Star,
  CheckCircle2, ArrowRight, Briefcase, MapPin, Award, Building2,
  Zap, Lock, Gift, Quote, KeyRound,
} from "lucide-react";
import type { CurrentUser } from "@/lib/db/current-user";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { getCurrentUser } from "@/lib/db/current-user";

export const metadata: Metadata = {
  title: "Devenir Partenaire · Bisecco Pro",
  description:
    "Rejoignez le 1er réseau social d'artisans français vérifiés SIREN. 100% gratuit, 0% commission, contact direct avec les clients. Inscription en 2 minutes.",
  openGraph: {
    title: "Devenez partenaire Bisecco · 0% commission",
    description: "Réseau d'artisans vérifiés SIREN. Inscription gratuite, contact direct.",
  },
};

export const dynamic = "force-dynamic";

async function fetchHomeStats() {
  const supabase = createSupabaseAdminClient();
  const [{ count: artisans }, { count: metiers }, citiesRes] = await Promise.all([
    supabase
      .from("users")
      .select("*", { count: "exact", head: true })
      .eq("role", "artisan")
      .eq("validation_status", "approved")
      .is("deleted_at", null),
    supabase.from("metiers").select("*", { count: "exact", head: true }),
    supabase
      .from("users")
      .select("city")
      .eq("role", "artisan")
      .eq("validation_status", "approved")
      .is("deleted_at", null)
      .not("city", "is", null),
  ]);

  const uniqueCities = new Set(
    (citiesRes.data ?? [])
      .map((u) => (u.city ?? "").replace(/^\d+\s*/, "").toLowerCase().trim())
      .filter(Boolean),
  );

  return {
    artisans: artisans ?? 0,
    metiers: metiers ?? 0,
    cities: uniqueCities.size,
  };
}

async function fetchFeaturedArtisans() {
  const supabase = createSupabaseAdminClient();
  const { data } = await supabase
    .from("users")
    .select(
      `id, client_number, name, city, profile_photo, cover_photo, description,
       artisan_profiles!inner (company_name, metiers (name, icon))`,
    )
    .eq("role", "artisan")
    .eq("validation_status", "approved")
    .is("deleted_at", null)
    .eq("artisan_profiles.is_active", true)
    .limit(6);

  type Row = {
    id: number;
    client_number: string | null;
    name: string;
    city: string | null;
    profile_photo: string | null;
    cover_photo: string | null;
    description: string | null;
    artisan_profiles: Array<{
      company_name: string | null;
      metiers: { name: string; icon: string | null } | null;
    }>;
  };

  return ((data ?? []) as unknown as Row[]).map((r) => ({
    id: r.id,
    clientNumber: r.client_number,
    name: r.artisan_profiles[0]?.company_name ?? r.name,
    person: r.name,
    city: r.city?.replace(/^\d+\s*/, "") ?? "France",
    metier: r.artisan_profiles[0]?.metiers?.name ?? "Artisan",
    icon: r.artisan_profiles[0]?.metiers?.icon ?? "🛠️",
    profilePhoto: r.profile_photo
      ? r.profile_photo.startsWith("http")
        ? r.profile_photo
        : `https://bisecco.fr/storage/${r.profile_photo}`
      : null,
    coverPhoto: r.cover_photo
      ? r.cover_photo.startsWith("http")
        ? r.cover_photo
        : `https://bisecco.fr/storage/${r.cover_photo}`
      : null,
    description: r.description,
  }));
}

export default async function PartenairesPage() {
  const user = await getCurrentUser();
  const isArtisan = user?.role === "artisan";
  const isAdmin = user?.role === "admin";

  // ── Mode "gated" : visiteurs anonymes + particuliers ──
  if (!isArtisan && !isAdmin) {
    return <GatedPartenaires user={user} />;
  }

  const [stats, featured] = await Promise.all([
    fetchHomeStats(),
    fetchFeaturedArtisans(),
  ]);
  const isArtisanConnecte = isArtisan;

  return (
    <main className="bg-ink-50">
      {/* ═════════ HERO ═════════ */}
      <section className="relative bg-gradient-to-br from-ink-900 via-ink-800 to-ink-900 text-white overflow-hidden">
        <div className="absolute top-0 left-1/4 w-[600px] h-[400px] rounded-full bg-brand-500/15 blur-[140px] pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-[500px] h-[400px] rounded-full bg-blue-500/15 blur-[140px] pointer-events-none" />

        <div className="container-default relative pt-24 pb-20 sm:pt-28 sm:pb-28">
          <div className="grid lg:grid-cols-[1.2fr_1fr] gap-12 items-center">
            <div>
              <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-500/15 border border-brand-500/30 text-brand-400 text-[0.72rem] font-extrabold tracking-[0.14em] uppercase">
                <Sparkles size={11} strokeWidth={2.8} />
                Partenariat Pro
              </span>

              <h1 className="mt-6 text-[36px] sm:text-[48px] lg:text-[60px] leading-[1.05] font-extrabold tracking-[-0.025em]">
                Le seul réseau qui ne prend
                <br />
                <span className="text-brand-500">
                  jamais de commission
                </span>
                <span className="text-brand-500">.</span>
              </h1>

              <p className="mt-6 text-[1rem] sm:text-[1.1rem] text-white/75 leading-[1.6] max-w-xl">
                Rejoignez les artisans français qui privilégient le{" "}
                <strong className="text-white">contact direct</strong> avec leurs clients.
                <strong className="text-white"> 0 € à l&apos;inscription</strong>,{" "}
                <strong className="text-white">aucun frais caché</strong>, SIREN vérifié par l&apos;État.
              </p>

              {/* Trust pills */}
              <div className="flex flex-wrap gap-2 mt-6">
                {[
                  { icon: Sparkles, label: "100 % gratuit" },
                  { icon: ShieldCheck, label: "SIREN vérifié" },
                  { icon: MessageCircle, label: "Contact direct" },
                  { icon: Zap, label: "Inscription en 2 min" },
                ].map((c) => (
                  <span
                    key={c.label}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/[0.06] border border-white/[0.10] text-[0.8rem] font-semibold text-white/85 backdrop-blur-sm"
                  >
                    <span className="w-5 h-5 rounded-full bg-brand-500/20 text-brand-400 flex items-center justify-center">
                      <c.icon size={11} strokeWidth={2.8} />
                    </span>
                    {c.label}
                  </span>
                ))}
              </div>

              {/* CTAs */}
              <div className="flex flex-wrap gap-3 mt-8">
                {isArtisanConnecte ? (
                  <Link
                    href="/mon-profil"
                    className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl bg-gradient-to-br from-brand-500 to-brand-600 text-white font-bold shadow-[0_10px_30px_-8px_rgba(240,122,47,0.55)] hover:-translate-y-0.5 transition"
                  >
                    Accéder à mon espace pro <ArrowRight size={16} />
                  </Link>
                ) : (
                  <>
                    <Link
                      href="/inscription"
                      className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl bg-gradient-to-br from-brand-500 to-brand-600 text-white font-bold shadow-[0_10px_30px_-8px_rgba(240,122,47,0.55)] hover:-translate-y-0.5 transition"
                    >
                      Créer mon profil gratuit <ArrowRight size={16} />
                    </Link>
                    <Link
                      href="/connexion"
                      className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl bg-white/[0.08] border border-white/[0.18] text-white font-bold hover:bg-white/[0.14] backdrop-blur-md transition"
                    >
                      J&apos;ai déjà un compte
                    </Link>
                  </>
                )}
              </div>

              <p className="mt-4 text-xs text-white/45 inline-flex items-center gap-1.5">
                <Lock size={11} /> Aucun engagement · Aucune carte bancaire requise
              </p>
            </div>

            {/* Stats card */}
            <div className="grid grid-cols-2 gap-3 lg:gap-4">
              {[
                { value: stats.artisans, label: "Artisans vérifiés", icon: ShieldCheck, color: "from-brand-500 to-brand-600" },
                { value: stats.metiers, label: "Métiers couverts", icon: Briefcase, color: "from-blue-500 to-blue-600" },
                { value: stats.cities, label: "Villes actives", icon: MapPin, color: "from-emerald-500 to-emerald-600" },
                { value: "0 %", label: "Commission prélevée", icon: Award, color: "from-purple-500 to-pink-500", isString: true },
              ].map((s) => (
                <div
                  key={s.label}
                  className="bg-white/[0.04] border border-white/[0.10] backdrop-blur-md rounded-2xl p-5 hover:bg-white/[0.07] hover:border-white/[0.18] transition"
                >
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${s.color} flex items-center justify-center mb-3 shadow-[0_4px_14px_rgba(0,0,0,0.4)]`}>
                    <s.icon size={18} className="text-white" />
                  </div>
                  <div className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
                    {s.isString ? s.value : (s.value as number)}
                  </div>
                  <div className="text-[0.78rem] text-white/55 mt-1">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═════════ POURQUOI BISECCO ═════════ */}
      <section className="py-20 sm:py-24 bg-white">
        <div className="container-default">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-50 border border-brand-200 text-brand-700 text-[0.7rem] font-bold tracking-[0.14em] uppercase">
              <Star size={11} strokeWidth={2.8} />
              Pourquoi Bisecco
            </span>
            <h2 className="mt-4 text-[28px] sm:text-[40px] font-extrabold text-ink-700 tracking-[-0.025em] leading-[1.1]">
              Tout pour réussir,
              <br />
              <span className="text-brand-500">rien pour vous freiner</span>
            </h2>
            <p className="mt-4 text-ink-500 leading-relaxed">
              Là où d&apos;autres plateformes prennent une commission de 5 à 25 %, Bisecco reste
              <strong className="text-ink-700"> 100 % gratuit pour les artisans</strong>.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              {
                icon: Award,
                title: "0 % de commission, jamais",
                text: "Vous gardez 100 % de vos revenus. Aucune ponction sur les chantiers signés via Bisecco.",
                color: "from-emerald-500 to-emerald-700",
                bg: "bg-emerald-50",
                border: "border-emerald-200",
              },
              {
                icon: MessageCircle,
                title: "Contact direct sans intermédiaire",
                text: "Vos clients vous écrivent directement via la messagerie sécurisée. Pas de paywall, pas de leads vendus en gros.",
                color: "from-brand-500 to-brand-600",
                bg: "bg-brand-50",
                border: "border-brand-200",
              },
              {
                icon: ShieldCheck,
                title: "SIREN vérifié = confiance client",
                text: "Votre identité est contrôlée via l'API officielle gouv.fr. Les particuliers savent qu'ils traitent avec un vrai pro.",
                color: "from-blue-500 to-blue-700",
                bg: "bg-blue-50",
                border: "border-blue-200",
              },
              {
                icon: TrendingUp,
                title: "Référencement local automatique",
                text: "Votre profil est indexé sur Google pour vos métiers et villes d'intervention. Plus de visibilité, sans payer.",
                color: "from-purple-500 to-pink-500",
                bg: "bg-purple-50",
                border: "border-purple-200",
              },
              {
                icon: Star,
                title: "Avis 100 % authentiques",
                text: "Seuls les clients qui ont vraiment fait appel à vous peuvent laisser un avis. Pas de faux profils, pas de manipulation.",
                color: "from-yellow-500 to-orange-500",
                bg: "bg-amber-50",
                border: "border-amber-200",
              },
              {
                icon: Gift,
                title: "Programme de parrainage",
                text: "Invitez vos confrères et gagnez des badges Ambassadeur. Une fois rentré, on grandit ensemble.",
                color: "from-rose-500 to-pink-500",
                bg: "bg-rose-50",
                border: "border-rose-200",
              },
            ].map((b) => (
              <div
                key={b.title}
                className={`group bg-white rounded-3xl p-6 border ${b.border} hover:-translate-y-1 hover:shadow-[0_20px_50px_-15px_rgba(13,30,74,0.18)] transition-all`}
              >
                <div className={`w-12 h-12 rounded-2xl ${b.bg} flex items-center justify-center mb-4`}>
                  <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${b.color} flex items-center justify-center`}>
                    <b.icon size={17} className="text-white" />
                  </div>
                </div>
                <h3 className="font-extrabold text-ink-700 text-[1.05rem]">{b.title}</h3>
                <p className="mt-2 text-[0.92rem] text-ink-500 leading-relaxed">{b.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═════════ COMPARATIF ═════════ */}
      <section className="py-20 sm:py-24 bg-ink-50">
        <div className="container-default max-w-5xl">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-[0.7rem] font-bold tracking-[0.14em] uppercase">
              <Award size={11} strokeWidth={2.8} />
              Comparatif
            </span>
            <h2 className="mt-4 text-[28px] sm:text-[40px] font-extrabold text-ink-700 tracking-[-0.025em]">
              Pourquoi <span className="text-brand-500">les artisans changent</span>
            </h2>
            <p className="mt-4 text-ink-500">
              Comparaison directe avec les plateformes traditionnelles.
            </p>
          </div>

          <div className="bg-white rounded-3xl border border-ink-100 overflow-hidden shadow-card">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-ink-100">
                    <th className="text-left px-5 py-4 font-bold text-ink-500 text-xs uppercase tracking-wider">Critère</th>
                    <th className="text-center px-3 py-4 font-bold text-ink-400 text-xs">Habitatpresto</th>
                    <th className="text-center px-3 py-4 font-bold text-ink-400 text-xs">Pages Jaunes</th>
                    <th className="text-center px-4 py-4 font-extrabold text-brand-700 text-xs bg-brand-50">
                      <div className="flex items-center justify-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-brand-500 animate-pulse" />
                        BISECCO
                      </div>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-ink-100">
                  {[
                    { c: "Inscription", a: "Payante", b: "Payante", k: "0 €" },
                    { c: "Commission sur chantier", a: "5-15 %", b: "—", k: "0 %" },
                    { c: "Contact direct client", a: "❌ via plateforme", b: "Téléphone", k: "✓ Messagerie + tel" },
                    { c: "Vérification SIREN", a: "Optionnelle", b: "❌", k: "✓ API gouv.fr" },
                    { c: "Visibilité locale SEO", a: "Limitée", b: "Payante", k: "✓ Auto-indexée" },
                    { c: "Avis client vérifiés", a: "Modérés", b: "❌", k: "✓ Anti-faux" },
                  ].map((r) => (
                    <tr key={r.c} className="hover:bg-ink-50/50">
                      <td className="px-5 py-3.5 font-semibold text-ink-700">{r.c}</td>
                      <td className="px-3 py-3.5 text-center text-ink-500">{r.a}</td>
                      <td className="px-3 py-3.5 text-center text-ink-500">{r.b}</td>
                      <td className="px-4 py-3.5 text-center font-bold text-emerald-700 bg-brand-50/40">
                        {r.k}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* ═════════ COMMENT ÇA MARCHE ═════════ */}
      <section className="py-20 sm:py-24 bg-white">
        <div className="container-default">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-[0.7rem] font-bold tracking-[0.14em] uppercase">
              <Zap size={11} strokeWidth={2.8} />
              Démarrage rapide
            </span>
            <h2 className="mt-4 text-[28px] sm:text-[40px] font-extrabold text-ink-700 tracking-[-0.025em]">
              Inscrit en <span className="text-brand-500">2 minutes</span>,
              <br />
              actif en 24h
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-5">
            {[
              {
                step: "1",
                title: "Créez votre profil",
                text: "Saisissez votre nom, email, SIREN. La vérification gouv.fr se fait automatiquement.",
                icon: Building2,
              },
              {
                step: "2",
                title: "Validation sous 24h",
                text: "Notre équipe valide votre compte. Vous recevez un mail dès que votre profil est en ligne.",
                icon: ShieldCheck,
              },
              {
                step: "3",
                title: "Recevez vos premiers contacts",
                text: "Vos clients vous écrivent directement. Vous répondez, vous signez, sans rien payer à Bisecco.",
                icon: MessageCircle,
              },
            ].map((s) => (
              <div
                key={s.step}
                className="relative bg-ink-50 rounded-3xl p-7 border border-ink-100 hover:border-brand-200 transition"
              >
                <div className="absolute -top-5 left-7 w-10 h-10 rounded-2xl bg-gradient-to-br from-brand-500 to-brand-600 text-white font-extrabold flex items-center justify-center shadow-[0_8px_20px_rgba(240,122,47,0.4)]">
                  {s.step}
                </div>
                <div className="mt-4">
                  <s.icon size={26} className="text-brand-500" />
                  <h3 className="mt-3 font-extrabold text-ink-700 text-lg">{s.title}</h3>
                  <p className="mt-2 text-ink-500 text-[0.92rem] leading-relaxed">{s.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═════════ ARTISANS EN LIGNE · SOCIAL PROOF ═════════ */}
      {featured.length > 0 && (
        <section className="py-20 sm:py-24 bg-gradient-to-b from-ink-50 to-white">
          <div className="container-default">
            <div className="flex items-end justify-between flex-wrap gap-4 mb-10">
              <div>
                <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-[0.7rem] font-bold tracking-[0.14em] uppercase">
                  <Quote size={11} strokeWidth={2.8} />
                  Ils nous font confiance
                </span>
                <h2 className="mt-4 text-[28px] sm:text-[36px] font-extrabold text-ink-700 tracking-[-0.025em]">
                  {stats.artisans} artisans déjà sur Bisecco
                </h2>
              </div>
              <Link
                href="/rechercher"
                className="inline-flex items-center gap-1.5 text-sm font-bold text-brand-600 hover:underline"
              >
                Voir tous les artisans <ArrowRight size={13} />
              </Link>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {featured.map((a) => (
                <Link
                  key={a.id}
                  href={a.clientNumber ? `/profil/${a.clientNumber}` : "#"}
                  className="group bg-white rounded-3xl border border-ink-100 overflow-hidden hover:border-brand-200 hover:-translate-y-1 hover:shadow-[0_20px_40px_-15px_rgba(13,30,74,0.18)] transition-all"
                >
                  <div className="relative h-24 bg-gradient-to-br from-ink-700 to-ink-800 overflow-hidden">
                    {a.coverPhoto ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={a.coverPhoto} alt="" className="w-full h-full object-cover" loading="lazy" />
                    ) : (
                      <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(240,122,47,0.25),transparent)]" />
                    )}
                  </div>
                  <div className="px-5 pb-5 -mt-9">
                    <div className="w-16 h-16 rounded-2xl border-[3px] border-white bg-ink-100 overflow-hidden shadow-card">
                      {a.profilePhoto ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={a.profilePhoto} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-brand-400 to-brand-600 text-white font-extrabold text-xl">
                          {a.name.charAt(0)}
                        </div>
                      )}
                    </div>
                    <div className="mt-3 font-extrabold text-ink-700 truncate">{a.name}</div>
                    <div className="text-xs text-ink-500 truncate">{a.person}</div>
                    <div className="flex items-center gap-2 mt-2 text-xs">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-brand-50 border border-brand-200 text-brand-700 font-bold">
                        {a.icon} {a.metier}
                      </span>
                      <span className="inline-flex items-center gap-1 text-ink-500">
                        <MapPin size={11} /> {a.city}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ═════════ FAQ ═════════ */}
      <section className="py-20 sm:py-24 bg-white">
        <div className="container-default max-w-3xl">
          <div className="text-center mb-12">
            <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-ink-100 border border-ink-200 text-ink-700 text-[0.7rem] font-bold tracking-[0.14em] uppercase">
              FAQ
            </span>
            <h2 className="mt-4 text-[28px] sm:text-[36px] font-extrabold text-ink-700 tracking-[-0.025em]">
              Questions <span className="text-brand-500">fréquentes</span>
            </h2>
          </div>

          <div className="space-y-3">
            {[
              {
                q: "C'est vraiment gratuit ?",
                a: "Oui. 100 % gratuit pour les artisans : aucun frais d'inscription, aucune commission sur les chantiers, aucun abonnement obligatoire. Nous nous finançons via des services premium optionnels (mise en avant, pack visibilité).",
              },
              {
                q: "Comment êtes-vous différents de Habitatpresto ou Allopro ?",
                a: "Eux vendent vos coordonnées aux clients qui paient ; nous, on met juste en relation gratuitement. Vous gardez 100 % du contrat. Aucun lead vendu en gros, aucun paywall.",
              },
              {
                q: "Pourquoi vérifier le SIREN ?",
                a: "Parce que c'est la garantie #1 pour vos futurs clients : ils voient que vous êtes une vraie entreprise déclarée. Sur les autres plateformes, n'importe qui peut créer un profil · chez nous, l'identité est contrôlée via l'API officielle gouv.fr.",
              },
              {
                q: "Combien de temps pour être validé ?",
                a: "La vérification SIREN est instantanée. La validation manuelle de notre équipe se fait sous 24h ouvrées maximum. Vous recevez un email dès que votre profil est en ligne.",
              },
              {
                q: "Que se passe-t-il si je n'ai pas encore de clients ?",
                a: "Votre profil est référencé sur Google pour votre métier et votre ville. Vous apparaissez dans nos pages de recherche locale et nos pages métier. Les premiers contacts arrivent généralement dans les 2 premières semaines.",
              },
            ].map((f, i) => (
              <details
                key={i}
                className="group bg-ink-50 rounded-2xl border border-ink-100 overflow-hidden open:bg-white open:border-brand-200 open:shadow-card transition-all"
              >
                <summary className="flex items-center justify-between gap-3 px-5 py-4 cursor-pointer list-none">
                  <span className="font-bold text-ink-700 text-[0.95rem]">{f.q}</span>
                  <span className="w-7 h-7 rounded-full bg-white border border-ink-200 flex items-center justify-center text-ink-500 group-open:bg-brand-500 group-open:border-brand-500 group-open:text-white transition flex-shrink-0">
                    <span className="text-lg leading-none group-open:hidden">+</span>
                    <span className="text-lg leading-none hidden group-open:inline">−</span>
                  </span>
                </summary>
                <div className="px-5 pb-4 text-ink-600 text-[0.92rem] leading-relaxed">{f.a}</div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ═════════ CTA FINAL ═════════ */}
      <section className="relative py-20 sm:py-24 bg-gradient-to-br from-ink-900 via-ink-800 to-ink-900 text-white overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] rounded-full bg-brand-500/20 blur-[120px] pointer-events-none" />
        <div className="container-default relative text-center max-w-2xl">
          <Users size={36} className="text-brand-400 mx-auto mb-5" />
          <h2 className="text-[32px] sm:text-[48px] font-extrabold tracking-[-0.025em] leading-[1.05]">
            Prêt à rejoindre <span className="text-brand-400">Bisecco</span> ?
          </h2>
          <p className="mt-5 text-white/70 text-[1rem] sm:text-[1.05rem] leading-relaxed">
            Plus vous arrivez tôt, plus vous prenez de l&apos;avance sur votre marché local.
            <strong className="text-white"> 2 minutes pour vous inscrire.</strong>
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            {isArtisanConnecte ? (
              <Link
                href="/mon-profil"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-br from-brand-500 to-brand-600 text-white font-extrabold shadow-[0_12px_30px_-8px_rgba(240,122,47,0.6)] hover:-translate-y-0.5 transition"
              >
                Accéder à mon espace pro <ArrowRight size={16} />
              </Link>
            ) : (
              <>
                <Link
                  href="/inscription"
                  className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-br from-brand-500 to-brand-600 text-white font-extrabold shadow-[0_12px_30px_-8px_rgba(240,122,47,0.6)] hover:-translate-y-0.5 transition"
                >
                  <CheckCircle2 size={16} /> Je crée mon profil
                </Link>
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-white/[0.08] border border-white/[0.18] text-white font-bold hover:bg-white/[0.14] backdrop-blur-md transition"
                >
                  Une question d&apos;abord
                </Link>
              </>
            )}
          </div>
          <p className="mt-5 text-xs text-white/40 inline-flex items-center gap-1.5">
            <Lock size={11} /> Aucune CB · Aucun engagement · 100 % gratuit
          </p>
        </div>
      </section>
    </main>
  );
}

/* ═════════ GATED VERSION : pour visiteurs non-pros ═════════ */
function GatedPartenaires({ user }: { user: CurrentUser | null }) {
  const isParticulier = user?.role === "particulier";

  return (
    <main className="bg-ink-50 min-h-screen">
      <section className="relative bg-gradient-to-br from-ink-900 via-ink-800 to-ink-900 text-white overflow-hidden">
        <div className="absolute top-0 left-1/4 w-[600px] h-[400px] rounded-full bg-brand-500/15 blur-[140px] pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[400px] rounded-full bg-blue-500/15 blur-[140px] pointer-events-none" />

        <div className="container-default relative py-20 sm:py-28">
          <div className="max-w-2xl mx-auto text-center">
            {/* Cadenas */}
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-brand-500/15 border border-brand-500/30 mb-6 backdrop-blur-md">
              <KeyRound size={32} className="text-brand-400" strokeWidth={2.2} />
            </div>

            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-500/15 border border-brand-500/30 text-brand-400 text-[0.72rem] font-extrabold tracking-[0.14em] uppercase">
              <Sparkles size={11} strokeWidth={2.8} />
              Espace Pro Bisecco
            </span>

            <h1 className="mt-6 text-[32px] sm:text-[44px] lg:text-[52px] leading-[1.05] font-extrabold tracking-[-0.025em]">
              Réservé aux{" "}
              <span className="text-brand-500">
                artisans vérifiés
              </span>
            </h1>

            <p className="mt-6 text-[1rem] sm:text-[1.1rem] text-white/70 leading-[1.6] max-w-xl mx-auto">
              {isParticulier ? (
                <>
                  Cette zone est dédiée aux{" "}
                  <strong className="text-white">professionnels Bisecco</strong>. Vous êtes un{" "}
                  <strong className="text-white">artisan ?</strong> Inscrivez-vous gratuitement pour
                  accéder au réseau, à la messagerie pro et aux outils de visibilité.
                </>
              ) : (
                <>
                  Le <strong className="text-white">réseau partenaires</strong> est réservé aux
                  artisans français vérifiés SIREN.
                  <strong className="text-white"> 100 % gratuit</strong>,{" "}
                  <strong className="text-white">0 % de commission</strong>,{" "}
                  <strong className="text-white">contact direct</strong> avec vos futurs clients.
                </>
              )}
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap justify-center gap-3 mt-8">
              <Link
                href="/inscription"
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl bg-gradient-to-br from-brand-500 to-brand-600 text-white font-extrabold shadow-[0_10px_30px_-8px_rgba(240,122,47,0.55)] hover:-translate-y-0.5 transition"
              >
                Inscrivez-vous gratuitement <ArrowRight size={16} />
              </Link>
              {!user && (
                <Link
                  href="/connexion?redirect=/partenaires"
                  className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl bg-white/[0.08] border border-white/[0.18] text-white font-bold hover:bg-white/[0.14] backdrop-blur-md transition"
                >
                  J&apos;ai déjà un compte pro
                </Link>
              )}
            </div>

            <p className="mt-5 text-xs text-white/45 inline-flex items-center gap-1.5">
              <Lock size={11} /> Aucune CB · Aucun engagement · 2 min suffisent
            </p>
          </div>

          {/* 3 raisons sous le hero */}
          <div className="mt-16 grid sm:grid-cols-3 gap-4 max-w-4xl mx-auto">
            {[
              {
                icon: Award,
                title: "0 % commission",
                text: "Vous gardez l'intégralité de vos revenus.",
              },
              {
                icon: ShieldCheck,
                title: "SIREN vérifié",
                text: "Votre identité est contrôlée via l'API gouv.fr.",
              },
              {
                icon: MessageCircle,
                title: "Contact direct",
                text: "Vos clients vous écrivent sans intermédiaire payant.",
              },
            ].map((b) => (
              <div
                key={b.title}
                className="bg-white/[0.04] border border-white/[0.10] backdrop-blur-md rounded-2xl p-5 text-center"
              >
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-500 to-brand-600 flex items-center justify-center mx-auto mb-3">
                  <b.icon size={17} className="text-white" />
                </div>
                <div className="font-extrabold text-white text-sm">{b.title}</div>
                <div className="text-[0.78rem] text-white/55 mt-1">{b.text}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bloc particulier · orientation alternative */}
      {!isParticulier && (
        <section className="py-14 bg-white border-t border-ink-100">
          <div className="container-default max-w-3xl text-center">
            <p className="text-ink-500 text-sm">
              Vous cherchez un artisan pour vos travaux ?
            </p>
            <Link
              href="/rechercher"
              className="mt-4 inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-ink-900 text-white font-bold text-sm hover:bg-ink-800 transition"
            >
              Trouver un artisan près de chez moi <ArrowRight size={14} />
            </Link>
          </div>
        </section>
      )}
    </main>
  );
}
