"use client";

import { useState, useTransition, useRef, useMemo, useEffect, useActionState } from "react";
import { useRouter } from "next/navigation";
import {
  Image as ImageIcon, X, Loader2, Hammer, HelpCircle, Lightbulb, MapPin,
  ShieldCheck, User as UserIcon, Briefcase, ChevronDown, Tag, Type, AlignLeft,
} from "lucide-react";
import { createFeedPostAction, type FeedKind } from "@/lib/feed/actions";
import { uploadFeedImageAction } from "@/lib/feed/upload";
import type { MetierOption } from "@/lib/metiers";
import { feedImagePublicUrl } from "./image-url";
import { FeedComposerPreview } from "./FeedComposerPreview";

type Metier = { id: number; name: string; slug: string };

type Props = {
  userRole: "admin" | "artisan" | "particulier";
  userDisplayName: string;
  userAvatar: string | null;
  metierOptions: MetierOption[];
  metiers: Metier[];
  initialKind?: FeedKind;
};

type KindChoice = {
  value: FeedKind;
  label: string;
  icon: typeof Hammer;
  forArtisan: string;
  forParticulier: string;
  roles: ("admin" | "artisan" | "particulier")[];
};

const KIND_CHOICES: KindChoice[] = [
  {
    value: "realisation",
    label: "Réalisation",
    icon: Hammer,
    forArtisan: "Partagez un chantier terminé, un avant/après",
    forParticulier: "Réservé aux artisans",
    roles: ["artisan", "admin"],
  },
  {
    value: "conseil",
    label: "Conseil métier",
    icon: Lightbulb,
    forArtisan: "Une astuce, un piège à éviter, une bonne pratique",
    forParticulier: "Réservé aux artisans",
    roles: ["artisan", "admin"],
  },
  {
    value: "question",
    label: "Question travaux",
    icon: HelpCircle,
    forArtisan: "Posez une question technique à la communauté",
    forParticulier: "Demandez un avis avant un projet de travaux",
    roles: ["particulier", "artisan", "admin"],
  },
];

const PLACEHOLDERS_ARTISAN: Record<FeedKind, string> = {
  realisation:
    "Décrivez votre réalisation · type de chantier, matériaux utilisés, durée, défis surmontés, résultat final…",
  conseil:
    "Partagez votre conseil métier · une erreur fréquente à éviter, une astuce, une bonne pratique pour les particuliers…",
  question:
    "Posez votre question technique · contexte du chantier, problème rencontré, ce que vous avez déjà essayé…",
};

const PLACEHOLDERS_PARTICULIER: Record<FeedKind, string> = {
  realisation: "",
  conseil: "",
  question:
    "Décrivez votre projet ou votre question · type de travaux envisagés, votre situation actuelle, contraintes, délais…",
};

