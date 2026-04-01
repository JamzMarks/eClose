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
import { Artist } from "@/artist/entity/artist.entity";
import { IArtistMediaPort } from "@/artist/interfaces/artist-media.port.interface";
import { ARTIST_MEDIA_PORT } from "@/artist/tokens/artist-media.tokens";
import { CreateArtistDto } from "@/artist/dto/create-artist.dto";
import { IArtistRepository } from "@/artist/interfaces/artist.repository.interface";
import { IArtistService } from "@/artist/interfaces/artist.service.interface";
import { ARTIST_REPOSITORY } from "@/artist/tokens/artist.tokens";

@Injectable()
export class ArtistService implements IArtistService {
  constructor(
    @Inject(ID_GENERATOR) private readonly ids: IdGenerator,
    @Inject(ARTIST_REPOSITORY) private readonly artists: IArtistRepository,
    @Inject(TAXONOMY_SERVICE) private readonly taxonomy: ITaxonomyService,
    @Inject(ARTIST_MEDIA_PORT) private readonly artistMedia: IArtistMediaPort,
  ) {}

  async create(dto: CreateArtistDto): Promise<Artist> {
    const slugTaken = await this.artists.findBySlug(dto.slug);
    if (slugTaken) throw new ConflictException("Slug de artista já em uso");

    const termIds = dto.taxonomyTermIds ?? [];
    await this.taxonomy.assertTermsValid(termIds, [TaxonomyKind.GENRE, TaxonomyKind.INTEREST]);

    const artist = Artist.register({
      id: this.ids.generate(),
      name: dto.name,
      slug: dto.slug,
      type: dto.type,
      ownerId: dto.ownerId,
      headline: dto.headline ?? null,
      bio: dto.bio ?? null,
      websiteUrl: dto.websiteUrl ?? null,
      marketplaceVisible: dto.marketplaceVisible ?? false,
      openToVenueBookings: dto.openToVenueBookings ?? false,
      taxonomyTermIds: termIds,
    });

    await this.artists.save(artist);
    return artist;
  }

  async getById(id: string): Promise<Artist | null> {
    return this.artists.findById(id);
  }

  async linkPrimaryMedia(artistId: string, mediaAssetId: string): Promise<Artist> {
    const artist = await this.artists.findById(artistId);
    if (!artist) throw new NotFoundException("Artista não encontrado");

    await this.artistMedia.assertAndSetPrimary(artistId, mediaAssetId);

    artist.setPrimaryMediaAssetId(mediaAssetId);
    await this.artists.save(artist);
    return artist;
  }
}
