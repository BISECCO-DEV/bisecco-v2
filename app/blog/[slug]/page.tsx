import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, Clock, Calendar, Share2 } from "lucide-react";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { JsonLd } from "@/components/ui/JsonLd";
import { breadcrumbSchema } from "@/lib/seo/schemas";
import { sanitizeBlogHtml } from "@/lib/blog/sanitize-html";

type Props = { params: Promise<{ slug: string }> };

type ArticleFull = {
  id: number;
  slug: string;
  title: string;
  excerpt: string | null;
  content_html: string;
  image_url: string | null;
  image_alt: string | null;
  author: string;
  read_time: string | null;
  published_at: string;
  meta_title: string | null;
  meta_description: string | null;
};

async function fetchArticleBySlug(slug: string): Promise<ArticleFull | null> {
  const admin = createSupabaseAdminClient();
  const { data } = await admin
    .from("blog_articles")
    .select("id, slug, title, excerpt, content_html, image_url, image_alt, author, read_time, published_at, meta_title, meta_description")
    .eq("slug", slug)
    .eq("status", "published")
    .lte("published_at", new Date().toISOString())
    .maybeSingle();
  return data as ArticleFull | null;
}

async function fetchRelatedArticles(excludeSlug: string, limit = 3): Promise<Array<Pick<ArticleFull, "slug" | "title" | "excerpt" | "image_url" | "read_time" | "published_at">>> {
  const admin = createSupabaseAdminClient();
  const { data } = await admin
    .from("blog_articles")
    .select("slug, title, excerpt, image_url, read_time, published_at")
    .eq("status", "published")
    .neq("slug", excludeSlug)
    .lte("published_at", new Date().toISOString())
    .order("published_at", { ascending: false })
    .limit(limit);
  return data ?? [];
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" });
}

/**
 * Wrapper isolé qui :
 *  1. Sanitise le HTML utilisateur (whitelist tags, strip script/footer/main…)
 *  2. Si le contenu reste trop court → affiche un message "Article en cours"
 *  3. Garantit qu'aucune balise du content ne peut casser le layout parent
 */
function BlogContent({ html }: { html: string }) {
  const clean = sanitizeBlogHtml(html).trim();
  const textOnly = clean.replace(/<[^>]+>/g, "").trim();

  if (textOnly.length < 30) {
    return (
      <div className="mt-10 p-6 rounded-2xl bg-ink-50 border border-ink-100 text-center">
        <p className="text-sm text-ink-500 italic">
          Cet article est en cours de rédaction. Reviens dans quelques jours pour le découvrir.
        </p>
      </div>
    );
  }

  return (
    <div
      className="mt-10 max-w-none [&_p]:text-ink-600 [&_p]:leading-relaxed [&_p]:my-4 [&_h2]:text-2xl [&_h2]:font-extrabold [&_h2]:text-ink-700 [&_h2]:mt-10 [&_h2]:mb-3 [&_h3]:text-xl [&_h3]:font-extrabold [&_h3]:text-ink-700 [&_h3]:mt-8 [&_h3]:mb-2 [&_ul]:my-4 [&_ul]:space-y-2 [&_ul]:list-disc [&_ul]:pl-6 [&_ol]:my-4 [&_ol]:list-decimal [&_ol]:pl-6 [&_li]:text-ink-600 [&_strong]:text-ink-700 [&_strong]:font-bold [&_a]:text-brand-600 [&_a]:font-bold [&_a:hover]:underline [&_blockquote]:border-l-4 [&_blockquote]:border-brand-500 [&_blockquote]:bg-brand-50/40 [&_blockquote]:py-3 [&_blockquote]:px-5 [&_blockquote]:rounded-r-xl [&_blockquote]:italic [&_blockquote]:my-6 [&_img]:rounded-xl [&_img]:my-6 [&_img]:max-w-full [&_img]:h-auto"
      dangerouslySetInnerHTML={{ __html: clean }}
    />
  );
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await fetchArticleBySlug(slug);
  if (!post) return { title: "Article introuvable", robots: { index: false } };
  const title = post.meta_title ?? post.title;
  const description = post.meta_description ?? post.excerpt ?? "Article du blog Bisecco";
  return {
    title,
    description,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: {
      title,
      description,
      type: "article",
      publishedTime: post.published_at,
      authors: [post.author],
      images: post.image_url ? [{ url: post.image_url, width: 1600, height: 900, alt: post.image_alt ?? post.title }] : [],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: post.image_url ? [post.image_url] : [],
    },
  };
}

