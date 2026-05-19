import { createClient } from "@/lib/supabase/server";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { getCurrentUser } from "@/lib/db/current-user";

export const dynamic = "force-dynamic";
export const metadata = { title: "Debug Me", robots: { index: false, follow: false } };

export default async function DebugMePage() {
  const supabase = await createClient();
  const { data: { user: authUser } } = await supabase.auth.getUser();
  const currentUser = await getCurrentUser();

  // Récupère TOUTES les lignes public.users qui matchent (case-insensitive)
  const admin = createSupabaseAdminClient();
  const { data: publicRows } = authUser?.email
    ? await admin
        .from("users")
        .select("id, email, role, validation_status, deleted_at, created_at")
        .ilike("email", authUser.email)
    : { data: null };

  return (
    <div className="container-default max-w-3xl py-10 space-y-6">
      <h1 className="text-3xl font-extrabold text-ink-700">🔍 Debug me</h1>

      <section className="bg-white rounded-2xl border-2 border-blue-200 p-5">
        <h2 className="font-extrabold text-blue-700 mb-3">1. Auth Supabase (auth.users)</h2>
        {authUser ? (
          <pre className="bg-blue-50 p-3 rounded-lg text-xs overflow-auto">
{JSON.stringify({
  id: authUser.id,
  email: authUser.email,
  created_at: authUser.created_at,
  email_confirmed: !!authUser.email_confirmed_at,
}, null, 2)}
          </pre>
        ) : (
          <p className="text-red-600 font-bold">❌ Pas connecté</p>
        )}
      </section>

      <section className="bg-white rounded-2xl border-2 border-emerald-200 p-5">
        <h2 className="font-extrabold text-emerald-700 mb-3">2. public.users matchant cet email</h2>
        {publicRows && publicRows.length > 0 ? (
          <>
            <p className="text-xs text-emerald-700 font-bold mb-2">
              {publicRows.length} ligne(s) trouvée(s)
            </p>
            <pre className="bg-emerald-50 p-3 rounded-lg text-xs overflow-auto">
{JSON.stringify(publicRows, null, 2)}
            </pre>
          </>
        ) : (
          <p className="text-red-600 font-bold">
            ❌ AUCUNE LIGNE dans public.users pour cet email — c&apos;est ça le problème
          </p>
        )}
      </section>

      <section className="bg-white rounded-2xl border-2 border-brand-200 p-5">
        <h2 className="font-extrabold text-brand-700 mb-3">3. Ce que getCurrentUser() retourne</h2>
        {currentUser ? (
          <pre className="bg-brand-50 p-3 rounded-lg text-xs overflow-auto">
{JSON.stringify(currentUser, null, 2)}
          </pre>
        ) : (
          <p className="text-red-600 font-bold">❌ Null — pas de user</p>
        )}
      </section>

      <section
        className={`rounded-2xl border-2 p-5 ${
          currentUser?.role === "admin"
            ? "bg-emerald-50 border-emerald-300"
            : "bg-amber-50 border-amber-300"
        }`}
      >
        <h2 className="font-extrabold mb-2">📊 VERDICT</h2>
        {currentUser?.role === "admin" ? (
          <p className="text-emerald-800 font-bold text-lg">
            ✅ Tu es ADMIN ! Tu peux accéder à <a href="/admin" className="underline">/admin</a>
          </p>
        ) : (
          <p className="text-amber-800 font-bold text-lg">
            ⚠ Ton role = <code className="bg-white px-2 py-0.5 rounded">{currentUser?.role ?? "null"}</code> (devrait être &quot;admin&quot;)
          </p>
        )}
      </section>

      {/* État de la base */}
      <DbCheck />
    </div>
  );
}

async function DbCheck() {
  const admin = createSupabaseAdminClient();

  const tables = [
    "users", "metiers", "artisan_profiles", "artisan_profile_metier",
    "services", "gallery_images", "reviews", "follows", "artisan_posts",
    "chat_conversations", "chat_messages", "profile_views", "referrals",
  ];

  const counts: Record<string, number> = {};
  for (const t of tables) {
    const { count } = await admin.from(t).select("*", { count: "exact", head: true });
    counts[t] = count ?? 0;
  }

  // Récupère quelques exemples d'utilisateurs réels
  const { data: sampleUsers } = await admin
    .from("users")
    .select("id, client_number, name, email, role, validation_status, city, siren")
    .order("id")
    .limit(15);

  return (
    <section className="bg-white rounded-2xl border-2 border-purple-200 p-5">
      <h2 className="font-extrabold text-purple-700 mb-3">4. État de ta base Supabase</h2>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-4">
        {Object.entries(counts).map(([table, count]) => (
          <div key={table} className={`p-3 rounded-lg border ${count > 0 ? "bg-emerald-50 border-emerald-200" : "bg-red-50 border-red-200"}`}>
            <div className="text-xs font-bold text-ink-500">{table}</div>
            <div className={`text-xl font-extrabold ${count > 0 ? "text-emerald-700" : "text-red-700"}`}>
              {count}
            </div>
          </div>
        ))}
      </div>

      <h3 className="font-bold text-ink-700 text-sm mt-5 mb-2">
        Échantillon users (15 premiers) :
      </h3>
      {sampleUsers && sampleUsers.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead className="bg-purple-50 text-purple-700">
              <tr>
                <th className="px-2 py-1 text-left">ID</th>
                <th className="px-2 py-1 text-left">N° client</th>
                <th className="px-2 py-1 text-left">Nom</th>
                <th className="px-2 py-1 text-left">Email</th>
                <th className="px-2 py-1 text-left">Role</th>
                <th className="px-2 py-1 text-left">Statut</th>
                <th className="px-2 py-1 text-left">SIREN</th>
              </tr>
            </thead>
            <tbody>
              {sampleUsers.map((u) => (
                <tr key={u.id} className="border-t border-ink-100">
                  <td className="px-2 py-1 font-mono">{u.id}</td>
                  <td className="px-2 py-1 font-mono">{u.client_number ?? "—"}</td>
                  <td className="px-2 py-1 font-semibold">{u.name}</td>
                  <td className="px-2 py-1 text-ink-500">{u.email}</td>
                  <td className="px-2 py-1">{u.role}</td>
                  <td className="px-2 py-1">{u.validation_status ?? "—"}</td>
                  <td className="px-2 py-1 font-mono">{u.siren ?? "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-red-600 font-bold text-sm">
          ❌ AUCUN user dans public.users — la migration n&apos;a pas marché !
        </p>
      )}
    </section>
  );
}
