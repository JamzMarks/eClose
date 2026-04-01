import { TaxonomyKind } from "../types/taxonomy-kind.type";

export type TaxonomyTermProps = {
  id: string;
  kind: TaxonomyKind;
  /** único por kind — usado em URLs e filtros */
  slug: string;
  label: string;
  parentId: string | null;
  synonyms: string[];
  /** facetas para ranking, clusters, A/B, integração com modelo de recomendação */
  facetMetadata: Record<string, unknown>;
  active: boolean;
  sortOrder: number;
  createdAt: Date;
};

export class TaxonomyTerm {
  id: string;
  kind: TaxonomyKind;
  slug: string;
  label: string;
  parentId: string | null;
  synonyms: string[];
  facetMetadata: Record<string, unknown>;
  active: boolean;
  sortOrder: number;
  createdAt: Date;

  private constructor(props: TaxonomyTermProps) {
    Object.assign(this, props);
  }

  static hydrate(props: TaxonomyTermProps): TaxonomyTerm {
    return new TaxonomyTerm(props);
  }

  static create(
    props: Omit<TaxonomyTermProps, "createdAt" | "synonyms" | "facetMetadata" | "parentId"> & {
      synonyms?: string[];
      facetMetadata?: Record<string, unknown>;
      parentId?: string | null;
    },
  ): TaxonomyTerm {
    if (!props.slug?.trim()) throw new Error("slug é obrigatório");
    if (!props.label?.trim()) throw new Error("label é obrigatório");
    return new TaxonomyTerm({
      ...props,
      slug: props.slug.trim().toLowerCase(),
      label: props.label.trim(),
      parentId: props.parentId ?? null,
      synonyms: props.synonyms ?? [],
      facetMetadata: props.facetMetadata ?? {},
      createdAt: new Date(),
    });
  }
}
