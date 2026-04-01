import { Column, CreateDateColumn, Entity, Index, PrimaryColumn, UpdateDateColumn } from "typeorm";

@Entity("events")
@Index(["slug"], { unique: true })
export class EventOrmEntity {
  @PrimaryColumn("uuid")
  id!: string;

  @Column({ type: "varchar", length: 500 })
  title!: string;

  @Column({ type: "varchar", length: 255 })
  slug!: string;

  @Column({ type: "text", nullable: true })
  description!: string | null;

  @Column({ name: "location_mode", type: "varchar", length: 32 })
  locationMode!: string;

  @Column({ name: "venue_id", type: "uuid", nullable: true })
  venueId!: string | null;

  @Column({ name: "online_url", type: "text", nullable: true })
  onlineUrl!: string | null;

  @Column({ name: "location_label", type: "varchar", length: 500, nullable: true })
  locationLabel!: string | null;

  @Column({ name: "location_notes", type: "text", nullable: true })
  locationNotes!: string | null;

  @Column({ name: "adhoc_address", type: "jsonb", nullable: true })
  adhocAddress!: Record<string, unknown> | null;

  @Column({ name: "starts_at", type: "timestamptz" })
  startsAt!: Date;

  @Column({ name: "ends_at", type: "timestamptz" })
  endsAt!: Date;

  @Column({ type: "varchar", length: 64 })
  timezone!: string;

  @Column({ name: "organizer_artist_id", type: "uuid" })
  organizerArtistId!: string;

  @Column({ name: "taxonomy_term_ids", type: "jsonb", default: () => "'[]'" })
  taxonomyTermIds!: string[];

  @Column({ name: "primary_media_asset_id", type: "uuid", nullable: true })
  primaryMediaAssetId!: string | null;

  @Column({ type: "varchar", length: 32 })
  status!: string;

  @CreateDateColumn({ name: "created_at", type: "timestamptz" })
  createdAt!: Date;

  @UpdateDateColumn({ name: "updated_at", type: "timestamptz" })
  updatedAt!: Date;
}
