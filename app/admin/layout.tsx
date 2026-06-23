import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import {
  LayoutDashboard, Users, Briefcase, Star, Gift, Settings,
  Shield, ExternalLink, LogOut, Flag, FileText, MessageSquare,
  Calendar, Activity,
} from "lucide-react";
import { requireAdmin } from "@/lib/db/current-user";
import { logoutAction } from "@/lib/auth/actions";
import { CtaButton } from "@/components/ui/CtaButton";
import { MaintenanceToggleBar } from "@/components/admin/MaintenanceToggleBar";
import { getMaintenanceSettingMeta } from "@/lib/admin/site-settings";

export const metadata: Metadata = {
  title: { default: "Admin", template: "%s · Admin Bisecco" },
  robots: { index: false, follow: false },
};

type NavItem = { href: string; label: string; icon: typeof LayoutDashboard; exact?: boolean };

const NAV_SECTIONS: Array<{ section: string; items: NavItem[] }> = [
  {
    section: "Pilotage",
    items: [
      { href: "/admin",                label: "Dashboard",    icon: LayoutDashboard, exact: true },
      { href: "/admin/sante",          label: "Santé",        icon: Activity },
      { href: "/admin/utilisateurs",   label: "Utilisateurs", icon: Users },
      { href: "/admin/metiers",        label: "Métiers",      icon: Briefcase },
      { href: "/admin/stats",          label: "Agenda",       icon: Calendar },
    ],
  },
  {
    section: "Modération",
    items: [
      { href: "/admin/fil",          label: "Fil d'actualité", icon: MessageSquare },
      { href: "/admin/chat-live",    label: "Chat live",       icon: MessageSquare },
      { href: "/admin/avis",         label: "Avis",            icon: Star },
      { href: "/admin/signalements", label: "Signalements",    icon: Flag },
    ],
  },
  {
    section: "Croissance",
    items: [
      { href: "/admin/blog",        label: "Blog",        icon: FileText },
      { href: "/admin/parrainages", label: "Parrainages", icon: Gift },
      { href: "/admin/parametres",  label: "Paramètres",  icon: Settings },
    ],
  },
];

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const [admin, maintenance] = await Promise.all([
    requireAdmin(),
    getMaintenanceSettingMeta(),
  ]);
  const adminInitial = admin.name.charAt(0).toUpperCase();
  const envForced = process.env.MAINTENANCE_ENABLED === "true";

  return (
    <div className="min-h-screen bg-sand-50 grid lg:grid-cols-[260px_1fr]">
      {/* ═══════════ SIDEBAR DESKTOP ═══════════ */}
      <aside className="hidden lg:flex flex-col bg-ink-900 text-white sticky top-0 h-screen p-6 gap-7">
        {/* Brand */}
        <Link href="/admin" className="flex items-center gap-3 px-1.5">
          <div className="w-9 h-9 rounded-xl overflow-hidden bg-gradient-to-br from-brand-500 to-orange-300 grid place-items-center shadow-[0_6px_16px_rgba(240,122,47,0.35)]">
            <Image src="/logo.jpg" alt="" width={36} height={36} className="rounded-xl" />
          </div>
          <div>
            <div className="font-display font-semibold text-[1.15rem] tracking-tight leading-none">Bisecco</div>
            <div className="text-[0.6rem] tracking-[0.18em] text-brand-400 uppercase font-bold mt-1">Console Admin</div>
          </div>
        </Link>

        {/* Nav sections */}
        <nav className="flex-1 overflow-y-auto flex flex-col gap-6">
          {NAV_SECTIONS.map((section) => (
            <div key={section.section} className="flex flex-col gap-1">
              <div className="text-[0.6rem] tracking-[0.18em] uppercase text-white/40 font-semibold px-3 mb-1.5">
                {section.section}
              </div>
              {section.items.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-[0.84rem] font-medium text-white/65 hover:bg-white/[0.04] hover:text-white transition"
                >
                  <item.icon size={15} strokeWidth={2} className="flex-shrink-0" />
                  {item.label}
                </Link>
              ))}
            </div>
          ))}
        </nav>

        {/* Support card */}
        <div className="rounded-xl border border-brand-500/20 bg-gradient-to-br from-brand-500/[0.12] to-brand-500/[0.04] p-4 flex flex-col gap-2.5">
          <div className="flex items-center gap-2">
            <span className="relative flex w-2 h-2">
              <span className="absolute inset-0 rounded-full bg-emerald-400 animate-ping opacity-75" />
              <span className="relative inline-flex rounded-full w-2 h-2 bg-emerald-500" />
            </span>
            <div className="text-[0.78rem] font-semibold text-white">Support 24/7</div>
          </div>
          <div className="text-[0.72rem] text-white/55 leading-relaxed">
            Équipe technique disponible à tout moment pour la plateforme.
          </div>
          <CtaButton href="/admin/chat-live" variant="primary" size="sm" className="w-full justify-between">
            Démarrer un chat
          </CtaButton>
        </div>

        {/* User card */}
        <div className="pt-4 border-t border-white/[0.06]">
          <div className="flex items-center gap-2.5 px-1.5 mb-2">
            <span className="w-8 h-8 rounded-full bg-gradient-to-br from-violet to-pink-500 grid place-items-center font-display font-semibold text-[0.74rem] text-white flex-shrink-0">
              {adminInitial}
            </span>
            <div className="min-w-0 flex-1">
              <div className="text-[0.78rem] font-medium text-white truncate">{admin.name}</div>
              <div className="text-[0.66rem] text-white/40 truncate">{admin.email}</div>
            </div>
          </div>
          <div className="space-y-0.5">
            <Link
              href="/"
              className="flex items-center gap-2 px-3 py-1.5 rounded-md text-[0.7rem] font-medium text-white/55 hover:text-white hover:bg-white/[0.05] transition"
            >
              <ExternalLink size={11} /> Voir le site
            </Link>
            <form action={logoutAction}>
              <button
                type="submit"
                className="w-full flex items-center gap-2 px-3 py-1.5 rounded-md text-[0.7rem] font-medium text-white/55 hover:text-red-300 hover:bg-red-500/[0.08] transition"
              >
                <LogOut size={11} /> Déconnexion
              </button>
            </form>
          </div>
        </div>
      </aside>

      {/* ═══════════ MAIN ═══════════ */}
      <main className="min-w-0">
        {/* Toggle maintenance sticky en tête · toujours visible */}
        <div className="sticky top-0 z-30">
          <MaintenanceToggleBar
            initialEnabled={maintenance.maintenanceEnabled}
            envForced={envForced}
            tableExists={maintenance.tableExists}
            updatedAt={maintenance.updatedAt}
            updatedByName={maintenance.updatedByName}
          />
        </div>

        {/* Mobile top bar */}
        <header className="lg:hidden sticky top-[44px] z-20 bg-ink-900 text-white px-4 py-3 flex items-center justify-between">
          <Link href="/admin" className="flex items-center gap-2 font-bold">
            <Shield size={16} className="text-brand-400" /> Admin Bisecco
          </Link>
          <Link href="/" className="text-xs text-white/70">Site →</Link>
        </header>

        {/* Mobile nav scrollable */}
        <nav className="lg:hidden bg-ink-900/95 backdrop-blur px-3 py-2 flex gap-1 overflow-x-auto sticky top-[88px] z-10 border-b border-white/10">
          {NAV_SECTIONS.flatMap((s) => s.items).map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex-shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-white/70 hover:bg-white/10 hover:text-white"
            >
              <item.icon size={12} /> {item.label}
            </Link>
          ))}
        </nav>

        <div className="p-5 sm:p-8 lg:p-9">{children}</div>
      </main>
    </div>
  );
}
