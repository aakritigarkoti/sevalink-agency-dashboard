"use client";

import { useMemo, useState } from "react";
import LayoutWrapper from "@/components/layout/LayoutWrapper";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";

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

type PendingAction = "accept" | "reject";

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

const statusVariants: Record<RequestStatus, "secondary" | "default" | "destructive"> = {
  Pending: "secondary",
  Confirmed: "default",
  Rejected: "destructive",
};

export default function PendingRequestsPage() {
  const [requests, setRequests] = useState<PendingRequest[]>(initialRequests);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("Pending");
  const [animatingCardIds, setAnimatingCardIds] = useState<Set<number>>(new Set());
  const [pendingAction, setPendingAction] = useState<{
    requestId: number;
    action: PendingAction;
  } | null>(null);

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

  function runAction(requestId: number, action: PendingAction) {
    setAnimatingCardIds((current) => new Set([...current, requestId]));

    if (action === "accept") {
      toast.success("Booking accepted successfully");
    } else {
      toast.error("Booking rejected");
    }

    setTimeout(() => {
      setRequests((current) =>
        current.map((request) =>
          request.id === requestId
            ? {
                ...request,
                status: action === "accept" ? "Confirmed" : "Rejected",
              }
            : request,
        ),
      );
      setAnimatingCardIds((current) => {
        const updated = new Set(current);
        updated.delete(requestId);
        return updated;
      });
    }, 300);
  }

  function handleConfirmAction() {
    if (!pendingAction) {
      return;
    }

    runAction(pendingAction.requestId, pendingAction.action);
    setPendingAction(null);
  }

  const selectedRequest = pendingAction
    ? requests.find((request) => request.id === pendingAction.requestId) ?? null
    : null;

  const emptyMessage =
    statusFilter === "Pending"
      ? "No data available"
      : "No data available";

  return (
    <LayoutWrapper>
      <section className="space-y-6">
        <div className="space-y-1.5">
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Pending Requests</h1>
          <p className="text-sm text-muted-foreground">
            Review incoming booking requests and take quick action.
          </p>
        </div>

        <Card className="rounded-xl border-border p-4 shadow-sm transition-all hover:shadow-md sm:p-5">
          <div className="flex flex-wrap items-center gap-2">
            {filterOptions.map((option) => {
              const isActive = statusFilter === option;

              return (
                <Button
                  key={option}
                  type="button"
                  onClick={() => setStatusFilter(option)}
                  size="sm"
                  variant={isActive ? "default" : "secondary"}
                >
                  {option}
                </Button>
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
                  <Badge variant={statusVariants[request.status]}>
                    {request.status}
                  </Badge>
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
                    variant="default"
                    className="h-9 w-full sm:w-auto"
                    onClick={() => setPendingAction({ requestId: request.id, action: "accept" })}
                    disabled={request.status !== "Pending"}
                  >
                    Accept
                  </Button>
                  <Button
                    type="button"
                    variant="destructive"
                    className="h-9 w-full sm:w-auto"
                    onClick={() => setPendingAction({ requestId: request.id, action: "reject" })}
                    disabled={request.status !== "Pending"}
                  >
                    Reject
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="rounded-xl border-border p-10 text-center shadow-sm transition-all hover:shadow-md">
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

        <Card className="rounded-xl border-border p-4 shadow-sm transition-all hover:shadow-md sm:p-5">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-semibold text-foreground">Active Bookings</h2>
            <Badge variant="secondary">
              {activeBookings.length} confirmed
            </Badge>
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

      <Dialog open={Boolean(pendingAction)} onOpenChange={(open) => !open && setPendingAction(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {pendingAction?.action === "accept" ? "Confirm Accept" : "Confirm Reject"}
            </DialogTitle>
            <DialogDescription>
              {selectedRequest
                ? `Are you sure you want to ${pendingAction?.action} the request for ${selectedRequest.patientName}?`
                : "Please confirm this action."}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setPendingAction(null)}>
              Cancel
            </Button>
            <Button
              variant={pendingAction?.action === "reject" ? "destructive" : "default"}
              onClick={handleConfirmAction}
            >
              {pendingAction?.action === "accept" ? "Accept" : "Reject"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </LayoutWrapper>
  );
}
