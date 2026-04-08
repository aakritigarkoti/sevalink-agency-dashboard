"use client";

import { useMemo, useState } from "react";
import LayoutWrapper from "@/components/layout/LayoutWrapper";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

type BookingStatus = "Pending" | "Confirmed" | "In Progress" | "Completed";

type Booking = {
  id: number;
  patientName: string;
  serviceType: string;
  duration: string;
  bookingDate: string;
  dateTime: string;
  price: string;
  status: BookingStatus;
  assignedProvider: string | null;
};

type ProviderOption = {
  id: string;
  label: string;
};

const providerOptions: ProviderOption[] = [
  {
    id: "nurse-priya",
    label: "Nurse Priya (Nursing Care, 5 yrs exp)",
  },
  {
    id: "rahul-verma",
    label: "Rahul Verma (Physiotherapist, 3 yrs exp)",
  },
  {
    id: "sunita-devi",
    label: "Sunita Devi (Elderly Care, 6 yrs exp)",
  },
];

const serviceFilterOptions = [
  "All",
  "Nursing Care",
  "Physiotherapy",
  "Elderly Care",
  "Post-Surgery Care",
  "Lab Tests",
  "Doctor Visit",
] as const;

type ServiceFilter = (typeof serviceFilterOptions)[number];

type StatusFilter = "All" | BookingStatus;

const initialBookings: Booking[] = [
  {
    id: 1,
    patientName: "Ananya Sharma",
    serviceType: "Nursing Care",
    duration: "4 hours",
    bookingDate: "2026-04-08",
    dateTime: "08 Apr 2026, 10:30 AM",
    price: "₹2,400",
    status: "Pending",
    assignedProvider: null,
  },
  {
    id: 2,
    patientName: "Rohan Verma",
    serviceType: "Physiotherapy",
    duration: "1 hour",
    bookingDate: "2026-04-09",
    dateTime: "09 Apr 2026, 04:00 PM",
    price: "₹1,200",
    status: "Confirmed",
    assignedProvider: "Rahul Verma",
  },
  {
    id: 3,
    patientName: "Meera Iyer",
    serviceType: "Post-Surgery Care",
    duration: "4 hours",
    bookingDate: "2026-04-10",
    dateTime: "10 Apr 2026, 09:00 AM",
    price: "₹2,800",
    status: "In Progress",
    assignedProvider: "Nurse Priya",
  },
  {
    id: 4,
    patientName: "Vikram Singh",
    serviceType: "Elderly Care",
    duration: "2 hours",
    bookingDate: "2026-04-11",
    dateTime: "11 Apr 2026, 12:15 PM",
    price: "₹1,500",
    status: "Completed",
    assignedProvider: "Sunita Devi",
  },
  {
    id: 5,
    patientName: "Priya Nair",
    serviceType: "Lab Tests",
    dateTime: "12 Apr 2026, 07:45 PM",
    duration: "1 hour",
    bookingDate: "2026-04-12",
    price: "₹900",
    status: "Confirmed",
    assignedProvider: null,
  },
  {
    id: 6,
    patientName: "Arjun Patel",
    serviceType: "Doctor Visit",
    duration: "1 hour",
    bookingDate: "2026-04-13",
    dateTime: "13 Apr 2026, 11:15 AM",
    price: "₹1,100",
    status: "Pending",
    assignedProvider: null,
  },
  {
    id: 7,
    patientName: "Sneha Kulkarni",
    serviceType: "Mother & Baby",
    duration: "2 hours",
    bookingDate: "2026-04-13",
    dateTime: "13 Apr 2026, 06:00 PM",
    price: "₹1,800",
    status: "In Progress",
    assignedProvider: null,
  },
];

const statusStyles: Record<BookingStatus, string> = {
  Pending: "bg-muted text-muted-foreground ring-border",
  Confirmed: "bg-primary/10 text-primary ring-primary/25",
  "In Progress": "bg-card text-foreground ring-border",
  Completed: "bg-primary/15 text-primary ring-primary/30",
};

