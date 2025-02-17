import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { CustomToken } from "./types/interface";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (
    pathname.startsWith("/api/auth") ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/register") ||
    pathname.startsWith("/login") ||
    pathname.includes("/_next/image")
  ) {
    return NextResponse.next();
  }

  const token = (await getToken({
    req,
    secret: process.env.JWT_SECRET,
  })) as unknown as CustomToken;

  if (!token) {
    return NextResponse.redirect(new URL("/login", req.url));
  }
  const username = token?.user?.name || "Guest";
  console.log(`User: ${username}, Path: ${pathname}`);
  return NextResponse.next();
}
