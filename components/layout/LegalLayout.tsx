import Link from "next/link";
import { ArrowLeft, Calendar, ShieldCheck } from "lucide-react";

type Props = {
  title: string;
  subtitle?: string;
  updatedAt: string; // format ISO YYYY-MM-DD
  children: React.ReactNode;
};

export function LegalLayout({ title, subtitle, updatedAt, children }: Props) {
  const formatted = new Date(updatedAt).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div className="bg-ink-50 min-h-screen">
      <div className="container-default max-w-4xl py-10 sm:py-14">
        {/* Breadcrumb · retour */}
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-sm text-ink-500 hover:text-brand-500 font-semibold transition mb-6"
        >
          <ArrowLeft size={14} /> Retour à l&apos;accueil
        </Link>

        {/* Header */}
        <header className="mb-10 pb-8 border-b border-ink-200">
          <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-50 border border-brand-200 text-brand-700 text-[0.7rem] font-bold tracking-[0.14em] uppercase">
            <ShieldCheck size={11} strokeWidth={2.8} className="text-brand-500" />
            Document légal
          </span>
          <h1 className="mt-4 text-[2rem] sm:text-[2.6rem] font-semibold text-ink-700 tracking-[-0.025em] leading-tight">
            {title}
          </h1>
          {subtitle && (
            <p className="mt-3 text-ink-500 text-[1rem] leading-relaxed">{subtitle}</p>
          )}
          <div className="mt-5 inline-flex items-center gap-2 text-[0.78rem] text-ink-400">
            <Calendar size={12} />
            Dernière mise à jour&nbsp;: <strong className="text-ink-600">{formatted}</strong>
          </div>
        </header>

        {/* Content · styles inline pour éviter dépendance à @tailwindcss/typography */}
        <article
          className="
            text-ink-700 text-[0.95rem] leading-relaxed
            [&_h2]:text-[1.4rem] [&_h2]:sm:text-[1.55rem] [&_h2]:font-semibold [&_h2]:text-ink-700 [&_h2]:tracking-tight [&_h2]:mt-10 [&_h2]:mb-4
            [&_h3]:text-[1.1rem] [&_h3]:sm:text-[1.18rem] [&_h3]:font-bold [&_h3]:text-ink-700 [&_h3]:mt-6 [&_h3]:mb-3
            [&_p]:my-4 [&_p]:text-ink-600
            [&_ul]:my-4 [&_ul]:pl-6 [&_ul]:list-disc [&_ul]:space-y-1.5 [&_ul]:text-ink-600
            [&_li]:leading-relaxed
            [&_a]:text-brand-600 [&_a]:font-semibold hover:[&_a]:underline
            [&_strong]:text-ink-700 [&_strong]:font-semibold
            [&_table]:w-full [&_table]:my-5 [&_table]:border [&_table]:border-ink-200 [&_table]:rounded-xl [&_table]:overflow-hidden
            [&_th]:bg-ink-50 [&_th]:text-left [&_th]:font-bold [&_th]:text-ink-700 [&_th]:px-4 [&_th]:py-3 [&_th]:text-[0.86rem]
            [&_td]:px-4 [&_td]:py-3 [&_td]:border-t [&_td]:border-ink-100 [&_td]:text-ink-600 [&_td]:text-[0.86rem]
          "
        >
          {children}
        </article>

        {/* Footer · liens vers les autres pages légales */}
        <nav className="mt-14 pt-8 border-t border-ink-200">
          <div className="text-[0.72rem] font-bold tracking-[0.18em] uppercase text-ink-400 mb-3">
            Autres documents
          </div>
          <div className="flex flex-wrap gap-2">
            {[
              { href: "/mentions-legales", label: "Mentions légales" },
              { href: "/politique-confidentialite", label: "Politique de confidentialité" },
              { href: "/cgu", label: "CGU" },
              { href: "/politique-remboursement", label: "Politique de remboursement" },
            ].map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="inline-flex items-center px-3 py-1.5 rounded-lg bg-white border border-ink-200 text-ink-700 text-[0.82rem] font-semibold hover:border-brand-300 hover:text-brand-600 transition"
              >
                {l.label}
              </Link>
            ))}
          </div>
        </nav>
      </div>
    </div>
  );
}
