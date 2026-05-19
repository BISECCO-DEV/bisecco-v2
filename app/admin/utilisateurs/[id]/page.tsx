import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft, ShieldCheck, Mail, Phone, MapPin, Hash, Calendar, FileText,
  CheckCircle2, XCircle, RefreshCw, Pause, Play, Briefcase,
} from "lucide-react";
import { fetchUserDetail } from "@/lib/db/admin-users";
import {
  approveUserAction, rejectUserAction, recheckSirenAction,
  suspendUserAction, restoreUserAction,
} from "@/lib/admin/actions";

type Props = { params: Promise<{ id: string }> };

export const dynamic = "force-dynamic";

type ProfileMetier = {
  metiers?: { id: number; name: string; slug: string; icon: string | null; category: string } | null;
};

export default async function AdminUserDetail({ params }: Props) {
  const { id: idStr } = await params;
  const id = Number(idStr);
  if (!id) notFound();

  const detail = await fetchUserDetail(id);
  if (!detail) notFound();

  const { user, profile, gallery } = detail;
  const isArtisan = user.role === "artisan";
  const isPending = user.validation_status === "pending";
  const isApproved = user.validation_status === "approved";
  const isRejected = user.validation_status === "rejected";
  const isDeleted = !!user.deleted_at;

  const metiersList: { id: number; name: string; icon: string | null }[] =
    ((profile?.artisan_profile_metier ?? []) as unknown as ProfileMetier[])
      .map((pm) => pm.metiers)
      .filter((m): m is NonNullable<typeof m> => Boolean(m));

  return (
    <div className="space-y-6 max-w-5xl">
      <Link
        href="/admin/utilisateurs"
        className="inline-flex items-center gap-1.5 text-sm text-ink-500 hover:text-brand-600 font-semibold"
      >
        <ArrowLeft size={14} /> Retour à la liste
      </Link>

      {/* Header */}
      <div className="bg-white rounded-3xl border border-ink-100 p-6">
        <div className="flex items-start gap-5 flex-wrap">
          <div className={`w-20 h-20 rounded-2xl flex items-center justify-center flex-shrink-0 font-extrabold text-2xl text-white ${
            isArtisan ? "bg-brand-500" : user.role === "admin" ? "bg-purple-500" : "bg-blue-500"
          }`}>
            {user.name.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-2xl font-extrabold text-ink-700">{user.name}</h1>
              {isApproved && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold">
                  <ShieldCheck size={11} /> Validé
                </span>
              )}
              {isPending && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-50 border border-amber-200 text-amber-700 text-xs font-bold">
                  En attente
                </span>
              )}
              {isRejected && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-red-50 border border-red-200 text-red-700 text-xs font-bold">
                  Rejeté
                </span>
              )}
              {isDeleted && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-ink-100 text-ink-600 text-xs font-bold">
                  Suspendu
                </span>
              )}
            </div>
            <div className="text-ink-500 text-sm mt-1">{user.email}</div>
            {user.client_number && (
              <div className="text-ink-400 text-xs font-mono mt-0.5">{user.client_number}</div>
            )}
          </div>
          <div className="flex flex-wrap gap-2">
            {user.client_number && (
              <Link
                href={`/profil/${user.client_number}`}
                target="_blank"
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-white border-2 border-ink-200 text-ink-700 font-bold text-xs hover:border-brand-300 transition"
              >
                Voir profil public →
              </Link>
            )}
          </div>
        </div>

        {/* Rejet motif */}
        {isRejected && user.rejection_reason && (
          <div className="mt-5 bg-red-50 border border-red-200 rounded-xl p-4">
            <div className="font-bold text-red-700 text-sm mb-1">Motif de rejet</div>
            <p className="text-red-600 text-sm">{user.rejection_reason}</p>
          </div>
        )}
      </div>

      {/* Actions admin */}
      {isArtisan && !isDeleted && (
        <div className="bg-gradient-to-br from-amber-50 to-orange-50 border-2 border-amber-200 rounded-2xl p-5">
          <h2 className="font-extrabold text-amber-900 text-sm mb-3 uppercase tracking-wider">
            Actions de modération
          </h2>
          <div className="flex flex-wrap gap-2">
            {!isApproved && (
              <form action={approveUserAction}>
                <input type="hidden" name="user_id" value={user.id} />
                <input type="hidden" name="_back" value={`/admin/utilisateurs/${user.id}`} />
                <button
                  type="submit"
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-500 text-white font-bold text-sm hover:bg-emerald-600 transition shadow-[0_4px_12px_rgba(16,185,129,0.35)]"
                >
                  <CheckCircle2 size={14} /> Valider l&apos;artisan
                </button>
              </form>
            )}

            {!isRejected && (
              <form action={rejectUserAction} className="flex items-center gap-2">
                <input type="hidden" name="user_id" value={user.id} />
                <input type="hidden" name="_back" value={`/admin/utilisateurs/${user.id}`} />
                <input
                  type="text" name="reason" required maxLength={500}
                  placeholder="Motif de rejet…"
                  className="px-3 py-2.5 rounded-xl border-2 border-red-200 bg-white text-sm focus:border-red-500 outline-none min-w-[200px]"
                />
                <button
                  type="submit"
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-red-500 text-white font-bold text-sm hover:bg-red-600 transition"
                >
                  <XCircle size={14} /> Rejeter
                </button>
              </form>
            )}

            {user.siren && (
              <form action={recheckSirenAction}>
                <input type="hidden" name="user_id" value={user.id} />
                <input type="hidden" name="_back" value={`/admin/utilisateurs/${user.id}`} />
                <button
                  type="submit"
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-500 text-white font-bold text-sm hover:bg-blue-600 transition"
                >
                  <RefreshCw size={14} /> Re-vérifier SIREN
                </button>
              </form>
            )}

            <form action={suspendUserAction}>
              <input type="hidden" name="user_id" value={user.id} />
                <input type="hidden" name="_back" value={`/admin/utilisateurs/${user.id}`} />
              <button
                type="submit"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white border-2 border-red-200 text-red-700 font-bold text-sm hover:bg-red-50 transition"
              >
                <Pause size={14} /> Suspendre
              </button>
            </form>
          </div>
        </div>
      )}

      {isDeleted && (
        <div className="bg-ink-50 border-2 border-ink-200 rounded-2xl p-5">
          <h2 className="font-extrabold text-ink-700 text-sm mb-3">Compte suspendu</h2>
          <form action={restoreUserAction}>
            <input type="hidden" name="user_id" value={user.id} />
                <input type="hidden" name="_back" value={`/admin/utilisateurs/${user.id}`} />
            <button
              type="submit"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-500 text-white font-bold text-sm hover:bg-emerald-600 transition"
            >
              <Play size={14} /> Restaurer le compte
            </button>
          </form>
        </div>
      )}

      {/* Détails compte */}
      <div className="grid lg:grid-cols-2 gap-5">
        <section className="bg-white rounded-2xl border border-ink-100 p-5">
          <h2 className="font-extrabold text-ink-700 text-sm mb-4 uppercase tracking-wider">
            Coordonnées
          </h2>
          <ul className="space-y-2.5 text-sm">
            <DataRow icon={Mail} label="Email" value={user.email} />
            <DataRow icon={Phone} label="Téléphone" value={user.phone} />
            <DataRow icon={MapPin} label="Ville" value={user.city} />
            <DataRow icon={Calendar} label="Inscrit le" value={new Date(user.created_at).toLocaleString("fr-FR")} />
            {user.validated_at && (
              <DataRow icon={CheckCircle2} label="Validé le" value={new Date(user.validated_at).toLocaleString("fr-FR")} />
            )}
          </ul>
        </section>

        {isArtisan && (
          <section className="bg-white rounded-2xl border border-ink-100 p-5">
            <h2 className="font-extrabold text-ink-700 text-sm mb-4 uppercase tracking-wider">
              Entreprise
            </h2>
            <ul className="space-y-2.5 text-sm">
              {profile?.company_name && (
                <DataRow icon={Briefcase} label="Société" value={profile.company_name} />
              )}
              <DataRow icon={Hash} label="SIREN" value={user.siren} />
              {user.siren_status && (
                <li className="flex items-start gap-2.5 text-ink-600">
                  <ShieldCheck size={14} className={`mt-0.5 flex-shrink-0 ${user.siren_status === "A" ? "text-emerald-500" : "text-red-500"}`} />
                  <div>
                    <div className="text-[0.7rem] uppercase tracking-wider text-ink-400 font-bold">Statut INSEE</div>
                    <div className="text-sm">
                      {user.siren_status === "A" ? "Actif" : user.siren_status === "C" ? "Cessé" : user.siren_status}
                      {user.siren_last_checked_at && (
                        <span className="ml-2 text-ink-400 text-xs">
                          (vérifié le {new Date(user.siren_last_checked_at).toLocaleDateString("fr-FR")})
                        </span>
                      )}
                    </div>
                  </div>
                </li>
              )}
              {profile?.siret && (
                <DataRow icon={Hash} label="SIRET" value={profile.siret} />
              )}
              {profile?.availability && (
                <DataRow icon={Calendar} label="Disponibilité" value={profile.availability} />
              )}
            </ul>
          </section>
        )}
      </div>

      {/* Métiers */}
      {isArtisan && metiersList.length > 0 && (
        <section className="bg-white rounded-2xl border border-ink-100 p-5">
          <h2 className="font-extrabold text-ink-700 text-sm mb-4 uppercase tracking-wider">
            Métiers ({metiersList.length})
          </h2>
          <div className="flex flex-wrap gap-2">
            {metiersList.map((m) => (
              <span key={m.id} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-brand-50 border border-brand-200 text-brand-700 text-xs font-bold">
                {m.icon} {m.name}
              </span>
            ))}
          </div>
        </section>
      )}

      {/* Description */}
      {user.description && (
        <section className="bg-white rounded-2xl border border-ink-100 p-5">
          <h2 className="font-extrabold text-ink-700 text-sm mb-3 uppercase tracking-wider flex items-center gap-2">
            <FileText size={14} /> Description
          </h2>
          <p className="text-sm text-ink-600 whitespace-pre-line">{user.description}</p>
        </section>
      )}

      {/* Galerie */}
      {gallery.length > 0 && (
        <section className="bg-white rounded-2xl border border-ink-100 p-5">
          <h2 className="font-extrabold text-ink-700 text-sm mb-4 uppercase tracking-wider">
            Galerie ({gallery.length})
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {gallery.map((g) => (
              <div key={g.id} className="aspect-square rounded-xl overflow-hidden bg-ink-100">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={g.image_path.startsWith("http") ? g.image_path : `/storage/${g.image_path}`}
                  alt={g.caption ?? ""}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

function DataRow({
  icon: Icon, label, value,
}: {
  icon: React.ComponentType<{ size?: number; className?: string }>;
  label: string;
  value: string | null;
}) {
  return (
    <li className="flex items-start gap-2.5 text-ink-600">
      <Icon size={14} className="mt-0.5 flex-shrink-0 text-ink-400" />
      <div className="min-w-0 flex-1">
        <div className="text-[0.7rem] uppercase tracking-wider text-ink-400 font-bold">{label}</div>
        <div className="text-sm truncate">{value ?? "—"}</div>
      </div>
    </li>
  );
}
