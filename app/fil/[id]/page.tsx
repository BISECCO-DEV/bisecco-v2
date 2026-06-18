import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, MessageCircle } from "lucide-react";
import { getCurrentUser } from "@/lib/db/current-user";
import { fetchPostById, fetchCommentsForPost, fetchLikedPostIds } from "@/lib/feed/fetch";
import { FeedPostCard } from "@/components/features/feed/FeedPostCard";
import { FeedComments } from "@/components/features/feed/FeedComments";

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const post = await fetchPostById(Number(id));
  if (!post || post.status !== "approved") {
    return { title: "Publication", robots: { index: false } };
  }
  const author = post.author.company_name || post.author.name;
  const excerpt = post.content.slice(0, 140);
  return {
    title: `${excerpt} · ${author}`,
    description: post.content.slice(0, 200),
  };
}

export default async function FilPostPage({ params }: Props) {
  const { id } = await params;
  const postId = Number(id);
  if (!Number.isFinite(postId)) notFound();

  const [user, post] = await Promise.all([
    getCurrentUser(),
    fetchPostById(postId),
  ]);

  if (!post || post.status !== "approved") {
    notFound();
  }

  const [comments, likedIds] = await Promise.all([
    fetchCommentsForPost(postId),
    user?.id ? fetchLikedPostIds(user.id, [postId]) : Promise.resolve(new Set<number>()),
  ]);

  const canInteract = Boolean(user?.id && user.validation_status === "approved");

  return (
    <div className="bg-[#f4f5f9] min-h-screen pb-16">
      <div className="container-default py-6 max-w-2xl">
        <Link href="/fil" className="inline-flex items-center gap-1.5 text-sm text-ink-500 hover:text-brand-500 font-semibold transition">
          <ArrowLeft size={14} /> Retour au fil
        </Link>

        <div className="mt-4 space-y-3">
          <FeedPostCard
            post={post}
            liked={likedIds.has(post.id)}
            canInteract={canInteract}
            currentUserId={user?.id ?? null}
            isAdmin={user?.role === "admin"}
          />

          <section className="bg-white rounded-2xl border border-ink-100 shadow-[0_1px_2px_rgba(13,30,74,0.04)] p-5">
            <div className="flex items-center gap-2 mb-5 pb-3 border-b border-ink-100">
              <MessageCircle size={16} className="text-brand-500" />
              <h2 className="font-extrabold text-ink-700 text-[0.95rem]">
                Commentaires <span className="text-ink-400 font-medium">({comments.length})</span>
              </h2>
            </div>
            <FeedComments postId={post.id} initialComments={comments} canComment={canInteract} />
          </section>
        </div>
      </div>
    </div>
  );
}
