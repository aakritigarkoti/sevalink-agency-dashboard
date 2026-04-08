"use client";

import { useEffect, useRef, useState } from "react";
import LayoutWrapper from "@/components/layout/LayoutWrapper";
import StatsCard from "@/components/dashboard/StatsCard";
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

const statusStyles: Record<RecentBookingStatus, string> = {
  Pending: "bg-muted text-muted-foreground ring-border",
  Confirmed: "bg-primary/10 text-primary ring-primary/25",
  "In Progress": "bg-card text-foreground ring-border",
};

export default function DashboardPage() {
  const stats = [
    {
      title: "Total Bookings",
      value: "128",
      subtitle: "+14 this week",
      icon: (
        <svg viewBox="0 0 24 24" className="h-4.5 w-4.5" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="3" y="5" width="18" height="16" rx="2" />
          <path d="M8 3v4M16 3v4M3 10h18" />
        </svg>
      ),
    },
    {
      title: "Active Bookings",
      value: "47",
      subtitle: "11 ongoing now",
      icon: (
        <svg viewBox="0 0 24 24" className="h-4.5 w-4.5" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="9" />
          <path d="M12 7v5l3 2" />
        </svg>
      ),
    },
    {
      title: "Total Providers",
      value: "29",
      subtitle: "16 available today",
      icon: (
        <svg viewBox="0 0 24 24" className="h-4.5 w-4.5" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
      ),
    },
    {
      title: "Total Revenue",
      value: "₹3,48,000",
      subtitle: "+9.4% from last month",
      icon: (
        <svg viewBox="0 0 24 24" className="h-4.5 w-4.5" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M6 3h12M9 8h8M8 8l5 5-5 5" />
        </svg>
      ),
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
      <div className="p-4 space-y-6">
        <div className="space-y-6">
          <div className="space-y-2">
            <h1 className="text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
              Overview
            </h1>
            <p className="max-w-2xl text-sm text-gray-500 dark:text-gray-400 sm:text-base">
              Homecare operations snapshot for bookings, providers, and revenue.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat, index) => (
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
                <span className="text-sm text-gray-500 dark:text-gray-400">Top booked services</span>
              </CardHeader>

              <CardContent className="grid grid-cols-1 gap-3 p-5 pt-0 sm:grid-cols-3 sm:p-6 sm:pt-0 xl:grid-cols-1">
                {topServices.map((service) => (
                  <article
                    key={service.name}
                    className="rounded-2xl border border-border bg-muted/35 p-4 transition-all duration-300 hover:-translate-y-0.5 hover:bg-muted/55"
                  >
                    <p className="text-sm font-semibold text-card-foreground">{service.name}</p>
                    <p className="mt-2 text-2xl font-bold tracking-tight text-card-foreground">{service.bookings}</p>
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{service.note}</p>
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
                <span className="text-sm text-gray-500 dark:text-gray-400">Last 24 hours</span>
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

                    <span
                      className={`inline-flex w-fit rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset ${statusStyles[booking.status]}`}
                    >
                      {booking.status}
                    </span>
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
