import type { Metadata } from "next";
import { MessagerieClient } from "../MessagerieClient";

export const metadata: Metadata = {
  title: "Messagerie",
  robots: { index: false, follow: false },
};

export default async function MessagerieConversationPage({ params }: { params: Promise<{ id: string }> }) {
  await params;
  // Le client component gère l'état actif via state. Le param :id pourrait préselectionner la conv.
  return <MessagerieClient />;
}
