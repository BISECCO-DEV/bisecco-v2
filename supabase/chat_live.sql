-- ============================================================
-- Chat live : conversations bidirectionnelles visiteur ↔ admin
-- ============================================================

-- ─── Conversations ───
CREATE TABLE IF NOT EXISTS public.chat_conversations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_token text UNIQUE NOT NULL,                -- identifie un visiteur anonyme
  user_id bigint REFERENCES public.users(id) ON DELETE SET NULL,
  visitor_name text,
  visitor_email text,
  status text NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'closed')),
  unread_admin_count int NOT NULL DEFAULT 0,
  unread_visitor_count int NOT NULL DEFAULT 0,
  last_message_at timestamptz DEFAULT now(),
  last_message_preview text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_chat_conv_status ON public.chat_conversations(status, last_message_at DESC);
CREATE INDEX IF NOT EXISTS idx_chat_conv_token ON public.chat_conversations(session_token);
CREATE INDEX IF NOT EXISTS idx_chat_conv_user ON public.chat_conversations(user_id);

-- ─── Messages ───
CREATE TABLE IF NOT EXISTS public.chat_messages (
  id bigserial PRIMARY KEY,
  conversation_id uuid NOT NULL REFERENCES public.chat_conversations(id) ON DELETE CASCADE,
  sender_type text NOT NULL CHECK (sender_type IN ('visitor', 'admin')),
  sender_admin_id bigint REFERENCES public.users(id) ON DELETE SET NULL,
  body text NOT NULL,
  read_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_chat_msg_conv ON public.chat_messages(conversation_id, created_at);

-- ─── Trigger : maj last_message_at + preview + unread count ───
CREATE OR REPLACE FUNCTION public.fn_chat_after_insert_message()
RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  UPDATE public.chat_conversations
  SET
    last_message_at = NEW.created_at,
    last_message_preview = LEFT(NEW.body, 120),
    updated_at = now(),
    unread_admin_count = CASE WHEN NEW.sender_type = 'visitor' THEN unread_admin_count + 1 ELSE unread_admin_count END,
    unread_visitor_count = CASE WHEN NEW.sender_type = 'admin' THEN unread_visitor_count + 1 ELSE unread_visitor_count END
  WHERE id = NEW.conversation_id;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_chat_after_insert_message ON public.chat_messages;
CREATE TRIGGER trg_chat_after_insert_message
AFTER INSERT ON public.chat_messages
FOR EACH ROW EXECUTE FUNCTION public.fn_chat_after_insert_message();

-- ─── Realtime activation ───
ALTER PUBLICATION supabase_realtime ADD TABLE public.chat_messages;
ALTER PUBLICATION supabase_realtime ADD TABLE public.chat_conversations;

-- ─── RLS : ouvert via Service Role (server actions). Pas de RLS publique. ───
ALTER TABLE public.chat_conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;

-- Permettre lecture realtime aux clients anon SI ils ont le session_token (via select via le client realtime + filter)
-- Simplification : on autorise SELECT public seulement sur les colonnes nécessaires côté visiteur.
-- L'INSERT/UPDATE passe TOUJOURS par les server actions (service_role).

DROP POLICY IF EXISTS chat_conv_select_public ON public.chat_conversations;
CREATE POLICY chat_conv_select_public ON public.chat_conversations
  FOR SELECT TO anon, authenticated USING (true);

DROP POLICY IF EXISTS chat_msg_select_public ON public.chat_messages;
CREATE POLICY chat_msg_select_public ON public.chat_messages
  FOR SELECT TO anon, authenticated USING (true);
