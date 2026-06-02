"use client";

import { useState, useTransition } from "react";
import { Repeat2, X, Loader2 } from "lucide-react";
import type { FeedPost } from "@/lib/feed/fetch";
import { repostFeedPostAction } from "@/lib/feed/actions";
import { EmojiPickerButton } from "./EmojiPickerButton";
import { feedImagePublicUrl } from "./image-url";

type Props = {
  post: FeedPost;
  /** True si l'utilisateur peut interagir (connecté + validé) */
  canInteract: boolean;
  /** True si l'utilisateur est l'auteur du post (pas de repartage de soi-même) */
  isOwner: boolean;
};

/**
 * Bouton "Repartager" + modale de confirmation avec commentaire optionnel.
 * Comme un "retweet with comment" de Twitter / "Share" de LinkedIn.
 */
export function FeedRepostButton({ post, canInteract, isOwner }: Props) {
  const [open, setOpen] = useState(false);
  const [comment, setComment] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const [pending, startTransition] = useTransition();

  // Bouton désactivé si l'user n'est pas connecté OU est l'auteur (pas de self-repost)
  const disabled = !canInteract || isOwner;
  const disabledReason = isOwner
    ? "Vous ne pouvez pas repartager votre propre post"
    : "Connectez-vous pour repartager";

  if (disabled) {
    return (
      <button
        type="button"
        disabled
        title={disabledReason}
        className="inline-flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-lg text-[0.85rem] font-semibold text-ink-300 cursor-not-allowed"
        aria-label={disabledReason}
      >
        <Repeat2 size={16} />
        <span className="hidden sm:inline">Repartager</span>
      </button>
    );
  }

  const target = post.repost_of ?? {
    id: post.id,
    content: post.content,
    images: post.images,
    author: post.author,
    link_url: post.link_url,
    link_title: post.link_title,
    link_image: post.link_image,
    link_site_name: post.link_site_name,
  };
  const targetAuthorName = target.author.company_name || target.author.name;

  const submit = () => {
    setError(null);
    startTransition(async () => {
      const res = await repostFeedPostAction({
        originalPostId: post.id,
        comment: comment.trim() || undefined,
      });
      if (!res.ok) {
        setError(res.error || "Erreur lors du repartage.");
        return;
      }
      setDone(true);
      setTimeout(() => {
        setOpen(false);
        setDone(false);
        setComment("");
      }, 1500);
    });
  };

  const insertEmoji = (emoji: string) => setComment((c) => c + emoji);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-lg text-[0.85rem] font-semibold text-ink-500 hover:bg-emerald-50 hover:text-emerald-600 transition"
        aria-label="Repartager ce post"
      >
        <Repeat2 size={16} />
        <span className="hidden sm:inline">Repartager</span>
      </button>

      {open && (
        <div
          className="fixed inset-0 z-[80] bg-ink-900/70 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-150"
          onClick={() => !pending && !done && setOpen(false)}
        >
          <div
            className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto relative animate-in zoom-in-95 duration-150"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => !pending && !done && setOpen(false)}
              className="absolute top-3 right-3 w-9 h-9 rounded-xl hover:bg-ink-100 text-ink-500 inline-flex items-center justify-center transition z-10"
              aria-label="Fermer"
              disabled={pending || done}
            >
              <X size={16} />
            </button>

            <div className="p-5">
              <div className="flex items-center gap-2 mb-1">
                <Repeat2 size={18} className="text-emerald-500" />
                <h3 className="font-extrabold text-ink-700 text-lg">
                  {done ? "Repartagé !" : "Repartager ce post"}
                </h3>
              </div>
              <p className="text-xs text-ink-500">
                Apparaîtra dans le fil avec ton commentaire optionnel.
              </p>

              {done ? (
                <div className="mt-6 text-center py-6">
                  <div className="w-14 h-14 rounded-full bg-emerald-100 inline-flex items-center justify-center mb-3">
                    <Repeat2 size={26} className="text-emerald-500" />
                  </div>
                  <p className="text-sm text-ink-600 font-semibold">
                    Le post de {targetAuthorName} est sur ton fil 🎉
                  </p>
                </div>
              ) : (
                <>
                  {/* Textarea commentaire + bouton emoji */}
                  <div className="relative mt-4">
                    <textarea
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      maxLength={1000}
                      rows={3}
                      placeholder="Ajoute un commentaire (optionnel)…"
                      className="w-full px-4 py-3 pr-14 rounded-xl border-2 border-ink-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 outline-none text-sm resize-none placeholder:text-ink-300 transition"
                    />
                    <div className="absolute bottom-2 right-2">
                      <EmojiPickerButton onSelect={insertEmoji} />
                    </div>
                  </div>

                  {/* Aperçu compact du post original */}
                  <div className="mt-3 p-3 rounded-xl border border-ink-100 bg-ink-50/40">
                    <div className="text-[0.65rem] font-bold text-ink-400 uppercase tracking-wider mb-1.5">
                      Post original
                    </div>
                    <div className="flex items-start gap-2.5">
                      {target.images && target.images.length > 0 && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={feedImagePublicUrl(target.images[0])}
                          alt=""
                          className="w-12 h-12 rounded-lg object-cover flex-shrink-0 bg-ink-100"
                          onError={(e) => {
                            (e.target as HTMLImageElement).style.display = "none";
                          }}
                        />
                      )}
                      <div className="min-w-0 flex-1">
                        <div className="text-xs font-bold text-ink-700 truncate">
                          {targetAuthorName}
                        </div>
                        <p className="text-[0.78rem] text-ink-600 line-clamp-3 mt-0.5 leading-snug">
                          {target.content || (target.link_title ?? "")}
                        </p>
                      </div>
                    </div>
                  </div>

                  {error && (
                    <div className="mt-3 px-3 py-2 rounded-lg bg-red-50 border border-red-200 text-xs text-red-700 font-semibold">
                      {error}
                    </div>
                  )}

                  <div className="mt-5 flex gap-2">
                    <button
                      type="button"
                      onClick={() => setOpen(false)}
                      className="flex-1 py-2.5 rounded-xl bg-ink-100 hover:bg-ink-200 text-ink-700 font-bold text-sm transition disabled:opacity-50"
                      disabled={pending}
                    >
                      Annuler
                    </button>
                    <button
                      type="button"
                      onClick={submit}
                      disabled={pending}
                      className="flex-1 inline-flex items-center justify-center gap-2 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-sm transition disabled:opacity-50"
                    >
                      {pending && <Loader2 size={14} className="animate-spin" />}
                      <Repeat2 size={14} />
                      Repartager
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
