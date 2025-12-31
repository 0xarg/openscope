import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";
export { default } from "next-auth/middleware";

export async function proxy(req: NextRequest) {
  const path = req.nextUrl.pathname;
  const isPublicPath = path === "/auth" || path === "/";

  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
  });
  if (isPublicPath && token) {
    return NextResponse.redirect(new URL("/dashboard", req.nextUrl));
  }

  if (!isPublicPath && !token) {
    return NextResponse.redirect(new URL("/", req.nextUrl));
  }
}

export const config = {
  matcher: [
    "/auth",
    "/dashboard",
    "/",
    "/issues/:path*",
    "/issue/:path*",
    "/profile/:path*",
    "/repositories/:path*",
    "/repository/:path*",
    "/settings/:path*",
    "/tracked/:path*",
  ],
};
