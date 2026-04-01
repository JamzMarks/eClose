import {
  BadRequestException,
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { ID_GENERATOR, IdGenerator } from "@/shared/contracts/id-generator";
import { PostScopeType } from "@/post/domain/post-scope.type";
import { PostOrmEntity } from "@/post/infrastructure/persistence/post.orm-entity";
import { POST_REPOSITORY, IPostRepository } from "@/post/application/ports/post.repository.port";
import { CreatePostDto } from "@/post/application/dto/create-post.dto";
import { IPostService } from "@/post/application/post.service.interface";

@Injectable()
export class PostService implements IPostService {
  constructor(
    @Inject(ID_GENERATOR) private readonly ids: IdGenerator,
    @Inject(POST_REPOSITORY) private readonly posts: IPostRepository,
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
    const p = Math.max(1, page);
    const l = Math.min(100, Math.max(1, limit));
    const offset = (p - 1) * l;
    const { items, total } = await this.posts.listByScope(scopeType, scopeId, l, offset);
    return { items, total, page: p, limit: l };
  }

  async delete(authorUserId: string, postId: string): Promise<void> {
    const row = await this.posts.findById(postId);
    if (!row) throw new NotFoundException("Post não encontrado");
    if (row.authorUserId !== authorUserId) {
      throw new ForbiddenException("Apenas o autor pode apagar");
    }
    await this.posts.remove(postId);
  }
}
