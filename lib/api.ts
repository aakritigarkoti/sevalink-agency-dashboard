import { fetchWithAuth } from "@/lib/auth-fetch";
import { API_BASE_URL } from "@/lib/api-config";
import { getStoredToken, getStoredUser, setStoredUser } from "@/lib/local-auth";

export type AgencyProfile = {
  name: string;
  phone: string;
  agencyName: string;
  registrationNumber?: string;
  gstNumber?: string;
  contactPerson?: string;
  contactEmail?: string;
  contactPhone?: string;
  userName?: string;
  userPhone?: string;
};

type AgencyProfileApiResponse = {
  agency_name?: string;
  company_name?: string;
  registration_number?: string;
  gst_number?: string;
  contact_person?: string;
  contact_phone?: string;
  contact_email?: string;
  phone?: string;
  user?: {
    name?: string;
    phone?: string;
    role?: string;
  };
};

export type UpdateAgencyProfileInput = {
  agency_name?: string;
  company_name?: string;
  contact_phone?: string;
};

export type Provider = {
  id: number | string;
  user?: {
    name?: string;
    phone?: string;
  };
  specialization: string;
  years_of_experience: number;
  is_active: boolean;
  availability_status?: string;
  verification_status?: string;
};

export type ProviderDetails = {
  id: number | string;
  user?: {
    name?: string;
    phone?: string;
  };
  qualification: string;
  specialization: string;
  years_of_experience: number;
  address: string;
  city: string;
  state: string;
  pincode: string;
  license_number: string;
  is_active: boolean;
  availability_status?: string;
  verification_status?: string;
};

type ProviderApiItem = {
  id?: number | string;
  name?: string;
  phone?: string;
  contact_phone?: string;
  user?: {
    name?: string;
    phone?: string;
  };
  specialization?: string;
  years_of_experience?: number | string;
  is_active?: boolean;
  availability_status?: string;
  verification_status?: string;
  qualification?: string;
  license_number?: string;
  licenseNo?: string;
  license?: string;
  address?: string;
  city?: string;
  state?: string;
  pincode?: string;
  provider_address?: {
    address?: string;
    city?: string;
    state?: string;
    pincode?: string;
  };
  location?: {
    address?: string;
    city?: string;
    state?: string;
    pincode?: string;
  };
};

type ProvidersApiResponse = {
  data?: ProviderApiItem[];
  providers?: ProviderApiItem[];
  items?: ProviderApiItem[];
  total?: number;
  count?: number;
  total_pages?: number;
  totalPages?: number;
  page?: number;
  limit?: number;
  meta?: {
    total?: number;
    totalPages?: number;
  };
};

type ProviderApiResponse = ProviderApiItem | { data?: ProviderApiItem; provider?: ProviderApiItem };

export type CreateProviderInput = {
  phone: string;
  name: string;
  qualification: string;
  specialization: string;
  years_of_experience: number;
  address: string;
  city: string;
  state: string;
  pincode: string;
  latitude: number;
  longitude: number;
  service_ids?: string[];
};

export type ServiceCategory = {
  id: number | string;
  name: string;
  services: Array<{
    id: number | string;
    name: string;
  }>;
};

type ServiceApiItem = {
  id?: number | string;
  name?: string;
};

type ServiceCategoryApiItem = {
  id: number | string;
  name: string;
  services?: ServiceApiItem[];
};

type ListApiResponse<T> = T[] | { data?: T[]; categories?: T[]; services?: T[]; value?: T[] };

export type UpdateProviderInput = {
  name?: string;
  specialization?: string;
  years_of_experience?: number;
  is_active?: boolean;
};

export class ApiError extends Error {
  status: number;

