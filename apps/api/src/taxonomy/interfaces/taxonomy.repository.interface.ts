import { TaxonomyTerm } from "../entity/taxonomy-term.entity";
import { TaxonomyKind } from "../types/taxonomy-kind.type";

export interface ITaxonomyRepository {
  save(term: TaxonomyTerm): Promise<void>;
  findById(id: string): Promise<TaxonomyTerm | null>;
  findByKind(kind: TaxonomyKind, activeOnly?: boolean): Promise<TaxonomyTerm[]>;
  findByKindAndSlug(kind: TaxonomyKind, slug: string): Promise<TaxonomyTerm | null>;
  listByIds(ids: string[]): Promise<TaxonomyTerm[]>;
}
