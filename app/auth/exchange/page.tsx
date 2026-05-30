import type { Metadata } from "next";
import { ExchangeClient } from "./ExchangeClient";

export const metadata: Metadata = {
  title: "Activation en cours…",
  robots: { index: false, follow: false },
};

type SearchParams = Promise<{ next?: string }>;

export default async function ExchangePage({ searchParams }: { searchParams: SearchParams }) {
  const { next } = await searchParams;
  return <ExchangeClient next={next ?? "/mon-profil"} />;
}
