"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

type Status = "exchanging" | "success" | "error";

export function ExchangeClient({ next }: { next: string }) {
  const router = useRouter();
  const [status, setStatus] = useState<Status>("exchanging");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    const run = async () => {
      // Parse les tokens du hash (#access_token=...&refresh_token=...)
      const hash = window.location.hash.startsWith("#")
        ? window.location.hash.slice(1)
        : window.location.hash;
      const params = new URLSearchParams(hash);

      const accessToken = params.get("access_token");
      const refreshToken = params.get("refresh_token");
      const errParam = params.get("error_description") || params.get("error");

      if (errParam) {
        setStatus("error");
        setErrorMsg(decodeURIComponent(errParam.replace(/\+/g, " ")));
        return;
      }

      if (!accessToken || !refreshToken) {
        setStatus("error");
        setErrorMsg("Lien d'activation incomplet ou expiré. Demandez un nouveau lien.");
        return;
      }

      try {
        const supabase = createClient();
        const { error } = await supabase.auth.setSession({
          access_token: accessToken,
          refresh_token: refreshToken,
        });

        if (error) {
          setStatus("error");
          setErrorMsg(error.message);
          return;
        }

        // Nettoie le hash de l'URL pour ne pas exposer les tokens
        window.history.replaceState({}, "", window.location.pathname + window.location.search);

        setStatus("success");
        // Redirige après 800ms (pour laisser le temps de voir le succès)
        setTimeout(() => {
          router.replace(next);
        }, 800);
      } catch (e) {
        setStatus("error");
        setErrorMsg(e instanceof Error ? e.message : "Erreur inconnue");
      }
    };

    run();
  }, [next, router]);

  return (
    <div className="min-h-[calc(100vh-80px)] bg-sand-50 flex items-center justify-center px-4 py-16">
      <div className="bg-white rounded-3xl border border-sand-200 shadow-[0_20px_50px_-20px_rgba(13,30,74,0.15)] p-10 sm:p-12 text-center max-w-md w-full">
        {status === "exchanging" && (
          <>
            <div className="w-16 h-16 rounded-2xl bg-brand-50 grid place-items-center mx-auto mb-6">
              <Loader2 size={32} className="text-brand-500 animate-spin" strokeWidth={2} />
            </div>
            <h1 className="font-display font-semibold text-[1.5rem] tracking-tight text-ink-900">
              Activation en cours…
            </h1>
            <p className="text-ink-500 mt-3 text-[0.94rem] leading-relaxed">
              Nous validons votre adresse email et activons votre compte.
            </p>
          </>
        )}

        {status === "success" && (
          <>
            <div className="w-16 h-16 rounded-2xl bg-emerald-50 grid place-items-center mx-auto mb-6">
              <CheckCircle2 size={32} className="text-emerald-500" strokeWidth={2} />
            </div>
            <h1 className="font-display font-semibold text-[1.5rem] tracking-tight text-ink-900">
              Email validé !
            </h1>
            <p className="text-ink-500 mt-3 text-[0.94rem] leading-relaxed">
              Vous êtes redirigé vers votre espace…
            </p>
          </>
        )}

        {status === "error" && (
          <>
            <div className="w-16 h-16 rounded-2xl bg-red-50 grid place-items-center mx-auto mb-6">
              <AlertCircle size={32} className="text-red-500" strokeWidth={2} />
            </div>
            <h1 className="font-display font-semibold text-[1.5rem] tracking-tight text-ink-900">
              Lien d&apos;activation invalide
            </h1>
            <p className="text-ink-500 mt-3 text-[0.94rem] leading-relaxed">
              {errorMsg ?? "Le lien a peut-être expiré (1h)."}
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <a
                href="/connexion"
                className="inline-flex items-center px-4 py-2.5 rounded-tl-xl rounded-tr-xl rounded-br-xl bg-brand-500 text-white font-semibold text-sm hover:bg-brand-600 transition"
              >
                Aller à la connexion
              </a>
              <a
                href="/contact"
                className="inline-flex items-center px-4 py-2.5 rounded-tl-xl rounded-tr-xl rounded-br-xl bg-white border border-sand-200 text-ink-700 font-semibold text-sm hover:bg-sand-50 transition"
              >
                Contacter le support
              </a>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
