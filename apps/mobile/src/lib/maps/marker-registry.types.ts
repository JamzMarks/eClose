/**
 * Tipos de espaço para estilo de pin no mapa.
 * Novos tipos: acrescentar aqui + entrada em `DEFAULT_VENUE_MARKER_REGISTRY`.
 */
export type VenueMarkerKind =
  | "bar"
  | "restaurant"
  | "cafe"
  | "club"
  | "theater"
  | "studio"
  | "festival"
  | "train"
  | "bus"
  | "default";

/**
 * Aparência do pin nativo (`pinColor` em `react-native-maps` Marker).
 * Futuro: `image` / `icon` para marcadores custom por tipo.
 */
export type VenueMarkerVisualConfig = {
  pinColor: string;
  /** Chave em `explore.markers.*` para acessibilidade / legenda. */
  labelKey: VenueMarkerKind;
};

export type VenueMarkerRegistry = Record<VenueMarkerKind, VenueMarkerVisualConfig>;
