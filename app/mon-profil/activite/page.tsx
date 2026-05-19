import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, MessageCircle, FileText, Star, Eye, Heart, Edit3, LogIn, ShieldCheck } from "lucide-react";

export const metadata: Metadata = {
  title: "Activité récente",
  robots: { index: false, follow: false },
};

type Activity = { id: number; type: "login" | "edit" | "message" | "devis" | "review" | "view" | "favorite" | "verify"; title: string; sub?: string; time: string };

const ACTIVITIES: Activity[] = [
  { id: 1,  type: "message", title: "Nouveau message de Marie L.",          time: "Il y a 5 min" },
  { id: 2,  type: "devis",   title: "Nouvelle demande de devis reçue",       sub: "Rénovation salle de bain · 4200€", time: "Il y a 2h" },
  { id: 3,  type: "view",    title: "Votre profil a été consulté",           sub: "+12 vues aujourd'hui",            time: "Aujourd'hui" },
  { id: 4,  type: "review",  title: "Avis 5★ reçu de Pierre M.",            sub: "« Excellent travail »",            time: "Hier" },
  { id: 5,  type: "edit",    title: "Profil modifié",                        sub: "Photo de couverture mise à jour", time: "Hier" },
  { id: 6,  type: "favorite",title: "Sophie K. vous a ajouté en favori",    time: "Il y a 2 jours" },
  { id: 7,  type: "login",   title: "Connexion depuis un nouvel appareil",   sub: "Chrome · Windows · Meaux",        time: "Il y a 3 jours" },
  { id: 8,  type: "verify",  title: "SIREN vérifié avec succès",             sub: "Validation automatique gouv.fr",  time: "Il y a 3 mois" },
];

const ICONS = {
  login:    { icon: LogIn,        color: "text-purple-500",  bg: "bg-purple-50" },
  edit:     { icon: Edit3,        color: "text-blue-500",    bg: "bg-blue-50" },
  message:  { icon: MessageCircle,color: "text-blue-500",    bg: "bg-blue-50" },
  devis:    { icon: FileText,     color: "text-brand-500",   bg: "bg-brand-50" },
  review:   { icon: Star,         color: "text-amber-500",   bg: "bg-amber-50" },
  view:     { icon: Eye,          color: "text-emerald-500", bg: "bg-emerald-50" },
  favorite: { icon: Heart,        color: "text-pink-500",    bg: "bg-pink-50" },
  verify:   { icon: ShieldCheck,  color: "text-emerald-500", bg: "bg-emerald-50" },
};

export default function ActivitePage() {
  return (
    <div className="bg-ink-50 min-h-screen">
      <div className="container-default py-10">
        <Link href="/mon-profil" className="inline-flex items-center gap-1.5 text-sm text-ink-500 hover:text-brand-500 font-semibold transition">
          <ArrowLeft size={14} /> Mon espace
        </Link>

        <h1 className="text-3xl font-bold text-ink-700 mt-4 tracking-tight">Activité récente</h1>
        <p className="text-ink-400 mt-1">L&apos;historique complet de votre activité sur Bisecco.</p>

        {/* Timeline */}
        <div className="mt-8 relative">
          <div className="absolute left-5 top-2 bottom-2 w-px bg-ink-200" />
          <div className="space-y-1">
            {ACTIVITIES.map((a) => {
              const cfg = ICONS[a.type];
              return (
                <div key={a.id} className="relative flex items-start gap-4 py-3">
                  <div className={`w-10 h-10 rounded-xl ${cfg.bg} flex items-center justify-center flex-shrink-0 relative z-10 border-4 border-ink-50`}>
                    <cfg.icon size={15} className={cfg.color} />
                  </div>
                  <div className="flex-1 pt-1.5">
                    <div className="font-semibold text-ink-700 text-sm">{a.title}</div>
                    {a.sub && <div className="text-xs text-ink-500 mt-0.5">{a.sub}</div>}
                    <div className="text-[0.7rem] text-ink-400 mt-1">{a.time}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="mt-8 text-center text-sm text-ink-400">
          C&apos;est tout pour le moment. Continuez d&apos;utiliser Bisecco !
        </div>
      </div>
    </div>
  );
}
