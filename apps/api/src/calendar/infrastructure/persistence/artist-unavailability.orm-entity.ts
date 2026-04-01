import { Column, CreateDateColumn, Entity, Index, PrimaryColumn } from "typeorm";

@Entity("artist_unavailabilities")
@Index(["artistId", "startsAt", "endsAt"])
export class ArtistUnavailabilityOrmEntity {
  @PrimaryColumn("uuid")
  id!: string;

  @Column({ name: "artist_id", type: "uuid" })
  artistId!: string;

  @Column({ name: "starts_at", type: "timestamptz" })
  startsAt!: Date;

  @Column({ name: "ends_at", type: "timestamptz" })
  endsAt!: Date;

  @Column({ type: "text", nullable: true })
  reason!: string | null;

  @CreateDateColumn({ name: "created_at", type: "timestamptz" })
  createdAt!: Date;
}
