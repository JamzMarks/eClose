import { PostOrmEntity } from "@/post/infrastructure/persistence/post.orm-entity";

export const POST_REPOSITORY = Symbol("POST_REPOSITORY");

export interface IPostRepository {
  save(row: PostOrmEntity): Promise<void>;
  findById(id: string): Promise<PostOrmEntity | null>;
  remove(id: string): Promise<void>;
  listByScope(
    scopeType: string,
    scopeId: string | null,
    limit: number,
    offset: number,
  ): Promise<{ items: PostOrmEntity[]; total: number }>;
}
