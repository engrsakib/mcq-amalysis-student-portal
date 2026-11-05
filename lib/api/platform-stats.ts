import { apiGet, joinUrl, parseApiResponse } from "@/lib/api/client";
import { getApiBaseUrl } from "@/lib/env";

export type PlatformPublicStatsPayload = {
  registeredStudents: number;
  examAttempts: number;
  routinesAndLiveClasses: number;
  generatedAt: string;
};

const REVALIDATE_SECONDS = 300;

/** Server-side fetch with ISR-style revalidation for public docs. */
export async function fetchPublicPlatformStats(): Promise<PlatformPublicStatsPayload> {
  const base = getApiBaseUrl();
  const res = await fetch(joinUrl(base, "/public/platform-stats"), {
    method: "GET",
    next: { revalidate: REVALIDATE_SECONDS },
  });
  return parseApiResponse<PlatformPublicStatsPayload>(res);
}

/** Client or server without Next cache options. */
export async function getPublicPlatformStats(): Promise<PlatformPublicStatsPayload> {
  return apiGet<PlatformPublicStatsPayload>("/public/platform-stats");
}
