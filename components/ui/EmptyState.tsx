import type { LucideIcon } from "lucide-react";
import { CtaButton } from "@/components/ui/CtaButton";

type Action = {
  href: string;
  label: string;
};

type Props = {
  icon: LucideIcon;
  title: string;
  description?: string;
  /** CTA principal (orange). */
  primaryAction?: Action;
  /** CTA secondaire (blanc/outline). */
  secondaryAction?: Action;
  /** Couleur de l'icône (tailwind classes). Par défaut brand. */
  iconColorClass?: string;
  className?: string;
};

/**
 * Empty state élégant : icône circulaire + titre + description + 1 ou 2 CTAs.
 * Utilisé quand une liste est vide, qu'aucun résultat n'est trouvé, etc.
 */
export function EmptyState({
  icon: Icon,
  title,
  description,
  primaryAction,
  secondaryAction,
  iconColorClass = "bg-brand-50 text-brand-500",
  className = "",
}: Props) {
  return (
    <div className={`text-center py-12 px-4 ${className}`}>
      <div className={`w-16 h-16 rounded-2xl grid place-items-center mx-auto mb-5 ${iconColorClass}`}>
        <Icon size={26} strokeWidth={2} />
      </div>
      <h3 className="font-display font-semibold text-[1.2rem] tracking-tight text-ink-900">{title}</h3>
      {description && (
        <p className="mt-2 text-ink-500 text-[0.9rem] leading-relaxed max-w-sm mx-auto">{description}</p>
      )}
      {(primaryAction || secondaryAction) && (
        <div className="flex flex-wrap justify-center gap-3 mt-6">
          {primaryAction && (
            <CtaButton href={primaryAction.href} variant="primary" size="md">
              {primaryAction.label}
            </CtaButton>
          )}
          {secondaryAction && (
            <CtaButton href={secondaryAction.href} variant="white" size="md">
              {secondaryAction.label}
            </CtaButton>
          )}
        </div>
      )}
    </div>
  );
}
