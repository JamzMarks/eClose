/**
 * Locais comuns para atalhos na descoberta — hoje mock; futuro: GET /discovery/quick-categories.
 */
export type DiscoverQuickCategory = {
  id: string;
  /** Chave i18n em `discover` (ex.: quickCat_bars). */
  labelKey: string;
  emoji: string;
  /** Filtro leve no cliente (nome/título) até haver taxonomia na API. */
  filterKeyword?: string;
  /** Filtro opcional por termos de taxonomia (UUIDs) quando a API suportar. */
  taxonomyTermIds?: string[];
};

export const DISCOVER_QUICK_CATEGORIES_MOCK: DiscoverQuickCategory[] = [
  { id: "bars", labelKey: "quickCat_bars", emoji: "🍺", filterKeyword: "bar" },
  { id: "restaurants", labelKey: "quickCat_restaurants", emoji: "🍽️", filterKeyword: "restaurant" },
  { id: "shows", labelKey: "quickCat_shows", emoji: "🎤", filterKeyword: "show" },
  { id: "clubs", labelKey: "quickCat_clubs", emoji: "🪩", filterKeyword: "club" },
  { id: "theaters", labelKey: "quickCat_theaters", emoji: "🎭", filterKeyword: "teatro" },
  { id: "studios", labelKey: "quickCat_studios", emoji: "🎧", filterKeyword: "studio" },
  { id: "festivals", labelKey: "quickCat_festivals", emoji: "🎪", filterKeyword: "festival" },
  { id: "cafes", labelKey: "quickCat_cafes", emoji: "☕", filterKeyword: "café" },
];

export function getDiscoverQuickCategories(): Promise<DiscoverQuickCategory[]> {
  return Promise.resolve([...DISCOVER_QUICK_CATEGORIES_MOCK]);
}
