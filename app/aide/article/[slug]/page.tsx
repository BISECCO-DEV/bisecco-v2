import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Clock, ThumbsUp, ThumbsDown, MessageCircle, Share2 } from "lucide-react";

type Article = {
  title: string;
  excerpt: string;
  readTime: string;
  updated: string;
  category: { slug: string; label: string };
  content: { type: "p" | "h2" | "h3" | "list" | "note" | "warn"; text: string | string[] }[];
  related: { slug: string; title: string }[];
};

const ARTICLES: Record<string, Article> = {
  "creer-compte": {
    title: "Comment créer mon compte sur Bisecco ?",
    excerpt: "Étape par étape : inscription en 2 minutes en tant que particulier ou artisan.",
    readTime: "2 min",
    updated: "Mis à jour le 15 mai 2026",
    category: { slug: "compte", label: "Mon compte" },
    content: [
      { type: "p",    text: "Créer un compte sur Bisecco est gratuit et prend moins de 2 minutes. Voici les étapes." },
      { type: "h2",   text: "1. Choisir votre profil" },
      { type: "p",    text: "Sur la page d'inscription, sélectionnez si vous êtes Particulier (recherchez un artisan) ou Professionnel (vous êtes artisan)." },
      { type: "h2",   text: "2. Remplir vos informations" },
      { type: "list", text: ["Nom complet", "Adresse email valide", "Mot de passe (8 caractères minimum)", "Code postal et ville"] },
      { type: "h2",   text: "3. Pour les artisans : numéro SIREN" },
      { type: "p",    text: "Les artisans doivent fournir leur numéro SIREN (9 chiffres). Nous le vérifions automatiquement via l'API officielle du gouvernement. Si tout est OK, votre profil est validé en moins de 24h." },
      { type: "note", text: "💡 Astuce : vous pouvez aussi vous connecter via Google pour gagner du temps." },
      { type: "h2",   text: "4. Vérifier votre email" },
      { type: "p",    text: "Un email de confirmation est envoyé à l'adresse fournie. Cliquez sur le lien pour activer votre compte." },
    ],
    related: [
      { slug: "verifier-email",    title: "Pourquoi vérifier mon adresse email ?" },
      { slug: "modifier-profil",   title: "Modifier mon profil après inscription" },
      { slug: "siren-pourquoi",    title: "Pourquoi avoir besoin de mon SIREN ?" },
    ],
  },
};

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const a = ARTICLES[slug];
  if (!a) return { title: "Article introuvable" };
  return { title: `${a.title} — Aide`, description: a.excerpt };
}

export default async function AideArticlePage({ params }: Props) {
  const { slug } = await params;
  const article = ARTICLES[slug];
  if (!article) notFound();

  return (
    <div className="bg-ink-50 min-h-screen pb-16">
      <div className="container-default max-w-3xl py-10">
        <nav className="flex items-center gap-1.5 text-xs text-ink-400 mb-5">
          <Link href="/aide" className="hover:text-brand-500">Aide</Link>
          <span>/</span>
          <Link href={`/aide/${article.category.slug}`} className="hover:text-brand-500">{article.category.label}</Link>
          <span>/</span>
          <span className="text-ink-600 font-semibold truncate">{article.title}</span>
        </nav>

        <article className="bg-white rounded-3xl shadow-card border border-ink-100 p-8 md:p-12">
          <Link href={`/aide/${article.category.slug}`} className="inline-flex items-center gap-1.5 text-sm text-ink-500 hover:text-brand-500 font-semibold transition">
            <ArrowLeft size={14} /> Retour à {article.category.label}
          </Link>

          <h1 className="text-3xl md:text-[2.1rem] font-bold mt-5 text-ink-700 tracking-[-0.02em] leading-[1.15]">
            {article.title}
          </h1>
          <div className="flex items-center gap-3 mt-3 text-xs text-ink-400">
            <span className="inline-flex items-center gap-1"><Clock size={11} /> {article.readTime}</span>
            <span>·</span>
            <span>{article.updated}</span>
          </div>

          {/* Body */}
          <div className="mt-8 space-y-5">
            {article.content.map((block, i) => {
              if (block.type === "p")
                return <p key={i} className="text-ink-600 leading-relaxed">{block.text as string}</p>;
              if (block.type === "h2")
                return <h2 key={i} className="text-xl font-bold text-ink-700 tracking-tight mt-7 pt-3">{block.text as string}</h2>;
              if (block.type === "h3")
                return <h3 key={i} className="text-lg font-bold text-ink-700 tracking-tight mt-5">{block.text as string}</h3>;
              if (block.type === "list")
                return (
                  <ul key={i} className="space-y-2 my-3 pl-1">
                    {(block.text as string[]).map((it, j) => (
                      <li key={j} className="flex items-start gap-2.5 text-ink-600">
                        <span className="text-brand-500 font-bold mt-0.5">→</span>
                        <span>{it}</span>
                      </li>
                    ))}
                  </ul>
                );
              if (block.type === "note")
                return (
                  <div key={i} className="rounded-xl bg-blue-50 border-l-4 border-blue-400 p-4 text-blue-800 text-sm leading-relaxed">
                    {block.text as string}
                  </div>
                );
              if (block.type === "warn")
                return (
                  <div key={i} className="rounded-xl bg-amber-50 border-l-4 border-amber-400 p-4 text-amber-800 text-sm leading-relaxed">
                    {block.text as string}
                  </div>
                );
              return null;
            })}
          </div>

          {/* Was it helpful ? */}
          <div className="mt-12 pt-8 border-t border-ink-100 flex items-center justify-between flex-wrap gap-4">
            <div>
              <h3 className="font-bold text-ink-700 text-sm">Cet article vous a-t-il aidé ?</h3>
              <div className="flex gap-2 mt-3">
                <button className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm font-bold hover:bg-emerald-100 transition">
                  <ThumbsUp size={13} /> Oui
                </button>
                <button className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm font-bold hover:bg-red-100 transition">
                  <ThumbsDown size={13} /> Non
                </button>
              </div>
            </div>
            <button className="inline-flex items-center gap-1.5 text-sm font-bold text-ink-500 hover:text-brand-500">
              <Share2 size={13} /> Partager
            </button>
          </div>
        </article>

        {/* Related */}
        {article.related.length > 0 && (
          <section className="mt-10">
            <h2 className="text-lg font-bold text-ink-700 mb-4 tracking-tight">Articles liés</h2>
            <div className="space-y-2">
              {article.related.map((r) => (
                <Link
                  key={r.slug}
                  href={`/aide/article/${r.slug}`}
                  className="flex items-center justify-between p-4 rounded-xl bg-white border border-ink-100 hover:border-brand-300 hover:-translate-y-0.5 transition group"
                >
                  <span className="font-semibold text-ink-700 group-hover:text-brand-500 transition">{r.title}</span>
                  <span className="text-brand-500">→</span>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Contact */}
        <div className="mt-10 p-6 rounded-2xl bg-white border border-ink-100 text-center">
          <MessageCircle size={20} className="mx-auto text-brand-500 mb-2" />
          <p className="text-sm text-ink-500 mb-4">Toujours besoin d&apos;aide ?</p>
          <Link href="/contact" className="btn-primary text-sm">Contacter le support</Link>
        </div>
      </div>
    </div>
  );
}
