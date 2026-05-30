type Props = {
  className?: string;
};

/**
 * Bloc pulse gris (animation Tailwind). À composer pour créer des layouts loading.
 */
export function Skeleton({ className = "" }: Props) {
  return (
    <div
      className={`animate-pulse bg-gradient-to-r from-sand-100 via-sand-200/60 to-sand-100 rounded-lg ${className}`}
      aria-hidden
    />
  );
}

/**
 * Loader minimal (spinner) pour fallback inline.
 */
export function Spinner({ size = 18, className = "" }: { size?: number; className?: string }) {
  return (
    <span
      className={`inline-block animate-spin border-2 border-current border-t-transparent rounded-full ${className}`}
      style={{ width: size, height: size }}
      aria-label="Chargement"
    />
  );
}
