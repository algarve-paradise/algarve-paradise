import { NextResponse } from "next/server";

import { isAuthorizedCron } from "@/lib/cron-auth";
import { runIngestionPipeline } from "@/lib/ingest/pipeline";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * /api/cron/ingest
 *
 * Triggered by Vercel Cron (Authorization: Bearer CRON_SECRET) or any
 * caller with the X-Cron-Secret header. One run = fetch enabled sources,
 * deduplicate, rewrite via AI, insert drafts. Auto-publication is handled
 * by /api/cron/auto-publish.
 *
 * Query params:
 *   ?region=algarve   limit to a region (default: all)
 *   ?dry=1            skip the AI step (smoke test)
 */
async function handle(request: Request) {
  if (!isAuthorizedCron(request)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const url = new URL(request.url);
  const region = url.searchParams.get("region") ?? "all";
  const dryRun = url.searchParams.get("dry") === "1";

  try {
    const report = await runIngestionPipeline({ region, dryRun });
    return NextResponse.json(report);
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 }
    );
  }
}

export const POST = handle;
// Vercel Cron sends GET by default — accept both.
export const GET = handle;
