import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const PUBLIC_PATHS = ["/login", "/verify", "/forgot-password"];

function isPublicPath(pathname: string): boolean {
  return PUBLIC_PATHS.some(
    (path) => pathname === path || pathname.startsWith(`${path}/`)
  );
}

function hasSession(request: NextRequest): boolean {
  return Boolean(
    request.cookies.get("access_token")?.value ||
      request.cookies.get("refresh_token")?.value
  );
}

export function middleware(request: NextRequest) {
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
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", `${pathname}${search}` || pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image).*)"],
};
