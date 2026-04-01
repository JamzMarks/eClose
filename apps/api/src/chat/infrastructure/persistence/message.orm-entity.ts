import { Column, CreateDateColumn, Entity, Index, PrimaryColumn } from "typeorm";

@Entity("chat_messages")
@Index(["conversationId", "createdAt"])
export class MessageOrmEntity {
  @PrimaryColumn("uuid")
  id!: string;

  @Column({ name: "conversation_id", type: "uuid" })
  conversationId!: string;

  @Column({ name: "author_ref", type: "jsonb" })
  authorRef!: { entityType: string; entityId: string };

  @Column({ type: "text" })
  body!: string;

  @CreateDateColumn({ name: "created_at", type: "timestamptz" })
  createdAt!: Date;
}
