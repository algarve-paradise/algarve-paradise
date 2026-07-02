import { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import createIntlMiddleware from "next-intl/middleware";
import { routing } from "@/i18n/routing";
import { updateSession } from "@/lib/supabase/middleware";
import { hasPreviewPrefix, previewPrefix, stripPreviewPrefix } from "@/lib/site";

const intlMiddleware = createIntlMiddleware(routing);

const COMING_SOON_PATH = "/em-breve";

function redirectWithPreviewPrefix(response: NextResponse, request: NextRequest) {
  const location = response.headers.get("location");

  if (!location) return response;

  const redirectUrl = new URL(location, request.url);

  if (!hasPreviewPrefix(redirectUrl.pathname)) {
    redirectUrl.pathname = `${previewPrefix}${redirectUrl.pathname === "/" ? "" : redirectUrl.pathname}`;
  }

  return NextResponse.redirect(redirectUrl, response.status);
}

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

    // /visualizar and /visualizar/* -> strip prefix, route through normal app
    if (hasPreviewPrefix(pathname)) {
      const strippedPath = stripPreviewPrefix(pathname);
      const previewUrl = request.nextUrl.clone();
      previewUrl.pathname = strippedPath;

      const previewRequest = new NextRequest(previewUrl.toString(), {
        headers: request.headers,
      });

      const sessionResponse = await updateSession(previewRequest);
      if (sessionResponse.headers.has("location")) {
        return redirectWithPreviewPrefix(sessionResponse, request);
      }

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
