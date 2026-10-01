import "server-only";

import { refreshUserTokens } from "@/lib/api/auth";
import { ApiError } from "@/lib/api/client";
import { isJwtExpired } from "@/lib/auth/jwt";
import {
  getServerAccessToken,
  getServerRefreshToken,
  isServerRememberMe,
  setServerAuthCookies,
} from "@/lib/auth/server-cookies";

export async function ensureServerAccessToken(): Promise<string | null> {
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
    const rememberMe = await isServerRememberMe();
    await setServerAuthCookies(
      tokens.access_token,
      tokens.refresh_token,
      rememberMe
    );
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
