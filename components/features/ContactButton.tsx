"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { MessageSquare, X, Send, AlertCircle } from "lucide-react";
import { sendMessageAction, getOrCreateThreadAction } from "@/lib/messages/actions";

type Props = {
  recipientId: number;
  recipientName: string;
  /** Affichage : "button" classique ou "icon" compact */
  variant?: "button" | "icon" | "outline";
  /** Si l'utilisateur n'est pas loggé, où le rediriger */
  loginRedirect?: string;
  /** L'utilisateur courant est-il connecté ? (passé depuis Server Component) */
  isLoggedIn?: boolean;
  className?: string;
};

export function ContactButton({
  recipientId,
  recipientName,
  variant = "button",
  loginRedirect,
  isLoggedIn = true,
  className = "",
}: Props) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isLoggedIn) {
      router.push(`/connexion?redirect=${encodeURIComponent(loginRedirect ?? "/")}`);
      return;
    }
    setOpen(true);
  };

  const send = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || sending) return;
    setSending(true);
    setError(null);
    const res = await sendMessageAction(recipientId, message.trim());
    setSending(false);
    if (!res.ok) {
      setError(res.error);
      return;
    }
    setSent(true);
    setTimeout(() => {
      router.push(`/messagerie/${res.threadId}`);
    }, 1200);
  };

  const openConversation = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isLoggedIn) {
      router.push(`/connexion?redirect=${encodeURIComponent(loginRedirect ?? "/")}`);
      return;
    }
    const res = await getOrCreateThreadAction(recipientId);
    if (res.ok) router.push(`/messagerie/${res.threadId}`);
  };

  return (
    <>
      {variant === "icon" ? (
        <button
          onClick={handleClick}
          className={`inline-flex items-center justify-center w-9 h-9 rounded-full bg-brand-500 text-white hover:bg-brand-600 transition ${className}`}
          aria-label={`Contacter ${recipientName}`}
        >
          <MessageSquare size={15} />
        </button>
      ) : variant === "outline" ? (
        <button
          onClick={handleClick}
          className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border-2 border-brand-500 text-brand-600 font-bold text-xs hover:bg-brand-50 transition ${className}`}
        >
          <MessageSquare size={13} /> Contacter
        </button>
      ) : (
        <button
          onClick={handleClick}
          className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-brand-500 text-white font-bold text-sm hover:bg-brand-600 transition ${className}`}
        >
          <MessageSquare size={14} /> Contacter
        </button>
      )}

      {/* Modal */}
      {open && (
        <div
          className="fixed inset-0 z-[100] bg-ink-900/60 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={(e) => { if (e.target === e.currentTarget) setOpen(false); }}
        >
          <div className="bg-white rounded-3xl shadow-2xl border border-ink-100 max-w-md w-full overflow-hidden">
            <header className="p-5 border-b border-ink-100 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-ink-700">Contacter {recipientName}</h3>
                <p className="text-xs text-ink-500 mt-0.5">Votre message arrivera dans sa messagerie + email</p>
              </div>
              <button onClick={() => setOpen(false)} className="text-ink-400 hover:text-ink-700">
                <X size={20} />
              </button>
            </header>

            {sent ? (
              <div className="p-8 text-center">
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-emerald-100 mb-3">
                  <Send size={24} className="text-emerald-600" />
                </div>
                <h4 className="font-bold text-ink-700">Message envoyé !</h4>
                <p className="text-sm text-ink-500 mt-1">Redirection vers la conversation…</p>
              </div>
            ) : (
              <form onSubmit={send} className="p-5 space-y-3">
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder={`Bonjour ${recipientName}, j'ai un projet de…`}
                  rows={5}
                  required
                  minLength={5}
                  maxLength={4000}
                  autoFocus
                  className="w-full px-3 py-2.5 rounded-xl bg-ink-50 border-2 border-ink-200 focus:border-brand-500 focus:bg-white outline-none text-sm resize-y"
                />
                {error && (
                  <p className="text-xs text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2 flex items-center gap-1.5">
                    <AlertCircle size={12} /> {error}
                  </p>
                )}
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={openConversation}
                    className="text-xs text-brand-500 font-bold hover:underline"
                  >
                    Ouvrir la conversation →
                  </button>
                  <div className="flex-1" />
                  <button
                    type="submit"
                    disabled={!message.trim() || sending}
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-brand-500 text-white font-bold text-sm hover:bg-brand-600 disabled:opacity-40 transition"
                  >
                    {sending ? "Envoi…" : (<><Send size={13} /> Envoyer</>)}
                  </button>
                </div>
                <p className="text-[0.65rem] text-ink-400 text-center pt-1">
                  Messagerie sécurisée Bisecco · pas de spam, désinscription possible
                </p>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
}
