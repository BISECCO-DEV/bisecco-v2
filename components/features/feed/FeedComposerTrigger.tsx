import Link from "next/link";
import { Hammer, HelpCircle, Lightbulb, ImageIcon, Smile, Link2 } from "lucide-react";

type Props = {
  userName: string;
  userAvatar: string | null;
  userRole: "admin" | "artisan" | "particulier";
};

/**
 * Composer "trigger" — boîte chaleureuse en haut du fil.
 * Style X/Threads : grand input, actions visuelles, kind shortcuts en bas.
 */
export function FeedComposerTrigger({ userName, userAvatar, userRole }: Props) {
  const avatar =
    userAvatar ??
    `https://api.dicebear.com/9.x/initials/svg?seed=${encodeURIComponent(userName)}`;

  const isArtisan = userRole === "artisan" || userRole === "admin";
  const firstName = userName.split(" ")[0] ?? userName;

  return (
    <div className="relative bg-white rounded-3xl border border-ink-100 shadow-[0_2px_8px_-2px_rgba(13,30,74,0.05)] overflow-hidden hover:shadow-[0_4px_14px_-2px_rgba(13,30,74,0.1)] transition-shadow">
      {/* Ligne principale */}
      <div className="p-5 flex items-center gap-3">
        <Link href="/mon-profil" className="flex-shrink-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={avatar}
            alt=""
            className="w-12 h-12 rounded-full object-cover bg-ink-100 ring-2 ring-white shadow-sm"
          />
        </Link>
        <Link
          href="/fil/nouveau"
          className="flex-1 px-5 py-3.5 rounded-full bg-ink-50 hover:bg-ink-100 text-ink-500 text-base transition border border-ink-100 hover:border-ink-200"
        >
          Quoi de neuf, <span className="text-ink-700 font-bold">{firstName}</span> ?
        </Link>
      </div>

      {/* Mini-actions visuelles (images, emoji, link — toutes via le composer) */}
      <div className="px-5 pb-3 flex items-center gap-1">
        <Link
          href="/fil/nouveau"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[0.76rem] font-semibold text-ink-500 hover:bg-ink-50 hover:text-brand-600 transition"
        >
          <ImageIcon size={14} />
          Photo
        </Link>
        <Link
          href="/fil/nouveau"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[0.76rem] font-semibold text-ink-500 hover:bg-ink-50 hover:text-brand-600 transition"
        >
          <Smile size={14} />
          Emoji
        </Link>
        <Link
          href="/fil/nouveau"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[0.76rem] font-semibold text-ink-500 hover:bg-ink-50 hover:text-brand-600 transition"
        >
          <Link2 size={14} />
          Lien
        </Link>
      </div>

      {/* Bandeau dégradé bas : shortcuts par type */}
      <div className="px-2 pb-2 grid grid-cols-3 gap-1 bg-gradient-to-b from-transparent to-ink-50/50">
        {isArtisan && (
          <Link
            href="/fil/nouveau?kind=realisation"
            className="flex items-center justify-center gap-2 py-2.5 rounded-xl hover:bg-white text-ink-500 hover:text-brand-700 text-[0.78rem] font-bold transition border border-transparent hover:border-brand-100"
          >
            <Hammer size={14} className="text-brand-500" />
            <span className="hidden sm:inline">Réalisation</span>
          </Link>
        )}
        {isArtisan && (
          <Link
            href="/fil/nouveau?kind=conseil"
            className="flex items-center justify-center gap-2 py-2.5 rounded-xl hover:bg-white text-ink-500 hover:text-violet-700 text-[0.78rem] font-bold transition border border-transparent hover:border-violet-100"
          >
            <Lightbulb size={14} className="text-violet-500" />
            <span className="hidden sm:inline">Conseil</span>
          </Link>
        )}
        <Link
          href="/fil/nouveau?kind=question"
          className={`flex items-center justify-center gap-2 py-2.5 rounded-xl hover:bg-white text-ink-500 hover:text-blue-700 text-[0.78rem] font-bold transition border border-transparent hover:border-blue-100 ${!isArtisan ? "col-span-3" : ""}`}
        >
          <HelpCircle size={14} className="text-blue-500" />
          <span className="hidden sm:inline">Question</span>
        </Link>
      </div>
    </div>
  );
}
