import { Column, CreateDateColumn, Entity, Index, PrimaryColumn } from "typeorm";

@Entity("media_assets")
@Index(["parentType", "parentId"])
export class MediaAssetOrmEntity {
  @PrimaryColumn("uuid")
  id!: string;

  @Column({ name: "parent_type", type: "varchar", length: 32 })
  parentType!: string;

  @Column({ name: "parent_id", type: "uuid" })
  parentId!: string;

  @Column({ type: "varchar", length: 32 })
  kind!: string;

  @Column({ name: "source_url", type: "text" })
  sourceUrl!: string;

  @Column({ name: "storage_key", type: "text", nullable: true })
  storageKey!: string | null;

  @Column({ name: "thumbnail_url", type: "text", nullable: true })
  thumbnailUrl!: string | null;

  @Column({ name: "cdn_url", type: "text", nullable: true })
  cdnUrl!: string | null;

  @Column({ name: "processing_status", type: "varchar", length: 32, default: "READY" })
  processingStatus!: string;

  @Column({ name: "mime_type", type: "varchar", length: 128, nullable: true })
  mimeType!: string | null;

  @Column({ type: "int", nullable: true })
  width!: number | null;

  @Column({ type: "int", nullable: true })
  height!: number | null;

  @Column({ name: "duration_seconds", type: "float", nullable: true })
  durationSeconds!: number | null;

  @Column({ type: "text", nullable: true })
  caption!: string | null;

  @Column({ name: "sort_order", type: "int", default: 0 })
  sortOrder!: number;

  @Column({ name: "is_primary", type: "boolean", default: false })
  isPrimary!: boolean;

  @Column({ type: "boolean", default: true })
  listable!: boolean;

  @CreateDateColumn({ name: "created_at", type: "timestamptz" })
  createdAt!: Date;
}
