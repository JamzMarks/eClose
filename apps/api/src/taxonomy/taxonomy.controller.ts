import { Controller, Get, Inject, ParseEnumPipe, Query } from "@nestjs/common";
import { ITaxonomyService } from "./interfaces/taxonomy.service.interface";
import { TAXONOMY_SERVICE } from "./tokens/taxonomy.tokens";
import { TaxonomyKind } from "./types/taxonomy-kind.type";

@Controller("taxonomy")
export class TaxonomyController {
  constructor(
    @Inject(TAXONOMY_SERVICE)
    private readonly taxonomy: ITaxonomyService,
  ) {}

  @Get()
  list(
    @Query("kind", new ParseEnumPipe(TaxonomyKind)) kind: TaxonomyKind,
    @Query("includeInactive") includeInactiveRaw?: string,
  ) {
    const includeInactive = includeInactiveRaw === "true";
    return this.taxonomy.listByKind(kind, !includeInactive);
  }
}
