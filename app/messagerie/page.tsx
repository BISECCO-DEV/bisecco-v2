import type { Metadata } from "next";
import { MessagerieClient } from "./MessagerieClient";

export const metadata: Metadata = {
  title: "Messagerie",
  robots: { index: false, follow: false },
};

export default function MessageriePage() {
  return <MessagerieClient />;
}
