import { Skeleton } from "@/components/ui/Skeleton";

export default function MonProfilLoading() {
  return (
    <div className="bg-sand-50 min-h-[calc(100vh-80px)] px-4 py-8">
      <div className="container-default">
        <Skeleton className="h-9 w-1/3 max-w-xs mb-4" />
        <Skeleton className="h-5 w-1/2 max-w-md mb-8" />
        <div className="grid lg:grid-cols-[260px_1fr] gap-6">
          <Skeleton className="h-[400px] rounded-2xl" />
          <div className="space-y-4">
            <Skeleton className="h-24 rounded-2xl" />
            <Skeleton className="h-60 rounded-2xl" />
            <Skeleton className="h-40 rounded-2xl" />
          </div>
        </div>
      </div>
    </div>
  );
}
