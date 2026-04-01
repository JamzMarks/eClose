import { Column, CreateDateColumn, Entity, Index, PrimaryColumn, UpdateDateColumn } from "typeorm";

@Entity("venues")
@Index(["slug"], { unique: true })
export class VenueOrmEntity {
  @PrimaryColumn("uuid")
  id!: string;

  @Column({ type: "varchar", length: 255 })
  name!: string;

  @Column({ type: "varchar", length: 255 })
  slug!: string;

  @Column({ type: "text", nullable: true })
  description!: string | null;

  @Column({ name: "owner_user_id", type: "uuid", nullable: true })
  ownerUserId!: string | null;

  @Column({ type: "jsonb" })
  address!: Record<string, unknown>;

  @Column({ name: "geo_lat", type: "double precision", nullable: true })
  geoLat!: number | null;

  @Column({ name: "geo_lng", type: "double precision", nullable: true })
  geoLng!: number | null;

  @Column({ type: "varchar", length: 64 })
  timezone!: string;

  @Column({ name: "opening_hours", type: "jsonb", default: () => "'[]'" })
  openingHours!: unknown[];

  @Column({ name: "taxonomy_term_ids", type: "jsonb", default: () => "'[]'" })
  taxonomyTermIds!: string[];

  @Column({ name: "marketplace_listed", type: "boolean", default: false })
  marketplaceListed!: boolean;

  @Column({ name: "open_to_artist_inquiries", type: "boolean", default: false })
  openToArtistInquiries!: boolean;

  @Column({ name: "primary_media_asset_id", type: "uuid", nullable: true })
  primaryMediaAssetId!: string | null;

  @Column({ name: "is_active", type: "boolean", default: true })
  isActive!: boolean;

  @CreateDateColumn({ name: "created_at", type: "timestamptz" })
  createdAt!: Date;

  @UpdateDateColumn({ name: "updated_at", type: "timestamptz" })
  updatedAt!: Date;
}
