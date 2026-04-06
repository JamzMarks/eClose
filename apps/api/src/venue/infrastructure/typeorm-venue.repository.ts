import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { VenueOrmEntity } from "@/venue/infrastructure/persistence/venue.orm-entity";
import { Venue, VenueAddress } from "@/venue/domain/entity/venue.entity";
import { IVenueRepository } from "@/venue/application/ports/venue.repository.interface";
import { VenueOpeningSlot } from "@/venue/domain/types/venue-opening-slot.type";
import type { VenueVerificationStatus } from "@/venue/domain/types/venue-verification-status.type";

@Injectable()
export class TypeormVenueRepository implements IVenueRepository {
  constructor(
    @InjectRepository(VenueOrmEntity)
    private readonly repo: Repository<VenueOrmEntity>,
  ) {}

  async save(venue: Venue): Promise<void> {
    await this.repo.save(this.toRow(venue));
  }

  async findById(id: string): Promise<Venue | null> {
    const row = await this.repo.findOne({ where: { id } });
    return row ? this.toDomain(row) : null;
  }

  async findBySlug(slug: string): Promise<Venue | null> {
    const s = slug.trim().toLowerCase();
    const row = await this.repo.findOne({ where: { slug: s } });
    return row ? this.toDomain(row) : null;
  }

  async listActive(): Promise<Venue[]> {
    const rows = await this.repo.find({ where: { isActive: true } });
    return rows.map((r) => this.toDomain(r));
  }

  async listMarketplaceListedActive(): Promise<Venue[]> {
    const rows = await this.repo.find({
      where: { isActive: true, marketplaceListed: true },
    });
    return rows.map((r) => this.toDomain(r));
  }

  async findMarketplaceListedById(id: string): Promise<Venue | null> {
    const row = await this.repo.findOne({
      where: { id, isActive: true, marketplaceListed: true },
    });
    return row ? this.toDomain(row) : null;
  }

  private toRow(v: Venue): VenueOrmEntity {
    const row = new VenueOrmEntity();
    row.id = v.id;
    row.name = v.name;
    row.slug = v.slug;
    row.description = v.description;
    row.ownerUserId = v.ownerUserId;
    row.address = { ...v.address } as Record<string, unknown>;
    row.geoLat = v.geoLat;
    row.geoLng = v.geoLng;
    row.timezone = v.timezone;
    row.openingHours = v.openingHours.map((s) => ({ ...s }));
    row.taxonomyTermIds = [...v.taxonomyTermIds];
    row.marketplaceListed = v.marketplaceListed;
    row.openToArtistInquiries = v.openToArtistInquiries;
    row.primaryMediaAssetId = v.primaryMediaAssetId;
    row.isActive = v.isActive;
    row.verificationStatus = v.verificationStatus;
    row.cnpj = v.cnpj;
    row.verificationCnpjDocMediaAssetId = v.verificationCnpjDocMediaAssetId;
    row.verificationAddressProofMediaAssetId = v.verificationAddressProofMediaAssetId;
    row.registrySnapshotHash = v.registrySnapshotHash;
    row.registryCheckedAt = v.registryCheckedAt;
    row.verificationRejectionReason = v.verificationRejectionReason;
    row.createdAt = v.createdAt;
    row.updatedAt = v.updatedAt;
    return row;
  }

  private toDomain(row: VenueOrmEntity): Venue {
    const verificationStatus = (row.verificationStatus ?? "none") as VenueVerificationStatus;
    const isVerifiedL2 = verificationStatus === "verified_l2";
    return Venue.hydrate({
      id: row.id,
      name: row.name,
      slug: row.slug,
      description: row.description,
      ownerUserId: row.ownerUserId,
      address: row.address as unknown as VenueAddress,
      geoLat: row.geoLat,
      geoLng: row.geoLng,
      timezone: row.timezone,
      openingHours: (row.openingHours ?? []) as VenueOpeningSlot[],
      taxonomyTermIds: [...(row.taxonomyTermIds ?? [])],
      marketplaceListed: row.marketplaceListed,
      openToArtistInquiries: row.openToArtistInquiries,
      primaryMediaAssetId: row.primaryMediaAssetId,
      isActive: row.isActive,
      verificationStatus,
      cnpj: row.cnpj ?? null,
      verificationCnpjDocMediaAssetId: row.verificationCnpjDocMediaAssetId ?? null,
      verificationAddressProofMediaAssetId: row.verificationAddressProofMediaAssetId ?? null,
      registrySnapshotHash: row.registrySnapshotHash ?? null,
      registryCheckedAt: row.registryCheckedAt ?? null,
      verificationRejectionReason: row.verificationRejectionReason ?? null,
      isVerifiedL2,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
    });
  }
}