export default async function BlogArticlePage({ params }: Props) {
  const { slug } = await params;
  const post = await fetchArticleBySlug(slug);
  if (!post) notFound();

  const related = await fetchRelatedArticles(slug, 3);

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt ?? "",
    image: post.image_url ?? undefined,
    datePublished: post.published_at,
    dateModified: post.published_at,
    author: { "@type": "Person", name: post.author },
    publisher: {
      "@type": "Organization",
      name: "Bisecco",
      logo: { "@type": "ImageObject", url: "https://bisecco.fr/logo.jpg" },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `https://bisecco.fr/blog/${post.slug}`,
    },
  };

  const breadcrumbs = breadcrumbSchema([
    { name: "Accueil", url: "/" },
    { name: "Blog", url: "/blog" },
    { name: post.title, url: `/blog/${post.slug}` },
  ]);

  return (
    <>
      <JsonLd data={[articleSchema, breadcrumbs]} />

      <div className="bg-gradient-to-b from-white via-white to-ink-50/40">
        {/* Cover hero */}
        {post.image_url && (
          <div
            className="relative h-[320px] sm:h-[420px] lg:h-[480px] bg-cover bg-center"
            style={{ backgroundImage: `url(${post.image_url})` }}
            aria-hidden
          >
            <div className="absolute inset-0 bg-gradient-to-t from-white via-white/60 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-b from-ink-900/40 via-transparent to-transparent" />
          </div>
        )}

        <article className={`container-default ${post.image_url ? "-mt-32 sm:-mt-40 lg:-mt-44" : "pt-14"} relative pb-20`}>
          <div className="max-w-3xl mx-auto bg-white rounded-3xl shadow-[0_20px_60px_-20px_rgba(13,30,74,0.18)] border border-ink-100 p-7 sm:p-10 lg:p-12">
            <Link
              href="/blog"
              className="inline-flex items-center gap-1.5 text-[0.86rem] text-ink-500 hover:text-brand-500 font-bold transition group"
            >
              <ArrowLeft size={14} strokeWidth={2.4} className="group-hover:-translate-x-0.5 transition-transform" />
              Retour au blog
            </Link>

            <div className="flex items-center flex-wrap gap-3 mt-5 text-xs text-ink-400">
              <span className="inline-flex items-center gap-1">
                <Calendar size={11} strokeWidth={2.4} /> {formatDate(post.published_at)}
              </span>
              {post.read_time && (
                <span className="inline-flex items-center gap-1">
                  <Clock size={11} strokeWidth={2.4} /> {post.read_time}
                </span>
              )}
            </div>

            <h1 className="text-[1.85rem] sm:text-[2.2rem] lg:text-[2.5rem] font-extrabold mt-5 text-ink-700 tracking-[-0.025em] leading-[1.1]">
              {post.title}
            </h1>
            {post.excerpt && (
              <p className="text-[1.1rem] text-ink-500 mt-5 leading-relaxed">{post.excerpt}</p>
            )}

            <div className="flex items-center justify-between mt-7 pt-6 border-t border-ink-100 gap-4 flex-wrap">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-brand-100 text-brand-700 flex items-center justify-center font-extrabold text-lg">
                  {post.author.charAt(0).toUpperCase()}
                </div>
                <div>
                  <div className="font-extrabold text-ink-700 text-[0.92rem]">{post.author}</div>
                  <div className="text-[0.78rem] text-ink-400 font-medium">Bisecco</div>
                </div>
              </div>
              <button
                type="button"
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-ink-50 border border-ink-200 text-[0.82rem] font-bold text-ink-700 hover:bg-white hover:border-brand-500 hover:text-brand-500 transition"
                aria-label="Partager l'article"
              >
                <Share2 size={13} strokeWidth={2.4} />
                Partager
              </button>
            </div>

            {/* Body : content_html sanitisé pour éviter qu'une balise mal fermée
                ou un tag structurel (</main>, <footer>, etc.) ne casse la page parente. */}
            <BlogContent html={post.content_html} />

            {/* CTA Bisecco */}
            <div className="mt-12 p-7 rounded-2xl bg-gradient-to-br from-ink-800 via-ink-700 to-ink-800 text-white relative overflow-hidden">
              <div className="absolute -top-12 -right-12 w-40 h-40 rounded-full bg-brand-500/30 blur-2xl pointer-events-none" />
              <div className="relative">
                <h3 className="font-extrabold text-xl tracking-tight">Prêt à trouver votre artisan ?</h3>
                <p className="text-white/70 text-[0.94rem] mt-2 leading-relaxed max-w-lg">
                  Demandez un devis gratuit en 2 minutes. Plusieurs artisans vérifiés SIREN vous répondent
                  sous 24h, sans commission ni intermédiaire.
                </p>
                <div className="mt-5 flex flex-wrap gap-3">
                  <Link
                    href="/devis"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-br from-brand-500 to-brand-600 text-white font-extrabold text-[0.88rem] shadow-[0_8px_20px_-4px_rgba(240,122,47,0.5)] hover:-translate-y-0.5 transition-all"
                  >
                    Demander mon devis <ArrowRight size={14} strokeWidth={2.6} />
                  </Link>
                  <Link
                    href="/rechercher"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/[0.08] border border-white/[0.14] text-white font-bold text-[0.88rem] hover:bg-white/[0.14] transition"
                  >
                    Parcourir les artisans
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Articles liés */}
          {related.length > 0 && (
            <section className="max-w-5xl mx-auto mt-14">
              <div className="flex items-end justify-between gap-4 mb-6">
                <h2 className="text-2xl font-extrabold text-ink-700 tracking-tight">À lire aussi</h2>
                <Link
                  href="/blog"
                  className="text-[0.86rem] font-bold text-brand-500 hover:text-brand-600 inline-flex items-center gap-1"
                >
                  Voir tout le blog <ArrowRight size={12} strokeWidth={2.6} />
                </Link>
              </div>
              <div className="grid sm:grid-cols-3 gap-5">
                {related.map((r) => (
                  <Link
                    key={r.slug}
                    href={`/blog/${r.slug}`}
                    className="group flex flex-col bg-white rounded-2xl overflow-hidden border border-ink-100 hover:border-brand-200 hover:-translate-y-1 hover:shadow-[0_20px_40px_-20px_rgba(13,30,74,0.18)] transition-all"
                  >
                    <div className="relative aspect-[16/10] overflow-hidden bg-ink-100">
                      {r.image_url && (
                        <div
                          className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                          style={{ backgroundImage: `url(${r.image_url})` }}
                        />
                      )}
                    </div>
                    <div className="p-5 flex-1 flex flex-col">
                      <h3 className="font-extrabold text-ink-700 text-[0.96rem] leading-snug group-hover:text-brand-500 transition line-clamp-2">
                        {r.title}
                      </h3>
                      {r.excerpt && (
                        <p className="text-[0.82rem] text-ink-500 mt-2 line-clamp-2">{r.excerpt}</p>
                      )}
                      <div className="mt-auto pt-4 flex items-center gap-2 text-[0.74rem] text-ink-400">
                        <Clock size={11} /> {r.read_time ?? "5 min"} · {formatDate(r.published_at)}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}
        </article>
      </div>
    </>
  );
}
