import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from "typeorm";
import { UserOrmEntity } from "@/user/infrastructure/persistence/user.orm-entity";
import { SharedEventListMemberRole } from "@/shared-event-list/domain/types/shared-event-list-member-role.type";
import { SharedEventListOrmEntity } from "./shared-event-list.orm-entity";

@Entity("shared_event_list_members")
export class SharedEventListMemberOrmEntity {
  @PrimaryColumn({ name: "list_id", type: "uuid" })
  listId!: string;

  @PrimaryColumn({ name: "user_id", type: "uuid" })
  userId!: string;

  @ManyToOne(() => SharedEventListOrmEntity, (l) => l.members, { onDelete: "CASCADE" })
  @JoinColumn({ name: "list_id" })
  list!: SharedEventListOrmEntity;

  @ManyToOne(() => UserOrmEntity, { onDelete: "CASCADE" })
  @JoinColumn({ name: "user_id" })
  user!: UserOrmEntity;

  @Column({ type: "varchar", length: 32 })
  role!: SharedEventListMemberRole;
}
