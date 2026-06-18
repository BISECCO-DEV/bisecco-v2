import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { MessagerieClient } from "../MessagerieClient";
import { getCurrentDbUser } from "@/lib/auth/current-user";
import { listMyQuickReplies } from "@/lib/quick-replies/actions";

export const metadata: Metadata = {
  title: "Messagerie",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function MessagerieConversationPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const threadId = parseInt(id, 10);
  const me = await getCurrentDbUser();
  if (!me) redirect(`/connexion?redirect=/messagerie/${id}`);

  const quickReplies = me.role === "artisan" ? await listMyQuickReplies() : [];

  return <MessagerieClient currentUserId={me.id} initialThreadId={Number.isNaN(threadId) ? undefined : threadId} quickReplies={quickReplies} />;
}
