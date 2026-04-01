/** MIME permitidos para imagens em produção (extensível por env) */
export const DEFAULT_ALLOWED_IMAGE_MIMES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
]);

export const MEDIA_PROCESSING_PENDING = "PENDING";
export const MEDIA_PROCESSING_READY = "READY";

export function getAllowedImageMimes(): Set<string> {
  const raw = process.env.MEDIA_ALLOWED_IMAGE_MIMES;
  if (!raw?.trim()) return DEFAULT_ALLOWED_IMAGE_MIMES;
  return new Set(
    raw
      .split(",")
      .map((s) => s.trim().toLowerCase())
      .filter(Boolean),
  );
}
