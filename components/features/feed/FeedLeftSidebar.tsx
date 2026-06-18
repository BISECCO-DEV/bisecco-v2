import Link from "next/link";
import {
  Heart, MessageCircle, PenSquare, MapPin, ShieldCheck, ArrowRight, Sparkles,
} from "lucide-react";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import type { CurrentUser } from "@/lib/db/current-user";

type Counts = { posts: number; likesGiven: number; comments: number };

async function fetchUserActivity(userId: number): Promise<Counts> {
  const admin = createSupabaseAdminClient();
  const [{ count: posts }, { count: likesGiven }, { count: comments }] = await Promise.all([
    admin.from("feed_posts").select("*", { count: "exact", head: true })
      .eq("author_id", userId)
      .in("status", ["approved", "pending"]),
    admin.from("feed_likes").select("*", { count: "exact", head: true })
      .eq("user_id", userId),
    admin.from("feed_comments").select("*", { count: "exact", head: true })
      .eq("author_id", userId),
  ]);
  return {
    posts: posts ?? 0,
    likesGiven: likesGiven ?? 0,
    comments: comments ?? 0,
  };
}

/** Pourcentage de complétion du profil selon les champs renseignés. */
function computeCompletion(user: CurrentUser): { pct: number; missing: string[] } {
  const checks: Array<{ ok: boolean; label: string }> = [
    { ok: Boolean(user.profile_photo), label: "Photo de profil" },
    { ok: Boolean(user.city), label: "Ville" },
    { ok: Boolean(user.phone), label: "Téléphone" },
    { ok: Boolean(user.description && user.description.length > 30), label: "Description (30+ caractères)" },
  ];
  if (user.role === "artisan") {
    checks.push({ ok: Boolean(user.cover_photo), label: "Photo de couverture" });
    checks.push({ ok: Boolean(user.siren), label: "SIREN" });
  }
  const ok = checks.filter((c) => c.ok).length;
  const pct = Math.round((ok / checks.length) * 100);
  return {
    pct,
    missing: checks.filter((c) => !c.ok).map((c) => c.label),
  };
}

/**
 * Sidebar gauche du fil — mini profil utilisateur, complétion, raccourcis.
 * Visible uniquement quand l'utilisateur est connecté (sinon le grid retombe en 2 cols).
 */
