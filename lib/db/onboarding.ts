import { createSupabaseAdminClient } from "@/lib/supabase/admin";

export type OnboardingStep = {
  key: string;
  title: string;
  description: string;
  href: string;
  done: boolean;
  /** Priorité (1 = critique, 3 = polish). */
  priority: 1 | 2 | 3;
};

export type OnboardingStatus = {
  steps: OnboardingStep[];
  completed: number;
  total: number;
  percent: number;
  /** Au moins 1 étape critique pas faite. */
  hasCritical: boolean;
};

/**
 * Calcule l'état de l'onboarding pour un user (artisan ou particulier).
 * Pour les artisans : 7 étapes (validation profil, photo, description, métier, ville, premier post, etc.).
 * Pour les particuliers : 4 étapes (photo, ville, premier devis, premier message).
 */
export async function fetchOnboardingStatus(userId: number, role: string): Promise<OnboardingStatus> {
  const admin = createSupabaseAdminClient();

  const { data: user } = await admin
    .from("users")
    .select("id, name, email, phone, city, description, profile_photo, cover_photo, validation_status, siren_status")
    .eq("id", userId)
    .maybeSingle();

  if (!user) return { steps: [], completed: 0, total: 0, percent: 0, hasCritical: false };

  let steps: OnboardingStep[] = [];

  if (role === "artisan") {
    // Charger le profil artisan complet (id pour les FK des tables liées)
    const { data: profile } = await admin
      .from("artisan_profiles")
      .select("id, description, business_hours, service_radius, latitude, longitude")
      .eq("user_id", userId)
      .maybeSingle();
    const profileId = (profile?.id as number | undefined) ?? -1;

    // Compter les services + photos galerie
    const [{ count: nbServices }, { count: nbGallery }, { count: nbPosts }] = await Promise.all([
      admin.from("services").select("*", { count: "exact", head: true }).eq("artisan_profile_id", profileId),
      admin.from("gallery_images").select("*", { count: "exact", head: true }).eq("artisan_profile_id", profileId),
      admin.from("artisan_posts").select("*", { count: "exact", head: true }).eq("user_id", userId),
    ]);

    steps = [
      {
        key: "validation",
        title: "Validation SIREN",
        description: "Votre numéro SIREN doit être validé par l'INSEE.",
        href: "/mon-profil/edit",
        done: user.validation_status === "approved",
        priority: 1,
      },
      {
        key: "photo",
        title: "Photo de profil",
        description: "Une photo professionnelle augmente la confiance.",
        href: "/mon-profil/edit",
        done: !!user.profile_photo,
        priority: 1,
      },
      {
        key: "description",
        title: "Description de votre activité",
        description: "Présentez votre savoir-faire en quelques phrases.",
        href: "/mon-profil/edit",
        done: !!(user.description || profile?.description),
        priority: 1,
      },
      {
        key: "city",
        title: "Ville d'intervention",
        description: "Renseignez votre ville principale.",
        href: "/mon-profil/edit",
        done: !!user.city,
        priority: 1,
      },
      {
        key: "phone",
        title: "Téléphone professionnel",
        description: "Vos clients pourront vous joindre rapidement.",
        href: "/mon-profil/edit",
        done: !!user.phone,
        priority: 2,
      },
      {
        key: "gallery",
        title: "Galerie de réalisations",
        description: "Ajoutez au moins 3 photos de vos travaux.",
        href: "/mon-profil/edit",
        done: (nbGallery ?? 0) >= 3,
        priority: 2,
      },
      {
        key: "services",
        title: "Services proposés",
        description: "Listez vos prestations et tarifs indicatifs.",
        href: "/mon-profil/edit",
        done: (nbServices ?? 0) >= 1,
        priority: 2,
      },
      {
        key: "post",
        title: "Premier post sur votre profil",
        description: "Partagez une actualité ou un projet récent.",
        href: "/mon-profil",
        done: (nbPosts ?? 0) >= 1,
        priority: 3,
      },
      {
        key: "cover",
        title: "Photo de couverture",
        description: "Personnalisez l'en-tête de votre profil.",
        href: "/mon-profil/edit",
        done: !!user.cover_photo,
        priority: 3,
      },
    ];
  } else {
    // Particulier
    steps = [
      {
        key: "photo",
        title: "Photo de profil",
        description: "Identifiez-vous auprès des artisans.",
        href: "/mon-profil/edit",
        done: !!user.profile_photo,
        priority: 2,
      },
      {
        key: "phone",
        title: "Téléphone",
        description: "Pour être recontacté rapidement.",
        href: "/mon-profil/edit",
        done: !!user.phone,
        priority: 1,
      },
      {
        key: "city",
        title: "Votre ville",
        description: "Pour trouver les artisans près de chez vous.",
        href: "/mon-profil/edit",
        done: !!user.city,
        priority: 1,
      },
      {
        key: "description",
        title: "Une courte présentation",
        description: "Aide les artisans à comprendre votre besoin.",
        href: "/mon-profil/edit",
        done: !!user.description,
        priority: 3,
      },
    ];
  }

  const completed = steps.filter((s) => s.done).length;
  const total = steps.length;
  const percent = total > 0 ? Math.round((completed / total) * 100) : 0;
  const hasCritical = steps.some((s) => !s.done && s.priority === 1);

  return { steps, completed, total, percent, hasCritical };
}
