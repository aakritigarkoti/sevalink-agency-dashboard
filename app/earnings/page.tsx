import LayoutWrapper from "@/components/layout/LayoutWrapper";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

type PaymentStatus = "Paid" | "Pending";

type EarningRow = {
  bookingId: string;
  patientName: string;
  serviceType: string;
  providerName: string;
  date: string;
  amount: number;
  paymentStatus: PaymentStatus;
};

const earningsData: EarningRow[] = [
  {
    bookingId: "BK-1041",
    patientName: "Ananya Sharma",
    serviceType: "Nursing Care",
    providerName: "Sonal Mehta",
    date: "04 Apr 2026",
    amount: 2400,
    paymentStatus: "Paid",
  },
  {
    bookingId: "BK-1042",
    patientName: "Rohan Verma",
    serviceType: "Physiotherapy",
    providerName: "Ritesh Kulkarni",
    date: "05 Apr 2026",
    amount: 1200,
    paymentStatus: "Paid",
  },
  {
    bookingId: "BK-1043",
    patientName: "Meera Iyer",
    serviceType: "Elderly Care",
    providerName: "Neha Trivedi",
    date: "06 Apr 2026",
    amount: 1500,
    paymentStatus: "Pending",
  },
  {
    bookingId: "BK-1044",
    patientName: "Arjun Patel",
    serviceType: "Lab Tests",
    providerName: "Dr. Pooja Nair",
    date: "06 Apr 2026",
    amount: 800,
    paymentStatus: "Paid",
  },
  {
    bookingId: "BK-1045",
    patientName: "Priya Nair",
    serviceType: "Doctor Visit",
    providerName: "Dr. Karan Shah",
    date: "07 Apr 2026",
    amount: 1100,
    paymentStatus: "Pending",
  },
  {
    bookingId: "BK-1046",
    patientName: "Vikram Singh",
    serviceType: "Post-Surgery Care",
    providerName: "Yashvi Desai",
    date: "07 Apr 2026",
    amount: 2800,
    paymentStatus: "Paid",
  },
  {
    bookingId: "BK-1047",
    patientName: "Sneha Kulkarni",
    serviceType: "Mother & Baby",
    providerName: "Aditi Rao",
    date: "08 Apr 2026",
    amount: 1800,
    paymentStatus: "Paid",
  },
  {
    bookingId: "BK-1048",
    patientName: "Farah Naqvi",
    serviceType: "Chronic Care",
    providerName: "Manish Parmar",
    date: "08 Apr 2026",
    amount: 2200,
    paymentStatus: "Pending",
  },
];

const statusVariants: Record<PaymentStatus, "default" | "secondary"> = {
  Paid: "default",
  Pending: "secondary",
};

const totalRevenue = earningsData.reduce((sum, row) => sum + row.amount, 0);
const thisMonthRevenue = earningsData
  .filter((row) => row.date.includes("Apr 2026"))
  .reduce((sum, row) => sum + row.amount, 0);
const completedBookings = earningsData.filter((row) => row.paymentStatus === "Paid").length;
const pendingPayments = earningsData.filter((row) => row.paymentStatus === "Pending").length;

const recentTransactions = [
  { id: "TXN-8821", label: "Payout to Sonal Mehta", amount: "₹1,920", time: "Today, 09:45 AM" },
  { id: "TXN-8818", label: "Payout to Ritesh Kulkarni", amount: "₹960", time: "Today, 08:20 AM" },
  { id: "TXN-8811", label: "Gateway settlement", amount: "₹4,700", time: "Yesterday, 06:15 PM" },
];

