import "server-only";

import { cookies } from "next/headers";

export const ACCESS_COOKIE = "access_token";
export const REFRESH_COOKIE = "refresh_token";
export const REMEMBER_COOKIE = "auth_remember";

const DAY = 60 * 60 * 24;

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

export async function setServerAuthCookies(
  accessToken: string,
  refreshToken: string,
  rememberMe: boolean
) {
  const store = await cookies();
  const accessMaxAge = rememberMe ? DAY * 7 : DAY;
  const refreshMaxAge = rememberMe ? DAY * 30 : DAY * 7;

  store.set(ACCESS_COOKIE, accessToken, {
    path: "/",
    maxAge: accessMaxAge,
    sameSite: "lax",
  });
  store.set(REFRESH_COOKIE, refreshToken, {
    path: "/",
    maxAge: refreshMaxAge,
    sameSite: "lax",
  });
  store.set(REMEMBER_COOKIE, rememberMe ? "1" : "0", {
    path: "/",
    maxAge: refreshMaxAge,
    sameSite: "lax",
  });
}
