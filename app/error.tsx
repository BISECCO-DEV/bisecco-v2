"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-[calc(100vh-160px)] bg-ink-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-3xl shadow-card border border-ink-100 p-12 text-center max-w-md">
        <div className="text-7xl sm:text-8xl font-bold bg-gradient-to-br from-brand-500 to-red-500 bg-clip-text text-transparent">
          500
        </div>
        <h1 className="text-2xl font-bold text-ink-700 mt-2">
          Oups, une erreur est survenue
        </h1>
        <p className="text-ink-400 mt-3">
          Notre équipe a été notifiée et travaille à résoudre le problème.
        </p>
        <div className="flex flex-wrap justify-center gap-3 mt-7">
          <button onClick={reset} className="btn-primary">
            Réessayer
          </button>
          <Link href="/" className="btn-outline">
            ← Retour à l&apos;accueil
          </Link>
        </div>
      </div>
    </div>
  );
}
