"use client";

import {
  Badge,
} from "@/components/ui/badge";
import {
  Card,
  CardContent,
} from "@/components/ui/card";

type Props = {
  title: string;
  value: string;
  subtitle?: string;
  icon: React.ReactNode;
};

export default function StatsCard({ title, value, subtitle, icon }: Props) {
  return (
    <Card className="group p-4 transition-all hover:shadow-md">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm text-muted-foreground">{title}</p>
        <span className="inline-flex shrink-0 rounded-lg bg-muted p-2 text-muted-foreground transition-colors duration-300 group-hover:text-foreground">
          {icon}
        </span>
      </div>

      <CardContent className="mt-2 flex min-w-0 flex-col space-y-2 p-0">
        <h2 className="max-w-full overflow-hidden text-ellipsis whitespace-nowrap text-2xl font-bold leading-tight text-foreground md:text-3xl">
          {value}
        </h2>
        {subtitle ? (
          <Badge variant="secondary" className="w-fit">
            {subtitle}
          </Badge>
        ) : null}
      </CardContent>
    </Card>
  );
}