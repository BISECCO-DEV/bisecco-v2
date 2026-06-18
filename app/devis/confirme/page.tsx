import type { Metadata } from "next";
import Link from "next/link";
import { CheckCircle2, Mail, Home, MessageCircle } from "lucide-react";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

export const metadata: Metadata = {
  title: "Demande envoyée",
  robots: { index: false, follow: false },
};

type SearchParams = Promise<{ id?: string }>;

type QuoteInfo = {
  artisan_name: string | null;
  artisan_client_number: string | null;
};

async function fetchQuoteInfo(id: number): Promise<QuoteInfo | null> {
  const admin = createSupabaseAdminClient();
  const { data } = await admin
    .from("quote_requests")
    .select(`
      artisan:artisan_id ( name, client_number, artisan_profiles ( company_name ) )
    `)
    .eq("id", id)
    .maybeSingle();

  if (!data) return null;
  const artisan = data.artisan as unknown as {
    name: string | null;
    client_number: string | null;
    artisan_profiles: { company_name: string | null }[] | null;
  } | null;
  if (!artisan) return null;

  const company = artisan.artisan_profiles?.[0]?.company_name?.trim();
  return {
    artisan_name: company || artisan.name || null,
    artisan_client_number: artisan.client_number ?? null,
  };
}

export default async function DevisConfirme({ searchParams }: { searchParams: SearchParams }) {
  const { id } = await searchParams;
  const quoteId = id ? parseInt(id, 10) : NaN;
  const info = Number.isFinite(quoteId) ? await fetchQuoteInfo(quoteId) : null;
  const isTargeted = Boolean(info?.artisan_name);

  return (
    <div className="min-h-[calc(100vh-160px)] bg-ink-50 flex items-center justify-center px-4 py-12">
      <div className="bg-white rounded-3xl shadow-card border border-ink-100 p-10 max-w-md text-center">
        <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center mb-5">
          <CheckCircle2 size={40} className="text-white" />
        </div>
        <h1 className="text-2xl font-bold text-ink-700">Demande envoyée !</h1>
        <p className="text-ink-500 mt-2 leading-relaxed">
          {isTargeted ? (
            <>
              Votre demande a bien été transmise à <strong>{info!.artisan_name}</strong>. Le professionnel a été notifié par email et vous répondra directement.
            </>
          ) : (
            <>
              Votre demande est enregistrée. Le professionnel a été notifié et reviendra vers vous directement.
            </>
          )}
        </p>

        <div className="text-left mt-7 space-y-3 bg-ink-50 rounded-2xl p-5 border border-ink-100">
          {[
            { icon: Mail,  text: "Vous recevrez sa réponse par email" },
            { icon: MessageCircle, text: "Vous pouvez aussi échanger via la messagerie Bisecco" },
          ].map((s) => (
            <div key={s.text} className="flex items-center gap-3 text-sm">
              <s.icon size={16} className="text-brand-500 flex-shrink-0" />
              <span className="text-ink-600">{s.text}</span>
            </div>
          ))}
        </div>

        <div className="flex gap-2 mt-7">
          <Link href="/mon-profil/devis" className="btn-primary flex-1">
            Suivre ma demande
          </Link>
          <Link href="/" className="btn-outline flex-1">
            <Home size={16} /> Accueil
          </Link>
        </div>
      </div>
    </div>
  );
}
