import { Body, Controller, Inject, Param, Patch, UseGuards } from "@nestjs/common";
import { AdminApiKeyGuard } from "@/infrastructure/http/guards/admin-api-key.guard";
import { IVenueService } from "@/venue/application/ports/venue.service.interface";
import { VENUE_SERVICE } from "@/venue/application/tokens/venue.tokens";
import { InternalSetVenueTrustDto } from "./dto/internal-set-venue-trust.dto";

/**
 * Revisão manual MVP: proteger com ADMIN_API_KEY (header x-admin-api-key).
 * Alternativa: atualizar colunas em SQL (ver documentação do módulo venue).
 */
@Controller("internal/venue-trust")
export class InternalVenueTrustController {
  constructor(
    @Inject(VENUE_SERVICE)
    private readonly venues: IVenueService,
  ) {}

  @Patch(":venueId")
  @UseGuards(AdminApiKeyGuard)
  setTrustStatus(
    @Param("venueId") venueId: string,
    @Body() dto: InternalSetVenueTrustDto,
  ) {
    return this.venues.internalSetTrustReview(venueId, {
      status: dto.status,
      rejectionReason: dto.rejectionReason?.trim() || null,
    });
  }
}
