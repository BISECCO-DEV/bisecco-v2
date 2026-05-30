"use client";

import { useEffect, useState, useCallback } from "react";
import { UserPlus, Share2, Copy, Check, MessageSquare, Mail, X, Smartphone } from "lucide-react";

type ContactPickerProperty = "name" | "email" | "tel" | "address" | "icon";
type Contact = { name?: string[]; tel?: string[]; email?: string[] };

interface ContactsManager {
  select(properties: ContactPickerProperty[], options?: { multiple?: boolean }): Promise<Contact[]>;
  getProperties(): Promise<ContactPickerProperty[]>;
}

declare global {
  interface Navigator {
    contacts?: ContactsManager;
  }
}

export interface InviteButtonProps {
  /** Lien de parrainage unique du user (ex: https://bisecco.eu/r/laurent-a3f7) */
  referralUrl: string;
  /** Variant visuel du bouton */
  variant?: "primary" | "ghost" | "compact";
  /** Texte custom (par défaut "Inviter mes contacts") */
  label?: string;
  className?: string;
}

const SMS_MESSAGE = (url: string) =>
  `Rejoins-moi sur Bisecco, l'annuaire d'artisans verifies gratuit 👇 ${url}`;

const WHATSAPP_MESSAGE = (url: string) =>
  `Salut ! Je viens de decouvrir Bisecco, un annuaire d'artisans francais verifies (SIREN controle) et 100% gratuit. Je te recommande, ca peut t'etre utile 👇\n${url}`;

const EMAIL_SUBJECT = "Decouvre Bisecco · annuaire d'artisans verifies";
const EMAIL_BODY = (url: string) =>
  `Salut !\n\nJe viens de decouvrir Bisecco, un annuaire d'artisans francais verifies (SIREN controle) et 100% gratuit.\n\nJe te recommande, ca peut vraiment t'etre utile :\n${url}\n\nA bientot !`;

type Platform = "android-picker" | "ios-sms" | "mobile" | "desktop";

function detectPlatform(): Platform {
  if (typeof navigator === "undefined") return "desktop";
  const ua = navigator.userAgent;
  const isAndroid = /Android/i.test(ua);
  const isIOS = /iPhone|iPad|iPod/i.test(ua);
  const hasContactPicker = isAndroid && typeof navigator.contacts?.select === "function";

  if (hasContactPicker) return "android-picker";
  if (isIOS) return "ios-sms";
  if (isAndroid) return "mobile";
  return "desktop";
}

