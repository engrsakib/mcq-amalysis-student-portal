const API_V1_SUFFIX = "/api/v1";

function stripTrailingSlash(url: string): string {
  return url.replace(/\/+$/, "");
}

function normalizeApiBaseUrl(url: string): string {
  const trimmed = stripTrailingSlash(url.trim());
  return trimmed.replace(/(\/api\/v1)+$/i, API_V1_SUFFIX);
}

export function getApiBaseUrl(): string {
  const value = process.env.NEXT_PUBLIC_API_BASE_URL?.trim();
  if (!value || value === "undefined") {
    throw new Error("NEXT_PUBLIC_API_BASE_URL is not configured");
  }
  return normalizeApiBaseUrl(value);
}
