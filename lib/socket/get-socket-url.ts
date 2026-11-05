import { getApiBaseUrl } from "@/lib/env";

export function getSocketBaseUrl(): string {
  const explicit = process.env.NEXT_PUBLIC_SOCKET_URL?.trim();
  if (explicit && explicit !== "undefined") {
    return explicit.replace(/\/+$/, "");
  }
  return getApiBaseUrl().replace(/\/api\/v1\/?$/i, "");
}
