"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  Plus, Trash2, ArrowUp, ArrowDown, Eye, EyeOff, Upload, Loader2, X, AlertCircle,
  Heading2, Heading3, Type, List, ListOrdered, Quote, Image as ImageIcon, Sparkles,
} from "lucide-react";

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

type BlockType = "p" | "h2" | "h3" | "ul" | "ol" | "quote" | "image";

type Block = {
  id: string;
  type: BlockType;
  /** Pour p/h2/h3/quote : le texte. Pour ul/ol : items joints par \n. Pour image : "URL|alt" */
  content: string;
};

type Props = {
  /** HTML initial à parser en blocs (pour l'édition d'un article existant) */
  initialHtml?: string;
  /** Nom du hidden input qui contient l'HTML final (à soumettre via formData) */
  name?: string;
};

let _idCounter = 0;
function nextId() {
  _idCounter++;
  return `b${_idCounter}_${Math.floor(Math.random() * 1000000)}`;
}

// ─────────────────────────────────────────────────────────────────────────────
// Markdown léger ↔ HTML (uniquement pour le contenu d'un bloc)
// ─────────────────────────────────────────────────────────────────────────────

function inlineMarkdownToHtml(text: string): string {
  // 1. Échappe les caractères HTML dangereux
  let r = text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  // 2. Bold : **texte**
  r = r.replace(/\*\*([^\n]+?)\*\*/g, "<strong>$1</strong>");
  // 3. Italic : *texte* (mais pas **)
  r = r.replace(/(^|[^*])\*([^*\n]+?)\*(?!\*)/g, "$1<em>$2</em>");
  // 4. Liens : [texte](url)
  r = r.replace(/\[([^\]]+?)\]\((https?:\/\/[^\s)]+)\)/g, '<a href="$2" target="_blank" rel="noopener nofollow">$1</a>');
  return r;
}

function htmlToInlineMarkdown(html: string): string {
  return html
    .replace(/<\/?(?:strong|b)>/gi, "**")
    .replace(/<\/?(?:em|i)>/gi, "*")
    .replace(/<a [^>]*href="([^"]+)"[^>]*>(.*?)<\/a>/gi, "[$2]($1)")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&amp;/g, "&")
    .replace(/&nbsp;/g, " ")
    .trim();
}

// ─────────────────────────────────────────────────────────────────────────────
// Blocks → HTML (output final)
// ─────────────────────────────────────────────────────────────────────────────

function blocksToHtml(blocks: Block[]): string {
  return blocks
    .map((b) => {
      const c = b.content.trim();
      if (!c && b.type !== "image") return "";
      switch (b.type) {
        case "p": return `<p>${inlineMarkdownToHtml(c)}</p>`;
        case "h2": return `<h2>${inlineMarkdownToHtml(c)}</h2>`;
        case "h3": return `<h3>${inlineMarkdownToHtml(c)}</h3>`;
        case "quote": return `<blockquote><p>${inlineMarkdownToHtml(c)}</p></blockquote>`;
        case "ul": {
          const items = c.split("\n").map((l) => l.trim()).filter(Boolean);
          if (!items.length) return "";
          return `<ul>${items.map((i) => `<li>${inlineMarkdownToHtml(i)}</li>`).join("")}</ul>`;
        }
        case "ol": {
          const items = c.split("\n").map((l) => l.trim()).filter(Boolean);
          if (!items.length) return "";
          return `<ol>${items.map((i) => `<li>${inlineMarkdownToHtml(i)}</li>`).join("")}</ol>`;
        }
        case "image": {
          const [url, alt = ""] = c.split("|");
          if (!url?.trim()) return "";
          return `<img src="${url.trim()}" alt="${alt.trim().replace(/"/g, "&quot;")}">`;
        }
      }
    })
    .filter(Boolean)
    .join("\n");
}

// ─────────────────────────────────────────────────────────────────────────────
// HTML → Blocks (pour parser un article existant)
// ─────────────────────────────────────────────────────────────────────────────

