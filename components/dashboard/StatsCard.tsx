"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

type Props = {
  title: string;
  value: string;
  subtitle?: string;
  icon: React.ReactNode;
};

export default function StatsCard({ title, value, subtitle, icon }: Props) {
  return (
    <Card className="group overflow-hidden border-border/70 bg-card p-0 transition-all duration-300 hover:shadow-md dark:border-border/40">
      <CardContent className="flex h-full min-h-[152px] flex-col justify-between p-5 sm:p-6">
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground transition-colors duration-300">
              {title}
            </p>
            <h2 className="text-2xl font-semibold tracking-tight text-foreground transition-colors duration-300">
              {value}
            </h2>
          </div>

          <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-border bg-muted text-muted-foreground transition-colors duration-300 group-hover:bg-muted/80 group-hover:text-foreground dark:border-border/50">
            {icon}
          </span>
        </div>

        {subtitle ? (
          <div className="pt-4">
            <Badge variant="secondary" className="rounded-md px-2.5 py-0.5 text-[11px] font-medium">
              {subtitle}
            </Badge>
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}