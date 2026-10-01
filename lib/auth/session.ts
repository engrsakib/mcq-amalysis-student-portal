import { ApiError } from "@/lib/api/client";
import { refreshUserTokens } from "@/lib/api/auth";
import {
  clearAuthCookies,
  getAccessToken,
  getRefreshToken,
  isRememberMe,
  setAuthCookies,
} from "@/lib/auth/cookies";
import { isJwtExpired } from "@/lib/auth/jwt";

let refreshInFlight: Promise<string | null> | null = null;

export function redirectToLogin() {
  if (typeof window === "undefined") return;
  const path = `${window.location.pathname}${window.location.search}`;
  window.location.assign(
    `/login?redirect=${encodeURIComponent(path || "/")}`
  );
}

export function logoutAndRedirect() {
  clearAuthCookies();
  redirectToLogin();
}

async function refreshSession(): Promise<string | null> {
  const refreshToken = getRefreshToken();
  if (!refreshToken) {
    logoutAndRedirect();
    return null;
  }

  try {
    const tokens = await refreshUserTokens({ refresh_token: refreshToken });
    setAuthCookies(tokens.access_token, tokens.refresh_token, isRememberMe());
    return tokens.access_token;
  } catch (err) {
    if (
      err instanceof ApiError &&
      (err.statusCode === 401 || err.statusCode === 400)
    ) {
      logoutAndRedirect();
      return null;
    }
    throw err;
  }
}

export async function ensureValidAccessToken(options?: {
  force?: boolean;
}): Promise<string | null> {
  if (!options?.force) {
    const access = getAccessToken();
    if (access && !isJwtExpired(access)) {
      return access;
    }
  }

  if (!refreshInFlight) {
    refreshInFlight = refreshSession().finally(() => {
      refreshInFlight = null;
    });
  }

  return refreshInFlight;
}
