import { Column, Entity, Index, JoinColumn, ManyToOne, PrimaryColumn } from "typeorm";
import { UserOrmEntity } from "@/user/infrastructure/persistence/user.orm-entity";

@Entity("oauth_accounts")
@Index(["provider", "providerAccountId"], { unique: true })
export class OAuthAccountOrmEntity {
  @PrimaryColumn("uuid")
  id!: string;

  @Column({ type: "varchar", length: 32 })
  provider!: string;

  @Column({ name: "provider_account_id", type: "varchar", length: 255 })
  providerAccountId!: string;

  @Column({ name: "user_id", type: "uuid" })
  userId!: string;

  @ManyToOne(() => UserOrmEntity, { onDelete: "CASCADE" })
  @JoinColumn({ name: "user_id" })
  user!: UserOrmEntity;
}
