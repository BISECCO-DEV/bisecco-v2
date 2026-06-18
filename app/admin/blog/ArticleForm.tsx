"use client";

import { useActionState } from "react";
import Link from "next/link";
import { ArrowLeft, Save } from "lucide-react";
import { createArticleAction, updateArticleAction, type BlogState, type BlogArticle } from "@/lib/blog/actions";
import { BlockEditor } from "./BlockEditor";
import { CoverImageUpload } from "./CoverImageUpload";

type Props = {
  article?: BlogArticle;
};

export function ArticleForm({ article }: Props) {
  const isEdit = !!article;
  const boundAction = isEdit
    ? updateArticleAction.bind(null, article!.id)
    : createArticleAction;
  const [state, formAction, pending] = useActionState<BlogState, FormData>(boundAction, undefined);

  return (
    <div className="space-y-6 max-w-3xl">
      <header className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <Link
            href="/admin/blog"
            className="inline-flex items-center gap-1 text-sm text-ink-500 hover:text-brand-500 font-semibold transition"
          >
            <ArrowLeft size={14} /> Tous les articles
          </Link>
          <h1 className="mt-2 text-2xl sm:text-3xl font-bold text-ink-700 tracking-tight">
            {isEdit ? "Modifier l'article" : "Nouvel article"}
          </h1>
        </div>
      </header>

      {state?.error && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3">
          ⚠ {state.error}
        </div>
      )}

      <form action={formAction} className="space-y-5 bg-white rounded-2xl border border-ink-100 p-6">
        <div>
          <label className="block text-sm font-bold text-ink-600 mb-2">
            Titre <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="title"
            required
            defaultValue={article?.title ?? ""}
            placeholder="Ex : Comment vérifier un professionnel en France"
            className="w-full px-4 py-3 rounded-xl bg-ink-50 border-2 border-ink-200 focus:border-brand-500 focus:bg-white outline-none transition text-base"
          />
        </div>

        {isEdit && (
          <div>
            <label className="block text-sm font-bold text-ink-600 mb-2">
              Slug URL <span className="text-ink-300 font-normal">(laisser vide pour auto)</span>
            </label>
            <input
              type="text"
              name="slug"
              defaultValue={article?.slug ?? ""}
              placeholder="comment-verifier-artisan-france"
              className="w-full px-4 py-2.5 rounded-xl bg-ink-50 border-2 border-ink-200 focus:border-brand-500 focus:bg-white outline-none transition text-sm font-mono"
            />
          </div>
        )}

        <div>
          <label className="block text-sm font-bold text-ink-600 mb-2">
            Résumé (excerpt)
          </label>
          <textarea
            name="excerpt"
            rows={2}
            maxLength={500}
            defaultValue={article?.excerpt ?? ""}
            placeholder="2-3 lignes pour le teaser de l'article (max 500 caractères)"
            className="w-full px-4 py-3 rounded-xl bg-ink-50 border-2 border-ink-200 focus:border-brand-500 focus:bg-white outline-none transition text-sm resize-y"
          />
        </div>

        <div>
          <label className="block text-sm font-bold text-ink-600 mb-2">
            Contenu de l&apos;article <span className="text-red-500">*</span>
          </label>
          <BlockEditor
            name="content_html"
            initialHtml={article?.content_html ?? ""}
          />
        </div>

        <CoverImageUpload
          initialUrl={article?.image_url ?? ""}
          initialAlt={article?.image_alt ?? ""}
        />

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-bold text-ink-600 mb-2">Auteur</label>
            <input
              type="text"
              name="author"
              defaultValue={article?.author ?? "L'équipe Bisecco"}
              className="w-full px-4 py-2.5 rounded-xl bg-ink-50 border-2 border-ink-200 focus:border-brand-500 focus:bg-white outline-none transition text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-ink-600 mb-2">Temps de lecture</label>
            <input
              type="text"
              name="read_time"
              defaultValue={article?.read_time ?? ""}
              placeholder="Ex : 5 min"
              className="w-full px-4 py-2.5 rounded-xl bg-ink-50 border-2 border-ink-200 focus:border-brand-500 focus:bg-white outline-none transition text-sm"
            />
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-bold text-ink-600 mb-2">
              Status <span className="text-red-500">*</span>
            </label>
            <select
              name="status"
              required
              defaultValue={article?.status ?? "draft"}
              className="w-full px-4 py-2.5 rounded-xl bg-ink-50 border-2 border-ink-200 focus:border-brand-500 focus:bg-white outline-none transition text-sm"
            >
              <option value="draft">Brouillon</option>
              <option value="published">Publié</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-bold text-ink-600 mb-2">
              Date de publication <span className="text-ink-300 font-normal">(auto si vide)</span>
            </label>
            <input
              type="datetime-local"
              name="published_at"
              defaultValue={article?.published_at ? new Date(article.published_at).toISOString().slice(0, 16) : ""}
              className="w-full px-4 py-2.5 rounded-xl bg-ink-50 border-2 border-ink-200 focus:border-brand-500 focus:bg-white outline-none transition text-sm"
            />
          </div>
        </div>

        <details className="bg-ink-50/60 rounded-xl px-4 py-3 border border-ink-100">
          <summary className="cursor-pointer font-bold text-ink-600 text-sm">
            SEO avancé (meta title & description)
          </summary>
          <div className="grid gap-4 mt-4">
            <div>
              <label className="block text-xs font-bold text-ink-500 mb-1.5">
                Meta title <span className="text-ink-300 font-normal">(défaut : titre)</span>
              </label>
              <input
                type="text"
                name="meta_title"
                maxLength={200}
                defaultValue={article?.meta_title ?? ""}
                className="w-full px-3 py-2 rounded-lg bg-white border-2 border-ink-200 focus:border-brand-500 outline-none transition text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-ink-500 mb-1.5">
                Meta description <span className="text-ink-300 font-normal">(140-160 car. idéal)</span>
              </label>
              <textarea
                name="meta_description"
                rows={2}
                maxLength={250}
                defaultValue={article?.meta_description ?? ""}
                className="w-full px-3 py-2 rounded-lg bg-white border-2 border-ink-200 focus:border-brand-500 outline-none transition text-sm resize-y"
              />
            </div>
          </div>
        </details>

        <div className="flex justify-end gap-3 pt-4 border-t border-ink-100">
          <Link
            href="/admin/blog"
            className="inline-flex items-center px-5 py-2.5 rounded-xl bg-white border-2 border-ink-200 text-ink-600 font-bold text-sm hover:border-ink-300 transition"
          >
            Annuler
          </Link>
          <button
            type="submit"
            disabled={pending}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-brand-500 hover:bg-brand-600 text-white font-bold text-sm transition-colors disabled:opacity-50"
          >
            <Save size={14} />
            {pending ? "Enregistrement…" : isEdit ? "Mettre à jour" : "Créer l'article"}
          </button>
        </div>
      </form>
    </div>
  );
}
