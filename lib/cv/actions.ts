"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireUser } from "@/lib/db/current-user";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { CvDataSchema, type CvData } from "./schema";

/** Sauvegarde le CV du user connecté */
export async function saveCvAction(formData: FormData): Promise<void> {
  const user = await requireUser();
  if (!user.id) redirect("/connexion");

  const rawJson = String(formData.get("cv_json") ?? "");
  const metierSlug = String(formData.get("metier_slug") ?? "").trim();
  const title = String(formData.get("title") ?? "").trim() || null;
  const about = String(formData.get("about") ?? "").trim() || null;
  const searchCity = String(formData.get("search_city") ?? "").trim() || null;
  const searchRadiusRaw = String(formData.get("search_radius") ?? "").trim();
  const searchRadius = searchRadiusRaw ? parseInt(searchRadiusRaw, 10) : null;
  const availableFrom = String(formData.get("available_from") ?? "").trim() || null;

  let cvData: CvData;
  try {
    const parsed = JSON.parse(rawJson);
    cvData = CvDataSchema.parse(parsed);
  } catch {
    redirect("/mon-profil/cv?error=invalid_data");
  }

  const supabase = createSupabaseAdminClient();

  let metierId: number | null = null;
  if (metierSlug) {
    const { data: metierRow } = await supabase
      .from("metiers")
      .select("id")
      .eq("slug", metierSlug)
      .maybeSingle();
    metierId = metierRow?.id ?? null;
  }

  const { error } = await supabase
    .from("users")
    .update({
      cv_data: cvData,
      cv_metier_id: metierId,
      cv_title: title,
      cv_about: about,
      cv_search_city: searchCity,
      cv_search_radius: searchRadius,
      cv_available_from: availableFrom,
      cv_updated_at: new Date().toISOString(),
    })
    .eq("id", user.id);

  if (error) {
    console.error("[saveCvAction]", error);
    redirect("/mon-profil/cv?error=save_failed");
  }

  revalidatePath("/mon-profil/cv");
  redirect("/mon-profil/cv?saved=1");
}

/** Publie / dépublie le CV dans la banque */
export async function togglePublishCvAction(formData: FormData): Promise<void> {
  const user = await requireUser();
  if (!user.id) redirect("/connexion");

  const publish = formData.get("publish") === "true";
  const supabase = createSupabaseAdminClient();

  const { error } = await supabase
    .from("users")
    .update({
      cv_published: publish,
      cv_updated_at: new Date().toISOString(),
    })
    .eq("id", user.id);

  if (error) {
    console.error("[togglePublishCvAction]", error);
    redirect("/mon-profil/cv?error=publish_failed");
  }

  revalidatePath("/mon-profil/cv");
  revalidatePath("/banque-cv");
  redirect(`/mon-profil/cv?${publish ? "published=1" : "unpublished=1"}`);
}
