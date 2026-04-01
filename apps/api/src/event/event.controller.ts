import {
  Body,
  Controller,
  Get,
  Inject,
  NotFoundException,
  Param,
  Patch,
  Post,
  UseGuards,
} from "@nestjs/common";
import { PrivateRoute } from "@/infrastructure/http/metadata/private-route.metadata";
import { EventOrganizerBodyHttpGuard } from "@/infrastructure/http/guards/event-organizer-body.http.guard";
import { EventResourceOrganizerHttpGuard } from "@/infrastructure/http/guards/event-resource-organizer.http.guard";
import { CreateEventDto } from "./dto/create-event.dto";
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

  @Get(":id")
  async getOne(@Param("id") id: string) {
    const e = await this.events.getById(id);
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
