import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const session = await auth();

  if (!session && (pathname.startsWith("/admin") || pathname.startsWith("/panel"))) {
    return NextResponse.redirect(new URL("/giris", req.url));
  }

  if (session?.user?.role !== "admin" && pathname.startsWith("/admin")) {
    return NextResponse.redirect(new URL("/panel", req.url));
  }

  if (session?.user?.role === "admin" && pathname.startsWith("/panel")) {
    return NextResponse.redirect(new URL("/admin", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/panel/:path*", "/giris"],
};
