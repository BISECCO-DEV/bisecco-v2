import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import {
  ArrowLeft, CheckCircle2, X, FileText, Send, Clock,
  MessageCircle, MapPin, Phone, Mail, Globe, User as UserIcon,
  Info, PenLine, Handshake,
} from "lucide-react";
import { requireUser } from "@/lib/db/current-user";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { getQuoteResponse, type QuoteLine } from "@/lib/quotes/response-actions";
import { vatNumberFromSiren, formatSiren, formatQuoteNumber } from "@/lib/quotes/siren-utils";
import { QuoteLinesEditor } from "./QuoteLinesEditor";
import { QuoteDecisionPanel } from "./QuoteDecisionPanel";

export const metadata: Metadata = {
  title: "Devis structuré",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ id: string }> };

const STATUS_META: Record<string, { label: string; color: string; emoji: string }> = {
  sent:      { label: "En attente de décision", color: "bg-amber-50 text-amber-700 border-amber-200",   emoji: "⏳" },
  accepted:  { label: "Accepté",                color: "bg-emerald-50 text-emerald-700 border-emerald-200", emoji: "✅" },
  refused:   { label: "Refusé",                 color: "bg-red-50 text-red-700 border-red-200",         emoji: "❌" },
  expired:   { label: "Expiré",                 color: "bg-ink-50 text-ink-500 border-ink-200",         emoji: "⏰" },
  withdrawn: { label: "Retiré par le pro",      color: "bg-ink-50 text-ink-500 border-ink-200",         emoji: "↩️" },
};

