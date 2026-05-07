"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import StatusBadge from "@/components/dashboard/StatusBadge";
import { ProviderDetails } from "@/lib/api";

type ProviderDetailsModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedProviderId: number | string | null;
  providerDetails: ProviderDetails | null;
  isLoading: boolean;
  errorMessage: string;
};

type DetailRowProps = {
  label: string;
  value: string;
};

function DetailRow({ label, value }: DetailRowProps) {
  return (
    <div className="rounded-xl border border-border/70 bg-muted/20 px-3 py-2">
      <p className="text-[11px] font-medium uppercase tracking-[0.12em] text-muted-foreground">{label}</p>
      <p className="mt-1 text-sm font-medium text-card-foreground">{value || "-"}</p>
    </div>
  );
}

export default function ProviderDetailsModal({
  open,
  onOpenChange,
  selectedProviderId,
  providerDetails,
  isLoading,
  errorMessage,
}: ProviderDetailsModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Provider Details</DialogTitle>
          <DialogDescription>
            View profile and professional information for this provider.
            {selectedProviderId !== null ? ` ID: ${selectedProviderId}` : ""}
          </DialogDescription>
        </DialogHeader>

        {isLoading ? (
          <div className="flex min-h-[240px] items-center justify-center">
            <div className="inline-flex items-center gap-2 text-sm text-muted-foreground">
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-primary/30 border-t-primary" />
              Loading provider details...
            </div>
          </div>
        ) : null}

        {!isLoading && errorMessage ? (
          <div className="rounded-xl border border-destructive/20 bg-destructive/5 p-4">
            <p className="text-sm font-medium text-destructive">{errorMessage}</p>
          </div>
        ) : null}

        {!isLoading && !errorMessage && providerDetails ? (
          <div className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border/70 bg-muted/20 px-4 py-3">
              <div className="flex flex-wrap gap-2">
                <StatusBadge tone={providerDetails.is_active ? "success" : "warning"}>
                  {providerDetails.is_active ? "Active" : "Inactive"}
                </StatusBadge>
                {providerDetails.availability_status ? (
                  <StatusBadge
                    tone={
                      providerDetails.availability_status.toLowerCase() === "online"
                        ? "success"
                        : providerDetails.availability_status.toLowerCase() === "busy"
                          ? "warning"
                          : "danger"
                    }
                  >
                    <span className="mr-1">
                      {providerDetails.availability_status.toLowerCase() === "online" ? "🟢" : 
                       providerDetails.availability_status.toLowerCase() === "busy" ? "🟡" : "🔴"}
                    </span>
                    {providerDetails.availability_status.charAt(0).toUpperCase() + providerDetails.availability_status.slice(1)}
                  </StatusBadge>
                ) : null}
              </div>
              {providerDetails.verification_status ? (
                <StatusBadge
                  tone={
                    providerDetails.verification_status.toLowerCase() === "verified"
                      ? "success"
                      : providerDetails.verification_status.toLowerCase() === "pending"
                        ? "warning"
                        : "danger"
                  }
                >
                  <span className="mr-1">
                    {providerDetails.verification_status.toLowerCase() === "verified" ? "✅" : 
                     providerDetails.verification_status.toLowerCase() === "pending" ? "⚠️" : 
                     providerDetails.verification_status.toLowerCase() === "suspended" ? "🚫" : "❌"}
                  </span>
                  {providerDetails.verification_status.charAt(0).toUpperCase() + providerDetails.verification_status.slice(1)}
                </StatusBadge>
              ) : null}
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <DetailRow label="Name" value={providerDetails.user?.name ?? ""} />
              <DetailRow label="Phone" value={providerDetails.user?.phone ?? ""} />
              <DetailRow label="Qualification" value={providerDetails.qualification} />
              <DetailRow label="Specialization" value={providerDetails.specialization} />
              <DetailRow label="Years of Experience" value={`${providerDetails.years_of_experience || 0} years`} />
              <DetailRow label="License Number" value={providerDetails.license_number || "-"} />
            </div>

            <div className="rounded-xl border border-border/70 bg-muted/20 px-3 py-3">
              <p className="text-[11px] font-medium uppercase tracking-[0.12em] text-muted-foreground">Address</p>
              <p className="mt-1 text-sm font-medium text-card-foreground">{providerDetails.address || "-"}</p>
              <p className="mt-1 text-sm text-muted-foreground">
                {[providerDetails.city, providerDetails.state, providerDetails.pincode].filter(Boolean).join(", ") || "-"}
              </p>
            </div>
          </div>
        ) : null}

        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
