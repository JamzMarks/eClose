import { Column, CreateDateColumn, Entity, Index, PrimaryColumn } from "typeorm";

@Entity("venue_verification_history")
@Index(["venueId"])
export class VenueVerificationHistoryOrmEntity {
  @PrimaryColumn("uuid")
  id!: string;

  @Column({ name: "venue_id", type: "uuid" })
  venueId!: string;

  @CreateDateColumn({ name: "created_at", type: "timestamptz" })
  createdAt!: Date;

  /** trust_submission | trust_admin_review */
  @Column({ name: "event_kind", type: "varchar", length: 32 })
  eventKind!: string;

  @Column({ name: "from_status", type: "varchar", length: 32 })
  fromStatus!: string;

  @Column({ name: "to_status", type: "varchar", length: 32 })
  toStatus!: string;

  @Column({ name: "registry_snapshot_hash", type: "varchar", length: 64, nullable: true })
  registrySnapshotHash!: string | null;

  @Column({ name: "rejection_reason", type: "text", nullable: true })
  rejectionReason!: string | null;
}
