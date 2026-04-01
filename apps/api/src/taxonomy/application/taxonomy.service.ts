import { BadRequestException, Inject, Injectable } from "@nestjs/common";
import { ITaxonomyService } from "@/taxonomy/interfaces/taxonomy.service.interface";
import { ITaxonomyRepository } from "@/taxonomy/interfaces/taxonomy.repository.interface";
import { TAXONOMY_REPOSITORY } from "@/taxonomy/tokens/taxonomy.tokens";
import { TaxonomyKind } from "@/taxonomy/types/taxonomy-kind.type";
import { TaxonomyTerm } from "@/taxonomy/entity/taxonomy-term.entity";

@Injectable()
export class TaxonomyService implements ITaxonomyService {
  constructor(
    @Inject(TAXONOMY_REPOSITORY)
    private readonly repo: ITaxonomyRepository,
  ) {}

  async listByKind(kind: TaxonomyKind, activeOnly = true): Promise<TaxonomyTerm[]> {
    return this.repo.findByKind(kind, activeOnly);
  }

  async assertTermsValid(termIds: string[], allowedKinds: TaxonomyKind[]): Promise<void> {
    if (!termIds.length) return;
    const terms = await this.repo.listByIds(termIds);
    if (terms.length !== termIds.length) {
      throw new BadRequestException("Um ou mais termos de taxonomia são inválidos");
    }
    const allowed = new Set(allowedKinds);
    for (const t of terms) {
      if (!t.active) {
        throw new BadRequestException(`Termo inativo: ${t.slug}`);
      }
      if (!allowed.has(t.kind)) {
        throw new BadRequestException(
          `Termo "${t.label}" não é permitido neste contexto (kind=${t.kind})`,
        );
      }
    }
  }

  async getTermsForIndexing(termIds: string[]): Promise<TaxonomyTerm[]> {
    return this.repo.listByIds(termIds);
  }
}
