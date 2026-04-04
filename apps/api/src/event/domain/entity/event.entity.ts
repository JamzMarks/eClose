import { EventAdhocAddress } from "../types/event-adhoc-address.type";
import { EventLocationMode } from "../types/event-location-mode.type";
import { EventStatus } from "../types/event-status.type";

export type EventProps = {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  locationMode: EventLocationMode;
  /**
   * Opcional: vínculo com estabelecimento cadastrado (UX, descoberta, agenda do espaço).
   * Evento pode existir sem venue (eventos sociais, privados, etc.).
   */
  venueId: string | null;
  onlineUrl: string | null;
  /** Texto curto para cards (“Casa da Ana”, “Condomínio X”) */
  locationLabel: string | null;
  /** Instruções livres (portaria, referência, bio do lugar) */
  locationNotes: string | null;
  /** Endereço estruturado sem entidade Venue — mapas / mobility no futuro */
  adhocAddress: EventAdhocAddress | null;
  startsAt: Date;
  endsAt: Date;
  timezone: string;
  organizerArtistId: string;
  taxonomyTermIds: string[];
  primaryMediaAssetId: string | null;
  status: EventStatus;
  createdAt: Date;
  updatedAt: Date;
};

export class Event {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  locationMode: EventLocationMode;
  venueId: string | null;
  onlineUrl: string | null;
  locationLabel: string | null;
  locationNotes: string | null;
  adhocAddress: EventAdhocAddress | null;
  startsAt: Date;
  endsAt: Date;
  timezone: string;
  organizerArtistId: string;
  taxonomyTermIds: string[];
  primaryMediaAssetId: string | null;
  status: EventStatus;
  createdAt: Date;
  updatedAt: Date;

  private constructor(props: EventProps) {
    Object.assign(this, props);
  }

  static hydrate(props: EventProps): Event {
    return new Event(props);
  }

  /** Indica enriquecimento com cadastro oficial de espaço (filtros, página do venue). */
  hasVenueLink(): boolean {
    return this.venueId != null;
  }

  /** Alguma pista de “onde” para participantes (além do venue). */
  hasInformalLocationHint(): boolean {
    if (this.locationLabel?.trim()) return true;
    if (this.locationNotes?.trim()) return true;
    const a = this.adhocAddress;
    if (!a) return false;
    return Boolean(
      a.line1?.trim() ||
        a.city?.trim() ||
        a.externalPlaceRef?.trim() ||
        a.geoLat != null ||
        a.geoLng != null,
    );
  }

  static create(props: {
    id: string;
    title: string;
    slug: string;
    description?: string | null;
    locationMode: EventLocationMode;
    venueId?: string | null;
    onlineUrl?: string | null;
    locationLabel?: string | null;
    locationNotes?: string | null;
    adhocAddress?: EventAdhocAddress | null;
    startsAt: Date;
    endsAt: Date;
    timezone: string;
    organizerArtistId: string;
    taxonomyTermIds?: string[];
    primaryMediaAssetId?: string | null;
    status?: EventStatus;
    now?: Date;
  }): Event {
    if (!props.title?.trim()) throw new Error("Título é obrigatório");
    if (!props.slug?.trim()) throw new Error("Slug é obrigatório");
    if (!props.organizerArtistId) throw new Error("Artista organizador é obrigatório");
    if (props.endsAt <= props.startsAt) throw new Error("endsAt deve ser após startsAt");

    const mode = props.locationMode;

    if (mode === EventLocationMode.ONLINE || mode === EventLocationMode.HYBRID) {
      if (!props.onlineUrl?.trim()) throw new Error("URL online é obrigatória para evento online ou híbrido");
    }
    if (mode === EventLocationMode.ONLINE && props.venueId) {
      throw new Error("Evento somente online não deve ter venue vinculado");
    }

    const adhoc = Event.normalizeAdhoc(props.adhocAddress);

    const now = props.now ?? new Date();
    return new Event({
      id: props.id,
      title: props.title.trim(),
      slug: props.slug.trim().toLowerCase(),
      description: props.description?.trim() ?? null,
      locationMode: mode,
      venueId: props.venueId ?? null,
      onlineUrl: props.onlineUrl?.trim() ?? null,
      locationLabel: props.locationLabel?.trim() ?? null,
      locationNotes: props.locationNotes?.trim() ?? null,
      adhocAddress: adhoc,
      startsAt: props.startsAt,
      endsAt: props.endsAt,
      timezone: props.timezone.trim(),
      organizerArtistId: props.organizerArtistId,
      taxonomyTermIds: props.taxonomyTermIds ?? [],
      primaryMediaAssetId: props.primaryMediaAssetId ?? null,
      status: props.status ?? EventStatus.DRAFT,
      createdAt: now,
      updatedAt: now,
    });
  }

  private static normalizeAdhoc(input: EventAdhocAddress | null | undefined): EventAdhocAddress | null {
    if (!input) return null;
    const merged: EventAdhocAddress = {
      line1: input.line1?.trim() || null,
      line2: input.line2?.trim() || null,
      city: input.city?.trim() || null,
      region: input.region?.trim() || null,
      countryCode: input.countryCode?.trim().toUpperCase() || null,
      postalCode: input.postalCode?.trim() || null,
      geoLat: input.geoLat ?? null,
      geoLng: input.geoLng ?? null,
      externalPlaceRef: input.externalPlaceRef?.trim() || null,
    };
    const hasAny = Object.values(merged).some((v) => v != null && v !== "");
    if (!hasAny) return null;
    return merged;
  }

  overlapsRange(from: Date, to: Date): boolean {
    return this.startsAt < to && this.endsAt > from;
  }

  setPrimaryMediaAssetId(assetId: string | null): void {
    this.primaryMediaAssetId = assetId;
    this.updatedAt = new Date();
  }
}
