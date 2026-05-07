import type { ReactNode } from "react";

import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type EarningsCardTone = "default" | "danger" | "success";

type EarningsCardProps = {
  title: string;
  amount: string;
  subtitle?: string;
  icon: ReactNode;
  tone?: EarningsCardTone;
  className?: string;
};

const toneStyles: Record<EarningsCardTone, string> = {
  default: "border-border/70 bg-card text-card-foreground",
  danger: "border-rose-200/70 bg-rose-50/70 text-rose-900 dark:border-rose-900/60 dark:bg-rose-950/40 dark:text-rose-100",
  success: "border-emerald-200/70 bg-emerald-50/70 text-emerald-900 dark:border-emerald-900/60 dark:bg-emerald-950/40 dark:text-emerald-100",
};

export default function EarningsCard({
  title,
  amount,
  subtitle,
  icon,
  tone = "default",
  className,
}: EarningsCardProps) {
  return (
    <Card
      className={cn(
        "overflow-hidden p-0 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md",
        toneStyles[tone],
        className,
      )}
    >
      <CardContent className="flex min-h-[150px] flex-col justify-between p-5 sm:p-6">
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground dark:text-current/80">{title}</p>
            <h2 className="text-2xl font-semibold tracking-tight">{amount}</h2>
          </div>

          <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-current/20 bg-current/10">
            {icon}
          </span>
        </div>

        {subtitle ? <p className="pt-4 text-xs font-medium text-muted-foreground dark:text-current/70">{subtitle}</p> : null}
      </CardContent>
    </Card>
  );
}
