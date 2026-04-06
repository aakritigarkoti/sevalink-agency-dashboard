import LayoutWrapper from "@/components/layout/LayoutWrapper";

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

const statusStyles: Record<PaymentStatus, string> = {
  Paid: "bg-green-100 text-green-800 ring-green-200",
  Pending: "bg-yellow-100 text-yellow-800 ring-yellow-200",
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
          <h1 className="text-2xl font-bold text-gray-900">Earnings &amp; Revenue</h1>
          <p className="mt-1 text-sm text-gray-600">
            Financial snapshot of completed homecare bookings and pending collections.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <article className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md sm:p-6">
            <p className="text-sm font-medium text-gray-600">Total Revenue</p>
            <p className="mt-3 text-3xl font-bold tracking-tight text-gray-900">₹{totalRevenue.toLocaleString("en-IN")}</p>
            <p className="mt-1 text-xs text-gray-500">Across all listed bookings</p>
          </article>

          <article className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md sm:p-6">
            <p className="text-sm font-medium text-gray-600">This Month Revenue</p>
            <p className="mt-3 text-2xl font-bold tracking-tight text-gray-900">₹{thisMonthRevenue.toLocaleString("en-IN")}</p>
            <p className="mt-1 text-xs text-gray-500">April 2026 collections</p>
          </article>

          <article className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md sm:p-6">
            <p className="text-sm font-medium text-gray-600">Completed Bookings</p>
            <p className="mt-3 text-2xl font-bold tracking-tight text-gray-900">{completedBookings}</p>
            <p className="mt-1 text-xs text-gray-500">Payments successfully received</p>
          </article>

          <article className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md sm:p-6">
            <p className="text-sm font-medium text-gray-600">Pending Payments</p>
            <p className="mt-3 text-2xl font-bold tracking-tight text-gray-900">{pendingPayments}</p>
            <p className="mt-1 text-xs text-gray-500">Require collection follow-up</p>
          </article>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm sm:p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">Earnings Table</h2>
            <span className="text-xs font-medium text-gray-500">8 records</span>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm text-gray-700">
              <thead>
                <tr className="border-b border-gray-200 text-xs font-semibold uppercase tracking-wide text-gray-500">
                  <th className="px-4 py-3">Booking ID</th>
                  <th className="px-4 py-3">Patient Name</th>
                  <th className="px-4 py-3">Service Type</th>
                  <th className="px-4 py-3">Provider Name</th>
                  <th className="px-4 py-3">Date</th>
                  <th className="px-4 py-3">Amount</th>
                  <th className="px-4 py-3">Payment Status</th>
                </tr>
              </thead>

              <tbody>
                {earningsData.map((row) => (
                  <tr
                    key={row.bookingId}
                    className="border-b border-gray-100 transition-colors hover:bg-gray-50"
                  >
                    <td className="px-4 py-4 font-semibold text-gray-900">{row.bookingId}</td>
                    <td className="px-4 py-4 whitespace-nowrap">{row.patientName}</td>
                    <td className="px-4 py-4 whitespace-nowrap">{row.serviceType}</td>
                    <td className="px-4 py-4 whitespace-nowrap">{row.providerName}</td>
                    <td className="px-4 py-4 whitespace-nowrap">{row.date}</td>
                    <td className="px-4 py-4 whitespace-nowrap font-semibold text-gray-900">₹{row.amount.toLocaleString("en-IN")}</td>
                    <td className="px-4 py-4">
                      <span
                        className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset ${statusStyles[row.paymentStatus]}`}
                      >
                        {row.paymentStatus}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">Recent Transactions</h2>
            <span className="text-xs font-medium text-gray-500">Latest payouts</span>
          </div>

          <div className="space-y-3">
            {recentTransactions.map((txn) => (
              <div
                key={txn.id}
                className="flex flex-col gap-2 rounded-xl border border-gray-100 p-4 transition-colors hover:bg-gray-50 sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <p className="text-sm font-semibold text-gray-900">{txn.label}</p>
                  <p className="text-xs text-gray-500">{txn.id} • {txn.time}</p>
                </div>
                <p className="text-sm font-semibold text-gray-900">{txn.amount}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </LayoutWrapper>
  );
}
