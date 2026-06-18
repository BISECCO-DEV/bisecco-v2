"use client";

import { useActionState, useState } from "react";
import {
  User, Mail, Phone, MapPin, Building2, FileText, Camera,
  CheckCircle2, Save, ShieldCheck, AlertCircle, Lock, Sparkles, Clock,
} from "lucide-react";
import { updateProfileAction, type UpdateProfileState } from "@/lib/profile/actions";
import { PhotoUploader } from "./PhotoUploader";
import { GalleryManager } from "./GalleryManager";
import { PortfolioManager } from "./PortfolioManager";
import { AvailabilityEditor } from "./AvailabilityEditor";
import { ActiviteForm } from "./ActiviteForm";
import { ServicesForm } from "./ServicesForm";
import { AddressAutocomplete, type AddressSelection } from "@/components/ui/AddressAutocomplete";
import type { GalleryItem } from "@/lib/profile/gallery";
import type { PortfolioPair } from "@/lib/profile/portfolio";
import type { ServiceRow } from "@/lib/profile/artisan";
import type { AvailabilitySlot } from "@/lib/availability/utils";

const SECTIONS = [
  { id: "identite",     label: "Identité",          icon: User,      forArtisanOnly: false },
  { id: "metier",       label: "Activité",          icon: Building2, forArtisanOnly: true },
  { id: "services",     label: "Services & tarifs", icon: FileText,  forArtisanOnly: true },
  { id: "photos",       label: "Photos & galerie",  icon: Camera,    forArtisanOnly: false },
  { id: "portfolio",    label: "Avant / Après",     icon: Sparkles,  forArtisanOnly: true },
  { id: "availability", label: "Disponibilités",    icon: Clock,     forArtisanOnly: true },
] as const;

type Role = "admin" | "artisan" | "particulier";

type Props = {
  initial: {
    name: string;
    email: string;
    phone: string;
    city: string;
    description: string;
    siren: string | null;
    role: Role;
    profile_photo: string | null;
    cover_photo: string | null;
    street_address?: string | null;
    latitude?: number | null;
    longitude?: number | null;
    contact_via_email?: boolean;
    contact_via_phone?: boolean;
    public_contact_email?: string | null;
  };
  gallery: GalleryItem[];
  portfolio: PortfolioPair[];
  availability: AvailabilitySlot[];
  metiers: { id: number; name: string }[];
  artisanProfile: {
    metier_ids: number[];
    company_name: string;
    service_radius: number | null;
    availability: string;
  } | null;
  services: ServiceRow[];
};

