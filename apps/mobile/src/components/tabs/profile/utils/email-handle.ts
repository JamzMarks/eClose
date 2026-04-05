export function handleFromEmail(email: string | undefined): string {
  if (!email?.trim()) return "utilizador";
  const local = email.split("@")[0] ?? "utilizador";
  return local.replace(/[^a-zA-Z0-9._]/g, "").toLowerCase() || "utilizador";
}

export function displayNameFromEmail(
  email: string | undefined,
  fallback: string,
): string {
  if (!email) return fallback;
  const local = email.split("@")[0] ?? "";
  return local.length > 0 ? local : fallback;
}