  constructor(status: number, message = "Request failed") {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

function mapAgencyProfile(data: AgencyProfileApiResponse): AgencyProfile {
  const agencyName = data.company_name ?? data.agency_name ?? "";
  const phone = data.contact_phone ?? data.phone ?? data.user?.phone ?? "";

  return {
    name: data.user?.name ?? agencyName,
    phone,
    agencyName,
    registrationNumber: data.registration_number,
    gstNumber: data.gst_number,
    contactPerson: data.contact_person,
    contactEmail: data.contact_email,
    contactPhone: data.contact_phone,
    userName: data.user?.name,
    userPhone: data.user?.phone,
  };
}

function toNumber(value: number | string | undefined) {
  if (typeof value === "number") {
    return value;
  }

  if (typeof value === "string") {
    const parsedValue = Number(value);
    return Number.isFinite(parsedValue) ? parsedValue : 0;
  }

  return 0;
}

function mapProvider(item: ProviderApiItem): Provider {
  return {
    id: item.id ?? "",
    user: {
      name: item.user?.name ?? item.name ?? "",
      phone: item.user?.phone ?? item.contact_phone ?? item.phone ?? "",
    },
    specialization: item.specialization ?? "",
    years_of_experience: toNumber(item.years_of_experience),
    is_active: item.is_active === true,
    availability_status: item.availability_status,
    verification_status: item.verification_status,
  };
}

function mapProviderDetails(item: ProviderApiItem): ProviderDetails {
  const providerAddress = item.provider_address ?? item.location;

  return {
    id: item.id ?? "",
    user: {
      name: item.user?.name ?? item.name ?? "",
      phone: item.user?.phone ?? item.contact_phone ?? item.phone ?? "",
    },
    qualification: item.qualification ?? "",
    specialization: item.specialization ?? "",
    years_of_experience: toNumber(item.years_of_experience),
    address: providerAddress?.address ?? item.address ?? "",
    city: providerAddress?.city ?? item.city ?? "",
    state: providerAddress?.state ?? item.state ?? "",
    pincode: providerAddress?.pincode ?? item.pincode ?? "",
    license_number: item.license_number ?? item.licenseNo ?? item.license ?? "",
    is_active: item.is_active === true,
    availability_status: item.availability_status,
    verification_status: item.verification_status,
  };
}

function unwrapProviderResponse(data: ProviderApiResponse): ProviderApiItem {
  if ("data" in data && data.data) {
    return data.data;
  }

  if ("provider" in data && data.provider) {
    return data.provider;
  }

  return data as ProviderApiItem;
}

async function parseErrorMessage(response: Response) {
  try {
    const data = (await response.json()) as { message?: string; error?: string };
    return data.message ?? data.error ?? undefined;
  } catch {
    return undefined;
  }
}

export async function getAgencyProfile() {
  const response = await fetchWithAuth(`${API_BASE_URL}/agency/me`);

  if (!response.ok) {
    throw new ApiError(response.status, await parseErrorMessage(response));
  }

  const data = (await response.json()) as AgencyProfileApiResponse;
  const profile = mapAgencyProfile(data);

  // Sync with local session for Sidebar/Header consistency
  const currentUser = getStoredUser();
  if (currentUser) {
    setStoredUser({
      ...currentUser,
      name: profile.userName || profile.name,
      agency: profile.agencyName,
    });
    window.dispatchEvent(new Event("storage"));
  }

  return profile;
}

export async function updateAgencyProfile(input: UpdateAgencyProfileInput) {
  const response = await fetchWithAuth(`${API_BASE_URL}/agency/me`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(input),
  });

  if (!response.ok) {
    throw new ApiError(response.status, await parseErrorMessage(response));
  }

  const data = (await response.json()) as AgencyProfileApiResponse;
  const profile = mapAgencyProfile(data);

  // Sync with local session immediately
  const currentUser = getStoredUser();
  if (currentUser) {
    setStoredUser({
      ...currentUser,
      name: profile.userName || profile.name,
      agency: profile.agencyName,
    });
    window.dispatchEvent(new Event("storage"));
  }

  return profile;
}

export async function getProviders(page = 1, limit = 10, search?: string) {
  const queryParams = new URLSearchParams({
    page: String(page),
    limit: String(limit),
  });

  if (search) {
    queryParams.set("search", search);
  }

  const response = await fetchWithAuth(`${API_BASE_URL}/agency/providers?${queryParams.toString()}`);

  if (!response.ok) {
    throw new ApiError(response.status, await parseErrorMessage(response));
  }

  const data = (await response.json()) as ProvidersApiResponse;
  const providers = data.data ?? data.providers ?? data.items ?? [];
  const totalCount = data.total ?? data.count ?? data.meta?.total;
  const explicitTotalPages = data.total_pages ?? data.totalPages ?? data.meta?.totalPages;
  const totalPages =
    explicitTotalPages ?? (typeof totalCount === "number" ? Math.max(1, Math.ceil(totalCount / limit)) : undefined);

  return {
    items: providers.map(mapProvider),
    totalCount,
    totalPages,
  };
}

export async function createProvider(input: CreateProviderInput) {
  const response = await fetchWithAuth(`${API_BASE_URL}/homecare-agency/providers`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(input),
  });

  if (!response.ok) {
    throw new ApiError(response.status, await parseErrorMessage(response));
  }

  const data = (await response.json()) as ProviderApiResponse;
  return mapProvider(unwrapProviderResponse(data));
}

export async function getServiceCategories() {
  const response = await fetch(`${API_BASE_URL}/homecare-service/categories`);

  if (!response.ok) {
    throw new ApiError(response.status, await parseErrorMessage(response));
  }

  const data = (await response.json()) as ListApiResponse<ServiceCategoryApiItem>;
  const categories = Array.isArray(data) ? data : data.data ?? data.categories ?? data.value ?? [];

  return Promise.all(
    categories.map(async (category) => {
      const embeddedServices = category.services ?? [];

      if (embeddedServices.length > 0) {
        return {
          id: category.id,
          name: category.name,
          services: embeddedServices.map((service) => ({
            id: service.id ?? "",
            name: service.name ?? "",
          })),
        };
      }

      const servicesResponse = await fetch(`${API_BASE_URL}/homecare-service/categories/${category.id}/services`);

      if (!servicesResponse.ok) {
        throw new ApiError(servicesResponse.status, await parseErrorMessage(servicesResponse));
      }

      const servicesData = (await servicesResponse.json()) as ListApiResponse<ServiceApiItem>;
      const services = Array.isArray(servicesData)
        ? servicesData
        : servicesData.data ?? servicesData.services ?? servicesData.value ?? [];

      return {
        id: category.id,
        name: category.name,
        services: services.map((service) => ({
          id: service.id ?? "",
          name: service.name ?? "",
        })),
      };
    })
  );
}

export async function updateProvider(providerId: number | string, input: UpdateProviderInput) {
  const response = await fetchWithAuth(`${API_BASE_URL}/homecare-agency/providers/${providerId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(input),
  });

  if (!response.ok) {
    throw new ApiError(response.status, await parseErrorMessage(response));
  }

  const data = (await response.json()) as ProviderApiResponse;
  return mapProvider(unwrapProviderResponse(data));
}

export async function getProviderDetails(providerId: number | string) {
  const response = await fetchWithAuth(`${API_BASE_URL}/homecare-agency/providers/${providerId}`);

  if (!response.ok) {
    throw new ApiError(response.status, await parseErrorMessage(response));
  }

  const data = (await response.json()) as ProviderApiResponse;
  return mapProviderDetails(unwrapProviderResponse(data));
}

export async function logout() {
  const token = getStoredToken();
  const response = await fetch(`${API_BASE_URL}/auth/logout`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });
  return response;
}
