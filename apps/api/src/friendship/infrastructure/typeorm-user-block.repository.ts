import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { UserBlockOrmEntity } from "@/friendship/infrastructure/persistence/user-block.orm-entity";
import { IUserBlockRepository } from "@/friendship/application/ports/user-block.repository.port";

@Injectable()
export class TypeormUserBlockRepository implements IUserBlockRepository {
  constructor(
    @InjectRepository(UserBlockOrmEntity)
    private readonly repo: Repository<UserBlockOrmEntity>,
  ) {}

  async save(row: UserBlockOrmEntity): Promise<void> {
    await this.repo.save(row);
  }

  async remove(blockerUserId: string, blockedUserId: string): Promise<void> {
    await this.repo.delete({ blockerUserId, blockedUserId });
  }

  async existsBetween(aUserId: string, bUserId: string): Promise<boolean> {
    const n = await this.repo
      .createQueryBuilder("b")
      .where(
        "(b.blockerUserId = :a AND b.blockedUserId = :b) OR (b.blockerUserId = :b AND b.blockedUserId = :a)",
        { a: aUserId, b: bUserId },
      )
      .getCount();
    return n > 0;
  }

  async listBlockedIds(blockerUserId: string): Promise<string[]> {
    const rows = await this.repo.find({
      where: { blockerUserId },
      select: ["blockedUserId"],
    });
    return rows.map((r) => r.blockedUserId);
  }
}
