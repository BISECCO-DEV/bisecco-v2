import {
  Home, Search, Briefcase, BriefcaseBusiness, Mail,
  Star, HelpCircle, FileText, Bell, MessageSquare, Users, Handshake, Newspaper,
  type LucideIcon,
} from "lucide-react";

export type NavLink = {
  href: string;
  label: string;
  icon: LucideIcon;
  /** Si true → réservé aux membres connectés. Caché des visiteurs anonymes. */
  requiresAuth?: boolean;
};

/**
 * Navigation principale · affichée à la fois dans le Header desktop
 * et dans le drawer mobile. Source unique pour éviter toute divergence.
 *
 * `requiresAuth: true` → le lien n'apparaît que pour les membres connectés.
 * Le middleware bloque aussi l'accès direct par URL avec redirection /connexion.
 */
export const MAIN_NAV: NavLink[] = [
  { href: "/",            label: "Accueil",     icon: Home },
  { href: "/rechercher",  label: "Rechercher",  icon: Search },
  // /metiers reste accessible directement par URL + via les liens internes (footer, contenu),
  // mais n'apparaît plus dans la nav principale (intégré dans /rechercher).
  { href: "/fil",         label: "Actu",        icon: Newspaper,         requiresAuth: true },
  { href: "/emploi",      label: "Emploi",      icon: BriefcaseBusiness, requiresAuth: true },
  { href: "/messagerie",  label: "Messagerie",  icon: MessageSquare,     requiresAuth: true },
  { href: "/partenaires", label: "Mon réseau",  icon: Handshake,         requiresAuth: true },
  { href: "/contact",     label: "Contact",     icon: Mail,              requiresAuth: true },
];

/** Filtre les liens de nav selon l'état de connexion. */
export function filterNavForUser<T extends NavLink>(links: T[], isConnected: boolean): T[] {
  if (isConnected) return links;
  return links.filter((l) => !l.requiresAuth);
}

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
