export const AUTH_LOGIN_PATH = "/login";

export const AUTH_REGISTER_PATH = "/login?mode=register";

export function authLoginPath(redirect?: string): string {
  if (!redirect) return AUTH_LOGIN_PATH;
  return `/login?redirect=${encodeURIComponent(redirect)}`;
}

export function authRegisterPath(redirect?: string): string {
  if (!redirect) return AUTH_REGISTER_PATH;
  return `/login?mode=register&redirect=${encodeURIComponent(redirect)}`;
}
