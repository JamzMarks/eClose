import type { OAuthExternalIdentity } from "@/auth/application/ports/oauth-provider-gateway.interface";

/**
 * Deriva first/last a partir de claims OAuth (given/family preferível; senão divide `name`).
 * Um único token em `name` só preenche o primeiro nome — o utilizador completa o apelido no app.
 */
export function namesFromOAuthIdentity(
  identity: OAuthExternalIdentity,
): { firstName: string | null; lastName: string | null } {
  const given = identity.givenName?.trim();
  const family = identity.familyName?.trim();
  if (given || family) {
    return {
      firstName: given || null,
      lastName: family || null,
    };
  }
  const full = identity.name?.trim();
  if (!full) return { firstName: null, lastName: null };
  const parts = full.split(/\s+/).filter(Boolean);
  if (parts.length === 0) return { firstName: null, lastName: null };
  if (parts.length === 1) return { firstName: parts[0], lastName: null };
  return {
    firstName: parts[0],
    lastName: parts.slice(1).join(" "),
  };
}
