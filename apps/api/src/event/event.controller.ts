import {
  Body,
  Controller,
  Get,
  Inject,
  NotFoundException,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from "@nestjs/common";
import { PrivateRoute } from "@/infrastructure/http/metadata/private-route.metadata";
import { EventOrganizerBodyHttpGuard } from "@/infrastructure/http/guards/event-organizer-body.http.guard";
import { EventResourceOrganizerHttpGuard } from "@/infrastructure/http/guards/event-resource-organizer.http.guard";
import { CreateEventDto } from "./dto/create-event.dto";
import { ListPublishedEventsQueryDto } from "./dto/list-published-events.query";
import { LinkPrimaryMediaDto } from "./dto/link-primary-media.dto";
import { IEventService } from "./interfaces/event.service.interface";
import { EVENT_SERVICE } from "./tokens/event.tokens";

@Controller("events")
export class EventController {
  constructor(
    @Inject(EVENT_SERVICE)
    private readonly events: IEventService,
  ) {}

  @Post()
  @PrivateRoute()
  @UseGuards(EventOrganizerBodyHttpGuard)
  create(@Body() dto: CreateEventDto) {
    return this.events.create(dto);
  }

  @Get()
  listPublished(@Query() query: ListPublishedEventsQueryDto) {
    const taxonomyTermIds = query.taxonomyTermIds
      ? query.taxonomyTermIds.split(",").map((s) => s.trim()).filter(Boolean)
      : undefined;
    return this.events.listPublishedPublic({
      from: query.from ? new Date(query.from) : undefined,
      to: query.to ? new Date(query.to) : undefined,
      taxonomyTermIds,
      venueId: query.venueId,
      city: query.city,
      q: query.q,
      page: query.page,
      limit: query.limit,
      sortBy: query.sortBy,
      order: query.order,
    });
  }

  /** Rascunhos e detalhe completo para quem gere o evento (organizador). GET público continua só publicados. */
  @Get(":id/organizer")
  @PrivateRoute()
  @UseGuards(EventResourceOrganizerHttpGuard)
  async getOrganizerView(@Param("id") id: string) {
    const e = await this.events.getById(id);
    if (!e) throw new NotFoundException("Evento não encontrado");
    return e;
  }

  @Get(":id")
  async getOne(@Param("id") id: string) {
    const e = await this.events.getPublicById(id);
    if (!e) throw new NotFoundException("Evento não encontrado");
    return e;
  }

  @Patch(":id/primary-media")
  @PrivateRoute()
  @UseGuards(EventResourceOrganizerHttpGuard)
  linkPrimary(@Param("id") id: string, @Body() body: LinkPrimaryMediaDto) {
    return this.events.linkPrimaryMedia(id, body.mediaAssetId);
  }
}
