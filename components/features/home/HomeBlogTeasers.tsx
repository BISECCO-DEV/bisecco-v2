import Link from "next/link";
import { Newspaper, ArrowRight, Clock, Calendar } from "lucide-react";
import { BLOG_POSTS } from "@/lib/blog";

const CATEGORY_COLORS: Record<string, string> = {
  "Guide":       "bg-blue-50 text-blue-700 border-blue-200",
  "Sécurité":    "bg-emerald-50 text-emerald-700 border-emerald-200",
  "Tendances":   "bg-amber-50 text-amber-700 border-amber-200",
  "Conseils":    "bg-brand-50 text-brand-700 border-brand-200",
  "Métiers":     "bg-purple-50 text-purple-700 border-purple-200",
  "Législation": "bg-rose-50 text-rose-700 border-rose-200",
};

export function HomeBlogTeasers() {
  // 3 articles les plus récents
  const recent = [...BLOG_POSTS]
    .sort((a, b) => b.dateIso.localeCompare(a.dateIso))
    .slice(0, 3);

  return (
    <section className="relative py-20 sm:py-24 bg-white overflow-hidden">
      {/* Décors */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[400px] rounded-full bg-brand-500/[0.04] blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] rounded-full bg-blue-500/[0.04] blur-[100px] pointer-events-none" />

      <div className="container-default relative">
        {/* Head */}
        <div className="flex items-end justify-between gap-4 flex-wrap mb-10 sm:mb-12">
          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-50 border border-brand-200 text-brand-700 text-[0.7rem] font-bold tracking-[0.14em] uppercase">
              <Newspaper size={11} strokeWidth={2.8} className="text-brand-500" />
              Blog & conseils
            </span>
            <h2 className="mt-5 text-[28px] sm:text-[36px] md:text-[44px] leading-[1.05] font-extrabold text-ink-700 tracking-[-0.025em]">
              Articles récents
              <span className="text-brand-500">.</span>
            </h2>
            <p className="mt-3 text-[0.95rem] sm:text-[1rem] text-ink-500 leading-relaxed">
              Guides pratiques, conseils experts, actualités artisanat · mis à jour <strong className="text-ink-700">chaque semaine</strong>.
            </p>
          </div>

          <Link
            href="/blog"
            className="group inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-ink-50 border border-ink-200 text-ink-700 font-bold text-[0.86rem] hover:bg-white hover:border-brand-300 hover:text-brand-600 transition"
          >
            Voir tous les articles
            <ArrowRight size={13} strokeWidth={2.6} className="group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>

        {/* Grid 3 articles */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {recent.map((post, i) => {
            const catColor = CATEGORY_COLORS[post.category] ?? CATEGORY_COLORS["Guide"];
            return (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="group flex flex-col bg-white rounded-2xl overflow-hidden border border-ink-100 hover:border-brand-200 hover:-translate-y-1.5 hover:shadow-[0_20px_40px_-15px_rgba(13,30,74,0.18)] transition-all animate-reveal-up"
                style={{ animationDelay: `${i * 100}ms` }}
              >
                {/* Cover */}
                <div className="relative aspect-[16/10] overflow-hidden bg-ink-100">
                  <div
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                    style={{ backgroundImage: `url(${post.cover})` }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-ink-900/30 to-transparent" />
                  <span className={`absolute top-3 left-3 inline-flex items-center px-2.5 py-1 rounded-full ${catColor} border text-[0.66rem] font-extrabold uppercase tracking-[0.1em] shadow-[0_2px_8px_rgba(0,0,0,0.12)]`}>
                    {post.category}
                  </span>
                </div>

                {/* Body */}
                <div className="flex-1 flex flex-col p-5 sm:p-6">
                  <h3 className="font-extrabold text-ink-700 text-[1.02rem] leading-snug group-hover:text-brand-500 transition line-clamp-2">
                    {post.title}
                  </h3>
                  <p className="mt-2 text-[0.86rem] text-ink-500 leading-relaxed line-clamp-2">
                    {post.excerpt}
                  </p>

                  {/* Footer */}
                  <div className="mt-auto pt-4 border-t border-ink-100 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2 min-w-0">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={post.author.avatar}
                        alt=""
                        className="w-7 h-7 rounded-full border border-ink-100 flex-shrink-0"
                        loading="lazy"
                      />
                      <div className="min-w-0">
                        <div className="text-[0.72rem] font-bold text-ink-700 truncate">{post.author.name}</div>
                        <div className="text-[0.66rem] text-ink-400 inline-flex items-center gap-1 truncate">
                          <Calendar size={9} />
                          {post.date}
                        </div>
                      </div>
                    </div>
                    <span className="inline-flex items-center gap-1 text-[0.72rem] text-ink-400 font-semibold flex-shrink-0">
                      <Clock size={11} />
                      {post.readTime}
                    </span>
                  </div>

                  {/* Hover read more */}
                  <span className="mt-3 inline-flex items-center gap-1.5 text-[0.78rem] font-bold text-brand-500 opacity-0 -translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 transition-all">
                    Lire l&apos;article
                    <ArrowRight size={12} strokeWidth={2.6} />
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
