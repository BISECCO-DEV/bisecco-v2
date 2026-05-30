"use client";

import { Trash2 } from "lucide-react";
import { hardDeleteUserAction } from "@/lib/admin/actions";

export function DeleteUserButton({ userId, userEmail, userName, backUrl, iconOnly = false }: {
  userId: number;
  userEmail: string;
  userName: string;
  backUrl: string;
  iconOnly?: boolean;
}) {
  return (
    <form
      action={hardDeleteUserAction}
      onSubmit={(e) => {
        const ok = confirm(
          `Supprimer definitivement ${userName} (${userEmail}) ?\n\nAction IRREVERSIBLE. Tout sera supprime (compte Supabase, messages, devis, avis, CV...).`
        );
        if (!ok) e.preventDefault();
      }}
      className="inline-block"
    >
      <input type="hidden" name="user_id" value={userId} />
      <input type="hidden" name="_back" value={backUrl} />
      {iconOnly ? (
        <button
          type="submit"
          title={`Supprimer ${userEmail}`}
          className="inline-flex items-center justify-center w-8 h-8 rounded-lg hover:bg-red-50 text-ink-400 hover:text-red-600 transition"
        >
          <Trash2 size={14} />
        </button>
      ) : (
        <button
          type="submit"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-red-600 text-white font-bold text-sm hover:bg-red-700 transition shadow-[0_4px_12px_rgba(220,38,38,0.4)]"
        >
          <Trash2 size={14} /> Supprimer définitivement
        </button>
      )}
    </form>
  );
}
