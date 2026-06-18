import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { requireUser } from "@/lib/db/current-user";
import { ProSidebar } from "./ProSidebar";

export const metadata: Metadata = {
  title: "Espace professionnel",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function ProLayout({ children }: { children: React.ReactNode }) {
  const user = await requireUser();

  // Réservé aux pros. Particuliers et admins n'y ont pas accès.
  if (user.role !== "artisan") {
    redirect("/mon-profil");
  }

  return (
    <div className="bg-ink-50 min-h-screen">
      <div className="flex">
        <ProSidebar
          userName={user.display_name}
          userAvatar={user.profile_photo ?? null}
          userClientNumber={user.client_number}
          isApproved={user.validation_status === "approved"}
        />
        <main className="flex-1 min-w-0 lg:ml-[260px] xl:ml-[280px]">
          {children}
        </main>
      </div>
    </div>
  );
}