function htmlToBlocks(html: string): Block[] {
  if (!html?.trim()) return [{ id: nextId(), type: "p", content: "" }];

  const blocks: Block[] = [];
  const tagRegex = /<(h2|h3|p|ul|ol|blockquote|img)([^>]*)>([\s\S]*?)<\/\1>|<img([^>]*)\/?>/gi;
  let m: RegExpExecArray | null;

  while ((m = tagRegex.exec(html)) !== null) {
    const tag = (m[1] ?? "img").toLowerCase();
    const attrs = m[2] ?? m[4] ?? "";
    const content = m[3] ?? "";

    if (tag === "img") {
      const src = /src="([^"]+)"/i.exec(attrs)?.[1] ?? "";
      const alt = /alt="([^"]*)"/i.exec(attrs)?.[1] ?? "";
      if (src) blocks.push({ id: nextId(), type: "image", content: `${src}|${alt}` });
      continue;
    }
    if (tag === "h2" || tag === "h3" || tag === "p") {
      blocks.push({ id: nextId(), type: tag, content: htmlToInlineMarkdown(content) });
      continue;
    }
    if (tag === "ul" || tag === "ol") {
      const items = [...content.matchAll(/<li[^>]*>([\s\S]*?)<\/li>/gi)].map((mm) =>
        htmlToInlineMarkdown(mm[1].trim()),
      );
      blocks.push({ id: nextId(), type: tag, content: items.join("\n") });
      continue;
    }
    if (tag === "blockquote") {
      const text = content.replace(/<\/?p[^>]*>/gi, "").trim();
      blocks.push({ id: nextId(), type: "quote", content: htmlToInlineMarkdown(text) });
      continue;
    }
  }

  return blocks.length > 0 ? blocks : [{ id: nextId(), type: "p", content: "" }];
}

// ─────────────────────────────────────────────────────────────────────────────
// Composant principal
// ─────────────────────────────────────────────────────────────────────────────

const BLOCK_TYPES: { type: BlockType; label: string; icon: typeof Type; description: string }[] = [
  { type: "p",     label: "Paragraphe",         icon: Type,        description: "Texte normal" },
  { type: "h2",    label: "Titre (H2)",         icon: Heading2,    description: "Grand titre de section" },
  { type: "h3",    label: "Sous-titre (H3)",    icon: Heading3,    description: "Sous-section" },
  { type: "ul",    label: "Liste à puces",      icon: List,        description: "Une ligne = un point" },
  { type: "ol",    label: "Liste numérotée",    icon: ListOrdered, description: "1, 2, 3..." },
  { type: "quote", label: "Citation",           icon: Quote,       description: "Encadré mis en valeur" },
  { type: "image", label: "Image",              icon: ImageIcon,   description: "Photo via URL" },
];

const BLOCK_LABELS: Record<BlockType, string> = Object.fromEntries(
  BLOCK_TYPES.map((b) => [b.type, b.label]),
) as Record<BlockType, string>;

