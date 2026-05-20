import type { NextRequest } from "next/server";
import createIntlMiddleware from "next-intl/middleware";
import { routing } from "@/i18n/routing";
import { updateSession } from "@/lib/supabase/middleware";

const intlMiddleware = createIntlMiddleware(routing);

export async function middleware(request: NextRequest) {
  // Handle Supabase auth session first
  const supabaseResponse = await updateSession(request);

  // Then handle i18n routing
  const intlResponse = intlMiddleware(request);

  // If intl redirects (locale negotiation), use that; otherwise use supabase response
  if (intlResponse.status !== 200) {
    return intlResponse;
  }

  return supabaseResponse;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|api|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
};
