import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { Inject } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { IEventRepository } from "@/event/application/ports/event.repository.interface";
import { EVENT_REPOSITORY } from "@/event/application/tokens/event.tokens";
import { EventStatus } from "@/event/domain/types/event-status.type";
import { IFriendshipService } from "@/friendship/application/friendship.service.interface";
import { FRIENDSHIP_SERVICE } from "@/friendship/tokens/friendship.tokens";
import { SharedEventListMemberRole } from "@/shared-event-list/domain/types/shared-event-list-member-role.type";
import { SharedEventListItemOrmEntity } from "@/shared-event-list/infrastructure/persistence/shared-event-list-item.orm-entity";
import { SharedEventListMemberOrmEntity } from "@/shared-event-list/infrastructure/persistence/shared-event-list-member.orm-entity";
import { SharedEventListOrmEntity } from "@/shared-event-list/infrastructure/persistence/shared-event-list.orm-entity";
import { ID_GENERATOR, IdGenerator } from "@/shared/contracts/id-generator";

export type SharedEventListSummary = {
  id: string;
  title: string;
  ownerUserId: string;
  myRole: SharedEventListMemberRole;
  memberCount: number;
  eventCount: number;
  createdAt: Date;
  updatedAt: Date;
};

@Injectable()
export class SharedEventListService {
  constructor(
    @InjectRepository(SharedEventListOrmEntity)
    private readonly lists: Repository<SharedEventListOrmEntity>,
    @InjectRepository(SharedEventListMemberOrmEntity)
    private readonly members: Repository<SharedEventListMemberOrmEntity>,
    @InjectRepository(SharedEventListItemOrmEntity)
    private readonly items: Repository<SharedEventListItemOrmEntity>,
    @Inject(FRIENDSHIP_SERVICE) private readonly friendships: IFriendshipService,
    @Inject(EVENT_REPOSITORY) private readonly eventRepo: IEventRepository,
    @Inject(ID_GENERATOR) private readonly ids: IdGenerator,
  ) {}

  async create(actorId: string, title: string): Promise<SharedEventListSummary> {
    const id = this.ids.generate();
    const list = this.lists.create({
      id,
      ownerUserId: actorId,
      title: title.trim(),
    });
    await this.lists.save(list);
    await this.members.save(
      this.members.create({
        listId: id,
        userId: actorId,
        role: SharedEventListMemberRole.OWNER,
      }),
    );
    return this.summaryForViewer(list, actorId);
  }

