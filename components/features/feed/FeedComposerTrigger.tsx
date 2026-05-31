import Link from "next/link";
import { Hammer, HelpCircle, Lightbulb, Image as ImageIcon } from "lucide-react";

type Props = {
  userName: string;
  userAvatar: string | null;
  userRole: "admin" | "artisan" | "particulier";
};

/**
 * Composer "trigger" inline en haut du fil, style LinkedIn / Facebook.
 * Cliquer dessus redirige vers /fil/nouveau (page composer dédiée).
 */
export function FeedComposerTrigger({ userName, userAvatar, userRole }: Props) {
  const avatar =
    userAvatar ??
    `https://api.dicebear.com/9.x/initials/svg?seed=${encodeURIComponent(userName)}`;

  const isArtisan = userRole === "artisan" || userRole === "admin";

  return (
    <div className="bg-white rounded-2xl border border-ink-100 shadow-[0_1px_2px_rgba(13,30,74,0.04)] overflow-hidden">
      {/* Ligne principale : avatar + faux input */}
      <div className="p-4 flex items-center gap-3">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={avatar}
          alt=""
          className="w-11 h-11 rounded-full object-cover bg-ink-100 ring-2 ring-white shadow-sm flex-shrink-0"
        />
        <Link
          href="/fil/nouveau"
          className="flex-1 px-5 py-3 rounded-full bg-ink-50 hover:bg-ink-100 text-ink-500 text-sm font-medium transition border border-ink-100 hover:border-ink-200"
        >
          Quoi de neuf, <span className="text-ink-700 font-bold">{userName.split(" ")[0]}</span> ?
        </Link>
      </div>

      {/* Shortcuts par type */}
      <div className="px-3 pb-3 grid grid-cols-3 gap-1">
        {isArtisan && (
          <Link
            href="/fil/nouveau?kind=realisation"
            className="flex items-center justify-center gap-2 py-2.5 rounded-lg hover:bg-brand-50 text-ink-600 hover:text-brand-700 text-[0.82rem] font-semibold transition"
          >
            <Hammer size={16} className="text-brand-500" />
            <span className="hidden sm:inline">Réalisation</span>
          </Link>
        )}
        {isArtisan && (
          <Link
            href="/fil/nouveau?kind=conseil"
            className="flex items-center justify-center gap-2 py-2.5 rounded-lg hover:bg-violet-50 text-ink-600 hover:text-violet-700 text-[0.82rem] font-semibold transition"
          >
            <Lightbulb size={16} className="text-violet-500" />
            <span className="hidden sm:inline">Conseil</span>
          </Link>
        )}
        <Link
          href="/fil/nouveau?kind=question"
          className={`flex items-center justify-center gap-2 py-2.5 rounded-lg hover:bg-blue-50 text-ink-600 hover:text-blue-700 text-[0.82rem] font-semibold transition ${!isArtisan ? "col-span-3" : ""}`}
        >
          <HelpCircle size={16} className="text-blue-500" />
          <span className="hidden sm:inline">Question</span>
        </Link>
      </div>
    </div>
  );
}
