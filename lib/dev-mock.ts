/**
 * DEV MOCK — Development-only auth bypass
 *
 * This file provides a fake authenticated session so the agency dashboard
 * can be developed locally without a working backend connection.
 *
 * HOW TO DISABLE (revert to real auth):
 *   Set NEXT_PUBLIC_DEV_BYPASS_AUTH=false (or remove it) in .env.local
 *   Then restart the dev server — the mock session will not be seeded.
 *
 * This file is NOT imported in any production code path; it is only called
 * from local-auth.ts when the bypass flag is active.
 */

export const DEV_BYPASS_ENABLED =
  process.env.NEXT_PUBLIC_DEV_BYPASS_AUTH === "true";

/** Fake JWT-shaped token (not a real signed JWT — only used locally) */
export const DEV_MOCK_TOKEN =
  "dev_mock_token.eyJzdWIiOiJkZXYtdXNlci0wMDEiLCJyb2xlIjoiaG9tZWNhcmVfYWdlbmN5IiwicGhvbmUiOiI5MDAwMDAwMDAxIn0.dev_signature";

export const DEV_MOCK_USER = {
  id: "dev-agency-001",
  name: "Demo Agency",
  agency: "SevaLink Demo Agency",
  phone: "9000000001",
  role: "homecare_agency",
  location: "Bengaluru, Karnataka",
};
