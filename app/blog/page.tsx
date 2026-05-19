import type { Metadata } from "next";
import Link from "next/link";
import {
  Newspaper, ArrowRight, Clock, Calendar, TrendingUp, BookOpen,
  ShieldCheck, Lightbulb, Mail, Sparkles,
} from "lucide-react";
import { BLOG_POSTS } from "@/lib/blog";
import { BlogClient } from "./BlogClient";
import { JsonLd } from "@/components/ui/JsonLd";

export const metadata: Metadata = {
  title: "Blog — Conseils, guides et actualités artisanat",
  description:
    "Le blog Bisecco : guides pratiques travaux, sécurité, vérification SIREN, tendances 2026, métiers d'artisan, législation et conseils pour particuliers comme artisans.",
  alternates: { canonical: "/blog" },
};

const blogSchema = {
  "@context": "https://schema.org",
  "@type": "Blog",
  name: "Blog Bisecco",
  url: "https://bisecco.fr/blog",
  description: "Conseils, guides et actualités sur l'artisanat français.",
  publisher: { "@type": "Organization", name: "Bisecco" },
  blogPost: BLOG_POSTS.slice(0, 5).map((p) => ({
    "@type": "BlogPosting",
    headline: p.title,
    description: p.excerpt,
    image: p.cover,
    datePublished: p.dateIso,
    author: { "@type": "Person", name: p.author.name },
    url: `https://bisecco.fr/blog/${p.slug}`,
  })),
};

