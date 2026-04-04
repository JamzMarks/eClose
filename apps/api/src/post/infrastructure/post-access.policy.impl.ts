import { ForbiddenException, Inject, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { UserOrmEntity } from "@/user/infrastructure/persistence/user.orm-entity";
import { IEventRepository } from "@/event/application/ports/event.repository.interface";
import { EVENT_REPOSITORY } from "@/event/application/tokens/event.tokens";
import { IVenueRepository } from "@/venue/application/ports/venue.repository.interface";
import { VENUE_REPOSITORY } from "@/venue/application/tokens/venue.tokens";
import { IArtistRepository } from "@/artist/interfaces/artist.repository.interface";
import { ARTIST_REPOSITORY } from "@/artist/tokens/artist.tokens";
import { EventStatus } from "@/event/domain/types/event-status.type";
import { PostScopeType } from "@/post/domain/post-scope.type";
import { PostOrmEntity } from "@/post/infrastructure/persistence/post.orm-entity";
import { IPostAccessPolicy } from "@/post/application/ports/post-access.policy.port";
import {
  FRIENDSHIP_REPOSITORY,
  IFriendshipRepository,
} from "@/friendship/application/ports/friendship.repository.port";
import {
  USER_BLOCK_REPOSITORY,
  IUserBlockRepository,
} from "@/friendship/application/ports/user-block.repository.port";

@Injectable()
export class PostAccessPolicyImpl implements IPostAccessPolicy {
  constructor(
    @InjectRepository(UserOrmEntity)
    private readonly users: Repository<UserOrmEntity>,
    @Inject(EVENT_REPOSITORY)
    private readonly events: IEventRepository,
    @Inject(VENUE_REPOSITORY)
    private readonly venues: IVenueRepository,
    @Inject(ARTIST_REPOSITORY)
    private readonly artists: IArtistRepository,
    @Inject(FRIENDSHIP_REPOSITORY)
    private readonly friendships: IFriendshipRepository,
    @Inject(USER_BLOCK_REPOSITORY)
    private readonly blocks: IUserBlockRepository,
  ) {}

  async assertCanCreatePost(
    actorUserId: string,
    scopeType: PostScopeType,
    scopeId: string | null,
  ): Promise<void> {
    if (scopeType === PostScopeType.GLOBAL_FEED) {
      return;
    }
    if (!scopeId) {
      throw new NotFoundException("Âncora inválida");
    }

    switch (scopeType) {
      case PostScopeType.PROFILE: {
        const profileOwner = await this.users.findOne({ where: { id: scopeId } });
        if (!profileOwner) throw new NotFoundException("Perfil não encontrado");
        if (await this.blocks.existsBetween(actorUserId, scopeId)) {
          throw new ForbiddenException("Bloqueio impede publicar neste perfil");
        }
        if (actorUserId === scopeId) return;
        const friends = await this.friendships.areFriends(actorUserId, scopeId);
        if (!friends) {
          throw new ForbiddenException("Só o dono do mural ou amigos podem publicar aqui");
        }
        return;
      }
      case PostScopeType.VENUE: {
        const venue = await this.venues.findById(scopeId);
        if (!venue) throw new NotFoundException("Venue não encontrado");
        if (venue.ownerUserId && (await this.blocks.existsBetween(actorUserId, venue.ownerUserId))) {
          throw new ForbiddenException("Bloqueio impede publicar neste venue");
        }
        return;
      }
      case PostScopeType.EVENT: {
        const ev = await this.events.findById(scopeId);
        if (!ev) throw new NotFoundException("Evento não encontrado");
        const organizer = await this.artists.findById(ev.organizerArtistId);
        if (!organizer) throw new NotFoundException("Organizador não encontrado");
        if (ev.status === EventStatus.DRAFT) {
          if (organizer.ownerId !== actorUserId) {
            throw new ForbiddenException("Só o organizador pode publicar em evento rascunho");
          }
          return;
        }
        if (ev.status !== EventStatus.PUBLISHED) {
          throw new ForbiddenException("Evento não aceita novos posts neste estado");
        }
        if (await this.blocks.existsBetween(actorUserId, organizer.ownerId)) {
          throw new ForbiddenException("Bloqueio impede publicar neste evento");
        }
        return;
      }
      default:
        throw new ForbiddenException("Tipo de âncora inválido");
    }
  }

  async assertCanListPosts(
    actorUserId: string,
    scopeType: PostScopeType,
    scopeId: string | null,
  ): Promise<void> {
    if (scopeType === PostScopeType.GLOBAL_FEED) {
      return;
    }
    if (!scopeId) {
      throw new NotFoundException("Âncora inválida");
    }

    if (scopeType === PostScopeType.EVENT) {
      const ev = await this.events.findById(scopeId);
      if (!ev) throw new NotFoundException("Evento não encontrado");
      if (ev.status === EventStatus.DRAFT) {
        const organizer = await this.artists.findById(ev.organizerArtistId);
        if (!organizer || organizer.ownerId !== actorUserId) {
          throw new ForbiddenException("Rascunho: só o organizador vê os posts");
        }
      }
      return;
    }

    if (scopeType === PostScopeType.PROFILE) {
      const u = await this.users.findOne({ where: { id: scopeId } });
      if (!u) throw new NotFoundException("Perfil não encontrado");
      return;
    }

    if (scopeType === PostScopeType.VENUE) {
      const v = await this.venues.findById(scopeId);
      if (!v) throw new NotFoundException("Venue não encontrado");
      return;
    }
  }

  async assertCanDeletePost(actorUserId: string, post: PostOrmEntity): Promise<void> {
    if (post.authorUserId === actorUserId) {
      return;
    }

    const st = post.scopeType as PostScopeType;
    const sid = post.scopeId;

    if (st === PostScopeType.PROFILE && sid) {
      if (sid === actorUserId) return;
      throw new ForbiddenException("Apenas o autor ou o dono do mural podem apagar");
    }

    if (st === PostScopeType.VENUE && sid) {
      const venue = await this.venues.findById(sid);
      if (venue?.ownerUserId === actorUserId) return;
      throw new ForbiddenException("Apenas o autor ou o dono do venue podem apagar");
    }

    if (st === PostScopeType.EVENT && sid) {
      const ev = await this.events.findById(sid);
      if (!ev) throw new NotFoundException("Evento não encontrado");
      const organizer = await this.artists.findById(ev.organizerArtistId);
      if (organizer?.ownerId === actorUserId) return;
      throw new ForbiddenException("Apenas o autor ou o organizador podem apagar");
    }

    if (st === PostScopeType.GLOBAL_FEED) {
      throw new ForbiddenException("Apenas o autor pode apagar posts do feed global");
    }

    throw new ForbiddenException("Sem permissão para apagar");
  }
}
