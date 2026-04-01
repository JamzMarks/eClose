import { Column, CreateDateColumn, Entity, PrimaryColumn, UpdateDateColumn } from "typeorm";

@Entity("chat_conversations")
export class ConversationOrmEntity {
  @PrimaryColumn("uuid")
  id!: string;

  @Column({ type: "varchar", length: 16 })
  kind!: string;

  @Column({ name: "participant_refs", type: "jsonb" })
  participantRefs!: { entityType: string; entityId: string }[];

  @Column({ type: "varchar", length: 500, nullable: true })
  title!: string | null;

  @Column({ name: "direct_pair_key", type: "varchar", length: 512, nullable: true, unique: true })
  directPairKey!: string | null;

  @CreateDateColumn({ name: "created_at", type: "timestamptz" })
  createdAt!: Date;

  @UpdateDateColumn({ name: "updated_at", type: "timestamptz" })
  updatedAt!: Date;
}
