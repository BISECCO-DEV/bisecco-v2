import type { Metadata } from "next";
import Link from "next/link";
import {
  FileText, MessageCircle, Eye, Star, TrendingUp, Bell,
  Edit3, MapPin, ShieldCheck, Settings, LogOut, ChevronRight, Gift,
} from "lucide-react";
import { InviteButton } from "@/components/features/InviteButton";
import { requireUser } from "@/lib/db/current-user";
import { logoutAction } from "@/lib/auth/actions";

export const metadata: Metadata = {
  title: "Mon espace",
  robots: { index: false, follow: false },
};

// Hero-metric template cassé : on garde UNE stat héroïque (vues = signal le plus
// parlant) et 3 satellites discrètes en liste typographique.
const STAT_HERO = {
  label: "Vues du profil ce mois",
  value: 1284,
  change: "+12% vs mois dernier",
  icon: Eye,
};

const STAT_SATELLITES = [
  { label: "Messages reçus",  value: 7,    icon: MessageCircle, href: "/messagerie" },
  { label: "Devis reçus",     value: 24,   icon: FileText,      href: "/mon-profil/devis" },
  { label: "Note moyenne",    value: "4.8 / 5",  icon: Star,    href: "/mon-profil/avis" },
];

const ACTIVITIES = [
  { id: 1, type: "message", href: "/messagerie",         title: "Nouveau message de Marie L.", time: "Il y a 5 min", icon: MessageCircle, color: "text-blue-500", bg: "bg-blue-50" },
  { id: 2, type: "devis",   href: "/mon-profil/devis",   title: "Nouvelle demande de devis · Rénovation salle de bain", time: "Il y a 2h", icon: FileText, color: "text-brand-500", bg: "bg-brand-50" },
  { id: 3, type: "review",  href: "/mon-profil/avis",    title: "Vous avez reçu un avis 5★ de Pierre M.", time: "Hier", icon: Star, color: "text-yellow-500", bg: "bg-yellow-50" },
  { id: 4, type: "view",    href: "/mon-profil/activite", title: "Sophie K. a consulté votre profil", time: "Hier", icon: Eye, color: "text-emerald-500", bg: "bg-emerald-50" },
];

