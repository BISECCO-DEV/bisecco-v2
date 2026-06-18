"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  LayoutDashboard, Calendar, Users, FolderKanban, ListChecks,
  Receipt, FileText, BarChart3, Settings, ChevronsLeft, Menu, X,
  Rocket, LogOut, ShieldCheck, User as UserIcon,
} from "lucide-react";
import { logoutAction } from "@/lib/auth/actions";

type NavItem = {
  href: string;
  label: string;
  icon: React.ComponentType<{ size?: number; className?: string; strokeWidth?: number }>;
  badge?: string;
  soon?: boolean;
};

const NAV: NavItem[] = [
  { href: "/pro",             label: "Tableau de bord", icon: LayoutDashboard },
  { href: "/pro/agenda",      label: "Agenda",          icon: Calendar,       soon: true },
  { href: "/pro/clients",     label: "Clients / Contacts", icon: Users,       soon: true },
  { href: "/pro/projets",     label: "Projets",         icon: FolderKanban,   soon: true },
  { href: "/pro/taches",      label: "Tâches",          icon: ListChecks,     soon: true },
  { href: "/pro/facturation", label: "Facturation",     icon: Receipt,        soon: true },
  { href: "/pro/documents",   label: "Documents",       icon: FileText,       soon: true },
  { href: "/mon-profil/stats",label: "Statistiques",    icon: BarChart3 },
  { href: "/mon-profil/parametres", label: "Paramètres", icon: Settings },
];

type Props = {
  userName: string;
  userAvatar: string | null;
  userClientNumber: string | null;
  isApproved: boolean;
};

export function ProSidebar({ userName, userAvatar, userClientNumber, isApproved }: Props) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const initials = userName.split(/\s+/).map((p) => p[0]).join("").slice(0, 2).toUpperCase();

  const isActive = (href: string) => {
    if (href === "/pro") return pathname === "/pro";
    return pathname.startsWith(href);
  };

  return (
    <>
      {/* Toggle mobile · burger en haut à gauche */}
      <button
        type="button"
        onClick={() => setMobileOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-50 w-11 h-11 rounded-xl bg-white border border-ink-200 shadow-md grid place-items-center"
        aria-label="Ouvrir le menu pro"
      >
        <Menu size={18} className="text-ink-700" />
      </button>

      {/* Overlay mobile */}
      {mobileOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-screen w-[260px] xl:w-[280px] bg-white border-r border-ink-100 z-50 flex flex-col transition-transform duration-300 lg:translate-x-0 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Logo Bisecco + close mobile */}
        <div className="flex items-center justify-between px-5 py-5 border-b border-ink-100">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-lg overflow-hidden bg-ink-700">
              <Image src="/logo.jpg" alt="Bisecco" width={36} height={36} className="object-cover" />
            </div>
            <span className="font-display font-bold text-ink-900 tracking-tight">Bisecco<span className="text-brand-500">.</span></span>
          </Link>
          <button
            type="button"
            onClick={() => setMobileOpen(false)}
            className="lg:hidden text-ink-400 hover:text-ink-700"
            aria-label="Fermer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Section "Espace pro" */}
        <div className="px-5 pt-4 pb-2">
          <div className="text-[0.62rem] font-bold tracking-[0.18em] uppercase text-ink-400">
            Espace pro
          </div>
        </div>

        {/* Nav principale */}
        <nav className="px-3 flex-1 overflow-y-auto py-1">
          <ul className="space-y-0.5">
            {NAV.map((item) => {
              const active = isActive(item.href);
              const Icon = item.icon;
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition group ${
                      active
                        ? "bg-brand-500 text-white shadow-[0_8px_20px_-8px_rgba(240,122,47,0.5)]"
                        : "text-ink-600 hover:bg-ink-50/80"
                    }`}
                  >
                    <Icon
                      size={17}
                      strokeWidth={active ? 2.4 : 2}
                      className={active ? "text-white" : "text-ink-400 group-hover:text-ink-700"}
                    />
                    <span className={`flex-1 text-sm ${active ? "font-bold" : "font-semibold"}`}>
                      {item.label}
                    </span>
                    {item.soon && (
                      <span className={`text-[0.6rem] px-1.5 py-0.5 rounded-md font-bold tracking-wider uppercase ${
                        active ? "bg-white/20 text-white" : "bg-ink-100 text-ink-500"
                      }`}>
                        Bientôt
                      </span>
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Card pub "Mode Premium" (placeholder, branchera Stripe plus tard) */}
        <div className="px-5 pb-3">
          <div className="rounded-2xl bg-gradient-to-br from-ink-700 via-ink-800 to-ink-700 p-4 relative overflow-hidden">
            <div className="absolute -top-8 -right-8 w-24 h-24 rounded-full bg-brand-500/30 blur-2xl pointer-events-none" />
            <div className="relative">
              <div className="w-9 h-9 rounded-xl bg-brand-500 grid place-items-center mb-2.5 shadow-[0_8px_16px_-4px_rgba(240,122,47,0.5)]">
                <Rocket size={16} className="text-white" />
              </div>
              <h4 className="text-white font-bold text-sm leading-tight">
                Passez à la vitesse supérieure
              </h4>
              <p className="text-white/65 text-xs mt-1 leading-relaxed">
                Débloque les fonctionnalités avancées.
              </p>
              <button
                type="button"
                disabled
                className="mt-3 w-full inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-brand-500 text-white text-xs font-bold opacity-80"
              >
                Découvrir <span className="text-[0.65rem] bg-white/20 px-1.5 py-0.5 rounded">Bientôt</span>
              </button>
            </div>
          </div>
        </div>

        {/* Card user (en bas) */}
        <div className="px-3 pb-3 border-t border-ink-100 pt-3">
          <Link
            href={userClientNumber ? `/profil/${userClientNumber}` : "/mon-profil"}
            className="flex items-center gap-3 px-2 py-2 rounded-xl hover:bg-ink-50/80 transition group"
          >
            {userAvatar ? (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img src={userAvatar} alt="" className="w-9 h-9 rounded-full object-cover border border-ink-100" />
            ) : (
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-brand-500 to-brand-600 text-white grid place-items-center text-xs font-bold">
                {initials || <UserIcon size={14} />}
              </div>
            )}
            <div className="flex-1 min-w-0">
              <div className="text-sm font-bold text-ink-700 truncate">{userName}</div>
              <div className="text-[0.65rem] text-ink-400 flex items-center gap-1">
                {isApproved ? (
                  <><ShieldCheck size={9} className="text-emerald-500" /> Vérifié SIREN</>
                ) : (
                  "Validation en cours"
                )}
              </div>
            </div>
          </Link>

          <form action={logoutAction} className="mt-1">
            <button
              type="submit"
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-ink-500 hover:bg-red-50 hover:text-red-600 transition text-xs font-semibold"
            >
              <LogOut size={14} /> Se déconnecter
            </button>
          </form>
        </div>
      </aside>

      {/* Bouton "Réduire le menu" desktop (visuel seulement pour l'instant) */}
      <button
        type="button"
        className="hidden lg:flex fixed bottom-4 left-4 z-30 text-ink-400 hover:text-ink-700 text-xs font-semibold items-center gap-1.5"
        title="Bientôt"
        disabled
      >
        <ChevronsLeft size={14} /> Réduire le menu
      </button>
    </>
  );
}
