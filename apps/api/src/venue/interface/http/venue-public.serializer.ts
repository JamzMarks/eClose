import { Venue } from "@/venue/domain/entity/venue.entity";

/** Remove evidência interna (hash, motivo de rejeição) para dono / respostas não-admin. */
export function redactInternalVenueTrustFields(v: Venue): Record<string, unknown> {
  const out: Record<string, unknown> = { ...(v as unknown as Record<string, unknown>) };
  delete out.verificationRejectionReason;
  delete out.registrySnapshotHash;
  return out;
}

/** Resposta pública: sem CNPJ nem ids de anexos de verificação. */
export function serializeVenueForPublic(v: Venue) {
  return {
    id: v.id,
    name: v.name,
    slug: v.slug,
    description: v.description,
    ownerUserId: v.ownerUserId,
    address: v.address,
    geoLat: v.geoLat,
    geoLng: v.geoLng,
    timezone: v.timezone,
    openingHours: v.openingHours,
    taxonomyTermIds: v.taxonomyTermIds,
    marketplaceListed: v.marketplaceListed,
    openToArtistInquiries: v.openToArtistInquiries,
    primaryMediaAssetId: v.primaryMediaAssetId,
    isActive: v.isActive,
    isVerifiedL2: v.isVerifiedL2,
    createdAt: v.createdAt,
    updatedAt: v.updatedAt,
  };
}

export type PublicVenueSnapshot = ReturnType<typeof serializeVenueForPublic>;
