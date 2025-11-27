import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { env } from "@/env.mjs";

const protectedRoutes = ["/shop"]; // Add more protected routes as needed, e.g., ["/shop", "/account"]

export async function proxy(request: NextRequest) {
  const token = request.cookies.get("token")?.value;
  const isProtected = protectedRoutes.some((route) =>
    request.nextUrl.pathname.startsWith(route)
  );

  if (isProtected) {
    if (!token) {
      return NextResponse.redirect(new URL("/signin", request.url));
    }

    try {
      const validateResponse = await fetch(
        `${request.nextUrl.origin}/api/auth/signin`,
        {
          method: "GET",
          headers: {
            cookie: request.headers.get("cookie") || "",
          },
        }
      );

      if (!validateResponse.ok) {
        const data = await validateResponse
          .json()
          .catch(() => ({ valid: false }));
        if (!data.valid) {
          return NextResponse.redirect(new URL("/signin", request.url));
        }
      }
    } catch (error) {
      return NextResponse.redirect(new URL("/signin", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
