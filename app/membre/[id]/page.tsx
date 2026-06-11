import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MapPin, ArrowLeft, UserIcon, ShieldCheck } from "lucide-react";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { getCurrentUser } from "@/lib/db/current-user";
import { FollowButton } from "@/components/features/FollowButton";
import { ContactButton } from "@/components/features/ContactButton";
import { countFollowers, countFollowing, isFollowing } from "@/lib/follows/actions";

type Props = { params: Promise<{ id: string }> };

type ParticulierProfile = {
  id: number;
  client_number: string | null;
  name: string;
  city: string | null;
  description: string | null;
  profile_photo: string | null;
  cover_photo: string | null;
  role: "particulier" | "artisan" | "admin";
  created_at: string;
};

async function fetchParticulierProfile(idOrClientNumber: string): Promise<ParticulierProfile | null> {
  const admin = createSupabaseAdminClient();
  const isNumeric = /^\d+$/.test(idOrClientNumber);
  const query = admin
    .from("users")
    .select("id, client_number, name, city, description, profile_photo, cover_photo, role, created_at")
    .eq("role", "particulier")
    .eq("validation_status", "approved")
    .is("deleted_at", null);

  const { data } = isNumeric
    ? await query.eq("id", Number(idOrClientNumber)).maybeSingle()
    : await query.eq("client_number", idOrClientNumber).maybeSingle();

  return data as ParticulierProfile | null;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const profile = await fetchParticulierProfile(id);
  if (!profile) return { title: "Membre · Bisecco", robots: { index: false } };
  return {
    title: `${profile.name} · Membre Bisecco`,
    description: `Profil de ${profile.name} sur Bisecco${profile.city ? `, ${profile.city}` : ""}.`,
    robots: { index: false, follow: false },
  };
}

export default async function MembrePage({ params }: Props) {
  const { id } = await params;
  const [profile, currentUser] = await Promise.all([
    fetchParticulierProfile(id),
    getCurrentUser(),
  ]);
  if (!profile) notFound();

  const isOwnProfile = currentUser?.id === profile.id;
  const [followerCount, followingCount, alreadyFollowing] = await Promise.all([
    countFollowers(profile.id),
    countFollowing(profile.id),
    currentUser?.id && !isOwnProfile ? isFollowing(currentUser.id, profile.id) : Promise.resolve(false),
  ]);

  const avatarUrl =
    profile.profile_photo ?? `https://api.dicebear.com/9.x/initials/svg?seed=${encodeURIComponent(profile.name)}`;

  return (
    <div className="bg-[#fafbfc] min-h-screen pb-16">
      {/* Cover photo */}
      <div className="relative w-full h-[200px] sm:h-[280px] bg-gradient-to-br from-blue-100 via-indigo-100 to-ink-100 overflow-hidden">
        {profile.cover_photo && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={profile.cover_photo} alt="" className="w-full h-full object-cover" />
        )}
      </div>

      <div className="container-default max-w-3xl -mt-16 sm:-mt-20 relative">
        {/* Card profil */}
        <div className="bg-white rounded-3xl border border-ink-100 shadow-[0_4px_24px_-4px_rgba(13,30,74,0.08)] overflow-hidden">
          <div className="p-5 sm:p-7">
            <Link
              href="/fil"
              className="inline-flex items-center gap-1.5 text-xs text-ink-400 hover:text-brand-500 font-semibold transition mb-4"
            >
              <ArrowLeft size={12} /> Retour
            </Link>

            <div className="flex flex-col sm:flex-row items-start sm:items-end gap-4">
              {/* Avatar */}
              <div className="relative -mt-12 sm:-mt-16">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={avatarUrl}
                  alt=""
                  className="w-24 h-24 sm:w-32 sm:h-32 rounded-3xl object-cover bg-ink-100 ring-4 ring-white shadow-lg"
                />
                <span
                  title="Particulier vérifié Bisecco"
                  className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-blue-500 border-2 border-white inline-flex items-center justify-center"
                >
                  <UserIcon size={12} className="text-white" strokeWidth={3} />
                </span>
              </div>

              {/* Identité + actions */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="text-xl sm:text-2xl font-extrabold text-ink-900 tracking-tight">{profile.name}</h1>
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-[0.62rem] font-bold tracking-wider uppercase">
                    Particulier
                  </span>
                </div>
                <div className="mt-1 flex items-center gap-1.5 text-sm text-ink-500">
                  <ShieldCheck size={12} className="text-emerald-500" />
                  Membre vérifié Bisecco
                  {profile.city && (
                    <>
                      <span className="text-ink-300">·</span>
                      <span className="inline-flex items-center gap-0.5">
                        <MapPin size={11} /> {profile.city}
                      </span>
                    </>
                  )}
                </div>
                <div className="mt-2 flex items-center gap-3 text-xs text-ink-500">
                  <span><strong className="text-ink-700">{followerCount}</strong> abonné{followerCount > 1 ? "s" : ""}</span>
                  <span className="text-ink-300">·</span>
                  <span><strong className="text-ink-700">{followingCount}</strong> abonnement{followingCount > 1 ? "s" : ""}</span>
                </div>
              </div>
            </div>

            {/* Description */}
            {profile.description && (
              <div className="mt-5 p-4 rounded-2xl bg-ink-50/60 border border-ink-100 text-sm text-ink-700 leading-relaxed whitespace-pre-wrap">
                {profile.description}
              </div>
            )}

            {/* Boutons d'action */}
            {!isOwnProfile && (
              <div className="mt-5 flex flex-wrap items-center gap-3">
                <FollowButton
                  targetUserId={profile.id}
                  initialFollowing={alreadyFollowing}
                  initialFollowerCount={followerCount}
                  canFollow={!!currentUser}
                  isOwnProfile={false}
                />
                <ContactButton
                  recipientId={profile.id}
                  recipientName={profile.name}
                  variant="outline"
                  isLoggedIn={!!currentUser}
                  loginRedirect={`/membre/${id}`}
                />
              </div>
            )}

            {isOwnProfile && (
              <div className="mt-5 p-4 rounded-2xl bg-brand-50 border border-brand-200 text-sm text-brand-800">
                C&apos;est ton profil. Modifie-le depuis ton{" "}
                <Link href="/mon-profil/edit" className="font-bold underline">espace personnel</Link>.
              </div>
            )}
          </div>
        </div>

        {/* Note membre */}
        <p className="mt-5 text-center text-[0.72rem] text-ink-400 leading-relaxed">
          {profile.name.split(" ")[0]} est un particulier membre de la communauté Bisecco.<br />
          Tu peux le suivre pour voir ses publications dans ton fil et lui écrire directement.
        </p>
      </div>
    </div>
  );
}
