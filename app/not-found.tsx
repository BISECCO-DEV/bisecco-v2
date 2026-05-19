import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-[calc(100vh-160px)] bg-ink-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-3xl shadow-card border border-ink-100 p-12 text-center max-w-md">
        <div className="text-7xl sm:text-8xl font-bold text-ink-700">
          404
        </div>
        <h1 className="text-2xl font-bold text-ink-700 mt-2">Page introuvable</h1>
        <p className="text-ink-400 mt-3">
          La page que vous cherchez n&apos;existe pas ou a été déplacée.
        </p>
        <div className="flex flex-wrap justify-center gap-3 mt-7">
          <Link href="/" className="btn-primary">← Retour à l&apos;accueil</Link>
          <Link href="/contact" className="btn-outline">Contacter le support</Link>
        </div>
      </div>
    </div>
  );
}
