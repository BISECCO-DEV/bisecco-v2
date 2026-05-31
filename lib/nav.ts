import {
  Home, Search, Briefcase, BriefcaseBusiness, Mail,
  Star, HelpCircle, FileText, Bell, MessageSquare, Users, Handshake, Newspaper,
  type LucideIcon,
} from "lucide-react";

export type NavLink = {
  href: string;
  label: string;
  icon: LucideIcon;
};

/**
 * Navigation principale · affichée à la fois dans le Header desktop
 * et dans le drawer mobile. Source unique pour éviter toute divergence.
 */
export const MAIN_NAV: NavLink[] = [
  { href: "/",           label: "Accueil",     icon: Home },
  { href: "/fil",        label: "Fil",         icon: Newspaper },
  { href: "/rechercher", label: "Rechercher",  icon: Search },
  { href: "/metiers",    label: "Métiers",     icon: Briefcase },
  { href: "/emploi",     label: "Emploi",      icon: BriefcaseBusiness },
  { href: "/messagerie",  label: "Messagerie",  icon: MessageSquare },
  { href: "/partenaires", label: "Partenaires", icon: Handshake },
  { href: "/contact",     label: "Contact",     icon: Mail },
];

/**
 * Liens secondaires · affichés uniquement dans le drawer mobile (bonus).
 */
export const SECONDARY_NAV: NavLink[] = [
  { href: "/avis",  label: "Avis clients",        icon: Star },
  { href: "/aide",  label: "Centre d'aide",       icon: HelpCircle },
  { href: "/devis", label: "Demander un devis",   icon: FileText },
];

/**
 * Liens "Mon espace" · affichés dans le drawer mobile uniquement
 * (auth-aware en futur quand Supabase sera branché).
 */
export const ACCOUNT_NAV: NavLink[] = [
  { href: "/mon-profil/notifications", label: "Notifications", icon: Bell },
  { href: "/messagerie",                label: "Messagerie",    icon: MessageSquare },
  { href: "/mon-profil",                label: "Mon profil",    icon: Users },
];

export function isActive(pathname: string | null, href: string): boolean {
  if (!pathname) return false;
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(href + "/");
}
