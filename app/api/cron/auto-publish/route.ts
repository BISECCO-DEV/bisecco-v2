import { NextResponse } from "next/server";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

/**
 * Endpoint sécurisé pour l'agent cron Bisecco.
 *
 * POST /api/cron/auto-publish
 * Headers:
 *   Authorization: Bearer ${CRON_SECRET}
 * Body:
 *   {
 *     kind: "fil" | "blog",
 *     content: { title?: string, body: string, metierSlug?: string, slug?: string,
 *                excerpt?: string, image_url?: string }
 *   }
 *
 * Comportement :
 *  - kind=fil   → INSERT dans feed_posts en tant qu'auteur "Bisecco" (compte admin
 *                  système configurable via BISECCO_BOT_USER_ID), kind=conseil, status=approved
 *  - kind=blog  → INSERT dans blog_posts (table à créer si pas encore migrée)
 *
 * Sécurité : seul l'appelant avec le bon CRON_SECRET (env BISECCO_CRON_SECRET)
 * peut publier. Aucune authentification utilisateur requise.
 */

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type FilContent = {
  title?: string;
  body: string;
  metierSlug?: string;
  city?: string;
  kind?: "conseil" | "question" | "realisation";
};

type BlogContent = {
  title: string;
  slug: string;
  excerpt: string;
  body: string;
  category?: string;
  image_url?: string;
  read_time?: number;
};

type Payload = { kind: "fil"; content: FilContent } | { kind: "blog"; content: BlogContent };

export async function POST(req: Request) {
  // ─── 1. Auth bearer secret ───
  const auth = req.headers.get("authorization") ?? "";
  const expected = process.env.BISECCO_CRON_SECRET;
  if (!expected) {
    return NextResponse.json({ error: "Server misconfigured (BISECCO_CRON_SECRET missing)" }, { status: 500 });
  }
  if (auth !== `Bearer ${expected}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // ─── 2. Parse body ───
  let payload: Payload;
  try {
    payload = (await req.json()) as Payload;
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  if (!payload.kind || !payload.content) {
    return NextResponse.json({ error: "Missing kind or content" }, { status: 400 });
  }

  const admin = createSupabaseAdminClient();
  const botUserId = process.env.BISECCO_BOT_USER_ID
    ? Number(process.env.BISECCO_BOT_USER_ID)
    : null;

  // ─── 3. Dispatch par kind ───
  if (payload.kind === "fil") {
    if (!botUserId) {
      return NextResponse.json(
        { error: "BISECCO_BOT_USER_ID not configured. Create a bot user and set env var." },
        { status: 500 },
      );
    }
    const c = payload.content;
    const body = c.body?.trim();
    if (!body || body.length < 20) {
      return NextResponse.json({ error: "Body too short" }, { status: 400 });
    }

    // Résout metier_id si slug fourni
    let metierId: number | null = null;
    if (c.metierSlug) {
      const { data: m } = await admin
        .from("metiers")
        .select("id")
        .eq("slug", c.metierSlug)
        .maybeSingle();
      if (m?.id) metierId = m.id as number;
    }

    const { data, error } = await admin
      .from("feed_posts")
      .insert({
        author_id: botUserId,
        kind: c.kind ?? "conseil",
        content: body.slice(0, 4000),
        images: [],
        city: c.city ?? null,
        metier_id: metierId,
        status: "approved",
        approved_at: new Date().toISOString(),
      })
      .select("id")
      .single();

    if (error || !data) {
      return NextResponse.json({ error: error?.message ?? "Insert failed" }, { status: 500 });
    }
    return NextResponse.json({ ok: true, kind: "fil", postId: data.id });
  }

  if (payload.kind === "blog") {
    const c = payload.content;
    if (!c.title || !c.slug || !c.body) {
      return NextResponse.json({ error: "Missing title/slug/body" }, { status: 400 });
    }
    // Note : suppose qu'une table public.blog_posts existe.
    // Si pas encore migré → cet appel échouera proprement.
    const { data, error } = await admin
      .from("blog_posts")
      .insert({
        title: c.title.slice(0, 200),
        slug: c.slug.toLowerCase().slice(0, 200),
        excerpt: (c.excerpt ?? "").slice(0, 300),
        body: c.body,
        category: c.category ?? "Conseils",
        image_url: c.image_url ?? null,
        read_time: c.read_time ?? null,
        author_name: "L'équipe Bisecco",
        published_at: new Date().toISOString(),
        status: "published",
      })
      .select("id, slug")
      .single();

    if (error || !data) {
      return NextResponse.json(
        { error: error?.message ?? "Insert failed (blog_posts table missing?)", hint: "Run db/021_blog_posts.sql first" },
        { status: 500 },
      );
    }
    return NextResponse.json({ ok: true, kind: "blog", id: data.id, slug: data.slug });
  }

  return NextResponse.json({ error: "Unknown kind" }, { status: 400 });
}
