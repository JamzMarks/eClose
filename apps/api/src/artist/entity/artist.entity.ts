import { ArtistType } from "../types/artist.type";

export type ArtistProps = {
  id: string;
  name: string;
  slug: string;
  type: ArtistType;
  /** usuário dono do perfil */
  ownerId: string;
  headline: string | null;
  bio: string | null;
  websiteUrl: string | null;
  /** aparece no marketplace / descoberta */
  marketplaceVisible: boolean;
  /** venues podem demonstrar interesse / “chamar” (fluxo de contato na app) */
  openToVenueBookings: boolean;
  taxonomyTermIds: string[];
  /** denormalizado: id do asset principal em {@link MediaModule} */
  primaryMediaAssetId: string | null;
  createdAt: Date;
  isActive: boolean;
};

export class Artist {
  id: string;
  name: string;
  slug: string;
  type: ArtistType;
  ownerId: string;
  headline: string | null;
  bio: string | null;
  websiteUrl: string | null;
  marketplaceVisible: boolean;
  openToVenueBookings: boolean;
  taxonomyTermIds: string[];
  primaryMediaAssetId: string | null;
  createdAt: Date;
  isActive: boolean;

  private constructor(props: ArtistProps) {
    Object.assign(this, props);
  }

  static hydrate(props: ArtistProps): Artist {
    return new Artist(props);
  }

  static register(props: {
    id: string;
    name: string;
    slug: string;
    type: ArtistType;
    ownerId: string;
    headline?: string | null;
    bio?: string | null;
    websiteUrl?: string | null;
    marketplaceVisible?: boolean;
    openToVenueBookings?: boolean;
    taxonomyTermIds?: string[];
    primaryMediaAssetId?: string | null;
    now?: Date;
  }): Artist {
    if (!props.name?.trim()) throw new Error("Nome é obrigatório");
    if (!props.slug?.trim()) throw new Error("Slug é obrigatório");
    if (!props.ownerId) throw new Error("Owner é obrigatório");
    const now = props.now ?? new Date();
    return new Artist({
      id: props.id,
      name: props.name.trim(),
      slug: props.slug.trim().toLowerCase(),
      type: props.type,
      ownerId: props.ownerId,
      headline: props.headline?.trim() ?? null,
      bio: props.bio?.trim() ?? null,
      websiteUrl: props.websiteUrl?.trim() ?? null,
      marketplaceVisible: props.marketplaceVisible ?? false,
      openToVenueBookings: props.openToVenueBookings ?? false,
      taxonomyTermIds: props.taxonomyTermIds ?? [],
      primaryMediaAssetId: props.primaryMediaAssetId ?? null,
      createdAt: now,
      isActive: true,
    });
  }

  setPrimaryMediaAssetId(assetId: string | null): void {
    this.primaryMediaAssetId = assetId;
  }

  rename(name: string): void {
    if (!name?.trim()) throw new Error("Nome é obrigatório");
    this.name = name.trim();
  }

  deactivate(): void {
    this.isActive = false;
  }
}
