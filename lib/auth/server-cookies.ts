import "server-only";

import { cookies } from "next/headers";
import {
  ACCESS_COOKIE,
  REFRESH_COOKIE,
  REMEMBER_COOKIE,
  writeAuthCookies,
} from "@/lib/auth/cookie-config";

export {
  ACCESS_COOKIE,
  REFRESH_COOKIE,
  REMEMBER_COOKIE,
} from "@/lib/auth/cookie-config";

export async function getServerAccessToken(): Promise<string | undefined> {
  const store = await cookies();
  return store.get(ACCESS_COOKIE)?.value;
}

export async function getServerRefreshToken(): Promise<string | undefined> {
  const store = await cookies();
  return store.get(REFRESH_COOKIE)?.value;
}

export async function isServerRememberMe(): Promise<boolean> {
  const store = await cookies();
  return store.get(REMEMBER_COOKIE)?.value === "1";
}

/** Use only in Route Handlers or Server Actions — not during RSC render. */
export async function setServerAuthCookies(
  accessToken: string,
  refreshToken: string,
  rememberMe: boolean
) {
  const store = await cookies();
  writeAuthCookies(
    (name, value, options) => store.set(name, value, options),
    accessToken,
    refreshToken,
    rememberMe
  );
}
