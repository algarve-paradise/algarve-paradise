import { NextResponse } from "next/server";

import { isAuthorizedCron } from "@/lib/cron-auth";
import { runEventsPipeline } from "@/lib/ingest/events-pipeline";
import { getAppSettings } from "@/lib/settings";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * /api/cron/events
 *
 * Same auth + query params as /api/cron/ingest, but pulls iCal sources
 * (content_kind = 'events') and writes to the `events` table.
 */
async function handle(request: Request) {
  if (!isAuthorizedCron(request)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const settings = await getAppSettings();
  if (!settings.aiEnabled) {
    return NextResponse.json({ skipped: true, reason: "AI automation is disabled" });
  }

  const url = new URL(request.url);
  const region = url.searchParams.get("region") ?? "all";
  const dryRun = url.searchParams.get("dry") === "1";

  try {
    const report = await runEventsPipeline({ region, dryRun });
    return NextResponse.json(report);
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}

export const POST = handle;
export const GET = handle;
