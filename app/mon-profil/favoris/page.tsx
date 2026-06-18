import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowLeft, Heart, MapPin, MessageCircle, ShieldCheck } from "lucide-react";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { getCurrentDbUser } from "@/lib/auth/current-user";
import { toggleFavoriteAction } from "@/lib/favorites/actions";

export const metadata: Metadata = {
  title: "Mes professionnels favoris",
  robots: { index: false, follow: false },
};

type FavoriteRow = {
  id: number;
  created_at: string;
  artisan_id: number;
  artisan: {
    id: number;
    client_number: string | null;
    name: string | null;
    city: string | null;
    siren_status: string | null;
    profile_photo: string | null;
    artisan_profiles: { company_name: string | null; metier: { name: string | null } | null } | null;
  } | null;
};

async function loadFavorites(userId: number): Promise<FavoriteRow[]> {
  const admin = createSupabaseAdminClient();
  const { data } = await admin
    .from("favorites")
    .select(`
      id, created_at, artisan_id,
      artisan:artisan_id (
        id, client_number, name, city, siren_status, profile_photo,
        artisan_profiles ( company_name, metier:metiers ( name ) )
      )
    `)
    .eq("user_id", userId)
    .order("created_at", { ascending: false });
  return (data ?? []) as unknown as FavoriteRow[];
}

function relativeTime(iso: string): string {
  const diff = Math.floor((Date.now() - new Date(iso).getTime()) / 1000);
  if (diff < 3600) return "Aujourd'hui";
  if (diff < 86400) return `Il y a ${Math.floor(diff / 3600)}h`;
  if (diff < 604800) return `Il y a ${Math.floor(diff / 86400)} j`;
  if (diff < 2592000) return `Il y a ${Math.floor(diff / 604800)} sem.`;
  return `Il y a ${Math.floor(diff / 2592000)} mois`;
}

export default async function FavorisPage() {
  const me = await getCurrentDbUser();
  if (!me) redirect("/connexion?next=/mon-profil/favoris");

  const favorites = await loadFavorites(me.id);

  async function removeFavorite(formData: FormData) {
    "use server";
    const id = parseInt(formData.get("artisanId")?.toString() ?? "0", 10);
    if (id > 0) await toggleFavoriteAction(id);
  }

  return (
    <div className="bg-ink-50 min-h-screen">
      <div className="container-default py-10">
        <Link href="/mon-profil" className="inline-flex items-center gap-1.5 text-sm text-ink-500 hover:text-brand-500 font-semibold transition">
          <ArrowLeft size={14} /> Retour à mon espace
        </Link>

        <div className="flex items-center justify-between mt-4 mb-8 flex-wrap gap-3">
          <div>
            <h1 className="text-3xl font-bold text-ink-700 tracking-tight flex items-center gap-2">
              <Heart size={24} fill="#f07a2f" className="text-brand-500" />
              Mes professionnels favoris
            </h1>
            <p className="text-ink-400 mt-1">Retrouvez en un clic les professionnels que vous avez sauvegardés.</p>
          </div>
          <span className="px-3 py-1 rounded-full bg-brand-50 border border-brand-200 text-brand-700 text-sm font-bold">
            {favorites.length} favori{favorites.length > 1 ? "s" : ""}
          </span>
        </div>

        {favorites.length === 0 ? (
          <div className="bg-white rounded-3xl border border-ink-100 p-12 text-center">
            <Heart size={48} className="mx-auto text-ink-200 mb-4" />
            <h2 className="font-bold text-ink-700">Aucun favori pour le moment</h2>
            <p className="text-sm text-ink-400 mt-2 max-w-sm mx-auto">
              Quand vous trouverez un professionnel intéressant, cliquez sur le cœur pour le sauvegarder ici.
            </p>
            <Link href="/rechercher" className="btn-primary mt-6 inline-flex">
              Trouver un professionnel
            </Link>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {favorites.map((f) => {
              if (!f.artisan) return null;
              const a = f.artisan;
              const metierName = a.artisan_profiles?.metier?.name ?? "Professionnel";
              const company = a.artisan_profiles?.company_name?.trim() ?? "";
              // Affichage public : nom commercial en titre, gérant en sous-ligne discrète.
              const displayName = company || a.name || "·";
              const verified = a.siren_status === "A";
              const initial = displayName.charAt(0).toUpperCase();

              return (
                <article key={f.id} className="bg-white rounded-2xl border border-ink-100 hover:border-brand-300 hover:-translate-y-1 transition group overflow-hidden">
                  <div className="h-20 bg-gradient-to-br from-brand-400 to-brand-600 relative">
                    <form action={removeFavorite}>
                      <input type="hidden" name="artisanId" value={a.id} />
                      <button
                        type="submit"
                        className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center hover:bg-white shadow-card transition"
                        aria-label="Retirer des favoris"
                        title="Retirer des favoris"
                      >
                        <Heart size={14} fill="#f07a2f" className="text-brand-500" />
                      </button>
                    </form>
                  </div>
                  <div className="px-5 pb-5 -mt-10">
                    <div className="w-20 h-20 rounded-2xl border-4 border-white overflow-hidden bg-ink-100 mb-3 flex items-center justify-center text-2xl font-bold text-ink-400">
                      {a.profile_photo ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={a.profile_photo} alt={a.name ?? ""} className="w-full h-full object-cover" />
                      ) : (
                        initial
                      )}
                    </div>
                    <div className="flex items-center gap-1.5">
                      <h3 className="font-bold text-ink-700">{a.name ?? "·"}</h3>
                      {verified && <ShieldCheck size={12} className="text-emerald-500" />}
                    </div>
                    {company && <p className="text-sm text-ink-500">{company}</p>}
                    <div className="flex items-center gap-2 mt-2 text-xs text-ink-500">
                      <span className="font-semibold text-brand-500">{metierName}</span>
                      {a.city && (
                        <>
                          <span>·</span>
                          <span className="flex items-center gap-0.5"><MapPin size={10} />{a.city}</span>
                        </>
                      )}
                    </div>
                    <div className="text-[0.7rem] text-ink-400 mt-3 mb-3">
                      Sauvegardé {relativeTime(f.created_at)}
                    </div>
                    <div className="flex gap-2">
                      <Link href={`/profil/${a.client_number ?? a.id}`} className="flex-1 inline-flex items-center justify-center px-3 py-2 rounded-xl bg-brand-500 text-white text-xs font-bold hover:bg-brand-600 transition">
                        Voir le profil
                      </Link>
                      <Link href={`/messagerie/${a.id}`} className="px-3 py-2 rounded-xl border border-ink-200 text-ink-700 hover:border-brand-500 transition" aria-label="Message">
                        <MessageCircle size={14} />
                      </Link>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
