import { FriendRequestOrmEntity } from "@/friendship/infrastructure/persistence/friend-request.orm-entity";

export const FRIENDSHIP_REPOSITORY = Symbol("FRIENDSHIP_REPOSITORY");

export interface IFriendshipRepository {
  save(row: FriendRequestOrmEntity): Promise<void>;
  findById(id: string): Promise<FriendRequestOrmEntity | null>;
  /** Pedido exacto requester → addressee */
  findByPair(requesterId: string, addresseeId: string): Promise<FriendRequestOrmEntity | null>;
  findAcceptedBetween(a: string, b: string): Promise<FriendRequestOrmEntity | null>;
  listAcceptedForUser(userId: string): Promise<FriendRequestOrmEntity[]>;
  listPendingIncoming(userId: string): Promise<FriendRequestOrmEntity[]>;
  listPendingOutgoing(userId: string): Promise<FriendRequestOrmEntity[]>;
  remove(id: string): Promise<void>;
  areFriends(aUserId: string, bUserId: string): Promise<boolean>;
  removePendingBetween(aUserId: string, bUserId: string): Promise<void>;
}
