import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { PostOrmEntity } from "@/post/infrastructure/persistence/post.orm-entity";
import { IPostRepository } from "@/post/application/ports/post.repository.port";

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
}
