import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";
import { getAuthSecret } from "@/lib/auth-secret";

/**
 * Edge-safe: no Prisma, no `auth()` import (that bundles PrismaAdapter).
 * Uses JWT only — same secret as NextAuth (`AUTH_SECRET`).
 */
export async function middleware(request: NextRequest) {
  let secret: string;
  try {
    secret = getAuthSecret();
  } catch (e) {
    console.error("[middleware] Auth secret error:", e);
    return NextResponse.redirect(new URL("/login", request.url));
  }

  const token = await getToken({
    req: request,
    secret,
    secureCookie: process.env.NODE_ENV === "production",
  });

  if (!token && request.nextUrl.pathname.startsWith("/dashboard")) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
