import { Skeleton } from "@/components/ui/Skeleton";

export default function AdminLoading() {
  return (
    <div className="space-y-4 max-w-[1500px]">
      {/* Hero + calendar */}
      <div className="grid lg:grid-cols-[1.5fr_1fr] gap-4">
        <Skeleton className="h-[200px] rounded-2xl" />
        <Skeleton className="h-[200px] rounded-2xl" />
      </div>

      {/* KPI strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
        {[0, 1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-[140px] rounded-2xl" />
        ))}
      </div>

      {/* Pipeline + Feed */}
      <div className="grid lg:grid-cols-[1.5fr_1fr] gap-3.5">
        <Skeleton className="h-[400px] rounded-2xl" />
        <Skeleton className="h-[400px] rounded-2xl" />
      </div>

      {/* Activity + Breakdown */}
      <div className="grid lg:grid-cols-[1.4fr_1fr] gap-3.5">
        <Skeleton className="h-[340px] rounded-2xl" />
        <Skeleton className="h-[340px] rounded-2xl" />
      </div>
    </div>
  );
}
