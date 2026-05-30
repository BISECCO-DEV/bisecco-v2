import { Skeleton } from "@/components/ui/Skeleton";

/**
 * Fallback de chargement racine (toutes les routes sans loading.tsx propre).
 * Sert principalement pendant le premier rendu Server Component.
 */
export default function RootLoading() {
  return (
    <div className="min-h-[calc(100vh-160px)] bg-sand-50 px-4 py-16">
      <div className="container-default">
        <Skeleton className="h-10 w-2/3 max-w-md mb-6" />
        <Skeleton className="h-5 w-1/2 max-w-sm mb-10" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <Skeleton key={i} className="h-48 rounded-2xl" />
          ))}
        </div>
      </div>
    </div>
  );
}
