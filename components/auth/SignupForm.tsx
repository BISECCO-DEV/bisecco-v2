"use client";

import { useActionState, useEffect, useRef, useState } from "react";
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
  Loader2,
  AlertCircle,
} from "lucide-react";
import Link from "next/link";
import { signupAction } from "@/lib/auth/actions";
import { lookupSirenAction } from "@/lib/siren/actions";
import { MultiMetierPicker, type MetierPick } from "@/components/ui/MultiMetierPicker";
import { CtaButton } from "@/components/ui/CtaButton";

type Role = "artisan" | "particulier";

const TRUST = [
  "Données chiffrées",
  "Sans engagement",
  "100 % gratuit",
];

type SirenStatus =
  | { state: "idle" }
  | { state: "checking" }
  | { state: "found"; companyName: string; city: string | null }
  | { state: "not_found" }
  | { state: "closed" }
  | { state: "invalid" };

type SignupFormProps = {
  /** Mode contrôlé : si fourni, le rôle est piloté de l'extérieur */
  role?: Role;
  onRoleChange?: (role: Role) => void;
};

export function SignupForm({ role: roleProp, onRoleChange }: SignupFormProps = {}) {
  const [state, action, pending] = useActionState(signupAction, undefined);
  const [roleInternal, setRoleInternal] = useState<Role>("artisan");
  const role = roleProp ?? roleInternal;
  const setRole = (r: Role) => {
    if (onRoleChange) onRoleChange(r);
    else setRoleInternal(r);
  };
  const [metiers, setMetiers] = useState<MetierPick[]>([]);
  // (showPwd / showPwd2 sont gérés en interne par PasswordField pour éviter
  // les re-render de tout le form à chaque toggle de l'œil)

  // SIREN lookup auto · pré-remplit company_name + city
  const [siren, setSiren] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [city, setCity] = useState("");
  const [sirenStatus, setSirenStatus] = useState<SirenStatus>({ state: "idle" });
  const sirenLookupRef = useRef<AbortController | null>(null);

  const isArtisan = role === "artisan";

  // Debounce SIREN lookup : 600ms après dernière frappe, si 9 chiffres
  useEffect(() => {
    const cleaned = siren.replace(/\s/g, "");
    if (cleaned.length === 0) {
      setSirenStatus({ state: "idle" });
      return;
    }
    if (cleaned.length < 9) return;
    if (!/^\d{9}$/.test(cleaned)) {
      setSirenStatus({ state: "invalid" });
      return;
    }

    setSirenStatus({ state: "checking" });

    // Abort previous in-flight lookup
    sirenLookupRef.current?.abort();
    const ctrl = new AbortController();
    sirenLookupRef.current = ctrl;

    const timer = setTimeout(async () => {
      try {
        const res = await lookupSirenAction(cleaned);
        if (ctrl.signal.aborted) return;
        if (res.ok) {
          setSirenStatus({ state: "found", companyName: res.companyName, city: res.city });
          // Auto-fill ONLY si vide (ne pas écraser ce que l'utilisateur a déjà tapé)
          setCompanyName((prev) => (prev.trim() === "" ? res.companyName : prev));
          if (res.city) setCity((prev) => (prev.trim() === "" ? res.city! : prev));
        } else {
          setSirenStatus({
            state: res.error === "closed" ? "closed" : res.error === "invalid" ? "invalid" : "not_found",
          });
        }
      } catch {
        if (!ctrl.signal.aborted) setSirenStatus({ state: "not_found" });
      }
    }, 600);

    return () => {
      clearTimeout(timer);
      ctrl.abort();
    };
  }, [siren]);

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
        <span className="text-ink-200">·</span>
        <span className="flex items-center gap-1.5 text-ink-300">
          <span className="w-6 h-6 rounded-full bg-ink-100 flex items-center justify-center text-[0.7rem]">2</span>
          Vos infos
        </span>
        <span className="text-ink-200">·</span>
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
                hint={sirenStatus.state === "found" ? "auto-rempli" : undefined}
                icon={<Building2 size={15} />}
                name="company_name"
                placeholder="Renseigné via le SIREN"
                required
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
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
                  value={siren}
                  onChange={(e) => setSiren(e.target.value.replace(/[^0-9]/g, ""))}
                  trailing={
                    sirenStatus.state === "checking" ? (
                      <Loader2 size={16} className="text-ink-400 animate-spin" />
                    ) : sirenStatus.state === "found" ? (
                      <CheckCircle2 size={16} className="text-emerald-500" />
                    ) : sirenStatus.state === "not_found" || sirenStatus.state === "closed" || sirenStatus.state === "invalid" ? (
                      <AlertCircle size={16} className="text-red-500" />
                    ) : null
                  }
                />
                {/* Feedback dynamique */}
                {sirenStatus.state === "found" && (
                  <p className="text-[0.74rem] text-emerald-600 mt-1.5 pl-1 flex items-center gap-1.5">
                    <CheckCircle2 size={11} />
                    <span className="font-semibold">{sirenStatus.companyName}</span>
                    {sirenStatus.city && <span className="text-ink-400">· {sirenStatus.city}</span>}
                  </p>
                )}
                {sirenStatus.state === "not_found" && (
                  <p className="text-[0.74rem] text-red-600 mt-1.5 pl-1">
                    Aucune entreprise trouvée avec ce SIREN.
                  </p>
                )}
                {sirenStatus.state === "closed" && (
                  <p className="text-[0.74rem] text-red-600 mt-1.5 pl-1">
                    Cette entreprise est référencée mais cessée.
                  </p>
                )}
                {sirenStatus.state === "invalid" && (
                  <p className="text-[0.74rem] text-red-600 mt-1.5 pl-1">
                    SIREN invalide (9 chiffres requis).
                  </p>
                )}
                {sirenStatus.state === "idle" && (
                  <p className="text-[0.74rem] text-ink-400 mt-1.5 pl-1">
                    Le nom de la société se remplit automatiquement.
                  </p>
                )}
                {sirenStatus.state === "checking" && (
                  <p className="text-[0.74rem] text-ink-500 mt-1.5 pl-1">
                    Recherche en cours…
                  </p>
                )}
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
            placeholder="vous@exemple.fr"
            required
          />
          <Field
            label="Téléphone"
            icon={<Phone size={15} />}
            name="phone"
            type="tel"
            placeholder="06 00 00 00 00"
            required
            pattern="[0-9 +().\\-]{8,}"
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
            hint={isArtisan && sirenStatus.state === "found" && sirenStatus.city ? "auto-rempli" : undefined}
            icon={<MapPin size={15} />}
            name="city"
            placeholder="Paris"
            value={city}
            onChange={(e) => setCity(e.target.value)}
          />
        </div>

        <div className="grid sm:grid-cols-2 gap-3">
          <PasswordField
            label="Mot de passe"
            name="password"
            placeholder="8 caractères minimum"
          />
          <PasswordField
            label="Confirmer le mot de passe"
            name="password_confirmation"
            placeholder="Retapez votre mot de passe"
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
            <Link href="/cgu" className="text-brand-500 font-bold hover:underline">
              conditions d&apos;utilisation
            </Link>{" "}
            et la{" "}
            <Link href="/politique-confidentialite" className="text-brand-500 font-bold hover:underline">
              politique de confidentialité
            </Link>{" "}
            de Bisecco.
          </span>
        </label>

        {/* Submit CTA (style ihos asymétrique) */}
        <div className="mt-1 flex">
          <CtaButton type="submit" variant="primary" size="lg" disabled={pending} className="w-full justify-between">
            {pending
              ? "Création…"
              : isArtisan
                ? "Créer mon profil professionnel"
                : "Créer mon compte"}
          </CtaButton>
        </div>

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
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
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

/**
 * Champ mot de passe auto-contenu : le toggle œil ne fait re-render que ce composant,
 * pas tout le SignupForm. Évite le bug du value perdu / focus perdu.
 */
function PasswordField({
  label,
  name,
  placeholder,
}: {
  label: string;
  name: string;
  placeholder?: string;
}) {
  const [show, setShow] = useState(false);
  return (
    <div>
      <label className="block text-[0.8rem] font-bold text-ink-600 mb-1.5">{label}</label>
      <div className="flex items-center gap-2 pl-3 pr-1 border-2 border-ink-200 rounded-xl bg-ink-50/70 focus-within:border-brand-500 focus-within:bg-white transition">
        <Lock size={15} className="text-ink-300 flex-shrink-0" />
        <input
          name={name}
          type={show ? "text" : "password"}
          placeholder={placeholder}
          required
          minLength={8}
          autoComplete="new-password"
          className="flex-1 min-w-0 bg-transparent py-2.5 outline-none text-[0.9rem] text-ink-700 placeholder:text-ink-300"
        />
        <button
          type="button"
          onClick={() => setShow((s) => !s)}
          className="flex-shrink-0 inline-flex items-center justify-center w-9 h-9 rounded-lg text-ink-500 hover:text-brand-500 hover:bg-brand-50 transition"
          aria-label={show ? "Masquer le mot de passe" : "Afficher le mot de passe"}
          tabIndex={-1}
        >
          {show ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      </div>
    </div>
  );
}
