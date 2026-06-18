import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { EditProfileForm } from "./EditProfileForm";
import { requireUser } from "@/lib/db/current-user";
import { fetchAllMetiers } from "@/lib/db/metiers";
import { getMyArtisanProfile, getMyArtisanMetierIds, listMyServices } from "@/lib/profile/artisan";
import { listMyGallery } from "@/lib/profile/gallery";
import { listMyPortfolio } from "@/lib/profile/portfolio";
import { listMyAvailability } from "@/lib/availability/actions";

export const metadata: Metadata = {
  title: "Modifier mon profil",
  robots: { index: false, follow: false },
};

export default async function EditProfilePage() {
  const user = await requireUser();
  const isArtisan = user.role === "artisan";

  const [gallery, portfolio, availability, metiers, artisanProfile, artisanMetierIds, services] = await Promise.all([
    listMyGallery(),
    isArtisan ? listMyPortfolio() : Promise.resolve([]),
    isArtisan ? listMyAvailability() : Promise.resolve([]),
    isArtisan ? fetchAllMetiers() : Promise.resolve([]),
    isArtisan ? getMyArtisanProfile() : Promise.resolve(null),
    isArtisan ? getMyArtisanMetierIds() : Promise.resolve([]),
    isArtisan ? listMyServices() : Promise.resolve([]),
  ]);

  return (
    <div className="bg-ink-50 min-h-screen">
      <div className="container-default py-10">
        <Link href="/mon-profil" className="inline-flex items-center gap-1.5 text-sm text-ink-500 hover:text-brand-500 font-semibold transition">
          <ArrowLeft size={14} /> Retour à mon espace
        </Link>
        <h1 className="text-3xl font-bold text-ink-700 mt-4 tracking-tight">Modifier mon profil</h1>
        <p className="text-ink-400 mt-2">Mettez à jour vos informations professionnelles, photos et tarifs.</p>

        <EditProfileForm
          initial={{
            name: user.name,
            email: user.email,
            phone: user.phone ?? "",
            city: user.city ?? "",
            description: user.description ?? "",
            siren: user.siren,
            role: user.role,
            profile_photo: user.profile_photo,
            cover_photo: user.cover_photo,
            street_address: user.street_address,
            latitude: user.latitude,
            longitude: user.longitude,
            contact_via_email: user.contact_via_email,
            contact_via_phone: user.contact_via_phone,
            public_contact_email: user.public_contact_email,
          }}
          gallery={gallery}
          portfolio={portfolio}
          availability={availability}
          metiers={metiers.map((m) => ({ id: m.id, name: m.name }))}
          artisanProfile={
            artisanProfile
              ? {
                  metier_ids: artisanMetierIds,
                  company_name: artisanProfile.company_name ?? "",
                  service_radius: artisanProfile.service_radius,
                  availability: artisanProfile.availability ?? "",
                }
              : null
          }
          services={services}
        />
      </div>
    </div>
  );
}
