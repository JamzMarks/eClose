import {
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { ID_GENERATOR, IdGenerator } from "@/shared/contracts/id-generator";
import { ITaxonomyService } from "@/taxonomy/interfaces/taxonomy.service.interface";
import { TAXONOMY_SERVICE } from "@/taxonomy/tokens/taxonomy.tokens";
import { TaxonomyKind } from "@/taxonomy/types/taxonomy-kind.type";
import { Venue } from "@/venue/entity/venue.entity";
import { IVenueMediaPort } from "@/venue/interfaces/venue-media.port.interface";
import { VENUE_MEDIA_PORT } from "@/venue/tokens/venue-media.tokens";
import { CreateVenueDto } from "@/venue/dto/create-venue.dto";
import { IVenueRepository } from "@/venue/interfaces/venue.repository.interface";
import { IVenueService } from "@/venue/interfaces/venue.service.interface";
import { VENUE_REPOSITORY } from "@/venue/tokens/venue.tokens";

@Injectable()
export class VenueService implements IVenueService {
  constructor(
    @Inject(ID_GENERATOR) private readonly ids: IdGenerator,
    @Inject(VENUE_REPOSITORY) private readonly venues: IVenueRepository,
    @Inject(TAXONOMY_SERVICE) private readonly taxonomy: ITaxonomyService,
    @Inject(VENUE_MEDIA_PORT) private readonly venueMedia: IVenueMediaPort,
  ) {}

  async create(dto: CreateVenueDto): Promise<Venue> {
    const existing = await this.venues.findBySlug(dto.slug);
    if (existing) throw new ConflictException("Slug de venue já em uso");

    const termIds = dto.taxonomyTermIds ?? [];
    await this.taxonomy.assertTermsValid(termIds, [
      TaxonomyKind.VENUE_TYPE,
      TaxonomyKind.VENUE_AMENITY,
      TaxonomyKind.INTEREST,
    ]);

    const venue = Venue.register({
      id: this.ids.generate(),
      name: dto.name,
      slug: dto.slug,
      description: dto.description ?? null,
      ownerUserId: dto.ownerUserId ?? null,
      address: { ...dto.address },
      geoLat: dto.geoLat ?? null,
      geoLng: dto.geoLng ?? null,
      timezone: dto.timezone,
      openingHours: dto.openingHours.map((s) => ({
        weekday: s.weekday,
        openLocal: s.openLocal,
        closeLocal: s.closeLocal,
        closesNextDay: s.closesNextDay,
      })),
      taxonomyTermIds: termIds,
      marketplaceListed: dto.marketplaceListed ?? false,
      openToArtistInquiries: dto.openToArtistInquiries ?? false,
    });

    await this.venues.save(venue);
    return venue;
  }

  async getById(id: string): Promise<Venue | null> {
    return this.venues.findById(id);
  }

  async listActive(): Promise<Venue[]> {
    return this.venues.listActive();
  }

  async linkPrimaryMedia(venueId: string, mediaAssetId: string): Promise<Venue> {
    const venue = await this.venues.findById(venueId);
    if (!venue) throw new NotFoundException("Venue não encontrado");

    await this.venueMedia.assertAndSetPrimary(venueId, mediaAssetId);

    venue.setPrimaryMediaAssetId(mediaAssetId);
    await this.venues.save(venue);
    return venue;
  }
}
