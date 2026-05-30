"use client";

import { useEffect } from "react";
import { AlertTriangle, Home, RefreshCw } from "lucide-react";
import { CtaButton } from "@/components/ui/CtaButton";

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
    <div className="min-h-[calc(100vh-160px)] bg-sand-50 flex items-center justify-center px-4 py-16">
      <div className="bg-white rounded-3xl border border-sand-200 shadow-[0_20px_50px_-20px_rgba(13,30,74,0.15)] p-10 sm:p-14 text-center max-w-lg w-full">
        <div className="w-16 h-16 rounded-2xl bg-red-50 grid place-items-center mx-auto mb-6">
          <AlertTriangle size={28} className="text-red-500" strokeWidth={2} />
        </div>
        <div className="font-display font-semibold text-[64px] sm:text-[80px] leading-none text-ink-900 tracking-[-0.03em]">
          500
        </div>
        <h1 className="font-display font-semibold text-[1.5rem] tracking-tight text-ink-900 mt-4">
          Oups, une erreur est survenue
        </h1>
        <p className="text-ink-500 mt-3 text-[0.94rem] leading-relaxed max-w-sm mx-auto">
          Notre équipe a été notifiée. Vous pouvez réessayer dans un instant ou revenir à l&apos;accueil.
        </p>
        {error.digest && (
          <code className="block mt-4 text-[0.66rem] text-ink-400 font-mono bg-sand-50 rounded-md px-3 py-1.5 break-all">
            {error.digest}
          </code>
        )}
        <div className="flex flex-wrap justify-center gap-3 mt-8">
          <CtaButton type="button" variant="primary" size="md" icon={RefreshCw} onClick={reset}>
            Réessayer
          </CtaButton>
          <CtaButton href="/" variant="white" size="md" icon={Home}>
            Accueil
          </CtaButton>
        </div>
      </div>
    </div>
  );
}
