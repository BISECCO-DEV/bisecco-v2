"use client";

import { useState, useTransition, useRef, useMemo, useEffect, useActionState } from "react";
import { useRouter } from "next/navigation";
import {
  Image as ImageIcon, X, Loader2, Hammer, HelpCircle, Lightbulb, MapPin,
  ShieldCheck, ChevronDown, Briefcase, Tag, Globe, Users, Lock,
} from "lucide-react";
import { createFeedPostAction, type FeedKind } from "@/lib/feed/actions";
import { uploadFeedImageAction } from "@/lib/feed/upload";
import type { MetierOption } from "@/lib/metiers";
import { feedImagePublicUrl } from "./image-url";
import { FeedComposerLinkDetector } from "./FeedComposerLinkDetector";
import type { LinkPreview } from "./LinkPreviewCard";
import { EmojiPickerButton } from "./EmojiPickerButton";

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
  color: string;
  roles: ("admin" | "artisan" | "particulier")[];
};

const KIND_CHOICES: KindChoice[] = [
  { value: "realisation", label: "Réalisation", icon: Hammer, color: "text-brand-600", roles: ["artisan", "admin"] },
  { value: "conseil", label: "Conseil métier", icon: Lightbulb, color: "text-violet-600", roles: ["artisan", "admin"] },
  { value: "question", label: "Question travaux", icon: HelpCircle, color: "text-blue-600", roles: ["particulier", "artisan", "admin"] },
];

const PLACEHOLDERS: Record<FeedKind, string> = {
  realisation: "Décrivez votre réalisation — type de chantier, matériaux, défis, résultat…",
  conseil: "Partagez votre conseil métier — astuce, piège à éviter, bonne pratique…",
  question: "Posez votre question travaux ou décrivez votre projet…",
};

/**
 * Composer LinkedIn-style — carte unique centrée, header avatar + role,
 * grand textarea, toolbar bas (photo / emoji / lien / métier / lieu),
 * footer sticky avec Annuler + Publier.
 */
