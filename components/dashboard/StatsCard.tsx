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
  return (
    <Card className="group flex aspect-square min-h-36 flex-col transition-all duration-300 ease-in-out hover:-translate-y-1 hover:shadow-md active:scale-[1.01] sm:min-h-40">
      <CardHeader className="flex flex-row items-start justify-between gap-3 p-3.5 sm:p-4">
        <CardDescription className="text-[11px] font-semibold uppercase tracking-wide sm:text-xs">
          {title}
        </CardDescription>
        <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-muted text-muted-foreground ring-1 ring-border transition-colors duration-300 group-hover:text-foreground">
          {icon}
        </span>
      </CardHeader>

      <CardContent className="mt-2 flex flex-1 flex-col justify-center p-3.5 pt-0 sm:p-4 sm:pt-0">
        <CardTitle className="text-xl sm:text-2xl">{value}</CardTitle>
        {subtitle ? <CardDescription className="mt-1 text-xs">{subtitle}</CardDescription> : null}
      </CardContent>
    </Card>
  );
}