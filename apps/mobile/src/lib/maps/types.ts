/**
 * Tipos do mapa alinhados a `Region` do `react-native-maps` para trocar o motor sem reescrever a UI.
 */

export type MapCoordinate = {
  latitude: number;
  longitude: number;
};

/**
 * Centro + extensão em graus (mesmo contrato que `Region` em react-native-maps).
 */
export type MapRegion = MapCoordinate & {
  latitudeDelta: number;
  longitudeDelta: number;
};

/**
 * Caixa geográfica em graus decimais (WGS84).
 * Ordem: min ≤ max para cada eixo; não cruza o meridiano 180° (ver doc de API).
 */
export type BoundingBox = {
  minLatitude: number;
  maxLatitude: number;
  minLongitude: number;
  maxLongitude: number;
};

/** Marcador genérico para camada de pins (evento, espaço, …). */
export type MapPin = MapCoordinate & {
  id: string;
  kind: "event" | "venue" | "artist" | "other";
};