  async listMine(actorId: string): Promise<SharedEventListSummary[]> {
    const memberships = await this.members.find({
      where: { userId: actorId },
    });
    const out: SharedEventListSummary[] = [];
    for (const m of memberships) {
      const list = await this.lists.findOne({ where: { id: m.listId } });
      if (!list) continue;
      out.push(await this.summaryForViewer(list, actorId));
    }
    out.sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime());
    return out;
  }

  async getDetail(actorId: string, listId: string) {
    const list = await this.requireList(listId);
    const my = await this.requireMembership(listId, actorId);
    const memberRows = await this.members.find({ where: { listId } });
    const memberCount = memberRows.length;
    const eventCount = await this.items.count({ where: { listId } });
    return {
      id: list.id,
      title: list.title,
      ownerUserId: list.ownerUserId,
      myRole: my.role,
      memberCount,
      eventCount,
      createdAt: list.createdAt,
      updatedAt: list.updatedAt,
      members: memberRows.map((r) => ({ userId: r.userId, role: r.role })),
    };
  }

  async updateTitle(actorId: string, listId: string, title: string) {
    const list = await this.requireList(listId);
    await this.requireOwner(actorId, list);
    list.title = title.trim();
    await this.lists.save(list);
    return this.summaryForViewer(list, actorId);
  }

  async deleteList(actorId: string, listId: string): Promise<void> {
    const list = await this.requireList(listId);
    await this.requireOwner(actorId, list);
    await this.lists.remove(list);
  }

  async addMember(actorId: string, listId: string, userId: string, role: SharedEventListMemberRole) {
    const list = await this.requireList(listId);
    await this.requireOwner(actorId, list);
    if (userId === actorId) {
      throw new BadRequestException("Cannot add yourself as a member");
    }
    const friends = await this.friendships.areFriends(list.ownerUserId, userId);
    if (!friends) {
      throw new ForbiddenException("User must be a friend of the list owner");
    }
    const existing = await this.members.findOne({ where: { listId, userId } });
    if (existing) {
      throw new ConflictException("User is already a member");
    }
    await this.members.save(
      this.members.create({
        listId,
        userId,
        role,
      }),
    );
    return this.getDetail(actorId, listId);
  }

  async removeMember(actorId: string, listId: string, memberUserId: string) {
    const list = await this.requireList(listId);
    await this.requireOwner(actorId, list);
    if (memberUserId === list.ownerUserId) {
      throw new ForbiddenException("Cannot remove the owner from the list");
    }
    const row = await this.members.findOne({ where: { listId, userId: memberUserId } });
    if (!row) {
      throw new NotFoundException("Member not found");
    }
    await this.members.remove(row);
    return this.getDetail(actorId, listId);
  }

  async listEvents(actorId: string, listId: string) {
    await this.requireMembership(listId, actorId);
    const itemRows = await this.items.find({
      where: { listId },
      order: { addedAt: "ASC" },
    });
    const out: {
      id: string;
      title: string;
      slug: string;
      startsAt: Date;
      endsAt: Date;
      locationMode: string;
      locationLabel: string | null;
      addedAt: Date;
    }[] = [];
    for (const row of itemRows) {
      const ev = await this.eventRepo.findById(row.eventId);
      if (!ev || ev.status !== EventStatus.PUBLISHED) continue;
      out.push({
        id: ev.id,
        title: ev.title,
        slug: ev.slug,
        startsAt: ev.startsAt,
        endsAt: ev.endsAt,
        locationMode: ev.locationMode,
        locationLabel: ev.locationLabel,
        addedAt: row.addedAt,
      });
    }
    out.sort((a, b) => a.startsAt.getTime() - b.startsAt.getTime());
    return out;
  }

  async addEvent(actorId: string, listId: string, eventId: string) {
    await this.requireCanEditEvents(listId, actorId);
    const ev = await this.eventRepo.findById(eventId);
    if (!ev || ev.status !== EventStatus.PUBLISHED) {
      throw new NotFoundException("Published event not found");
    }
    const dup = await this.items.findOne({ where: { listId, eventId } });
    if (dup) {
      throw new ConflictException("Event already in list");
    }
    const row = this.items.create({
      id: this.ids.generate(),
      listId,
      eventId,
      addedByUserId: actorId,
    });
    await this.items.save(row);
    return row;
  }

  async removeEvent(actorId: string, listId: string, eventId: string): Promise<void> {
    await this.requireCanEditEvents(listId, actorId);
    const row = await this.items.findOne({ where: { listId, eventId } });
    if (!row) {
      throw new NotFoundException("Event not in list");
    }
    await this.items.remove(row);
  }

  private async requireList(listId: string): Promise<SharedEventListOrmEntity> {
    const list = await this.lists.findOne({ where: { id: listId } });
    if (!list) throw new NotFoundException("List not found");
    return list;
  }

  private async requireMembership(
    listId: string,
    userId: string,
  ): Promise<SharedEventListMemberOrmEntity> {
    const m = await this.members.findOne({ where: { listId, userId } });
    if (!m) throw new NotFoundException("List not found");
    return m;
  }

  private async requireOwner(actorId: string, list: SharedEventListOrmEntity): Promise<void> {
    if (list.ownerUserId !== actorId) {
      throw new ForbiddenException("Only the owner can perform this action");
    }
  }

  private async requireCanEditEvents(listId: string, actorId: string): Promise<void> {
    const m = await this.requireMembership(listId, actorId);
    if (m.role === SharedEventListMemberRole.VIEWER) {
      throw new ForbiddenException("Viewers cannot modify events in the list");
    }
  }

  private async summaryForViewer(
    list: SharedEventListOrmEntity,
    viewerId: string,
  ): Promise<SharedEventListSummary> {
    const my = await this.members.findOne({ where: { listId: list.id, userId: viewerId } });
    if (!my) {
      throw new NotFoundException("List not found");
    }
    const memberCount = await this.members.count({ where: { listId: list.id } });
    const eventCount = await this.items.count({ where: { listId: list.id } });
    return {
      id: list.id,
      title: list.title,
      ownerUserId: list.ownerUserId,
      myRole: my.role,
      memberCount,
      eventCount,
      createdAt: list.createdAt,
      updatedAt: list.updatedAt,
    };
  }
}
