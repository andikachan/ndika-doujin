import { NextResponse } from "next/server";

const PROTECTED_PATHS = ["/profile"];

export function middleware(request) {
  const { pathname } = request.nextUrl;
  const isProtected = PROTECTED_PATHS.some((path) => pathname.startsWith(path));

  if (!isProtected) return NextResponse.next();

  const isAuthed = request.cookies.get("ndichan_auth")?.value === "1";

  if (!isAuthed) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/profile/:path*"],
};
