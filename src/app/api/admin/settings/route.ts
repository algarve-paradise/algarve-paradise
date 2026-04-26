import { NextResponse } from "next/server";
import { z } from "zod";

import { getCurrentUser } from "@/lib/auth";
import { aiProviders, setAppSetting, SETTINGS_KEYS } from "@/lib/settings";

const patchSchema = z.object({
  aiProvider: z.enum(aiProviders).optional(),
  autoPublishAfterHours: z.number().min(0).max(168).optional(),
  autoPublishMinConfidence: z.number().min(0).max(1).optional(),
  aiEnabled: z.boolean().optional(),
});

export async function PATCH(request: Request) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Nao autenticado." }, { status: 401 });
  }

  const payload = await request.json().catch(() => null);
  const parsed = patchSchema.safeParse(payload);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Dados invalidos." },
      { status: 400 }
    );
  }

  const ops: Promise<void>[] = [];
  if (parsed.data.aiProvider !== undefined) {
    ops.push(setAppSetting(SETTINGS_KEYS.aiProvider, parsed.data.aiProvider, user.id));
  }
  if (parsed.data.autoPublishAfterHours !== undefined) {
    ops.push(
      setAppSetting(SETTINGS_KEYS.autoPublishAfterHours, parsed.data.autoPublishAfterHours, user.id)
    );
  }
  if (parsed.data.autoPublishMinConfidence !== undefined) {
    ops.push(
      setAppSetting(
        SETTINGS_KEYS.autoPublishMinConfidence,
        parsed.data.autoPublishMinConfidence,
        user.id
      )
    );
  }
  if (parsed.data.aiEnabled !== undefined) {
    ops.push(setAppSetting(SETTINGS_KEYS.aiEnabled, parsed.data.aiEnabled, user.id));
  }

  try {
    await Promise.all(ops);
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
