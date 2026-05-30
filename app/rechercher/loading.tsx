import { Skeleton } from "@/components/ui/Skeleton";

export default function RechercherLoading() {
  return (
    <div className="bg-sand-50 min-h-[calc(100vh-80px)] px-4 py-8">
      <div className="container-default">
        <Skeleton className="h-10 w-1/2 max-w-md mb-4" />
        <Skeleton className="h-5 w-2/3 max-w-lg mb-8" />
        <div className="grid lg:grid-cols-[1fr_2fr] gap-6">
          <Skeleton className="h-[500px] rounded-2xl" />
          <div className="space-y-4">
            {[0, 1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-32 rounded-2xl" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
