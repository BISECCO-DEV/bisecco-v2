"use server";

import { revalidatePath } from "next/cache";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { getCurrentUser } from "@/lib/db/current-user";
import { pushNotification } from "@/lib/notifications/actions";

export type QuoteLine = {
  label: string;
  quantity: number;
  unit: string;          // "u", "h", "m²", "ml", "jour", "forfait"
  unit_price_ht: number; // €
  vat_rate: number;      // 0.20 = 20%, 0.10 = 10%, 0.055 = 5.5%
};

export type QuoteResponse = {
  id: number;
  quote_request_id: number;
  artisan_id: number;
  client_id: number;
  lines: QuoteLine[];
  total_ht: number;
  total_ttc: number;
  delay_text: string | null;
  valid_until: string | null;
  message: string | null;
  payment_terms: string | null;
  status: "sent" | "accepted" | "refused" | "expired" | "withdrawn";
  sent_at: string;
  decided_at: string | null;
  decision_note: string | null;
};

export type QuoteResponseState = { ok?: boolean; error?: string; id?: number };

/** Calcule total HT et TTC à partir d'une liste de lignes (côté serveur). */
function computeTotals(lines: QuoteLine[]): { totalHt: number; totalTtc: number } {
  let totalHt = 0;
  let totalTtc = 0;
  for (const l of lines) {
    const lineHt = l.quantity * l.unit_price_ht;
    totalHt += lineHt;
    totalTtc += lineHt * (1 + l.vat_rate);
  }
  return {
    totalHt: Math.round(totalHt * 100) / 100,
    totalTtc: Math.round(totalTtc * 100) / 100,
  };
}

/** Récupère la réponse pour une demande donnée (si elle existe). */
export async function getQuoteResponse(quoteRequestId: number): Promise<QuoteResponse | null> {
  const admin = createSupabaseAdminClient();
  const { data } = await admin
    .from("quote_responses")
    .select("*")
    .eq("quote_request_id", quoteRequestId)
    .maybeSingle();

  if (!data) return null;
  return data as QuoteResponse;
}

/** Crée une réponse structurée. Si déjà une, on UPDATE (le pro peut éditer tant que pas accepté). */
export async function submitQuoteResponseAction(
  _prev: QuoteResponseState | undefined,
  formData: FormData,
): Promise<QuoteResponseState> {
  const me = await getCurrentUser();
  if (!me || me.id == null) return { error: "Connexion requise." };
  if (me.role !== "artisan") return { error: "Réservé aux pros." };

  const requestId = Number(formData.get("quote_request_id"));
  if (!Number.isFinite(requestId)) return { error: "Demande invalide." };

  // Vérifier la demande + droit de réponse
  const admin = createSupabaseAdminClient();
  const { data: request } = await admin
    .from("quote_requests")
    .select("id, artisan_id, client_id, status, metier_id")
    .eq("id", requestId)
    .maybeSingle();

  if (!request) return { error: "Demande introuvable." };

  // 3 cas autorisés :
  //   1) le pro est ciblé directement (artisan_id = me)
  //   2) la demande est un broadcast (artisan_id NULL) et le pro est éligible
  //      (validé + même métier) → on lui attribuera le lead à la réponse
  //   3) pas autorisé sinon
  let isTargeted = request.artisan_id === me.id;
  let claimBroadcast = false;

  if (!isTargeted && request.artisan_id == null) {
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
      // Vérifier que personne d'autre n'a déjà répondu
      const { count: alreadyResponded } = await admin
        .from("quote_responses")
        .select("id", { count: "exact", head: true })
        .eq("quote_request_id", requestId);

      if ((alreadyResponded ?? 0) === 0) {
        isTargeted = true;
        claimBroadcast = true;
      } else {
        return { error: "Un autre professionnel a déjà répondu à cette opportunité." };
      }
    }
  }

  if (!isTargeted) return { error: "Vous n'êtes pas autorisé à répondre à cette demande." };

  // Si c'est un broadcast qu'on attrape → on s'assigne la demande
  if (claimBroadcast) {
    await admin
      .from("quote_requests")
      .update({ artisan_id: me.id })
      .eq("id", requestId);
  }

  // Parse lines
  let lines: QuoteLine[];
  try {
    const raw = String(formData.get("lines") ?? "[]");
    lines = JSON.parse(raw);
    if (!Array.isArray(lines) || lines.length === 0) {
      return { error: "Ajoute au moins 1 ligne au devis." };
    }
  } catch {
    return { error: "Format des lignes invalide." };
  }

  // Validation lignes
  const cleaned: QuoteLine[] = [];
  for (const l of lines) {
    const label = String(l.label ?? "").trim().slice(0, 200);
    const quantity = Number(l.quantity);
    const unit = String(l.unit ?? "u").trim().slice(0, 12);
    const unitPriceHt = Number(l.unit_price_ht);
    const vatRate = Number(l.vat_rate);

    if (!label || label.length < 2) return { error: `Libellé trop court : "${label}"` };
    if (!Number.isFinite(quantity) || quantity <= 0) return { error: "Quantité invalide." };
    if (!Number.isFinite(unitPriceHt) || unitPriceHt < 0) return { error: "Prix unitaire invalide." };
    if (![0, 0.055, 0.10, 0.20].includes(vatRate)) return { error: "Taux TVA invalide." };

    cleaned.push({ label, quantity, unit, unit_price_ht: unitPriceHt, vat_rate: vatRate });
    if (cleaned.length >= 50) break;
  }

  const { totalHt, totalTtc } = computeTotals(cleaned);

  const delay = String(formData.get("delay_text") ?? "").trim().slice(0, 120) || null;
  const validUntilRaw = String(formData.get("valid_until") ?? "").trim();
  const validUntil = /^\d{4}-\d{2}-\d{2}$/.test(validUntilRaw) ? validUntilRaw : null;
  const message = String(formData.get("message") ?? "").trim().slice(0, 5000) || null;
  const paymentTerms = String(formData.get("payment_terms") ?? "").trim().slice(0, 500) || null;

  // Upsert (1 seule réponse par demande)
  const { data: upserted, error } = await admin
    .from("quote_responses")
    .upsert(
      {
        quote_request_id: requestId,
        artisan_id: me.id,
        client_id: request.client_id,
        lines: cleaned,
        total_ht: totalHt,
        total_ttc: totalTtc,
        delay_text: delay,
        valid_until: validUntil,
        message,
        payment_terms: paymentTerms,
        status: "sent",
        sent_at: new Date().toISOString(),
      },
      { onConflict: "quote_request_id" },
    )
    .select("id")
    .single();

  if (error || !upserted) return { error: error?.message ?? "Erreur d'enregistrement." };

  // Met à jour le statut de la demande
  await admin
    .from("quote_requests")
    .update({ status: "responded", responded_at: new Date().toISOString() })
    .eq("id", requestId);

  // Notif au client
  await pushNotification(
    request.client_id,
    "quote_response",
    `Tu as reçu un devis de ${me.display_name ?? me.name}`,
    `Total : ${totalTtc.toLocaleString("fr-FR", { minimumFractionDigits: 2 })} € TTC`,
    `/mon-profil/devis/${requestId}/reponse`,
    "📄",
  );

  revalidatePath(`/mon-profil/devis/${requestId}`);
  revalidatePath(`/mon-profil/devis/${requestId}/reponse`);
  revalidatePath("/mon-profil/devis");

  return { ok: true, id: upserted.id };
}

