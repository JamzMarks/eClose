import { Column, CreateDateColumn, Entity, Index, PrimaryColumn } from "typeorm";

@Entity("artists")
@Index(["slug"], { unique: true })
export class ArtistOrmEntity {
  @PrimaryColumn("uuid")
  id!: string;

  @Column({ type: "varchar", length: 255 })
  name!: string;

  @Column({ type: "varchar", length: 255 })
  slug!: string;

  @Column({ type: "varchar", length: 32 })
  type!: string;

  @Column({ name: "owner_id", type: "uuid" })
  ownerId!: string;

  @Column({ type: "text", nullable: true })
  headline!: string | null;

  @Column({ type: "text", nullable: true })
  bio!: string | null;

  @Column({ name: "website_url", type: "text", nullable: true })
  websiteUrl!: string | null;

  @Column({ name: "marketplace_visible", type: "boolean", default: false })
  marketplaceVisible!: boolean;

  @Column({ name: "open_to_venue_bookings", type: "boolean", default: false })
  openToVenueBookings!: boolean;

  @Column({ name: "taxonomy_term_ids", type: "jsonb", default: () => "'[]'" })
  taxonomyTermIds!: string[];

  @Column({ name: "primary_media_asset_id", type: "uuid", nullable: true })
  primaryMediaAssetId!: string | null;

  @CreateDateColumn({ name: "created_at", type: "timestamptz" })
  createdAt!: Date;

  @Column({ name: "is_active", type: "boolean", default: true })
  isActive!: boolean;
}
