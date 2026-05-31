"use client";

import {
  Hammer, HelpCircle, Lightbulb, MapPin, ShieldCheck, MessageCircle,
  Heart, MoreHorizontal, Eye,
} from "lucide-react";
import type { FeedKind } from "@/lib/feed/actions";
import { FeedImageGrid } from "./FeedImageGrid";

const KIND_CFG: Record<FeedKind, { label: string; tint: string; icon: typeof Hammer }> = {
  realisation: { label: "Réalisation",      tint: "text-brand-600",  icon: Hammer },
  question:    { label: "Question travaux", tint: "text-blue-600",   icon: HelpCircle },
  conseil:     { label: "Conseil métier",   tint: "text-violet-600", icon: Lightbulb },
};

type Props = {
  displayName: string;
  avatarUrl: string;
  role: "admin" | "artisan" | "particulier";
  kind: FeedKind;
  content: string;
  city: string;
  metierName: string | null;
  metierIcon: string | null;
  images: string[];
};

export function FeedComposerPreview({
  displayName, avatarUrl, role, kind, content, city, metierName, metierIcon, images,
}: Props) {
  const kindCfg = KIND_CFG[kind];
  const KindIcon = kindCfg.icon;
  const isPro = role === "artisan";

  const displayContent = content.trim() || (
    <span className="text-ink-300 italic">
      Votre message apparaîtra ici… commencez à écrire.
    </span>
  );

  return (
    <div className="space-y-3">
      {/* Header sticky avec label "Aperçu" */}
      <div className="flex items-center gap-2 text-[0.7rem] font-bold text-ink-500 uppercase tracking-wider">
        <Eye size={12} />
        Aperçu en direct
      </div>

      {/* Card de preview */}
      <article className="bg-white rounded-2xl shadow-[0_1px_2px_rgba(13,30,74,0.04),0_4px_16px_-8px_rgba(13,30,74,0.06)] border border-ink-100/80 overflow-hidden">
        {/* Header */}
        <header className="px-5 pt-5 pb-3 flex items-start gap-3">
          <div className="relative flex-shrink-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={avatarUrl}
              alt=""
              className="w-12 h-12 rounded-full object-cover bg-ink-100 ring-2 ring-white shadow-sm"
            />
            {isPro && (
              <span className="absolute -bottom-0.5 -right-0.5 w-5 h-5 rounded-full bg-emerald-500 border-2 border-white flex items-center justify-center">
                <ShieldCheck size={10} className="text-white" strokeWidth={3} />
              </span>
            )}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="font-bold text-ink-700 text-[0.95rem] truncate leading-tight">
                {displayName}
              </span>
              <span className={`inline-flex items-center gap-1 text-[0.7rem] font-bold ${kindCfg.tint}`}>
                <KindIcon size={11} strokeWidth={2.6} />
                {kindCfg.label}
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-[0.78rem] text-ink-400 mt-0.5 flex-wrap">
              <span>{isPro ? "Artisan" : "Particulier"}</span>
              {metierName && (
                <>
                  <span className="text-ink-300">·</span>
                  <span className="font-medium text-ink-500">
                    {metierIcon ?? "🛠️"} {metierName}
                  </span>
                </>
              )}
              {city && (
                <>
                  <span className="text-ink-300">·</span>
                  <span className="inline-flex items-center gap-0.5">
                    <MapPin size={10} /> {city}
                  </span>
                </>
              )}
              <span className="text-ink-300">·</span>
              <span>à l&apos;instant</span>
            </div>
          </div>

          <button
            type="button"
            disabled
            className="flex-shrink-0 w-8 h-8 rounded-full text-ink-300 inline-flex items-center justify-center"
          >
            <MoreHorizontal size={16} />
          </button>
        </header>

        {/* Content */}
        <div className="px-5 pb-4">
          <p className="text-[0.96rem] text-ink-700 leading-[1.65] whitespace-pre-wrap break-words">
            {displayContent}
          </p>
        </div>

        {/* Images */}
        {images.length > 0 && <FeedImageGrid images={images} />}

        {/* Actions désactivées */}
        <div className="px-2 py-1 border-t border-ink-100/70 flex items-center justify-between gap-1 opacity-60 pointer-events-none">
          <button type="button" disabled className="inline-flex items-center gap-1.5 px-3 py-2.5 text-ink-500">
            <Heart size={16} />
            <span className="text-[0.85rem] font-semibold">0</span>
          </button>
          <button type="button" disabled className="flex-1 inline-flex items-center justify-center gap-2 py-2.5 text-[0.85rem] font-semibold text-ink-500">
            <MessageCircle size={16} />
            Commenter
          </button>
          <div className="w-16" />
        </div>
      </article>

      <p className="text-[0.7rem] text-ink-400 leading-relaxed px-2">
        Ainsi apparaîtra votre publication dans le fil dès qu&apos;elle sera en ligne.
      </p>
    </div>
  );
}
