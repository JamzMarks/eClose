import type { AppCapability } from "@/onboarding/app-capability";
import { ALL_APP_CAPABILITIES } from "@/onboarding/app-capability";

export type OnboardingFinishMode = "completed" | "skipped";

/**
 * Hoje mock local; amanhã pode vir de `GET /me/entitlements` ou remote config.
 * Evita dezenas de flags booleanas: um conjunto de capability ids escala melhor.
 */
export function getCapabilitiesForOnboardingOutcome(mode: OnboardingFinishMode): ReadonlySet<AppCapability> {
  if (mode === "skipped") {
    return new Set<AppCapability>(["discover.events", "discover.venues"]);
  }
  return new Set(ALL_APP_CAPABILITIES);
}
