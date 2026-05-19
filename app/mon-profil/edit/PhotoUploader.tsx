"use client";

import { useRef, useState, useTransition } from "react";
import Image from "next/image";
import { Upload, CheckCircle2, AlertCircle, Loader2, User as UserIcon } from "lucide-react";
import { uploadAvatarAction, uploadCoverAction, type UploadPhotoState } from "@/lib/profile/actions";

type Variant = "avatar" | "cover";

type Props = {
  variant: Variant;
  initialUrl: string | null;
};

export function PhotoUploader({ variant, initialUrl }: Props) {
  const [currentUrl, setCurrentUrl] = useState<string | null>(initialUrl);
  const [state, setState] = useState<UploadPhotoState | undefined>(undefined);
  const [pending, startTransition] = useTransition();
  const inputRef = useRef<HTMLInputElement>(null);

  const isAvatar = variant === "avatar";

  const onFile = (file: File) => {
    const fd = new FormData();
    fd.append("file", file);
    startTransition(async () => {
      const result = isAvatar
        ? await uploadAvatarAction(undefined, fd)
        : await uploadCoverAction(undefined, fd);
      setState(result);
      if (result.ok && result.url) setCurrentUrl(result.url);
    });
  };

  const onClick = () => inputRef.current?.click();

  if (isAvatar) {
    return (
      <div className="flex items-center gap-4">
        <div className="relative w-24 h-24 rounded-2xl border-2 border-ink-100 bg-ink-50 flex items-center justify-center overflow-hidden">
          {currentUrl ? (
            <Image src={currentUrl} alt="Avatar" fill sizes="96px" className="object-cover" unoptimized />
          ) : (
            <UserIcon size={28} className="text-ink-300" />
          )}
          {pending && (
            <div className="absolute inset-0 bg-white/70 flex items-center justify-center">
              <Loader2 size={20} className="text-brand-500 animate-spin" />
            </div>
          )}
        </div>
        <div className="space-y-2">
          <button
            type="button"
            onClick={onClick}
            disabled={pending}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-ink-50 border border-ink-200 hover:border-brand-500 text-sm font-bold text-ink-700 transition disabled:opacity-50"
          >
            <Upload size={14} /> {currentUrl ? "Changer la photo" : "Télécharger"}
          </button>
          <p className="text-xs text-ink-400">JPG, PNG, WebP · 5 Mo max</p>
          <FeedbackLine state={state} />
        </div>
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/avif"
          className="hidden"
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) onFile(f);
            e.target.value = "";
          }}
        />
      </div>
    );
  }

  // Cover
  return (
    <div className="space-y-2">
      <button
        type="button"
        onClick={onClick}
        disabled={pending}
        className="relative block w-full aspect-[4/1] rounded-2xl border-2 border-dashed border-ink-200 hover:border-brand-500 bg-ink-50/30 hover:bg-brand-50/20 transition flex items-center justify-center text-center overflow-hidden disabled:opacity-50"
      >
        {currentUrl ? (
          <Image src={currentUrl} alt="Couverture" fill sizes="1200px" className="object-cover" unoptimized />
        ) : (
          <div>
            <Upload size={24} className="text-ink-300 mx-auto mb-2" />
            <div className="text-sm font-bold text-ink-500">Cliquez pour télécharger</div>
            <div className="text-xs text-ink-400 mt-1">JPG, PNG, WebP · 16:4 idéal</div>
          </div>
        )}
        {pending && (
          <div className="absolute inset-0 bg-white/70 flex items-center justify-center">
            <Loader2 size={28} className="text-brand-500 animate-spin" />
          </div>
        )}
      </button>
      <FeedbackLine state={state} />
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/avif"
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) onFile(f);
          e.target.value = "";
        }}
      />
    </div>
  );
}

function FeedbackLine({ state }: { state: UploadPhotoState | undefined }) {
  if (!state) return null;
  if (state.ok) {
    return (
      <p className="text-xs font-bold text-emerald-600 flex items-center gap-1">
        <CheckCircle2 size={12} /> Photo enregistrée
      </p>
    );
  }
  if (state.error) {
    return (
      <p className="text-xs font-bold text-red-600 flex items-center gap-1">
        <AlertCircle size={12} /> {state.error}
      </p>
    );
  }
  return null;
}
