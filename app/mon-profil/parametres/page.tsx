import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Bell, Lock, Globe, Eye, Mail, Trash2, Smartphone, Ban, Zap } from "lucide-react";
import { ExportDataButton, DeleteAccountButton } from "./GdprActions";
import { EnableNotificationsButton } from "@/components/features/EnableNotificationsButton";
import { BlockedUsersSection } from "./BlockedUsersSection";
import { QuickRepliesSection } from "./QuickRepliesSection";
import { listBlockedUsers } from "@/lib/blocks/actions";
import { listMyQuickReplies } from "@/lib/quick-replies/actions";
import { getCurrentUser } from "@/lib/db/current-user";

export const metadata: Metadata = {
  title: "Paramètres",
  robots: { index: false, follow: false },
};

export default async function ParametresPage() {
  const vapidPublicKey = process.env.NEXT_PUBLIC_VAPID_KEY;
  const me = await getCurrentUser();
  const isArtisan = me?.role === "artisan";
  const [blocked, quickReplies] = await Promise.all([
    listBlockedUsers(),
    isArtisan ? listMyQuickReplies() : Promise.resolve([]),
  ]);

  return (
    <div className="bg-ink-50 min-h-screen">
      <div className="container-default py-10">
        <Link href="/mon-profil" className="inline-flex items-center gap-1.5 text-sm text-ink-500 hover:text-brand-500 font-semibold transition">
          <ArrowLeft size={14} /> Mon espace
        </Link>
        <h1 className="text-3xl font-bold text-ink-700 mt-4 tracking-tight">Paramètres</h1>
        <p className="text-ink-400 mt-1">Gérez votre compte, sécurité, notifications et confidentialité.</p>

        <div className="mt-8 space-y-6">
          {/* Notifications push */}
          <Section icon={Smartphone} title="Notifications push" sub="Reçois une alerte sur ton téléphone même quand l'app n'est pas ouverte">
            <div className="px-1 py-2">
              <p className="text-sm text-ink-600 mb-3">
                Active les notifications pour recevoir une alerte instantanée à chaque nouveau message, devis ou avis.
              </p>
              <EnableNotificationsButton vapidPublicKey={vapidPublicKey} />
            </div>
          </Section>

          {/* Notifications emails */}
          <Section icon={Bell} title="Notifications email" sub="Choisissez les emails et alertes que vous recevez">
            {[
              { label: "Nouveau message reçu",     defaultOn: true  },
              { label: "Nouvelle demande de devis", defaultOn: true  },
              { label: "Nouvel avis publié",       defaultOn: true  },
              { label: "Récap hebdomadaire",       defaultOn: false },
              { label: "Newsletter Bisecco",       defaultOn: false },
            ].map((n) => (
              <Toggle key={n.label} label={n.label} defaultChecked={n.defaultOn} />
            ))}
          </Section>

          {/* Sécurité */}
          <Section icon={Lock} title="Sécurité" sub="Mot de passe, authentification à deux facteurs">
            <Row label="Mot de passe"  sub="Dernier changement il y a 3 mois">
              <button className="text-sm font-bold text-brand-500 hover:underline">Modifier</button>
            </Row>
            <Row label="Authentification à 2 facteurs"  sub="Sécurise votre compte avec un code SMS">
              <span className="text-xs font-bold text-amber-700 bg-amber-50 px-2 py-1 rounded">Désactivé</span>
            </Row>
            <Row label="Sessions actives" sub="3 appareils connectés">
              <button className="text-sm font-bold text-brand-500 hover:underline">Voir</button>
            </Row>
          </Section>

          {/* Réponses pré-enregistrées (pros uniquement) */}
          {isArtisan && (
            <Section icon={Zap} title="Réponses pré-enregistrées" sub="Réponds à tes clients en 1 clic depuis la messagerie">
              <QuickRepliesSection initial={quickReplies} />
            </Section>
          )}

          {/* Utilisateurs bloqués */}
          <Section icon={Ban} title="Utilisateurs bloqués" sub={`${blocked.length} personne${blocked.length > 1 ? "s" : ""} bloquée${blocked.length > 1 ? "s" : ""} · plus aucun message ne passe`}>
            <BlockedUsersSection initial={blocked} />
          </Section>

          {/* Confidentialité */}
          <Section icon={Eye} title="Confidentialité" sub="Contrôlez ce qui est visible publiquement">
            <Toggle label="Mon profil est public" defaultChecked />
            <Toggle label="Afficher mon email sur mon profil" />
            <Toggle label="Afficher mon numéro de téléphone" />
            <Toggle label="Apparaître dans la recherche Google" defaultChecked />
          </Section>

          {/* Langue */}
          <Section icon={Globe} title="Langue & région">
            <Row label="Langue" sub="Français (France)">
              <select className="px-3 py-1.5 rounded-lg bg-white border border-ink-200 text-sm font-semibold outline-none">
                <option>Français</option>
                <option disabled>English (bientôt)</option>
              </select>
            </Row>
            <Row label="Fuseau horaire" sub="Europe/Paris (UTC+1)">
              <span className="text-sm font-semibold text-ink-700">Auto</span>
            </Row>
          </Section>

          {/* Données · RGPD Article 20 */}
          <Section icon={Mail} title="Mes données">
            <Row
              label="Exporter mes données"
              sub="Télécharge l'ensemble de tes données au format JSON (RGPD Article 20 - portabilité)"
            >
              <ExportDataButton />
            </Row>
          </Section>

          {/* Zone dangereuse · RGPD Article 17 */}
          <Section icon={Trash2} title="Zone dangereuse" danger>
            <Row
              label="Supprimer mon compte"
              sub="Action irréversible. Tes données personnelles seront anonymisées immédiatement (RGPD Article 17 - droit à l'oubli)."
            >
              <DeleteAccountButton />
            </Row>
          </Section>
        </div>
      </div>
    </div>
  );
}

