export const DISCOVER_PAGE_SIZE = 15;

/**
 * Quando `true`, `EventService` e `MarketplaceService` devolvem dados locais (sem HTTP).
 * Definir `EXPO_PUBLIC_USE_MOCK_DISCOVER=true` só para demos offline; por defeito usa a API.
 */
export const USE_MOCK_DISCOVER =
  process.env.EXPO_PUBLIC_USE_MOCK_DISCOVER === "true";
