import { NextResponse } from "next/server";

import { isAuthorizedCron } from "@/lib/cron-auth";
import { runAutoPublish } from "@/lib/ingest/auto-publish";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

async function handle(request: Request) {
  if (!isAuthorizedCron(request)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const report = await runAutoPublish();
    return NextResponse.json(report);
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 }
    );
  }
}

export const POST = handle;
export const GET = handle;
