import { Body, Controller, Get, Inject, Param, Post, Query } from "@nestjs/common";
import { PrivateRoute } from "@/infrastructure/http/metadata/private-route.metadata";
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
  addVenueUnavailability(@Param("venueId") venueId: string, @Body() dto: AddUnavailabilityDto) {
    return this.calendar.addVenueUnavailability(
      venueId,
      new Date(dto.startsAt),
      new Date(dto.endsAt),
      dto.reason,
    );
  }
}