export async function FeedLeftSidebar({ user }: { user: CurrentUser }) {
  if (!user.id) return null;

  const [counts, completion] = await Promise.all([
    fetchUserActivity(user.id),
    Promise.resolve(computeCompletion(user)),
  ]);

  const avatarUrl =
    user.profile_photo ??
    `https://api.dicebear.com/9.x/initials/svg?seed=${encodeURIComponent(user.display_name)}`;

  const isArtisan = user.role === "artisan" || user.role === "admin";
  const profileHref = user.client_number ? `/profil/${user.client_number}` : "/mon-profil";

  return (
    <aside className="space-y-4 sticky top-24">
      {/* Mini profil card */}
      <div className="bg-white rounded-3xl border border-ink-100 overflow-hidden shadow-[0_2px_8px_-2px_rgba(13,30,74,0.04)]">
        {/* Cover gradient subtil */}
        <div className="relative h-16 bg-gradient-to-br from-brand-400 via-brand-500 to-brand-600">
          {user.cover_photo && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={user.cover_photo}
              alt=""
              className="w-full h-full object-cover"
            />
          )}
        </div>

        {/* Avatar débordant */}
        <div className="px-5 -mt-9">
          <Link href={profileHref} className="inline-block group">
            <div className="relative">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={avatarUrl}
                alt=""
                className="w-[72px] h-[72px] rounded-full object-cover bg-ink-100 ring-4 ring-white shadow-md group-hover:ring-brand-100 transition"
              />
              {isArtisan && (
                <span
                  title="Professionnel vérifié"
                  className="absolute -bottom-0.5 -right-0.5 w-6 h-6 rounded-full bg-emerald-500 border-2 border-white inline-flex items-center justify-center"
                >
                  <ShieldCheck size={12} className="text-white" strokeWidth={3} />
                </span>
              )}
            </div>
          </Link>

          <div className="mt-2">
            <Link
              href={profileHref}
              className="font-extrabold text-ink-700 text-[0.95rem] hover:text-brand-600 transition leading-tight block"
            >
              {user.display_name}
            </Link>
            <div className="text-[0.74rem] text-ink-500 mt-0.5 capitalize">
              {user.role === "artisan" ? "Professionnel" : user.role === "admin" ? "Admin" : "Particulier"}
            </div>
            {user.city && (
              <div className="mt-1 inline-flex items-center gap-1 text-[0.7rem] text-ink-400">
                <MapPin size={10} /> {user.city}
              </div>
            )}
          </div>
        </div>

        {/* Stats activité */}
        <div className="mx-5 mt-3 mb-5 grid grid-cols-3 gap-1 pt-3 border-t border-ink-100">
          <ActivityStat icon={PenSquare} count={counts.posts} label="posts" />
          <ActivityStat icon={Heart} count={counts.likesGiven} label="likes" />
          <ActivityStat icon={MessageCircle} count={counts.comments} label="comm." />
        </div>
      </div>

      {/* Complétion du profil */}
      {completion.pct < 100 && (
        <div className="bg-gradient-to-br from-brand-50 to-amber-50 rounded-3xl border border-brand-200 p-5">
          <div className="flex items-center gap-2 mb-1">
            <Sparkles size={14} className="text-brand-600" />
            <span className="text-[0.72rem] font-extrabold text-brand-700 uppercase tracking-wider">
              Profil à compléter
            </span>
          </div>
          <div className="mt-2 flex items-baseline gap-1.5">
            <span className="text-2xl font-extrabold text-ink-700 tabular-nums">{completion.pct}</span>
            <span className="text-sm font-bold text-ink-500">%</span>
          </div>
          {/* Barre de progression */}
          <div className="mt-2 h-1.5 bg-white/70 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-brand-500 to-amber-500 transition-all"
              style={{ width: `${completion.pct}%` }}
            />
          </div>
          {completion.missing.length > 0 && (
            <ul className="mt-3 space-y-1 text-[0.72rem] text-ink-600">
              {completion.missing.slice(0, 3).map((m) => (
                <li key={m} className="flex items-center gap-1.5">
                  <span className="w-1 h-1 rounded-full bg-brand-500 flex-shrink-0" />
                  {m}
                </li>
              ))}
            </ul>
          )}
          <Link
            href="/mon-profil/edit"
            className="mt-3 inline-flex items-center gap-1 text-[0.74rem] font-extrabold text-brand-700 hover:underline"
          >
            Compléter <ArrowRight size={11} />
          </Link>
        </div>
      )}

      {/* Raccourcis */}
      <nav className="bg-white rounded-3xl border border-ink-100 p-2 shadow-[0_2px_8px_-2px_rgba(13,30,74,0.04)]">
        <ShortcutLink href={profileHref} label="Mon profil public" />
        <ShortcutLink href="/mon-profil" label="Mon espace" />
        <ShortcutLink href="/mon-profil/avis" label="Mes avis" />
        <ShortcutLink href="/mon-profil/devis" label="Mes devis" />
        <ShortcutLink href="/messagerie" label="Messagerie" />
      </nav>
    </aside>
  );
}

function ActivityStat({
  icon: Icon,
  count,
  label,
}: {
  icon: typeof Heart;
  count: number;
  label: string;
}) {
  return (
    <div className="text-center">
      <Icon size={14} className="text-ink-400 mx-auto mb-1" />
      <div className="text-sm font-extrabold text-ink-700 tabular-nums leading-none">
        {count}
      </div>
      <div className="text-[0.6rem] text-ink-400 mt-0.5 uppercase tracking-wider">
        {label}
      </div>
    </div>
  );
}

function ShortcutLink({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      className="flex items-center justify-between px-3 py-2.5 rounded-xl text-[0.85rem] font-bold text-ink-600 hover:bg-brand-50 hover:text-brand-700 transition group"
    >
      <span>{label}</span>
      <ArrowRight size={12} className="text-ink-300 group-hover:text-brand-500 group-hover:translate-x-0.5 transition" />
    </Link>
  );
}
