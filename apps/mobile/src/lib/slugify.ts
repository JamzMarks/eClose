/** Gera slug URL-seguro a partir de um título ou nome (MVP). */
export function slugifyLabel(input: string, maxLength = 80): string {
  const s = input
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  if (!s) return "item";
  return s.slice(0, maxLength).replace(/-+$/g, "") || "item";
}
