import { Column, CreateDateColumn, Entity, Index, PrimaryColumn } from "typeorm";

@Entity("audit_log")
@Index(["resourceType", "resourceId"])
@Index(["createdAt"])
export class AuditLogOrmEntity {
  @PrimaryColumn("uuid")
  id!: string;

  @Column({ name: "actor_type", type: "varchar", length: 32 })
  actorType!: string;

  @Column({ name: "actor_id", type: "uuid", nullable: true })
  actorId!: string | null;

  @Column({ type: "varchar", length: 128 })
  action!: string;

  @Column({ name: "resource_type", type: "varchar", length: 64 })
  resourceType!: string;

  @Column({ name: "resource_id", type: "varchar", length: 64 })
  resourceId!: string;

  @Column({ type: "jsonb", nullable: true })
  payload!: Record<string, unknown> | null;

  @Column({ name: "payload_hash", type: "varchar", length: 64, nullable: true })
  payloadHash!: string | null;

  @CreateDateColumn({ name: "created_at", type: "timestamptz" })
  createdAt!: Date;
}
