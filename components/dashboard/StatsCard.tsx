"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type Props = {
  title: string;
  value: string;
  subtitle?: string;
  icon: React.ReactNode;
};

export default function StatsCard({ title, value, subtitle, icon }: Props) {
  const startsWithPlus = Boolean(subtitle?.trim().startsWith("+"));
  const startsWithMinus = Boolean(subtitle?.trim().startsWith("-"));

  const badgeClass = startsWithPlus
    ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
    : startsWithMinus
      ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
      : "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400";

  return (
    <Card className="group flex h-auto flex-col rounded-xl border border-gray-200 !bg-white p-0 shadow-sm transition-all duration-300 ease-in-out hover:shadow-md dark:border-gray-800 dark:!bg-gray-900">
      <CardHeader className="flex flex-row items-start justify-between gap-3 p-4 sm:p-5">
        <CardDescription className="text-sm text-gray-500 dark:text-gray-400">
          {title}
        </CardDescription>
        <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gray-100 text-gray-600 ring-1 ring-gray-200 transition-colors duration-300 group-hover:text-gray-900 dark:bg-gray-800 dark:text-gray-300 dark:ring-gray-700 dark:group-hover:text-gray-100">
          {icon}
        </span>
      </CardHeader>

      <CardContent className="flex min-w-0 flex-col justify-center p-4 pt-0 sm:p-5 sm:pt-0">
        <CardTitle className="max-w-full overflow-hidden text-ellipsis whitespace-nowrap text-2xl font-bold leading-tight text-gray-900 dark:text-gray-100 md:text-3xl">
          {value}
        </CardTitle>
        {subtitle ? (
          <div className="mt-2 inline-flex items-center gap-2">
            <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold ${badgeClass}`}>
              <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2">
                {startsWithPlus ? <path d="M6 14l6-6 6 6" /> : startsWithMinus ? <path d="M6 10l6 6 6-6" /> : <path d="M8 12h8" />}
              </svg>
              {subtitle}
            </span>
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}