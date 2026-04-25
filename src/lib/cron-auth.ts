import { env } from "@/lib/env";

/**
 * Validate cron requests. Accepts either:
 *   - Authorization: Bearer <CRON_SECRET>   (Vercel Cron default)
 *   - x-cron-secret: <CRON_SECRET>          (manual / curl friendly)
 */
export function isAuthorizedCron(request: Request): boolean {
  if (!env.CRON_SECRET) {
    // Fail closed if the env var is not configured.
    return false;
  }

  const auth = request.headers.get("authorization") ?? "";
  const bearerMatch = auth.match(/^Bearer\s+(.+)$/i);
  if (bearerMatch && bearerMatch[1] === env.CRON_SECRET) {
    return true;
  }

  const direct = request.headers.get("x-cron-secret");
  if (direct && direct === env.CRON_SECRET) {
    return true;
  }

  return false;
}
