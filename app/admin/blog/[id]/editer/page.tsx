import { notFound } from "next/navigation";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { ArticleForm } from "../../ArticleForm";
import type { BlogArticle } from "@/lib/blog/actions";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ id: string }> };

export default async function EditArticlePage({ params }: Props) {
  const { id } = await params;
  const articleId = parseInt(id, 10);
  if (isNaN(articleId)) notFound();

  const admin = createSupabaseAdminClient();
  const { data } = await admin
    .from("blog_articles")
    .select("*")
    .eq("id", articleId)
    .single();

  if (!data) notFound();

  return <ArticleForm article={data as BlogArticle} />;
}
