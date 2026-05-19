import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import {
  LayoutDashboard, Users, Briefcase, Star, Gift, Settings,
  Shield, ExternalLink, LogOut, Flag, FileText,
} from "lucide-react";
import { requireAdmin } from "@/lib/db/current-user";
import { logoutAction } from "@/lib/auth/actions";

export const metadata: Metadata = {
  title: { default: "Admin", template: "%s · Admin Bisecco" },
  robots: { index: false, follow: false },
};

const NAV = [
  { href: "/admin",                label: "Dashboard",    icon: LayoutDashboard, exact: true },
  { href: "/admin/utilisateurs",   label: "Utilisateurs", icon: Users },
  { href: "/admin/metiers",        label: "Métiers",      icon: Briefcase },
  { href: "/admin/avis",           label: "Avis",         icon: Star },
  { href: "/admin/signalements",   label: "Signalements", icon: Flag },
  { href: "/admin/blog",           label: "Blog",         icon: FileText },
  { href: "/admin/parrainages",    label: "Parrainages",  icon: Gift },
  { href: "/admin/parametres",     label: "Paramètres",   icon: Settings },
];

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const admin = await requireAdmin();

  return (
    <div className="min-h-screen bg-ink-50 flex">
      {/* Sidebar */}
      <aside className="hidden lg:flex flex-col w-64 bg-ink-900 text-white sticky top-0 h-screen">
        {/* Logo */}
        <div className="p-5 border-b border-white/10">
          <Link href="/admin" className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl overflow-hidden">
              <Image src="/logo.jpg" alt="Bisecco" width={36} height={36} />
            </div>
            <div>
              <div className="font-extrabold tracking-wider text-sm">BISECCO</div>
              <div className="text-[0.62rem] text-brand-400 font-bold tracking-[0.18em] uppercase">Admin</div>
            </div>
          </Link>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold text-white/70 hover:bg-white/5 hover:text-white transition"
            >
              <item.icon size={16} />
              {item.label}
            </Link>
          ))}
        </nav>

        {/* User card */}
        <div className="p-3 border-t border-white/10">
          <div className="px-3 py-2 rounded-lg bg-white/5">
            <div className="flex items-center gap-2">
              <Shield size={14} className="text-brand-400" />
              <div className="text-[0.72rem] font-bold text-white truncate">{admin.name}</div>
            </div>
            <div className="text-[0.66rem] text-white/50 mt-0.5 truncate">{admin.email}</div>
          </div>
          <div className="mt-2 space-y-1">
            <Link
              href="/"
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-[0.72rem] font-semibold text-white/60 hover:text-white hover:bg-white/5 transition"
            >
              <ExternalLink size={12} /> Voir le site
            </Link>
            <form action={logoutAction}>
              <button
                type="submit"
                className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-[0.72rem] font-semibold text-white/60 hover:text-red-300 hover:bg-red-500/10 transition"
              >
                <LogOut size={12} /> Déconnexion
              </button>
            </form>
          </div>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 min-w-0">
        {/* Mobile top bar */}
        <header className="lg:hidden sticky top-0 z-20 bg-ink-900 text-white px-4 py-3 flex items-center justify-between">
          <Link href="/admin" className="flex items-center gap-2 font-bold">
            <Shield size={16} className="text-brand-400" /> Admin Bisecco
          </Link>
          <Link href="/" className="text-xs text-white/70">Site →</Link>
        </header>

        {/* Mobile nav scrollable */}
        <nav className="lg:hidden bg-ink-900/95 backdrop-blur px-3 py-2 flex gap-1 overflow-x-auto sticky top-[44px] z-10 border-b border-white/10">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex-shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-white/70 hover:bg-white/10 hover:text-white"
            >
              <item.icon size={12} /> {item.label}
            </Link>
          ))}
        </nav>

        <div className="p-5 sm:p-8">{children}</div>
      </main>
    </div>
  );
}
