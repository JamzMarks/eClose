import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
} from "typeorm";
import { UserOrmEntity } from "@/user/infrastructure/persistence/user.orm-entity";
import { EventOrmEntity } from "@/event/infrastructure/persistence/event.orm-entity";
import { SharedEventListOrmEntity } from "./shared-event-list.orm-entity";

@Entity("shared_event_list_items")
@Index(["listId", "eventId"], { unique: true })
export class SharedEventListItemOrmEntity {
  @PrimaryColumn("uuid")
  id!: string;

  @Column({ name: "list_id", type: "uuid" })
  listId!: string;

  @ManyToOne(() => SharedEventListOrmEntity, (l) => l.items, { onDelete: "CASCADE" })
  @JoinColumn({ name: "list_id" })
  list!: SharedEventListOrmEntity;

  @Column({ name: "event_id", type: "uuid" })
  eventId!: string;

  @ManyToOne(() => EventOrmEntity, { onDelete: "CASCADE" })
  @JoinColumn({ name: "event_id" })
  event!: EventOrmEntity;

  @Column({ name: "added_by_user_id", type: "uuid" })
  addedByUserId!: string;

  @ManyToOne(() => UserOrmEntity, { onDelete: "CASCADE" })
  @JoinColumn({ name: "added_by_user_id" })
  addedBy!: UserOrmEntity;

  @CreateDateColumn({ name: "added_at", type: "timestamptz" })
  addedAt!: Date;
}
