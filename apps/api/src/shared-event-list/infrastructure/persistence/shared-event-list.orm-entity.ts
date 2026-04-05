import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryColumn,
  UpdateDateColumn,
} from "typeorm";
import { UserOrmEntity } from "@/user/infrastructure/persistence/user.orm-entity";
import { SharedEventListMemberOrmEntity } from "./shared-event-list-member.orm-entity";
import { SharedEventListItemOrmEntity } from "./shared-event-list-item.orm-entity";

@Entity("shared_event_lists")
export class SharedEventListOrmEntity {
  @PrimaryColumn("uuid")
  id!: string;

  @Column({ name: "owner_user_id", type: "uuid" })
  ownerUserId!: string;

  @ManyToOne(() => UserOrmEntity, { onDelete: "CASCADE" })
  @JoinColumn({ name: "owner_user_id" })
  owner!: UserOrmEntity;

  @Column({ type: "varchar", length: 200 })
  title!: string;

  @CreateDateColumn({ name: "created_at", type: "timestamptz" })
  createdAt!: Date;

  @UpdateDateColumn({ name: "updated_at", type: "timestamptz" })
  updatedAt!: Date;

  @OneToMany(() => SharedEventListMemberOrmEntity, (m) => m.list)
  members!: SharedEventListMemberOrmEntity[];

  @OneToMany(() => SharedEventListItemOrmEntity, (i) => i.list)
  items!: SharedEventListItemOrmEntity[];
}
