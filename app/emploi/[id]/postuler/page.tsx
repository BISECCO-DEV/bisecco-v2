import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { findJob } from "@/lib/emploi";
import { PostulerForm } from "./PostulerForm";

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const j = findJob(id);
  return { title: j ? `Postuler — ${j.title}` : "Postuler" };
}

export default async function PostulerPage({ params }: Props) {
  const { id } = await params;
  const j = findJob(id);
  if (!j) notFound();

  return (
    <div className="bg-ink-50 min-h-screen pb-16">
      <div className="container-default max-w-3xl py-10">
        <Link href={`/emploi/${j.id}`} className="inline-flex items-center gap-1.5 text-sm text-ink-500 hover:text-brand-500 font-semibold transition">
          <ArrowLeft size={14} /> Retour à l&apos;offre
        </Link>

        <div className="mt-5">
          <h1 className="text-3xl font-bold text-ink-700 tracking-tight">
            Postuler à <span className="text-brand-500">{j.title}</span>
          </h1>
          <p className="text-ink-400 mt-2">
            {j.company} · {j.city} ({j.postalCode}) · {j.contractType}
          </p>
        </div>

        <PostulerForm jobId={j.id} jobTitle={j.title} />
      </div>
    </div>
  );
}
