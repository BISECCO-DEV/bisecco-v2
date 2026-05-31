const PUBLIC_BUCKET_URL = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/user-uploads`;

/** Construit l'URL publique d'une image stockée dans le bucket user-uploads.
 *  Pour rétrocompat : si le path est déjà une URL http(s), on le renvoie tel quel. */
export function feedImagePublicUrl(path: string): string {
  if (!path) return "";
  if (path.startsWith("http")) return path;
  return `${PUBLIC_BUCKET_URL}/${path.replace(/^\//, "")}`;
}
