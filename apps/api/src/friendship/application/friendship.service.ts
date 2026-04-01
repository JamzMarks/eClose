import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
  Optional,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { UserOrmEntity } from "@/user/infrastructure/persistence/user.orm-entity";
import { ID_GENERATOR, IdGenerator } from "@/shared/contracts/id-generator";
import { FriendRequestStatus } from "@/friendship/domain/friend-request-status.type";
import { FriendRequestOrmEntity } from "@/friendship/infrastructure/persistence/friend-request.orm-entity";
import { UserBlockOrmEntity } from "@/friendship/infrastructure/persistence/user-block.orm-entity";
import {
  FRIENDSHIP_REPOSITORY,
  IFriendshipRepository,
} from "@/friendship/application/ports/friendship.repository.port";
import {
  USER_BLOCK_REPOSITORY,
  IUserBlockRepository,
} from "@/friendship/application/ports/user-block.repository.port";
import { IFriendshipService } from "@/friendship/application/friendship.service.interface";
import { INotificationService } from "@/notification/interfaces/notification.interface";
import { NOTIFICATION_SERVICE } from "@/notification/tokens/notification.tokens";
import { DomainEventName } from "@/notification/types/domain-event-names";

@Injectable()
export class FriendshipService implements IFriendshipService {
  constructor(
    @Inject(ID_GENERATOR) private readonly ids: IdGenerator,
    @Inject(FRIENDSHIP_REPOSITORY)
    private readonly friends: IFriendshipRepository,
    @Inject(USER_BLOCK_REPOSITORY)
    private readonly blocks: IUserBlockRepository,
    @InjectRepository(UserOrmEntity)
    private readonly users: Repository<UserOrmEntity>,
    @Optional()
    @Inject(NOTIFICATION_SERVICE)
    private readonly notifications?: INotificationService,
  ) {}

  private async assertUserExists(id: string): Promise<void> {
    const u = await this.users.findOne({ where: { id } });
    if (!u) throw new NotFoundException("Utilizador não encontrado");
  }

  private async emit(name: string, aggregateId: string, payload?: Record<string, unknown>) {
    if (!this.notifications) return;
    await this.notifications.handleEvent({
      name,
      aggregateId,
      occurredAt: new Date(),
      payload,
    });
  }

  async areFriends(aUserId: string, bUserId: string): Promise<boolean> {
    return this.friends.areFriends(aUserId, bUserId);
  }

  async blockUser(blockerUserId: string, blockedUserId: string): Promise<void> {
    if (blockerUserId === blockedUserId) {
      throw new BadRequestException("Não pode bloquear a si mesmo");
    }
    await this.assertUserExists(blockerUserId);
    await this.assertUserExists(blockedUserId);
    const exists = await this.blocks.existsBetween(blockerUserId, blockedUserId);
    if (exists) {
      return;
    }
    await this.friends.removePendingBetween(blockerUserId, blockedUserId);
    const accepted = await this.friends.findAcceptedBetween(blockerUserId, blockedUserId);
    if (accepted) {
      await this.friends.remove(accepted.id);
    }
    const row = new UserBlockOrmEntity();
    row.id = this.ids.generate();
    row.blockerUserId = blockerUserId;
    row.blockedUserId = blockedUserId;
    await this.blocks.save(row);
  }

  async unblockUser(blockerUserId: string, blockedUserId: string): Promise<void> {
    await this.blocks.remove(blockerUserId, blockedUserId);
  }

  async listBlockedUserIds(userId: string): Promise<string[]> {
    return this.blocks.listBlockedIds(userId);
  }

  async sendRequest(fromUserId: string, toUserId: string): Promise<FriendRequestOrmEntity> {
    if (fromUserId === toUserId) {
      throw new BadRequestException("Não pode convidar a si mesmo");
    }
    await this.assertUserExists(fromUserId);
    await this.assertUserExists(toUserId);

    if (await this.blocks.existsBetween(fromUserId, toUserId)) {
      throw new ForbiddenException("Bloqueio impede pedidos de amizade");
    }

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
      if (await this.blocks.existsBetween(fromUserId, toUserId)) {
        throw new ForbiddenException("Bloqueio impede aceitar pedido");
      }
      reverse.status = FriendRequestStatus.ACCEPTED;
      await this.friends.save(reverse);
      await this.emit(DomainEventName.FRIEND_REQUEST_ACCEPTED, reverse.id, {
        notifyUserId: reverse.requesterId,
      });
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
    await this.emit(DomainEventName.FRIEND_REQUEST_RECEIVED, row.id, {
      notifyUserId: toUserId,
    });
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
    if (await this.blocks.existsBetween(row.requesterId, row.addresseeId)) {
      throw new ForbiddenException("Bloqueio impede aceitar");
    }
    row.status = FriendRequestStatus.ACCEPTED;
    await this.friends.save(row);
    await this.emit(DomainEventName.FRIEND_REQUEST_ACCEPTED, row.id, {
      notifyUserId: row.requesterId,
    });
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
