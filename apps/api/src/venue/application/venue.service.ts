import {
  BadRequestException,
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { ID_GENERATOR, IdGenerator } from "@/shared/contracts/id-generator";
import { hashBrazilianVenueTrustRegistryEvidence } from "@/shared/domain/br/hash-brazilian-venue-trust-registry-evidence";
import { AuditLogService } from "@/infrastructure/audit/audit-log.service";
import { AUDIT_LOG_SERVICE } from "@/infrastructure/audit/audit.tokens";
import {
  isValidBrazilianCnpjDigits,
  normalizeBrazilianCnpj,
} from "@/shared/domain/br/cnpj";
import type { IBrazilianVenueTrustDataPort } from "@/shared/application/ports/brazilian-venue-trust-data.port";
import { BRAZILIAN_VENUE_TRUST_DATA_PORT } from "@/shared/application/ports/brazilian-venue-trust-data.port";
import {
  normalizeBrazilianCepDigits,
  normalizeCityForCompare,
  normalizeUf,
} from "@/shared/domain/br/address-normalization";
import { IMediaService } from "@/media/interfaces/media.service.interface";
import { MEDIA_SERVICE } from "@/media/tokens/media.tokens";
import { MediaKind } from "@/media/types/media-kind.type";
import { MediaParentType } from "@/media/types/media-parent-type.type";
import { ITaxonomyService } from "@/taxonomy/interfaces/taxonomy.service.interface";
import { TAXONOMY_SERVICE } from "@/taxonomy/tokens/taxonomy.tokens";
import { TaxonomyKind } from "@/taxonomy/types/taxonomy-kind.type";
import { Venue } from "@/venue/domain/entity/venue.entity";
import { IVenueMediaPort } from "@/venue/application/ports/venue-media.port.interface";
import { VENUE_MEDIA_PORT } from "@/venue/application/tokens/venue-media.tokens";
import { CreateVenueDto } from "@/venue/interface/http/dto/create-venue.dto";
import { SubmitVenueTrustVerificationDto } from "@/venue/interface/http/dto/submit-venue-trust-verification.dto";
import { IVenueRepository } from "@/venue/application/ports/venue.repository.interface";
import { IVenueService } from "@/venue/application/ports/venue.service.interface";
import type { VenueTrustReviewDecision } from "@/venue/application/ports/venue.service.interface";
import { VENUE_REPOSITORY } from "@/venue/application/tokens/venue.tokens";
import { VenueVerificationHistoryOrmEntity } from "@/venue/infrastructure/persistence/venue-verification-history.orm-entity";

@Injectable()
export class VenueService implements IVenueService {
  constructor(
    @Inject(ID_GENERATOR) private readonly ids: IdGenerator,
    @Inject(VENUE_REPOSITORY) private readonly venues: IVenueRepository,
    @Inject(TAXONOMY_SERVICE) private readonly taxonomy: ITaxonomyService,
    @Inject(VENUE_MEDIA_PORT) private readonly venueMedia: IVenueMediaPort,
    @Inject(MEDIA_SERVICE) private readonly media: IMediaService,
    @Inject(BRAZILIAN_VENUE_TRUST_DATA_PORT)
    private readonly brazilianTrustData: IBrazilianVenueTrustDataPort,
    @InjectRepository(VenueVerificationHistoryOrmEntity)
    private readonly verificationHistory: Repository<VenueVerificationHistoryOrmEntity>,
    @Inject(AUDIT_LOG_SERVICE)
    private readonly auditLog: AuditLogService,
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

  async getPublicById(id: string): Promise<Venue | null> {
    return this.venues.findMarketplaceListedById(id);
  }

  async listPublicMarketplace(): Promise<Venue[]> {
    return this.venues.listMarketplaceListedActive();
  }

  async linkPrimaryMedia(venueId: string, mediaAssetId: string): Promise<Venue> {
    const venue = await this.venues.findById(venueId);
    if (!venue) throw new NotFoundException("Venue não encontrado");

    await this.venueMedia.assertAndSetPrimary(venueId, mediaAssetId);

    venue.setPrimaryMediaAssetId(mediaAssetId);
    await this.venues.save(venue);
    return venue;
  }

  async submitTrustVerification(
    venueId: string,
    dto: SubmitVenueTrustVerificationDto,
    actorUserId: string | null,
  ): Promise<Venue> {
    const venue = await this.venues.findById(venueId);
    if (!venue) throw new NotFoundException("Venue não encontrado");

    if (
      venue.verificationStatus === "pending_review" ||
      venue.verificationStatus === "verified_l2"
    ) {
      throw new BadRequestException(
        "Este venue já tem verificação em análise ou foi verificado; não é possível reenviar por este fluxo.",
      );
    }

    const cnpj = normalizeBrazilianCnpj(dto.cnpj);
    if (!isValidBrazilianCnpjDigits(cnpj)) {
      throw new BadRequestException("CNPJ inválido");
    }

    const fromStatus = venue.verificationStatus;
    const registryHash = await this.assertVenueTrustAgainstBrazilianRegistries(venue, cnpj);
    const checkedAt = new Date();

    if (dto.cnpjDocumentMediaAssetId === dto.addressProofMediaAssetId) {
      throw new BadRequestException("Os dois anexos devem ser ficheiros distintos");
    }

    await this.media.assertBelongsTo(
      dto.cnpjDocumentMediaAssetId,
      MediaParentType.VENUE,
      venueId,
    );
    await this.media.assertBelongsTo(
      dto.addressProofMediaAssetId,
      MediaParentType.VENUE,
      venueId,
    );

    const docA = await this.media.findById(dto.cnpjDocumentMediaAssetId);
    const docB = await this.media.findById(dto.addressProofMediaAssetId);
    if (!docA || !docB) throw new BadRequestException("Mídia não encontrada");

    const allowedKinds = new Set([MediaKind.IMAGE, MediaKind.DOCUMENT]);
    if (!allowedKinds.has(docA.kind) || !allowedKinds.has(docB.kind)) {
      throw new BadRequestException("Anexos devem ser imagem ou documento (PDF)");
    }

    venue.cnpj = cnpj;
    venue.verificationCnpjDocMediaAssetId = dto.cnpjDocumentMediaAssetId;
    venue.verificationAddressProofMediaAssetId = dto.addressProofMediaAssetId;
    venue.verificationStatus = "pending_review";
    venue.isVerifiedL2 = false;
    venue.registrySnapshotHash = registryHash;
    venue.registryCheckedAt = checkedAt;
    venue.verificationRejectionReason = null;
    venue.updatedAt = new Date();
    await this.venues.save(venue);

    await this.appendVerificationHistory({
      venueId,
      eventKind: "trust_submission",
      fromStatus,
      toStatus: "pending_review",
      registrySnapshotHash: registryHash,
      rejectionReason: null,
    });

    await this.auditLog.record({
      actorType: actorUserId ? "user" : "system",
      actorId: actorUserId,
      action: "venue.trust_verification_submitted",
      resourceType: "venue",
      resourceId: venueId,
      payload: {
        toStatus: "pending_review",
        registrySnapshotHash: registryHash,
      },
    });

    return venue;
  }

  /**
   * Usa {@link IBrazilianVenueTrustDataPort}: o domínio não conhece HTTP nem formato do fornecedor.
   */
  private async assertVenueTrustAgainstBrazilianRegistries(
    venue: Venue,
    cnpj14: string,
  ): Promise<string> {
    const country = (venue.address.countryCode ?? "").trim().toUpperCase();
    if (country !== "BR") {
      throw new BadRequestException(
        "A verificação com CNPJ (Receita Federal) só é suportada para espaços com país BR no endereço.",
      );
    }

    const venueCep = normalizeBrazilianCepDigits(venue.address.postalCode);
    if (!venueCep) {
      throw new BadRequestException(
        "Informa um CEP brasileiro válido (8 dígitos) no endereço do espaço antes de enviar a verificação.",
      );
    }

    const postalLoc = await this.brazilianTrustData.lookupLocationByPostalCode(venueCep);
    if (postalLoc.uf !== normalizeUf(venue.address.region)) {
      throw new BadRequestException(
        "A UF do espaço não confere com o CEP consultado no cadastro postal.",
      );
    }
    if (postalLoc.cityComparable !== normalizeCityForCompare(venue.address.city)) {
      throw new BadRequestException(
        "A cidade do espaço não confere com o CEP consultado no cadastro postal.",
      );
    }

    const company = await this.brazilianTrustData.lookupCompanyByCnpj(cnpj14);
    if (!company.isActiveRegistration) {
      throw new BadRequestException(
        `O CNPJ não está ativo nos registos consultados (situação: ${company.cadastralSituationLabel ?? "desconhecida"}).`,
      );
    }

    if (!company.registeredPostalCodeDigits) {
      throw new BadRequestException(
        "A consulta do CNPJ não devolveu CEP cadastral; não é possível validar o endereço.",
      );
    }
    if (company.registeredPostalCodeDigits !== venueCep) {
      throw new BadRequestException(
        "O CEP do espaço não coincide com o CEP do endereço cadastrado na Receita Federal para este CNPJ.",
      );
    }
    if (
      company.uf == null ||
      company.uf !== normalizeUf(venue.address.region)
    ) {
      throw new BadRequestException(
        "A UF do espaço não coincide com o cadastro deste CNPJ na Receita Federal.",
      );
    }
    if (
      company.municipalityComparable == null ||
      company.municipalityComparable !== normalizeCityForCompare(venue.address.city)
    ) {
      throw new BadRequestException(
        "A cidade do espaço não coincide com o município cadastrado na Receita Federal para este CNPJ.",
      );
    }

    return hashBrazilianVenueTrustRegistryEvidence({
      venuePostalCodeDigits8: venueCep,
      cnpj14,
      postalLocation: postalLoc,
      company,
    });
  }

  async internalSetTrustReview(
    venueId: string,
    decision: VenueTrustReviewDecision,
  ): Promise<Venue> {
    const venue = await this.venues.findById(venueId);
    if (!venue) throw new NotFoundException("Venue não encontrado");
    if (venue.verificationStatus !== "pending_review") {
      throw new BadRequestException(
        "Só é possível rever venues com estado pending_review",
      );
    }
    const fromStatus = venue.verificationStatus;
    const status = decision.status;
    venue.verificationStatus = status;
    venue.isVerifiedL2 = status === "verified_l2";
    if (status === "rejected") {
      const reason = decision.rejectionReason?.trim() || null;
      venue.verificationRejectionReason = reason;
    } else {
      venue.verificationRejectionReason = null;
    }
    venue.updatedAt = new Date();
    await this.venues.save(venue);

    await this.appendVerificationHistory({
      venueId,
      eventKind: "trust_admin_review",
      fromStatus,
      toStatus: status,
      registrySnapshotHash: venue.registrySnapshotHash,
      rejectionReason: status === "rejected" ? venue.verificationRejectionReason : null,
    });

    await this.auditLog.record({
      actorType: "admin_api_key",
      actorId: null,
      action: "venue.trust_review_decided",
      resourceType: "venue",
      resourceId: venueId,
      payload: {
        fromStatus,
        toStatus: status,
        rejectionReason: status === "rejected" ? venue.verificationRejectionReason : undefined,
      },
    });

    return venue;
  }

  private async appendVerificationHistory(input: {
    venueId: string;
    eventKind: string;
    fromStatus: string;
    toStatus: string;
    registrySnapshotHash: string | null;
    rejectionReason: string | null;
  }): Promise<void> {
    const row = new VenueVerificationHistoryOrmEntity();
    row.id = this.ids.generate();
    row.venueId = input.venueId;
    row.eventKind = input.eventKind;
    row.fromStatus = input.fromStatus;
    row.toStatus = input.toStatus;
    row.registrySnapshotHash = input.registrySnapshotHash;
    row.rejectionReason = input.rejectionReason;
    await this.verificationHistory.save(row);
  }
}
