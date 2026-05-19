"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, usePathname } from "next/navigation";
import { Menu, X, ChevronRight, Search, Bell, LogOut, Shield, MessageSquare, Users } from "lucide-react";
import { MAIN_NAV, SECONDARY_NAV, isActive } from "@/lib/nav";
import { logoutAction } from "@/lib/auth/actions";

export type MobileMenuUser = {
  name: string;
  email: string;
  role: "admin" | "artisan" | "particulier";
  profile_photo: string | null;
} | null;

type MobileMenuProps = { user?: MobileMenuUser };

const LEGAL = [
  { href: "/qui-sommes-nous",          label: "À propos" },
  { href: "/mentions-legales",         label: "Mentions" },
  { href: "/politique-confidentialite", label: "Confidentialité" },
];

export function MobileMenu({ user }: MobileMenuProps = {}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    document.body.classList.toggle("mobile-menu-open", open);
    return () => {
      document.body.style.overflow = "";
      document.body.classList.remove("mobile-menu-open");
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [open]);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  const onSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) router.push(`/rechercher?q=${encodeURIComponent(query.trim())}`);
  };

  return (
    <>
      {/* Bouton burger */}
      <button
        type="button"
        aria-label="Ouvrir le menu"
        aria-expanded={open}
        onClick={() => setOpen(true)}
        className="lg:hidden relative inline-flex items-center gap-1.5 h-10 px-2.5 rounded-lg text-white/85 hover:text-white bg-white/[0.06] hover:bg-white/[0.12] border border-white/[0.10] hover:border-white/[0.20] transition"
      >
        <Menu size={18} strokeWidth={2.4} />
        <span className="text-[0.72rem] font-extrabold tracking-[0.12em] uppercase">Menu</span>
      </button>

      {/* Overlay */}
      <div
        className={`fixed inset-0 bg-black/60 backdrop-blur-md z-[100] transition-opacity duration-300 lg:hidden ${
          open ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setOpen(false)}
        aria-hidden
      />

      {/* Drawer — navy theme, plein écran sur mobile */}
      <aside
        className={`fixed top-[36px] right-0 left-0 z-[110] w-full shadow-[0_30px_60px_-15px_rgba(0,0,0,0.6)] lg:hidden transition-transform duration-300 ease-out sm:left-auto sm:w-[min(420px,100vw)] ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
        style={{ height: "calc(100dvh - 36px)", backgroundColor: "#0a1a3a" }}
        aria-label="Menu mobile"
        role="dialog"
        aria-modal="true"
      >
        {/* Décors */}
        <div className="absolute -top-24 -right-24 w-64 h-64 rounded-full bg-brand-500/15 blur-[80px] pointer-events-none" />
        <div className="absolute top-1/3 -left-32 w-72 h-72 rounded-full bg-blue-500/[0.06] blur-[100px] pointer-events-none" />

        <div className="relative h-full flex flex-col">

          {/* ─── Header drawer ─── */}
          <header className="flex-shrink-0 px-5 pt-5 pb-4 border-b border-white/[0.06]">
            <div className="flex items-center justify-between">
              <Link href="/" onClick={() => setOpen(false)} className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl overflow-hidden border border-white/15 bg-white shadow-[0_4px_14px_rgba(0,0,0,0.4)]">
                  <Image src="/logo.jpg" alt="" width={40} height={40} className="w-full h-full object-cover" />
                </div>
                <span className="font-display font-extrabold text-[1.05rem] tracking-[0.04em] text-white">BISECCO</span>
              </Link>
              <button
                type="button"
                aria-label="Fermer le menu"
                onClick={() => setOpen(false)}
                className="inline-flex items-center gap-1.5 h-9 px-3.5 rounded-full bg-white/[0.08] border border-white/[0.12] text-white text-[0.78rem] font-bold hover:bg-white/[0.14] active:scale-95 transition"
              >
                Fermer
                <X size={14} strokeWidth={2.6} />
              </button>
            </div>
          </header>

          {/* ─── CTAs en haut : connecté → user card / sinon → boutons auth ─── */}
          <div className="flex-shrink-0 px-5 pt-4 pb-4">
            {user ? (
              <div className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.06] border border-white/[0.10]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={user.profile_photo ?? `https://api.dicebear.com/9.x/initials/svg?seed=${encodeURIComponent(user.name)}`}
                  alt=""
                  className="w-11 h-11 rounded-xl object-cover bg-white/10 flex-shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <div className="font-extrabold text-white text-sm truncate">{user.name}</div>
                  <div className="text-[0.7rem] text-white/55 truncate">{user.email}</div>
                  <span className={`mt-1 inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[0.6rem] font-extrabold uppercase tracking-wider ${
                    user.role === "admin"
                      ? "bg-purple-500/20 text-purple-300 border border-purple-400/30"
                      : user.role === "artisan"
                        ? "bg-brand-500/20 text-brand-300 border border-brand-400/30"
                        : "bg-blue-500/20 text-blue-300 border border-blue-400/30"
                  }`}>
                    {user.role === "admin" ? <Shield size={9} /> : null}
                    {user.role}
                  </span>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <Link
                  href="/connexion"
                  onClick={() => setOpen(false)}
                  className="inline-flex items-center justify-center h-11 rounded-xl bg-white/[0.06] border border-white/[0.14] text-white font-bold text-[0.88rem] hover:bg-white/[0.12] hover:border-white/[0.22] active:scale-[0.98] transition"
                >
                  Se connecter
                </Link>
                <Link
                  href="/inscription"
                  onClick={() => setOpen(false)}
                  className="group relative inline-flex items-center justify-center h-11 rounded-xl bg-gradient-to-br from-brand-500 to-brand-600 text-white font-extrabold text-[0.88rem] shadow-[0_6px_18px_-4px_rgba(240,122,47,0.55),inset_0_1px_0_rgba(255,255,255,0.25)] active:scale-[0.98] transition overflow-hidden"
                >
                  <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/15 to-transparent" aria-hidden />
                  <span className="relative">S&apos;inscrire</span>
                </Link>
              </div>
            )}

            {/* Search inline subtile */}
            <form onSubmit={onSearch} className="relative mt-3 flex items-center bg-white/[0.06] border border-white/[0.10] rounded-xl p-1 gap-1.5">
              <div className="flex-1 flex items-center pl-3 gap-2">
                <Search size={14} className="text-white/40 flex-shrink-0" />
                <input
                  type="search"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Plombier, ville…"
                  className="flex-1 min-w-0 py-2 bg-transparent text-white placeholder:text-white/40 text-[0.86rem] outline-none"
                  aria-label="Rechercher"
                />
              </div>
              <button
                type="submit"
                className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-brand-500 text-white flex-shrink-0"
                aria-label="Lancer la recherche"
              >
                <ChevronRight size={14} strokeWidth={2.8} />
              </button>
            </form>
          </div>

          {/* ─── Contenu scrollable ─── */}
          <div className="flex-1 overflow-y-auto overscroll-contain">
            {/* Navigation principale */}
            <div className="px-3 pt-2 pb-3">
              <div className="text-[0.62rem] font-extrabold tracking-[0.18em] text-white/40 uppercase px-4 py-2">
                Navigation
              </div>
              <ul className="space-y-1">
                {MAIN_NAV.map((item) => {
                  const active = isActive(pathname, item.href);
                  const Icon = item.icon;
                  return (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        onClick={() => setOpen(false)}
                        className={`group relative flex items-center gap-3 px-3 py-3 rounded-xl transition-all overflow-hidden ${
                          active
                            ? "bg-gradient-to-r from-brand-500/[0.16] via-brand-500/[0.08] to-transparent"
                            : "hover:bg-white/[0.04]"
                        }`}
                        aria-current={active ? "page" : undefined}
                      >
                        {active && (
                          <span className="absolute left-0 top-2 bottom-2 w-[3px] rounded-r-full bg-gradient-to-b from-brand-400 via-brand-500 to-brand-600" aria-hidden />
                        )}
                        <span
                          className={`relative w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-all ${
                            active
                              ? "bg-gradient-to-br from-brand-500 to-brand-600 text-white shadow-[0_4px_12px_rgba(240,122,47,0.45),inset_0_1px_0_rgba(255,255,255,0.25)]"
                              : "bg-white/[0.06] border border-white/[0.08] text-white/75 group-hover:bg-white/[0.10] group-hover:text-white"
                          }`}
                        >
                          <Icon size={17} strokeWidth={2.2} />
                        </span>
                        <span className={`flex-1 font-bold text-[0.94rem] ${active ? "text-white" : "text-white/85"}`}>
                          {item.label}
                        </span>
                        <ChevronRight
                          size={15}
                          className={`flex-shrink-0 transition-transform ${
                            active ? "text-brand-400" : "text-white/30 group-hover:translate-x-0.5 group-hover:text-white/60"
                          }`}
                        />
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>

            {/* Mon espace — SEULEMENT si connecté */}
            {user && (
              <div className="px-3 py-3 border-t border-white/[0.05]">
                <div className="text-[0.62rem] font-extrabold tracking-[0.18em] text-white/40 uppercase px-4 py-2">
                  Mon espace
                </div>
                <ul className="space-y-1">
                  {user.role === "admin" && (
                    <li>
                      <Link
                        href="/admin"
                        onClick={() => setOpen(false)}
                        className="group flex items-center gap-3 px-3 py-2.5 rounded-xl bg-purple-500/15 border border-purple-400/30 hover:bg-purple-500/25 transition"
                      >
                        <span className="w-9 h-9 rounded-lg bg-purple-500/30 border border-purple-400/40 flex items-center justify-center text-purple-200 flex-shrink-0">
                          <Shield size={15} strokeWidth={2.4} />
                        </span>
                        <span className="flex-1 font-extrabold text-[0.9rem] text-purple-100">Tableau admin</span>
                        <ChevronRight size={14} className="text-purple-300" />
                      </Link>
                    </li>
                  )}
                  <li>
                    <Link
                      href="/mon-profil/notifications"
                      onClick={() => setOpen(false)}
                      className="group flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-white/[0.04] transition"
                    >
                      <span className="w-9 h-9 rounded-lg bg-white/[0.06] border border-white/[0.08] flex items-center justify-center text-white/70 flex-shrink-0">
                        <Bell size={15} strokeWidth={2.2} />
                      </span>
                      <span className="flex-1 font-semibold text-[0.9rem] text-white/85">Notifications</span>
                      <span className="text-[0.62rem] font-extrabold px-1.5 py-0.5 rounded-full bg-red-500 text-white shadow-[0_2px_6px_rgba(239,68,68,0.4)]">2</span>
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/messagerie"
                      onClick={() => setOpen(false)}
                      className="group flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-white/[0.04] transition"
                    >
                      <span className="w-9 h-9 rounded-lg bg-white/[0.06] border border-white/[0.08] flex items-center justify-center text-white/70 flex-shrink-0">
                        <MessageSquare size={15} strokeWidth={2.2} />
                      </span>
                      <span className="flex-1 font-semibold text-[0.9rem] text-white/85">Messagerie</span>
                      <ChevronRight size={14} className="text-white/30" />
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/mon-profil"
                      onClick={() => setOpen(false)}
                      className="group flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-white/[0.04] transition"
                    >
                      <span className="w-9 h-9 rounded-lg bg-white/[0.06] border border-white/[0.08] flex items-center justify-center text-white/70 flex-shrink-0">
                        <Users size={15} strokeWidth={2.2} />
                      </span>
                      <span className="flex-1 font-semibold text-[0.9rem] text-white/85">Mon profil</span>
                      <ChevronRight size={14} className="text-white/30" />
                    </Link>
                  </li>
                  <li>
                    <form action={logoutAction}>
                      <button
                        type="submit"
                        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-red-500/10 text-left transition"
                      >
                        <span className="w-9 h-9 rounded-lg bg-red-500/15 border border-red-400/25 flex items-center justify-center text-red-300 flex-shrink-0">
                          <LogOut size={15} strokeWidth={2.2} />
                        </span>
                        <span className="flex-1 font-bold text-[0.9rem] text-red-200">Se déconnecter</span>
                      </button>
                    </form>
                  </li>
                </ul>
              </div>
            )}

            {/* Découvrir */}
            <div className="px-3 py-3 border-t border-white/[0.05]">
              <div className="text-[0.62rem] font-extrabold tracking-[0.18em] text-white/40 uppercase px-4 py-2">
                Découvrir
              </div>
              <ul className="space-y-1">
                {SECONDARY_NAV.map((item) => {
                  const active = isActive(pathname, item.href);
                  const Icon = item.icon;
                  return (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        onClick={() => setOpen(false)}
                        className={`group flex items-center gap-3 px-3 py-2.5 rounded-xl transition ${
                          active ? "bg-brand-500/[0.10] text-brand-400" : "text-white/75 hover:bg-white/[0.04] hover:text-white"
                        }`}
                      >
                        <Icon size={15} strokeWidth={2.2} className={active ? "text-brand-400" : "text-white/50"} />
                        <span className="flex-1 font-semibold text-[0.88rem]">{item.label}</span>
                        <ChevronRight size={13} className={active ? "text-brand-400" : "text-white/25"} />
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>

          </div>

          {/* ─── Footer légal ─── */}
          <div
            className="flex-shrink-0 px-5 py-3.5 border-t border-white/[0.06] bg-black/20"
            style={{ paddingBottom: "max(14px, env(safe-area-inset-bottom, 14px))" }}
          >
            <div className="flex flex-wrap items-center justify-center gap-x-2.5 gap-y-1 text-[0.74rem] text-white/45">
              {LEGAL.map((l, i) => (
                <span key={l.href} className="inline-flex items-center gap-2.5">
                  <Link
                    href={l.href}
                    onClick={() => setOpen(false)}
                    className="hover:text-white/80 transition"
                  >
                    {l.label}
                  </Link>
                  {i < LEGAL.length - 1 && <span className="text-white/20">·</span>}
                </span>
              ))}
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
