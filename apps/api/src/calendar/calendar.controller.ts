import { Body, Controller, Get, Inject, Param, Post, Query, UseGuards } from "@nestjs/common";
import { PrivateRoute } from "@/infrastructure/http/metadata/private-route.metadata";
import { CalendarArtistOwnerHttpGuard } from "@/authorization/interface/http/guards/calendar-artist-owner.http.guard";
import { CalendarVenueOwnerHttpGuard } from "@/authorization/interface/http/guards/calendar-venue-owner.http.guard";
import { AddUnavailabilityDto } from "./dto/add-unavailability.dto";
import { ICalendarService } from "./interfaces/calendar.service.interface";
import { CALENDAR_SERVICE } from "./tokens/calendar.tokens";

@Controller("calendar")
export class CalendarController {
  constructor(
    @Inject(CALENDAR_SERVICE)
    private readonly calendar: ICalendarService,
  ) {}

  @Get("artists/:artistId/schedule")
  artistSchedule(
    @Param("artistId") artistId: string,
    @Query("from") from: string,
    @Query("to") to: string,
  ) {
    return this.calendar.getArtistPublicSchedule(artistId, { fromIso: from, toIso: to });
  }

  @Get("artists/:artistId/suggest-slots")
  suggestSlots(
    @Param("artistId") artistId: string,
    @Query("from") from: string,
    @Query("to") to: string,
    @Query("durationMinutes") durationMinutes?: string,
    @Query("stepMinutes") stepMinutes?: string,
    @Query("venueId") venueId?: string,
    @Query("externalCalendarOwnerRef") externalCalendarOwnerRef?: string,
  ) {
    return this.calendar.suggestFreeSlots(artistId, {
      fromIso: from,
      toIso: to,
      durationMinutes: durationMinutes ? Number(durationMinutes) : undefined,
      stepMinutes: stepMinutes ? Number(stepMinutes) : undefined,
      venueId: venueId ?? null,
      externalCalendarOwnerRef: externalCalendarOwnerRef ?? null,
    });
  }

  @Get("venues/:venueId/schedule")
  venueSchedule(
    @Param("venueId") venueId: string,
    @Query("from") from: string,
    @Query("to") to: string,
  ) {
    return this.calendar.getVenueSchedule(venueId, { fromIso: from, toIso: to });
  }

  @Post("artists/:artistId/unavailabilities")
  @PrivateRoute()
  @UseGuards(CalendarArtistOwnerHttpGuard)
  addArtistUnavailability(@Param("artistId") artistId: string, @Body() dto: AddUnavailabilityDto) {
    return this.calendar.addArtistUnavailability(
      artistId,
      new Date(dto.startsAt),
      new Date(dto.endsAt),
      dto.reason,
    );
  }

  @Post("venues/:venueId/unavailabilities")
  @PrivateRoute()
  @UseGuards(CalendarVenueOwnerHttpGuard)
  addVenueUnavailability(@Param("venueId") venueId: string, @Body() dto: AddUnavailabilityDto) {
    return this.calendar.addVenueUnavailability(
      venueId,
      new Date(dto.startsAt),
      new Date(dto.endsAt),
      dto.reason,
    );
  }
}
