"use client";

import { FormEvent, useEffect, useState } from "react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  AgencyProfile,
  ApiError,
  UpdateAgencyProfileInput,
  updateAgencyProfile,
} from "@/lib/api";

type EditProfileModalProps = {
  open: boolean;
  profile: AgencyProfile;
  onOpenChange: (open: boolean) => void;
  onUpdated: (profile: AgencyProfile) => void;
  onUnauthorized: () => void;
};

type ProfileFormState = {
  agency_name: string;
  contact_phone: string;
};

export default function EditProfileModal({
  open,
  profile,
  onOpenChange,
  onUpdated,
  onUnauthorized,
}: EditProfileModalProps) {
  const [form, setForm] = useState<ProfileFormState>({
    agency_name: profile.agencyName,
    contact_phone: profile.phone,
  });
  const [fieldError, setFieldError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!open) {
      return;
    }

    Promise.resolve().then(() => {
      setForm({
        agency_name: profile.agencyName,
        contact_phone: profile.phone,
      });
      setFieldError("");
    });
  }, [open, profile.agencyName, profile.phone]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const agencyName = form.agency_name.trim();
    const contactPhone = form.contact_phone.trim();

    if (!agencyName || !contactPhone) {
      setFieldError("Agency name and phone are required.");
      return;
    }

    const payload: UpdateAgencyProfileInput = {};

    if (agencyName !== profile.agencyName) {
      payload.company_name = agencyName;
    }

    if (contactPhone !== profile.phone) {
      payload.contact_phone = contactPhone;
    }

    if (Object.keys(payload).length === 0) {
      onOpenChange(false);
      return;
    }

    setIsSubmitting(true);
    setFieldError("");

    try {
      const updatedProfile = await updateAgencyProfile(payload);
      onUpdated(updatedProfile);
      onOpenChange(false);
      toast.success("Profile updated successfully");
    } catch (error) {
      if (error instanceof ApiError) {
        if (error.status === 401) {
          onUnauthorized();
          return;
        }

        if (error.status === 403) {
          toast.error("Unauthorized");
          return;
        }

        if (error.status >= 500) {
          toast.error("Something went wrong. Please try again.");
          return;
        }
      }

      toast.error("Could not update profile. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Profile</DialogTitle>
          <DialogDescription>
            Update the agency name and contact phone for this workspace.
          </DialogDescription>
        </DialogHeader>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <label
              htmlFor="agency_name"
              className="text-sm font-medium text-popover-foreground"
            >
              Agency name
            </label>
            <Input
              id="agency_name"
              name="agency_name"
              value={form.agency_name}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  agency_name: event.target.value,
                }))
              }
              disabled={isSubmitting}
              aria-invalid={fieldError ? true : undefined}
              autoComplete="organization"
            />
          </div>

          <div className="space-y-2">
            <label
              htmlFor="contact_phone"
              className="text-sm font-medium text-popover-foreground"
            >
              Contact phone
            </label>
            <Input
              id="contact_phone"
              name="contact_phone"
              value={form.contact_phone}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  contact_phone: event.target.value,
                }))
              }
              disabled={isSubmitting}
              aria-invalid={fieldError ? true : undefined}
              autoComplete="tel"
            />
          </div>

          {fieldError ? (
            <p className="text-sm font-medium text-destructive">{fieldError}</p>
          ) : null}

          <DialogFooter className="mt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : "Save changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
