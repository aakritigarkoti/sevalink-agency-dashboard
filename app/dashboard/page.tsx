"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { CalendarDays, CircleDollarSign, Clock3, Users, Wallet } from "lucide-react";
import { toast } from "sonner";
import EditProfileModal from "@/components/EditProfileModal";
import LayoutWrapper from "@/components/layout/LayoutWrapper";
import StatsCard from "@/components/dashboard/StatsCard";
import EarningsCard from "@/components/dashboard/EarningsCard";
import EarningsBreakdown from "@/components/dashboard/EarningsBreakdown";
import PageHeader from "@/components/dashboard/PageHeader";
import SectionCard from "@/components/dashboard/SectionCard";
import StatusBadge from "@/components/dashboard/StatusBadge";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { AgencyProfile, ApiError, getAgencyProfile } from "@/lib/api";
import { clearAuthSession, getStoredToken } from "@/lib/local-auth";

type RecentBookingStatus = "Pending" | "Confirmed" | "In Progress";

type RecentBooking = {
  patientName: string;
  service: string;
  status: RecentBookingStatus;
};

const recentBookings: RecentBooking[] = [
  {
    patientName: "Ananya Sharma",
    service: "Nursing Care",
    status: "Confirmed",
  },
  {
    patientName: "Rohan Verma",
    service: "Physiotherapy",
    status: "In Progress",
  },
  {
    patientName: "Meera Iyer",
    service: "Elderly Care",
    status: "Pending",
  },
  {
    patientName: "Arjun Patel",
    service: "Lab Tests",
    status: "Confirmed",
  },
  {
    patientName: "Pooja Nair",
    service: "Doctor Visit",
    status: "Pending",
  },
];

const topServices = [
  {
    name: "Nursing Care",
    bookings: 42,
    note: "Most requested this week",
  },
  {
    name: "Physiotherapy",
    bookings: 31,
    note: "Strong repeat demand",
  },
  {
    name: "Elderly Care",
    bookings: 24,
    note: "High long-term retention",
  },
];

const statusTones: Record<RecentBookingStatus, "warning" | "success" | "info"> = {
  Pending: "warning",
  Confirmed: "success",
  "In Progress": "info",
};

const commissionRate = 0.12;

const financialSnapshot = {
  totalBookings: 128,
  activeBookings: 47,
  totalProviders: 29,
  totalBookingValue: 348000,
  walletBalance: 92400,
};

const timeRangeOptions = [
  { value: "7-days", label: "Last 7 days" },
  { value: "30-days", label: "Last 30 days" },
  { value: "3-months", label: "Last 3 months" },
];

const currencyFormatter = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

const formatInr = (amount: number) => currencyFormatter.format(amount);

