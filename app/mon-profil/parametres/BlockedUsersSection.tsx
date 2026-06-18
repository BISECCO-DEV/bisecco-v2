"use client";

import { useState, useTransition } from "react";
import { Ban, MapPin, Trash2, Loader2 } from "lucide-react";
import { unblockUserAction, type BlockedUser } from "@/lib/blocks/actions";

export function BlockedUsersSection({ initial }: { initial: BlockedUser[] }) {
  const [items, setItems] = useState<BlockedUser[]>(initial);
  const [pending, startTransition] = useTransition();
  const [target, setTarget] = useState<number | null>(null);

  const unblock = (id: number) => {
    setTarget(id);
    startTransition(async () => {
      const fd = new FormData();
      fd.set("blocked_id", String(id));
      const res = await unblockUserAction(undefined, fd);
      if (res.ok) {
        setItems((prev) => prev.filter((u) => u.id !== id));
      }
      setTarget(null);
    });
  };

  if (items.length === 0) {
    return (
      <div className="px-1 py-3 text-sm text-ink-500">
        Tu n&apos;as bloqué personne. Si quelqu&apos;un te harcèle, tu peux le bloquer depuis la messagerie.
      </div>
    );
  }

  return (
    <div className="px-1 pt-1 space-y-2">
      {items.map((u) => (
        <div key={u.id} className="flex items-start gap-3 p-3 rounded-xl bg-ink-50/60 border border-ink-100">
          <div className="w-9 h-9 rounded-lg bg-red-50 grid place-items-center flex-shrink-0">
            <Ban size={15} className="text-red-600" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="font-bold text-ink-700 text-sm truncate">{u.name}</div>
            <div className="text-xs text-ink-500 flex flex-wrap items-center gap-2 mt-0.5">
              {u.city && (
                <span className="inline-flex items-center gap-0.5">
                  <MapPin size={11} /> {u.city}
                </span>
              )}
              <span>· {u.role === "artisan" ? "Pro" : "Particulier"}</span>
              <span>· bloqué le {new Date(u.blockedAt).toLocaleDateString("fr-FR")}</span>
            </div>
            {u.reason && (
              <p className="text-xs text-ink-500 mt-1 italic line-clamp-2">
                « {u.reason} »
              </p>
            )}
          </div>
          <button
            type="button"
            onClick={() => unblock(u.id)}
            disabled={pending && target === u.id}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-ink-200 text-xs font-bold text-ink-600 hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-200 transition flex-shrink-0 disabled:opacity-50"
          >
            {pending && target === u.id ? (
              <Loader2 size={11} className="animate-spin" />
            ) : (
              <Trash2 size={11} />
            )}
            Débloquer
          </button>
        </div>
      ))}
    </div>
  );
}
