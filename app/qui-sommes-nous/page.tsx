import type { Metadata } from "next";
import Link from "next/link";
import { Heart, Target, Shield, Users } from "lucide-react";

export const metadata: Metadata = {
  title: "Qui sommes-nous",
  description: "Découvrez l'histoire de Bisecco, le 1er réseau social des artisans français vérifiés. Notre mission, notre équipe et nos valeurs.",
};

export default function QuiSommesNousPage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-gradient-to-br from-ink-800 via-ink-700 to-ink-800 text-white py-20 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-brand-500/15 blur-3xl pointer-events-none" />
        <div className="container-default relative text-center max-w-3xl mx-auto">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-500/20 border border-brand-500/40 text-brand-400 text-sm font-bold">
            ❤️ Notre histoire
          </span>
          <h1 className="text-4xl md:text-5xl font-bold mt-5">
            Construisons ensemble la <span className="text-brand-500">confiance</span> entre artisans et particuliers.
          </h1>
          <p className="mt-5 text-white/70 text-lg">
            Bisecco est née d&apos;un constat simple : trouver un artisan de confiance en France ne devrait pas être un parcours du combattant.
          </p>
        </div>
      </section>

      {/* Mission + Valeurs */}
      <section className="py-20 bg-white">
        <div className="container-default">
          <div className="grid md:grid-cols-2 gap-6">
            {[
              { icon: Target, title: "Notre mission", text: "Redonner du pouvoir aux artisans locaux en leur offrant une vitrine digitale gratuite, et permettre aux particuliers de trouver des pros qualifiés en toute confiance." },
              { icon: Heart, title: "Nos valeurs", text: "Transparence totale (zéro commission cachée), vérification systématique (SIREN obligatoire), et respect mutuel entre tous les membres du réseau." },
              { icon: Shield, title: "Notre engagement", text: "Aucun faux profil, aucun avis acheté. Chaque interaction est sécurisée et chaque artisan est contrôlé via l'API officielle gouv.fr." },
              { icon: Users, title: "Notre équipe", text: "Une petite équipe française passionnée, basée en Île-de-France. Nous échangeons régulièrement avec les artisans pour améliorer le service." },
            ].map(({ icon: Icon, title, text }) => (
              <div key={title} className="bg-ink-50 rounded-3xl p-8 border border-ink-100">
                <div className="w-12 h-12 rounded-xl bg-brand-500 flex items-center justify-center mb-4">
                  <Icon className="text-white" size={22} />
                </div>
                <h2 className="text-xl font-bold text-ink-700">{title}</h2>
                <p className="text-ink-500 mt-3 leading-relaxed">{text}</p>
              </div>
            ))}
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-12 bg-gradient-to-br from-ink-800 to-ink-700 rounded-3xl p-8 text-white">
            {[
              { value: "2026", label: "Création" },
              { value: "100%", label: "Vérifiés" },
              { value: "0€", label: "Commission" },
              { value: "🇫🇷", label: "Made in France" },
            ].map((s) => (
              <div key={s.label} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-brand-400">{s.value}</div>
                <div className="text-sm text-white/60 mt-1">{s.label}</div>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div className="text-center mt-12">
            <Link href="/inscription" className="btn-primary">
              Rejoindre la communauté
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
