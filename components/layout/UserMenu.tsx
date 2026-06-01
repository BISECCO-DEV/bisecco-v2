"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  UserPlus, LogIn, LogOut, User, Settings, Star, FileText,
  Gift, Shield, ChevronDown, MessageCircle, Inbox,
} from "lucide-react";
import { logoutAction } from "@/lib/auth/actions";
import { CtaButton } from "@/components/ui/CtaButton";

export type UserMenuProps = {
  user: {
    name: string;
    email: string;
    role: "admin" | "artisan" | "particulier";
    profile_photo: string | null;
    client_number: string | null;
  } | null;
  unreadCvs?: number;
};

export function UserMenu({ user, unreadCvs = 0 }: UserMenuProps) {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, [open]);

  // Non connecté → boutons Inscription + Connexion (style ihos)
  if (!user) {
    return (
      <div className="hidden lg:flex items-center gap-2">
        <CtaButton href="/inscription" variant="white" size="sm" icon={UserPlus}>
          Inscription
        </CtaButton>
        <CtaButton href="/connexion" variant="primary" size="sm" icon={LogIn}>
          Connexion
        </CtaButton>
      </div>
    );
  }

  // Connecté → avatar + dropdown
  const initial = user.name.charAt(0).toUpperCase();
  const firstName = user.name.split(" ")[0] ?? user.email;
  const avatarUrl =
    user.profile_photo ??
    `https://api.dicebear.com/9.x/initials/svg?seed=${encodeURIComponent(user.name)}`;
  const roleLabel =
    user.role === "admin" ? "Admin" : user.role === "artisan" ? "Artisan" : "Particulier";
  const roleColor =
    user.role === "admin"
      ? "from-purple-500 to-pink-500"
      : user.role === "artisan"
        ? "from-brand-500 to-brand-600"
        : "from-blue-500 to-blue-600";

  return (
    <div ref={dropdownRef} className="hidden lg:block relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="inline-flex items-center gap-2 h-10 pl-1 pr-3 rounded-lg text-white bg-white/[0.10] border border-white/[0.20] hover:bg-white/[0.18] hover:border-white/[0.32] backdrop-blur-md transition"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={avatarUrl}
          alt=""
          className="w-8 h-8 rounded-md object-cover bg-white/10 border border-white/15"
        />
        <span className="text-[0.84rem] font-bold truncate max-w-[110px]">{firstName}</span>
        <ChevronDown size={14} className={`transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-72 rounded-2xl bg-white shadow-2xl border border-ink-100 overflow-hidden z-50 animate-fade-in">
          {/* En-tête */}
          <div className="p-4 bg-gradient-to-br from-ink-50 to-white border-b border-ink-100">
            <div className="flex items-center gap-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={avatarUrl}
                alt=""
                className="w-12 h-12 rounded-xl object-cover bg-ink-100 flex-shrink-0"
              />
              <div className="min-w-0 flex-1">
                <div className="font-extrabold text-ink-700 text-sm truncate">{user.name}</div>
                <div className="text-[0.7rem] text-ink-500 truncate">{user.email}</div>
              </div>
            </div>
            <span className={`mt-3 inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-gradient-to-br ${roleColor} text-white text-[0.65rem] font-bold uppercase tracking-wider`}>
              {user.role === "admin" ? <Shield size={9} /> : null}
              {roleLabel}
            </span>
          </div>

          {/* Liens */}
          <nav className="p-2">
            {user.role === "admin" && (
              <MenuLink href="/admin" icon={Shield} label="Tableau admin" highlight />
            )}
            <MenuLink href="/mon-profil" icon={User} label="Mon espace" />
            <MenuLink href="/messagerie" icon={MessageCircle} label="Messagerie" />
            {(user.role === "artisan" || user.role === "admin") && (
              <MenuLink
                href="/mon-profil/cvs-recus"
                icon={Inbox}
                label="CVs reçus"
                badge={unreadCvs > 0 ? (unreadCvs > 99 ? "99+" : String(unreadCvs)) : undefined}
              />
            )}
            <MenuLink href="/mon-profil/cv" icon={FileText} label="Mon CV" />
            <MenuLink href="/mon-profil/devis" icon={FileText} label="Mes devis" />
            <MenuLink href="/mon-profil/avis" icon={Star} label="Mes avis" />
            <MenuLink href="/parrainage" icon={Gift} label="Parrainage" />
            <MenuLink href="/mon-profil/parametres" icon={Settings} label="Paramètres" />
          </nav>

          {/* Déconnexion */}
          <div className="p-2 border-t border-ink-100">
            <form action={logoutAction}>
              <button
                type="submit"
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-bold text-red-600 hover:bg-red-50 transition"
              >
                <LogOut size={15} />
                Se déconnecter
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

function MenuLink({
  href, icon: Icon, label, highlight, badge,
}: {
  href: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  label: string;
  highlight?: boolean;
  badge?: string;
}) {
  return (
    <Link
      href={href}
      className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold transition ${
        highlight
          ? "text-purple-700 bg-purple-50 hover:bg-purple-100"
          : "text-ink-700 hover:bg-ink-50 hover:text-brand-600"
      }`}
    >
      <Icon size={15} />
      <span className="flex-1">{label}</span>
      {badge && (
        <span className="px-1.5 py-0.5 rounded-full bg-brand-500 text-white text-[0.62rem] font-extrabold tabular-nums">
          {badge}
        </span>
      )}
    </Link>
  );
}
