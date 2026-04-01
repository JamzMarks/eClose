import { PostOrmEntity } from "@/post/infrastructure/persistence/post.orm-entity";
import { PostScopeType } from "@/post/domain/post-scope.type";

export const POST_ACCESS_POLICY = Symbol("POST_ACCESS_POLICY");

export interface IPostAccessPolicy {
  assertCanCreatePost(actorUserId: string, scopeType: PostScopeType, scopeId: string | null): Promise<void>;
  assertCanListPosts(actorUserId: string, scopeType: PostScopeType, scopeId: string | null): Promise<void>;
  assertCanDeletePost(actorUserId: string, post: PostOrmEntity): Promise<void>;
}
