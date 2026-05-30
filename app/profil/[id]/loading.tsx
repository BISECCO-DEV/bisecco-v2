import { Skeleton } from "@/components/ui/Skeleton";

export default function ProfilLoading() {
  return (
    <div className="bg-sand-50 min-h-screen">
      <Skeleton className="h-[280px] rounded-none w-full" />
      <div className="container-default -mt-20 relative z-10 pb-16">
        <div className="bg-white rounded-3xl border border-sand-200 p-6 sm:p-8">
          <div className="flex items-center gap-5">
            <Skeleton className="w-24 h-24 rounded-2xl flex-shrink-0" />
            <div className="flex-1 space-y-3">
              <Skeleton className="h-7 w-2/3 max-w-sm" />
              <Skeleton className="h-4 w-1/2 max-w-xs" />
              <Skeleton className="h-4 w-1/3 max-w-[200px]" />
            </div>
          </div>
          <div className="grid sm:grid-cols-[1fr_320px] gap-8 mt-8">
            <div className="space-y-4">
              <Skeleton className="h-32 rounded-2xl" />
              <Skeleton className="h-48 rounded-2xl" />
              <Skeleton className="h-48 rounded-2xl" />
            </div>
            <div className="space-y-3">
              <Skeleton className="h-40 rounded-2xl" />
              <Skeleton className="h-28 rounded-2xl" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
