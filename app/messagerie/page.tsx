import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { MessagerieClient } from "./MessagerieClient";
import { getCurrentDbUser } from "@/lib/auth/current-user";

export const metadata: Metadata = {
  title: "Messagerie",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function MessageriePage() {
  const me = await getCurrentDbUser();
  if (!me) redirect("/connexion?redirect=/messagerie");

  return <MessagerieClient currentUserId={me.id} />;
}
