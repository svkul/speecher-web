import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isPublicRoute = createRouteMatcher([
  "/",
  "/terms",
  "/privacy",
  "/pricing",
  "/blog(.*)",
  "/sign-in(.*)",
  "/sign-up(.*)",
  "/sso-callback(.*)",
]);

const isAuthEntryRoute = createRouteMatcher(["/sign-in", "/sign-up"]);

export default clerkMiddleware(async (auth, req) => {
  if (isAuthEntryRoute(req)) {
    const { isAuthenticated } = await auth();

    if (isAuthenticated) {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }
  }

  if (!isPublicRoute(req)) {
    await auth.protect();
  }
});

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
