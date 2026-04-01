import { Column, CreateDateColumn, Entity, PrimaryColumn } from "typeorm";

@Entity("notifications")
export class NotificationOrmEntity {
  @PrimaryColumn("uuid")
  id!: string;

  @Column({ name: "user_id", type: "uuid" })
  userId!: string;

  @Column({ type: "varchar", length: 64 })
  type!: string;

  @Column({ type: "varchar", length: 32 })
  channel!: string;

  @Column({ name: "template_id", type: "varchar", length: 128, nullable: true })
  templateId!: string | null;

  @Column({ name: "template_version", type: "varchar", length: 32, nullable: true })
  templateVersion!: string | null;

  @Column({ type: "jsonb", default: () => "'{}'" })
  payload!: Record<string, unknown>;

  @Column({ type: "varchar", length: 32 })
  status!: string;

  @CreateDateColumn({ name: "created_at", type: "timestamptz" })
  createdAt!: Date;

  @Column({ name: "sent_at", type: "timestamptz", nullable: true })
  sentAt!: Date | null;

  @Column({ name: "delivered_at", type: "timestamptz", nullable: true })
  deliveredAt!: Date | null;

  @Column({ name: "external_id", type: "varchar", length: 255, nullable: true })
  externalId!: string | null;
}
