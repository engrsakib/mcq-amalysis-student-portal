import { getApiBaseUrl } from "@/lib/env";
import type { ApiErrorMessage, ApiResponse } from "@/lib/api/types";

export class ApiError extends Error {
  statusCode: number;
  errorMessages?: ApiErrorMessage[];

  constructor(
    message: string,
    statusCode: number,
    errorMessages?: ApiErrorMessage[]
  ) {
    super(message);
    this.name = "ApiError";
    this.statusCode = statusCode;
    this.errorMessages = errorMessages;
  }
}

function joinUrl(base: string, path: string): string {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${base}${normalizedPath}`;
}

export async function apiPost<T>(
  path: string,
  body: unknown,
  init?: RequestInit
): Promise<T> {
  const base = getApiBaseUrl();
  const res = await fetch(joinUrl(base, path), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...init?.headers,
    },
    body: JSON.stringify(body),
    ...init,
  });

  let json: ApiResponse<T>;
  try {
    json = (await res.json()) as ApiResponse<T>;
  } catch {
    throw new ApiError("Invalid server response", res.status);
  }

  if (!json.success) {
    throw new ApiError(
      json.message || "Request failed",
      json.statusCode ?? res.status,
      json.errorMessages
    );
  }

  return json.data;
}
