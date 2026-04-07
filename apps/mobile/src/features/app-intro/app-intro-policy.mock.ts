import type { AppCapability } from "./app-capability";
import { ALL_APP_CAPABILITIES } from "./app-capability";

export type AppIntroFinishMode = "completed" | "skipped";

/**
 * Hoje mock local; amanhã pode vir de `GET /me/entitlements` ou remote config.
 */
export function getCapabilitiesForAppIntroOutcome(mode: AppIntroFinishMode): ReadonlySet<AppCapability> {
  if (mode === "skipped") {
    return new Set<AppCapability>(["discover.events", "discover.venues"]);
  }
  return new Set(ALL_APP_CAPABILITIES);
}
