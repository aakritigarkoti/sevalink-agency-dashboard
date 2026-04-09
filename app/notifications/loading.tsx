import { Skeleton } from "@/components/ui/skeleton";

export default function NotificationsLoading() {
  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between gap-3">
        <div className="space-y-2">
          <Skeleton className="h-6 w-40" />
          <Skeleton className="h-4 w-80" />
        </div>
        <Skeleton className="h-8 w-24 rounded-full" />
      </div>

      <div className="flex gap-2">
        {Array.from({ length: 3 }).map((_, index) => (
          <Skeleton key={index} className="h-8 w-20" />
        ))}
      </div>

      <div className="space-y-3">
        {Array.from({ length: 5 }).map((_, index) => (
          <div key={index} className="rounded-2xl border border-border bg-card p-4 shadow-sm">
            <Skeleton className="h-4 w-40" />
            <Skeleton className="mt-3 h-3 w-full" />
            <Skeleton className="mt-2 h-3 w-2/3" />
            <Skeleton className="mt-4 h-3 w-24" />
          </div>
        ))}
      </div>
    </div>
  );
}
