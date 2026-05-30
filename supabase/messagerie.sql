-- ============================================================
-- Messagerie 1:1 entre utilisateurs (particulier ↔ artisan)
-- ============================================================

-- ─── Threads (conversations) ───
CREATE TABLE IF NOT EXISTS public.message_threads (
  id bigserial PRIMARY KEY,
  user_a_id bigint NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  user_b_id bigint NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  last_message_at timestamptz DEFAULT now(),
  last_message_preview text,
  unread_a_count int NOT NULL DEFAULT 0,
  unread_b_count int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  -- Garantit l'unicité du thread peu importe l'ordre user_a/user_b
  CONSTRAINT thread_users_order CHECK (user_a_id < user_b_id),
  CONSTRAINT thread_unique UNIQUE (user_a_id, user_b_id)
);

CREATE INDEX IF NOT EXISTS idx_threads_user_a ON public.message_threads(user_a_id, last_message_at DESC);
CREATE INDEX IF NOT EXISTS idx_threads_user_b ON public.message_threads(user_b_id, last_message_at DESC);

-- ─── Messages ───
CREATE TABLE IF NOT EXISTS public.messages (
  id bigserial PRIMARY KEY,
  thread_id bigint NOT NULL REFERENCES public.message_threads(id) ON DELETE CASCADE,
  sender_id bigint NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  body text NOT NULL,
  read_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_messages_thread ON public.messages(thread_id, created_at);
CREATE INDEX IF NOT EXISTS idx_messages_sender ON public.messages(sender_id);

-- ─── Trigger : maj thread après insert message ───
CREATE OR REPLACE FUNCTION public.fn_messages_after_insert()
RETURNS trigger LANGUAGE plpgsql AS $$
DECLARE
  v_thread record;
BEGIN
  SELECT user_a_id, user_b_id INTO v_thread FROM public.message_threads WHERE id = NEW.thread_id;
  UPDATE public.message_threads
  SET
    last_message_at = NEW.created_at,
    last_message_preview = LEFT(NEW.body, 120),
    updated_at = now(),
    unread_a_count = CASE WHEN NEW.sender_id = v_thread.user_b_id THEN unread_a_count + 1 ELSE unread_a_count END,
    unread_b_count = CASE WHEN NEW.sender_id = v_thread.user_a_id THEN unread_b_count + 1 ELSE unread_b_count END
  WHERE id = NEW.thread_id;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_messages_after_insert ON public.messages;
CREATE TRIGGER trg_messages_after_insert
AFTER INSERT ON public.messages
FOR EACH ROW EXECUTE FUNCTION public.fn_messages_after_insert();

-- ─── Realtime ───
ALTER PUBLICATION supabase_realtime ADD TABLE public.messages;
ALTER PUBLICATION supabase_realtime ADD TABLE public.message_threads;

-- ─── RLS : SELECT public via service_role (server actions) ───
ALTER TABLE public.message_threads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS threads_select_public ON public.message_threads;
CREATE POLICY threads_select_public ON public.message_threads
  FOR SELECT TO anon, authenticated USING (true);

DROP POLICY IF EXISTS messages_select_public ON public.messages;
CREATE POLICY messages_select_public ON public.messages
  FOR SELECT TO anon, authenticated USING (true);
