export type LocalUser = {
  name: string;
  phone: string;
  agency?: string;
  location?: string;
};

const USER_STORAGE_KEY = "user";
const PENDING_PHONE_STORAGE_KEY = "pendingPhone";

export function getStoredUser(): LocalUser | null {
  if (typeof window === "undefined") {
    return null;
  }

  const rawUser = window.localStorage.getItem(USER_STORAGE_KEY);

  if (!rawUser) {
    return null;
  }

  try {
    const parsed = JSON.parse(rawUser) as Partial<LocalUser>;

    if (typeof parsed.name !== "string" || typeof parsed.phone !== "string") {
      return null;
    }

    return {
      name: parsed.name,
      phone: parsed.phone,
      agency: typeof parsed.agency === "string" ? parsed.agency : undefined,
      location: typeof parsed.location === "string" ? parsed.location : undefined,
    };
  } catch {
    return null;
  }
}

export function setStoredUser(user: LocalUser) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
}

export function clearStoredUser() {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.removeItem(USER_STORAGE_KEY);
  window.localStorage.removeItem(PENDING_PHONE_STORAGE_KEY);
}

export function setPendingPhone(phone: string) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(PENDING_PHONE_STORAGE_KEY, phone);
}

export function getPendingPhone() {
  if (typeof window === "undefined") {
    return null;
  }

  return window.localStorage.getItem(PENDING_PHONE_STORAGE_KEY);
}

export function clearPendingPhone() {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.removeItem(PENDING_PHONE_STORAGE_KEY);
}
