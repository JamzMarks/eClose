/**
 * Capacidades de produto (não confundir com rotas Expo).
 * Novas regras = novo literal aqui + verificação com `canAccess` onde fizer sentido.
 */
export const APP_CAPABILITIES = [
  "discover.events",
  "discover.venues",
  "tab.map",
  "create.flow",
  "wishlists",
] as const;

export type AppCapability = (typeof APP_CAPABILITIES)[number];

export const ALL_APP_CAPABILITIES: readonly AppCapability[] = [...APP_CAPABILITIES];
