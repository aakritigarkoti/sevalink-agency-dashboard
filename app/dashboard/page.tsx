"use client";

import { useEffect, useRef, useState } from "react";
import { CalendarDays, CircleDollarSign, Clock3, Users } from "lucide-react";
import LayoutWrapper from "@/components/layout/LayoutWrapper";
import StatsCard from "@/components/dashboard/StatsCard";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

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

const statusVariants: Record<RecentBookingStatus, "secondary" | "default" | "outline"> = {
  Pending: "secondary",
  Confirmed: "default",
  "In Progress": "outline",
};

export default function DashboardPage() {
  const stats = [
    {
      title: "Total Bookings",
      value: "128",
      subtitle: "+14 this week",
      icon: <CalendarDays className="h-4.5 w-4.5" />,
    },
    {
      title: "Active Bookings",
      value: "47",
      subtitle: "11 ongoing now",
      icon: <Clock3 className="h-4.5 w-4.5" />,
    },
    {
      title: "Total Providers",
      value: "29",
      subtitle: "16 available today",
      icon: <Users className="h-4.5 w-4.5" />,
    },
    {
      title: "Total Revenue",
      value: "₹3,48,000",
      subtitle: "+9.4% from last month",
      icon: <CircleDollarSign className="h-4.5 w-4.5" />,
    },
  ];

  const [visibleSections, setVisibleSections] = useState({
    services: false,
    recent: false,
  });
  const servicesSectionRef = useRef<HTMLDivElement | null>(null);
  const recentSectionRef = useRef<HTMLDivElement | null>(null);

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
        <div className="space-y-6">
          <div className="space-y-2">
            <h1 className="text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
              Overview
            </h1>
            <p className="max-w-2xl text-sm text-muted-foreground sm:text-base">
              Homecare operations snapshot for bookings, providers, and revenue.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat) => (
              <StatsCard
                key={stat.title}
                title={stat.title}
                value={stat.value}
                subtitle={stat.subtitle}
                icon={stat.icon}
              />
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 xl:grid-cols-5">
          <div className="space-y-4 xl:col-span-2">
            <Card
              ref={servicesSectionRef}
              data-section="services"
              className={`animate-fade-up p-0 transition-all duration-500 ease-in-out ${
                visibleSections.services ? "translate-y-0 opacity-100" : "translate-y-5 opacity-0"
              }`}
            >
              <CardHeader className="flex flex-row items-center justify-between gap-3 p-5 sm:p-6">
                <CardTitle className="text-xl font-semibold">Service Distribution</CardTitle>
                <span className="text-sm text-muted-foreground">Top booked services</span>
              </CardHeader>

              <CardContent className="grid grid-cols-1 gap-3 p-5 pt-0 sm:grid-cols-3 sm:p-6 sm:pt-0 xl:grid-cols-1">
                {topServices.map((service) => (
                  <article
                    key={service.name}
                    className="rounded-2xl border border-border bg-muted/35 p-4 transition-all duration-300 hover:-translate-y-0.5 hover:bg-muted/55"
                  >
                    <p className="text-sm font-semibold text-card-foreground">{service.name}</p>
                    <p className="mt-2 text-2xl font-bold tracking-tight text-card-foreground">{service.bookings}</p>
                    <p className="mt-1 text-sm text-muted-foreground">{service.note}</p>
                  </article>
                ))}
              </CardContent>
            </Card>
          </div>

          <div className="space-y-4 xl:col-span-3">
            <Card
              ref={recentSectionRef}
              data-section="recent"
              style={{ transitionDelay: "120ms" }}
              className={`animate-fade-up p-0 transition-all duration-500 ease-in-out ${
                visibleSections.recent ? "translate-y-0 opacity-100" : "translate-y-5 opacity-0"
              }`}
            >
              <CardHeader className="flex flex-row items-center justify-between gap-3 p-5 sm:p-6">
                <CardTitle className="text-xl font-semibold">Recent Bookings</CardTitle>
                <span className="text-sm text-muted-foreground">Last 24 hours</span>
              </CardHeader>

              <CardContent className="space-y-3 p-5 pt-0 sm:p-6 sm:pt-0">
                {recentBookings.map((booking) => (
                  <div
                    key={booking.patientName}
                    className="flex flex-col gap-3 rounded-2xl border border-border bg-muted/20 p-4 transition-all duration-300 hover:-translate-y-0.5 hover:bg-muted/35 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div>
                      <p className="text-sm font-semibold text-card-foreground">{booking.patientName}</p>
                      <p className="text-sm text-muted-foreground">{booking.service}</p>
                    </div>

                    <Badge variant={statusVariants[booking.status]}>
                      {booking.status}
                    </Badge>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </LayoutWrapper>
  );
}