export function FeedComposer({ userRole, userDisplayName, userAvatar, metierOptions, metiers, initialKind }: Props) {
  const router = useRouter();
  const [state, formAction] = useActionState(createFeedPostAction, undefined);
  const [pending, startTransition] = useTransition();

  // Au succès : reset le formulaire et refresh le fil (les nouveaux posts
  // apparaissent via Realtime / router.refresh, pas besoin de navigation)
  useEffect(() => {
    if (!state?.ok) return;
    setContent("");
    setImages([]);
    setCity("");
    setMetierId("");
    setLinkPreview(null);
    router.refresh();
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
  const [linkPreview, setLinkPreview] = useState<LinkPreview | null>(null);
  const [uploadErr, setUploadErr] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  // Toolbar dropdowns
  const [kindOpen, setKindOpen] = useState(false);
  const [metierOpen, setMetierOpen] = useState(false);
  const [cityOpen, setCityOpen] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const kindRef = useRef<HTMLDivElement>(null);
  const metierRef = useRef<HTMLDivElement>(null);
  const cityRef = useRef<HTMLDivElement>(null);

  // Fermeture des dropdowns au clic dehors
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const target = e.target as Node;
      if (kindRef.current && !kindRef.current.contains(target)) setKindOpen(false);
      if (metierRef.current && !metierRef.current.contains(target)) setMetierOpen(false);
      if (cityRef.current && !cityRef.current.contains(target)) setCityOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

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

  const selectedMetier = metierId ? metiers.find((m) => m.id === Number(metierId)) : null;
  const selectedKind = KIND_CHOICES.find((k) => k.value === kind)!;
  const KindIcon = selectedKind.icon;

  const insertEmoji = (emoji: string) => {
    const el = textareaRef.current;
    if (!el) {
      setContent((c) => c + emoji);
      return;
    }
    const start = el.selectionStart ?? content.length;
    const end = el.selectionEnd ?? content.length;
    setContent(content.slice(0, start) + emoji + content.slice(end));
    requestAnimationFrame(() => {
      el.focus();
      const pos = start + emoji.length;
      el.setSelectionRange(pos, pos);
    });
  };

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
      if (res.ok) setImages((prev) => [...prev, res.path]);
      else {
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
    if (linkPreview) {
      fd.set("link_url", linkPreview.url);
      if (linkPreview.title) fd.set("link_title", linkPreview.title);
      if (linkPreview.description) fd.set("link_description", linkPreview.description);
      if (linkPreview.image) fd.set("link_image", linkPreview.image);
      if (linkPreview.siteName) fd.set("link_site_name", linkPreview.siteName);
    }
    startTransition(() => formAction(fd));
  };

  const avatarUrl =
    userAvatar ??
    `https://api.dicebear.com/9.x/initials/svg?seed=${encodeURIComponent(userDisplayName)}`;

  const canPublish = content.length >= 10 && !uploading;

  return (
    <form
      onSubmit={onSubmit}
      className="bg-white rounded-3xl border border-ink-100 shadow-[0_4px_24px_-4px_rgba(13,30,74,0.08)] overflow-hidden"
    >
      {/* ═══ HEADER : Avatar + nom + rôle + visibilité ═══ */}
      <header className="px-5 sm:px-6 py-4 flex items-center gap-3">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={avatarUrl}
          alt=""
          className="w-12 h-12 rounded-full object-cover bg-ink-100 ring-2 ring-white shadow-sm flex-shrink-0"
        />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="font-extrabold text-ink-700 text-[0.95rem] truncate">
              {userDisplayName}
            </span>
            {isArtisan && (
              <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[0.6rem] font-bold tracking-wider uppercase">
                <ShieldCheck size={9} strokeWidth={3} /> Pro
              </span>
            )}
          </div>
          <div className="flex items-center gap-1.5 text-[0.74rem] text-ink-400 mt-0.5">
            <Globe size={11} />
            <span>Visible par tous les membres Bisecco</span>
          </div>
        </div>

        {/* Sélecteur de type (compact dropdown) */}
        {availableKinds.length > 1 && (
          <div ref={kindRef} className="relative">
            <button
              type="button"
              onClick={() => setKindOpen((o) => !o)}
              className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border-2 transition text-[0.78rem] font-bold ${
                kindOpen
                  ? "border-brand-500 bg-brand-50"
                  : "border-ink-200 hover:border-ink-300 hover:bg-ink-50/50"
              }`}
            >
              <KindIcon size={13} className={selectedKind.color} />
              <span className="hidden sm:inline">{selectedKind.label}</span>
              <ChevronDown size={12} className={`transition-transform ${kindOpen ? "rotate-180" : ""}`} />
            </button>
            {kindOpen && (
              <div className="absolute right-0 top-full mt-1.5 w-56 rounded-xl bg-white shadow-2xl border border-ink-100 overflow-hidden z-30 animate-in fade-in slide-in-from-top-1 duration-150">
                {availableKinds.map((c) => {
                  const Icon = c.icon;
                  return (
                    <button
                      key={c.value}
                      type="button"
                      onClick={() => {
                        setKind(c.value);
                        setKindOpen(false);
                      }}
                      className={`w-full flex items-center gap-2.5 px-3 py-2.5 text-left text-sm font-semibold hover:bg-ink-50 transition ${
                        c.value === kind ? "bg-brand-50/60 text-brand-700" : "text-ink-700"
                      }`}
                    >
                      <Icon size={14} className={c.color} />
                      {c.label}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </header>

      <input type="hidden" name="kind" value={kind} />

      {/* ═══ TEXTAREA — gros, sans bordure, focus discret ═══ */}
      <div className="px-5 sm:px-6 pb-3">
        <textarea
          ref={textareaRef}
          name="content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
          minLength={10}
          maxLength={4000}
          rows={5}
          placeholder={PLACEHOLDERS[kind]}
          className="w-full text-[1.05rem] text-ink-800 leading-[1.6] placeholder:text-ink-300 outline-none resize-none border-0 bg-transparent min-h-[120px]"
        />

        {/* Aperçu de lien live (Open Graph) */}
        <FeedComposerLinkDetector content={content} onChange={setLinkPreview} />

        {/* Strip images */}
        {images.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2">
            {images.map((path, i) => (
              <div key={path} className="relative w-20 h-20 rounded-xl overflow-hidden border border-ink-200 group">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={feedImagePublicUrl(path)} alt="" className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={() => removeImage(i)}
                  className="absolute top-1 right-1 w-6 h-6 rounded-full bg-ink-900/85 text-white inline-flex items-center justify-center hover:bg-red-500 transition shadow-sm"
                  aria-label="Retirer"
                >
                  <X size={11} />
                </button>
              </div>
            ))}
          </div>
        )}
        {uploadErr && (
          <p className="mt-2 text-xs text-red-600 font-semibold">⚠ {uploadErr}</p>
        )}

        {/* Tags actifs (métier + ville) */}
        {(selectedMetier || city) && (
          <div className="mt-3 flex flex-wrap gap-2">
            {selectedMetier && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-brand-50 text-brand-700 text-xs font-bold">
                <Tag size={11} />
                {selectedMetier.name}
                <button
                  type="button"
                  onClick={() => setMetierId("")}
                  className="ml-1 hover:bg-brand-200 rounded-full w-4 h-4 inline-flex items-center justify-center transition"
                  aria-label="Retirer métier"
                >
                  <X size={9} />
                </button>
              </span>
            )}
            {city && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-blue-50 text-blue-700 text-xs font-bold">
                <MapPin size={11} />
                {city}
                <button
                  type="button"
                  onClick={() => setCity("")}
                  className="ml-1 hover:bg-blue-200 rounded-full w-4 h-4 inline-flex items-center justify-center transition"
                  aria-label="Retirer ville"
                >
                  <X size={9} />
                </button>
              </span>
            )}
          </div>
        )}

        {/* Erreur globale */}
        {state && state.ok === false && (
          <div className="mt-3 bg-red-50 border border-red-200 text-red-700 px-4 py-2.5 rounded-xl text-sm font-semibold">
            ⚠ {state.error}
          </div>
        )}
      </div>

      <input type="hidden" name="city" value={city} />

      {/* ═══ TOOLBAR : Photo · Emoji · Métier · Ville ═══ */}
      <div className="px-3 sm:px-4 py-2.5 border-t border-ink-100/60 flex items-center gap-0.5 flex-wrap">
        {/* Photo */}
        <label
          className={`inline-flex items-center gap-1.5 px-2.5 py-2 rounded-lg text-[0.78rem] font-semibold cursor-pointer transition ${
            uploading || images.length >= 4
              ? "text-ink-300 cursor-not-allowed"
              : "text-ink-500 hover:bg-ink-50 hover:text-emerald-600"
          }`}
        >
          {uploading ? (
            <Loader2 size={16} className="animate-spin" />
          ) : (
            <ImageIcon size={16} />
          )}
          <span className="hidden sm:inline">Photo</span>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/avif"
            multiple
            className="hidden"
            onChange={(e) => handleFiles(e.target.files)}
            disabled={uploading || images.length >= 4}
          />
        </label>

        {/* Emoji */}
        <div className="inline-flex">
          <EmojiPickerButton onSelect={insertEmoji} />
        </div>

        {/* Métier */}
        <div ref={metierRef} className="relative">
          <button
            type="button"
            onClick={() => {
              setMetierOpen((o) => !o);
              setCityOpen(false);
            }}
            className={`inline-flex items-center gap-1.5 px-2.5 py-2 rounded-lg text-[0.78rem] font-semibold transition ${
              metierOpen || selectedMetier
                ? "text-brand-600 bg-brand-50"
                : "text-ink-500 hover:bg-ink-50 hover:text-brand-600"
            }`}
          >
            <Tag size={16} />
            <span className="hidden sm:inline">Métier</span>
          </button>
          {metierOpen && (
            <div className="absolute left-0 bottom-full mb-2 w-72 max-h-80 overflow-y-auto rounded-xl bg-white shadow-2xl border border-ink-100 z-30 animate-in fade-in slide-in-from-bottom-1 duration-150">
              <div className="sticky top-0 bg-white border-b border-ink-100 px-3 py-2 text-[0.7rem] font-bold text-ink-500 uppercase tracking-wider">
                Choisir un métier
              </div>
              <button
                type="button"
                onClick={() => {
                  setMetierId("");
                  setMetierOpen(false);
                }}
                className="w-full px-3 py-2 text-left text-sm text-ink-500 hover:bg-ink-50 transition italic"
              >
                — Aucun métier —
              </button>
              {metiersByCategory.map(({ cat, list }) => (
                <div key={cat}>
                  <div className="px-3 py-1.5 text-[0.65rem] font-extrabold text-ink-400 uppercase tracking-wider bg-ink-50">
                    {cat}
                  </div>
                  {list.map((m) => {
                    const dbMetier = metiers.find((x) => x.name === m.name);
                    if (!dbMetier) return null;
                    return (
                      <button
                        key={dbMetier.id}
                        type="button"
                        onClick={() => {
                          setMetierId(String(dbMetier.id));
                          setMetierOpen(false);
                        }}
                        className={`w-full flex items-center gap-2 px-3 py-2 text-left text-sm font-medium hover:bg-brand-50 transition ${
                          metierId === String(dbMetier.id) ? "bg-brand-50 text-brand-700" : "text-ink-700"
                        }`}
                      >
                        <span>{m.icon}</span>
                        {m.name}
                      </button>
                    );
                  })}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Ville */}
        <div ref={cityRef} className="relative">
          <button
            type="button"
            onClick={() => {
              setCityOpen((o) => !o);
              setMetierOpen(false);
            }}
            className={`inline-flex items-center gap-1.5 px-2.5 py-2 rounded-lg text-[0.78rem] font-semibold transition ${
              cityOpen || city
                ? "text-blue-600 bg-blue-50"
                : "text-ink-500 hover:bg-ink-50 hover:text-blue-600"
            }`}
          >
            <MapPin size={16} />
            <span className="hidden sm:inline">Lieu</span>
          </button>
          {cityOpen && (
            <div className="absolute left-0 bottom-full mb-2 w-64 rounded-xl bg-white shadow-2xl border border-ink-100 p-3 z-30 animate-in fade-in slide-in-from-bottom-1 duration-150">
              <label className="block text-[0.7rem] font-bold text-ink-500 mb-1.5 uppercase tracking-wider">
                Ville concernée
              </label>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="Meaux, Cannes…"
                autoFocus
                className="w-full px-3 py-2 rounded-lg border-2 border-ink-200 focus:border-blue-500 outline-none text-sm"
              />
              <button
                type="button"
                onClick={() => setCityOpen(false)}
                className="mt-2 w-full py-1.5 rounded-lg bg-blue-500 hover:bg-blue-600 text-white text-xs font-bold transition"
              >
                Valider
              </button>
            </div>
          )}
        </div>

        {/* Compteur à droite */}
        <span className={`ml-auto text-xs font-medium tabular-nums ${
          content.length > 4000 ? "text-red-500" : content.length >= 10 ? "text-emerald-600" : "text-ink-400"
        }`}>
          {content.length} / 4000
        </span>
      </div>

      {/* ═══ FOOTER STICKY : Annuler + Publier ═══ */}
      <div className="px-5 sm:px-6 py-3.5 border-t border-ink-100 bg-ink-50/30 flex items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 text-[0.7rem] text-ink-400 font-semibold">
          <Lock size={11} />
          <span className="hidden sm:inline">Vous pouvez modifier ou supprimer après publication.</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => router.push("/fil")}
            className="px-4 py-2.5 rounded-xl text-sm font-bold text-ink-600 hover:bg-ink-100 transition"
          >
            Annuler
          </button>
          <button
            type="submit"
            disabled={pending || !canPublish}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-brand-500 hover:bg-brand-600 disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold text-sm transition shadow-[0_6px_18px_-4px_rgba(240,122,47,0.5)]"
          >
            {pending && <Loader2 size={14} className="animate-spin" />}
            Publier
          </button>
        </div>
      </div>
    </form>
  );
}
