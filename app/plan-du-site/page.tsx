import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Plan du site",
  description: "Navigation complète du site Bisecco : toutes les pages en un coup d'œil.",
  alternates: { canonical: "/plan-du-site" },
};

const SECTIONS = [
  {
    title: "Services",
    links: [
      { href: "/",                href_label: "Accueil" },
      { href: "/rechercher",      href_label: "Rechercher un professionnel" },
      { href: "/metiers",         href_label: "Tous les métiers" },
      { href: "/devis",           href_label: "Demander un devis" },
      { href: "/comparateur",     href_label: "Comparer des professionnels" },
      { href: "/avis",            href_label: "Tous les avis clients" },
    ],
  },
  {
    title: "Espace utilisateur",
    links: [
      { href: "/connexion",         href_label: "Connexion" },
      { href: "/inscription",       href_label: "Inscription" },
      { href: "/recuperation-compte", href_label: "Mot de passe oublié" },
      { href: "/mon-profil",         href_label: "Mon espace" },
      { href: "/mon-profil/edit",    href_label: "Modifier mon profil" },
      { href: "/mon-profil/devis",   href_label: "Mes devis" },
      { href: "/mon-profil/favoris", href_label: "Mes favoris" },
      { href: "/mon-profil/abonnement", href_label: "Mon abonnement" },
      { href: "/mon-profil/parametres", href_label: "Paramètres" },
      { href: "/messagerie",         href_label: "Messagerie" },
    ],
  },
  {
    title: "Bisecco",
    links: [
      { href: "/qui-sommes-nous",   href_label: "Qui sommes-nous" },
      { href: "/parrainage",        href_label: "Programme parrainage" },
      { href: "/blog",              href_label: "Blog" },
      { href: "/aide",              href_label: "Centre d'aide" },
      { href: "/contact",           href_label: "Contact" },
    ],
  },
  {
    title: "Pour les pros",
    links: [
      { href: "/partenaires-pro",   href_label: "Partenaires B2B" },
      { href: "/presse",            href_label: "Espace presse" },
      { href: "/carrieres",         href_label: "Carrières" },
    ],
  },
  {
    title: "Légal",
    links: [
      { href: "/mentions-legales",          href_label: "Mentions légales" },
      { href: "/politique-confidentialite", href_label: "Politique de confidentialité" },
      { href: "/cgu",                       href_label: "Conditions générales d'utilisation" },
      { href: "/politique-remboursement",   href_label: "Politique de remboursement" },
    ],
  },
];

export default function PlanDuSitePage() {
  return (
    <div className="bg-ink-50 min-h-screen pb-16">
      <div className="container-default py-12">
        <h1 className="text-3xl md:text-4xl font-bold text-ink-700 tracking-[-0.02em]">Plan du site</h1>
        <p className="text-ink-400 mt-2">Navigation complète de toutes les pages publiques de Bisecco.</p>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-10">
          {SECTIONS.map((s) => (
            <section key={s.title}>
              <h2 className="text-sm font-bold text-brand-500 tracking-wider uppercase mb-3">{s.title}</h2>
              <ul className="space-y-1.5">
                {s.links.map((l) => (
                  <li key={l.href}>
                    <Link href={l.href} className="text-ink-600 hover:text-brand-500 transition text-sm">
                      → {l.href_label}
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}
