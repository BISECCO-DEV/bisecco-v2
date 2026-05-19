import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Mentions légales",
};

export default function MentionsPage() {
  return (
    <div className="bg-ink-50 min-h-screen">
      <div className="container-default py-16 max-w-3xl prose prose-slate">
        <h1 className="text-3xl font-bold text-ink-700">Mentions légales</h1>
        <p className="text-ink-400 mt-4">
          Site édité par <strong>Bisecco</strong>, plateforme française de mise en relation entre artisans et particuliers.
        </p>
        <h2 className="text-xl font-bold text-ink-700 mt-8">Éditeur</h2>
        <p className="text-ink-500">Bisecco — France · contact@bisecco.fr</p>
        <h2 className="text-xl font-bold text-ink-700 mt-6">Hébergement</h2>
        <p className="text-ink-500">À compléter selon le choix d&apos;hébergeur (Vercel / Cloudflare / etc.)</p>
      </div>
    </div>
  );
}
