import { Column, CreateDateColumn, Entity, Index, PrimaryColumn } from "typeorm";

@Entity("venue_unavailabilities")
@Index(["venueId", "startsAt", "endsAt"])
export class VenueUnavailabilityOrmEntity {
  @PrimaryColumn("uuid")
  id!: string;

  @Column({ name: "venue_id", type: "uuid" })
  venueId!: string;

  @Column({ name: "starts_at", type: "timestamptz" })
  startsAt!: Date;

  @Column({ name: "ends_at", type: "timestamptz" })
  endsAt!: Date;

  @Column({ type: "text", nullable: true })
  reason!: string | null;

  @CreateDateColumn({ name: "created_at", type: "timestamptz" })
  createdAt!: Date;
}
