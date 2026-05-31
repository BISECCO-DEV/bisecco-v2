import type { Metadata } from "next";
import Link from "next/link";
import {
  PenSquare, Sparkles, MessageSquare, Hammer, Lightbulb, HelpCircle,
  ShieldCheck,
} from "lucide-react";
import { getCurrentUser } from "@/lib/db/current-user";
import { fetchApprovedFeed, fetchLikedPostIds, type FeedKind } from "@/lib/feed/fetch";
import { FeedPostCard } from "@/components/features/feed/FeedPostCard";
import { FeedComposerTrigger } from "@/components/features/feed/FeedComposerTrigger";
import { FeedFilterTabs } from "@/components/features/feed/FeedFilterTabs";
import { FeedSidebar } from "@/components/features/feed/FeedSidebar";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

export const metadata: Metadata = {
  title: "Fil d'actualité · Bisecco",
  description:
    "Le fil d'actualité où artisans et particuliers échangent : réalisations de chantiers, questions travaux, conseils pratiques. Tous les comptes sont vérifiés SIREN et validés manuellement.",
};

export const revalidate = 60;

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

  const posts = await fetchApprovedFeed({ kind: validKind, metierId }, 40);

  const likedIds = user?.id
    ? await fetchLikedPostIds(user.id, posts.map((p) => p.id))
    : new Set<number>();

  const canPost = Boolean(user?.id && user.validation_status === "approved");

  return (
    <div className="bg-[#f4f5f9] min-h-screen pb-16">
      {/* ─── HERO COMPACT ─── */}
      <section className="relative bg-gradient-to-br from-ink-800 via-ink-700 to-ink-800 text-white overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[400px] rounded-full bg-brand-500/20 blur-[140px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[300px] rounded-full bg-blue-500/10 blur-[100px] pointer-events-none" />

        <div className="container-default relative py-10 sm:py-14">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/15 border border-brand-500/30 text-brand-300 text-[0.65rem] font-bold tracking-[0.14em] uppercase">
              <MessageSquare size={11} /> Communauté Bisecco
            </div>
            <h1 className="text-3xl sm:text-[2.4rem] font-bold mt-4 tracking-[-0.02em] leading-[1.1]">
              Le fil <span className="text-brand-500">en direct</span> des artisans et des particuliers.
            </h1>
            <p className="mt-3 text-white/65 leading-relaxed max-w-xl text-[0.96rem]">
              Un seul fil pour <strong className="text-white">tous les membres Bisecco</strong> : artisans partagent
              leurs réalisations et conseils, particuliers posent leurs questions travaux et témoignent de leurs projets.
            </p>

            {/* Trust chips */}
            <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 text-[0.78rem] text-white/65">
              <span className="inline-flex items-center gap-1.5">
                <ShieldCheck size={13} className="text-emerald-400" /> Comptes vérifiés SIREN
              </span>
              <span className="text-white/20">·</span>
              <span className="inline-flex items-center gap-1.5">
                <Sparkles size={13} className="text-brand-400" /> Publication immédiate
              </span>
              <span className="text-white/20">·</span>
              <span className="inline-flex items-center gap-1.5">
                <Hammer size={13} className="text-blue-400" /> Ouvert aux deux audiences
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ─── LAYOUT 2 COLONNES ─── */}
      <div className="container-default py-6">
        <div className="grid lg:grid-cols-[1fr_320px] gap-6 max-w-5xl mx-auto lg:max-w-none lg:mx-0">
          {/* COLONNE PRINCIPALE */}
          <div className="max-w-2xl mx-auto lg:max-w-none lg:mx-0 w-full space-y-4">
            {/* Bannière succès post publié */}
            {published === "1" && (
              <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl px-4 py-3 text-sm font-semibold flex items-center gap-2 animate-in fade-in slide-in-from-top-1 duration-300">
                <Sparkles size={16} />
                <span>Votre publication est en ligne 🎉</span>
              </div>
            )}

            {/* Composer trigger */}
            {canPost && user && (
              <FeedComposerTrigger
                userName={user.display_name || user.name}
                userAvatar={user.profile_photo}
                userRole={user.role}
              />
            )}

            {/* Filtres pills */}
            <FeedFilterTabs />

            {/* Liste posts */}
            {posts.length === 0 ? (
              <EmptyFeed canPost={canPost} hasFilter={Boolean(validKind || metierId)} />
            ) : (
              <div className="space-y-4">
                {posts.map((p) => (
                  <FeedPostCard
                    key={p.id}
                    post={p}
                    liked={likedIds.has(p.id)}
                    canInteract={canPost}
                  />
                ))}
              </div>
            )}

            {/* Footer de fin de feed (subtil) */}
            {posts.length > 0 && (
              <div className="text-center py-6 text-xs text-ink-400">
                Vous avez atteint la fin du fil · Plus de posts à venir bientôt.
              </div>
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
      <div className="bg-white rounded-2xl border border-ink-100 p-10 text-center">
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
    <div className="bg-white rounded-3xl border border-ink-100 p-10 text-center relative overflow-hidden">
      <div className="absolute -top-10 -right-10 w-32 h-32 rounded-full bg-brand-500/10 blur-2xl" />
      <div className="absolute -bottom-10 -left-10 w-32 h-32 rounded-full bg-blue-500/10 blur-2xl" />

      <div className="relative">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-brand-500 to-brand-600 flex items-center justify-center mx-auto mb-4 shadow-[0_8px_24px_-6px_rgba(240,122,47,0.5)]">
          <Sparkles size={26} className="text-white" />
        </div>
        <h2 className="text-xl font-bold text-ink-700">Le fil démarre tout juste</h2>
        <p className="text-sm text-ink-500 mt-2 max-w-md mx-auto leading-relaxed">
          Que vous soyez <strong className="text-ink-700">artisan</strong> ou <strong className="text-ink-700">particulier</strong>,
          soyez parmi les premiers à publier. Partagez un chantier, posez une question travaux, donnez un conseil.
        </p>

        <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-brand-50 border border-brand-200 text-brand-700 text-xs font-bold">
            <Hammer size={12} /> Réalisations <span className="text-brand-400 font-normal">· artisans</span>
          </span>
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-violet-50 border border-violet-200 text-violet-700 text-xs font-bold">
            <Lightbulb size={12} /> Conseils <span className="text-violet-400 font-normal">· artisans</span>
          </span>
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-bold">
            <HelpCircle size={12} /> Questions <span className="text-blue-400 font-normal">· tous</span>
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
