import type { Metadata } from "next";
import Link from "next/link";
import { CheckCircle2, Clock, Home, User } from "lucide-react";

export const metadata: Metadata = {
  title: "Email vérifié",
  robots: { index: false, follow: false },
};

type SearchParams = Promise<{ status?: string }>;

export default async function EmailVerifie({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams;
  const isPending = params.status === "pending";

  return (
    <div className="min-h-[calc(100vh-160px)] bg-ink-50 flex items-center justify-center px-4 py-12">
      <div className="bg-white rounded-3xl shadow-card border border-ink-100 p-10 max-w-md text-center">
        {isPending ? (
          <>
            <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center mb-5">
              <Clock size={40} className="text-white" />
            </div>
            <h1 className="text-2xl font-bold text-ink-700 tracking-tight">
              Email confirmé · validation en cours
            </h1>
            <p className="text-ink-500 mt-3 leading-relaxed">
              Votre adresse email a bien été vérifiée. Notre équipe va maintenant valider votre compte sous <strong>24h</strong>. Vous recevrez un email dès qu&apos;il sera activé.
            </p>
            <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 mt-5 text-sm text-amber-800 text-left">
              <strong>Pourquoi ce délai ?</strong> Nous vérifions chaque inscription manuellement pour garantir la qualité de la communauté Bisecco.
            </div>
            <div className="flex flex-col gap-2 mt-7">
              <Link href="/" className="btn-outline">
                <Home size={16} /> Retour à l&apos;accueil
              </Link>
            </div>
          </>
        ) : (
          <>
            <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center mb-5">
              <CheckCircle2 size={40} className="text-white" />
            </div>
            <h1 className="text-2xl font-bold text-ink-700 tracking-tight">Email vérifié !</h1>
            <p className="text-ink-500 mt-3 leading-relaxed">
              Votre adresse email a été confirmée. Vous pouvez maintenant profiter de toutes les fonctionnalités de Bisecco.
            </p>
            <div className="flex flex-col gap-2 mt-7">
              <Link href="/mon-profil" className="btn-primary">
                <User size={16} /> Aller sur mon profil
              </Link>
              <Link href="/" className="btn-outline">
                <Home size={16} /> Retour à l&apos;accueil
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
