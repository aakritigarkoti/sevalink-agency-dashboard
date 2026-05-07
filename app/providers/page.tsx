"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { XIcon } from "lucide-react";
import AddProviderModal from "@/components/AddProviderModal";
import PageHeader from "@/components/dashboard/PageHeader";
import StatusBadge from "@/components/dashboard/StatusBadge";
import LayoutWrapper from "@/components/layout/LayoutWrapper";
import EditProviderModal from "@/components/providers/EditProviderModal";
import ProviderDetailsModal from "@/components/providers/ProviderDetailsModal";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  ApiError,
  Provider,
  ProviderDetails,
  UpdateProviderInput,
  getProviderDetails,
  getProviders,
  updateProvider,
} from "@/lib/api";
import { clearAuthSession, getStoredToken } from "@/lib/local-auth";

type LoadState = "idle" | "loading" | "error";

type EditProviderFormData = {
  name: string;
  specialization: string;
  years_of_experience: string;
};

const initialEditFormData: EditProviderFormData = {
  name: "",
  specialization: "",
  years_of_experience: "",
};

export default function ProvidersPage() {
  const router = useRouter();
  const [providers, setProviders] = useState<Provider[]>([]);
  const [loadState, setLoadState] = useState<LoadState>("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [isAddProviderOpen, setIsAddProviderOpen] = useState(false);
  const [isProviderDetailsOpen, setIsProviderDetailsOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedProviderId, setSelectedProviderId] = useState<number | string | null>(null);
  const [providerDetails, setProviderDetails] = useState<ProviderDetails | null>(null);
  const [loading, setLoading] = useState(false);
  const [providerDetailsError, setProviderDetailsError] = useState("");
  const [formData, setFormData] = useState<EditProviderFormData>(initialEditFormData);
  const [initialFormData, setInitialFormData] = useState<EditProviderFormData>(initialEditFormData);
  const [editErrorMessage, setEditErrorMessage] = useState("");
  const [isEditSubmitting, setIsEditSubmitting] = useState(false);
  const [togglingProviders, setTogglingProviders] = useState<Record<string, boolean>>({});
  const [searchTerm, setSearchTerm] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const hasMountedRef = useRef(false);
  const searchTermRef = useRef("");
  const skipNextPageFetchRef = useRef(false);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);

  const handleUnauthorized = useCallback(() => {
    clearAuthSession();
    router.replace("/login");
  }, [router]);

  const fetchProvidersList = useCallback(async ({
    search,
    nextPage = page,
    nextLimit = limit,
    showLoader = true,
  }: {
    search?: string;
    nextPage?: number;
    nextLimit?: number;
    showLoader?: boolean;
  } = {}) => {
    const token = getStoredToken();

    if (!token) {
      handleUnauthorized();
      return;
    }

    const hasSearch = Boolean(search?.trim());

    if (!showLoader && hasSearch) {
      setIsSearching(true);
    } else {
      setLoadState("loading");
    }

    setErrorMessage("");

    try {
      const response = await getProviders(nextPage, nextLimit, search?.trim());
      setProviders(response.items);
      const resolvedTotalPages = response.totalPages
        ? response.totalPages
        : response.items.length < nextLimit
          ? nextPage
          : nextPage + 1;
      setTotalPages(Math.max(1, resolvedTotalPages));
      setLoadState("idle");
    } catch (error) {
      setLoadState("error");

      if (error instanceof ApiError) {
        if (error.status === 401) {
          handleUnauthorized();
          return;
        }

        if (error.status >= 500) {
          setErrorMessage("Unable to load providers right now. Please try again.");
          return;
        }
      }

      setErrorMessage("Unable to load providers.");
    } finally {
      setIsSearching(false);
    }
  }, [handleUnauthorized, limit, page]);

  useEffect(() => {
    if (!hasMountedRef.current) {
      hasMountedRef.current = true;
      return;
    }

    searchTermRef.current = searchTerm;
    skipNextPageFetchRef.current = true;
    setPage(1);

    const timeoutId = window.setTimeout(() => {
      const trimmedSearch = searchTerm.trim();

      if (trimmedSearch) {
        void fetchProvidersList({ search: trimmedSearch, nextPage: 1, nextLimit: limit, showLoader: false });
      } else {
        void fetchProvidersList({ nextPage: 1, nextLimit: limit, showLoader: true });
      }
    }, 300);

    return () => window.clearTimeout(timeoutId);
  }, [fetchProvidersList, limit, searchTerm]);

  useEffect(() => {
    if (skipNextPageFetchRef.current) {
      skipNextPageFetchRef.current = false;
      return;
    }

    void fetchProvidersList({
      search: searchTermRef.current.trim(),
      nextPage: page,
      nextLimit: limit,
      showLoader: true,
    });
  }, [fetchProvidersList, limit, page]);

  function handleProviderDetailsOpenChange(nextOpen: boolean) {
    setIsProviderDetailsOpen(nextOpen);

    if (!nextOpen) {
      setSelectedProviderId(null);
      setProviderDetails(null);
      setProviderDetailsError("");
      setLoading(false);
    }
  }

  function handleEditModalOpenChange(nextOpen: boolean) {
    setEditModalOpen(nextOpen);

    if (!nextOpen) {
      setFormData(initialEditFormData);
      setInitialFormData(initialEditFormData);
      setEditErrorMessage("");
      setIsEditSubmitting(false);
    }
  }

  function handleEditFieldChange(field: keyof EditProviderFormData, value: string) {
    setFormData((current) => ({
      ...current,
      [field]: value,
    }));
  }

  async function handleViewProvider(providerId: number | string) {
    setSelectedProviderId(providerId);
    setProviderDetails(null);
    setProviderDetailsError("");
    setIsProviderDetailsOpen(true);
    setEditModalOpen(false);
    setLoading(true);

    try {
      const details = await getProviderDetails(providerId);
      setProviderDetails(details);
    } catch (error) {
      if (error instanceof ApiError) {
        if (error.status === 401) {
          handleUnauthorized();
          return;
        }

        if (error.status === 404) {
          setProviderDetailsError("Provider not found");
          return;
        }

        if (error.status >= 500) {
          setProviderDetailsError("Something went wrong. Please try again.");
          return;
        }
      }

      setProviderDetailsError("Unable to load provider details.");
    } finally {
      setLoading(false);
    }
  }

  function handleEditProvider(provider: Provider) {
    const nextFormData = {
      name: provider.user?.name ?? "",
      specialization: provider.specialization ?? "",
      years_of_experience: String(provider.years_of_experience ?? ""),
    };

    setSelectedProviderId(provider.id);
    setIsProviderDetailsOpen(false);
    setEditErrorMessage("");
    setFormData(nextFormData);
    setInitialFormData(nextFormData);
    setEditModalOpen(true);
  }

  async function handleUpdateProvider() {
    if (!selectedProviderId) {
      setEditErrorMessage("Unable to update provider. Please try again.");
      return;
    }

    const trimmedName = formData.name.trim();
    const trimmedSpecialization = formData.specialization.trim();
    const trimmedExperience = formData.years_of_experience.trim();

    if (!trimmedName || !trimmedSpecialization || !trimmedExperience) {
      setEditErrorMessage("Please fill all required fields.");
      return;
    }

    const yearsOfExperience = Number(trimmedExperience);

    if (Number.isNaN(yearsOfExperience)) {
      setEditErrorMessage("Years of experience must be a valid number.");
      return;
    }

    const updatePayload: UpdateProviderInput = {};

    if (trimmedName !== initialFormData.name.trim()) {
      updatePayload.name = trimmedName;
    }

    if (trimmedSpecialization !== initialFormData.specialization.trim()) {
      updatePayload.specialization = trimmedSpecialization;
    }

    if (trimmedExperience !== initialFormData.years_of_experience.trim()) {
      updatePayload.years_of_experience = yearsOfExperience;
    }

    if (Object.keys(updatePayload).length === 0) {
      setEditErrorMessage("Please update at least one field.");
      return;
    }

    setIsEditSubmitting(true);
    setEditErrorMessage("");

    try {
      await updateProvider(selectedProviderId, updatePayload);
      await fetchProvidersList({
        search: searchTermRef.current.trim(),
        nextPage: page,
        nextLimit: limit,
        showLoader: true,
      });
      handleEditModalOpenChange(false);
      toast.success("Provider updated successfully");
    } catch (error) {
      if (error instanceof ApiError) {
        if (error.status === 401) {
          handleUnauthorized();
          return;
        }

        if (error.status === 400) {
          setEditErrorMessage(error.message || "Please check the provider details.");
          return;
        }

        if (error.status >= 500) {
          setEditErrorMessage("Unable to update provider right now. Please try again.");
          return;
        }
      }

      setEditErrorMessage("Unable to update provider.");
    } finally {
      setIsEditSubmitting(false);
    }
  }

  async function handleToggleProviderStatus(provider: Provider) {
    const providerKey = String(provider.id);
    const nextStatus = !provider.is_active;
    let previousProviders: Provider[] = [];

    setTogglingProviders((current) => ({
      ...current,
      [providerKey]: true,
    }));

    setProviders((current) => {
      previousProviders = current;
      return current.map((item) =>
        item.id === provider.id
          ? {
              ...item,
              is_active: nextStatus,
            }
          : item
      );
    });

    try {
      await updateProvider(provider.id, { is_active: nextStatus });
      toast.success(nextStatus ? "Provider activated" : "Provider deactivated");
    } catch (error) {
      setProviders(previousProviders);

      if (error instanceof ApiError) {
        if (error.status === 401) {
          handleUnauthorized();
          return;
        }

        if (error.status >= 500) {
          toast.error("Unable to update provider status. Please try again.");
          return;
        }
      }

      toast.error("Unable to update provider status.");
    } finally {
      setTogglingProviders((current) => {
        const nextState = { ...current };
        delete nextState[providerKey];
        return nextState;
      });
    }
  }

  return (
    <LayoutWrapper>
      <section className="space-y-6">
        <PageHeader
          eyebrow="Directory"
          title="Providers"
          description="Manage assigned professionals and their status."
          badge={<Badge variant="outline" className="rounded-full px-2.5 py-0.5 text-[11px] font-semibold">{providers.length} providers</Badge>}
          actions={null}
        />

        <Card className="overflow-hidden p-0">
          <div className="border-b border-border/70 px-4 py-3 sm:px-6">
            <p className="text-sm font-medium text-card-foreground">Provider List</p>
          </div>

          <div className="border-b border-border/70 px-4 py-3 sm:px-6">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div className="relative w-full sm:max-w-sm">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(event) => setSearchTerm(event.target.value)}
                  placeholder="Search by name or phone"
                  className="h-10 w-full rounded-xl border border-input bg-background px-3 pr-10 text-sm text-foreground outline-none transition focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/50"
                />
                {searchTerm ? (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => setSearchTerm("")}
                    className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full text-muted-foreground hover:text-foreground"
                    aria-label="Clear search"
                  >
                    <XIcon className="h-4 w-4" />
                  </Button>
                ) : null}
              </div>
              {isSearching ? (
                <div className="inline-flex items-center gap-2 text-xs text-muted-foreground">
                  <span className="h-3 w-3 animate-spin rounded-full border-2 border-primary/30 border-t-primary" />
                  Searching...
                </div>
              ) : null}
            </div>
          </div>

          {loadState === "loading" ? (
            <div className="flex min-h-[220px] items-center justify-center p-6">
              <div className="inline-flex items-center gap-2 text-sm text-muted-foreground">
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-primary/30 border-t-primary" />
                Loading providers...
              </div>
            </div>
          ) : null}

          {loadState === "error" ? (
            <div className="p-6">
              <p className="text-sm font-medium text-destructive">{errorMessage}</p>
            </div>
          ) : null}

          {loadState === "idle" && providers.length === 0 ? (
            <div className="flex min-h-[220px] items-center justify-center p-6 text-center">
              <p className="text-sm text-muted-foreground">No providers found</p>
            </div>
          ) : null}

          {loadState === "idle" && providers.length > 0 ? (
            <div>
              <div className="overflow-x-auto">
                <table className="min-w-full text-left text-sm">
                  <thead className="bg-muted/40 text-xs uppercase tracking-[0.14em] text-muted-foreground">
                    <tr>
                      <th className="px-4 py-3 sm:px-6">Name</th>
                      <th className="px-4 py-3">Phone</th>
                      <th className="px-4 py-3">Specialization</th>
                      <th className="px-4 py-3">Experience</th>
                      <th className="px-4 py-3">Availability</th>
                      <th className="px-4 py-3">Verification</th>
                      <th className="px-4 py-3 sm:px-6">Status</th>
                      <th className="px-4 py-3 sm:px-6">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {providers.map((provider, index) => (
                      <tr
                        key={provider.id || `${provider.user?.phone || "provider"}-${index}`}
                        className="border-t border-border/70 text-card-foreground"
                      >
                        <td className="px-4 py-3 font-medium sm:px-6">{provider.user?.name || "-"}</td>
                        <td className="px-4 py-3">{provider.user?.phone || "-"}</td>
                        <td className="px-4 py-3">{provider.specialization || "-"}</td>
                        <td className="px-4 py-3">{provider.years_of_experience || 0} years</td>
                        <td className="px-4 py-3">
                          {provider.availability_status ? (
                            <StatusBadge
                              tone={
                                provider.availability_status.toLowerCase() === "online"
                                  ? "success"
                                  : provider.availability_status.toLowerCase() === "busy"
                                    ? "warning"
                                    : "danger"
                              }
                            >
                              <span className="mr-1">
                                {provider.availability_status.toLowerCase() === "online" ? "🟢" : 
                                 provider.availability_status.toLowerCase() === "busy" ? "🟡" : "🔴"}
                              </span>
                              {provider.availability_status.charAt(0).toUpperCase() + provider.availability_status.slice(1)}
                            </StatusBadge>
                          ) : (
                            <span className="text-muted-foreground">-</span>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          {provider.verification_status ? (
                            <StatusBadge
                              tone={
                                provider.verification_status.toLowerCase() === "verified"
                                  ? "success"
                                  : provider.verification_status.toLowerCase() === "pending"
                                    ? "warning"
                                    : "danger"
                              }
                            >
                              <span className="mr-1">
                                {provider.verification_status.toLowerCase() === "verified" ? "✅" : 
                                 provider.verification_status.toLowerCase() === "pending" ? "⚠️" : 
                                 provider.verification_status.toLowerCase() === "suspended" ? "🚫" : "❌"}
                              </span>
                              {provider.verification_status.charAt(0).toUpperCase() + provider.verification_status.slice(1)}
                            </StatusBadge>
                          ) : (
                            <span className="text-muted-foreground">-</span>
                          )}
                        </td>
                        <td className="px-4 py-3 sm:px-6">
                          <div className="flex flex-wrap items-center gap-2">
                            <StatusBadge tone={provider.is_active ? "success" : "warning"}>
                              {provider.is_active ? "Active" : "Inactive"}
                            </StatusBadge>
                            <Button
                              type="button"
                              variant={provider.is_active ? "outline" : "secondary"}
                              size="xs"
                              className="rounded-full"
                              onClick={() => handleToggleProviderStatus(provider)}
                              disabled={Boolean(togglingProviders[String(provider.id)])}
                            >
                              {togglingProviders[String(provider.id)] ? (
                                <span className="inline-flex items-center gap-1">
                                  <span className="h-3 w-3 animate-spin rounded-full border-2 border-current/30 border-t-current" />
                                  Updating
                                </span>
                              ) : provider.is_active ? (
                                "Deactivate"
                              ) : (
                                "Activate"
                              )}
                            </Button>
                          </div>
                        </td>
                        <td className="px-4 py-3 sm:px-6">
                          <div className="flex flex-wrap gap-2">
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              className="rounded-xl"
                              onClick={() => void handleViewProvider(provider.id)}
                            >
                              View
                            </Button>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              className="rounded-xl border border-border/70"
                              onClick={() => handleEditProvider(provider)}
                            >
                              Edit
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="flex flex-col items-center justify-between gap-3 border-t border-border/70 px-4 py-3 text-sm sm:flex-row sm:px-6">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="rounded-xl"
                  onClick={() => setPage((current) => Math.max(1, current - 1))}
                  disabled={page <= 1 || isSearching}
                >
                  Previous
                </Button>
                <span className="text-xs font-medium uppercase tracking-[0.16em] text-muted-foreground">
                  Page {page} of {totalPages}
                </span>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="rounded-xl"
                  onClick={() => setPage((current) => Math.min(totalPages, current + 1))}
                  disabled={page >= totalPages || isSearching}
                >
                  Next
                </Button>
              </div>
            </div>
          ) : null}
        </Card>

        <AddProviderModal
          open={isAddProviderOpen}
          onOpenChange={setIsAddProviderOpen}
          onProviderAdded={() =>
            fetchProvidersList({
              search: searchTermRef.current.trim(),
              nextPage: page,
              nextLimit: limit,
              showLoader: true,
            })
          }
          onUnauthorized={handleUnauthorized}
        />

        <ProviderDetailsModal
          open={isProviderDetailsOpen}
          onOpenChange={handleProviderDetailsOpenChange}
          selectedProviderId={selectedProviderId}
          providerDetails={providerDetails}
          isLoading={loading}
          errorMessage={providerDetailsError}
        />

        <EditProviderModal
          open={editModalOpen}
          onOpenChange={handleEditModalOpenChange}
          formData={formData}
          onFieldChange={handleEditFieldChange}
          onSubmit={handleUpdateProvider}
          isSubmitting={isEditSubmitting}
          errorMessage={editErrorMessage}
        />
      </section>
    </LayoutWrapper>
  );
}
