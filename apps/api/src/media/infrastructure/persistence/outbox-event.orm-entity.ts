import { Column, CreateDateColumn, Entity, Index, PrimaryColumn } from "typeorm";

@Entity("outbox_events")
@Index(["processedAt"])
export class OutboxEventOrmEntity {
  @PrimaryColumn("uuid")
  id!: string;

  @Column({ type: "varchar", length: 128 })
  type!: string;

  @Column({ type: "jsonb" })
  payload!: Record<string, unknown>;

  @CreateDateColumn({ name: "created_at", type: "timestamptz" })
  createdAt!: Date;

  @Column({ name: "processed_at", type: "timestamptz", nullable: true })
  processedAt!: Date | null;
}