function Section({ icon: Icon, title, sub, children, danger }: { icon: typeof Bell; title: string; sub?: string; children: React.ReactNode; danger?: boolean }) {
  return (
    <section className={`bg-white rounded-2xl border ${danger ? "border-red-200" : "border-ink-100"} overflow-hidden`}>
      <header className={`flex items-center gap-3 px-6 py-4 border-b ${danger ? "border-red-100 bg-red-50/30" : "border-ink-100 bg-ink-50/40"}`}>
        <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${danger ? "bg-red-100 text-red-600" : "bg-brand-50 text-brand-500"}`}>
          <Icon size={16} />
        </div>
        <div>
          <h2 className={`font-bold ${danger ? "text-red-700" : "text-ink-700"}`}>{title}</h2>
          {sub && <p className="text-xs text-ink-400 mt-0.5">{sub}</p>}
        </div>
      </header>
      <div className="divide-y divide-ink-100">
        {children}
      </div>
    </section>
  );
}

function Row({ label, sub, children }: { label: string; sub?: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-4 px-6 py-4">
      <div className="flex-1 min-w-0">
        <div className="font-semibold text-ink-700 text-sm">{label}</div>
        {sub && <div className="text-xs text-ink-400 mt-0.5">{sub}</div>}
      </div>
      <div className="flex-shrink-0">{children}</div>
    </div>
  );
}

function Toggle({ label, defaultChecked }: { label: string; defaultChecked?: boolean }) {
  return (
    <label className="flex items-center justify-between gap-4 px-6 py-3 cursor-pointer hover:bg-ink-50/40 transition">
      <span className="text-sm text-ink-700 font-medium">{label}</span>
      <div className="relative">
        <input type="checkbox" defaultChecked={defaultChecked} className="peer sr-only" />
        <div className="w-10 h-5.5 h-6 bg-ink-200 rounded-full peer-checked:bg-brand-500 transition" />
        <div className="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow peer-checked:translate-x-4 transition" />
      </div>
    </label>
  );
}
