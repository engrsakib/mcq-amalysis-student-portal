const ACCESS_COOKIE = "access_token";
const REFRESH_COOKIE = "refresh_token";

const DAY = 60 * 60 * 24;

export function setAuthCookies(
  accessToken: string,
  refreshToken: string,
  rememberMe: boolean
) {
  const accessMaxAge = rememberMe ? DAY * 7 : DAY;
  const refreshMaxAge = rememberMe ? DAY * 30 : DAY * 7;

  document.cookie = `${ACCESS_COOKIE}=${accessToken}; path=/; max-age=${accessMaxAge}; SameSite=Lax`;
  document.cookie = `${REFRESH_COOKIE}=${refreshToken}; path=/; max-age=${refreshMaxAge}; SameSite=Lax`;
}

export function clearAuthCookies() {
  document.cookie = `${ACCESS_COOKIE}=; path=/; max-age=0; SameSite=Lax`;
  document.cookie = `${REFRESH_COOKIE}=; path=/; max-age=0; SameSite=Lax`;
}
