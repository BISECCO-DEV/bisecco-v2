import type { Metadata } from "next";
import Link from "next/link";
import {
  PenSquare, Sparkles, MessageSquare, Hammer, Lightbulb, HelpCircle,
} from "lucide-react";
import { getCurrentUser } from "@/lib/db/current-user";
import { fetchApprovedFeed, fetchLikedPostIds, type FeedKind } from "@/lib/feed/fetch";
import { FeedComposer } from "@/components/features/feed/FeedComposer";
import { FeedFilterTabs } from "@/components/features/feed/FeedFilterTabs";
import { FeedSidebar } from "@/components/features/feed/FeedSidebar";
import { FeedLeftSidebar } from "@/components/features/feed/FeedLeftSidebar";
import { FeedInfiniteList } from "@/components/features/feed/FeedInfiniteList";
import { FeedRealtime } from "@/components/features/feed/FeedRealtime";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { fetchAllMetiers } from "@/lib/db/metiers";
import { getMetierOptions } from "@/lib/db/metier-options";

export const metadata: Metadata = {
  title: "Le Fil · Bisecco",
  description:
    "Le fil d'actualité où artisans et particuliers échangent : réalisations de chantiers, questions travaux, conseils pratiques. Tous les comptes sont vérifiés SIREN.",
};

export const revalidate = 10;

type SearchParams = Promise<{ published?: string; kind?: string; metier?: string }>;

async function resolveMetierId(slug?: string): Promise<number | undefined> {
  if (!slug) return undefined;
  const admin = createSupabaseAdminClient();
  const { data } = await admin.from("metiers").select("id").eq("slug", slug).maybeSingle();
  return data?.id ?? undefined;
}

export default async function FilPage({ searchParams }: { searchParams: SearchParams }) {
  const { published, kind, metier } = await searchParams;
  const validKind: FeedKind | undefined =
    kind === "realisation" || kind === "conseil" || kind === "question" ? kind : undefined;

  const [user, metierId] = await Promise.all([getCurrentUser(), resolveMetierId(metier)]);

  const canPostEarly = Boolean(user?.id && user.validation_status === "approved");

  const [posts, metiers, metierOptions] = await Promise.all([
    fetchApprovedFeed({ kind: validKind, metierId }, 10, 0),
    // Charge les métiers seulement si l'user peut publier (sinon inutile)
    canPostEarly ? fetchAllMetiers() : Promise.resolve([]),
    canPostEarly ? getMetierOptions() : Promise.resolve([]),
  ]);

  const likedIds = user?.id
    ? await fetchLikedPostIds(user.id, posts.map((p) => p.id))
    : new Set<number>();

  const canPost = Boolean(user?.id && user.validation_status === "approved");

  return (
    <div className="bg-[#fafbfc] min-h-screen pb-24">
      {/* ═══════ HEADER STICKY LIGHT ═══════ */}
      <header className="sticky top-0 z-30 bg-white/85 backdrop-blur-xl border-b border-ink-100">
        <div className="container-default">
          <div className="grid xl:grid-cols-[260px_1fr_320px] lg:grid-cols-[1fr_320px] gap-6 max-w-5xl mx-auto lg:max-w-none lg:mx-0">
            {/* Espace colonne gauche (xl seulement) — vide pour aligner header */}
            <div className="hidden xl:block" aria-hidden="true" />
            <div className="max-w-2xl mx-auto lg:max-w-none lg:mx-0 w-full">
              {/* Ligne 1 : titre + live indicator */}
              <div className="flex items-center justify-between py-3">
                <div className="flex items-baseline gap-2.5">
                  <h1 className="text-[1.5rem] font-extrabold text-ink-900 tracking-tight">
                    Le Fil
                  </h1>
                  <span className="hidden sm:inline-flex items-center gap-1.5 text-[0.7rem] font-bold text-emerald-700">
                    <span className="relative flex h-1.5 w-1.5">
                      <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75 animate-ping" />
                      <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500" />
                    </span>
                    En direct
                  </span>
                </div>
                {canPost && (
                  <Link
                    href="/fil/nouveau"
                    className="sm:hidden inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-brand-500 hover:bg-brand-600 text-white text-xs font-extrabold shadow-[0_4px_12px_-2px_rgba(240,122,47,0.5)] transition"
                  >
                    <PenSquare size={12} /> Publier
                  </Link>
                )}
              </div>
              {/* Ligne 2 : tabs filtres */}
              <FeedFilterTabs />
            </div>
            {/* Espace pour aligner avec sidebar desktop (vide intentionnel) */}
            <div className="hidden lg:block" aria-hidden="true" />
          </div>
        </div>
      </header>

      {/* ═══════ LAYOUT 3 COLONNES (xl) / 2 COLONNES (lg) / 1 COLONNE (mobile) ═══════ */}
      <div className="container-default pt-5">
        <div className="grid xl:grid-cols-[260px_1fr_320px] lg:grid-cols-[1fr_320px] gap-6 max-w-5xl mx-auto lg:max-w-none lg:mx-0">
          {/* SIDEBAR GAUCHE (xl only) — mini profil + complétion + raccourcis */}
          {user && (
            <div className="hidden xl:block">
              <FeedLeftSidebar user={user} />
            </div>
          )}
          {!user && <div className="hidden xl:block" aria-hidden="true" />}

          {/* COLONNE PRINCIPALE */}
          <div className="max-w-2xl mx-auto lg:max-w-none lg:mx-0 w-full space-y-4">
            {/* Bannière succès post publié */}
            {published === "1" && (
              <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl px-4 py-3 text-sm font-semibold flex items-center gap-2 animate-in fade-in slide-in-from-top-1 duration-300">
                <Sparkles size={16} />
                <span>Votre publication est en ligne 🎉</span>
              </div>
            )}

            {/* Composer inline — pas de redirection, on poste direct depuis le fil */}
            {canPost && user && (
              <FeedComposer
                userRole={user.role}
                userDisplayName={user.display_name || user.name}
                userAvatar={user.profile_photo}
                metierOptions={metierOptions}
                metiers={metiers.map((m) => ({ id: m.id, name: m.name, slug: m.slug }))}
                initialKind={validKind}
              />
            )}

            {/* Realtime — abonnement websocket aux nouveaux posts/likes/comments */}
            <FeedRealtime />

            {/* Liste posts avec scroll infini (10 par 10) */}
            {posts.length === 0 ? (
              <EmptyFeed canPost={canPost} hasFilter={Boolean(validKind || metierId)} />
            ) : (
              <FeedInfiniteList
                initialPosts={posts}
                initialLikedIds={Array.from(likedIds)}
                canInteract={canPost}
                currentUserId={user?.id ?? null}
                isAdmin={user?.role === "admin"}
                kind={validKind}
                metierId={metierId}
              />
            )}
          </div>

          {/* SIDEBAR DROITE (desktop only) */}
          <div className="hidden lg:block">
            <FeedSidebar />
          </div>
        </div>
      </div>
    </div>
  );
}

