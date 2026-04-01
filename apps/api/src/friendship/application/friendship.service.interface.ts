import { FriendRequestOrmEntity } from "@/friendship/infrastructure/persistence/friend-request.orm-entity";

export interface IFriendshipService {
  sendRequest(fromUserId: string, toUserId: string): Promise<FriendRequestOrmEntity>;
  acceptRequest(userId: string, requestId: string): Promise<FriendRequestOrmEntity>;
  rejectRequest(userId: string, requestId: string): Promise<FriendRequestOrmEntity>;
  cancelOutgoing(userId: string, requestId: string): Promise<void>;
  listFriends(userId: string): Promise<string[]>;
  listPendingIncoming(userId: string): Promise<FriendRequestOrmEntity[]>;
  listPendingOutgoing(userId: string): Promise<FriendRequestOrmEntity[]>;
  unfriend(userId: string, friendUserId: string): Promise<void>;
  areFriends(aUserId: string, bUserId: string): Promise<boolean>;
  blockUser(blockerUserId: string, blockedUserId: string): Promise<void>;
  unblockUser(blockerUserId: string, blockedUserId: string): Promise<void>;
  listBlockedUserIds(userId: string): Promise<string[]>;
}
