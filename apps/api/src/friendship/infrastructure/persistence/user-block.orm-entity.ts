import { Column, CreateDateColumn, Entity, PrimaryColumn, Unique } from "typeorm";

@Entity("user_blocks")
@Unique(["blockerUserId", "blockedUserId"])
export class UserBlockOrmEntity {
  @PrimaryColumn("uuid")
  id!: string;

  @Column({ name: "blocker_user_id", type: "uuid" })
  blockerUserId!: string;

  @Column({ name: "blocked_user_id", type: "uuid" })
  blockedUserId!: string;

  @CreateDateColumn({ name: "created_at", type: "timestamptz" })
  createdAt!: Date;
}
