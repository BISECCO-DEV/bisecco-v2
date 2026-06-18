import type { Metadata } from "next";
import Link from "next/link";
import {
  Newspaper, ArrowRight, TrendingUp, BookOpen,
  ShieldCheck, Sparkles, Hammer, Mail, Calendar, Clock,
} from "lucide-react";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { JsonLd } from "@/components/ui/JsonLd";

export const metadata: Metadata = {
  title: "Blog · Conseils, guides et actualités artisanat",
  description:
    "Le blog Bisecco : guides pratiques travaux, sécurité, vérification SIREN, tendances 2026, métiers de professionnel, législation et conseils pour particuliers comme professionnels.",
  alternates: { canonical: "/blog" },
};

export const dynamic = "force-dynamic";

type Article = {
  id: number;
  slug: string;
  title: string;
  excerpt: string | null;
  image_url: string | null;
  author: string;
  read_time: string | null;
  published_at: string;
};

async function fetchPublishedArticles(): Promise<Article[]> {
  const admin = createSupabaseAdminClient();
  const { data } = await admin
    .from("blog_articles")
    .select("id, slug, title, excerpt, image_url, author, read_time, published_at")
    .eq("status", "published")
    .lte("published_at", new Date().toISOString())
    .order("published_at", { ascending: false });
  return (data ?? []) as Article[];
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" });
}

