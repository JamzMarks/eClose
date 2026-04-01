import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryColumn,
  Unique,
  UpdateDateColumn,
} from "typeorm";

@Entity("friend_requests")
@Unique(["requesterId", "addresseeId"])
@Index(["addresseeId", "status"])
@Index(["requesterId", "status"])
export class FriendRequestOrmEntity {
  @PrimaryColumn("uuid")
  id!: string;

  @Column({ name: "requester_id", type: "uuid" })
  requesterId!: string;

  @Column({ name: "addressee_id", type: "uuid" })
  addresseeId!: string;

  @Column({ type: "varchar", length: 24 })
  status!: string;

  @CreateDateColumn({ name: "created_at", type: "timestamptz" })
  createdAt!: Date;

  @UpdateDateColumn({ name: "updated_at", type: "timestamptz" })
  updatedAt!: Date;
}
