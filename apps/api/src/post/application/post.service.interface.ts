import { CreatePostDto } from "@/post/application/dto/create-post.dto";
import { PostOrmEntity } from "@/post/infrastructure/persistence/post.orm-entity";
import { PostScopeType } from "@/post/domain/post-scope.type";

export interface IPostService {
  create(authorUserId: string, dto: CreatePostDto): Promise<PostOrmEntity>;
  listByScope(
    viewerUserId: string,
    scopeType: PostScopeType,
    scopeId: string | null,
    page?: number,
    limit?: number,
  ): Promise<{ items: PostOrmEntity[]; total: number; page: number; limit: number }>;
  listFriendsFeed(
    viewerUserId: string,
    page?: number,
    limit?: number,
  ): Promise<{ items: PostOrmEntity[]; total: number; page: number; limit: number }>;
  delete(actorUserId: string, postId: string): Promise<void>;
}
