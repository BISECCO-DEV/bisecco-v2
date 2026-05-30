---
description: Crée une nouvelle server action squelette pour une feature
argument-hint: <feature> (ex: bookmarks, ratings, notifications)
---

Tu dois créer une nouvelle server action pour la feature : **$ARGUMENTS**

Procédure :

1. **Vérifier** si `lib/$ARGUMENTS/` existe. Si oui, lire le fichier `actions.ts` pour ne pas dupliquer.
2. **Créer** `lib/$ARGUMENTS/actions.ts` avec :
   - Header `"use server"`
   - Imports standards (createSupabaseAdminClient, getCurrentDbUser ou requireDbAdmin)
   - Types `{name}State = { error?: string; success?: string } | undefined` ou `{ ok: true } | { ok: false; error: string }`
3. **Toujours valider côté serveur** : longueur, format, regex, anti-doublon, rate limit
4. **Toujours utiliser** `createSupabaseAdminClient()` pour bypass RLS dans les actions
5. **Si admin-only** : `await requireDbAdmin()` en tout début
6. **Si envoi email** : utiliser `sendMail` + template branded depuis `lib/mail/templates.ts`
7. **URLs** : `process.env.APP_URL || process.env.NEXT_PUBLIC_SITE_URL || "https://bisecco.eu"`
8. **revalidatePath** sur les pages affectées

Template type :

```typescript
"use server";

import { revalidatePath } from "next/cache";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { getCurrentDbUser } from "@/lib/auth/current-user";

export type {Feature}Result = { ok: true } | { ok: false; error: string };

export async function {action}Action(formData: FormData): Promise<{Feature}Result> {
  const me = await getCurrentDbUser();
  if (!me) return { ok: false, error: "Connexion requise." };

  const field = String(formData.get("field") ?? "").trim();
  if (!field || field.length < 3) return { ok: false, error: "Champ invalide." };

  const admin = createSupabaseAdminClient();

  // Logique métier ici
  const { error } = await admin.from("table_name").insert({ /* ... */ });
  if (error) return { ok: false, error: "Erreur DB." };

  revalidatePath("/path-concerne");
  return { ok: true };
}
```

Ensuite, indiquer à l'utilisateur :
- Le fichier créé
- Comment brancher dans un form client (`use client` → useState + onSubmit qui appelle l'action)
- Si la feature nécessite une nouvelle table : écrire le SQL dans `supabase/{feature}.sql` et dire à l'user de l'exécuter dans Supabase Dashboard
