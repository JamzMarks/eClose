import { CreatePostDto } from "@/post/application/dto/create-post.dto";
import { PostOrmEntity } from "@/post/infrastructure/persistence/post.orm-entity";
import { PostScopeType } from "@/post/domain/post-scope.type";

export interface IPostService {
  create(authorUserId: string, dto: CreatePostDto): Promise<PostOrmEntity>;
  listByScope(
    scopeType: PostScopeType,
    scopeId: string | null,
    page?: number,
    limit?: number,
  ): Promise<{ items: PostOrmEntity[]; total: number; page: number; limit: number }>;
  delete(authorUserId: string, postId: string): Promise<void>;
}
