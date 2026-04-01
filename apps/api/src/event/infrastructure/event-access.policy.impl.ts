import { Inject, Injectable } from "@nestjs/common";
import { AccessDeniedError } from "@/domain/errors/access-denied.error";
import { ResourceNotFoundError } from "@/domain/errors/resource-not-found.error";
import { IArtistRepository } from "@/artist/interfaces/artist.repository.interface";
import { ARTIST_REPOSITORY } from "@/artist/tokens/artist.tokens";
import { IEventRepository } from "../interfaces/event.repository.interface";
import { EVENT_REPOSITORY } from "../tokens/event.tokens";
import { EventAccessPolicyPort } from "../application/ports/event-access.policy.port";

@Injectable()
export class EventAccessPolicyImpl implements EventAccessPolicyPort {
  constructor(
    @Inject(EVENT_REPOSITORY)
    private readonly events: IEventRepository,
    @Inject(ARTIST_REPOSITORY)
    private readonly artists: IArtistRepository,
  ) {}

  async ensureOrganizerArtistBelongsToActor(
    actorUserId: string,
    organizerArtistId: string,
  ): Promise<void> {
    const artist = await this.artists.findById(organizerArtistId);
    if (!artist) {
      throw new ResourceNotFoundError("Artista organizador não encontrado");
    }
    if (artist.ownerId !== actorUserId) {
      throw new AccessDeniedError("organizerArtistId deve ser um artista do utilizador autenticado");
    }
  }

  async ensureActorManagesEvent(actorUserId: string, eventId: string): Promise<void> {
    const ev = await this.events.findById(eventId);
    if (!ev) {
      throw new ResourceNotFoundError("Evento não encontrado");
    }
    const artist = await this.artists.findById(ev.organizerArtistId);
    if (!artist || artist.ownerId !== actorUserId) {
      throw new AccessDeniedError("Apenas o organizador pode alterar este evento");
    }
  }
}
