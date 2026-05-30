"use client";

import { useActionState, useState } from "react";
import {
  User, Mail, Phone, MapPin, Building2, FileText, Camera,
  CheckCircle2, Save, ShieldCheck, AlertCircle, Lock,
} from "lucide-react";
import { updateProfileAction, type UpdateProfileState } from "@/lib/profile/actions";
import { PhotoUploader } from "./PhotoUploader";
import { GalleryManager } from "./GalleryManager";
import { ActiviteForm } from "./ActiviteForm";
import { ServicesForm } from "./ServicesForm";
import type { GalleryItem } from "@/lib/profile/gallery";
import type { ServiceRow } from "@/lib/profile/artisan";

const SECTIONS = [
  { id: "identite",  label: "Identité",          icon: User,      forArtisanOnly: false },
  { id: "metier",    label: "Activité",          icon: Building2, forArtisanOnly: true },
  { id: "services",  label: "Services & tarifs", icon: FileText,  forArtisanOnly: true },
  { id: "photos",    label: "Photos & galerie",  icon: Camera,    forArtisanOnly: false },
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
  };
  gallery: GalleryItem[];
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

      <Field
        name="city"
        label="Ville"
        icon={<MapPin size={15} />}
        placeholder="Meaux"
        defaultValue={initial.city}
        error={state?.fieldErrors?.city}
      />

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
