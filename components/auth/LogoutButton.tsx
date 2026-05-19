"use client";

import { LogOut } from "lucide-react";
import { logoutAction } from "@/lib/auth/actions";

export function LogoutButton({ className = "" }: { className?: string }) {
  return (
    <form action={logoutAction}>
      <button
        type="submit"
        className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold text-ink-600 hover:text-red-600 hover:bg-red-50 transition ${className}`}
      >
        <LogOut size={16} /> Se déconnecter
      </button>
    </form>
  );
}