export default function BookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>(initialBookings);
  const [activeBookingId, setActiveBookingId] = useState<number | null>(null);
  const [selectedProvider, setSelectedProvider] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("All");
  const [serviceFilter, setServiceFilter] = useState<ServiceFilter>("All");
  const [dateFilter, setDateFilter] = useState("");

  const activeBooking = bookings.find((booking) => booking.id === activeBookingId) ?? null;
  const filteredBookings = bookings.filter((booking) => {
    const matchesSearch = booking.patientName
      .toLowerCase()
      .includes(searchQuery.trim().toLowerCase());

    const matchesStatus = statusFilter === "All" || booking.status === statusFilter;
    const matchesService = serviceFilter === "All" || booking.serviceType === serviceFilter;
    const matchesDate = !dateFilter || booking.bookingDate === dateFilter;

    return matchesSearch && matchesStatus && matchesService && matchesDate;
  });

  const calendarDays = useMemo(
    () =>
      [8, 9, 10, 11, 12, 13, 14].map((day) => {
        const dateKey = `2026-04-${String(day).padStart(2, "0")}`;
        const count = bookings.filter((booking) => booking.bookingDate === dateKey).length;

        return {
          day,
          count,
        };
      }),
    [bookings],
  );

  function openAssignModal(bookingId: number) {
    setActiveBookingId(bookingId);
    setSelectedProvider("");
  }

  function closeAssignModal() {
    setActiveBookingId(null);
    setSelectedProvider("");
  }

  function handleConfirmAssign() {
    if (!activeBooking || !selectedProvider) {
      return;
    }

    const providerLabel =
      providerOptions.find((option) => option.id === selectedProvider)?.label ?? "";
    const providerName = providerLabel.split(" (")[0];

    setBookings((currentBookings) =>
      currentBookings.map((booking) => {
        if (booking.id !== activeBooking.id) {
          return booking;
        }

        return {
          ...booking,
          assignedProvider: providerName,
          status: booking.status === "Pending" ? "Confirmed" : booking.status,
        };
      }),
    );

    closeAssignModal();
  }

  function resetFilters() {
    setSearchQuery("");
    setStatusFilter("All");
    setServiceFilter("All");
    setDateFilter("");
  }

  return (
    <LayoutWrapper>
      <section className="space-y-6">
        <div className="space-y-1.5">
          <h1 className="text-xl font-semibold tracking-tight text-foreground">Bookings</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">Manage and assign service requests from one place.</p>
        </div>

        <Card className="p-4 transition-all duration-300 hover:shadow-md sm:p-6">
          <p className="mb-3 text-sm font-medium text-gray-500 dark:text-gray-400">Filters</p>
          <div className="grid grid-cols-1 gap-3 md:grid-cols-12">
            <div className="md:col-span-12">
              <input
                type="text"
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder="Search by patient name..."
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground outline-none ring-ring/50 placeholder:text-muted-foreground focus:ring-2"
              />
            </div>

            <div className="md:col-span-6 lg:col-span-4">
              <select
                value={statusFilter}
                onChange={(event) => setStatusFilter(event.target.value as StatusFilter)}
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground outline-none ring-ring/50 focus:ring-2"
              >
                <option value="All">All Statuses</option>
                <option value="Pending">Pending</option>
                <option value="Confirmed">Confirmed</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
              </select>
            </div>

            <div className="md:col-span-6 lg:col-span-4">
              <select
                value={serviceFilter}
                onChange={(event) => setServiceFilter(event.target.value as ServiceFilter)}
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground outline-none ring-ring/50 focus:ring-2"
              >
                {serviceFilterOptions.map((service) => (
                  <option key={service} value={service}>
                    {service === "All" ? "All Services" : service}
                  </option>
                ))}
              </select>
            </div>

            <div className="md:col-span-8 lg:col-span-3">
              <input
                type="date"
                value={dateFilter}
                onChange={(event) => setDateFilter(event.target.value)}
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground outline-none ring-ring/50 focus:ring-2"
              />
            </div>

            <div className="md:col-span-4 lg:col-span-1">
              <Button
                onClick={resetFilters}
                variant="secondary"
                className="w-full"
              >
                Reset
              </Button>
            </div>
          </div>

          <div className="my-6 h-px bg-border" />

          <div className="mb-6 rounded-2xl border border-border bg-muted/20 p-4 transition-all duration-300 hover:shadow-md sm:p-5">
            <div className="flex items-center justify-between gap-3">
              <div>
                <h2 className="text-xl font-semibold tracking-tight text-foreground">Calendar Booking View</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">Week overview for confirmed and pending bookings</p>
              </div>
              <span className="rounded-full bg-background px-3 py-1 text-xs font-semibold text-muted-foreground ring-1 ring-border">
                Apr 2026
              </span>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-7">
              {calendarDays.map((day) => (
                <div
                  key={day.day}
                  className={`rounded-xl border p-3 transition-all duration-300 ${
                    day.count > 0
                      ? "border-primary/20 bg-primary/5 hover:shadow-md"
                      : "border-border bg-background hover:bg-muted/40"
                  }`}
                >
                  <p className="text-xs font-medium text-gray-500 dark:text-gray-400">Apr</p>
                  <div className="mt-1 flex items-end justify-between gap-2">
                    <p className="text-lg font-semibold text-foreground">{day.day}</p>
                    <span
                      className={`inline-flex h-6 w-6 items-center justify-center rounded-full text-[11px] font-semibold ${
                        day.count > 0
                          ? "bg-blue-600 text-white"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {day.count}
                    </span>
                  </div>
                  <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                    {day.count > 0 ? "Bookings scheduled" : "No bookings"}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {filteredBookings.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full text-left text-[13px] text-muted-foreground">
              <thead>
                <tr className="border-b border-border bg-muted/40 text-[11px] font-semibold text-foreground">
                  <th className="px-4 py-3.5">Patient name</th>
                  <th className="px-4 py-3.5">Service type</th>
                  <th className="px-4 py-3.5">Duration</th>
                  <th className="px-4 py-3.5">Date &amp; time</th>
                  <th className="px-4 py-3.5 text-right">Price</th>
                  <th className="px-4 py-3.5">Assigned provider</th>
                  <th className="px-4 py-3.5">Status</th>
                  <th className="px-4 py-3.5">Action</th>
                </tr>
              </thead>

              <tbody>
                {filteredBookings.map((booking, index) => (
                  <tr
                    key={booking.id}
                    className={`border-b border-border/70 transition-colors hover:bg-muted/35 ${
                      index % 2 === 0 ? "bg-background" : "bg-muted/20"
                    }`}
                  >
                    <td className="px-4 py-4 font-medium text-foreground">
                      {booking.patientName}
                    </td>
                    <td className="px-4 py-4">{booking.serviceType}</td>
                    <td className="px-4 py-4 whitespace-nowrap">{booking.duration}</td>
                    <td className="px-4 py-4 whitespace-nowrap">{booking.dateTime}</td>
                    <td className="px-4 py-4 whitespace-nowrap text-right font-semibold text-foreground">{booking.price}</td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      {booking.assignedProvider ? (
                        <span className="font-medium text-foreground">{booking.assignedProvider}</span>
                      ) : (
                        <span className="text-muted-foreground">Not Assigned</span>
                      )}
                    </td>
                    <td className="px-4 py-4">
                      <span
                        className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset ${statusStyles[booking.status]}`}
                      >
                        {booking.status}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <Button
                        onClick={() => openAssignModal(booking.id)}
                        disabled={Boolean(booking.assignedProvider)}
                        size="sm"
                        variant={booking.assignedProvider ? "secondary" : "default"}
                      >
                        {booking.assignedProvider ? "Assigned" : "Assign Provider"}
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          ) : (
            <div className="flex min-h-[280px] items-center justify-center rounded-2xl border border-dashed border-border bg-muted/20 px-6 py-12 text-center">
              <div className="max-w-sm space-y-3">
                <div className="mx-auto inline-flex h-12 w-12 items-center justify-center rounded-full bg-background text-muted-foreground ring-1 ring-border">
                  <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
                    <rect x="3" y="5" width="18" height="16" rx="2" />
                    <path d="M8 3v4M16 3v4M3 10h18" />
                  </svg>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-semibold text-foreground">No bookings yet</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Try adjusting search or filters to see matching bookings.</p>
                </div>
              </div>
            </div>
          )}
        </Card>
      </section>

      {activeBooking ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/45 p-4 transition-opacity duration-200">
          <div className="w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-xl transition-all duration-200">
            <h2 className="text-xl font-semibold text-foreground">Assign Provider</h2>

            <div className="mt-4 space-y-2 rounded-xl border border-border bg-muted/35 p-4 text-sm">
              <p>
                <span className="font-medium text-foreground">Patient Name:</span>{" "}
                <span className="text-muted-foreground">{activeBooking.patientName}</span>
              </p>
              <p>
                <span className="font-medium text-foreground">Service Type:</span>{" "}
                <span className="text-muted-foreground">{activeBooking.serviceType}</span>
              </p>
            </div>

            <div className="mt-4">
              <label htmlFor="provider-select" className="mb-2 block text-sm font-medium text-foreground">
                Select Provider
              </label>
              <select
                id="provider-select"
                value={selectedProvider}
                onChange={(event) => setSelectedProvider(event.target.value)}
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground outline-none ring-ring/50 focus:ring-2"
              >
                <option value="">Choose a provider</option>
                {providerOptions.map((provider) => (
                  <option key={provider.id} value={provider.id}>
                    {provider.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <Button
                onClick={closeAssignModal}
                variant="secondary"
              >
                Cancel
              </Button>
              <Button
                onClick={handleConfirmAssign}
                disabled={!selectedProvider}
              >
                Confirm Assign
              </Button>
            </div>
          </div>
        </div>
      ) : null}
    </LayoutWrapper>
  );
}
