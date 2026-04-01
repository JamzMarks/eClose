import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { ArtistOrmEntity } from "@/artist/infrastructure/persistence/artist.orm-entity";
import { Artist } from "../entity/artist.entity";
import { IArtistRepository } from "../interfaces/artist.repository.interface";
import { ArtistType } from "../types/artist.type";

@Injectable()
export class TypeormArtistRepository implements IArtistRepository {
  constructor(
    @InjectRepository(ArtistOrmEntity)
    private readonly repo: Repository<ArtistOrmEntity>,
  ) {}

  async save(artist: Artist): Promise<void> {
    await this.repo.save(this.toRow(artist));
  }

  async findById(id: string): Promise<Artist | null> {
    const row = await this.repo.findOne({ where: { id } });
    return row ? this.toDomain(row) : null;
  }

  async findBySlug(slug: string): Promise<Artist | null> {
    const s = slug.trim().toLowerCase();
    const row = await this.repo.findOne({ where: { slug: s } });
    return row ? this.toDomain(row) : null;
  }

  async listAll(): Promise<Artist[]> {
    const rows = await this.repo.find();
    return rows.map((r) => this.toDomain(r));
  }

  private toRow(a: Artist): ArtistOrmEntity {
    const row = new ArtistOrmEntity();
    row.id = a.id;
    row.name = a.name;
    row.slug = a.slug;
    row.type = a.type;
    row.ownerId = a.ownerId;
    row.headline = a.headline;
    row.bio = a.bio;
    row.websiteUrl = a.websiteUrl;
    row.marketplaceVisible = a.marketplaceVisible;
    row.openToVenueBookings = a.openToVenueBookings;
    row.taxonomyTermIds = [...a.taxonomyTermIds];
    row.primaryMediaAssetId = a.primaryMediaAssetId;
    row.createdAt = a.createdAt;
    row.isActive = a.isActive;
    return row;
  }

  private toDomain(row: ArtistOrmEntity): Artist {
    return Artist.hydrate({
      id: row.id,
      name: row.name,
      slug: row.slug,
      type: row.type as ArtistType,
      ownerId: row.ownerId,
      headline: row.headline,
      bio: row.bio,
      websiteUrl: row.websiteUrl,
      marketplaceVisible: row.marketplaceVisible,
      openToVenueBookings: row.openToVenueBookings,
      taxonomyTermIds: [...(row.taxonomyTermIds ?? [])],
      primaryMediaAssetId: row.primaryMediaAssetId,
      createdAt: row.createdAt,
      isActive: row.isActive,
    });
  }
}
