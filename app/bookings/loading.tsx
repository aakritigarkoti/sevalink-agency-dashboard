import { Skeleton } from "@/components/ui/skeleton";

export default function BookingsLoading() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Skeleton className="h-6 w-32" />
        <Skeleton className="h-4 w-80" />
      </div>

      <div className="rounded-2xl border border-border bg-card p-4 shadow-sm sm:p-6">
        <Skeleton className="h-5 w-16" />
        <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-12">
          <Skeleton className="h-10 md:col-span-12" />
          <Skeleton className="h-10 md:col-span-6 lg:col-span-4" />
          <Skeleton className="h-10 md:col-span-6 lg:col-span-4" />
          <Skeleton className="h-10 md:col-span-8 lg:col-span-3" />
          <Skeleton className="h-10 md:col-span-4 lg:col-span-1" />
        </div>

        <div className="my-6 h-px bg-border" />

        <div className="overflow-hidden rounded-2xl border border-border">
          <div className="grid grid-cols-8 gap-0 border-b border-border bg-muted/40 px-4 py-3.5">
            {Array.from({ length: 8 }).map((_, index) => (
              <Skeleton key={index} className="h-3" />
            ))}
          </div>
          <div className="space-y-0">
            {Array.from({ length: 5 }).map((_, rowIndex) => (
              <div key={rowIndex} className="grid grid-cols-8 gap-0 border-b border-border/70 px-4 py-4">
                {Array.from({ length: 8 }).map((__, cellIndex) => (
                  <div key={cellIndex} className="flex items-center">
                    <Skeleton className="h-4 w-full max-w-[120px]" />
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
