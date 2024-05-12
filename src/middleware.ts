import { NextResponse, type NextRequest } from "next/server";

import { createClient } from "@/lib/supabase/server";
let m = 1;
export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = createClient();

  const { data, error } = await supabase.auth.getUser();
  const { pathname } = req.nextUrl;

  // Unprotected routes
  const unprotectedRoutes = ["/login", "/signup"];

  // Check if the user is logged in
  const isLoggedIn = data?.user;
  console.log("dataa ", pathname);
  if (!isLoggedIn && !unprotectedRoutes.includes(pathname)) {
    const loginUrl = `${req.nextUrl.origin}/login`;
    return NextResponse.redirect(loginUrl);
  }

  // Redirect to / if the user is logged in and trying to access /login or /signup
  if (isLoggedIn && (pathname === "/login" || pathname === "/signup")) {
    console.log("unnn");
    return NextResponse.redirect(`${req.nextUrl.origin}/dashboard`);
  }

  // Continue to the next middleware or route handler
  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/login", "/signup", "/dashboard"],
};
