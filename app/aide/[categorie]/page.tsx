import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, MessageCircle, Search } from "lucide-react";

const CATEGORIES: Record<string, { title: string; description: string; articles: { slug: string; title: string; readTime: string }[] }> = {
  compte: {
    title: "Mon compte",
    description: "Inscription, profil, paramètres, sécurité",
    articles: [
      { slug: "creer-compte",         title: "Comment créer mon compte sur Bisecco ?",            readTime: "2 min" },
      { slug: "modifier-profil",      title: "Modifier mon profil (photos, infos, services)",     readTime: "3 min" },
      { slug: "mot-de-passe-oublie",  title: "J'ai oublié mon mot de passe, que faire ?",         readTime: "1 min" },
      { slug: "supprimer-compte",     title: "Comment supprimer définitivement mon compte ?",     readTime: "2 min" },
      { slug: "verifier-email",       title: "Pourquoi vérifier mon adresse email ?",             readTime: "1 min" },
      { slug: "notifications",        title: "Gérer mes notifications (email, push, SMS)",       readTime: "2 min" },
      { slug: "2fa",                  title: "Activer l'authentification à deux facteurs",       readTime: "3 min" },
    ],
  },
  artisans: {
    title: "Pour les artisans",
    description: "Inscription artisan, validation SIREN, profil pro",
    articles: [
      { slug: "inscription-artisan", title: "Comment m'inscrire en tant qu'artisan ?",            readTime: "3 min" },
      { slug: "siren-pourquoi",       title: "Pourquoi avoir besoin de mon numéro SIREN ?",        readTime: "2 min" },
      { slug: "validation-profil",    title: "Combien de temps pour valider mon profil ?",         readTime: "1 min" },
      { slug: "ajouter-services",     title: "Ajouter mes services et tarifs",                    readTime: "3 min" },
      { slug: "galerie-photos",       title: "Optimiser ma galerie de réalisations",              readTime: "4 min" },
      { slug: "recevoir-leads",       title: "Comment recevoir mes premiers leads ?",              readTime: "5 min" },
    ],
  },
  devis: {
    title: "Devis & contact",
    description: "Demander, comparer, accepter un devis",
    articles: [
      { slug: "demander-devis",       title: "Comment demander un devis gratuit ?",                readTime: "2 min" },
      { slug: "delai-reponse",        title: "Délai de réponse moyen des artisans",                readTime: "1 min" },
      { slug: "comparer-devis",       title: "Comparer plusieurs devis efficacement",              readTime: "4 min" },
      { slug: "accepter-devis",       title: "Accepter un devis et signer le contrat",             readTime: "3 min" },
    ],
  },
  messagerie: {
    title: "Messagerie",
    description: "Envoyer, signaler, modérer",
    articles: [
      { slug: "envoyer-message",      title: "Envoyer un premier message à un artisan",            readTime: "1 min" },
      { slug: "signaler-utilisateur", title: "Signaler un comportement inapproprié",               readTime: "2 min" },
    ],
  },
  abonnements: {
    title: "Abonnements Pro",
    description: "Plans, paiement, facturation, annulation",
    articles: [
      { slug: "plans-pro",            title: "Différences entre Gratuit, Pro et Premium",         readTime: "3 min" },
      { slug: "annuler-abonnement",   title: "Comment annuler mon abonnement ?",                  readTime: "2 min" },
      { slug: "factures",             title: "Télécharger mes factures",                          readTime: "1 min" },
      { slug: "changer-plan",         title: "Passer du Pro au Premium (ou inversement)",         readTime: "2 min" },
    ],
  },
  securite: {
    title: "Sécurité & RGPD",
    description: "Données, vie privée, droits d'accès et de suppression",
    articles: [
      { slug: "donnees-personnelles", title: "Quelles données collectons-nous ?",                  readTime: "4 min" },
      { slug: "exporter-donnees",     title: "Exporter toutes mes données (RGPD)",                readTime: "2 min" },
      { slug: "supprimer-donnees",    title: "Demander la suppression de mes données",            readTime: "2 min" },
      { slug: "cookies",              title: "Politique cookies en détail",                       readTime: "3 min" },
      { slug: "phishing",             title: "Reconnaître un email Bisecco officiel",             readTime: "2 min" },
    ],
  },
};

type Props = { params: Promise<{ categorie: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { categorie } = await params;
  const cat = CATEGORIES[categorie];
  if (!cat) return { title: "Catégorie introuvable" };
  return { title: `${cat.title} — Centre d'aide`, description: cat.description };
}

export default async function AideCategoriePage({ params }: Props) {
  const { categorie } = await params;
  const cat = CATEGORIES[categorie];
  if (!cat) notFound();

  return (
    <div className="bg-ink-50 min-h-screen pb-16">
      <div className="container-default max-w-4xl py-10">
        <Link href="/aide" className="inline-flex items-center gap-1.5 text-sm text-ink-500 hover:text-brand-500 font-semibold transition">
          <ArrowLeft size={14} /> Centre d&apos;aide
        </Link>

        <div className="mt-5">
          <h1 className="text-3xl md:text-4xl font-bold text-ink-700 tracking-[-0.02em]">{cat.title}</h1>
          <p className="text-ink-400 mt-2">{cat.description}</p>
        </div>

        {/* Search box */}
        <div className="mt-7 flex items-center gap-3 px-4 py-3 rounded-2xl bg-white shadow-card border border-ink-100">
          <Search size={16} className="text-ink-400" />
          <input
            type="text"
            placeholder={`Rechercher dans « ${cat.title} »…`}
            className="flex-1 bg-transparent outline-none text-sm placeholder:text-ink-300"
          />
        </div>

        {/* Articles list */}
        <div className="mt-6 bg-white rounded-2xl border border-ink-100 overflow-hidden">
          {cat.articles.map((a, i) => (
            <Link
              key={a.slug}
              href={`/aide/article/${a.slug}`}
              className={`flex items-center justify-between px-5 py-4 hover:bg-ink-50/60 transition group ${i > 0 ? "border-t border-ink-100" : ""}`}
            >
              <div className="flex-1">
                <h3 className="font-semibold text-ink-700 group-hover:text-brand-500 transition">
                  {a.title}
                </h3>
                <p className="text-xs text-ink-400 mt-0.5">{a.readTime} de lecture</p>
              </div>
              <ArrowRight size={14} className="text-ink-300 group-hover:text-brand-500 group-hover:translate-x-0.5 transition" />
            </Link>
          ))}
        </div>

        {/* Contact */}
        <div className="mt-8 bg-gradient-to-br from-brand-50 to-amber-50/30 rounded-2xl p-6 border border-brand-200/60 flex items-center gap-4 flex-wrap">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <div className="w-11 h-11 rounded-xl bg-white shadow-sm flex items-center justify-center flex-shrink-0">
              <MessageCircle size={18} className="text-brand-500" />
            </div>
            <div>
              <h3 className="font-bold text-ink-700">Vous ne trouvez pas votre réponse ?</h3>
              <p className="text-xs text-ink-500 mt-0.5">Notre équipe vous répond sous 24h.</p>
            </div>
          </div>
          <Link href="/contact" className="btn-primary text-sm">
            Contacter le support
          </Link>
        </div>
      </div>
    </div>
  );
}
