import { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import createIntlMiddleware from "next-intl/middleware";
import { routing } from "@/i18n/routing";
import { updateSession } from "@/lib/supabase/middleware";

const intlMiddleware = createIntlMiddleware(routing);

const PREVIEW_PREFIX = "/visualizar";
const COMING_SOON_PATH = "/em-breve";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // API routes are never intercepted
  if (pathname.startsWith("/api/")) {
    return updateSession(request);
  }

  if (process.env.PRELAUNCH_MODE === "true") {
    // Allow the coming soon page itself through to avoid an infinite rewrite loop
    if (pathname === COMING_SOON_PATH) {
      return NextResponse.next();
    }

    // /visualizar and /visualizar/* → strip prefix, route through normal app
    if (pathname === PREVIEW_PREFIX || pathname.startsWith(PREVIEW_PREFIX + "/")) {
      const strippedPath = pathname.slice(PREVIEW_PREFIX.length) || "/";
      const previewUrl = request.nextUrl.clone();
      previewUrl.pathname = strippedPath;

      const previewRequest = new NextRequest(previewUrl.toString(), {
        headers: request.headers,
      });

      await updateSession(request);
      return intlMiddleware(previewRequest);
    }

    // Everything else: silently rewrite to the coming soon page
    const url = request.nextUrl.clone();
    url.pathname = COMING_SOON_PATH;
    return NextResponse.rewrite(url);
  }

  // Normal mode — unchanged behaviour
  await updateSession(request);
  return intlMiddleware(request);
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
