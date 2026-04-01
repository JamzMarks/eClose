import {
  BadRequestException,
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { UserOrmEntity } from "@/user/infrastructure/persistence/user.orm-entity";
import { ID_GENERATOR, IdGenerator } from "@/shared/contracts/id-generator";
import { FriendRequestStatus } from "@/friendship/domain/friend-request-status.type";
import { FriendRequestOrmEntity } from "@/friendship/infrastructure/persistence/friend-request.orm-entity";
import {
  FRIENDSHIP_REPOSITORY,
  IFriendshipRepository,
} from "@/friendship/application/ports/friendship.repository.port";
import { IFriendshipService } from "@/friendship/application/friendship.service.interface";

@Injectable()
export class FriendshipService implements IFriendshipService {
  constructor(
    @Inject(ID_GENERATOR) private readonly ids: IdGenerator,
    @Inject(FRIENDSHIP_REPOSITORY)
    private readonly friends: IFriendshipRepository,
    @InjectRepository(UserOrmEntity)
    private readonly users: Repository<UserOrmEntity>,
  ) {}

  private async assertUserExists(id: string): Promise<void> {
    const u = await this.users.findOne({ where: { id } });
    if (!u) throw new NotFoundException("Utilizador não encontrado");
  }

  async sendRequest(fromUserId: string, toUserId: string): Promise<FriendRequestOrmEntity> {
    if (fromUserId === toUserId) {
      throw new BadRequestException("Não pode convidar a si mesmo");
    }
    await this.assertUserExists(fromUserId);
    await this.assertUserExists(toUserId);

    const already = await this.friends.findAcceptedBetween(fromUserId, toUserId);
    if (already) {
      throw new ConflictException("Já são amigos");
    }

    const outgoing = await this.friends.findByPair(fromUserId, toUserId);
    if (outgoing?.status === FriendRequestStatus.PENDING) {
      throw new ConflictException("Pedido já enviado");
    }

    const reverse = await this.friends.findByPair(toUserId, fromUserId);
    if (reverse?.status === FriendRequestStatus.PENDING) {
      reverse.status = FriendRequestStatus.ACCEPTED;
      await this.friends.save(reverse);
      return reverse;
    }

    if (reverse?.status === FriendRequestStatus.ACCEPTED) {
      throw new ConflictException("Já são amigos");
    }

    const row = new FriendRequestOrmEntity();
    row.id = this.ids.generate();
    row.requesterId = fromUserId;
    row.addresseeId = toUserId;
    row.status = FriendRequestStatus.PENDING;
    await this.friends.save(row);
    return row;
  }

  async acceptRequest(userId: string, requestId: string): Promise<FriendRequestOrmEntity> {
    const row = await this.friends.findById(requestId);
    if (!row) throw new NotFoundException("Pedido não encontrado");
    if (row.addresseeId !== userId) {
      throw new BadRequestException("Só o destinatário pode aceitar");
    }
    if (row.status !== FriendRequestStatus.PENDING) {
      throw new BadRequestException("Pedido já tratado");
    }
    row.status = FriendRequestStatus.ACCEPTED;
    await this.friends.save(row);
    return row;
  }

  async rejectRequest(userId: string, requestId: string): Promise<FriendRequestOrmEntity> {
    const row = await this.friends.findById(requestId);
    if (!row) throw new NotFoundException("Pedido não encontrado");
    if (row.addresseeId !== userId) {
      throw new BadRequestException("Só o destinatário pode recusar");
    }
    if (row.status !== FriendRequestStatus.PENDING) {
      throw new BadRequestException("Pedido já tratado");
    }
    row.status = FriendRequestStatus.REJECTED;
    await this.friends.save(row);
    return row;
  }

  async cancelOutgoing(userId: string, requestId: string): Promise<void> {
    const row = await this.friends.findById(requestId);
    if (!row) throw new NotFoundException("Pedido não encontrado");
    if (row.requesterId !== userId) {
      throw new BadRequestException("Só o remetente pode cancelar");
    }
    if (row.status !== FriendRequestStatus.PENDING) {
      throw new BadRequestException("Só pedidos pendentes podem ser cancelados");
    }
    row.status = FriendRequestStatus.CANCELLED;
    await this.friends.save(row);
  }

  async listFriends(userId: string): Promise<string[]> {
    const rows = await this.friends.listAcceptedForUser(userId);
    return rows.map((r) => (r.requesterId === userId ? r.addresseeId : r.requesterId));
  }

  async listPendingIncoming(userId: string): Promise<FriendRequestOrmEntity[]> {
    return this.friends.listPendingIncoming(userId);
  }

  async listPendingOutgoing(userId: string): Promise<FriendRequestOrmEntity[]> {
    return this.friends.listPendingOutgoing(userId);
  }

  async unfriend(userId: string, friendUserId: string): Promise<void> {
    const row = await this.friends.findAcceptedBetween(userId, friendUserId);
    if (!row) {
      throw new NotFoundException("Amizade não encontrada");
    }
    await this.friends.remove(row.id);
  }
}