/** Le client accepte (ou refuse) la réponse. */
export async function decideQuoteResponseAction(
  _prev: QuoteResponseState | undefined,
  formData: FormData,
): Promise<QuoteResponseState> {
  const me = await getCurrentUser();
  if (!me || me.id == null) return { error: "Connexion requise." };

  const requestId = Number(formData.get("quote_request_id"));
  const decision = String(formData.get("decision") ?? "");
  const note = String(formData.get("note") ?? "").trim().slice(0, 1000) || null;

  if (!Number.isFinite(requestId)) return { error: "Demande invalide." };
  if (decision !== "accepted" && decision !== "refused") return { error: "Décision invalide." };

  const admin = createSupabaseAdminClient();
  const { data: response } = await admin
    .from("quote_responses")
    .select("id, artisan_id, client_id, status, total_ttc")
    .eq("quote_request_id", requestId)
    .maybeSingle();

  if (!response) return { error: "Devis introuvable." };
  if (response.client_id !== me.id) return { error: "Action non autorisée." };
  if (response.status !== "sent") return { error: "Décision déjà prise sur ce devis." };

  await admin
    .from("quote_responses")
    .update({
      status: decision,
      decided_at: new Date().toISOString(),
      decision_note: note,
    })
    .eq("id", response.id);

  // Si accepté → on ferme la demande (status: closed)
  if (decision === "accepted") {
    await admin
      .from("quote_requests")
      .update({ status: "closed", closed_at: new Date().toISOString() })
      .eq("id", requestId);
  }

  // Notif au pro
  await pushNotification(
    response.artisan_id,
    decision === "accepted" ? "quote_accepted" : "quote_refused",
    decision === "accepted"
      ? `🎉 ${me.display_name ?? me.name} a accepté ton devis !`
      : `${me.display_name ?? me.name} a refusé ton devis`,
    decision === "accepted"
      ? `Devis ${response.total_ttc.toLocaleString("fr-FR", { minimumFractionDigits: 2 })} € TTC accepté`
      : note ?? "Aucun motif",
    `/mon-profil/devis`,
    decision === "accepted" ? "✅" : "❌",
  );

  revalidatePath(`/mon-profil/devis/${requestId}`);
  revalidatePath(`/mon-profil/devis/${requestId}/reponse`);
  revalidatePath("/mon-profil/devis");

  return { ok: true };
}
