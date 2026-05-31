"use client";

import { useState, useTransition, useActionState } from "react";
import { Send, Loader2, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { addCommentAction } from "@/lib/feed/actions";
import type { FeedComment } from "@/lib/feed/fetch";

function timeAgo(iso: string): string {
  const ms = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(ms / 60000);
  if (mins < 1) return "à l'instant";
  if (mins < 60) return `il y a ${mins} min`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `il y a ${hours} h`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `il y a ${days} j`;
  return new Date(iso).toLocaleDateString("fr-FR", { day: "numeric", month: "short" });
}

type Props = {
  postId: number;
  initialComments: FeedComment[];
  canComment: boolean;
};

export function FeedComments({ postId, initialComments, canComment }: Props) {
  const [state, formAction] = useActionState(addCommentAction, undefined);
  const [content, setContent] = useState("");
  const [pending, startTransition] = useTransition();

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    startTransition(() => {
      formAction(fd);
      // Reset content after submission attempt
      if (content.length >= 2) setContent("");
    });
  };

  return (
    <div className="space-y-4">
      {/* Form */}
      {canComment ? (
        <form onSubmit={onSubmit} className="flex gap-2 items-start">
          <input type="hidden" name="post_id" value={postId} />
          <textarea
            name="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
            minLength={2}
            maxLength={1500}
            rows={2}
            placeholder="Écrire un commentaire…"
            className="flex-1 px-3 py-2 rounded-xl border-2 border-ink-200 focus:border-brand-500 outline-none text-sm resize-none"
          />
          <button
            type="submit"
            disabled={pending || content.length < 2}
            className="self-end inline-flex items-center justify-center w-10 h-10 rounded-xl bg-brand-500 hover:bg-brand-600 disabled:opacity-50 text-white"
            aria-label="Envoyer"
          >
            {pending ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />}
          </button>
        </form>
      ) : (
        <div className="bg-ink-50 border border-ink-100 rounded-xl px-4 py-3 text-sm text-ink-600">
          <Link href="/connexion?redirect=/fil" className="font-bold text-brand-600 hover:underline">
            Connectez-vous
          </Link>{" "}
          pour commenter ce post.
        </div>
      )}

      {state && state.ok === false && (
        <div className="bg-red-50 text-red-700 px-3 py-2 rounded-lg text-sm font-semibold">⚠ {state.error}</div>
      )}

      {/* Liste */}
      {initialComments.length === 0 ? (
        <div className="text-center py-6 text-sm text-ink-400">Aucun commentaire pour l&apos;instant.</div>
      ) : (
        <div className="space-y-3">
          {initialComments.map((c) => {
            const displayName = c.author.company_name || c.author.name;
            const avatar =
              c.author.profile_photo ??
              `https://api.dicebear.com/9.x/initials/svg?seed=${encodeURIComponent(displayName)}`;
            return (
              <div key={c.id} className="flex gap-3">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={avatar} alt="" className="w-9 h-9 rounded-full object-cover bg-ink-100 flex-shrink-0" />
                <div className="flex-1 min-w-0 bg-ink-50/50 rounded-xl px-3 py-2">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="font-bold text-ink-700 text-sm truncate">{displayName}</span>
                    {c.author.role === "artisan" && (
                      <ShieldCheck size={11} className="text-emerald-500" />
                    )}
                    <span className="text-ink-300 text-xs">·</span>
                    <span className="text-ink-400 text-xs">{timeAgo(c.created_at)}</span>
                  </div>
                  <p className="text-sm text-ink-700 mt-1 whitespace-pre-wrap break-words">{c.content}</p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