export function InviteButton({
  referralUrl,
  variant = "primary",
  label = "Inviter mes contacts",
  className = "",
}: InviteButtonProps) {
  const [platform, setPlatform] = useState<Platform>("desktop");
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [status, setStatus] = useState<string | null>(null);

  useEffect(() => {
    setPlatform(detectPlatform());
  }, []);

  const trackInvite = useCallback((channel: string, count = 1) => {
    if (typeof window === "undefined") return;
    type WithDataLayer = Window & { dataLayer?: Array<Record<string, unknown>> };
    const w = window as WithDataLayer;
    w.dataLayer = w.dataLayer || [];
    w.dataLayer.push({ event: "invite_sent", channel, count });
  }, []);

  // --- ANDROID : Contact Picker API natif ---
  const handleAndroidPicker = useCallback(async () => {
    if (!navigator.contacts) return;
    try {
      const contacts = await navigator.contacts.select(["name", "tel"], { multiple: true });
      if (!contacts.length) return;

      const numbers = contacts
        .flatMap((c) => c.tel ?? [])
        .map((n) => n.replace(/\s/g, ""))
        .filter(Boolean);

      if (!numbers.length) {
        setStatus("Aucun numero trouve dans les contacts selectionnes.");
        return;
      }

      const body = encodeURIComponent(SMS_MESSAGE(referralUrl));
      const recipients = numbers.join(",");
      window.location.href = `sms:${recipients}?body=${body}`;
      trackInvite("android_contact_picker", numbers.length);
      setOpen(false);
    } catch (err) {
      if ((err as Error).name !== "AbortError") {
        setStatus("Impossible d'ouvrir le repertoire. Essaie une autre methode.");
      }
    }
  }, [referralUrl, trackInvite]);

  // --- iOS : ouvre Messages avec body pre-rempli, user choisit ses contacts dedans ---
  const handleIosSms = useCallback(() => {
    const body = encodeURIComponent(SMS_MESSAGE(referralUrl));
    // iOS utilise & au lieu de ? pour le 1er param body (quirk Apple)
    window.location.href = `sms:&body=${body}`;
    trackInvite("ios_sms", 0);
    setOpen(false);
  }, [referralUrl, trackInvite]);

  // --- WhatsApp universel ---
  const handleWhatsapp = useCallback(() => {
    const text = encodeURIComponent(WHATSAPP_MESSAGE(referralUrl));
    window.open(`https://wa.me/?text=${text}`, "_blank", "noopener");
    trackInvite("whatsapp", 0);
    setOpen(false);
  }, [referralUrl, trackInvite]);

  // --- Email ---
  const handleEmail = useCallback(() => {
    const subject = encodeURIComponent(EMAIL_SUBJECT);
    const body = encodeURIComponent(EMAIL_BODY(referralUrl));
    window.location.href = `mailto:?subject=${subject}&body=${body}`;
    trackInvite("email", 0);
    setOpen(false);
  }, [referralUrl, trackInvite]);

  // --- Copier le lien ---
  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(referralUrl);
      setCopied(true);
      trackInvite("copy_link", 0);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      setStatus("Impossible de copier. Selectionne le lien manuellement.");
    }
  }, [referralUrl, trackInvite]);

  // --- Web Share API natif (desktop moderne + mobile fallback) ---
  const handleNativeShare = useCallback(async () => {
    if (typeof navigator === "undefined" || !navigator.share) return;
    try {
      await navigator.share({
        title: "Bisecco",
        text: "Rejoins-moi sur Bisecco, l'annuaire d'artisans verifies gratuit",
        url: referralUrl,
      });
      trackInvite("native_share", 0);
      setOpen(false);
    } catch {
      // user a annule, on ignore
    }
  }, [referralUrl, trackInvite]);

  // --- Action principale : route vers le bon flow selon la plateforme ---
  const handlePrimaryAction = useCallback(() => {
    if (platform === "android-picker") {
      handleAndroidPicker();
    } else {
      setOpen(true);
    }
  }, [platform, handleAndroidPicker]);

  // --- Styles bouton ---
  const buttonClass =
    variant === "primary"
      ? "inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-brand-500 text-white font-bold text-sm hover:bg-brand-600 active:scale-[0.98] transition-all shadow-[0_4px_14px_rgba(240,122,47,0.35)]"
      : variant === "ghost"
        ? "inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white border-2 border-ink-100 text-ink-700 font-bold text-sm hover:border-brand-300 hover:text-brand-600 transition"
        : "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-brand-50 text-brand-700 font-bold text-xs hover:bg-brand-100 transition";

  return (
    <>
      <button
        type="button"
        onClick={handlePrimaryAction}
        className={`${buttonClass} ${className}`}
        aria-label={label}
      >
        <UserPlus size={variant === "compact" ? 13 : 16} strokeWidth={2.5} />
        <span>{label}</span>
      </button>

      {/* Modal de partage (iOS / mobile / desktop) */}
      {open && (
        <div
          className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center bg-ink-900/60 backdrop-blur-sm animate-fade-in"
          role="dialog"
          aria-modal="true"
          aria-labelledby="invite-title"
          onClick={() => setOpen(false)}
        >
          <div
            className="w-full sm:max-w-md bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl p-6 sm:p-7 animate-slide-up"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between mb-5">
              <div>
                <h2 id="invite-title" className="text-xl font-extrabold text-ink-700">
                  Inviter mes contacts
                </h2>
                <p className="mt-1 text-sm text-ink-500">
                  Les SMS sont envoyes depuis ton forfait · Bisecco ne facture rien.
                </p>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="p-1.5 rounded-lg hover:bg-ink-50 text-ink-400 hover:text-ink-700 transition"
                aria-label="Fermer"
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-2.5">
              {(platform === "ios-sms" || platform === "mobile") && (
                <ChannelButton
                  icon={<MessageSquare size={18} />}
                  label="SMS"
                  hint={
                    platform === "ios-sms"
                      ? "Ouvre Messages avec ton texte pret"
                      : "Ouvre ton app SMS avec ton texte pret"
                  }
                  onClick={handleIosSms}
                  tone="brand"
                />
              )}

              <ChannelButton
                icon={
                  <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden>
                    <path d="M.057 24l1.687-6.163a11.867 11.867 0 01-1.587-5.946C.16 5.335 5.495 0 12.05 0a11.817 11.817 0 018.413 3.488 11.824 11.824 0 013.48 8.414c-.003 6.557-5.338 11.892-11.893 11.892a11.9 11.9 0 01-5.688-1.448L.057 24zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884a9.86 9.86 0 001.516 5.262l-.999 3.648 3.972-1.039zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413z"/>
                  </svg>
                }
                label="WhatsApp"
                hint="Partage via WhatsApp"
                onClick={handleWhatsapp}
                tone="success"
              />

              <ChannelButton
                icon={<Mail size={18} />}
                label="Email"
                hint="Ouvre ta messagerie avec un texte pret"
                onClick={handleEmail}
                tone="info"
              />

              {typeof navigator !== "undefined" && typeof navigator.share === "function" && (
                <ChannelButton
                  icon={<Share2 size={18} />}
                  label="Plus d'options"
                  hint="Ouvre le menu de partage natif"
                  onClick={handleNativeShare}
                  tone="neutral"
                />
              )}
            </div>

            {/* Lien à copier */}
            <div className="mt-5 pt-5 border-t border-ink-100">
              <label className="block text-[0.66rem] font-bold tracking-wider text-ink-400 uppercase mb-2">
                Ou copie le lien
              </label>
              <div className="flex items-center gap-2">
                <div className="flex-1 px-3 py-2.5 rounded-lg bg-ink-50 border border-ink-100 text-xs font-mono text-ink-700 truncate">
                  {referralUrl}
                </div>
                <button
                  onClick={handleCopy}
                  className="inline-flex items-center gap-1.5 px-3 py-2.5 rounded-lg bg-ink-700 text-white text-xs font-bold hover:bg-ink-800 transition flex-shrink-0"
                  aria-label="Copier le lien"
                >
                  {copied ? <Check size={14} /> : <Copy size={14} />}
                  {copied ? "Copie" : "Copier"}
                </button>
              </div>
            </div>

            {status && (
              <p className="mt-4 text-xs text-amber-700 bg-amber-50 border border-amber-200 px-3 py-2 rounded-lg">
                {status}
              </p>
            )}

            {platform === "desktop" && (
              <p className="mt-4 text-[0.7rem] text-ink-400 inline-flex items-center gap-1.5">
                <Smartphone size={11} />
                Pour envoyer des SMS, ouvre Bisecco depuis ton mobile.
              </p>
            )}
          </div>
        </div>
      )}
    </>
  );
}

function ChannelButton({
  icon,
  label,
  hint,
  onClick,
  tone,
}: {
  icon: React.ReactNode;
  label: string;
  hint: string;
  onClick: () => void;
  tone: "brand" | "success" | "info" | "neutral";
}) {
  const tones: Record<typeof tone, string> = {
    brand: "bg-brand-50 text-brand-600 group-hover:bg-brand-100",
    success: "bg-emerald-50 text-emerald-600 group-hover:bg-emerald-100",
    info: "bg-blue-50 text-blue-600 group-hover:bg-blue-100",
    neutral: "bg-ink-50 text-ink-600 group-hover:bg-ink-100",
  };
  return (
    <button
      type="button"
      onClick={onClick}
      className="group w-full flex items-center gap-3 px-4 py-3 rounded-xl border-2 border-ink-100 hover:border-brand-300 bg-white text-left transition"
    >
      <span className={`w-10 h-10 rounded-xl flex items-center justify-center transition ${tones[tone]}`}>
        {icon}
      </span>
      <span className="flex-1 min-w-0">
        <span className="block text-sm font-extrabold text-ink-700">{label}</span>
        <span className="block text-xs text-ink-500 truncate">{hint}</span>
      </span>
    </button>
  );
}
