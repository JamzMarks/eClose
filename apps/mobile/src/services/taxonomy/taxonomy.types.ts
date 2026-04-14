/** Alinhado com `TaxonomyKind` na API (`apps/api`). */
export type TaxonomyKindDto =
  | "EVENT_TYPE"
  | "INTEREST"
  | "VENUE_TYPE"
  | "VENUE_AMENITY"
  | "GENRE";

export type TaxonomyTermDto = {
  id: string;
  kind: TaxonomyKindDto;
  slug: string;
  label: string;
  parentId: string | null;
  synonyms: string[];
  facetMetadata: Record<string, unknown>;
  active: boolean;
  sortOrder: number;
  createdAt: string;
};
