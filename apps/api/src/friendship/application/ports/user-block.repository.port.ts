import { UserBlockOrmEntity } from "@/friendship/infrastructure/persistence/user-block.orm-entity";

export const USER_BLOCK_REPOSITORY = Symbol("USER_BLOCK_REPOSITORY");

export interface IUserBlockRepository {
  save(row: UserBlockOrmEntity): Promise<void>;
  remove(blockerUserId: string, blockedUserId: string): Promise<void>;
  existsBetween(aUserId: string, bUserId: string): Promise<boolean>;
  listBlockedIds(blockerUserId: string): Promise<string[]>;
}