export function EditProfileForm({
  initial,
  gallery,
  portfolio,
  availability,
  metiers,
  artisanProfile,
  services,
}: Props) {
  const [active, setActive] = useState<typeof SECTIONS[number]["id"]>("identite");
  const isArtisan = initial.role === "artisan";

  return (
    <div className="grid lg:grid-cols-[260px_1fr] gap-6 mt-8">
      {/* Sidebar navigation */}
      <aside className="bg-white rounded-2xl border border-ink-100 p-3 h-fit lg:sticky lg:top-24">
        <nav className="space-y-1">
          {SECTIONS.map((s) => {
            const locked = s.forArtisanOnly && !isArtisan;
            return (
              <button
                key={s.id}
                type="button"
                onClick={() => !locked && setActive(s.id)}
                disabled={locked}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition ${
                  active === s.id
                    ? "bg-brand-50 text-brand-700"
                    : "text-ink-600 hover:bg-ink-50"
                } ${locked ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                <s.icon size={16} className={active === s.id ? "text-brand-500" : "text-ink-400"} />
                <span className="flex-1 text-left">{s.label}</span>
                {locked && <Lock size={11} className="text-ink-400" />}
              </button>
            );
          })}
        </nav>
      </aside>

      {/* Content */}
      <main className="bg-white rounded-2xl border border-ink-100 p-8">
        {active === "identite" && <IdentiteForm initial={initial} />}

        {active === "metier" && isArtisan && (
          <ActiviteForm
            metiers={metiers}
            initial={{
              metier_ids: artisanProfile?.metier_ids ?? [],
              company_name: artisanProfile?.company_name ?? "",
              service_radius: artisanProfile?.service_radius ?? null,
              availability: artisanProfile?.availability ?? "",
            }}
          />
        )}

        {active === "services" && isArtisan && <ServicesForm initial={services} />}

        {active === "photos" && (
          <section className="space-y-8">
            <div>
              <h2 className="text-xl font-bold text-ink-700">Photos & galerie</h2>
              <p className="text-ink-400 text-sm mt-1">
                Avatar et bannière s&apos;enregistrent automatiquement. Galerie : jusqu&apos;à 3 photos.
              </p>
            </div>

            <div>
              <label className="block text-sm font-bold text-ink-600 mb-3">Photo de profil</label>
              <PhotoUploader variant="avatar" initialUrl={initial.profile_photo} />
            </div>

            <div>
              <label className="block text-sm font-bold text-ink-600 mb-3">Photo de couverture</label>
              <PhotoUploader variant="cover" initialUrl={initial.cover_photo} />
            </div>

            <div>
              <label className="block text-sm font-bold text-ink-600 mb-3">Galerie de réalisations</label>
              <GalleryManager initial={gallery} />
            </div>
          </section>
        )}

        {active === "portfolio" && isArtisan && (
          <section className="space-y-6">
            <div>
              <h2 className="text-xl font-bold text-ink-700 flex items-center gap-2">
                <Sparkles size={18} className="text-brand-500" /> Avant / Après
              </h2>
              <p className="text-ink-400 text-sm mt-1">
                Ajoute jusqu&apos;à 6 réalisations avec un comparateur visuel interactif.
                Affiché en grand sur ton profil public — c&apos;est ce qui convertit le plus.
              </p>
            </div>
            <PortfolioManager initial={portfolio} />
          </section>
        )}

        {active === "availability" && isArtisan && (
          <section className="space-y-6">
            <div>
              <h2 className="text-xl font-bold text-ink-700 flex items-center gap-2">
                <Clock size={18} className="text-brand-500" /> Disponibilités
              </h2>
              <p className="text-ink-400 text-sm mt-1">
                Affiche tes horaires d&apos;ouverture sur ton profil public.
                Les clients voient en direct si tu es disponible « maintenant ».
              </p>
            </div>
            <AvailabilityEditor initial={availability} />
          </section>
        )}
      </main>
    </div>
  );
}

// =====================================================================
// Onglet Identité (form propre, action server)
// =====================================================================

function IdentiteForm({ initial }: { initial: Props["initial"] }) {
  const [state, formAction, isPending] = useActionState<UpdateProfileState | undefined, FormData>(
    updateProfileAction,
    undefined,
  );

  const isArtisan = initial.role === "artisan";

  // Adresse géocodée (alimentée par AddressAutocomplete au moment du choix)
  const initialAddressLabel = [initial.street_address, initial.city].filter(Boolean).join(" ");
  const [address, setAddress] = useState<AddressSelection | null>(
    initial.latitude != null && initial.longitude != null
      ? {
          label: initialAddressLabel || initial.city,
          street: initial.street_address ?? undefined,
          postcode: "",
          city: initial.city,
          latitude: initial.latitude,
          longitude: initial.longitude,
        }
      : null,
  );

  return (
    <form action={formAction} className="space-y-5">
      <h2 className="text-xl font-bold text-ink-700">Identité</h2>

      <Field
        name="name"
        label="Nom complet"
        icon={<User size={15} />}
        placeholder="Jean Dupont"
        defaultValue={initial.name}
        error={state?.fieldErrors?.name}
        required
      />

      <div className="grid sm:grid-cols-2 gap-4">
        <Field
          label="Email"
          icon={<Mail size={15} />}
          type="email"
          defaultValue={initial.email}
          disabled
          hint="L'email se modifie depuis les paramètres de sécurité."
        />
        <Field
          name="phone"
          label="Téléphone"
          icon={<Phone size={15} />}
          type="tel"
          placeholder="06 00 00 00 00"
          defaultValue={initial.phone}
          error={state?.fieldErrors?.phone}
        />
      </div>

      {/* Adresse complète avec autocomplete + géocodage API Adresse data.gouv.fr */}
      <div>
        <AddressAutocomplete
          label="Adresse complète"
          placeholder="Tape ton adresse (ex : 15 Rue d'Antibes, Cannes)"
          initialValue={initialAddressLabel || initial.city}
          initialCoords={{
            latitude: initial.latitude ?? null,
            longitude: initial.longitude ?? null,
          }}
          allowCityOnly={!isArtisan}
          onSelect={(sel) => setAddress(sel)}
        />
        {/* Champs cachés pour la server action */}
        <input type="hidden" name="city" value={address?.city ?? initial.city} />
        <input type="hidden" name="street_address" value={address?.street ?? initial.street_address ?? ""} />
        <input type="hidden" name="latitude" value={address?.latitude ?? initial.latitude ?? ""} />
        <input type="hidden" name="longitude" value={address?.longitude ?? initial.longitude ?? ""} />
        {state?.fieldErrors?.city && (
          <p className="mt-1 text-xs text-red-600 flex items-center gap-1">
            <AlertCircle size={12} /> {state.fieldErrors.city}
          </p>
        )}
      </div>

      <div>
        <label className="block text-sm font-bold text-ink-600 mb-1.5">
          {initial.role === "artisan" ? "Description publique" : "À propos"}
        </label>
        <textarea
          name="description"
          rows={5}
          placeholder={initial.role === "artisan"
            ? "Présentez votre activité, votre expérience, vos spécialités…"
            : "Quelques mots sur vous (facultatif)."}
          defaultValue={initial.description}
          className="w-full px-4 py-3 rounded-xl bg-ink-50 border-2 border-ink-200 focus:border-brand-500 focus:bg-white outline-none transition text-sm resize-y"
        />
        {state?.fieldErrors?.description && (
          <p className="mt-1 text-xs text-red-600 flex items-center gap-1">
            <AlertCircle size={12} /> {state.fieldErrors.description}
          </p>
        )}
      </div>

      {initial.role === "artisan" && initial.siren && (
        <div className="flex items-center gap-3 p-4 rounded-xl bg-emerald-50/60 border border-emerald-200">
          <ShieldCheck size={18} className="text-emerald-600 flex-shrink-0" />
          <div className="flex-1">
            <div className="text-sm font-bold text-ink-700">SIREN vérifié : {initial.siren}</div>
            <div className="text-xs text-ink-500 mt-0.5">Pour modifier votre SIREN, contactez le support.</div>
          </div>
        </div>
      )}

      {/* ─── Préférences de contact (pros uniquement) ─────────────────── */}
      {initial.role === "artisan" && (
        <ContactPreferences initial={initial} />
      )}

      <div className="flex items-center justify-end gap-3 pt-4 border-t border-ink-100">
        {state?.ok && (
          <span className="inline-flex items-center gap-1.5 text-sm font-bold text-emerald-600">
            <CheckCircle2 size={14} /> Modifications enregistrées
          </span>
        )}
        {state?.error && !state.fieldErrors && (
          <span className="inline-flex items-center gap-1.5 text-sm font-bold text-red-600">
            <AlertCircle size={14} /> {state.error}
          </span>
        )}
        <button type="submit" disabled={isPending} className="btn-primary disabled:opacity-50">
          {isPending ? "Enregistrement…" : (<><Save size={16} /> Enregistrer</>)}
        </button>
      </div>
    </form>
  );
}

// =====================================================================
// Préférences de contact (pros uniquement)
// =====================================================================

function ContactPreferences({ initial }: { initial: Props["initial"] }) {
  const [emailEnabled, setEmailEnabled] = useState<boolean>(
    initial.contact_via_email !== false,
  );
  const [phoneEnabled, setPhoneEnabled] = useState<boolean>(
    initial.contact_via_phone === true,
  );
  const [showPublicEmail, setShowPublicEmail] = useState<boolean>(
    !!initial.public_contact_email,
  );

  const noneSelected = !emailEnabled && !phoneEnabled;

  return (
    <div className="rounded-2xl border-2 border-ink-100 bg-ink-50/40 p-5 space-y-4">
      <div>
        <h3 className="font-bold text-ink-700 flex items-center gap-2">
          <Mail size={15} className="text-brand-500" /> Préférences de contact
        </h3>
        <p className="text-xs text-ink-500 mt-1 leading-relaxed">
          Choisis comment les particuliers peuvent te joindre. Au moins une option doit rester active.
        </p>
      </div>

      <div className="space-y-2.5">
        {/* Toggle EMAIL */}
        <label className="flex items-start gap-3 p-3 rounded-xl bg-white border-2 border-ink-100 hover:border-brand-200 cursor-pointer transition">
          <input
            type="checkbox"
            name="contact_via_email"
            checked={emailEnabled}
            onChange={(e) => setEmailEnabled(e.target.checked)}
            className="mt-1 accent-brand-500 w-4 h-4 flex-shrink-0"
          />
          <div className="flex-1 min-w-0">
            <div className="font-bold text-sm text-ink-700 flex items-center gap-2">
              <Mail size={13} className="text-ink-400" /> Joignable par e-mail
            </div>
            <div className="text-xs text-ink-500 mt-0.5">
              Tu reçois les demandes via l&apos;adresse de ton compte ({initial.email}).
            </div>
          </div>
        </label>

        {emailEnabled && (
          <div className="ml-7 pl-3 border-l-2 border-ink-100">
            <button
              type="button"
              onClick={() => setShowPublicEmail((s) => !s)}
              className="text-xs font-bold text-brand-600 hover:underline mb-2"
            >
              {showPublicEmail ? "− Utiliser l'email du compte" : "+ Utiliser un autre email pour le public"}
            </button>
            {showPublicEmail && (
              <Field
                name="public_contact_email"
                label="E-mail public affiché sur ton profil"
                icon={<Mail size={13} />}
                type="email"
                placeholder="contact@mon-entreprise.fr"
                defaultValue={initial.public_contact_email ?? ""}
                hint="Cette adresse remplace celle de ton compte pour les contacts publics."
              />
            )}
          </div>
        )}

        {/* Toggle TELEPHONE */}
        <label className="flex items-start gap-3 p-3 rounded-xl bg-white border-2 border-ink-100 hover:border-brand-200 cursor-pointer transition">
          <input
            type="checkbox"
            name="contact_via_phone"
            checked={phoneEnabled}
            onChange={(e) => setPhoneEnabled(e.target.checked)}
            className="mt-1 accent-brand-500 w-4 h-4 flex-shrink-0"
          />
          <div className="flex-1 min-w-0">
            <div className="font-bold text-sm text-ink-700 flex items-center gap-2">
              <Phone size={13} className="text-ink-400" /> Joignable par téléphone
            </div>
            <div className="text-xs text-ink-500 mt-0.5">
              Ton numéro sera affiché publiquement sur ta fiche.
              {phoneEnabled && !initial.phone && (
                <span className="text-amber-700 font-bold block mt-1">
                  ⚠ Renseigne ton numéro de téléphone plus haut pour activer cette option.
                </span>
              )}
            </div>
          </div>
        </label>
      </div>

      {noneSelected && (
        <div className="text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2 flex items-start gap-2">
          <AlertCircle size={13} className="text-amber-500 flex-shrink-0 mt-0.5" />
          <span>
            Au moins une option doit rester active. Sans ça, personne ne pourra te contacter.
            <strong> L&apos;e-mail sera réactivé automatiquement à l&apos;enregistrement.</strong>
          </span>
        </div>
      )}
    </div>
  );
}

function Field({
  name, label, icon, type = "text", placeholder, defaultValue, maxLength,
  required, disabled, error, hint,
}: {
  name?: string;
  label: string;
  icon: React.ReactNode;
  type?: string;
  placeholder?: string;
  defaultValue?: string;
  maxLength?: number;
  required?: boolean;
  disabled?: boolean;
  error?: string;
  hint?: string;
}) {
  return (
    <div>
      <label className="block text-sm font-bold text-ink-600 mb-1.5">
        {label} {required && <span className="text-brand-500">*</span>}
      </label>
      <div className={`flex items-center gap-2 px-3 rounded-xl border-2 transition ${
        disabled
          ? "bg-ink-100/60 border-ink-200 opacity-70"
          : error
          ? "bg-red-50 border-red-300 focus-within:border-red-500"
          : "bg-ink-50 border-ink-200 focus-within:border-brand-500 focus-within:bg-white"
      }`}>
        <span className="text-ink-300 flex-shrink-0">{icon}</span>
        <input
          name={name}
          type={type}
          defaultValue={defaultValue}
          placeholder={placeholder}
          maxLength={maxLength}
          required={required}
          disabled={disabled}
          className="flex-1 bg-transparent py-2.5 outline-none text-sm text-ink-700 placeholder:text-ink-300 disabled:cursor-not-allowed"
        />
      </div>
      {error && (
        <p className="mt-1 text-xs text-red-600 flex items-center gap-1">
          <AlertCircle size={12} /> {error}
        </p>
      )}
      {hint && !error && <p className="mt-1 text-xs text-ink-400">{hint}</p>}
    </div>
  );
}
