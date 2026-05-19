import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Politique de confidentialité",
};

export default function PoliticPage() {
  return (
    <div className="bg-ink-50 min-h-screen">
      <div className="container-default py-16 max-w-3xl">
        <h1 className="text-3xl font-bold text-ink-700">Politique de confidentialité</h1>
        <p className="text-ink-400 mt-4">
          Conformément au RGPD, Bisecco collecte et traite vos données personnelles de manière transparente. Les détails seront affinés en V1.
        </p>
      </div>
    </div>
  );
}