export function BlockEditor({ initialHtml = "", name = "content_html" }: Props) {
  const [blocks, setBlocks] = useState<Block[]>(() => htmlToBlocks(initialHtml));
  const [showPreview, setShowPreview] = useState(false);
  const [adderIndex, setAdderIndex] = useState<number | null>(null);

  // HTML généré (mis dans le hidden input pour soumission form)
  const generatedHtml = useMemo(() => blocksToHtml(blocks), [blocks]);

  const updateBlock = (id: string, content: string) => {
    setBlocks((bs) => bs.map((b) => (b.id === id ? { ...b, content } : b)));
  };

  const removeBlock = (id: string) => {
    if (blocks.length <= 1) {
      setBlocks([{ id: nextId(), type: "p", content: "" }]);
      return;
    }
    setBlocks((bs) => bs.filter((b) => b.id !== id));
  };

  const moveBlock = (id: string, dir: -1 | 1) => {
    setBlocks((bs) => {
      const idx = bs.findIndex((b) => b.id === id);
      if (idx < 0) return bs;
      const newIdx = idx + dir;
      if (newIdx < 0 || newIdx >= bs.length) return bs;
      const copy = [...bs];
      [copy[idx], copy[newIdx]] = [copy[newIdx]!, copy[idx]!];
      return copy;
    });
  };

  const insertBlock = (index: number, type: BlockType) => {
    setBlocks((bs) => {
      const copy = [...bs];
      copy.splice(index, 0, { id: nextId(), type, content: "" });
      return copy;
    });
    setAdderIndex(null);
  };

  return (
    <div className="space-y-3">
      {/* Hidden input pour la soumission du form */}
      <input type="hidden" name={name} value={generatedHtml} readOnly />

      {/* Astuce raccourcis */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl px-4 py-3 text-xs text-blue-800 flex items-start gap-2">
        <Sparkles size={14} className="flex-shrink-0 mt-0.5" />
        <div>
          <strong>Astuces de formatage</strong> dans n&apos;importe quel bloc :
          <code className="ml-2 px-1.5 py-0.5 rounded bg-white border border-blue-300 text-[0.7rem]">**gras**</code>
          <code className="ml-1 px-1.5 py-0.5 rounded bg-white border border-blue-300 text-[0.7rem]">*italique*</code>
          <code className="ml-1 px-1.5 py-0.5 rounded bg-white border border-blue-300 text-[0.7rem]">[lien](https://...)</code>
        </div>
      </div>

      {/* Toggle preview */}
      <div className="flex items-center justify-between">
        <span className="text-sm font-bold text-ink-600">
          {blocks.length} bloc{blocks.length > 1 ? "s" : ""}
        </span>
        <button
          type="button"
          onClick={() => setShowPreview((p) => !p)}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-ink-50 hover:bg-ink-100 text-xs font-bold text-ink-700 transition"
        >
          {showPreview ? <EyeOff size={12} /> : <Eye size={12} />}
          {showPreview ? "Masquer aperçu" : "Voir aperçu"}
        </button>
      </div>

      {/* Bouton "Ajouter en début" */}
      <BlockAdder
        open={adderIndex === 0}
        onToggle={() => setAdderIndex(adderIndex === 0 ? null : 0)}
        onPick={(t) => insertBlock(0, t)}
      />

      {/* Blocs */}
      {blocks.map((block, i) => (
        <div key={block.id}>
          <BlockEditorItem
            block={block}
            isFirst={i === 0}
            isLast={i === blocks.length - 1}
            onUpdate={(c) => updateBlock(block.id, c)}
            onRemove={() => removeBlock(block.id)}
            onMoveUp={() => moveBlock(block.id, -1)}
            onMoveDown={() => moveBlock(block.id, 1)}
          />

          {/* Adder entre 2 blocs */}
          <BlockAdder
            open={adderIndex === i + 1}
            onToggle={() => setAdderIndex(adderIndex === i + 1 ? null : i + 1)}
            onPick={(t) => insertBlock(i + 1, t)}
          />
        </div>
      ))}

      {/* Preview */}
      {showPreview && (
        <div className="bg-white border-2 border-brand-200 rounded-2xl p-6 mt-4">
          <div className="text-[0.65rem] text-brand-600 font-bold uppercase tracking-wider mb-3">
            Aperçu rendu
          </div>
          <div
            className="prose max-w-none [&_h2]:text-xl [&_h2]:font-bold [&_h2]:text-ink-700 [&_h2]:mt-6 [&_h2]:mb-2 [&_h3]:text-lg [&_h3]:font-bold [&_h3]:text-ink-700 [&_h3]:mt-4 [&_h3]:mb-2 [&_p]:text-ink-600 [&_p]:my-3 [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:my-3 [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:my-3 [&_li]:my-1 [&_strong]:font-bold [&_em]:italic [&_a]:text-brand-600 [&_a]:underline [&_blockquote]:border-l-4 [&_blockquote]:border-brand-500 [&_blockquote]:bg-brand-50/40 [&_blockquote]:px-4 [&_blockquote]:py-2 [&_blockquote]:my-3 [&_blockquote]:italic [&_img]:rounded-xl [&_img]:my-4 [&_img]:max-w-full"
            dangerouslySetInnerHTML={{ __html: generatedHtml || "<p class='text-ink-400 italic'>Rien à afficher pour l'instant…</p>" }}
          />
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Sous-composants
// ─────────────────────────────────────────────────────────────────────────────

function BlockEditorItem({
  block,
  isFirst,
  isLast,
  onUpdate,
  onRemove,
  onMoveUp,
  onMoveDown,
}: {
  block: Block;
  isFirst: boolean;
  isLast: boolean;
  onUpdate: (content: string) => void;
  onRemove: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
}) {
  return (
    <div className="group bg-white border-2 border-ink-100 hover:border-ink-200 rounded-xl p-3 transition">
      {/* Toolbar */}
      <div className="flex items-center justify-between mb-2 gap-2">
        <span className="text-[0.65rem] font-bold uppercase tracking-wider text-ink-400">
          {BLOCK_LABELS[block.type]}
        </span>
        <div className="flex items-center gap-0.5 opacity-50 group-hover:opacity-100 transition">
          <button
            type="button"
            disabled={isFirst}
            onClick={onMoveUp}
            className="p-1 rounded hover:bg-ink-100 disabled:opacity-30 disabled:cursor-not-allowed"
            title="Monter"
          >
            <ArrowUp size={12} />
          </button>
          <button
            type="button"
            disabled={isLast}
            onClick={onMoveDown}
            className="p-1 rounded hover:bg-ink-100 disabled:opacity-30 disabled:cursor-not-allowed"
            title="Descendre"
          >
            <ArrowDown size={12} />
          </button>
          <button
            type="button"
            onClick={onRemove}
            className="p-1 rounded hover:bg-red-50 text-red-500"
            title="Supprimer ce bloc"
          >
            <Trash2 size={12} />
          </button>
        </div>
      </div>

      {/* Editor body selon le type */}
      <BlockBody block={block} onUpdate={onUpdate} />
    </div>
  );
}

function BlockBody({ block, onUpdate }: { block: Block; onUpdate: (c: string) => void }) {
  const baseInputCls = "w-full px-3 py-2 rounded-lg bg-ink-50 border border-ink-200 focus:border-brand-500 focus:bg-white outline-none transition";

  if (block.type === "image") {
    return <ImageBlockBody block={block} onUpdate={onUpdate} baseInputCls={baseInputCls} />;
  }

  if (block.type === "ul" || block.type === "ol") {
    return (
      <textarea
        rows={Math.max(3, block.content.split("\n").length + 1)}
        value={block.content}
        onChange={(e) => onUpdate(e.target.value)}
        placeholder={"Premier item de la liste\nDeuxième item\nTroisième item..."}
        className={`${baseInputCls} text-sm resize-y leading-relaxed`}
      />
    );
  }

  if (block.type === "h2" || block.type === "h3") {
    return (
      <input
        type="text"
        value={block.content}
        onChange={(e) => onUpdate(e.target.value)}
        placeholder={block.type === "h2" ? "Titre de section" : "Sous-titre"}
        className={`${baseInputCls} ${block.type === "h2" ? "text-lg font-extrabold" : "text-base font-bold"} text-ink-700`}
      />
    );
  }

  if (block.type === "quote") {
    return (
      <textarea
        rows={Math.max(2, Math.ceil(block.content.length / 80))}
        value={block.content}
        onChange={(e) => onUpdate(e.target.value)}
        placeholder="Citation ou astuce mise en valeur..."
        className={`${baseInputCls} text-sm italic resize-y border-l-4 border-l-brand-500 pl-4`}
      />
    );
  }

  // Paragraphe par défaut
  return (
    <textarea
      rows={Math.max(3, Math.ceil(block.content.length / 100))}
      value={block.content}
      onChange={(e) => onUpdate(e.target.value)}
      placeholder="Écris ton paragraphe ici. Tu peux utiliser **gras**, *italique*, [lien](url)..."
      className={`${baseInputCls} text-sm resize-y leading-relaxed`}
    />
  );
}

function ImageBlockBody({
  block,
  onUpdate,
  baseInputCls,
}: {
  block: Block;
  onUpdate: (c: string) => void;
  baseInputCls: string;
}) {
  const [url = "", alt = ""] = block.content.split("|");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateUrl = (newUrl: string) => onUpdate(`${newUrl}|${alt}`);
  const updateAlt = (newAlt: string) => onUpdate(`${url}|${newAlt}`);

  const handleFile = async (file: File) => {
    setUploading(true);
    setError(null);
    try {
      const form = new FormData();
      form.append("file", file);
      const res = await fetch("/api/admin/blog/upload-image", { method: "POST", body: form });
      const data = await res.json();
      if (!data.ok) {
        setError(data.error ?? "Erreur upload");
        return;
      }
      updateUrl(data.url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur upload");
    } finally {
      setUploading(false);
    }
  };

  const triggerPicker = () => {
    if (uploading) return;
    fileInputRef.current?.click();
  };

  const removeImage = () => {
    updateUrl("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // ─── Pas encore d'image : afficher le bouton upload ──────────
  if (!url) {
    return (
      <div className="space-y-2">
        <button
          type="button"
          onClick={triggerPicker}
          disabled={uploading}
          className="w-full flex flex-col items-center justify-center gap-2 p-8 rounded-xl border-2 border-dashed border-ink-300 hover:border-brand-400 hover:bg-brand-50/30 text-ink-500 hover:text-brand-600 transition cursor-pointer disabled:opacity-50 disabled:cursor-wait"
        >
          {uploading ? (
            <>
              <Loader2 size={24} className="animate-spin" />
              <span className="text-sm font-bold">Téléversement…</span>
            </>
          ) : (
            <>
              <Upload size={24} />
              <span className="text-sm font-bold">Choisir une image</span>
              <span className="text-xs text-ink-400">JPG, PNG ou WebP · 5 MB max</span>
            </>
          )}
        </button>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/avif"
          className="hidden"
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) handleFile(f);
            e.target.value = "";
          }}
        />

        {error && (
          <div className="flex items-start gap-2 text-xs text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
            <AlertCircle size={12} className="flex-shrink-0 mt-0.5" /> {error}
          </div>
        )}
      </div>
    );
  }

  // ─── Image uploadée : preview + alt + bouton changer ──────────
  return (
    <div className="space-y-2">
      <div className="relative group rounded-xl overflow-hidden border-2 border-ink-200">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={url} alt={alt} className="w-full max-h-72 object-cover" />

        {/* Overlay actions */}
        <div className="absolute top-2 right-2 flex gap-1.5 opacity-0 group-hover:opacity-100 transition">
          <button
            type="button"
            onClick={triggerPicker}
            disabled={uploading}
            className="px-3 py-1.5 rounded-lg bg-white/95 backdrop-blur-sm border border-ink-200 text-xs font-bold text-ink-700 hover:bg-brand-50 hover:text-brand-700 transition shadow-md"
          >
            {uploading ? <Loader2 size={12} className="animate-spin" /> : "Changer"}
          </button>
          <button
            type="button"
            onClick={removeImage}
            className="p-1.5 rounded-lg bg-white/95 backdrop-blur-sm border border-red-200 text-red-600 hover:bg-red-50 transition shadow-md"
            title="Supprimer l'image"
          >
            <X size={12} />
          </button>
        </div>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/avif"
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) handleFile(f);
          e.target.value = "";
        }}
      />

      <div>
        <label className="block text-[0.65rem] font-bold text-ink-500 uppercase tracking-wider mb-1">
          Description SEO (alt text)
        </label>
        <input
          type="text"
          value={alt}
          onChange={(e) => updateAlt(e.target.value)}
          placeholder="Ex: Plombier au travail sur une canalisation"
          className={`${baseInputCls} text-sm`}
        />
      </div>

      {error && (
        <div className="flex items-start gap-2 text-xs text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
          <AlertCircle size={12} className="flex-shrink-0 mt-0.5" /> {error}
        </div>
      )}
    </div>
  );
}

function BlockAdder({
  open,
  onToggle,
  onPick,
}: {
  open: boolean;
  onToggle: () => void;
  onPick: (type: BlockType) => void;
}) {
  return (
    <div className="relative">
      {/* Petit séparateur cliquable */}
      <div className="flex items-center gap-3 my-2">
        <div className="flex-1 h-px bg-ink-100" />
        <button
          type="button"
          onClick={onToggle}
          className={`inline-flex items-center gap-1 px-3 py-1 rounded-full border text-[0.7rem] font-bold transition ${
            open
              ? "bg-brand-500 text-white border-brand-500"
              : "bg-white text-ink-500 border-ink-200 hover:border-brand-300 hover:text-brand-600"
          }`}
        >
          <Plus size={11} />
          {open ? "Choisir un type" : "Ajouter un bloc"}
        </button>
        <div className="flex-1 h-px bg-ink-100" />
      </div>

      {/* Menu de choix */}
      {open && (
        <div className="bg-white border-2 border-brand-200 rounded-xl p-3 grid grid-cols-2 sm:grid-cols-4 gap-2 shadow-lg">
          {BLOCK_TYPES.map((bt) => (
            <button
              key={bt.type}
              type="button"
              onClick={() => onPick(bt.type)}
              className="flex flex-col items-start gap-1 p-3 rounded-lg border border-ink-200 hover:border-brand-400 hover:bg-brand-50 text-left transition"
            >
              <bt.icon size={16} className="text-brand-500" />
              <span className="text-xs font-bold text-ink-700">{bt.label}</span>
              <span className="text-[0.65rem] text-ink-400 leading-tight">{bt.description}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
