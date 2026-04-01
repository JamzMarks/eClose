import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { TaxonomyTermOrmEntity } from "@/taxonomy/infrastructure/persistence/taxonomy-term.orm-entity";
import { TaxonomyController } from "./taxonomy.controller";
import { TaxonomyService } from "./taxonomy.service";
import { TypeormTaxonomyRepository } from "./infrastructure/typeorm-taxonomy.repository";
import { TAXONOMY_REPOSITORY, TAXONOMY_SERVICE } from "./tokens/taxonomy.tokens";

@Module({
  imports: [TypeOrmModule.forFeature([TaxonomyTermOrmEntity])],
  controllers: [TaxonomyController],
  providers: [
    { provide: TAXONOMY_REPOSITORY, useClass: TypeormTaxonomyRepository },
    { provide: TAXONOMY_SERVICE, useClass: TaxonomyService },
  ],
  exports: [TAXONOMY_SERVICE, TAXONOMY_REPOSITORY],
})
export class TaxonomyModule {}
