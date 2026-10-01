import "server-only";

import { getApiBaseUrl } from "@/lib/env";
import { ApiError, joinUrl, parseApiResponse } from "@/lib/api/client";
import { ensureServerAccessToken } from "@/lib/auth/server-session";

export async function apiGetAuthServer<T>(
  path: string,
  init?: RequestInit
): Promise<T> {
  const token = await ensureServerAccessToken();
  if (!token) {
    throw new ApiError(
      "Unauthenticated access. Please login to access resource(s)",
      401
    );
  }

  const res = await fetch(joinUrl(getApiBaseUrl(), path), {
    ...init,
    method: "GET",
    headers: {
      Authorization: token,
      ...init?.headers,
    },
    cache: "no-store",
  });

  if (res.status === 401) {
    throw new ApiError(
      "Unauthenticated access. Please login to access resource(s)",
      401
    );
  }

  return parseApiResponse<T>(res);
}
