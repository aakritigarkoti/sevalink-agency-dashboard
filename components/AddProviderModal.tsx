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
import { ApiError, ServiceCategory, createProvider, getServiceCategories } from "@/lib/api";

type AddProviderModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onProviderAdded: () => Promise<void>;
  onUnauthorized: () => void;
};

type AddProviderFormState = {
  name: string;
  phone: string;
  qualification: string;
  specialization: string;
  years_of_experience: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  latitude: string;
  longitude: string;
};

const initialFormState: AddProviderFormState = {
  name: "",
  phone: "",
  qualification: "",
  specialization: "",
  years_of_experience: "",
  address: "",
  city: "",
  state: "",
  pincode: "",
  latitude: "",
  longitude: "",
};

export default function AddProviderModal({
  open,
  onOpenChange,
  onProviderAdded,
  onUnauthorized,
}: AddProviderModalProps) {
  const [form, setForm] = useState<AddProviderFormState>(initialFormState);
  const [formError, setFormError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serviceCategories, setServiceCategories] = useState<ServiceCategory[]>([]);
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [serviceLoadState, setServiceLoadState] = useState<"idle" | "loading" | "error">("idle");
  const [serviceErrorMessage, setServiceErrorMessage] = useState("");

  function handleFieldChange(field: keyof AddProviderFormState, value: string) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  }

  function handleModalOpenChange(nextOpen: boolean) {
    if (!nextOpen) {
      setFormError("");
      setForm(initialFormState);
      setSelectedServices([]);
      setServiceErrorMessage("");
      setServiceLoadState("idle");
    }

    onOpenChange(nextOpen);
  }

  useEffect(() => {
    if (!open) {
      return;
    }

    if (serviceCategories.length > 0 || serviceLoadState === "loading") {
      return;
    }

    async function loadCategories() {
      setServiceLoadState("loading");
      setServiceErrorMessage("");

      try {
        const categories = await getServiceCategories();
        setServiceCategories(categories);
        setServiceLoadState("idle");
      } catch (error) {
        setServiceLoadState("error");

        if (error instanceof ApiError && error.status >= 500) {
          setServiceErrorMessage("Unable to load services right now. Please try again.");
          return;
        }

        setServiceErrorMessage("Unable to load services. Please try again.");
      }
    }

    void loadCategories();
  }, [open, serviceCategories.length, serviceLoadState]);

  function handleServiceSelection(serviceId: string, checked: boolean) {
    setSelectedServices((current) => {
      if (checked) {
        return current.includes(serviceId) ? current : [...current, serviceId];
      }

      return current.filter((id) => id !== serviceId);
    });
  }

  function handleCategorySelection(serviceIds: string[], checked: boolean) {
    setSelectedServices((current) => {
      if (checked) {
        return Array.from(new Set([...current, ...serviceIds]));
      }

      return current.filter((id) => !serviceIds.includes(id));
    });
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFormError("");

    const requiredFields: Array<keyof AddProviderFormState> = [
      "name",
      "phone",
      "qualification",
      "specialization",
      "years_of_experience",
      "address",
      "city",
      "state",
      "pincode",
      "latitude",
      "longitude",
    ];

    const hasEmptyRequiredField = requiredFields.some((field) => !form[field].trim());

    if (hasEmptyRequiredField) {
      setFormError("Please fill all required fields.");
      return;
    }

    if (!/^\d{10}$/.test(form.phone)) {
      setFormError("Phone number must be 10 digits.");
      return;
    }

    const yearsOfExperience = Number(form.years_of_experience);
    const latitude = Number(form.latitude);
    const longitude = Number(form.longitude);

    if ([yearsOfExperience, latitude, longitude].some((value) => Number.isNaN(value))) {
      setFormError("Years of experience, latitude, and longitude must be valid numbers.");
      return;
    }

    setIsSubmitting(true);

    try {
      await createProvider({
        phone: form.phone,
        name: form.name,
        qualification: form.qualification,
        specialization: form.specialization,
        years_of_experience: yearsOfExperience,
        address: form.address,
        city: form.city,
        state: form.state,
        pincode: form.pincode,
        latitude,
        longitude,
        service_ids: selectedServices,
      });

      await onProviderAdded();
      handleModalOpenChange(false);
      toast.success("Provider added successfully");
    } catch (error) {
      if (error instanceof ApiError) {
        if (error.status === 401) {
          onUnauthorized();
          return;
        }

        if (error.status === 409) {
          setFormError("Phone number already exists.");
          return;
        }

        if (error.status >= 500) {
          setFormError("Unable to add provider right now. Please try again.");
          return;
        }
      }

      setFormError("Unable to add provider. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleModalOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Add Provider</DialogTitle>
          <DialogDescription>Fill in provider details to add them to your directory.</DialogDescription>
        </DialogHeader>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div>
              <p className="mb-1 text-xs font-medium text-muted-foreground">Name</p>
              <Input
                value={form.name}
                onChange={(event) => handleFieldChange("name", event.target.value)}
                placeholder="Enter name"
                disabled={isSubmitting}
                required
              />
            </div>

            <div>
              <p className="mb-1 text-xs font-medium text-muted-foreground">Phone</p>
              <Input
                value={form.phone}
                onChange={(event) => handleFieldChange("phone", event.target.value.replace(/\D/g, "").slice(0, 10))}
                placeholder="10 digit phone"
                maxLength={10}
                disabled={isSubmitting}
                required
              />
            </div>

            <div>
              <p className="mb-1 text-xs font-medium text-muted-foreground">Qualification</p>
              <Input
                value={form.qualification}
                onChange={(event) => handleFieldChange("qualification", event.target.value)}
                placeholder="Qualification"
                disabled={isSubmitting}
                required
              />
            </div>

            <div>
              <p className="mb-1 text-xs font-medium text-muted-foreground">Specialization</p>
              <Input
                value={form.specialization}
                onChange={(event) => handleFieldChange("specialization", event.target.value)}
                placeholder="Specialization"
                disabled={isSubmitting}
                required
              />
            </div>

            <div>
              <p className="mb-1 text-xs font-medium text-muted-foreground">Years of Experience</p>
              <Input
                type="number"
                value={form.years_of_experience}
                onChange={(event) => handleFieldChange("years_of_experience", event.target.value)}
                placeholder="Years"
                disabled={isSubmitting}
                required
              />
            </div>

            <div className="sm:col-span-2">
              <div className="rounded-xl border border-border/70 bg-muted/20 px-3 py-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <p className="text-xs font-medium text-muted-foreground">Select Services</p>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      {selectedServices.length} selected
                    </p>
                  </div>
                  {serviceLoadState === "loading" ? (
                    <span className="inline-flex items-center gap-2 text-xs text-muted-foreground">
                      <span className="h-3 w-3 animate-spin rounded-full border-2 border-primary/30 border-t-primary" />
                      Loading services...
                    </span>
                  ) : null}
                </div>

                {serviceLoadState === "error" ? (
                  <div className="mt-2 flex flex-wrap items-center gap-2">
                    <p className="text-xs font-medium text-destructive">{serviceErrorMessage}</p>
                    <Button
                      type="button"
                      variant="outline"
                      size="xs"
                      onClick={() => setServiceLoadState("idle")}
                    >
                      Retry
                    </Button>
                  </div>
                ) : null}

                {serviceLoadState !== "error" ? (
                  <div className="mt-3 max-h-72 space-y-4 overflow-y-auto pr-1">
                    {serviceCategories.length === 0 && serviceLoadState === "idle" ? (
                      <p className="text-xs text-muted-foreground">No services available.</p>
                    ) : null}

                    {serviceCategories.map((category) => {
                      const categoryServiceIds = category.services.map((service) => String(service.id));
                      const selectedInCategory = categoryServiceIds.filter((id) => selectedServices.includes(id)).length;
                      const allCategoryServicesSelected =
                        categoryServiceIds.length > 0 && selectedInCategory === categoryServiceIds.length;

                      return (
                        <div key={String(category.id)} className="space-y-2 rounded-lg border border-border/70 bg-background p-3">
                          <div className="flex flex-wrap items-center justify-between gap-2">
                            <div>
                              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-card-foreground">
                                {category.name}
                              </p>
                              <p className="mt-0.5 text-xs text-muted-foreground">
                                {selectedInCategory}/{categoryServiceIds.length} selected
                              </p>
                            </div>

                            {categoryServiceIds.length > 0 ? (
                              <label className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
                                <input
                                  type="checkbox"
                                  checked={allCategoryServicesSelected}
                                  onChange={(event) =>
                                    handleCategorySelection(categoryServiceIds, event.target.checked)
                                  }
                                  disabled={isSubmitting}
                                  className="h-4 w-4 rounded border-border text-primary focus-visible:ring-2 focus-visible:ring-ring/50"
                                />
                                Select all
                              </label>
                            ) : null}
                          </div>

                          {category.services.length > 0 ? (
                            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                              {category.services.map((service) => {
                                const serviceId = String(service.id);
                                const isSelected = selectedServices.includes(serviceId);

                                return (
                                  <label
                                    key={serviceId}
                                    className="flex items-center gap-2 rounded-lg border border-border/70 bg-muted/20 px-2 py-2 text-sm text-card-foreground"
                                  >
                                    <input
                                      type="checkbox"
                                      checked={isSelected}
                                      onChange={(event) => handleServiceSelection(serviceId, event.target.checked)}
                                      disabled={isSubmitting}
                                      className="h-4 w-4 rounded border-border text-primary focus-visible:ring-2 focus-visible:ring-ring/50"
                                    />
                                    <span>{service.name}</span>
                                  </label>
                                );
                              })}
                            </div>
                          ) : (
                            <p className="text-xs text-muted-foreground">No services in this category.</p>
                          )}
                        </div>
                      );
                    })}
                  </div>
                ) : null}
              </div>
            </div>

            <div className="sm:col-span-2">
              <p className="mb-1 text-xs font-medium text-muted-foreground">Address</p>
              <Input
                value={form.address}
                onChange={(event) => handleFieldChange("address", event.target.value)}
                placeholder="Address"
                disabled={isSubmitting}
                required
              />
            </div>

            <div>
              <p className="mb-1 text-xs font-medium text-muted-foreground">City</p>
              <Input
                value={form.city}
                onChange={(event) => handleFieldChange("city", event.target.value)}
                placeholder="City"
                disabled={isSubmitting}
                required
              />
            </div>

            <div>
              <p className="mb-1 text-xs font-medium text-muted-foreground">State</p>
              <Input
                value={form.state}
                onChange={(event) => handleFieldChange("state", event.target.value)}
                placeholder="State"
                disabled={isSubmitting}
                required
              />
            </div>

            <div>
              <p className="mb-1 text-xs font-medium text-muted-foreground">Pincode</p>
              <Input
                value={form.pincode}
                onChange={(event) => handleFieldChange("pincode", event.target.value)}
                placeholder="Pincode"
                disabled={isSubmitting}
                required
              />
            </div>

            <div>
              <p className="mb-1 text-xs font-medium text-muted-foreground">Latitude</p>
              <Input
                type="number"
                step="any"
                value={form.latitude}
                onChange={(event) => handleFieldChange("latitude", event.target.value)}
                placeholder="Latitude"
                disabled={isSubmitting}
                required
              />
            </div>

            <div>
              <p className="mb-1 text-xs font-medium text-muted-foreground">Longitude</p>
              <Input
                type="number"
                step="any"
                value={form.longitude}
                onChange={(event) => handleFieldChange("longitude", event.target.value)}
                placeholder="Longitude"
                disabled={isSubmitting}
                required
              />
            </div>
          </div>

          {formError ? <p className="text-sm text-destructive">{formError}</p> : null}

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => handleModalOpenChange(false)} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Adding..." : "Add Provider"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
