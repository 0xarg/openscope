import { NextRequest, NextResponse } from "next/server";
export { default } from "next-auth/middleware";

export function proxy(req: NextRequest) {
  const path = req.nextUrl.pathname;
  const isPublicPath = path === "/login" || path === "/";

  const token = req.cookies.get("next-auth.session-token")?.value || "";
  if (isPublicPath && token) {
    return NextResponse.redirect(new URL("/dashboard", req.nextUrl));
  }

  if (!isPublicPath && !token) {
    return NextResponse.redirect(new URL("/", req.nextUrl));
  }
}

export const config = {
  matcher: ["/login", "/dashboard", "/", "/issues"],
};
