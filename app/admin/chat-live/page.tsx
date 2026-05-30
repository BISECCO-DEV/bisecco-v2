import { MessageSquare } from "lucide-react";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { AdminChatClient } from "./AdminChatClient";

export const dynamic = "force-dynamic";

type ConversationRow = {
  id: string;
  session_token: string;
  user_id: number | null;
  visitor_name: string | null;
  visitor_email: string | null;
  status: "open" | "closed";
  unread_admin_count: number;
  last_message_at: string | null;
  last_message_preview: string | null;
  created_at: string;
};

async function loadConversations(): Promise<ConversationRow[]> {
  const admin = createSupabaseAdminClient();
  const { data } = await admin
    .from("chat_conversations")
    .select("id, session_token, user_id, visitor_name, visitor_email, status, unread_admin_count, last_message_at, last_message_preview, created_at")
    .order("last_message_at", { ascending: false })
    .limit(200);
  return (data ?? []) as ConversationRow[];
}

export default async function AdminChatLivePage() {
  const conversations = await loadConversations();

  return (
    <div className="space-y-6 max-w-7xl">
      <header>
        <h1 className="text-2xl sm:text-3xl font-bold text-ink-700 tracking-tight flex items-center gap-2">
          <MessageSquare size={26} className="text-brand-500" /> Chat live
          <span className="ml-2 text-base font-bold text-ink-400">
            ({conversations.filter((c) => c.status === "open").length} ouvertes)
          </span>
        </h1>
        <p className="text-ink-500 text-sm mt-1">
          Conversations en direct avec les visiteurs du site.
        </p>
      </header>

      <AdminChatClient initialConversations={conversations} />
    </div>
  );
}