export default function BlogPage() {
  const featured = BLOG_POSTS.find((p) => p.featured) ?? BLOG_POSTS[0];
  const otherPosts = BLOG_POSTS.filter((p) => p.slug !== featured.slug);
  const popularPosts = [...BLOG_POSTS].slice(0, 4);

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
                Blog Bisecco · {BLOG_POSTS.length} articles
              </span>
              <h1 className="mt-5 text-[40px] sm:text-[48px] lg:text-[56px] leading-[1.05] font-extrabold tracking-[-0.025em] text-white">
                Conseils, guides<br />
                <span className="bg-gradient-to-r from-brand-400 via-brand-500 to-brand-600 bg-clip-text text-transparent">
                  & actualités artisanat.
                </span>
              </h1>
              <p className="mt-6 text-[1.08rem] lg:text-[1.18rem] text-white/75 max-w-2xl mx-auto leading-relaxed">
                Tout ce qu&apos;il faut savoir pour vos travaux, choisir le bon artisan,
                vérifier un SIREN, comprendre la rénovation énergétique. Mis à jour
                <strong className="text-white"> chaque semaine</strong>.
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

        {/* ═══════════ FEATURED + SIDEBAR ═══════════ */}
        <section className="container-default py-14">
          <div className="grid lg:grid-cols-[1fr_320px] gap-8">

            {/* Featured article — large card */}
            <Link
              href={`/blog/${featured.slug}`}
              className="group relative block bg-ink-800 rounded-3xl overflow-hidden shadow-[0_20px_50px_-20px_rgba(13,30,74,0.35)] hover:shadow-[0_30px_60px_-20px_rgba(13,30,74,0.45)] transition-all"
            >
              <div
                className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                style={{ backgroundImage: `url(${featured.cover})` }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink-900 via-ink-900/85 to-ink-900/20" />
              <div className="absolute inset-0 bg-gradient-to-br from-brand-500/15 via-transparent to-transparent" />

              <div className="relative p-7 sm:p-10 lg:p-12 min-h-[460px] flex flex-col justify-end text-white">
                <div className="inline-flex items-center gap-2 mb-4">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-500/20 border border-brand-500/40 text-brand-300 text-[0.7rem] font-bold uppercase tracking-[0.12em] backdrop-blur-sm">
                    <Sparkles size={10} />
                    À la une
                  </span>
                  <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-white/[0.10] border border-white/[0.15] text-white/85 text-[0.72rem] font-bold uppercase tracking-wider backdrop-blur-sm">
                    {featured.category}
                  </span>
                </div>

                <h2 className="text-2xl sm:text-3xl lg:text-[2.25rem] font-extrabold leading-[1.15] tracking-tight max-w-3xl">
                  {featured.title}
                </h2>
                <p className="mt-4 text-white/80 max-w-2xl text-[0.95rem] leading-relaxed line-clamp-3">
                  {featured.excerpt}
                </p>

                <div className="mt-6 flex items-center justify-between flex-wrap gap-4">
                  <div className="flex items-center gap-3">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={featured.author.avatar}
                      alt=""
                      className="w-10 h-10 rounded-full border-2 border-white/20"
                      loading="lazy"
                    />
                    <div>
                      <div className="font-bold text-[0.88rem]">{featured.author.name}</div>
                      <div className="text-[0.74rem] text-white/55">
                        {featured.date} · {featured.readTime} de lecture
                      </div>
                    </div>
                  </div>
                  <span className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-br from-brand-500 to-brand-600 text-white font-bold text-[0.88rem] shadow-[0_8px_20px_-4px_rgba(240,122,47,0.5)] group-hover:-translate-y-0.5 transition-all">
                    Lire l&apos;article
                    <ArrowRight size={15} strokeWidth={2.4} className="group-hover:translate-x-0.5 transition-transform" />
                  </span>
                </div>
              </div>
            </Link>

            {/* Sidebar */}
            <aside className="space-y-4 lg:sticky lg:top-24 lg:self-start">

              {/* Top articles */}
              <div className="bg-white rounded-2xl border border-ink-100 p-5">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 rounded-lg bg-brand-50 flex items-center justify-center text-brand-500">
                    <TrendingUp size={15} strokeWidth={2.4} />
                  </div>
                  <h3 className="font-extrabold text-ink-700 text-[0.95rem]">Articles populaires</h3>
                </div>
                <ul className="space-y-3">
                  {popularPosts.map((p, i) => (
                    <li key={p.slug}>
                      <Link
                        href={`/blog/${p.slug}`}
                        className="group flex items-start gap-3"
                      >
                        <span className="flex-shrink-0 w-7 h-7 rounded-full bg-ink-50 group-hover:bg-brand-500 group-hover:text-white text-ink-400 flex items-center justify-center text-[0.74rem] font-extrabold transition">
                          {i + 1}
                        </span>
                        <div className="flex-1 min-w-0">
                          <div className="font-bold text-ink-700 group-hover:text-brand-500 text-[0.86rem] leading-snug transition line-clamp-2">
                            {p.title}
                          </div>
                          <div className="text-[0.7rem] text-ink-400 mt-1 inline-flex items-center gap-1.5">
                            <Clock size={10} />
                            {p.readTime}
                          </div>
                        </div>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Newsletter */}
              <div className="relative bg-gradient-to-br from-ink-800 via-ink-700 to-ink-800 rounded-2xl p-5 text-white overflow-hidden">
                <div className="absolute -top-10 -right-10 w-32 h-32 rounded-full bg-brand-500/25 blur-2xl pointer-events-none" />
                <div className="relative">
                  <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-brand-500/15 border border-brand-500/25 text-brand-400 text-[0.65rem] font-bold tracking-[0.10em] uppercase">
                    <Mail size={9} strokeWidth={2.8} />
                    Newsletter
                  </div>
                  <h3 className="mt-3 font-extrabold text-[1.05rem] leading-tight">
                    Le meilleur du blog,<br />
                    <span className="text-brand-400">tous les mois</span>.
                  </h3>
                  <p className="text-[0.78rem] text-white/65 mt-2 leading-snug">
                    1 email par mois. Aucun spam. Désinscription en 1 clic.
                  </p>
                  <form className="mt-4 space-y-2">
                    <input
                      type="email"
                      required
                      placeholder="votre@email.fr"
                      aria-label="Email"
                      className="w-full h-10 px-3 rounded-lg bg-white/[0.08] border border-white/[0.14] text-white text-[0.84rem] placeholder:text-white/40 focus:border-brand-500 outline-none transition"
                    />
                    <button
                      type="submit"
                      className="w-full inline-flex items-center justify-center gap-1.5 h-10 rounded-lg bg-gradient-to-br from-brand-500 to-brand-600 text-white font-extrabold text-[0.84rem] shadow-[0_6px_16px_-4px_rgba(240,122,47,0.5)] hover:-translate-y-0.5 transition-all"
                    >
                      Je m&apos;inscris
                      <ArrowRight size={13} strokeWidth={2.6} />
                    </button>
                  </form>
                </div>
              </div>

              {/* CTA artisan */}
              <Link
                href="/inscription"
                className="group block bg-white rounded-2xl border border-ink-100 p-5 hover:border-brand-300 hover:-translate-y-0.5 hover:shadow-[0_10px_30px_-10px_rgba(13,30,74,0.12)] transition-all"
              >
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-600 flex-shrink-0">
                    <Lightbulb size={17} strokeWidth={2.2} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-extrabold text-ink-700 text-[0.92rem]">Vous êtes artisan ?</div>
                    <div className="text-[0.78rem] text-ink-500 mt-1 leading-snug">
                      Rejoignez Bisecco gratuitement et boostez votre visibilité locale.
                    </div>
                    <span className="inline-flex items-center gap-1 mt-2 text-brand-500 text-[0.78rem] font-bold">
                      Créer mon profil <ArrowRight size={11} strokeWidth={2.6} className="group-hover:translate-x-0.5 transition-transform" />
                    </span>
                  </div>
                </div>
              </Link>
            </aside>
          </div>
        </section>

        {/* ═══════════ ARTICLES GRID (avec filters client) ═══════════ */}
        <section className="container-default pb-20">
          <div className="flex items-end justify-between gap-4 flex-wrap mb-8">
            <div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-ink-700 tracking-tight">
                Tous les articles
              </h2>
              <p className="mt-1.5 text-ink-500 text-[0.94rem]">
                Filtrez par catégorie ou recherchez un sujet précis.
              </p>
            </div>
            <span className="inline-flex items-center gap-1.5 text-[0.78rem] text-ink-400 font-semibold">
              <Calendar size={13} />
              Mis à jour chaque semaine
            </span>
          </div>

          <BlogClient posts={otherPosts} />
        </section>
      </div>
    </>
  );
}
