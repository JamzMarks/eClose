import { TaxonomyTerm } from "../entity/taxonomy-term.entity";
import { TaxonomyKind } from "../types/taxonomy-kind.type";

export interface ITaxonomyService {
  listByKind(kind: TaxonomyKind, activeOnly?: boolean): Promise<TaxonomyTerm[]>;
  /** Garante que todos os ids existem, estão ativos e pertencem a um dos kinds permitidos */
  assertTermsValid(termIds: string[], allowedKinds: TaxonomyKind[]): Promise<void>;
  getTermsForIndexing(termIds: string[]): Promise<TaxonomyTerm[]>;
}
