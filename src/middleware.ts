// src/middleware.ts
import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });

  const {
    data: { session },
  } = await supabase.auth.getSession();

  // Allow callback route to process
  if (req.nextUrl.pathname.startsWith("/callback")) {
    return res;
  }

  // If no session and trying to access protected routes
  if (
    !session &&
    (req.nextUrl.pathname.startsWith("/admin") ||
      req.nextUrl.pathname.startsWith("/judge"))
  ) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // If user is trying to access an admin page, check if they're an admin
  if (session && req.nextUrl.pathname.startsWith("/admin")) {
    // Check user_metadata for role instead of app_metadata
    const isAdmin = session.user.user_metadata?.role === "admin";

    if (!isAdmin) {
      // If they're a judge, redirect to judge dashboard
      try {
        const { data: judgeData, error } = await supabase
          .from("judges")
          .select("id")
          .eq("id", session.user.id)
          .single();

        if (judgeData) {
          return NextResponse.redirect(new URL("/judge/dashboard", req.url));
        }
      } catch (error) {
        console.error("Error checking judge status:", error);
      }

      // Not an admin or judge
      return NextResponse.redirect(new URL("/unauthorized", req.url));
    }
  }

  return res;
}

export const config = {
  matcher: ["/admin/:path*", "/judge/:path*", "/callback"],
};
