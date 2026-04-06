"use client";

type Props = {
  title: string;
  value: string;
  subtitle?: string;
  icon: React.ReactNode;
};

export default function StatsCard({ title, value, subtitle, icon }: Props) {
  return (
    <article className="flex h-full aspect-square flex-col rounded-2xl border border-white/60 bg-white/80 p-3.5 shadow-sm backdrop-blur-sm transition-all duration-300 ease-in-out hover:-translate-y-0.5 hover:scale-105 hover:shadow-lg active:scale-[1.02] sm:p-4 md:aspect-auto md:min-h-40">
      <div className="flex items-start justify-between gap-3">
        <p className="text-[11px] font-semibold uppercase tracking-wide text-gray-500 sm:text-xs">{title}</p>
        <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-slate-100 to-white text-gray-700 ring-1 ring-gray-200/80">
          {icon}
        </span>
      </div>

      <div className="mt-2 flex flex-1 flex-col justify-center">
        <h2 className="text-xl font-bold tracking-tight text-gray-900 sm:text-2xl">{value}</h2>
        {subtitle ? <p className="mt-1 text-xs text-gray-500">{subtitle}</p> : null}
      </div>
    </article>
  );
}