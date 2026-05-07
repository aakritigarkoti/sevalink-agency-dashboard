import SectionCard from "@/components/dashboard/SectionCard";
import { Badge } from "@/components/ui/badge";

type EarningsBreakdownProps = {
  totalBookingValue: string;
  commissionDeducted: string;
  netEarnings: string;
};

type BreakdownRowProps = {
  label: string;
  value: string;
  valueClassName?: string;
  emphasize?: boolean;
};

function BreakdownRow({ label, value, valueClassName, emphasize = false }: BreakdownRowProps) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-xl border border-border/70 bg-muted/20 px-4 py-3">
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className={emphasize ? `text-base font-semibold ${valueClassName || "text-card-foreground"}` : `text-sm font-medium ${valueClassName || "text-card-foreground"}`}>
        {value}
      </p>
    </div>
  );
}

export default function EarningsBreakdown({
  totalBookingValue,
  commissionDeducted,
  netEarnings,
}: EarningsBreakdownProps) {
  return (
    <SectionCard
      title="Earnings Breakdown"
      description="Phase 3 financial split for completed bookings"
      action={
        <Badge variant="outline" className="rounded-full px-2.5 py-0.5 text-[11px] font-semibold">
          Commission 12%
        </Badge>
      }
      className="xl:col-span-2"
      bodyClassName="space-y-3"
    >
      <BreakdownRow label="Total Booking Value" value={totalBookingValue} />
      <BreakdownRow
        label="Commission Deducted (12%)"
        value={`-${commissionDeducted}`}
        valueClassName="text-rose-600 dark:text-rose-300"
      />
      <BreakdownRow label="Net Earnings" value={netEarnings} emphasize />
    </SectionCard>
  );
}
