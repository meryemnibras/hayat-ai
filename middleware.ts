import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const hostname = request.headers.get("host") || "";
  const url = request.nextUrl.clone();

  // Remove port if present (for localhost)
  const host = hostname.split(":")[0];

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // 🌐 DOMAIN-BASED ROUTING
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  // portal.mediai.tr → /portal
  if (host === "portal.mediai.tr" || host === "www.portal.mediai.tr") {
    // Rewrite root to /portal
    if (url.pathname === "/") {
      url.pathname = "/portal";
      return NextResponse.rewrite(url);
    }
    // Rewrite paths like /register, /login to /portal/register, /portal/login
    if (url.pathname === "/register" || url.pathname === "/login") {
      url.pathname = `/portal${url.pathname}`;
      return NextResponse.rewrite(url);
    }
    // If already on /portal or other paths, let it pass through
    return NextResponse.next();
  }

  // app.mediai.tr → /dashboard (if needed in future)
  if (host === "app.mediai.tr" || host === "www.app.mediai.tr") {
    if (url.pathname === "/") {
      url.pathname = "/dashboard";
      return NextResponse.rewrite(url);
    }
    return NextResponse.next();
  }

  // mediai.tr → landing page (default, no rewrite needed)
  // The root page.tsx already handles this
  // For /portal/* routes on mediai.tr, let them pass through normally

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (images, etc.)
     */
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|jpeg)$).*)",
  ],
};

