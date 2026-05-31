"use client";

import { useState, useTransition } from "react";
import { Heart } from "lucide-react";
import { toggleLikeAction } from "@/lib/feed/actions";

type Props = {
  postId: number;
  initialLiked: boolean;
  initialCount: number;
  disabled?: boolean;
};

export function FeedLikeButton({ postId, initialLiked, initialCount, disabled }: Props) {
  const [liked, setLiked] = useState(initialLiked);
  const [count, setCount] = useState(initialCount);
  const [pending, startTransition] = useTransition();

  const onClick = () => {
    if (disabled || pending) return;
    // Optimistic
    setLiked((v) => !v);
    setCount((c) => c + (liked ? -1 : 1));

    startTransition(async () => {
      const res = await toggleLikeAction(postId);
      if (!res.ok) {
        // rollback
        setLiked((v) => !v);
        setCount((c) => c + (liked ? 1 : -1));
      }
    });
  };

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`inline-flex items-center gap-1.5 transition ${
        disabled ? "opacity-60 cursor-not-allowed" : "hover:text-red-500"
      } ${liked ? "text-red-500" : "text-ink-500"}`}
      aria-label={liked ? "Retirer le like" : "Liker"}
    >
      <Heart size={16} fill={liked ? "currentColor" : "none"} strokeWidth={2.2} />
      <span className="font-semibold tabular-nums">{count}</span>
    </button>
  );
}
