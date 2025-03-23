import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";
import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export default async function middleware(req: NextRequest) {
  const intlMiddleware = createMiddleware(routing);
  const protectedPaths = ["/dashboard"];
  const { pathname } = req.nextUrl;
  if (protectedPaths.some((path) => pathname.includes(path))) {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    if (!token) {
      return NextResponse.redirect(new URL("/", req.url));
    }
    if (token.role !== "ADMIN") {
      return NextResponse.redirect(new URL("/", req.url));
    }
  }
  return intlMiddleware(req) || NextResponse.next();
}

export const config = {
  matcher: ["/", "/(am|en)/:path*", "/dashboard/:path*"],
};
