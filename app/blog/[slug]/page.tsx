import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, Clock, Calendar, Share2, Tag } from "lucide-react";
import { BLOG_POSTS, findPost, relatedPosts, type ContentBlock } from "@/lib/blog";
import { JsonLd } from "@/components/ui/JsonLd";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return BLOG_POSTS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = findPost(slug);
  if (!post) return { title: "Article introuvable" };
  return {
    title: post.title,
    description: post.excerpt,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: "article",
      publishedTime: post.dateIso,
      authors: [post.author.name],
      images: [{ url: post.cover, width: 1600, height: 900, alt: post.title }],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.excerpt,
      images: [post.cover],
    },
  };
}

function ContentRenderer({ blocks }: { blocks: ContentBlock[] }) {
  return (
    <div className="mt-10 space-y-5">
      {blocks.map((block, i) => {
        switch (block.type) {
          case "p":
            return (
              <p key={i} className="text-ink-600 leading-relaxed text-[1.02rem]">
                {block.text}
              </p>
            );
          case "h2":
            return (
              <h2 key={i} className="text-2xl sm:text-[1.65rem] font-extrabold text-ink-700 tracking-tight mt-10 pt-4">
                {block.text}
              </h2>
            );
          case "h3":
            return (
              <h3 key={i} className="text-xl font-extrabold text-ink-700 tracking-tight mt-8">
                {block.text}
              </h3>
            );
          case "list":
            return (
              <ul key={i} className="space-y-2.5 my-4">
                {block.items.map((item, j) => (
                  <li key={j} className="flex items-start gap-3 text-ink-600">
                    <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-brand-100 text-brand-600 flex-shrink-0 mt-0.5 text-[0.7rem] font-extrabold">
                      ✓
                    </span>
                    <span className="text-[1.02rem] leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>
            );
          case "quote":
            return (
              <blockquote
                key={i}
                className="relative my-8 pl-6 border-l-[3px] border-brand-500 bg-brand-50/40 rounded-r-xl py-4 pr-5"
              >
                <span className="absolute -top-3 left-3 text-brand-500 text-3xl font-serif leading-none">“</span>
                <p className="italic text-ink-700 text-[1.1rem] leading-relaxed">{block.text}</p>
                {block.author && (
                  <footer className="mt-2 text-[0.84rem] font-semibold text-brand-700 not-italic">
                    — {block.author}
                  </footer>
                )}
              </blockquote>
            );
          default:
            return null;
        }
      })}
    </div>
  );
}

export default async function BlogPost({ params }: Props) {
  const { slug } = await params;
  const post = findPost(slug);
  if (!post) notFound();

  const related = relatedPosts(slug, 3);

  // JSON-LD BlogPosting
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt,
    image: post.cover,
    datePublished: post.dateIso,
    dateModified: post.dateIso,
    author: {
      "@type": "Person",
      name: post.author.name,
      jobTitle: post.author.role,
    },
    publisher: {
      "@type": "Organization",
      name: "Bisecco",
      logo: { "@type": "ImageObject", url: "https://bisecco.fr/logo.jpg" },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `https://bisecco.fr/blog/${post.slug}`,
    },
    keywords: post.tags.join(", "),
  };

  return (
    <>
      <JsonLd data={articleSchema} />

      <div className="bg-gradient-to-b from-white via-white to-ink-50/40">
        {/* Cover hero */}
        <div
          className="relative h-[320px] sm:h-[420px] lg:h-[480px] bg-cover bg-center"
          style={{ backgroundImage: `url(${post.cover})` }}
          aria-hidden
        >
          <div className="absolute inset-0 bg-gradient-to-t from-white via-white/60 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-b from-ink-900/40 via-transparent to-transparent" />
        </div>

        <article className="container-default -mt-32 sm:-mt-40 lg:-mt-44 relative pb-20">
          <div className="max-w-3xl mx-auto bg-white rounded-3xl shadow-[0_20px_60px_-20px_rgba(13,30,74,0.18)] border border-ink-100 p-7 sm:p-10 lg:p-12">
            {/* Back link */}
            <Link
              href="/blog"
              className="inline-flex items-center gap-1.5 text-[0.86rem] text-ink-500 hover:text-brand-500 font-bold transition group"
            >
              <ArrowLeft size={14} strokeWidth={2.4} className="group-hover:-translate-x-0.5 transition-transform" />
              Retour au blog
            </Link>

            {/* Meta */}
            <div className="flex items-center flex-wrap gap-3 mt-5 text-xs">
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-brand-50 border border-brand-200 text-brand-700 font-extrabold tracking-[0.1em] uppercase">
                <Tag size={10} strokeWidth={2.6} /> {post.category}
              </span>
              <span className="text-ink-400 inline-flex items-center gap-1">
                <Calendar size={11} strokeWidth={2.4} /> {post.date}
              </span>
              <span className="text-ink-400 inline-flex items-center gap-1">
                <Clock size={11} strokeWidth={2.4} /> {post.readTime} de lecture
              </span>
            </div>

            {/* Title */}
            <h1 className="text-[1.85rem] sm:text-[2.2rem] lg:text-[2.5rem] font-extrabold mt-5 text-ink-700 tracking-[-0.025em] leading-[1.1]">
              {post.title}
            </h1>
            <p className="text-[1.1rem] text-ink-500 mt-5 leading-relaxed">{post.excerpt}</p>

            {/* Author + Share */}
            <div className="flex items-center justify-between mt-7 pt-6 border-t border-ink-100 gap-4 flex-wrap">
              <div className="flex items-center gap-3">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={post.author.avatar}
                  alt=""
                  className="w-12 h-12 rounded-full border-2 border-brand-100"
                  loading="lazy"
                />
                <div>
                  <div className="font-extrabold text-ink-700 text-[0.92rem]">{post.author.name}</div>
                  <div className="text-[0.78rem] text-ink-400 font-medium">{post.author.role}</div>
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

            {/* Body */}
            <ContentRenderer blocks={post.content} />

            {/* Tags */}
            {post.tags.length > 0 && (
              <div className="mt-10 pt-6 border-t border-ink-100 flex flex-wrap gap-2 items-center">
                <span className="text-[0.72rem] font-extrabold tracking-[0.14em] uppercase text-ink-400 mr-1">
                  Tags
                </span>
                {post.tags.map((t) => (
                  <span
                    key={t}
                    className="inline-flex items-center px-2.5 py-1 rounded-full bg-ink-50 border border-ink-200 text-[0.74rem] font-semibold text-ink-600"
                  >
                    #{t}
                  </span>
                ))}
              </div>
            )}

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
                    Demander mon devis
                    <ArrowRight size={14} strokeWidth={2.6} />
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
                    <div className="relative aspect-[16/10] overflow-hidden">
                      <div
                        className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                        style={{ backgroundImage: `url(${r.cover})` }}
                      />
                      <span className="absolute top-3 left-3 inline-flex items-center px-2.5 py-1 rounded-full bg-white/95 backdrop-blur-sm text-[0.66rem] font-extrabold uppercase tracking-[0.1em] text-ink-700">
                        {r.category}
                      </span>
                    </div>
                    <div className="p-5 flex-1 flex flex-col">
                      <h3 className="font-extrabold text-ink-700 text-[0.96rem] leading-snug group-hover:text-brand-500 transition line-clamp-2">
                        {r.title}
                      </h3>
                      <p className="text-[0.82rem] text-ink-500 mt-2 line-clamp-2">{r.excerpt}</p>
                      <div className="mt-auto pt-4 flex items-center gap-2 text-[0.74rem] text-ink-400">
                        <Clock size={11} /> {r.readTime} · {r.date}
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
