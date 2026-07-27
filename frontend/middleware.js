import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

const isAdminLoginPath = (pathname) => pathname === "/admin/login" || pathname.startsWith("/admin/login/");

export default withAuth(
  function middleware(request) {
    const { pathname } = request.nextUrl;
    const token = request.nextauth.token;

    if (isAdminLoginPath(pathname)) {
      if (token?.role === "admin") {
        return NextResponse.redirect(new URL("/admin", request.url));
      }
      return NextResponse.next();
    }

    if (pathname.startsWith("/admin")) {
      if (!token) {
        const url = new URL("/admin/login", request.url);
        url.searchParams.set("callbackUrl", pathname);
        return NextResponse.redirect(url);
      }
      if (token.role !== "admin") {
        return NextResponse.redirect(new URL("/", request.url));
      }
    }
  },
  {
    pages: {
      signIn: "/login",
    },
    callbacks: {
      authorized: ({ token, req }) => {
        const pathname = req.nextUrl.pathname;
        if (isAdminLoginPath(pathname)) {
          return true;
        }
        if (pathname.startsWith("/admin")) {
          return true;
        }
        return !!token;
      },
    },
  }
);

export const config = {
  matcher: [
    "/admin/:path*",
    "/games/:path*",
    "/deposit/:path*",
    "/profile/:path*",
    "/balance-fluctuations/:path*",
    "/deposit-history/:path*",
    "/withdraw-history/:path*",
    "/participation-history/:path*",
    "/change-password/:path*",
    "/list-bank/:path*",
    "/notifications/:path*",
    "/contact/:path*",
    "/sign-out",
  ],
};
