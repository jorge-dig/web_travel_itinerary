import NextAuth from "next-auth";
import { authConfig } from "@/auth.config";
import { NextResponse } from "next/server";
import type { NextAuthRequest } from "next-auth";

const protectedPaths = ["/dashboard", "/viewer", "/consulting/"];
const adminPaths = ["/admin"];

export default NextAuth(authConfig).auth(function middleware(req: NextAuthRequest) {
  const { pathname } = req.nextUrl;
  const session = req.auth;

  const isProtected = protectedPaths.some((p) => pathname.startsWith(p));
  const isAdmin = adminPaths.some((p) => pathname.startsWith(p));

  if ((isProtected || isAdmin) && !session) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  if (isAdmin && (session?.user as { role?: string } | undefined)?.role !== "ADMIN") {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/viewer/:path*",
    "/admin/:path*",
    "/consulting/:path*",
  ],
};