export default async function BlogPage() {
  const articles = await fetchPublishedArticles();
  const hasPosts = articles.length > 0;
  const featured = hasPosts ? articles[0] : null;
  const otherPosts = hasPosts ? articles.slice(1) : [];

  const blogSchema = {
    "@context": "https://schema.org",
    "@type": "Blog",
    name: "Blog Bisecco",
    url: "https://bisecco.fr/blog",
    description: "Conseils, guides et actualités sur l'artisanat français.",
    publisher: { "@type": "Organization", name: "Bisecco" },
    blogPost: articles.slice(0, 5).map((p) => ({
      "@type": "BlogPosting",
      headline: p.title,
      description: p.excerpt ?? "",
      image: p.image_url ?? undefined,
      datePublished: p.published_at,
      author: { "@type": "Person", name: p.author },
      url: `https://bisecco.fr/blog/${p.slug}`,
    })),
  };

  return (
    <>
      <JsonLd data={blogSchema} />

      <div className="bg-gradient-to-b from-ink-50 via-white to-ink-50 min-h-screen">
        {/* ═══════════ HERO ═══════════ */}
        <section className="relative bg-gradient-to-br from-ink-800 via-ink-700 to-ink-800 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full bg-brand-500/15 blur-[120px] pointer-events-none" />
          <div className="absolute -bottom-20 -left-32 w-[400px] h-[400px] rounded-full bg-blue-500/10 blur-[100px] pointer-events-none" />

          <div className="container-default relative py-14 lg:py-20">
            <div className="max-w-3xl mx-auto text-center">
              <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/[0.08] border border-white/[0.12] backdrop-blur-md text-white/95 text-[0.72rem] font-bold tracking-[0.10em] uppercase">
                <Newspaper size={11} strokeWidth={2.6} className="text-brand-400" />
                Blog Bisecco {hasPosts && `· ${articles.length} article${articles.length > 1 ? "s" : ""}`}
              </span>
              <h1 className="mt-5 text-[40px] sm:text-[48px] lg:text-[56px] leading-[1.05] font-extrabold tracking-[-0.025em] text-white">
                Conseils, guides<br />
                <span className="text-brand-500">&amp; actualités artisanat.</span>
              </h1>
              <p className="mt-6 text-[1.08rem] lg:text-[1.18rem] text-white/75 max-w-2xl mx-auto leading-relaxed">
                Tout ce qu&apos;il faut savoir pour vos travaux, choisir le bon professionnel,
                vérifier un SIREN, comprendre la rénovation énergétique.
              </p>

              <div className="mt-7 flex flex-wrap justify-center gap-2">
                {[
                  { icon: TrendingUp, label: "Tendances 2026" },
                  { icon: BookOpen,   label: "Guides pratiques" },
                  { icon: ShieldCheck,label: "Sécurité & droits" },
                ].map((chip) => (
                  <span
                    key={chip.label}
                    className="inline-flex items-center gap-1.5 pl-2.5 pr-3.5 py-1.5 rounded-full bg-white/[0.06] border border-white/[0.10] text-[0.82rem] font-semibold text-white/90 backdrop-blur-sm"
                  >
                    <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-brand-500/20 text-brand-400">
                      <chip.icon size={11} strokeWidth={2.8} />
                    </span>
                    {chip.label}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ═══════════ CONTENU ═══════════ */}
        <section className="container-default py-14">
          {!hasPosts && <EmptyBlogState />}

          {hasPosts && featured && (
            <div className="grid lg:grid-cols-[1fr_320px] gap-8">
              <Link
                href={`/blog/${featured.slug}`}
                className="group relative block bg-ink-800 rounded-3xl overflow-hidden shadow-[0_20px_50px_-20px_rgba(13,30,74,0.35)] hover:shadow-[0_30px_60px_-20px_rgba(13,30,74,0.45)] transition-all"
              >
                <div
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                  style={{ backgroundImage: featured.image_url ? `url(${featured.image_url})` : "linear-gradient(135deg, #0d1e4a, #1e3a8a)" }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink-900 via-ink-900/85 to-ink-900/20" />

                <div className="relative p-7 sm:p-10 lg:p-12 min-h-[460px] flex flex-col justify-end text-white">
                  <div className="inline-flex items-center gap-2 mb-4">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-500/20 border border-brand-500/40 text-brand-300 text-[0.7rem] font-bold uppercase tracking-[0.12em] backdrop-blur-sm">
                      <Sparkles size={10} /> À la une
                    </span>
                  </div>

                  <h2 className="text-2xl sm:text-3xl lg:text-[2.25rem] font-extrabold leading-[1.15] tracking-tight max-w-3xl">
                    {featured.title}
                  </h2>
                  {featured.excerpt && (
                    <p className="mt-4 text-white/80 max-w-2xl text-[0.95rem] leading-relaxed line-clamp-3">
                      {featured.excerpt}
                    </p>
                  )}
                  <div className="mt-6 flex items-center gap-3 text-xs text-white/70">
                    <span className="inline-flex items-center gap-1"><Calendar size={11} /> {formatDate(featured.published_at)}</span>
                    {featured.read_time && (
                      <span className="inline-flex items-center gap-1"><Clock size={11} /> {featured.read_time}</span>
                    )}
                    <span className="ml-auto inline-flex items-center gap-1.5 text-brand-300 font-bold text-sm">
                      Lire <ArrowRight size={14} />
                    </span>
                  </div>
                </div>
              </Link>

              <aside className="space-y-6">
                <div className="bg-white rounded-3xl border border-ink-100 p-6">
                  <h3 className="font-extrabold text-ink-700 text-sm flex items-center gap-2">
                    <Mail size={14} className="text-brand-500" /> Newsletter
                  </h3>
                  <p className="mt-2 text-xs text-ink-500 leading-relaxed">
                    Reçois 1 mail par semaine avec les meilleurs conseils travaux + nos nouveaux articles.
                  </p>
                  <Link
                    href="/contact?sujet=newsletter"
                    className="mt-3 inline-flex items-center gap-1.5 text-xs font-extrabold text-brand-600 hover:underline"
                  >
                    S&apos;inscrire <ArrowRight size={11} />
                  </Link>
                </div>
              </aside>
            </div>
          )}

          {hasPosts && otherPosts.length > 0 && (
            <div className="mt-14">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-ink-700 tracking-tight mb-6">
                Tous les articles
              </h2>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {otherPosts.map((a) => (
                  <Link
                    key={a.id}
                    href={`/blog/${a.slug}`}
                    className="group flex flex-col bg-white rounded-2xl overflow-hidden border border-ink-100 hover:border-brand-200 hover:-translate-y-1 hover:shadow-[0_20px_40px_-20px_rgba(13,30,74,0.18)] transition-all"
                  >
                    <div className="relative aspect-[16/10] overflow-hidden bg-ink-100">
                      {a.image_url && (
                        <div
                          className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                          style={{ backgroundImage: `url(${a.image_url})` }}
                        />
                      )}
                    </div>
                    <div className="p-5 flex-1 flex flex-col">
                      <h3 className="font-extrabold text-ink-700 text-[0.96rem] leading-snug group-hover:text-brand-500 transition line-clamp-2">
                        {a.title}
                      </h3>
                      {a.excerpt && (
                        <p className="text-[0.82rem] text-ink-500 mt-2 line-clamp-2">{a.excerpt}</p>
                      )}
                      <div className="mt-auto pt-4 flex items-center gap-2 text-[0.74rem] text-ink-400">
                        <Calendar size={11} /> {formatDate(a.published_at)}
                        {a.read_time && (
                          <>
                            <span className="text-ink-300">·</span>
                            <Clock size={11} /> {a.read_time}
                          </>
                        )}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </section>
      </div>
    </>
  );
}

function EmptyBlogState() {
  return (
    <div className="max-w-2xl mx-auto text-center py-12">
      <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-brand-50 text-brand-500 mb-6">
        <Hammer size={36} strokeWidth={2.2} />
      </div>
      <h2 className="text-2xl sm:text-3xl font-extrabold text-ink-700 tracking-tight">
        Les premiers articles arrivent bientôt
      </h2>
      <p className="mt-3 text-ink-500 leading-relaxed">
        Notre équipe rédige actuellement les premiers guides pratiques et conseils
        pour les professionnels et les particuliers. Reviens dans quelques jours, ou
        inscris-toi à la newsletter pour être prévenu dès qu&apos;un article est publié.
      </p>
      <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
        <Link
          href="/contact?sujet=newsletter"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-500 hover:bg-brand-600 text-white font-bold text-sm transition shadow-[0_6px_18px_-4px_rgba(240,122,47,0.5)]"
        >
          <Mail size={14} /> M&apos;avertir des nouveautés
        </Link>
        <Link
          href="/rechercher"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white border border-ink-200 text-ink-700 font-bold text-sm hover:bg-ink-50 transition"
        >
          Trouver un professionnel <ArrowRight size={14} />
        </Link>
      </div>
    </div>
  );
}
