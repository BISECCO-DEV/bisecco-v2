import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowLeft, FileText, Mail, Phone, Calendar, Eye, Trash2,
  Inbox, CheckCircle2, MessageCircle,
} from "lucide-react";
import { requireUser } from "@/lib/db/current-user";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import {
  markCvSubmissionReadAction,
  deleteCvSubmissionAction,
} from "@/lib/cv/submit-actions";
import { DownloadButton } from "./DownloadButton";

export const metadata: Metadata = {
  title: "CVs reçus — Mon espace",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

type SearchParams = Promise<{ deleted?: string; error?: string }>;

type Submission = {
  id: number;
  sender_user_id: number | null;
  sender_name: string;
  sender_email: string;
  sender_phone: string | null;
  file_path: string;
  file_name: string;
  file_size: number | null;
  file_mime: string | null;
  message: string | null;
  status: "new" | "read" | "archived";
  read_at: string | null;
  created_at: string;
};

async function fetchMyReceivedCvs(userId: number): Promise<Submission[]> {
  const supabase = createSupabaseAdminClient();
  const { data } = await supabase
    .from("cv_submissions")
    .select(
      "id, sender_user_id, sender_name, sender_email, sender_phone, file_path, file_name, file_size, file_mime, message, status, read_at, created_at",
    )
    .eq("recipient_user_id", userId)
    .order("created_at", { ascending: false });

  return (data ?? []) as Submission[];
}

function timeAgo(iso: string): string {
  const d = Math.floor((Date.now() - new Date(iso).getTime()) / 86400000);
  if (d < 1) return "Aujourd'hui";
  if (d < 2) return "Hier";
  if (d < 7) return `Il y a ${d}j`;
  if (d < 30) return `Il y a ${Math.floor(d / 7)} sem.`;
  return new Date(iso).toLocaleDateString("fr-FR");
}

export default async function CvsRecusPage({ searchParams }: { searchParams: SearchParams }) {
  const user = await requireUser();
  if (!user.id) return null;

  const submissions = await fetchMyReceivedCvs(user.id);
  const params = await searchParams;

  const newCount = submissions.filter((s) => s.status === "new").length;

  return (
    <div className="bg-ink-50 min-h-screen pb-16">
      <div className="container-default max-w-5xl py-10">
        <Link
          href="/mon-profil"
          className="inline-flex items-center gap-1.5 text-sm text-ink-500 hover:text-brand-600 font-semibold"
        >
          <ArrowLeft size={14} /> Mon profil
        </Link>

        <div className="mt-5 flex items-start justify-between flex-wrap gap-3">
          <div>
            <h1 className="text-3xl font-bold text-ink-700 tracking-tight flex items-center gap-2">
              <Inbox size={28} /> CVs reçus
              {newCount > 0 && (
                <span className="ml-2 px-2.5 py-0.5 rounded-full bg-brand-500 text-white text-sm font-bold">
                  {newCount} nouveau{newCount > 1 ? "x" : ""}
                </span>
              )}
            </h1>
            <p className="mt-2 text-ink-500 max-w-2xl">
              Les candidatures envoyées depuis ton profil public. Tu peux lire, télécharger ou supprimer chaque CV.
            </p>
          </div>
        </div>

        {/* Feedback */}
        {params.deleted && (
          <div className="mt-5 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl px-4 py-3 text-sm font-semibold">
            ✓ CV supprimé.
          </div>
        )}
        {params.error && (
          <div className="mt-5 bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm font-semibold">
            ⚠ Erreur : {params.error}
          </div>
        )}

        {/* Liste */}
        <div className="mt-8 space-y-3">
          {submissions.length === 0 ? (
            <div className="bg-white rounded-3xl border border-ink-100 p-12 text-center">
              <Inbox size={36} className="text-ink-200 mx-auto mb-3" />
              <h2 className="font-extrabold text-ink-700 text-lg">Aucun CV reçu pour l&apos;instant</h2>
              <p className="text-ink-500 text-sm mt-1.5 max-w-md mx-auto">
                Quand un candidat enverra son CV depuis ton profil public, il apparaîtra ici avec ses coordonnées.
              </p>
              <Link
                href={`/profil/${user.client_number ?? user.id}`}
                className="mt-4 inline-flex items-center gap-1.5 text-sm text-brand-600 font-bold hover:underline"
              >
                Voir mon profil public →
              </Link>
            </div>
          ) : (
            submissions.map((s) => {
              const sizeKb = s.file_size ? `${Math.round(s.file_size / 1024)} KB` : "";
              const isNew = s.status === "new";
              return (
                <article
                  key={s.id}
                  className={`bg-white rounded-2xl p-5 border-2 ${isNew ? "border-brand-300 ring-1 ring-brand-100" : "border-ink-100"} transition hover:shadow-card`}
                >
                  <div className="flex items-start gap-4 flex-wrap">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 font-bold text-lg ${
                      isNew ? "bg-brand-500 text-white" : "bg-ink-100 text-ink-600"
                    }`}>
                      {s.sender_name.charAt(0).toUpperCase()}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-extrabold text-ink-700">{s.sender_name}</h3>
                        {isNew && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-brand-500 text-white text-[0.62rem] font-extrabold uppercase tracking-wider">
                            Nouveau
                          </span>
                        )}
                        {s.status === "read" && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-[0.62rem] font-bold uppercase tracking-wider">
                            <CheckCircle2 size={9} /> Lu
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-3 mt-1 text-xs text-ink-500 flex-wrap">
                        <a href={`mailto:${s.sender_email}`} className="inline-flex items-center gap-1 hover:text-brand-600">
                          <Mail size={11} /> {s.sender_email}
                        </a>
                        {s.sender_phone && (
                          <a href={`tel:${s.sender_phone}`} className="inline-flex items-center gap-1 hover:text-brand-600">
                            <Phone size={11} /> {s.sender_phone}
                          </a>
                        )}
                        <span className="inline-flex items-center gap-1 text-ink-400">
                          <Calendar size={11} /> {timeAgo(s.created_at)}
                        </span>
                      </div>

                      {s.message && (
                        <div className="mt-3 p-3 rounded-xl bg-ink-50 border border-ink-100 text-sm text-ink-600 leading-relaxed whitespace-pre-line">
                          <MessageCircle size={12} className="inline mr-1.5 text-brand-500" />
                          {s.message}
                        </div>
                      )}

                      <div className="mt-3 flex items-center gap-2 px-3 py-2 rounded-xl bg-ink-50 border border-ink-100">
                        <FileText size={16} className="text-brand-500 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-bold text-ink-700 truncate">{s.file_name}</div>
                          <div className="text-[0.66rem] text-ink-400">{sizeKb} · PDF</div>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                      <DownloadButton submissionId={s.id} fileName={s.file_name} />

                      {isNew && (
                        <form action={markCvSubmissionReadAction} className="contents">
                          <input type="hidden" name="submission_id" value={s.id} />
                          <button
                            type="submit"
                            className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-white border-2 border-emerald-200 text-emerald-700 text-sm font-bold hover:bg-emerald-50 transition"
                          >
                            <Eye size={13} /> Marquer lu
                          </button>
                        </form>
                      )}

                      <form action={deleteCvSubmissionAction} className="contents">
                        <input type="hidden" name="submission_id" value={s.id} />
                        <button
                          type="submit"
                          className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-white border-2 border-red-200 text-red-700 text-sm font-bold hover:bg-red-50 transition"
                        >
                          <Trash2 size={13} /> Supprimer
                        </button>
                      </form>
                    </div>
                  </div>
                </article>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
