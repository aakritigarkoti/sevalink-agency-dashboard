export default function DashboardLoading() {
  return (
    <div className="p-4 space-y-6">
      <div className="space-y-2">
        <div className="h-6 w-40 rounded bg-muted animate-pulse" />
        <div className="h-4 w-80 rounded bg-muted animate-pulse" />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="h-36 rounded-2xl border border-border bg-card p-4 shadow-sm">
            <div className="flex items-start justify-between gap-3">
              <div className="h-4 w-20 rounded bg-muted animate-pulse" />
              <div className="h-9 w-9 rounded-full bg-muted animate-pulse" />
            </div>
            <div className="mt-6 h-8 w-24 rounded bg-muted animate-pulse" />
            <div className="mt-3 h-4 w-28 rounded bg-muted animate-pulse" />
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-5">
        <div className="space-y-4 xl:col-span-2">
          <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
            <div className="flex items-center justify-between gap-3">
              <div className="h-5 w-40 rounded bg-muted animate-pulse" />
              <div className="h-4 w-24 rounded bg-muted animate-pulse" />
            </div>
            <div className="mt-5 space-y-3">
              {Array.from({ length: 3 }).map((_, index) => (
                <div key={index} className="h-24 rounded-2xl border border-border bg-muted/20 animate-pulse" />
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-4 xl:col-span-3">
          <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
            <div className="flex items-center justify-between gap-3">
              <div className="h-5 w-36 rounded bg-muted animate-pulse" />
              <div className="h-4 w-24 rounded bg-muted animate-pulse" />
            </div>
            <div className="mt-5 space-y-3">
              {Array.from({ length: 4 }).map((_, index) => (
                <div key={index} className="h-20 rounded-2xl border border-border bg-muted/20 animate-pulse" />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
