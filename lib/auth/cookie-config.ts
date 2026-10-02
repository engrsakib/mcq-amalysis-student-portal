/** Shared auth cookie names and options (middleware + server). */

export const ACCESS_COOKIE = "access_token";
export const REFRESH_COOKIE = "refresh_token";
export const REMEMBER_COOKIE = "auth_remember";

/** Set by middleware after refresh; never trust from client requests. */
export const REFRESHED_ACCESS_HEADER = "x-mcq-refreshed-access";

const DAY = 60 * 60 * 24;

export function authCookieMaxAge(rememberMe: boolean) {
  return {
    access: rememberMe ? DAY * 7 : DAY,
    refresh: rememberMe ? DAY * 30 : DAY * 7,
  };
}

type CookieWriteOptions = {
  path: string;
  maxAge: number;
  sameSite: "lax";
};

export function writeAuthCookies(
  setCookie: (name: string, value: string, options: CookieWriteOptions) => void,
  accessToken: string,
  refreshToken: string,
  rememberMe: boolean
) {
  const { access, refresh } = authCookieMaxAge(rememberMe);
  setCookie(ACCESS_COOKIE, accessToken, {
    path: "/",
    maxAge: access,
    sameSite: "lax",
  });
  setCookie(REFRESH_COOKIE, refreshToken, {
    path: "/",
    maxAge: refresh,
    sameSite: "lax",
  });
  setCookie(REMEMBER_COOKIE, rememberMe ? "1" : "0", {
    path: "/",
    maxAge: refresh,
    sameSite: "lax",
  });
}
