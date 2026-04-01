import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { FriendRequestOrmEntity } from "@/friendship/infrastructure/persistence/friend-request.orm-entity";
import { FriendRequestStatus } from "@/friendship/domain/friend-request-status.type";
import { IFriendshipRepository } from "@/friendship/application/ports/friendship.repository.port";

@Injectable()
export class TypeormFriendshipRepository implements IFriendshipRepository {
  constructor(
    @InjectRepository(FriendRequestOrmEntity)
    private readonly repo: Repository<FriendRequestOrmEntity>,
  ) {}

  async save(row: FriendRequestOrmEntity): Promise<void> {
    await this.repo.save(row);
  }

  async findById(id: string): Promise<FriendRequestOrmEntity | null> {
    return this.repo.findOne({ where: { id } });
  }

  async findByPair(requesterId: string, addresseeId: string): Promise<FriendRequestOrmEntity | null> {
    return this.repo.findOne({ where: { requesterId, addresseeId } });
  }

  async findAcceptedBetween(a: string, b: string): Promise<FriendRequestOrmEntity | null> {
    const forward = await this.repo.findOne({
      where: {
        requesterId: a,
        addresseeId: b,
        status: FriendRequestStatus.ACCEPTED,
      },
    });
    if (forward) return forward;
    return this.repo.findOne({
      where: {
        requesterId: b,
        addresseeId: a,
        status: FriendRequestStatus.ACCEPTED,
      },
    });
  }

  async listAcceptedForUser(userId: string): Promise<FriendRequestOrmEntity[]> {
    return this.repo
      .createQueryBuilder("f")
      .where("f.status = :st", { st: FriendRequestStatus.ACCEPTED })
      .andWhere("(f.requester_id = :uid OR f.addressee_id = :uid)", { uid: userId })
      .orderBy("f.updated_at", "DESC")
      .getMany();
  }

  async listPendingIncoming(userId: string): Promise<FriendRequestOrmEntity[]> {
    return this.repo.find({
      where: { addresseeId: userId, status: FriendRequestStatus.PENDING },
      order: { createdAt: "DESC" },
    });
  }

  async listPendingOutgoing(userId: string): Promise<FriendRequestOrmEntity[]> {
    return this.repo.find({
      where: { requesterId: userId, status: FriendRequestStatus.PENDING },
      order: { createdAt: "DESC" },
    });
  }

  async remove(id: string): Promise<void> {
    await this.repo.delete({ id });
  }
}
