import type { ProfileUiDraft } from "@/types/profile-ui-draft.types";

const WEIGHT = 25;

/** Quatro marcos × 25%: cidade, bio, interesses (≥1 tag), avatar personalizado. */
export function profileCompletenessPercent(d: ProfileUiDraft): number {
  let score = 0;
  if (d.city.trim().length > 0) score += WEIGHT;
  if (d.bio.trim().length > 0) score += WEIGHT;
  const tags = d.interestsCsv
    .split(/[,;]/)
    .map((s) => s.trim())
    .filter(Boolean);
  if (tags.length > 0) score += WEIGHT;
  if (d.useCustomAvatar && (d.customAvatarUri?.trim().length ?? 0) > 0) score += WEIGHT;
  return Math.min(100, score);
}
