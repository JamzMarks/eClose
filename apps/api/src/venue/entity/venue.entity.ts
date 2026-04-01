import { VenueOpeningSlot } from "../types/venue-opening-slot.type";

export type VenueAddress = {
  line1: string;
  line2?: string | null;
  neighborhood?: string | null;
  city: string;
  region: string;
  countryCode: string;
  postalCode?: string | null;
};

export type VenueProps = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  ownerUserId: string | null;
  address: VenueAddress;
  geoLat: number | null;
  geoLng: number | null;
  /** IANA, ex.: America/Sao_Paulo — horários de funcionamento são interpretados neste fuso */
  timezone: string;
  openingHours: VenueOpeningSlot[];
  /** VENUE_TYPE, VENUE_AMENITY, INTEREST (ambiente) — ids da taxonomia */
  taxonomyTermIds: string[];
  /** listado no marketplace para artistas descobrirem o espaço */
  marketplaceListed: boolean;
  /** aceita abordagens de artistas / booking inbound */
  openToArtistInquiries: boolean;
  primaryMediaAssetId: string | null;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
};

export class Venue {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  ownerUserId: string | null;
  address: VenueAddress;
  geoLat: number | null;
  geoLng: number | null;
  timezone: string;
  openingHours: VenueOpeningSlot[];
  taxonomyTermIds: string[];
  marketplaceListed: boolean;
  openToArtistInquiries: boolean;
  primaryMediaAssetId: string | null;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;

  private constructor(props: VenueProps) {
    Object.assign(this, props);
  }

  static hydrate(props: VenueProps): Venue {
    return new Venue(props);
  }

  static register(props: {
    id: string;
    name: string;
    slug: string;
    description?: string | null;
    ownerUserId?: string | null;
    address: VenueAddress;
    geoLat?: number | null;
    geoLng?: number | null;
    timezone: string;
    openingHours: VenueOpeningSlot[];
    taxonomyTermIds?: string[];
    marketplaceListed?: boolean;
    openToArtistInquiries?: boolean;
    primaryMediaAssetId?: string | null;
    now?: Date;
  }): Venue {
    if (!props.name?.trim()) throw new Error("Nome do venue é obrigatório");
    if (!props.slug?.trim()) throw new Error("Slug é obrigatório");
    if (!props.address?.line1?.trim()) throw new Error("Endereço é obrigatório");
    if (!props.address.city?.trim()) throw new Error("Cidade é obrigatória");
    if (!props.timezone?.trim()) throw new Error("Timezone IANA é obrigatório");
    const now = props.now ?? new Date();
    return new Venue({
      id: props.id,
      name: props.name.trim(),
      slug: props.slug.trim().toLowerCase(),
      description: props.description?.trim() ?? null,
      ownerUserId: props.ownerUserId ?? null,
      address: {
        ...props.address,
        line1: props.address.line1.trim(),
        countryCode: props.address.countryCode.toUpperCase(),
      },
      geoLat: props.geoLat ?? null,
      geoLng: props.geoLng ?? null,
      timezone: props.timezone.trim(),
      openingHours: props.openingHours ?? [],
      taxonomyTermIds: props.taxonomyTermIds ?? [],
      marketplaceListed: props.marketplaceListed ?? false,
      openToArtistInquiries: props.openToArtistInquiries ?? false,
      primaryMediaAssetId: props.primaryMediaAssetId ?? null,
      isActive: true,
      createdAt: now,
      updatedAt: now,
    });
  }

  setPrimaryMediaAssetId(assetId: string | null): void {
    this.primaryMediaAssetId = assetId;
    this.updatedAt = new Date();
  }
}
