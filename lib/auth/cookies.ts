const ACCESS_COOKIE = "access_token";
const REFRESH_COOKIE = "refresh_token";
const REMEMBER_COOKIE = "auth_remember";

const DAY = 60 * 60 * 24;

function readCookie(name: string): string | null {
  if (typeof document === "undefined") return null;
  const prefix = `${name}=`;
  const match = document.cookie
    .split("; ")
    .find((row) => row.startsWith(prefix));
  if (!match) return null;
  return decodeURIComponent(match.slice(prefix.length)) || null;
}

function writeCookie(name: string, value: string, maxAge: number) {
  document.cookie = `${name}=${encodeURIComponent(value)}; path=/; max-age=${maxAge}; SameSite=Lax`;
}

export function getAccessToken(): string | null {
  return readCookie(ACCESS_COOKIE);
}

export function getRefreshToken(): string | null {
  return readCookie(REFRESH_COOKIE);
}

export function isRememberMe(): boolean {
  return readCookie(REMEMBER_COOKIE) === "1";
}

export function setAuthCookies(
  accessToken: string,
  refreshToken: string,
  rememberMe: boolean
) {
  const accessMaxAge = rememberMe ? DAY * 7 : DAY;
  const refreshMaxAge = rememberMe ? DAY * 30 : DAY * 7;

  writeCookie(ACCESS_COOKIE, accessToken, accessMaxAge);
  writeCookie(REFRESH_COOKIE, refreshToken, refreshMaxAge);
  writeCookie(REMEMBER_COOKIE, rememberMe ? "1" : "0", refreshMaxAge);
}

export function clearAuthCookies() {
  writeCookie(ACCESS_COOKIE, "", 0);
  writeCookie(REFRESH_COOKIE, "", 0);
  writeCookie(REMEMBER_COOKIE, "", 0);
}
