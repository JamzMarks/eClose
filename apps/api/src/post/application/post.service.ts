import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { ID_GENERATOR, IdGenerator } from "@/shared/contracts/id-generator";
import { PostScopeType } from "@/post/domain/post-scope.type";
import { PostOrmEntity } from "@/post/infrastructure/persistence/post.orm-entity";
import { POST_REPOSITORY, IPostRepository } from "@/post/application/ports/post.repository.port";
import {
  POST_ACCESS_POLICY,
  IPostAccessPolicy,
} from "@/post/application/ports/post-access.policy.port";
import { CreatePostDto } from "@/post/application/dto/create-post.dto";
import { IPostService } from "@/post/application/post.service.interface";
import { IFriendshipService } from "@/friendship/application/friendship.service.interface";
import { FRIENDSHIP_SERVICE } from "@/friendship/tokens/friendship.tokens";

@Injectable()
export class PostService implements IPostService {
  constructor(
    @Inject(ID_GENERATOR) private readonly ids: IdGenerator,
    @Inject(POST_REPOSITORY) private readonly posts: IPostRepository,
    @Inject(POST_ACCESS_POLICY) private readonly access: IPostAccessPolicy,
    @Inject(FRIENDSHIP_SERVICE) private readonly friendships: IFriendshipService,
  ) {}

  async create(authorUserId: string, dto: CreatePostDto): Promise<PostOrmEntity> {
    let scopeId: string | null = null;
    if (dto.scopeType === PostScopeType.GLOBAL_FEED) {
      if (dto.scopeId) {
        throw new BadRequestException("Feed global não deve ter scopeId");
      }
      scopeId = null;
    } else {
      if (!dto.scopeId?.trim()) {
        throw new BadRequestException("Este tipo de post exige scopeId");
      }
      scopeId = dto.scopeId!;
    }

    await this.access.assertCanCreatePost(authorUserId, dto.scopeType, scopeId);

    const row = new PostOrmEntity();
    row.id = this.ids.generate();
    row.authorUserId = authorUserId;
    row.scopeType = dto.scopeType;
    row.scopeId = scopeId;
    row.body = dto.body.trim();
    await this.posts.save(row);
    return row;
  }

  async listByScope(
    viewerUserId: string,
    scopeType: PostScopeType,
    scopeId: string | null,
    page = 1,
    limit = 20,
  ): Promise<{ items: PostOrmEntity[]; total: number; page: number; limit: number }> {
    if (scopeType !== PostScopeType.GLOBAL_FEED && !scopeId) {
      throw new BadRequestException("scopeId obrigatório para este tipo");
    }
    if (scopeType === PostScopeType.GLOBAL_FEED && scopeId) {
      throw new BadRequestException("Feed global não utiliza scopeId");
    }
    await this.access.assertCanListPosts(viewerUserId, scopeType, scopeId);

    const p = Math.max(1, page);
    const l = Math.min(100, Math.max(1, limit));
    const offset = (p - 1) * l;
    const { items, total } = await this.posts.listByScope(scopeType, scopeId, l, offset);
    return { items, total, page: p, limit: l };
  }

  async listFriendsFeed(
    viewerUserId: string,
    page = 1,
    limit = 20,
  ): Promise<{ items: PostOrmEntity[]; total: number; page: number; limit: number }> {
    const friendIds = await this.friendships.listFriends(viewerUserId);
    const p = Math.max(1, page);
    const l = Math.min(100, Math.max(1, limit));
    const offset = (p - 1) * l;
    const { items, total } = await this.posts.listFriendsFeed(friendIds, l, offset);
    return { items, total, page: p, limit: l };
  }

  async delete(actorUserId: string, postId: string): Promise<void> {
    const row = await this.posts.findById(postId);
    if (!row) throw new NotFoundException("Post não encontrado");
    await this.access.assertCanDeletePost(actorUserId, row);
    await this.posts.remove(postId);
  }
}