export default async function MonProfilPage() {
  const user = await requireUser();
  const isValidated = user.validation_status === "approved";
  const avatarUrl =
    user.profile_photo ??
    `https://api.dicebear.com/9.x/initials/svg?seed=${encodeURIComponent(user.name)}`;
  const roleLabel = user.role === "artisan" ? "Artisan" : user.role === "admin" ? "Admin" : "Particulier";
  // Complétion du profil · heuristique simple sur les champs remplis
  const fields = [user.name, user.email, user.phone, user.city, user.description, user.profile_photo];
  const completion = Math.round(
    (fields.filter(Boolean).length / fields.length) * 100,
  );
  const referralUrl = user.referral_code
    ? `https://bisecco.fr/r/${user.referral_code}`
    : "https://bisecco.fr/inscription";

  return (
    <div className="bg-ink-50 min-h-screen">
      <div className="container-default py-10">
        {/* Header user */}
        <div className="bg-gradient-to-br from-ink-800 via-ink-700 to-ink-800 rounded-3xl p-8 text-white relative overflow-hidden mb-8">
          <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full bg-brand-500/20 blur-3xl" />
          <div className="absolute bottom-0 left-0 w-60 h-60 rounded-full bg-blue-500/15 blur-3xl" />

          <div className="relative flex flex-col md:flex-row items-start md:items-center gap-5">
            <div className="relative">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={avatarUrl} alt="" className="w-20 h-20 rounded-2xl border-4 border-white/10 object-cover bg-ink-100" />
              {isValidated && (
                <span className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-emerald-500 border-4 border-ink-800 flex items-center justify-center">
                  <ShieldCheck size={12} className="text-white" />
                </span>
              )}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-2xl font-bold">Bonjour, {user.name.split(" ")[0]} 👋</h1>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-brand-500/20 border border-brand-500/40 text-brand-400 text-xs font-bold">
                  {roleLabel}
                </span>
                {user.validation_status === "pending" && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs font-bold">
                    Validation en cours
                  </span>
                )}
              </div>
              <p className="text-white/65 text-sm mt-1 flex items-center gap-2">
                <MapPin size={13} /> {user.city ?? "Ville non renseignée"}
              </p>
            </div>
            <div className="flex gap-2">
              <Link href="/mon-profil/edit" className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 border border-white/15 hover:bg-white/15 text-white font-semibold text-sm transition">
                <Edit3 size={14} /> Modifier mon profil
              </Link>
              <Link href="/mon-profil/notifications" className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-white/10 border border-white/15 hover:bg-white/15 text-white text-sm transition" aria-label="Notifications">
                <Bell size={16} />
                <span className="px-1.5 rounded-full bg-brand-500 text-[0.65rem] font-bold">3</span>
              </Link>
            </div>
          </div>

          {/* Complétion */}
          <div className="relative mt-7 pt-6 border-t border-white/10">
            <div className="flex justify-between items-center text-sm">
              <span className="text-white/85 font-semibold">Profil complété à {completion}%</span>
              <Link href="/mon-profil/edit" className="text-brand-400 text-xs font-bold hover:underline">
                Compléter →
              </Link>
            </div>
            <div className="mt-2 h-2 bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-brand-400 to-brand-500 rounded-full transition-all"
                style={{ width: `${completion}%` }}
              />
            </div>
          </div>
        </div>

        {/* Stat héroïque + 3 satellites — pas de cards identiques, hiérarchie typo */}
        <section className="mb-10">
          {/* Hero stat : la métrique qui parle vraiment */}
          <div className="border-t border-ink-100 pt-6">
            <div className="flex items-baseline gap-4 flex-wrap">
              <span className="text-[64px] md:text-[80px] font-bold tracking-[-0.04em] text-ink-700 leading-none tabular-nums">
                {STAT_HERO.value.toLocaleString("fr-FR")}
              </span>
              <div className="pb-2">
                <div className="text-sm font-semibold text-ink-600 uppercase tracking-wider">
                  {STAT_HERO.label}
                </div>
                <div className="text-sm text-emerald-600 font-semibold mt-1 flex items-center gap-1">
                  <TrendingUp size={14} /> {STAT_HERO.change}
                </div>
              </div>
            </div>
          </div>

          {/* Satellites : liste typo discrète, pas de cards, divider entre */}
          <div className="grid sm:grid-cols-3 mt-8 border-t border-ink-100">
            {STAT_SATELLITES.map((s, i) => (
              <Link
                key={s.label}
                href={s.href}
                className={`group flex items-baseline justify-between py-4 ${
                  i < STAT_SATELLITES.length - 1 ? "sm:border-r border-ink-100 sm:pr-6" : ""
                } ${i > 0 ? "border-t sm:border-t-0 sm:pl-6" : ""} hover:text-brand-500 transition`}
              >
                <div>
                  <div className="text-[28px] font-bold text-ink-700 group-hover:text-brand-500 tabular-nums transition">
                    {s.value}
                  </div>
                  <div className="text-xs text-ink-400 mt-0.5 uppercase tracking-wider font-medium">
                    {s.label}
                  </div>
                </div>
                <ChevronRight size={14} className="text-ink-300 group-hover:text-brand-500 transition" />
              </Link>
            ))}
          </div>
        </section>

        {/* Grid 2/3 + 1/3 */}
        <div className="grid lg:grid-cols-[1fr_360px] gap-6">
          {/* Activités */}
          <section className="bg-white rounded-3xl border border-ink-100 p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-bold text-ink-700">Activité récente</h2>
              <Link href="/mon-profil/activite" className="text-xs text-brand-500 font-bold hover:underline">
                Tout voir →
              </Link>
            </div>
            <div className="space-y-2">
              {ACTIVITIES.map((a) => (
                <Link
                  key={a.id}
                  href={a.href}
                  className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-ink-50 transition text-left"
                >
                  <div className={`w-10 h-10 rounded-lg ${a.bg} flex items-center justify-center flex-shrink-0`}>
                    <a.icon size={16} className={a.color} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-ink-700 text-sm truncate">{a.title}</div>
                    <div className="text-xs text-ink-400 mt-0.5">{a.time}</div>
                  </div>
                  <ChevronRight size={14} className="text-ink-300 flex-shrink-0" />
                </Link>
              ))}
            </div>
          </section>

          {/* Sidebar actions */}
          <aside className="space-y-4">
            {/* Parrainage card · invite contacts (SMS forfait user, gratuit pour Bisecco) */}
            <div className="bg-gradient-to-br from-brand-50 to-amber-50 rounded-3xl border border-brand-200 p-5">
              <div className="flex items-center gap-2 mb-2">
                <span className="w-9 h-9 rounded-xl bg-brand-500 text-white flex items-center justify-center shadow-[0_4px_12px_rgba(240,122,47,0.3)]">
                  <Gift size={16} strokeWidth={2.5} />
                </span>
                <h3 className="font-extrabold text-ink-700 text-sm">Inviter mes proches</h3>
              </div>
              <p className="text-xs text-ink-600 leading-relaxed mb-3">
                Sur Android, ton répertoire s&apos;ouvre direct. Sur iPhone, Messages se lance avec ton texte prêt.
                Les SMS partent de ton forfait · c&apos;est gratuit pour toi comme pour Bisecco.
              </p>
              <InviteButton referralUrl={referralUrl} variant="primary" className="w-full justify-center" />
              <Link
                href="/parrainage"
                className="mt-2 block text-center text-[0.72rem] font-bold text-brand-600 hover:underline"
              >
                Voir mon programme de parrainage →
              </Link>
            </div>

            <div className="bg-white rounded-3xl border border-ink-100 p-5">
              <h3 className="font-bold text-ink-700 text-sm mb-3">Accès rapides</h3>
              <div className="space-y-1">
                {[
                  { href: "/messagerie", icon: MessageCircle, label: "Messagerie", badge: "7" },
                  { href: "/mon-profil/devis", icon: FileText, label: "Mes devis" },
                  { href: "/mon-profil/avis", icon: Star, label: "Mes avis" },
                  { href: "/mon-profil/parametres", icon: Settings, label: "Paramètres" },
                ].map((l) => (
                  <Link
                    key={l.href}
                    href={l.href}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-ink-50 transition group"
                  >
                    <l.icon size={16} className="text-ink-400 group-hover:text-brand-500 transition" />
                    <span className="flex-1 text-sm font-semibold text-ink-700">{l.label}</span>
                    {l.badge && (
                      <span className="px-2 py-0.5 rounded-full bg-brand-500 text-white text-[0.65rem] font-bold">
                        {l.badge}
                      </span>
                    )}
                    <ChevronRight size={14} className="text-ink-300" />
                  </Link>
                ))}
              </div>
            </div>

            <form action={logoutAction}>
              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-ink-400 hover:bg-red-50 hover:text-red-600 transition text-sm font-semibold"
              >
                <LogOut size={14} /> Se déconnecter
              </button>
            </form>
          </aside>
        </div>
      </div>
    </div>
  );
}
