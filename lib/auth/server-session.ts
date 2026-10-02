import "server-only";

import { headers } from "next/headers";
import { refreshUserTokens } from "@/lib/api/auth";
import { ApiError } from "@/lib/api/client";
import { REFRESHED_ACCESS_HEADER } from "@/lib/auth/cookie-config";
import { isJwtExpired } from "@/lib/auth/jwt";
import {
  getServerAccessToken,
  getServerRefreshToken,
} from "@/lib/auth/server-cookies";

export async function ensureServerAccessToken(): Promise<string | null> {
  const headerStore = await headers();
  const refreshedAccess = headerStore.get(REFRESHED_ACCESS_HEADER);
  if (refreshedAccess) {
    return refreshedAccess;
  }

  const access = await getServerAccessToken();
  if (access && !isJwtExpired(access)) {
    return access;
  }

  const refresh = await getServerRefreshToken();
  if (!refresh) {
    return null;
  }

  try {
    const tokens = await refreshUserTokens({ refresh_token: refresh });
    return tokens.access_token;
  } catch (err) {
    if (
      err instanceof ApiError &&
      (err.statusCode === 401 || err.statusCode === 400)
    ) {
      return null;
    }
    throw err;
  }
}
