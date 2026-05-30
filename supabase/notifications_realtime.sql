-- Active Realtime sur app_notifications (badge live dans le header)
-- Ignorer l'erreur "already exists" si la table est déjà publiée
ALTER PUBLICATION supabase_realtime ADD TABLE public.app_notifications;
