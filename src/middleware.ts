import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

// Define protected routes and their required roles
const protectedRoutes = [
  {
    path: "/admin",
    roles: ["ADMIN"],
  },
  {
    path: "/business",
    roles: ["ADMIN", "BUSINESS_OWNER"],
  },
  {
    path: "/worker",
    roles: ["ADMIN", "BUSINESS_OWNER", "WORKER"],
  },
];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  console.log(`Middleware processing request for path: ${pathname}`);
  
  // Create a response object to modify headers
  let response = NextResponse.next();

  // In development mode, we'll disable CSP to allow Stripe.js to load properly
  // For production, you should re-enable CSP with proper Stripe domains
  if (process.env.NODE_ENV !== 'development') {
    // Set Content-Security-Policy headers with appropriate settings for production
    response.headers.set(
      "Content-Security-Policy",
      "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline' https://*.stripe.com https://js.stripe.com; style-src 'self' 'unsafe-inline' https://*.stripe.com; img-src 'self' data: blob: https://*.stripe.com; font-src 'self' data:; connect-src 'self' https://*.stripe.com https://*;"
    );
    
    console.log(`Setting CSP for production environment`);
  } else {
    console.log(`Development mode - disabling CSP for Stripe testing`);
  }
  
  // Add X-Content-Type-Options header to prevent MIME type sniffing
  response.headers.set("X-Content-Type-Options", "nosniff");
  
  // Add X-Frame-Options header to prevent clickjacking
  response.headers.set("X-Frame-Options", "DENY");
  
  // Add Referrer-Policy header
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");

  // Check if the path is protected
  const isProtectedRoute = protectedRoutes.some((route) => 
    pathname.startsWith(route.path)
  );
  
  if (isProtectedRoute) {
    console.log(`Processing protected route: ${pathname}`);
    const token = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET,
    });

    // If no token, redirect to login
    if (!token) {
      console.log(`No token found, redirecting to login`);
      const url = new URL("/auth/signin", request.url);
      url.searchParams.set("callbackUrl", encodeURI(request.url));
      return NextResponse.redirect(url);
    }
    
    // Log token information for debugging
    console.log("Token in middleware:", JSON.stringify(token, null, 2));
    console.log(`User role: ${token.role}`);
    console.log(`Access granted for path '${pathname}'`);
  }

  return response;
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/business/:path*",
    "/worker/:path*",
  ],
};
