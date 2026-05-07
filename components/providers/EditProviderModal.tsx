"use client";

import { FormEvent } from "react";
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

type EditProviderFormData = {
  name: string;
  specialization: string;
  years_of_experience: string;
};

type EditProviderModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  formData: EditProviderFormData;
  onFieldChange: (field: keyof EditProviderFormData, value: string) => void;
  onSubmit: () => Promise<void>;
  isSubmitting: boolean;
  errorMessage: string;
};

export default function EditProviderModal({
  open,
  onOpenChange,
  formData,
  onFieldChange,
  onSubmit,
  isSubmitting,
  errorMessage,
}: EditProviderModalProps) {
  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    await onSubmit();
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>Edit Provider</DialogTitle>
          <DialogDescription>Update provider information and save changes.</DialogDescription>
        </DialogHeader>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <p className="mb-1 text-xs font-medium text-muted-foreground">Name</p>
            <Input
              value={formData.name}
              onChange={(event) => onFieldChange("name", event.target.value)}
              placeholder="Provider name"
              disabled={isSubmitting}
              required
            />
          </div>

          <div>
            <p className="mb-1 text-xs font-medium text-muted-foreground">Specialization</p>
            <Input
              value={formData.specialization}
              onChange={(event) => onFieldChange("specialization", event.target.value)}
              placeholder="Specialization"
              disabled={isSubmitting}
              required
            />
          </div>

          <div>
            <p className="mb-1 text-xs font-medium text-muted-foreground">Years of Experience</p>
            <Input
              type="number"
              value={formData.years_of_experience}
              onChange={(event) => onFieldChange("years_of_experience", event.target.value)}
              placeholder="Years"
              min={0}
              disabled={isSubmitting}
              required
            />
          </div>

          {errorMessage ? <p className="text-sm text-destructive">{errorMessage}</p> : null}

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
