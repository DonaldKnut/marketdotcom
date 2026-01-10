import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"

export default withAuth(
  function middleware(req) {
    const { pathname } = req.nextUrl
    const token = req.nextauth.token

    // Protect dashboard routes
    if (pathname.startsWith("/dashboard") && !token) {
      return NextResponse.redirect(new URL("/auth/login", req.url))
    }

    // Admin routes are no longer used - all admin features are in /dashboard

    // Redirect authenticated users away from auth pages
    if (pathname.startsWith("/auth") && token) {
      return NextResponse.redirect(new URL("/dashboard", req.url))
    }

    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const { pathname } = req.nextUrl

        // Allow access to public routes
        if (
          pathname.startsWith("/api/auth") ||
          pathname === "/" ||
          pathname.startsWith("/marketplace") ||
          pathname.startsWith("/auth") ||
          pathname.startsWith("/terms") ||
          pathname.startsWith("/privacy") ||
          pathname.startsWith("/help")
        ) {
          return true
        }

        // Require authentication for protected routes
        return !!token
      },
    },
  }
)

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/auth/:path*",
    "/api/:path*",
  ],
}