export function FeedComposer({ userRole, userDisplayName, userAvatar, metierOptions, metiers, initialKind }: Props) {
  const router = useRouter();
  const [state, formAction] = useActionState(createFeedPostAction, undefined);
  const [pending, startTransition] = useTransition();

  // Redirige proprement APRÈS le render (pas pendant) quand la soumission réussit.
  useEffect(() => {
    if (state?.ok) router.push("/fil?published=1");
  }, [state, router]);

  const isArtisan = userRole === "artisan" || userRole === "admin";
  const availableKinds = KIND_CHOICES.filter((k) => k.roles.includes(userRole));
  const defaultKind =
    initialKind && availableKinds.some((k) => k.value === initialKind)
      ? initialKind
      : (availableKinds[0]?.value ?? "question");

  const [kind, setKind] = useState<FeedKind>(defaultKind);
  const [content, setContent] = useState("");
  const [city, setCity] = useState("");
  const [metierId, setMetierId] = useState<string>("");
  const [images, setImages] = useState<string[]>([]);
  const [uploadErr, setUploadErr] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Métiers groupés par catégorie pour le <select>
  const metiersByCategory = useMemo(() => {
    const map = new Map<string, MetierOption[]>();
    for (const m of metierOptions) {
      if (!map.has(m.category)) map.set(m.category, []);
      map.get(m.category)!.push(m);
    }
    return Array.from(map.entries())
      .map(([cat, list]) => ({ cat, list: list.sort((a, b) => a.name.localeCompare(b.name, "fr")) }))
      .sort((a, b) => a.cat.localeCompare(b.cat, "fr"));
  }, [metierOptions]);

  const handleFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setUploadErr(null);
    const remaining = 4 - images.length;
    const toUpload = Array.from(files).slice(0, remaining);
    setUploading(true);
    for (const file of toUpload) {
      const fd = new FormData();
      fd.append("file", file);
      const res = await uploadFeedImageAction(fd);
      if (res.ok) {
        setImages((prev) => [...prev, res.path]);
      } else {
        setUploadErr(res.error);
        break;
      }
    }
    setUploading(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const removeImage = (idx: number) => {
    setImages((prev) => prev.filter((_, i) => i !== idx));
  };

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    fd.set("images", JSON.stringify(images));
    if (metierId) fd.set("metier_id", metierId);
    startTransition(() => formAction(fd));
  };

  const placeholder = isArtisan ? PLACEHOLDERS_ARTISAN[kind] : PLACEHOLDERS_PARTICULIER[kind];
  const counter = `${content.length} / 4000`;

  // Pour la preview : nom du métier sélectionné + icône
  const selectedMetier = metierId ? metiers.find((m) => m.id === Number(metierId)) : null;
  const selectedMetierOption = selectedMetier
    ? metierOptions.find((o) => o.name === selectedMetier.name)
    : null;

  const avatarUrl =
    userAvatar ??
    `https://api.dicebear.com/9.x/initials/svg?seed=${encodeURIComponent(userDisplayName)}`;

  return (
    <div className="grid lg:grid-cols-[1fr_400px] gap-6 items-start">
      {/* ═══════ FORM ═══════ */}
      <form onSubmit={onSubmit} className="bg-white rounded-2xl border border-ink-100 shadow-[0_1px_2px_rgba(13,30,74,0.04)] overflow-hidden">

        {/* Bandeau identité posteur (header) */}
        <div className={`px-5 sm:px-6 py-4 border-b ${
          isArtisan
            ? "bg-gradient-to-r from-brand-50 to-brand-50/40 border-brand-100"
            : "bg-gradient-to-r from-blue-50 to-blue-50/40 border-blue-100"
        }`}>
          <div className="flex items-center gap-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={avatarUrl}
              alt=""
              className="w-11 h-11 rounded-full object-cover bg-white ring-2 ring-white shadow-sm flex-shrink-0"
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="font-extrabold text-ink-700 text-[0.95rem] truncate">
                  {userDisplayName}
                </span>
                {isArtisan && (
                  <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-emerald-100 text-emerald-700 text-[0.62rem] font-bold tracking-wider uppercase">
                    <ShieldCheck size={9} strokeWidth={3} /> Pro
                  </span>
                )}
              </div>
              <p className={`text-[0.75rem] mt-0.5 font-semibold ${isArtisan ? "text-brand-700" : "text-blue-700"}`}>
                <span className="inline-flex items-center gap-1">
                  {isArtisan ? <Briefcase size={11} /> : <UserIcon size={11} />}
                  Publie en tant qu&apos;{isArtisan ? "artisan" : "particulier"}
                </span>
              </p>
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="p-5 sm:p-6 space-y-6">

          {/* ─── Section : Type de publication ─── */}
          <section>
            <SectionLabel icon={Tag} label="Type de publication" />
            <div className={`grid gap-2 ${availableKinds.length === 1 ? "" : "sm:grid-cols-3"}`}>
              {availableKinds.map((c) => {
                const Icon = c.icon;
                const active = kind === c.value;
                const desc = isArtisan ? c.forArtisan : c.forParticulier;
                return (
                  <button
                    key={c.value}
                    type="button"
                    onClick={() => setKind(c.value)}
                    className={`relative p-3 rounded-xl border-2 text-left transition group ${
                      active
                        ? "border-brand-500 bg-brand-50/60 shadow-[0_4px_12px_-4px_rgba(240,122,47,0.25)]"
                        : "border-ink-100 hover:border-ink-300 hover:bg-ink-50/40"
                    }`}
                  >
                    {active && (
                      <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-brand-500" />
                    )}
                    <Icon size={18} className={active ? "text-brand-500" : "text-ink-400"} />
                    <div className={`mt-1.5 font-bold text-sm ${active ? "text-brand-700" : "text-ink-700"}`}>
                      {c.label}
                    </div>
                    <div className="text-[0.7rem] text-ink-500 mt-0.5 leading-snug">{desc}</div>
                  </button>
                );
              })}
            </div>
            <input type="hidden" name="kind" value={kind} />
          </section>

          {/* ─── Section : Message ─── */}
          <section>
            <div className="flex items-center justify-between mb-2.5">
              <SectionLabel icon={AlignLeft} label="Votre message" inline />
              <span className={`text-xs font-medium tabular-nums ${content.length > 4000 ? "text-red-500" : content.length >= 10 ? "text-emerald-600" : "text-ink-400"}`}>
                {counter}
              </span>
            </div>
            <textarea
              name="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
              minLength={10}
              maxLength={4000}
              rows={7}
              placeholder={placeholder}
              className="w-full px-4 py-3.5 rounded-xl border-2 border-ink-200 focus:border-brand-500 focus:ring-4 focus:ring-brand-100 outline-none text-[0.92rem] resize-none placeholder:text-ink-300 leading-relaxed transition"
            />
            {content.length > 0 && content.length < 10 && (
              <p className="text-xs text-amber-600 mt-1.5 font-semibold">
                ⚠ {10 - content.length} caractère{10 - content.length > 1 ? "s" : ""} de plus pour publier.
              </p>
            )}
          </section>

          {/* ─── Section : Métier + Ville (contexte) ─── */}
          <section>
            <SectionLabel icon={Type} label="Contexte (optionnel)" sub="Aide les autres membres à trouver votre post." />
            <div className="grid sm:grid-cols-2 gap-3">
              {/* Métier dropdown */}
              <div>
                <label className="block text-[0.75rem] font-bold text-ink-600 mb-1.5">Métier concerné</label>
                <div className="relative">
                  <select
                    value={metierId}
                    onChange={(e) => setMetierId(e.target.value)}
                    className="w-full appearance-none pl-3 pr-10 py-3 rounded-xl border-2 border-ink-200 focus:border-brand-500 outline-none text-sm bg-white text-ink-700 cursor-pointer hover:border-ink-300 transition"
                  >
                    <option value="">— Choisir un métier —</option>
                    {metiersByCategory.map(({ cat, list }) => (
                      <optgroup key={cat} label={cat}>
                        {list.map((m) => {
                          const dbMetier = metiers.find((x) => x.name === m.name);
                          if (!dbMetier) return null;
                          return (
                            <option key={dbMetier.id} value={dbMetier.id}>
                              {m.icon} {m.name}
                            </option>
                          );
                        })}
                      </optgroup>
                    ))}
                  </select>
                  <ChevronDown
                    size={16}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-400 pointer-events-none"
                  />
                </div>
              </div>

              {/* Ville */}
              <div>
                <label className="block text-[0.75rem] font-bold text-ink-600 mb-1.5">Ville</label>
                <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl border-2 border-ink-200 focus-within:border-brand-500 bg-white hover:border-ink-300 transition">
                  <MapPin size={15} className="text-ink-400" />
                  <input
                    type="text"
                    name="city"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="Meaux, Cannes…"
                    className="flex-1 bg-transparent outline-none text-sm text-ink-700 placeholder:text-ink-300 py-0.5"
                  />
                </div>
              </div>
            </div>
          </section>

          {/* ─── Section : Photos ─── */}
          <section>
            <SectionLabel
              icon={ImageIcon}
              label={`Photos (${images.length}/4)`}
              sub="Optionnel · 4 photos max, 5 Mo chacune."
            />
            <div className="flex flex-wrap gap-3">
              {images.map((path, i) => (
                <div key={path} className="relative w-24 h-24 rounded-xl overflow-hidden border border-ink-200 group">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={feedImagePublicUrl(path)} alt="" className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => removeImage(i)}
                    className="absolute top-1 right-1 w-6 h-6 rounded-full bg-ink-900/85 text-white inline-flex items-center justify-center hover:bg-red-500 transition shadow-sm"
                    aria-label="Retirer"
                  >
                    <X size={12} />
                  </button>
                </div>
              ))}
              {images.length < 4 && (
                <label className="w-24 h-24 rounded-xl border-2 border-dashed border-ink-200 hover:border-brand-400 hover:bg-brand-50/30 flex flex-col items-center justify-center cursor-pointer text-ink-400 hover:text-brand-500 transition">
                  {uploading ? (
                    <Loader2 size={20} className="animate-spin" />
                  ) : (
                    <>
                      <ImageIcon size={20} />
                      <span className="text-[0.65rem] font-bold mt-1">Ajouter</span>
                    </>
                  )}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/jpeg,image/png,image/webp,image/avif"
                    multiple
                    className="hidden"
                    onChange={(e) => handleFiles(e.target.files)}
                    disabled={uploading}
                  />
                </label>
              )}
            </div>
            {uploadErr && (
              <p className="text-xs text-red-600 mt-2 font-semibold">⚠ {uploadErr}</p>
            )}
          </section>

          {/* Erreur globale */}
          {state && state.ok === false && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm font-semibold">
              ⚠ {state.error}
            </div>
          )}

          {/* Règles communauté */}
          <div className="bg-ink-50 border border-ink-100 rounded-xl px-4 py-3 text-xs text-ink-600 leading-relaxed">
            En publiant, vous acceptez les <strong className="text-ink-700">règles de la communauté</strong> :
            contenu lié aux travaux ou à l&apos;artisanat, respect des autres membres, pas de publicité.
            Notre équipe peut retirer tout post qui ne respecte pas ces règles.
          </div>
        </div>

        {/* Footer sticky avec Submit */}
        <div className="sticky bottom-0 bg-white border-t border-ink-100 px-5 sm:px-6 py-4 flex items-center justify-between gap-2">
          <button
            type="button"
            onClick={() => router.push("/fil")}
            className="px-4 py-2.5 rounded-xl text-sm font-semibold text-ink-600 hover:bg-ink-100 transition"
          >
            Annuler
          </button>
          <button
            type="submit"
            disabled={pending || content.length < 10 || uploading}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-brand-500 hover:bg-brand-600 disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold text-sm transition shadow-[0_8px_24px_-6px_rgba(240,122,47,0.55)] hover:shadow-[0_12px_28px_-6px_rgba(240,122,47,0.7)]"
          >
            {pending && <Loader2 size={14} className="animate-spin" />}
            Publier maintenant
          </button>
        </div>
      </form>

      {/* ═══════ APERÇU LIVE (desktop only) ═══════ */}
      <aside className="hidden lg:block sticky top-24">
        <FeedComposerPreview
          displayName={userDisplayName}
          avatarUrl={avatarUrl}
          role={userRole}
          kind={kind}
          content={content}
          city={city}
          metierName={selectedMetier?.name ?? null}
          metierIcon={selectedMetierOption?.icon ?? null}
          images={images}
        />
      </aside>
    </div>
  );
}

/** Titre de section avec icône brand. */
function SectionLabel({
  icon: Icon, label, sub, inline,
}: {
  icon: typeof Tag;
  label: string;
  sub?: string;
  inline?: boolean;
}) {
  return (
    <div className={inline ? "flex items-center gap-2" : "mb-3"}>
      <div className="flex items-center gap-2">
        <span className="inline-flex items-center justify-center w-6 h-6 rounded-md bg-brand-50 text-brand-600">
          <Icon size={13} strokeWidth={2.4} />
        </span>
        <span className="text-sm font-extrabold text-ink-700">{label}</span>
      </div>
      {sub && !inline && (
        <p className="text-[0.72rem] text-ink-500 mt-1 ml-8">{sub}</p>
      )}
    </div>
  );
}