function EmptyFeed({ canPost, hasFilter }: { canPost: boolean; hasFilter: boolean }) {
  if (hasFilter) {
    return (
      <div className="bg-white rounded-3xl border border-ink-100 p-10 text-center shadow-[0_2px_8px_-2px_rgba(13,30,74,0.04)]">
        <div className="w-14 h-14 rounded-2xl bg-ink-50 flex items-center justify-center mx-auto mb-4">
          <MessageSquare size={22} className="text-ink-400" />
        </div>
        <h2 className="font-bold text-ink-700">Aucun post pour ce filtre</h2>
        <p className="text-sm text-ink-500 mt-2 max-w-sm mx-auto">
          Essayez un autre filtre ou revenez plus tard.
        </p>
        <Link
          href="/fil"
          className="mt-5 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-ink-100 hover:bg-ink-200 text-ink-700 font-semibold text-sm"
        >
          Réinitialiser
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl border border-ink-100 p-10 text-center relative overflow-hidden shadow-[0_2px_8px_-2px_rgba(13,30,74,0.04)]">
      <div className="absolute -top-10 -right-10 w-32 h-32 rounded-full bg-brand-500/10 blur-2xl" />
      <div className="absolute -bottom-10 -left-10 w-32 h-32 rounded-full bg-blue-500/10 blur-2xl" />

      <div className="relative">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-brand-500 to-brand-600 flex items-center justify-center mx-auto mb-4 shadow-[0_8px_24px_-6px_rgba(240,122,47,0.5)]">
          <Sparkles size={26} className="text-white" />
        </div>
        <h2 className="text-xl font-bold text-ink-700">Le fil démarre tout juste</h2>
        <p className="text-sm text-ink-500 mt-2 max-w-md mx-auto leading-relaxed">
          Que vous soyez <strong className="text-ink-700">artisan</strong> ou <strong className="text-ink-700">particulier</strong>,
          soyez parmi les premiers à publier.
        </p>

        <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-brand-50 border border-brand-200 text-brand-700 text-xs font-bold">
            <Hammer size={12} /> Réalisations
          </span>
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-violet-50 border border-violet-200 text-violet-700 text-xs font-bold">
            <Lightbulb size={12} /> Conseils
          </span>
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-bold">
            <HelpCircle size={12} /> Questions
          </span>
        </div>

        {canPost ? (
          <Link
            href="/fil/nouveau"
            className="mt-7 inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-brand-500 hover:bg-brand-600 text-white font-bold text-sm shadow-[0_8px_24px_-4px_rgba(240,122,47,0.5)] transition"
          >
            <PenSquare size={15} /> Créer le premier post
          </Link>
        ) : (
          <Link
            href="/connexion?redirect=/fil/nouveau"
            className="mt-7 inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-ink-700 hover:bg-ink-800 text-white font-bold text-sm transition"
          >
            Se connecter pour publier
          </Link>
        )}
      </div>
    </div>
  );
}
