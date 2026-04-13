import { NextResponse } from "next/server";

export async function middleware(req) {
  // Allow homepage and public routes without authentication
  const publicPaths = ['/login', '/signup', '/', '/products', '/fruits', '/vegetables'];

  if (publicPaths.some(path => req.nextUrl.pathname.startsWith(path))) {
    return NextResponse.next();
  }

  // For protected routes like dashboard, check authentication
  if (req.nextUrl.pathname.startsWith('/dashboard')) {
    const token = req.cookies.get("token")?.value;

    if (!token) {
      return NextResponse.redirect(new URL("/", req.url));
    }
  }

  return NextResponse.next();
}