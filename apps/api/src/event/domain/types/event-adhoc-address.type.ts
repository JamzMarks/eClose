/**
 * Endereço “solto” do evento, sem vínculo obrigatório com {@link Venue}.
 * Usado por UX, geocoding, deep links (Maps, Uber, etc.) quando existir integração.
 */
export type EventAdhocAddress = {
  line1: string | null;
  line2: string | null;
  city: string | null;
  region: string | null;
  countryCode: string | null;
  postalCode: string | null;
  geoLat: number | null;
  geoLng: number | null;
  /** place_id, plus code, URI de app — evolui sem mudar o modelo relacional */
  externalPlaceRef: string | null;
};
