import Link from "next/link";
import { FileText, Plus, Eye, Edit3, Trash2 } from "lucide-react";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { deleteArticleAction } from "@/lib/blog/actions";

export const dynamic = "force-dynamic";

type BlogRow = {
  id: number;
  slug: string;
  title: string;
  excerpt: string | null;
  image_url: string | null;
  author: string;
  status: "draft" | "published";
  published_at: string | null;
  updated_at: string;
};

async function loadArticles(): Promise<BlogRow[]> {
  const admin = createSupabaseAdminClient();
  const { data } = await admin
    .from("blog_articles")
    .select("id, slug, title, excerpt, image_url, author, status, published_at, updated_at")
    .order("updated_at", { ascending: false });
  return (data ?? []) as BlogRow[];
}

function formatDate(iso: string | null): string {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("fr-FR", { day: "numeric", month: "short", year: "numeric" });
}

export default async function AdminBlogPage() {
  const articles = await loadArticles();
  const published = articles.filter((a) => a.status === "published").length;
  const drafts = articles.filter((a) => a.status === "draft").length;

  async function destroy(formData: FormData) {
    "use server";
    const id = parseInt(formData.get("article_id")?.toString() ?? "0", 10);
    if (id > 0) await deleteArticleAction(id);
  }

  return (
    <div className="space-y-6 max-w-6xl">
      <header className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-ink-700 tracking-tight flex items-center gap-2">
            <FileText size={26} /> Articles de blog
            <span className="ml-2 text-base font-bold text-ink-400">({articles.length})</span>
          </h1>
          <p className="text-ink-500 text-sm mt-1">
            {published} publié{published > 1 ? "s" : ""} · {drafts} brouillon{drafts > 1 ? "s" : ""}
          </p>
        </div>
        <Link
          href="/admin/blog/nouveau"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-brand-500 hover:bg-brand-600 text-white font-bold text-sm transition-colors"
        >
          <Plus size={16} /> Nouvel article
        </Link>
      </header>

      {articles.length === 0 ? (
        <div className="bg-white rounded-2xl border border-ink-100 p-12 text-center">
          <FileText size={48} className="mx-auto text-ink-200 mb-4" />
          <h2 className="font-bold text-ink-700">Aucun article pour le moment</h2>
          <p className="text-sm text-ink-400 mt-2">
            <Link href="/admin/blog/nouveau" className="text-brand-500 font-bold hover:underline">
              Créez votre premier article →
            </Link>
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-ink-100 overflow-hidden">
          {articles.map((a) => (
            <article
              key={a.id}
              className="flex items-center gap-4 px-5 py-4 border-b border-ink-100 last:border-0 hover:bg-ink-50/60 transition"
            >
              {a.image_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={a.image_url} alt="" className="w-20 h-14 object-cover rounded-lg flex-shrink-0 bg-ink-100" />
              ) : (
                <div className="w-20 h-14 rounded-lg bg-ink-100 flex-shrink-0" />
              )}

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <span
                    className={`px-2 py-0.5 rounded-full text-[0.65rem] font-bold uppercase tracking-wider ${
                      a.status === "published"
                        ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                        : "bg-amber-50 text-amber-700 border border-amber-200"
                    }`}
                  >
                    {a.status === "published" ? "Publié" : "Brouillon"}
                  </span>
                  <span className="text-[0.7rem] text-ink-400 font-mono">{a.slug}</span>
                </div>
                <h2 className="font-bold text-ink-700 text-base leading-snug truncate">{a.title}</h2>
                <p className="text-xs text-ink-400 mt-0.5">
                  {a.status === "published" ? formatDate(a.published_at) : "Non publié"}
                  {a.author && ` · ${a.author}`}
                </p>
              </div>

              <div className="flex items-center gap-1.5 flex-shrink-0">
                {a.status === "published" && (
                  <Link
                    href={`/blog/${a.slug}`}
                    target="_blank"
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-white text-ink-700 border border-ink-200 hover:border-brand-300 text-xs font-bold transition"
                  >
                    <Eye size={12} /> Voir
                  </Link>
                )}
                <Link
                  href={`/admin/blog/${a.id}/editer`}
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-ink-50 text-ink-700 hover:bg-ink-100 text-xs font-bold transition"
                >
                  <Edit3 size={12} /> Éditer
                </Link>
                <form action={destroy}>
                  <input type="hidden" name="article_id" value={a.id} />
                  <button
                    type="submit"
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-white text-red-600 border border-red-200 hover:bg-red-50 text-xs font-bold transition"
                    aria-label={`Supprimer ${a.title}`}
                  >
                    <Trash2 size={12} />
                  </button>
                </form>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
