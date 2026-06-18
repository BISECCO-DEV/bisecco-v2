import Link from "next/link";

export type FeedItem = {
  id: number;
  name: string;
  /** Sous-ligne (email ou société) */
  meta: string;
  /** Rôle pour la pill : "artisan" | "particulier" */
  role: "artisan" | "particulier";
  /** Horodatage déjà formaté (ex: "59min", "10j") */
  timeAgo: string;
  href: string;
};

type Props = {
  items: FeedItem[];
  emptyLabel?: string;
};

const AVATAR_GRADIENT = {
  artisan:     "from-brand-500 to-orange-300",
  particulier: "from-info to-blue-400",
};

const PILL = {
  artisan:     "bg-brand-50 text-brand-500",
  particulier: "bg-info-soft text-info",
};

const ROLE_LABEL = {
  artisan:     "professionnel",
  particulier: "particulier",
};

/**
 * Feed scrollable d'inscriptions / activités récentes.
 */
export function RecentFeed({ items, emptyLabel = "Aucune activité récente." }: Props) {
  if (items.length === 0) {
    return <div className="text-center py-10 text-ink-400 text-sm">{emptyLabel}</div>;
  }

  return (
    <div className="max-h-[460px] overflow-y-auto">
      {items.map((item) => (
        <Link
          key={item.id}
          href={item.href}
          className="flex items-center gap-3 px-5 py-3 border-b border-sand-200 last:border-b-0 hover:bg-sand-100/60 transition-colors"
        >
          <span className={`w-8 h-8 rounded-full bg-gradient-to-br ${AVATAR_GRADIENT[item.role]} grid place-items-center text-white font-display font-semibold text-[0.78rem] flex-shrink-0`}>
            {item.name.charAt(0).toUpperCase()}
          </span>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[0.82rem] font-medium text-ink-900">{item.name}</span>
              <span className={`text-[0.6rem] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded ${PILL[item.role]}`}>
                {ROLE_LABEL[item.role]}
              </span>
            </div>
            <div className="text-[0.72rem] text-ink-400 truncate mt-0.5">{item.meta}</div>
          </div>
          <span className="text-[0.7rem] text-ink-400 font-mono flex-shrink-0">{item.timeAgo}</span>
        </Link>
      ))}
    </div>
  );
}
