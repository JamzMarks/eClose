import { Column, CreateDateColumn, Entity, Index, PrimaryColumn } from "typeorm";

@Entity("posts")
@Index(["scopeType", "scopeId", "createdAt"])
export class PostOrmEntity {
  @PrimaryColumn("uuid")
  id!: string;

  @Column({ name: "author_user_id", type: "uuid" })
  authorUserId!: string;

  @Column({ name: "scope_type", type: "varchar", length: 32 })
  scopeType!: string;

  @Column({ name: "scope_id", type: "uuid", nullable: true })
  scopeId!: string | null;

  @Column({ type: "text" })
  body!: string;

  @CreateDateColumn({ name: "created_at", type: "timestamptz" })
  createdAt!: Date;
}
