import {
  Body,
  Controller,
  Get,
  Inject,
  NotFoundException,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from "@nestjs/common";
import type { Request } from "express";
import type { JwtValidatedUser } from "@/auth/infrastructure/passport/jwt.strategy";
import { PrivateRoute } from "@/infrastructure/http/metadata/private-route.metadata";
import { VenueCreateBodyOwnerHttpGuard } from "@/authorization/interface/http/guards/venue-create-body-owner.http.guard";
import { VenueResourceOwnerHttpGuard } from "@/authorization/interface/http/guards/venue-resource-owner.http.guard";
import { CreateVenueDto } from "./dto/create-venue.dto";
import { LinkPrimaryMediaDto } from "./dto/link-primary-media.dto";
import { SubmitVenueTrustVerificationDto } from "./dto/submit-venue-trust-verification.dto";
import { IVenueService } from "@/venue/application/ports/venue.service.interface";
import { VENUE_SERVICE } from "@/venue/application/tokens/venue.tokens";
import { redactInternalVenueTrustFields, serializeVenueForPublic } from "./venue-public.serializer";

@Controller("venues")
export class VenueController {
  constructor(
    @Inject(VENUE_SERVICE)
    private readonly venues: IVenueService,
  ) {}

  @Post()
  @PrivateRoute()
  @UseGuards(VenueCreateBodyOwnerHttpGuard)
  create(@Body() dto: CreateVenueDto) {
    return this.venues.create(dto);
  }

  @Get()
  async list() {
    const list = await this.venues.listPublicMarketplace();
    return list.map((v) => serializeVenueForPublic(v));
  }

  @Get(":id")
  async getOne(@Param("id") id: string) {
    const v = await this.venues.getPublicById(id);
    if (!v) throw new NotFoundException("Venue não encontrado");
    return serializeVenueForPublic(v);
  }

  /** Dono: estado completo de verificação (CNPJ e ids de anexos). */
  @Get(":id/manage")
  @PrivateRoute()
  @UseGuards(VenueResourceOwnerHttpGuard)
  async getManage(@Param("id") id: string) {
    const v = await this.venues.getById(id);
    if (!v) throw new NotFoundException("Venue não encontrado");
    const safe = redactInternalVenueTrustFields(v);
    return {
      ...safe,
      hasCnpjDocument: Boolean(v.verificationCnpjDocMediaAssetId),
      hasAddressProofDocument: Boolean(v.verificationAddressProofMediaAssetId),
    };
  }

  @Post(":id/trust-verification")
  @PrivateRoute()
  @UseGuards(VenueResourceOwnerHttpGuard)
  async submitTrust(
    @Req() req: Request & { user?: JwtValidatedUser },
    @Param("id") id: string,
    @Body() dto: SubmitVenueTrustVerificationDto,
  ) {
    const actorUserId = req.user?.id ?? null;
    const v = await this.venues.submitTrustVerification(id, dto, actorUserId);
    const safe = redactInternalVenueTrustFields(v);
    return {
      ...safe,
      hasCnpjDocument: Boolean(v.verificationCnpjDocMediaAssetId),
      hasAddressProofDocument: Boolean(v.verificationAddressProofMediaAssetId),
    };
  }

  @Patch(":id/primary-media")
  @PrivateRoute()
  @UseGuards(VenueResourceOwnerHttpGuard)
  linkPrimary(@Param("id") id: string, @Body() body: LinkPrimaryMediaDto) {
    return this.venues.linkPrimaryMedia(id, body.mediaAssetId);
  }
}