export default function EarningsPage() {
  return (
    <LayoutWrapper>
      <section className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Earnings &amp; Revenue</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Financial snapshot of completed homecare bookings and pending collections.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card className="animate-fade-up p-4 transition-all hover:shadow-md">
            <div className="flex items-center justify-between gap-2">
              <p className="text-sm text-muted-foreground">Total Revenue</p>
              <Badge variant="default">All time</Badge>
            </div>
            <p className="mt-2 text-2xl font-bold tracking-tight text-foreground">₹{totalRevenue.toLocaleString("en-IN")}</p>
            <p className="mt-1 text-xs text-muted-foreground">Across all listed bookings</p>
          </Card>

          <Card className="animate-fade-up p-4 transition-all hover:shadow-md">
            <div className="flex items-center justify-between gap-2">
              <p className="text-sm text-muted-foreground">This Month Revenue</p>
              <Badge variant="secondary">Apr 2026</Badge>
            </div>
            <p className="mt-2 text-2xl font-bold tracking-tight text-card-foreground">₹{thisMonthRevenue.toLocaleString("en-IN")}</p>
            <p className="mt-1 text-xs text-muted-foreground">April 2026 collections</p>
          </Card>

          <Card className="animate-fade-up p-4 transition-all hover:shadow-md">
            <div className="flex items-center justify-between gap-2">
              <p className="text-sm text-muted-foreground">Completed Bookings</p>
              <Badge variant="default">Paid</Badge>
            </div>
            <p className="mt-2 text-2xl font-bold tracking-tight text-card-foreground">{completedBookings}</p>
            <p className="mt-1 text-xs text-muted-foreground">Payments successfully received</p>
          </Card>

          <Card className="animate-fade-up p-4 transition-all hover:shadow-md">
            <div className="flex items-center justify-between gap-2">
              <p className="text-sm text-muted-foreground">Pending Payments</p>
              <Badge variant="secondary">Pending</Badge>
            </div>
            <p className="mt-2 text-2xl font-bold tracking-tight text-card-foreground">{pendingPayments}</p>
            <p className="mt-1 text-xs text-muted-foreground">Require collection follow-up</p>
          </Card>
        </div>

        <Card className="p-4 sm:p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-card-foreground">Earnings Table</h2>
            <span className="text-xs font-medium text-muted-foreground">8 records</span>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-[13px] text-muted-foreground">
              <thead>
                <tr className="border-b border-border bg-muted/40 text-[11px] font-semibold text-foreground">
                  <th className="px-4 py-3.5">Booking ID</th>
                  <th className="px-4 py-3.5">Patient name</th>
                  <th className="px-4 py-3.5">Service type</th>
                  <th className="px-4 py-3.5">Provider name</th>
                  <th className="px-4 py-3.5">Date</th>
                  <th className="px-4 py-3.5 text-right">Amount</th>
                  <th className="px-4 py-3.5">Payment status</th>
                </tr>
              </thead>

              <tbody>
                {earningsData.map((row, index) => (
                  <tr
                    key={row.bookingId}
                    className={`border-b border-border/70 transition-colors hover:bg-muted/30 ${
                      index % 2 === 0 ? "bg-background" : "bg-muted/15"
                    }`}
                  >
                    <td className="px-4 py-3.5 font-semibold text-foreground">{row.bookingId}</td>
                    <td className="px-4 py-3.5 whitespace-nowrap">{row.patientName}</td>
                    <td className="px-4 py-3.5 whitespace-nowrap">{row.serviceType}</td>
                    <td className="px-4 py-3.5 whitespace-nowrap">{row.providerName}</td>
                    <td className="px-4 py-3.5 whitespace-nowrap">{row.date}</td>
                    <td className="px-4 py-3.5 whitespace-nowrap text-right font-semibold text-foreground">₹{row.amount.toLocaleString("en-IN")}</td>
                    <td className="px-4 py-3.5">
                      <Badge variant={statusVariants[row.paymentStatus]}>
                        {row.paymentStatus}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        <Card className="p-5 sm:p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-card-foreground">Recent Transactions</h2>
            <span className="text-xs font-medium text-muted-foreground">Latest payouts</span>
          </div>

          <div className="space-y-2.5">
            {recentTransactions.map((txn) => (
              <div
                key={txn.id}
                className="flex items-center justify-between gap-3 rounded-xl border border-border bg-background p-3.5 transition-colors hover:bg-muted/20"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-card-foreground">{txn.label}</p>
                  <p className="text-xs text-muted-foreground">{txn.id} • {txn.time}</p>
                </div>
                <p className="shrink-0 text-base font-semibold text-foreground">{txn.amount}</p>
              </div>
            ))}
          </div>
        </Card>
      </section>
    </LayoutWrapper>
  );
}