export default async function QuoteResponsePage({ params }: Props) {
  const { id } = await params;
  const requestId = parseInt(id, 10);
  if (!Number.isFinite(requestId)) notFound();

  const me = await requireUser();
  if (!me.id) redirect("/mon-profil");

  // Charge la demande + vérifie les droits
  const admin = createSupabaseAdminClient();
  const { data: request } = await admin
    .from("quote_requests")
    .select("id, title, description, artisan_id, client_id, metier_id, created_at, urgency, budget_range, city, postal_code, photos, contact_phone, contact_email, submitter_name")
    .eq("id", requestId)
    .maybeSingle();

  if (!request) notFound();

  // Droits d'accès :
  //   - artisan ciblé directement → OK
  //   - client qui a fait la demande → OK
  //   - artisan ÉLIGIBLE sur un broadcast (artisan_id NULL + même métier + validé) → OK
  let canAccessAsArtisan = request.artisan_id === me.id;
  const isClient = request.client_id === me.id;

  if (!canAccessAsArtisan && !isClient && me.role === "artisan" && request.artisan_id == null) {
    // Broadcast : le pro peut accéder s'il est validé ET partage le métier
    const { data: myProfileRows } = await admin
      .from("artisan_profiles")
      .select("metier_id")
      .eq("user_id", me.id);
    const myMetierIds = ((myProfileRows ?? []) as { metier_id: number | null }[])
      .map((p) => p.metier_id)
      .filter((v): v is number => v != null);
    const matchesMetier =
      request.metier_id != null && myMetierIds.includes(request.metier_id);
    const isApproved = me.validation_status === "approved";

    if (matchesMetier && isApproved) {
      canAccessAsArtisan = true;
    }
  }

  const isArtisan = canAccessAsArtisan;
  if (!isArtisan && !isClient) notFound();

  // Charge la réponse + les infos de l'autre partie
  const response = await getQuoteResponse(requestId);
  const otherId = isArtisan ? request.client_id : request.artisan_id;

  type OtherUserRow = {
    id: number;
    name: string;
    client_number: string | null;
    city: string | null;
    role: string;
    artisan_profiles:
      | { company_name: string | null }[]
      | { company_name: string | null }
      | null;
  };

  let otherUser: OtherUserRow | null = null;
  if (otherId) {
    const { data } = await admin
      .from("users")
      .select("id, name, client_number, city, role, artisan_profiles(company_name)")
      .eq("id", otherId)
      .maybeSingle();
    otherUser = (data as unknown as OtherUserRow | null) ?? null;
  }

  const otherDisplayName = (() => {
    if (!otherUser) {
      // Broadcast côté pro : pas encore de relation, on utilise le nom du client invité
      return request.submitter_name || "Particulier";
    }
    const profile = Array.isArray(otherUser.artisan_profiles)
      ? otherUser.artisan_profiles[0]
      : otherUser.artisan_profiles;
    return profile?.company_name?.trim() || otherUser.name;
  })();

  const isBroadcast = isArtisan && request.artisan_id == null;

  // ─── Charge infos société du PRO qui a répondu (pour en-tête fiscal) ─
  type ProSocietyInfo = {
    displayName: string;
    legalName: string;
    address: string | null;
    city: string | null;
    siren: string | null;
    profile_photo: string | null;
    public_email: string | null;
    phone: string | null;
    vatNumber: string | null;
  };

  let proSociety: ProSocietyInfo | null = null;
  const proIdForSociety = response?.artisan_id ?? (isArtisan ? me.id : request.artisan_id);
  if (proIdForSociety) {
    const { data: proRow } = await admin
      .from("users")
      .select("name, email, phone, street_address, city, siren, profile_photo, public_contact_email, artisan_profiles(company_name)")
      .eq("id", proIdForSociety)
      .maybeSingle();
    if (proRow) {
      type ProfileRow = { company_name?: string | null };
      const prof = Array.isArray(proRow.artisan_profiles)
        ? (proRow.artisan_profiles[0] as ProfileRow | undefined)
        : (proRow.artisan_profiles as ProfileRow | null);
      const company = prof?.company_name?.trim() || null;
      proSociety = {
        displayName: company || proRow.name || "Pro Bisecco",
        legalName: proRow.name || company || "Pro",
        address: (proRow.street_address as string | null) ?? null,
        city: (proRow.city as string | null) ?? null,
        siren: (proRow.siren as string | null) ?? null,
        profile_photo: (proRow.profile_photo as string | null) ?? null,
        public_email: ((proRow.public_contact_email as string | null) || (proRow.email as string | null)) ?? null,
        phone: (proRow.phone as string | null) ?? null,
        vatNumber: vatNumberFromSiren(proRow.siren as string | null),
      };
    }
  }

  // ─── Charge infos CLIENT pour le bloc "Adressé à" ─────────────────
  let clientSociety: { name: string; address: string | null; city: string | null; postal_code: string | null; email: string | null; phone: string | null } = {
    name: request.submitter_name || "Particulier",
    address: null,
    city: request.city,
    postal_code: request.postal_code,
    email: request.contact_email,
    phone: request.contact_phone,
  };
  if (request.client_id) {
    const { data: clientRow } = await admin
      .from("users")
      .select("name, email, phone, street_address, city")
      .eq("id", request.client_id)
      .maybeSingle();
    if (clientRow) {
      clientSociety = {
        name: (clientRow.name as string) || clientSociety.name,
        address: (clientRow.street_address as string | null) ?? null,
        city: ((clientRow.city as string | null) ?? clientSociety.city) ?? null,
        postal_code: request.postal_code,
        email: ((clientRow.email as string | null) ?? clientSociety.email) ?? null,
        phone: ((clientRow.phone as string | null) ?? clientSociety.phone) ?? null,
      };
    }
  }

  // ─── Nom du métier (pour adapter unités dans l'éditeur) ───────────
  let metierName: string | null = null;
  if (request.metier_id) {
    const { data: m } = await admin
      .from("metiers")
      .select("name")
      .eq("id", request.metier_id)
      .maybeSingle();
    metierName = (m?.name as string | null) ?? null;
  }

  return (
    <div className="bg-ink-50 min-h-screen pb-16">
      <div className="container-default max-w-4xl py-10">
        <Link href="/mon-profil/devis" className="inline-flex items-center gap-1.5 text-sm text-ink-500 hover:text-brand-500 font-semibold transition">
          <ArrowLeft size={14} /> Mes devis
        </Link>

        {/* Header */}
        <header className="mt-4 mb-8">
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            <span className="text-xs text-ink-400 font-mono">DEV-{requestId.toString().padStart(6, "0")}</span>
            {response && (
              <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[0.7rem] font-bold ${STATUS_META[response.status]?.color}`}>
                {STATUS_META[response.status]?.emoji} {STATUS_META[response.status]?.label}
              </span>
            )}
          </div>
          <h1 className="text-3xl font-bold text-ink-700 tracking-tight">{request.title}</h1>
          <p className="text-ink-500 mt-2 text-sm">
            {isArtisan ? "Demande reçue de" : "Devis demandé à"} <strong className="text-ink-700">{otherDisplayName}</strong>
          </p>
          {isBroadcast && (
            <div className="mt-4 rounded-2xl bg-violet-50 border border-violet-200 px-4 py-3 text-sm text-violet-800 flex items-start gap-2.5">
              <span className="text-violet-500 mt-0.5">📢</span>
              <div>
                <strong>Opportunité ouverte</strong> — Cette demande est diffusée à plusieurs pros de ton métier.
                <span className="block mt-0.5 text-violet-700/80 text-xs">
                  Le premier qui envoie un devis structuré l&apos;obtient. Réponds vite&nbsp;!
                </span>
              </div>
            </div>
          )}
        </header>

        {/* Demande originale (toujours visible) */}
        <section className="bg-white rounded-2xl border border-ink-100 p-6 mb-6">
          <h2 className="font-bold text-ink-700 mb-3 text-sm uppercase tracking-wider flex items-center gap-2">
            <FileText size={14} /> Demande initiale
          </h2>
          <p className="text-ink-600 leading-relaxed whitespace-pre-line">{request.description}</p>
          <div className="mt-4 flex flex-wrap items-center gap-3 text-xs text-ink-500">
            {request.city && <span>📍 {request.city} {request.postal_code ?? ""}</span>}
            <span>⏱ Urgence : {request.urgency}</span>
            <span>💰 Budget : {request.budget_range}</span>
          </div>
        </section>

        {/* ─── Côté PRO : éditeur de réponse ─── */}
        {isArtisan && (!response || response.status === "sent") && (
          <section className="bg-white rounded-3xl border-2 border-brand-200 p-6 md:p-8">
            <h2 className="text-xl font-bold text-ink-700 mb-1">
              {response ? "Modifier le devis" : "Construire le devis"}
            </h2>
            <p className="text-sm text-ink-500 mb-6">
              Détaille tes prestations ligne par ligne. Le client recevra un devis professionnel qu&apos;il pourra accepter ou refuser en 1 clic.
            </p>
            <QuoteLinesEditor
              quoteRequestId={requestId}
              metierName={metierName}
              initial={response ? {
                lines: response.lines,
                delay_text: response.delay_text,
                valid_until: response.valid_until,
                message: response.message,
                payment_terms: response.payment_terms,
              } : null}
            />
          </section>
        )}

        {/* ─── Devis envoyé : visualisation (pour les deux) ─── */}
        {response && (isClient || response.status !== "sent") && (
          <QuoteResponseView
            response={response}
            isClient={isClient}
            requestId={requestId}
            proSociety={proSociety}
            clientSociety={clientSociety}
            metierName={metierName}
          />
        )}

        {/* ─── Cas du client sans réponse encore ─── */}
        {isClient && !response && (
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6 text-center">
            <Clock size={32} className="text-amber-500 mx-auto mb-3" />
            <h3 className="font-bold text-ink-700">En attente de réponse</h3>
            <p className="text-sm text-ink-500 mt-1 max-w-md mx-auto">
              {otherDisplayName} n&apos;a pas encore envoyé son devis. Tu recevras une notification dès qu&apos;il sera prêt.
            </p>
            <Link
              href={`/messagerie`}
              className="inline-flex items-center gap-1.5 mt-4 px-4 py-2 rounded-xl bg-white border border-ink-200 text-ink-700 font-bold text-sm hover:border-brand-300"
            >
              <MessageCircle size={14} /> Envoyer un message
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

// =====================================================================
// Vue du devis structuré : style document professionnel A4
// =====================================================================

type ProSocietyInfoLite = {
  displayName: string;
  legalName: string;
  address: string | null;
  city: string | null;
  siren: string | null;
  profile_photo: string | null;
  public_email: string | null;
  phone: string | null;
  vatNumber: string | null;
};

type ClientInfoLite = {
  name: string;
  address: string | null;
  city: string | null;
  postal_code: string | null;
  email: string | null;
  phone: string | null;
};

function QuoteResponseView({
  response, isClient, requestId, proSociety, clientSociety, metierName,
}: {
  response: NonNullable<Awaited<ReturnType<typeof getQuoteResponse>>>;
  isClient: boolean;
  requestId: number;
  proSociety: ProSocietyInfoLite | null;
  clientSociety: ClientInfoLite;
  metierName: string | null;
}) {
  const lines = (response.lines ?? []) as QuoteLine[];
  const validUntilFmt = response.valid_until
    ? new Date(response.valid_until).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })
    : "À définir";
  const sentAtFmt = new Date(response.sent_at).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" });
  const quoteNumber = formatQuoteNumber(requestId, response.sent_at);

  // Répartition TVA par taux pour le bloc totaux
  const vatBreakdown = new Map<number, { ht: number; vat: number }>();
  for (const l of lines) {
    const ht = l.quantity * l.unit_price_ht;
    const cur = vatBreakdown.get(l.vat_rate) ?? { ht: 0, vat: 0 };
    cur.ht += ht;
    cur.vat += ht * l.vat_rate;
    vatBreakdown.set(l.vat_rate, cur);
  }
  const sortedVat = Array.from(vatBreakdown.entries())
    .filter(([_, v]) => v.ht > 0)
    .sort((a, b) => a[0] - b[0]);
  void isClient;

  // Ligne de pied de page légale
  const legalFooter: string[] = [];
  if (proSociety?.siren) legalFooter.push(`SIRET : ${formatSiren(proSociety.siren)}`);
  if (proSociety?.vatNumber) legalFooter.push(`TVA Intracom. ${proSociety.vatNumber}`);
  const addressParts: string[] = [];
  if (proSociety?.address) addressParts.push(proSociety.address);
  if (proSociety?.city) addressParts.push(proSociety.city);

  return (
    <section className="space-y-5">
      {/* ═══════ DOCUMENT DEVIS · style document réglementaire A4 ═══════ */}
      <article className="bg-white rounded-2xl shadow-[0_30px_60px_-30px_rgba(13,30,74,0.18)] border border-ink-100 overflow-hidden">
        {/* ─── EN-TÊTE : LOGO + SOCIÉTÉ à gauche, CONTACT à droite ─── */}
        <header className="p-6 md:p-10 pb-6">
          <div className="flex items-start justify-between gap-6 flex-wrap">
            {/* Côté gauche : logo + nom société */}
            <div className="flex items-start gap-4 min-w-0">
              {proSociety?.profile_photo ? (
                <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl overflow-hidden bg-ink-50 border border-ink-100 flex-shrink-0">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={proSociety.profile_photo} alt="" className="w-full h-full object-cover" />
                </div>
              ) : (
                <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-gradient-to-br from-ink-700 to-ink-800 grid place-items-center flex-shrink-0">
                  <span className="text-2xl md:text-3xl font-bold text-white">
                    {(proSociety?.displayName ?? "B").charAt(0).toUpperCase()}
                  </span>
                </div>
              )}
              <div className="min-w-0">
                <h2 className="text-xl md:text-2xl font-display font-bold tracking-tight text-ink-900 uppercase leading-tight">
                  {proSociety?.displayName ?? "Pro Bisecco"}
                </h2>
                {metierName && (
                  <p className="text-sm text-ink-500 mt-1">{metierName} · Vérifié SIREN</p>
                )}
              </div>
            </div>

            {/* Côté droit : contact société */}
            <div className="space-y-1.5 text-xs text-ink-600 min-w-[220px]">
              {addressParts.length > 0 && (
                <div className="flex items-start gap-2">
                  <MapPin size={13} className="text-ink-400 flex-shrink-0 mt-0.5" />
                  <span className="leading-relaxed">{addressParts.join(", ")}</span>
                </div>
              )}
              {proSociety?.phone && (
                <div className="flex items-center gap-2">
                  <Phone size={13} className="text-ink-400 flex-shrink-0" />
                  <span>{proSociety.phone}</span>
                </div>
              )}
              {proSociety?.public_email && (
                <div className="flex items-center gap-2">
                  <Mail size={13} className="text-ink-400 flex-shrink-0" />
                  <span className="truncate">{proSociety.public_email}</span>
                </div>
              )}
              <div className="flex items-center gap-2">
                <Globe size={13} className="text-ink-400 flex-shrink-0" />
                <span>bisecco.eu</span>
              </div>
            </div>
          </div>

          <div className="mt-6 h-px bg-ink-200" />
        </header>

        {/* ─── BLOC ADRESSE CLIENT + TABLEAU INFOS DEVIS ─── */}
        <div className="px-6 md:px-10 pb-2">
          <div className="grid md:grid-cols-[1fr_1.2fr] gap-6 md:gap-10 items-start">
            {/* GAUCHE : Adresse client */}
            <div>
              <div className="inline-flex items-center gap-2.5 mb-3">
                <span className="w-8 h-8 rounded-full bg-ink-50 border border-ink-100 grid place-items-center">
                  <UserIcon size={14} className="text-ink-500" />
                </span>
                <span className="text-[0.7rem] font-bold uppercase tracking-[0.16em] text-ink-700">
                  Adresse du client
                </span>
              </div>
              <div className="text-sm text-ink-700 space-y-0.5 leading-relaxed pl-1">
                <div className="font-bold text-base">{clientSociety.name}</div>
                {clientSociety.address && <div>{clientSociety.address}</div>}
                <div>
                  {clientSociety.postal_code} {clientSociety.city ?? ""}
                </div>
                {clientSociety.email && (
                  <div className="text-ink-500 mt-1">Email : {clientSociety.email}</div>
                )}
                {clientSociety.phone && (
                  <div className="text-ink-500">Tél. : {clientSociety.phone}</div>
                )}
              </div>
            </div>

            {/* DROITE : titre DEVIS + tableau métadonnées */}
            <div>
              <div className="flex items-end justify-between gap-3 mb-3">
                <h1 className="text-3xl md:text-4xl font-display font-extrabold tracking-tight text-ink-900">
                  DEVIS
                </h1>
                <div className="text-info font-bold text-sm md:text-base font-mono">
                  N° {quoteNumber}
                </div>
              </div>
              <div className="rounded-2xl border border-info-soft bg-info-soft/30 overflow-hidden">
                <MetaRow label="Date du devis" value={sentAtFmt} />
                <MetaRow label="Date de validité" value={validUntilFmt} />
                <MetaRow label="Mode de règlement" value={response.payment_terms?.split(",")[0] ?? "À définir"} />
                <MetaRow label="Délai d'exécution" value={response.delay_text ?? "À définir"} />
                <MetaRow label="Référence projet" value={`#${requestId}`} last />
              </div>
            </div>
          </div>
        </div>

        {/* ─── TITRE DÉTAIL DES PRESTATIONS ─── */}
        <div className="px-6 md:px-10 pt-8 pb-3">
          <div className="inline-flex items-center gap-2.5">
            <span className="w-8 h-8 rounded-full bg-ink-50 border border-ink-100 grid place-items-center">
              <FileText size={14} className="text-ink-500" />
            </span>
            <span className="text-[0.7rem] font-bold uppercase tracking-[0.16em] text-ink-700">
              Détail des prestations
            </span>
          </div>
        </div>

        {/* ─── TABLEAU PRESTATIONS (en-tête bleu foncé) ─── */}
        <div className="px-6 md:px-10">
          <div className="rounded-2xl overflow-hidden border border-ink-200">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-ink-700 text-white text-left text-[0.7rem] font-bold uppercase tracking-[0.14em]">
                  <th className="px-4 py-3.5 w-14 text-center">N°</th>
                  <th className="px-4 py-3.5">Description des prestations</th>
                  <th className="px-3 py-3.5 text-center whitespace-nowrap w-24">Quantité</th>
                  <th className="px-3 py-3.5 text-right whitespace-nowrap w-32">Prix unit. HT</th>
                  <th className="px-4 py-3.5 text-right whitespace-nowrap w-32">Total HT</th>
                </tr>
              </thead>
              <tbody className="bg-white">
                {lines.map((l, i) => {
                  const lineHt = l.quantity * l.unit_price_ht;
                  return (
                    <tr key={i} className={i > 0 ? "border-t border-ink-100" : ""}>
                      <td className="px-4 py-4 text-center text-info font-bold tabular-nums align-top">{i + 1}</td>
                      <td className="px-4 py-4 text-ink-700 font-semibold align-top">
                        {l.label}
                        {l.unit && l.unit !== "u" && (
                          <span className="block text-xs text-ink-400 font-normal mt-0.5">Unité : {l.unit}</span>
                        )}
                      </td>
                      <td className="px-3 py-4 text-center text-ink-600 tabular-nums align-top">
                        {l.quantity}
                      </td>
                      <td className="px-3 py-4 text-right text-ink-600 tabular-nums align-top">
                        {l.unit_price_ht.toLocaleString("fr-FR", { minimumFractionDigits: 2 })} €
                      </td>
                      <td className="px-4 py-4 text-right text-ink-900 font-bold tabular-nums align-top">
                        {lineHt.toLocaleString("fr-FR", { minimumFractionDigits: 2 })} €
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* ─── CONDITIONS À GAUCHE + TOTAUX À DROITE ─── */}
        <div className="px-6 md:px-10 pt-8 pb-6">
          <div className="grid md:grid-cols-2 gap-6">
            {/* GAUCHE : Conditions & informations */}
            <div className="rounded-2xl border border-info-soft bg-info-soft/30 p-5">
              <div className="inline-flex items-center gap-2.5 mb-3">
                <span className="w-7 h-7 rounded-full bg-white border border-info-soft grid place-items-center">
                  <Info size={12} className="text-info" />
                </span>
                <span className="text-[0.7rem] font-bold uppercase tracking-[0.14em] text-ink-700">
                  Conditions & informations
                </span>
              </div>
              <ul className="space-y-1.5 text-xs text-ink-600 leading-relaxed list-disc pl-5">
                <li>
                  Ce devis est valable jusqu&apos;au <strong className="text-ink-700">{validUntilFmt}</strong>.
                </li>
                <li>Les prix sont exprimés en euros et hors taxes.</li>
                {!proSociety?.vatNumber && (
                  <li>TVA non applicable, article 293 B du CGI (franchise en base).</li>
                )}
                <li>Toute prestation supplémentaire fera l&apos;objet d&apos;un devis complémentaire.</li>
                <li>
                  En cas d&apos;acceptation, merci de nous retourner ce devis signé avec la mention « Bon pour accord ».
                </li>
                {response.message && (
                  <li className="pt-1 italic">
                    <span className="text-ink-700 not-italic font-semibold">Précisions : </span>
                    {response.message}
                  </li>
                )}
              </ul>
            </div>

            {/* DROITE : Totaux */}
            <div className="rounded-2xl border border-ink-200 bg-white p-5 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between py-2 border-b border-ink-100">
                  <span className="text-sm font-bold text-ink-700 uppercase tracking-wider">Total HT</span>
                  <span className="text-base font-bold text-ink-900 tabular-nums">
                    {response.total_ht.toLocaleString("fr-FR", { minimumFractionDigits: 2 })} €
                  </span>
                </div>

                {sortedVat.map(([rate, v]) => (
                  <div key={rate} className="flex items-center justify-between py-2 border-b border-ink-100">
                    <span className="text-sm font-bold text-ink-700 uppercase tracking-wider">
                      TVA ({(rate * 100).toFixed(rate === 0.055 ? 1 : 0)}%)
                    </span>
                    <span className="text-base font-bold text-ink-900 tabular-nums">
                      {v.vat.toLocaleString("fr-FR", { minimumFractionDigits: 2 })} €
                    </span>
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-between mt-3 pt-3 border-t-2 border-ink-700">
                <span className="text-lg font-extrabold text-info uppercase tracking-wider">
                  TOTAL TTC
                </span>
                <span className="text-2xl md:text-3xl font-extrabold text-info tabular-nums">
                  {response.total_ttc.toLocaleString("fr-FR", { minimumFractionDigits: 2 })} €
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* ─── SIGNATURES (2 colonnes) ─── */}
        <div className="px-6 md:px-10 pb-6">
          <div className="grid md:grid-cols-2 gap-6">
            <SignatureBox
              icon={<PenLine size={14} className="text-info" />}
              title="Bon pour accord"
              subtitle="Nom, signature et cachet du client :"
              date
            />
            <SignatureBox
              icon={<PenLine size={14} className="text-info" />}
              title="Signature et cachet de l'entreprise"
              subtitle={proSociety?.displayName ?? ""}
              date
              preFilled={response.status === "sent" ? sentAtFmt : null}
            />
          </div>
        </div>

        {/* ─── FOOTER MERCI + LÉGAL ─── */}
        <footer className="bg-ink-50/40 border-t border-ink-100 px-6 md:px-10 py-6">
          <div className="grid md:grid-cols-2 gap-4 items-start">
            <div className="flex items-start gap-3">
              <span className="w-9 h-9 rounded-full bg-info-soft grid place-items-center text-info flex-shrink-0">
                <Handshake size={16} />
              </span>
              <div>
                <div className="font-bold text-ink-700 text-sm">Merci pour votre confiance !</div>
                <div className="text-xs text-ink-500 mt-0.5">
                  Nous restons à votre disposition pour toute question.
                </div>
              </div>
            </div>
            <div className="text-xs text-ink-500 leading-relaxed md:text-right">
              <div className="font-bold text-ink-700 uppercase tracking-wider">
                {proSociety?.displayName ?? "—"}
              </div>
              {legalFooter.length > 0 && <div className="mt-0.5">{legalFooter.join(" · ")}</div>}
              {addressParts.length > 0 && <div className="mt-0.5">{addressParts.join(", ")}</div>}
            </div>
          </div>
          {/* Mentions légales obligatoires (Code de commerce) */}
          <div className="mt-4 pt-3 border-t border-ink-100 text-[0.65rem] text-ink-400 leading-relaxed">
            En cas de retard de paiement, pénalités de 3 × taux d&apos;intérêt légal et indemnité forfaitaire de 40 €
            pour frais de recouvrement (art. L441-10 et D441-5 du Code de commerce). Médiateur de la consommation :
            economie.gouv.fr.
          </div>
        </footer>
      </article>

      {/* Panneau de décision (client uniquement, si devis encore "sent") */}
      {isClient && response.status === "sent" && (
        <QuoteDecisionPanel quoteRequestId={requestId} />
      )}

      {/* Si accepté → on propose de continuer la conversation */}
      {response.status === "accepted" && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-5 flex items-start gap-3">
          <CheckCircle2 size={22} className="text-emerald-600 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <h3 className="font-bold text-ink-700">Devis accepté</h3>
            <p className="text-sm text-ink-600 mt-1">
              Vous pouvez {isClient ? "contacter le pro" : "contacter votre client"} pour organiser le chantier.
            </p>
            <Link
              href="/messagerie"
              className="inline-flex items-center gap-1.5 mt-3 px-4 py-2 rounded-xl bg-white border border-emerald-200 text-emerald-700 font-bold text-sm hover:bg-emerald-100"
            >
              <Send size={14} /> Ouvrir la messagerie
            </Link>
          </div>
        </div>
      )}

      {/* Refusé : message simple */}
      {response.status === "refused" && (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-5 flex items-start gap-3">
          <X size={22} className="text-red-600 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <h3 className="font-bold text-ink-700">Devis refusé</h3>
            <p className="text-sm text-ink-600 mt-1">
              {isClient ? "Tu peux toujours échanger via la messagerie ou faire d'autres demandes." : "Pas de souci, oriente-toi vers d'autres prospects via ton dashboard."}
            </p>
          </div>
        </div>
      )}

      {/* Note de refus si applicable */}
      {response.status === "refused" && response.decision_note && (
        <div className="bg-white rounded-2xl border border-red-100 p-5">
          <div className="text-[0.62rem] font-bold uppercase tracking-[0.18em] text-red-500 mb-2">
            Motif du refus
          </div>
          <p className="text-ink-600 leading-relaxed italic text-sm">« {response.decision_note} »</p>
        </div>
      )}
    </section>
  );
}

// =====================================================================
// Sous-composants du devis
// =====================================================================

function MetaRow({ label, value, last = false }: { label: string; value: string; last?: boolean }) {
  return (
    <div className={`grid grid-cols-[1fr_1.3fr] text-sm ${last ? "" : "border-b border-info-soft"}`}>
      <div className="px-4 py-2.5 font-bold text-ink-700">{label} :</div>
      <div className="px-4 py-2.5 text-ink-600 border-l border-info-soft">{value}</div>
    </div>
  );
}

function SignatureBox({
  icon, title, subtitle, date = false, preFilled = null,
}: {
  icon: React.ReactNode;
  title: string;
  subtitle?: string;
  date?: boolean;
  preFilled?: string | null;
}) {
  return (
    <div className="rounded-2xl border border-ink-200 p-5">
      <div className="flex items-center gap-2 mb-3">
        {icon}
        <span className="font-bold text-ink-700 text-sm">{title}</span>
      </div>
      {date && (
        <div className="text-xs text-ink-500 mb-2">
          Date : {preFilled ?? "___ / ___ / _______"}
        </div>
      )}
      {subtitle && <div className="text-xs text-ink-500 mb-2">{subtitle}</div>}
      <div className="mt-3 h-24 rounded-xl border border-dashed border-ink-200 bg-ink-50/30" />
    </div>
  );
}
