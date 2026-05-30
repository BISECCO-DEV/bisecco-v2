"use client";

import { useRef, useState, useTransition } from "react";
import Image from "next/image";
import { Plus, X, Loader2, AlertCircle } from "lucide-react";
import {
  addGalleryImageAction,
  removeGalleryImageAction,
  type GalleryItem,
} from "@/lib/profile/gallery";

const MAX = 3;

export function GalleryManager({ initial }: { initial: GalleryItem[] }) {
  const [items, setItems] = useState<GalleryItem[]>(initial);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const inputRef = useRef<HTMLInputElement>(null);

  const onAddFiles = (files: FileList) => {
    setError(null);
    const remaining = MAX - items.length;
    const toUpload = Array.from(files).slice(0, remaining);

    startTransition(async () => {
      for (const file of toUpload) {
        const fd = new FormData();
        fd.append("file", file);
        const result = await addGalleryImageAction(undefined, fd);
        if (result.error) {
          setError(result.error);
          break;
        }
      }
      // Force un refetch via reload simple · sinon il faut re-récupérer la liste
      window.location.reload();
    });
  };

  const onRemove = (id: number) => {
    setError(null);
    startTransition(async () => {
      const fd = new FormData();
      fd.append("id", String(id));
      const result = await removeGalleryImageAction(undefined, fd);
      if (result.ok) {
        setItems((prev) => prev.filter((it) => it.id !== id));
      } else if (result.error) {
        setError(result.error);
      }
    });
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs text-ink-400">
          {items.length} / {MAX} photos
        </span>
        {pending && (
          <span className="inline-flex items-center gap-1.5 text-xs text-brand-500 font-bold">
            <Loader2 size={12} className="animate-spin" /> En cours…
          </span>
        )}
      </div>

      <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
        {items.map((it) => (
          <div
            key={it.id}
            className="relative aspect-square rounded-xl overflow-hidden border-2 border-ink-100 group"
          >
            <Image
              src={it.url}
              alt={it.caption ?? ""}
              fill
              sizes="200px"
              className="object-cover"
              unoptimized
            />
            <button
              type="button"
              onClick={() => onRemove(it.id)}
              disabled={pending}
              className="absolute top-2 right-2 w-8 h-8 rounded-full bg-red-500 text-white flex items-center justify-center shadow-lg opacity-100 sm:opacity-90 hover:opacity-100 hover:scale-105 transition disabled:opacity-50"
              aria-label="Supprimer"
            >
              <X size={14} />
            </button>
          </div>
        ))}

        {items.length < MAX && (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={pending}
            className="aspect-square rounded-xl border-2 border-dashed border-ink-200 hover:border-brand-500 hover:bg-brand-50/30 flex flex-col items-center justify-center cursor-pointer transition group disabled:opacity-50"
          >
            <Plus size={24} className="text-ink-300 group-hover:text-brand-500 mb-1" />
            <span className="text-xs font-bold text-ink-500">Ajouter</span>
          </button>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        multiple
        accept="image/jpeg,image/png,image/webp,image/avif"
        className="hidden"
        onChange={(e) => {
          if (e.target.files && e.target.files.length > 0) onAddFiles(e.target.files);
          e.target.value = "";
        }}
      />

      {error && (
        <p className="mt-3 text-xs font-bold text-red-600 flex items-center gap-1">
          <AlertCircle size={12} /> {error}
        </p>
      )}
    </div>
  );
}
