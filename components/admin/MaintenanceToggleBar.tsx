"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { AlertTriangle, CheckCircle2, Loader2, Power } from "lucide-react";
import { setMaintenanceEnabledAction } from "@/lib/admin/site-settings";

type Props = {
  initialEnabled: boolean;
  envForced: boolean;
  updatedAt: string | null;
  updatedByName: string | null;
};

function formatDate(iso: string | null): string {
  if (!iso) return "";
  const d = new Date(iso);
  return d.toLocaleString("fr-FR", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" });
}

export function MaintenanceToggleBar({ initialEnabled, envForced, updatedAt, updatedByName }: Props) {
  const router = useRouter();
  const [enabled, setEnabled] = useState(initialEnabled);
  const [pending, startTransition] = useTransition();
  const [msg, setMsg] = useState<string | null>(null);

  const toggle = () => {
    if (envForced) return;
    const next = !enabled;
    setMsg(null);
    startTransition(async () => {
      const res = await setMaintenanceEnabledAction(next);
      if (res.ok) {
        setEnabled(next);
        router.refresh();
      } else {
        setMsg(res.error ?? "Erreur");
      }
    });
  };

  // Styles selon l'état
  const containerCls = enabled
    ? "bg-amber-500 text-white"
    : "bg-emerald-500/95 text-white";

  return (
    <div className={`${containerCls} px-4 sm:px-6 py-2.5 flex items-center justify-between gap-3 flex-wrap`}>
      <div className="flex items-center gap-2.5 min-w-0">
        {enabled ? (
          <AlertTriangle size={16} className="flex-shrink-0" />
        ) : (
          <CheckCircle2 size={16} className="flex-shrink-0" />
        )}
        <div className="min-w-0">
          <div className="text-[0.82rem] font-extrabold tracking-tight">
            {enabled ? "Mode maintenance ACTIF" : "Site en ligne"}
          </div>
          {(updatedAt || envForced) && (
            <div className="text-[0.7rem] opacity-85">
              {envForced
                ? "🔒 Forcé par variable d'environnement MAINTENANCE_ENABLED"
                : `Dernière action ${updatedByName ? `par ${updatedByName}` : ""} · ${formatDate(updatedAt)}`}
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2 flex-shrink-0">
        {msg && (
          <span className="text-xs bg-white/20 px-2 py-1 rounded-lg font-semibold">⚠ {msg}</span>
        )}
        <button
          type="button"
          onClick={toggle}
          disabled={pending || envForced}
          title={envForced ? "Désactivez d'abord la variable d'env" : enabled ? "Désactiver la maintenance" : "Activer la maintenance"}
          className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-lg font-bold text-[0.78rem] transition ${
            envForced
              ? "bg-white/20 cursor-not-allowed opacity-70"
              : "bg-white text-ink-700 hover:bg-white/90 shadow-sm"
          } disabled:opacity-50`}
        >
          {pending ? (
            <Loader2 size={13} className="animate-spin" />
          ) : (
            <Power size={13} strokeWidth={2.4} />
          )}
          {enabled ? "Désactiver" : "Activer la maintenance"}
        </button>
      </div>
    </div>
  );
}
