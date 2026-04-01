import { Inject, Injectable, OnModuleInit } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { TaxonomyTermOrmEntity } from "@/taxonomy/infrastructure/persistence/taxonomy-term.orm-entity";
import { ID_GENERATOR, IdGenerator } from "@/shared/contracts/id-generator";
import { TaxonomyTerm } from "../entity/taxonomy-term.entity";
import { ITaxonomyRepository } from "../interfaces/taxonomy.repository.interface";
import { TaxonomyKind } from "../types/taxonomy-kind.type";
import { seedTaxonomyTerms } from "./seed-taxonomy";

@Injectable()
export class TypeormTaxonomyRepository implements ITaxonomyRepository, OnModuleInit {
  constructor(
    @InjectRepository(TaxonomyTermOrmEntity)
    private readonly repo: Repository<TaxonomyTermOrmEntity>,
    @Inject(ID_GENERATOR) private readonly ids: IdGenerator,
  ) {}

  async onModuleInit(): Promise<void> {
    const count = await this.repo.count();
    if (count > 0) return;
    for (const term of seedTaxonomyTerms(this.ids)) {
      await this.save(term);
    }
  }

  async save(term: TaxonomyTerm): Promise<void> {
    await this.repo.save(this.toRow(term));
  }

  async findById(id: string): Promise<TaxonomyTerm | null> {
    const row = await this.repo.findOne({ where: { id } });
    return row ? this.toDomain(row) : null;
  }

  async findByKind(kind: TaxonomyKind, activeOnly = true): Promise<TaxonomyTerm[]> {
    const qb = this.repo.createQueryBuilder("t").where("t.kind = :kind", { kind });
    if (activeOnly) qb.andWhere("t.active = true");
    qb.orderBy("t.sortOrder", "ASC").addOrderBy("t.label", "ASC");
    const rows = await qb.getMany();
    return rows.map((r) => this.toDomain(r));
  }

  async findByKindAndSlug(kind: TaxonomyKind, slug: string): Promise<TaxonomyTerm | null> {
    const s = slug.trim().toLowerCase();
    const row = await this.repo.findOne({ where: { kind, slug: s } });
    return row ? this.toDomain(row) : null;
  }

  async listByIds(ids: string[]): Promise<TaxonomyTerm[]> {
    if (ids.length === 0) return [];
    const rows = await this.repo
      .createQueryBuilder("t")
      .where("t.id IN (:...ids)", { ids })
      .getMany();
    const map = new Map(rows.map((r) => [r.id, this.toDomain(r)]));
    return ids.map((id) => map.get(id)).filter((t): t is TaxonomyTerm => t != null);
  }

  private toRow(t: TaxonomyTerm): TaxonomyTermOrmEntity {
    const row = new TaxonomyTermOrmEntity();
    row.id = t.id;
    row.kind = t.kind;
    row.slug = t.slug;
    row.label = t.label;
    row.parentId = t.parentId;
    row.synonyms = [...t.synonyms];
    row.facetMetadata = { ...t.facetMetadata };
    row.active = t.active;
    row.sortOrder = t.sortOrder;
    row.createdAt = t.createdAt;
    return row;
  }

  private toDomain(row: TaxonomyTermOrmEntity): TaxonomyTerm {
    return TaxonomyTerm.hydrate({
      id: row.id,
      kind: row.kind as TaxonomyKind,
      slug: row.slug,
      label: row.label,
      parentId: row.parentId,
      synonyms: [...(row.synonyms ?? [])],
      facetMetadata: { ...(row.facetMetadata ?? {}) },
      active: row.active,
      sortOrder: row.sortOrder,
      createdAt: row.createdAt,
    });
  }
}
