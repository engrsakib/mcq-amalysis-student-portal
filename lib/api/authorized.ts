import { getApiBaseUrl } from "@/lib/env";
import { ApiError, joinUrl, parseApiResponse } from "@/lib/api/client";
import { ensureValidAccessToken, logoutAndRedirect } from "@/lib/auth/session";

async function authorizedFetch(
  path: string,
  init: RequestInit,
  retried = false
): Promise<Response> {
  const token = await ensureValidAccessToken({ force: retried });
  if (!token) {
    throw new ApiError(
      "Unauthenticated access. Please login to access resource(s)",
      401
    );
  }

  const headers = new Headers(init.headers);
  headers.set("Authorization", token);
  if (init.body && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  const res = await fetch(joinUrl(getApiBaseUrl(), path), {
    ...init,
    headers,
  });

  if (res.status === 401 && !retried) {
    const refreshed = await ensureValidAccessToken({ force: true });
    if (refreshed) {
      return authorizedFetch(path, init, true);
    }
    logoutAndRedirect();
    throw new ApiError(
      "Unauthenticated access. Please login to access resource(s)",
      401
    );
  }

  return res;
}

export async function apiGetAuth<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await authorizedFetch(path, { ...init, method: "GET" });
  return parseApiResponse<T>(res);
}

export async function apiPostAuth<T>(
  path: string,
  body: unknown,
  init?: RequestInit
): Promise<T> {
  const res = await authorizedFetch(path, {
    ...init,
    method: "POST",
    body: JSON.stringify(body),
  });
  return parseApiResponse<T>(res);
}

export async function apiPatchAuth<T>(
  path: string,
  body: unknown,
  init?: RequestInit
): Promise<T> {
  const res = await authorizedFetch(path, {
    ...init,
    method: "PATCH",
    body: JSON.stringify(body),
  });
  return parseApiResponse<T>(res);
}
