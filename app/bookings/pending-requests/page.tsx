"use client";

import { useMemo, useState } from "react";
import LayoutWrapper from "@/components/layout/LayoutWrapper";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast";

type RequestStatus = "Pending" | "Confirmed" | "Rejected";
type StatusFilter = "All" | RequestStatus;

type PendingRequest = {
  id: number;
  patientName: string;
  serviceType: string;
  dateTime: string;
  duration: string;
  location?: string;
  description: string;
  status: RequestStatus;
};

const filterOptions: StatusFilter[] = ["All", "Pending", "Confirmed", "Rejected"];

const initialRequests: PendingRequest[] = [
  {
    id: 101,
    patientName: "Ananya Sharma",
    serviceType: "Nursing Care",
    dateTime: "09 Apr 2026, 10:00 AM",
    duration: "4 hours",
    location: "Sector 21, Noida",
    description: "Post-discharge support required for vitals monitoring and medicine reminders.",
    status: "Pending",
  },
  {
    id: 102,
    patientName: "Rohan Verma",
    serviceType: "Physiotherapy",
    dateTime: "09 Apr 2026, 05:30 PM",
    duration: "1 hour",
    location: "Indiranagar, Bengaluru",
    description: "Lower back mobility session with basic at-home exercise guidance.",
    status: "Pending",
  },
  {
    id: 103,
    patientName: "Meera Iyer",
    serviceType: "Nursing Care",
    dateTime: "10 Apr 2026, 08:30 AM",
    duration: "3 hours",
    description: "Daily wound-care assistance and BP/sugar level checks.",
    status: "Pending",
  },
  {
    id: 104,
    patientName: "Vikram Singh",
    serviceType: "Elderly Care",
    dateTime: "10 Apr 2026, 02:00 PM",
    duration: "2 hours",
    location: "Vaishali, Ghaziabad",
    description: "Companionship and assisted walk support for senior parent.",
    status: "Pending",
  },
];

const statusStyles: Record<RequestStatus, string> = {
  Pending: "bg-amber-500/12 text-amber-700 ring-amber-500/20",
  Confirmed: "bg-emerald-500/12 text-emerald-700 ring-emerald-500/20",
  Rejected: "bg-rose-500/12 text-rose-700 ring-rose-500/20",
};

