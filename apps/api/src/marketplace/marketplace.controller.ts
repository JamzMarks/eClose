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
    @Query("page") page?: string,
    @Query("limit") limit?: string,
    @Query("sortBy") sortBy?: "name" | "slug",
    @Query("order") order?: "ASC" | "DESC",
  ) {
    const taxonomyTermIds = taxonomyTermIdsRaw
      ? taxonomyTermIdsRaw.split(",").map((s) => s.trim()).filter(Boolean)
      : undefined;
    return this.marketplace.listArtistsForVenues({
      q,
      taxonomyTermIds,
      acceptingBookingsOnly: acceptingBookingsOnly === "true",
      page: page ? Number(page) : undefined,
      limit: limit ? Number(limit) : undefined,
      sortBy: sortBy === "slug" ? "slug" : "name",
      order: order === "DESC" ? "DESC" : "ASC",
    });
  }

  /** Artistas exploram espaços que optaram por aparecer no marketplace */
  @Get("venues")
  listVenues(
    @Query("city") city?: string,
    @Query("region") region?: string,
    @Query("taxonomyTermIds") taxonomyTermIdsRaw?: string,
    @Query("openToInquiriesOnly") openToInquiriesOnly?: string,
    @Query("page") page?: string,
    @Query("limit") limit?: string,
    @Query("sortBy") sortBy?: "name" | "city",
    @Query("order") order?: "ASC" | "DESC",
  ) {
    const taxonomyTermIds = taxonomyTermIdsRaw
      ? taxonomyTermIdsRaw.split(",").map((s) => s.trim()).filter(Boolean)
      : undefined;
    return this.marketplace.listVenuesForArtists({
      city,
      region,
      taxonomyTermIds,
      openToInquiriesOnly: openToInquiriesOnly === "true",
      page: page ? Number(page) : undefined,
      limit: limit ? Number(limit) : undefined,
      sortBy: sortBy === "city" ? "city" : "name",
      order: order === "DESC" ? "DESC" : "ASC",
    });
  }
}
