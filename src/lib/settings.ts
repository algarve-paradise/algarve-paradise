/**
 * Runtime settings store.
 *
 * Reads first from the `app_settings` table (admin-managed via the
 * dashboard); falls back to the corresponding environment variable when
 * no override exists. Cached per-request via React's `cache` so a single
 * request that touches the same key multiple times only hits Supabase
 * once.
 */
import { cache } from "react";

import { env } from "@/lib/env";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

export type AiProvider = "anthropic" | "openai" | "gemini";

export const aiProviders = ["anthropic", "openai", "gemini"] as const;

export type AppSettings = {
  aiProvider: AiProvider;
  autoPublishAfterHours: number;
  autoPublishMinConfidence: number;
  aiEnabled: boolean;
};

const SETTING_KEYS = {
  aiProvider: "ai_provider",
  autoPublishAfterHours: "auto_publish_after_hours",
  autoPublishMinConfidence: "auto_publish_min_confidence",
  aiEnabled: "ai_enabled",
} as const;

type SettingKey = (typeof SETTING_KEYS)[keyof typeof SETTING_KEYS];

function isAiProvider(value: unknown): value is AiProvider {
  return value === "anthropic" || value === "openai" || value === "gemini";
}

async function loadSettingsMap(): Promise<Map<string, unknown>> {
  const supabase = createSupabaseAdminClient();
  const { data, error } = await supabase
    .from("app_settings")
    .select("key, value");
  if (error) {
    console.warn("loadSettingsMap failed, falling back to env:", error.message);
    return new Map();
  }
  const map = new Map<string, unknown>();
  for (const row of data ?? []) {
    map.set(row.key as string, row.value);
  }
  return map;
}

export const getAppSettings = cache(async (): Promise<AppSettings> => {
  const overrides = await loadSettingsMap();

  const rawProvider = overrides.get(SETTING_KEYS.aiProvider);
  const aiProvider: AiProvider = isAiProvider(rawProvider) ? rawProvider : env.AI_PROVIDER;

  const rawHours = overrides.get(SETTING_KEYS.autoPublishAfterHours);
  const autoPublishAfterHours =
    typeof rawHours === "number" && Number.isFinite(rawHours)
      ? rawHours
      : env.AUTO_PUBLISH_AFTER_HOURS;

  const rawConfidence = overrides.get(SETTING_KEYS.autoPublishMinConfidence);
  const autoPublishMinConfidence =
    typeof rawConfidence === "number" && Number.isFinite(rawConfidence)
      ? rawConfidence
      : env.AUTO_PUBLISH_MIN_CONFIDENCE;

  const rawAiEnabled = overrides.get(SETTING_KEYS.aiEnabled);
  const aiEnabled: boolean = typeof rawAiEnabled === "boolean" ? rawAiEnabled : true;

  return { aiProvider, autoPublishAfterHours, autoPublishMinConfidence, aiEnabled };
});

export async function getAiProvider(): Promise<AiProvider> {
  const settings = await getAppSettings();
  return settings.aiProvider;
}

export async function setAppSetting(
  key: SettingKey,
  value: unknown,
  updatedBy: string | null
) {
  const supabase = createSupabaseAdminClient();
  const { error } = await supabase
    .from("app_settings")
    .upsert(
      { key, value, updated_by: updatedBy, updated_at: new Date().toISOString() },
      { onConflict: "key" }
    );
  if (error) {
    throw new Error(`setAppSetting(${key}): ${error.message}`);
  }
}

export const SETTINGS_KEYS = SETTING_KEYS;
