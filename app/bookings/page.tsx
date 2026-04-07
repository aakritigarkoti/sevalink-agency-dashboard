"use client";

import { useState } from "react";
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
      <section className="space-y-8">
        <div className="space-y-1.5">
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Bookings</h1>
          <p className="text-sm text-muted-foreground">Manage and assign service requests from one place.</p>
        </div>

        <Card className="p-4 sm:p-6">
          <p className="mb-3 text-sm font-medium text-foreground">Filters</p>
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
                {filteredBookings.length > 0 ? (
                  filteredBookings.map((booking, index) => (
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
                  ))
                ) : (
                  <tr>
                    <td colSpan={8} className="px-4 py-12 text-center text-sm text-muted-foreground">
                      No bookings found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
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
