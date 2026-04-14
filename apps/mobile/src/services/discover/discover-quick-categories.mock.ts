import { USE_LOCAL_SERVICE_DATA } from "@/services/config/service-data-source";
import { TaxonomyService } from "@/services/taxonomy/taxonomy.service";
import type { TaxonomyTermDto } from "@/services/taxonomy/taxonomy.types";

/**
 * Atalhos na descoberta — com API: termos de taxonomia; offline: lista estática.
 */
export type DiscoverQuickCategory = {
  id: string;
  /** Chave i18n em `discover` quando `label` não vem da API. */
  labelKey: string;
  /** Rótulo da API ou cópia local (tem prioridade sobre `labelKey`). */
  label?: string;
  emoji: string;
  /** Filtro leve no cliente quando não há `taxonomyTermIds`. */
  filterKeyword?: string;
  /** UUIDs para `taxonomyTermIds` na query da listagem. */
  taxonomyTermIds?: string[];
};

export const DISCOVER_QUICK_CATEGORIES_MOCK: DiscoverQuickCategory[] = [
  { id: "bars", labelKey: "quickCat_bars", emoji: "\u{1F37A}", filterKeyword: "bar" },
  { id: "restaurants", labelKey: "quickCat_restaurants", emoji: "\u{1F37D}", filterKeyword: "restaurant" },
  { id: "shows", labelKey: "quickCat_shows", emoji: "\u{1F3AD}", filterKeyword: "show" },
  { id: "clubs", labelKey: "quickCat_clubs", emoji: "\u{1F3A7}", filterKeyword: "club" },
  { id: "theaters", labelKey: "quickCat_theaters", emoji: "\u{1F3AC}", filterKeyword: "teatro" },
  { id: "studios", labelKey: "quickCat_studios", emoji: "\u{1F399}", filterKeyword: "studio" },
  { id: "festivals", labelKey: "quickCat_festivals", emoji: "\u{1F389}", filterKeyword: "festival" },
  { id: "cafes", labelKey: "quickCat_cafes", emoji: "\u{2615}", filterKeyword: "café" },
];

function emojiForTaxonomySlug(slug: string): string {
  const s = slug.toLowerCase();
  if (s.includes("bar") || s.includes("pub")) return "\u{1F37A}";
  if (s.includes("restaurant") || s.includes("food")) return "\u{1F37D}";
  if (s.includes("theater") || s.includes("teatro")) return "\u{1F3AC}";
  if (s.includes("club") || s.includes("night")) return "\u{1F3A7}";
  if (s.includes("studio")) return "\u{1F399}";
  if (s.includes("festival")) return "\u{1F389}";
  if (s.includes("cafe") || s.includes("coffee")) return "\u{2615}";
  if (s.includes("concert") || s.includes("show")) return "\u{1F3AD}";
  return "\u{2728}";
}

function termToCategory(term: TaxonomyTermDto): DiscoverQuickCategory {
  return {
    id: term.id,
    labelKey: `quickCat_taxonomy_${term.slug}`,
    label: term.label,
    emoji: emojiForTaxonomySlug(term.slug),
    taxonomyTermIds: [term.id],
  };
}

export type DiscoverQuickCategoryListKind = "events" | "venues" | "artists";

export async function getDiscoverQuickCategories(
  listKind: DiscoverQuickCategoryListKind,
): Promise<DiscoverQuickCategory[]> {
  if (USE_LOCAL_SERVICE_DATA) {
    return [...DISCOVER_QUICK_CATEGORIES_MOCK];
  }
  try {
    const svc = new TaxonomyService();
    const kind =
      listKind === "venues" ? "VENUE_TYPE" : listKind === "artists" ? "GENRE" : "EVENT_TYPE";
    const terms = await svc.listByKind(kind, false);
    const active = terms
      .filter((t) => t.active)
      .sort((a, b) => a.sortOrder - b.sortOrder || a.label.localeCompare(b.label));
    if (active.length === 0) {
      return [...DISCOVER_QUICK_CATEGORIES_MOCK];
    }
    return active.map(termToCategory);
  } catch {
    return [...DISCOVER_QUICK_CATEGORIES_MOCK];
  }
}
