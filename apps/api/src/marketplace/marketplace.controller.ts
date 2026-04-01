import { Controller, Get, Inject, Query } from "@nestjs/common";
import { IMarketplaceService } from "./interfaces/marketplace.service.interface";
import { MARKETPLACE_SERVICE } from "./tokens/marketplace.tokens";

@Controller("marketplace")
export class MarketplaceController {
  constructor(
    @Inject(MARKETPLACE_SERVICE)
    private readonly marketplace: IMarketplaceService,
  ) {}

  /** Venues (e curadores) exploram artistas com perfil público no marketplace */
  @Get("artists")
  listArtists(
    @Query("q") q?: string,
    @Query("taxonomyTermIds") taxonomyTermIdsRaw?: string,
    @Query("acceptingBookingsOnly") acceptingBookingsOnly?: string,
  ) {
    const taxonomyTermIds = taxonomyTermIdsRaw
      ? taxonomyTermIdsRaw.split(",").map((s) => s.trim()).filter(Boolean)
      : undefined;
    return this.marketplace.listArtistsForVenues({
      q,
      taxonomyTermIds,
      acceptingBookingsOnly: acceptingBookingsOnly === "true",
    });
  }

  /** Artistas exploram espaços que optaram por aparecer no marketplace */
  @Get("venues")
  listVenues(
    @Query("city") city?: string,
    @Query("region") region?: string,
    @Query("taxonomyTermIds") taxonomyTermIdsRaw?: string,
    @Query("openToInquiriesOnly") openToInquiriesOnly?: string,
  ) {
    const taxonomyTermIds = taxonomyTermIdsRaw
      ? taxonomyTermIdsRaw.split(",").map((s) => s.trim()).filter(Boolean)
      : undefined;
    return this.marketplace.listVenuesForArtists({
      city,
      region,
      taxonomyTermIds,
      openToInquiriesOnly: openToInquiriesOnly === "true",
    });
  }
}
