import { Column, CreateDateColumn, Entity, Index, PrimaryColumn } from "typeorm";

@Entity("taxonomy_terms")
@Index(["kind", "slug"], { unique: true })
export class TaxonomyTermOrmEntity {
  @PrimaryColumn("uuid")
  id!: string;

  @Column({ type: "varchar", length: 64 })
  kind!: string;

  @Column({ type: "varchar", length: 128 })
  slug!: string;

  @Column({ type: "varchar", length: 255 })
  label!: string;

  @Column({ name: "parent_id", type: "uuid", nullable: true })
  parentId!: string | null;

  @Column({ type: "jsonb", default: () => "'[]'" })
  synonyms!: string[];

  @Column({ name: "facet_metadata", type: "jsonb", default: () => "'{}'" })
  facetMetadata!: Record<string, unknown>;

  @Column({ type: "boolean", default: true })
  active!: boolean;

  @Column({ name: "sort_order", type: "int", default: 0 })
  sortOrder!: number;

  @CreateDateColumn({ name: "created_at", type: "timestamptz" })
  createdAt!: Date;
}
