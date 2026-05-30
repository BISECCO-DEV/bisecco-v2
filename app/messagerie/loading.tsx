import { Skeleton } from "@/components/ui/Skeleton";

export default function MessagerieLoading() {
  return (
    <div className="bg-sand-50 min-h-[calc(100vh-80px)] py-5 px-4">
      <div className="container-default">
        <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr_300px] gap-4 h-[calc(100vh-120px)] min-h-[600px]">
          <Skeleton className="rounded-2xl h-full" />
          <Skeleton className="rounded-2xl h-full" />
          <Skeleton className="rounded-2xl h-full hidden lg:block" />
        </div>
      </div>
    </div>
  );
}
