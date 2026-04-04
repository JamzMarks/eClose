import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Brackets, Repository } from "typeorm";
import { PostOrmEntity } from "@/post/infrastructure/persistence/post.orm-entity";
import { IPostRepository } from "@/post/application/ports/post.repository.port";
import { PostScopeType } from "@/post/domain/post-scope.type";
import { EventStatus } from "@/event/domain/types/event-status.type";

@Injectable()
export class TypeormPostRepository implements IPostRepository {
  constructor(
    @InjectRepository(PostOrmEntity)
    private readonly repo: Repository<PostOrmEntity>,
  ) {}

  async save(row: PostOrmEntity): Promise<void> {
    await this.repo.save(row);
  }

  async findById(id: string): Promise<PostOrmEntity | null> {
    return this.repo.findOne({ where: { id } });
  }

  async remove(id: string): Promise<void> {
    await this.repo.delete({ id });
  }

  async listByScope(
    scopeType: string,
    scopeId: string | null,
    limit: number,
    offset: number,
  ): Promise<{ items: PostOrmEntity[]; total: number }> {
    const qb = this.repo
      .createQueryBuilder("p")
      .where("p.scopeType = :st", { st: scopeType })
      .orderBy("p.createdAt", "DESC")
      .skip(offset)
      .take(limit);
    if (scopeId === null) {
      qb.andWhere("p.scopeId IS NULL");
    } else {
      qb.andWhere("p.scopeId = :sid", { sid: scopeId });
    }
    const [items, total] = await qb.getManyAndCount();
    return { items, total };
  }

  async listFriendsFeed(
    friendUserIds: string[],
    limit: number,
    offset: number,
  ): Promise<{ items: PostOrmEntity[]; total: number }> {
    const qb = this.repo.createQueryBuilder("p");
    qb.where(
      new Brackets((w) => {
        w.where("p.scopeType = :gf AND p.scopeId IS NULL", {
          gf: PostScopeType.GLOBAL_FEED,
        });
        if (friendUserIds.length > 0) {
          w.orWhere("p.scopeType = :pf AND p.scopeId IN (:...fids)", {
            pf: PostScopeType.PROFILE,
            fids: friendUserIds,
          });
          w.orWhere(
            new Brackets((evq) => {
              evq
                .where("p.scopeType = :ev", { ev: PostScopeType.EVENT })
                .andWhere(
                  `EXISTS (
                    SELECT 1 FROM events e
                    INNER JOIN artists a ON a.id = e.organizer_artist_id
                    WHERE e.id = p.scope_id AND e.status = :pub
                    AND a.owner_id IN (:...fids)
                  )`,
                  { pub: EventStatus.PUBLISHED, fids: friendUserIds },
                );
            }),
          );
        }
      }),
    );
    qb.orderBy("p.createdAt", "DESC").skip(offset).take(limit);
    const [items, total] = await qb.getManyAndCount();
    return { items, total };
  }
}