export default function PendingRequestsPage() {
  const { addToast } = useToast();
  const [requests, setRequests] = useState<PendingRequest[]>(initialRequests);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("Pending");
  const [animatingCardIds, setAnimatingCardIds] = useState<Set<number>>(new Set());

  const filteredRequests = useMemo(
    () =>
      requests.filter((request) => {
        if (statusFilter === "All") {
          return true;
        }

        return request.status === statusFilter;
      }),
    [requests, statusFilter],
  );

  const activeBookings = useMemo(
    () => requests.filter((request) => request.status === "Confirmed"),
    [requests],
  );

  function handleAccept(requestId: number) {
    const shouldAccept = window.confirm("Accept this booking request?");

    if (!shouldAccept) {
      return;
    }

    setAnimatingCardIds((current) => new Set([...current, requestId]));
    addToast("Booking Accepted Successfully", "success");

    setTimeout(() => {
      setRequests((current) =>
        current.map((request) =>
          request.id === requestId ? { ...request, status: "Confirmed" } : request,
        ),
      );
      setAnimatingCardIds((current) => {
        const updated = new Set(current);
        updated.delete(requestId);
        return updated;
      });
    }, 300);
  }

  function handleReject(requestId: number) {
    const shouldReject = window.confirm("Reject this booking request?");

    if (!shouldReject) {
      return;
    }

    setAnimatingCardIds((current) => new Set([...current, requestId]));
    addToast("Booking Rejected", "error");

    setTimeout(() => {
      setRequests((current) =>
        current.map((request) =>
          request.id === requestId ? { ...request, status: "Rejected" } : request,
        ),
      );
      setAnimatingCardIds((current) => {
        const updated = new Set(current);
        updated.delete(requestId);
        return updated;
      });
    }, 300);
  }

  const emptyMessage =
    statusFilter === "Pending"
      ? "No pending requests"
      : "No requests found for this filter";

  return (
    <LayoutWrapper>
      <section className="space-y-7">
        <div className="space-y-1.5">
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Pending Requests</h1>
          <p className="text-sm text-muted-foreground">
            Review incoming booking requests and take quick action.
          </p>
        </div>

        <Card className="rounded-xl border-border p-4 shadow-sm hover:shadow-sm sm:p-5">
          <div className="flex flex-wrap items-center gap-2">
            {filterOptions.map((option) => {
              const isActive = statusFilter === option;

              return (
                <button
                  key={option}
                  type="button"
                  onClick={() => setStatusFilter(option)}
                  className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors ${
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground"
                  }`}
                >
                  {option}
                </button>
              );
            })}
          </div>
        </Card>

        {filteredRequests.length > 0 ? (
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            {filteredRequests.map((request) => (
              <Card
                key={request.id}
                className={`rounded-xl border-border p-4 shadow-sm transition-all duration-200 hover:bg-muted/35 hover:shadow-md sm:p-5 ${
                  animatingCardIds.has(request.id) ? "animate-card-out" : ""
                }`}
              >
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div className="space-y-1">
                    <p className="text-base font-semibold text-foreground">{request.patientName}</p>
                    <p className="text-sm text-muted-foreground">{request.serviceType}</p>
                  </div>
                  <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset ${statusStyles[request.status]}`}>
                    {request.status}
                  </span>
                </div>

                <div className="mt-4 grid grid-cols-1 gap-2 text-sm text-muted-foreground sm:grid-cols-2">
                  <p>
                    <span className="font-medium text-foreground">Date & Time:</span> {request.dateTime}
                  </p>
                  <p>
                    <span className="font-medium text-foreground">Duration:</span> {request.duration}
                  </p>
                  {request.location ? (
                    <p className="sm:col-span-2">
                      <span className="font-medium text-foreground">Location:</span> {request.location}
                    </p>
                  ) : null}
                  <p className="sm:col-span-2">
                    <span className="font-medium text-foreground">Description:</span> {request.description}
                  </p>
                </div>

                <div className="mt-5 grid grid-cols-1 gap-2 sm:flex sm:justify-end">
                  <Button
                    type="button"
                    className="h-9 w-full bg-emerald-600 text-white hover:bg-emerald-700 sm:w-auto"
                    onClick={() => handleAccept(request.id)}
                    disabled={request.status !== "Pending"}
                  >
                    Accept
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    className="h-9 w-full border-rose-300 text-rose-600 hover:border-rose-400 hover:bg-rose-50 sm:w-auto"
                    onClick={() => handleReject(request.id)}
                    disabled={request.status !== "Pending"}
                  >
                    Reject
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="rounded-xl border-border p-10 text-center shadow-sm hover:shadow-sm">
            <div className="mx-auto mb-3 inline-flex h-12 w-12 items-center justify-center rounded-full bg-muted text-muted-foreground">
              <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
                <path d="M3 6h18" />
                <path d="M7 6v12a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V6" />
                <path d="M10 11h4" />
                <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
              </svg>
            </div>
            <p className="text-sm font-semibold text-foreground">{emptyMessage}</p>
          </Card>
        )}

        <Card className="rounded-xl border-border p-4 shadow-sm hover:shadow-sm sm:p-5">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-semibold text-foreground">Active Bookings</h2>
            <span className="rounded-full bg-muted px-2.5 py-1 text-xs font-medium text-muted-foreground">
              {activeBookings.length} confirmed
            </span>
          </div>

          <div className="mt-4 space-y-2.5">
            {activeBookings.length > 0 ? (
              activeBookings.map((booking) => (
                <div
                  key={booking.id}
                  className="rounded-lg border border-border bg-background px-3 py-2.5 text-sm text-muted-foreground"
                >
                  <span className="font-semibold text-foreground">{booking.patientName}</span>
                  <span> · {booking.serviceType} · {booking.dateTime}</span>
                </div>
              ))
            ) : (
              <p className="text-sm text-muted-foreground">No active bookings yet.</p>
            )}
          </div>
        </Card>
      </section>
    </LayoutWrapper>
  );
}
