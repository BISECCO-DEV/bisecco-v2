"use client";

import { useActionState, useState } from "react";
import {
  Mail,
  Lock,
  User,
  Building2,
  Hash,
  Phone,
  MapPin,
  Eye,
  EyeOff,
  CheckCircle2,
} from "lucide-react";
import Link from "next/link";
import { signupAction } from "@/lib/auth/actions";
import { MultiMetierPicker, type MetierPick } from "@/components/ui/MultiMetierPicker";

type Role = "artisan" | "particulier";

const TRUST = [
  "Données chiffrées",
  "Sans engagement",
  "100 % gratuit",
];

export function SignupForm() {
  const [state, action, pending] = useActionState(signupAction, undefined);
  const [role, setRole] = useState<Role>("artisan");
  const [metiers, setMetiers] = useState<MetierPick[]>([]);
  const [showPwd, setShowPwd] = useState(false);
  const [showPwd2, setShowPwd2] = useState(false);

  const isArtisan = role === "artisan";

  return (
    <>
      {/* ─── Step indicator ─── */}
      <div className="flex items-center justify-center gap-2.5 text-[0.78rem] font-bold mb-5">
        <span className="flex items-center gap-1.5 text-brand-500">
          <span className="w-6 h-6 rounded-full bg-brand-500 text-white flex items-center justify-center text-[0.7rem] shadow-brand">
            1
          </span>
          Type de compte
        </span>
        <span className="text-ink-200">—</span>
        <span className="flex items-center gap-1.5 text-ink-300">
          <span className="w-6 h-6 rounded-full bg-ink-100 flex items-center justify-center text-[0.7rem]">2</span>
          Vos infos
        </span>
        <span className="text-ink-200">—</span>
        <span className="flex items-center gap-1.5 text-ink-300">
          <span className="w-6 h-6 rounded-full bg-ink-100 flex items-center justify-center text-[0.7rem]">3</span>
          Validation
        </span>
      </div>

      {/* ─── Tabs Pro/Particulier ─── */}
      <div className="grid grid-cols-2 gap-1.5 bg-ink-50 p-1.5 rounded-2xl mb-6 border border-ink-100">
        <button
          type="button"
          onClick={() => setRole("artisan")}
          className={`flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-bold transition ${
            isArtisan ? "bg-white text-ink-700 shadow-card" : "text-ink-400 hover:text-ink-600"
          }`}
        >
          <Building2 size={16} /> Professionnel
        </button>
        <button
          type="button"
          onClick={() => setRole("particulier")}
          className={`flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-bold transition ${
            !isArtisan ? "bg-white text-ink-700 shadow-card" : "text-ink-400 hover:text-ink-600"
          }`}
        >
          <User size={16} /> Particulier
        </button>
      </div>

      {/* Erreurs / succès */}
      {state?.error && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3 mb-4">
          ⚠ {state.error}
        </div>
      )}
      {state?.success && (
        <div className="bg-green-50 border border-green-200 text-green-700 text-sm rounded-xl px-4 py-3 mb-4">
          ✓ {state.success}
        </div>
      )}

      {/* ═══════════ FORMULAIRE ═══════════ */}
      <form action={action} className="space-y-4">
        <input type="hidden" name="role" value={role} />

        {/* ─── Section: VOTRE ENTREPRISE (artisan) ─── */}
        {isArtisan && (
          <>
            <SectionDivider title="VOTRE ENTREPRISE" />

            <div className="grid sm:grid-cols-2 gap-3">
              <Field
                label="Prénom & Nom du gérant"
                icon={<User size={15} />}
                name="full_name"
                placeholder="Jean Dupont"
                required
              />
              <Field
                label="Nom de la société"
                icon={<Building2 size={15} />}
                name="company_name"
                placeholder="Dupont Maçonnerie"
                required
              />
            </div>

            <div className="grid sm:grid-cols-2 gap-3">
              <div>
                <Field
                  label="Numéro SIREN"
                  icon={<Hash size={15} />}
                  name="siren"
                  placeholder="9 chiffres"
                  required
                  pattern="[0-9]{9}"
                  maxLength={9}
                />
                <p className="text-[0.74rem] text-ink-400 mt-1.5 pl-1">
                  Votre profil sera vérifié sous 24h.
                </p>
              </div>
              <div>
                <label className="block text-[0.78rem] font-bold text-ink-600 mb-1.5">
                  Métiers <span className="font-normal text-ink-300">(jusqu&apos;à 3)</span>
                </label>
                <MultiMetierPicker
                  value={metiers}
                  onChange={setMetiers}
                  max={3}
                  variant="light"
                />
                <input type="hidden" name="metiers_json" value={JSON.stringify(metiers)} />
                <p className="text-[0.7rem] text-ink-400 mt-1.5 pl-1">
                  Si votre métier n&apos;existe pas, tapez-le et il sera ajouté (validation admin sous 24h).
                </p>
              </div>
            </div>
          </>
        )}

        {/* ─── Section: PARTICULIER ─── */}
        {!isArtisan && (
          <>
            <SectionDivider title="VOS INFORMATIONS" />
            <div className="grid sm:grid-cols-2 gap-3">
              <Field label="Prénom" icon={<User size={15} />} name="first_name" placeholder="Jean" required />
              <Field label="Nom" icon={<User size={15} />} name="last_name" placeholder="Dupont" required />
            </div>
          </>
        )}

        {/* ─── Section: ACCÈS & CONTACT ─── */}
        <SectionDivider title="ACCÈS & CONTACT" />

        <div className="grid sm:grid-cols-2 gap-3">
          <Field
            label="Adresse email"
            icon={<Mail size={15} />}
            name="email"
            type="email"
            placeholder="bisecco.support@gmail.com"
            required
          />
          <Field
            label="Téléphone"
            hint="optionnel"
            icon={<Phone size={15} />}
            name="phone"
            type="tel"
            placeholder="06 00 00 00 00"
          />
        </div>

        <div className="grid sm:grid-cols-2 gap-3">
          <Field
            label="Code postal"
            icon={<MapPin size={15} />}
            name="postal_code"
            placeholder="75001"
            maxLength={5}
            pattern="[0-9]{5}"
          />
          <Field
            label="Ville"
            icon={<MapPin size={15} />}
            name="city"
            placeholder="Paris"
          />
        </div>

        <div className="grid sm:grid-cols-2 gap-3">
          <Field
            label="Mot de passe"
            icon={<Lock size={15} />}
            name="password"
            type={showPwd ? "text" : "password"}
            placeholder="••••••••"
            required
            minLength={8}
            trailing={
              <button
                type="button"
                onClick={() => setShowPwd(!showPwd)}
                className="text-ink-300 hover:text-ink-600"
              >
                {showPwd ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            }
          />
          <Field
            label="Confirmer le mot de passe"
            icon={<Lock size={15} />}
            name="password_confirmation"
            type={showPwd2 ? "text" : "password"}
            placeholder="Retapez votre mot de passe"
            required
            minLength={8}
            trailing={
              <button
                type="button"
                onClick={() => setShowPwd2(!showPwd2)}
                className="text-ink-300 hover:text-ink-600"
              >
                {showPwd2 ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            }
          />
        </div>

        {/* Checkbox dans un encadré gris */}
        <label className="flex items-start gap-3 p-4 rounded-xl bg-ink-50 border border-ink-100 cursor-pointer hover:bg-ink-100/50 transition">
          <input
            type="checkbox"
            name="accept_terms"
            required
            className="mt-0.5 w-4 h-4 accent-brand-500 cursor-pointer flex-shrink-0 rounded"
          />
          <span className="text-[0.85rem] text-ink-600 leading-[1.5]">
            J&apos;accepte les{" "}
            <Link href="/cgv" className="text-brand-500 font-bold hover:underline">
              conditions d&apos;utilisation
            </Link>{" "}
            et la{" "}
            <Link href="/politique-confidentialite" className="text-brand-500 font-bold hover:underline">
              politique de confidentialité
            </Link>{" "}
            de Bisecco.
          </span>
        </label>

        {/* Submit CTA (gros bouton orange) */}
        <button
          type="submit"
          disabled={pending}
          className="btn-primary w-full text-base py-4 disabled:opacity-50 mt-1"
        >
          {pending
            ? "Création…"
            : isArtisan
              ? "Créer mon profil professionnel →"
              : "Créer mon compte →"}
        </button>

        {/* Trust signals */}
        <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 pt-4 border-t border-ink-100">
          {TRUST.map((t) => (
            <span key={t} className="inline-flex items-center gap-1.5 text-[0.78rem] text-ink-500 font-semibold">
              <CheckCircle2 size={13} className="text-brand-500" /> {t}
            </span>
          ))}
        </div>
      </form>
    </>
  );
}

/* ═══════════ Sous-composants ═══════════ */

function SectionDivider({ title }: { title: string }) {
  return (
    <div className="flex items-center gap-3 pt-2">
      <div className="flex-1 h-px bg-ink-100" />
      <span className="text-[0.72rem] font-bold tracking-[0.12em] text-ink-400 uppercase">
        {title}
      </span>
      <div className="flex-1 h-px bg-ink-100" />
    </div>
  );
}

type FieldProps = {
  label: string;
  hint?: string;
  icon: React.ReactNode;
  name: string;
  type?: string;
  placeholder?: string;
  required?: boolean;
  pattern?: string;
  maxLength?: number;
  minLength?: number;
  trailing?: React.ReactNode;
};

function Field({
  label,
  hint,
  icon,
  trailing,
  ...inputProps
}: FieldProps) {
  return (
    <div>
      <label className="block text-[0.8rem] font-bold text-ink-600 mb-1.5">
        {label}{" "}
        {hint && <span className="font-normal text-ink-300">({hint})</span>}
      </label>
      <div className="flex items-center gap-2 px-3 border-2 border-ink-200 rounded-xl bg-ink-50/70 focus-within:border-brand-500 focus-within:bg-white transition">
        <span className="text-ink-300 flex-shrink-0">{icon}</span>
        <input
          {...inputProps}
          type={inputProps.type || "text"}
          className="flex-1 bg-transparent py-2.5 outline-none text-[0.9rem] text-ink-700 placeholder:text-ink-300"
        />
        {trailing}
      </div>
    </div>
  );
}