export default function DashboardPage() {
  const router = useRouter();

  const commissionDeducted = Math.round(financialSnapshot.totalBookingValue * commissionRate);
  const totalEarnings = financialSnapshot.totalBookingValue - commissionDeducted;
  const netEarnings = totalEarnings;

  const operationalStats = [
    {
      title: "Total Bookings",
      value: financialSnapshot.totalBookings.toString(),
      subtitle: "+14 this week",
      icon: <CalendarDays className="h-4.5 w-4.5" />,
    },
    {
      title: "Active Bookings",
      value: financialSnapshot.activeBookings.toString(),
      subtitle: "11 ongoing now",
      icon: <Clock3 className="h-4.5 w-4.5" />,
    },
    {
      title: "Total Providers",
      value: financialSnapshot.totalProviders.toString(),
      subtitle: "16 available today",
      icon: <Users className="h-4.5 w-4.5" />,
    },
  ];

  const earningsStats = [
    {
      title: "Total Earnings",
      amount: formatInr(totalEarnings),
      subtitle: "After platform commission",
      tone: "default" as const,
      icon: <CircleDollarSign className="h-4.5 w-4.5" />,
    },
    {
      title: "Platform Commission",
      amount: formatInr(commissionDeducted),
      subtitle: "12% commission",
      tone: "danger" as const,
      icon: <CircleDollarSign className="h-4.5 w-4.5" />,
    },
    {
      title: "Net Earnings",
      amount: formatInr(netEarnings),
      subtitle: "Final payout to agency",
      tone: "success" as const,
      icon: <CircleDollarSign className="h-4.5 w-4.5" />,
    },
    {
      title: "Wallet Balance",
      amount: formatInr(financialSnapshot.walletBalance),
      subtitle: "Withdrawals coming soon",
      tone: "default" as const,
      icon: <Wallet className="h-4.5 w-4.5" />,
    },
  ];

  const [visibleSections, setVisibleSections] = useState({
    services: false,
    recent: false,
  });
  const [profile, setProfile] = useState<AgencyProfile | null>(null);
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [timeRange, setTimeRange] = useState(timeRangeOptions[0].value);
  const servicesSectionRef = useRef<HTMLDivElement | null>(null);
  const recentSectionRef = useRef<HTMLDivElement | null>(null);

  const handleUnauthorized = useCallback(() => {
    clearAuthSession();
    router.replace("/login");
  }, [router]);

  const fetchProfile = useCallback(async () => {
    const token = getStoredToken();

    if (!token) {
      handleUnauthorized();
      return;
    }

    try {
      setIsLoadingProfile(true);
      const data = await getAgencyProfile();
      setProfile(data);
    } catch (error) {
      if (error instanceof ApiError) {
        if (error.status === 401) {
          handleUnauthorized();
          return;
        }

        if (error.status === 403) {
          toast.error("Unauthorized");
          return;
        }

        if (error.status >= 500) {
          toast.error("Something went wrong. Please try again.");
        }
      }
    } finally {
      setIsLoadingProfile(false);
    }
  }, [handleUnauthorized]);

  useEffect(() => {
    void fetchProfile();
  }, [fetchProfile]);

  useEffect(() => {
    const sectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) {
            return;
          }

          const sectionName = entry.target.getAttribute("data-section");
          if (!sectionName) {
            return;
          }

          setVisibleSections((current) => {
            if (sectionName === "services" && current.services) {
              return current;
            }

            if (sectionName === "recent" && current.recent) {
              return current;
            }

            return {
              ...current,
              [sectionName]: true,
            };
          });

          sectionObserver.unobserve(entry.target);
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -8% 0px" },
    );

    if (servicesSectionRef.current) {
      sectionObserver.observe(servicesSectionRef.current);
    }

    if (recentSectionRef.current) {
      sectionObserver.observe(recentSectionRef.current);
    }

    return () => sectionObserver.disconnect();
  }, []);

  return (
    <LayoutWrapper>
      <div className="space-y-6">
        <PageHeader
          eyebrow="Agency overview"
          title="Dashboard"
          description={`A compact view of bookings, provider coverage, and earnings flow for ${profile?.agencyName || "the SevaLink"} agency workspace.`}
          badge={<Badge variant="outline" className="rounded-full px-2.5 py-0.5 text-[11px] font-semibold">Live</Badge>}
        />

        <Card className="border-border/70 bg-card/90">
          <CardContent className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
            <div>
              <p className="text-sm font-semibold text-card-foreground">Financial Overview</p>
              <p className="text-xs text-muted-foreground">Track your earnings, commissions, and payouts in real time.</p>
            </div>
            <div className="flex flex-col gap-1.5 sm:items-end">
              <label htmlFor="financial-time-range" className="text-xs font-medium text-muted-foreground">
                Time Range
              </label>
              <Select value={timeRange} onValueChange={setTimeRange}>
                <SelectTrigger id="financial-time-range" size="sm" className="w-full sm:w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent align="end">
                  {timeRangeOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {isLoadingProfile ? (
          <Card className="border-border/70 bg-card/80">
            <CardHeader className="flex flex-row items-start justify-between gap-4 pb-0">
              <CardTitle className="text-sm uppercase tracking-[0.16em] text-muted-foreground">Agency Profile</CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div key={i}>
                    <Skeleton className="h-3 w-24 mb-2" />
                    <Skeleton className="h-5 w-full max-w-[150px]" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ) : profile ? (
          <Card className="border-border/70 bg-card/80">
            <CardHeader className="flex flex-row items-start justify-between gap-4 pb-0">
              <CardTitle className="text-sm uppercase tracking-[0.16em] text-muted-foreground">Agency Profile</CardTitle>
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={() => setIsEditProfileOpen(true)}
              >
                Edit Profile
              </Button>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                <div>
                  <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider mb-1">Agency Name</p>
                  <p className="text-sm font-semibold text-card-foreground">{profile.agencyName || "N/A"}</p>
                </div>
                <div>
                  <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider mb-1">Registration No.</p>
                  <p className="text-sm font-semibold text-card-foreground">{profile.registrationNumber || "N/A"}</p>
                </div>
                <div>
                  <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider mb-1">GST Number</p>
                  <p className="text-sm font-semibold text-card-foreground">{profile.gstNumber || "N/A"}</p>
                </div>
                <div>
                  <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider mb-1">Contact Person</p>
                  <p className="text-sm font-semibold text-card-foreground">{profile.contactPerson || "N/A"}</p>
                </div>
                <div>
                  <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider mb-1">Contact Phone</p>
                  <p className="text-sm font-semibold text-card-foreground">{profile.contactPhone || profile.phone || "N/A"}</p>
                </div>
                <div>
                  <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider mb-1">Contact Email</p>
                  <p className="text-sm font-semibold text-card-foreground">{profile.contactEmail || "N/A"}</p>
                </div>
                <div>
                  <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider mb-1">Account Owner</p>
                  <p className="text-sm font-semibold text-card-foreground">{profile.userName || profile.name || "N/A"}</p>
                </div>
                <div>
                  <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider mb-1">Owner Phone</p>
                  <p className="text-sm font-semibold text-card-foreground">{profile.userPhone || "N/A"}</p>
                </div>
              </div>
            </CardContent>
            <EditProfileModal
              open={isEditProfileOpen}
              profile={profile}
              onOpenChange={setIsEditProfileOpen}
              onUpdated={setProfile}
              onUnauthorized={handleUnauthorized}
            />
          </Card>
        ) : null}

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {operationalStats.map((stat) => (
            <StatsCard
              key={stat.title}
              title={stat.title}
              value={stat.value}
              subtitle={stat.subtitle}
              icon={stat.icon}
            />
          ))}

          {earningsStats.map((stat) => (
            <EarningsCard
              key={stat.title}
              title={stat.title}
              amount={stat.amount}
              subtitle={stat.subtitle}
              icon={stat.icon}
              tone={stat.tone}
            />
          ))}
        </div>

        <p className="text-xs text-muted-foreground">
          Earnings are credited after booking completion.
        </p>

        <div className="grid grid-cols-1 gap-6 xl:grid-cols-5">
          <EarningsBreakdown
            totalBookingValue={formatInr(financialSnapshot.totalBookingValue)}
            commissionDeducted={formatInr(commissionDeducted)}
            netEarnings={formatInr(netEarnings)}
          />
        </div>

        <div className="grid grid-cols-1 gap-6 xl:grid-cols-5">
          <SectionCard
            title="Service Distribution"
            description="Top booked services this week"
            action={<Badge variant="outline" className="rounded-full px-2.5 py-0.5 text-[11px] font-semibold">3 key services</Badge>}
            className={`animate-fade-up xl:col-span-2 ${visibleSections.services ? "translate-y-0 opacity-100" : "translate-y-5 opacity-0"}`}
            bodyClassName="pt-5"
          >
            <div ref={servicesSectionRef} data-section="services" className="grid grid-cols-1 gap-3 sm:grid-cols-3 xl:grid-cols-1">
              {topServices.map((service) => (
                <article
                  key={service.name}
                  className="rounded-2xl border border-border/70 bg-muted/30 p-4 transition-all duration-300 hover:-translate-y-0.5 hover:bg-muted/50"
                >
                  <p className="text-sm font-semibold text-card-foreground">{service.name}</p>
                  <p className="mt-2 text-2xl font-semibold tracking-tight text-card-foreground">{service.bookings}</p>
                  <p className="mt-1 text-sm text-muted-foreground">{service.note}</p>
                </article>
              ))}
            </div>
          </SectionCard>

          <SectionCard
            title="Recent Bookings"
            description="Last 24 hours"
            action={<Badge variant="secondary" className="rounded-full px-2.5 py-0.5 text-[11px] font-semibold">5 requests</Badge>}
            className={`animate-fade-up xl:col-span-3 ${visibleSections.recent ? "translate-y-0 opacity-100" : "translate-y-5 opacity-0"}`}
            bodyClassName="pt-5"
          >
            <div ref={recentSectionRef} data-section="recent" className="space-y-3" style={{ transitionDelay: "120ms" }}>
              {recentBookings.map((booking) => (
                <div
                  key={booking.patientName}
                  className="flex flex-col gap-3 rounded-2xl border border-border/70 bg-muted/20 p-4 transition-all duration-300 hover:-translate-y-0.5 hover:bg-muted/40 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div>
                    <p className="text-sm font-semibold text-card-foreground">{booking.patientName}</p>
                    <p className="text-sm text-muted-foreground">{booking.service}</p>
                  </div>

                  <StatusBadge tone={statusTones[booking.status]}>{booking.status}</StatusBadge>
                </div>
              ))}
            </div>
          </SectionCard>
        </div>
      </div>
    </LayoutWrapper>
  );
}
