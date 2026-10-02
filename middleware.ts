import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { refreshUserTokens } from "@/lib/api/auth";
import { ApiError } from "@/lib/api/client";
import {
  ACCESS_COOKIE,
  REFRESH_COOKIE,
  REMEMBER_COOKIE,
  REFRESHED_ACCESS_HEADER,
  writeAuthCookies,
} from "@/lib/auth/cookie-config";
import { isJwtExpired } from "@/lib/auth/jwt";
import { isPreviewBot } from "@/lib/site/preview-bot";
import { GOOGLE_SITEMAP_PATH } from "@/lib/site/sitemap";

const PUBLIC_PATHS = ["/login", "/verify", "/forgot-password"];

const PUBLIC_EXACT_PATHS = new Set([GOOGLE_SITEMAP_PATH, "/robots.txt"]);

function isPublicPath(pathname: string): boolean {
  if (PUBLIC_EXACT_PATHS.has(pathname)) return true;
  return PUBLIC_PATHS.some(
    (path) => pathname === path || pathname.startsWith(`${path}/`)
  );
}

function hasSession(request: NextRequest): boolean {
  return Boolean(
    request.cookies.get(ACCESS_COOKIE)?.value ||
      request.cookies.get(REFRESH_COOKIE)?.value
  );
}

async function maybeRefreshSession(request: NextRequest) {
  const refresh = request.cookies.get(REFRESH_COOKIE)?.value;
  if (!refresh) return null;

  const access = request.cookies.get(ACCESS_COOKIE)?.value;
  if (access && !isJwtExpired(access)) return null;

  try {
    return await refreshUserTokens({ refresh_token: refresh });
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

export async function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl;

  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/favicon") ||
    pathname.match(/\.(avif|png|jpg|jpeg|svg|ico|webp|gif)$/)
  ) {
    return NextResponse.next();
  }

  const authenticated = hasSession(request);

  if (pathname === "/login" && authenticated) {
    const redirect = request.nextUrl.searchParams.get("redirect");
    const target =
      redirect && redirect.startsWith("/") && !redirect.startsWith("//")
        ? redirect
        : "/";
    return NextResponse.redirect(new URL(target, request.url));
  }

  if (!isPublicPath(pathname) && !authenticated) {
    if (pathname === "/" && isPreviewBot(request.headers.get("user-agent"))) {
      return NextResponse.next();
    }

    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", `${pathname}${search}` || pathname);
    return NextResponse.redirect(loginUrl);
  }

  const requestHeaders = new Headers(request.headers);
  requestHeaders.delete(REFRESHED_ACCESS_HEADER);

  let response: NextResponse;

  if (authenticated && !isPublicPath(pathname)) {
    const tokens = await maybeRefreshSession(request);
    if (tokens) {
      requestHeaders.set(REFRESHED_ACCESS_HEADER, tokens.access_token);
      response = NextResponse.next({
        request: { headers: requestHeaders },
      });
      const rememberMe =
        request.cookies.get(REMEMBER_COOKIE)?.value === "1";
      writeAuthCookies(
        (name, value, options) => response.cookies.set(name, value, options),
        tokens.access_token,
        tokens.refresh_token,
        rememberMe
      );
      return response;
    }
  }

  response = NextResponse.next({
    request: { headers: requestHeaders },
  });
  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image).*)"],
};
