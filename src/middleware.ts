import { auth } from "@/core/auth/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth;
  const isAuthRoute = nextUrl.pathname.startsWith("/login");
  const isApiAuthRoute = nextUrl.pathname.startsWith("/api/auth");
  const isPrivilegedRoute =
    nextUrl.pathname.startsWith("/editor") ||
    nextUrl.pathname.startsWith("/admin");

  if (isApiAuthRoute) {
    return NextResponse.next();
  }

  if (isAuthRoute) {
    if (isLoggedIn) {
      return NextResponse.redirect(new URL("/feed", nextUrl));
    }
    return NextResponse.next();
  }

  if (!isLoggedIn) {
    // If accessing root or protected, send to login
    return NextResponse.redirect(new URL("/login", nextUrl));
  }

  // Privileged Route Defense: Readers cannot access /editor
  const userRole = req.auth?.user?.role;
  if (isPrivilegedRoute && userRole !== "EDITOR") {
    return NextResponse.redirect(new URL("/feed", nextUrl));
  }

  if (nextUrl.pathname === "/") {
    return NextResponse.redirect(new URL("/feed", nextUrl));
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    "/((?!api/auth|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
