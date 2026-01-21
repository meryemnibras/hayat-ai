import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Define protected routes that require authentication
const isProtectedRoute = createRouteMatcher([
  "/dashboard(.*)",
  "/api/ai(.*)",
]);

// Domain-based routing function
function handleDomainRouting(request: NextRequest): NextResponse | null {
  const hostname = request.headers.get("host") || "";
  const url = request.nextUrl.clone();

  // Remove port if present (for localhost)
  const host = hostname.split(":")[0].toLowerCase();

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // 🌐 DOMAIN-BASED ROUTING
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  // portal.mediai.tr → /portal/*
  if (host === "portal.mediai.tr" || host === "www.portal.mediai.tr") {
    // Skip if already API or static files
    if (url.pathname.startsWith("/api") || url.pathname.startsWith("/_next")) {
      return null; // Let Clerk handle it
    }
    
    // Block access to non-portal routes - redirect to portal
    if (url.pathname.startsWith("/dashboard") || url.pathname.startsWith("/pricing")) {
      url.pathname = "/portal";
      return NextResponse.rewrite(url);
    }
    
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
    
    // If path doesn't start with /portal, add it
    if (!url.pathname.startsWith("/portal")) {
      url.pathname = `/portal${url.pathname}`;
      return NextResponse.rewrite(url);
    }
    
    return null; // Let Clerk handle it
  }

  // app.mediai.tr → /dashboard/*
  if (host === "app.mediai.tr" || host === "www.app.mediai.tr") {
    // Skip if already API or static files
    if (url.pathname.startsWith("/api") || url.pathname.startsWith("/_next")) {
      return null; // Let Clerk handle it
    }
    
    // Block access to non-dashboard routes - redirect to dashboard
    if (url.pathname.startsWith("/portal") || url.pathname.startsWith("/pricing")) {
      url.pathname = "/dashboard";
      return NextResponse.rewrite(url);
    }
    
    // Rewrite root to /dashboard
    if (url.pathname === "/") {
      url.pathname = "/dashboard";
      return NextResponse.rewrite(url);
    }
    
    // If path doesn't start with /dashboard, add it
    if (!url.pathname.startsWith("/dashboard")) {
      url.pathname = `/dashboard${url.pathname}`;
      return NextResponse.rewrite(url);
    }
    
    return null; // Let Clerk handle it
  }

  // mediai.tr → landing page only
  if (host === "mediai.tr" || host === "www.mediai.tr") {
    // Block direct access to /dashboard from main domain - redirect to app.mediai.tr
    if (url.pathname.startsWith("/dashboard")) {
      const newPath = url.pathname.replace("/dashboard", "") || "/";
      return NextResponse.redirect(new URL(newPath, `https://app.mediai.tr`));
    }
    
    // Allow /portal/* and /pricing/* on main domain
    // Everything else (including /) goes to landing page (handled by app/page.tsx)
    return null; // Let Clerk handle it
  }

  return null; // Let Clerk handle it
}

// Main middleware function combining Clerk auth and domain routing
export default clerkMiddleware(async (auth, request: NextRequest) => {
  // Handle domain routing first
  const domainResponse = handleDomainRouting(request);
  if (domainResponse) {
    return domainResponse;
  }

  // Protect routes that require authentication
  if (isProtectedRoute(request)) {
    const { userId } = await auth();
    if (!userId) {
      // Redirect to sign-in page
      const signInUrl = new URL("/sign-in", request.url);
      signInUrl.searchParams.set("redirect_url", request.url);
      return NextResponse.redirect(signInUrl);
    }
  }

  // Continue with normal routing
  return NextResponse.next();
});

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
