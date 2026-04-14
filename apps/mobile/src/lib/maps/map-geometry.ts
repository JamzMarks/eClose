import type { BoundingBox, MapCoordinate, MapRegion } from "@/lib/maps/types";

const EARTH_RADIUS_KM = 6371;

function toRadians(deg: number): number {
  return (deg * Math.PI) / 180;
}

/**
 * Converte a região visível (centro + deltas) numa bounding box.
 * Assume deltas positivos e região que não cruza o antimeridiano.
 */
export function regionToBoundingBox(region: MapRegion): BoundingBox {
  const latHalf = Math.abs(region.latitudeDelta) / 2;
  const lngHalf = Math.abs(region.longitudeDelta) / 2;
  return {
    minLatitude: region.latitude - latHalf,
    maxLatitude: region.latitude + latHalf,
    minLongitude: region.longitude - lngHalf,
    maxLongitude: region.longitude + lngHalf,
  };
}

/**
 * Parâmetros de query HTTP comuns para filtros geográficos retangulares.
 * Nomes podem ser mapeados no cliente HTTP para o contrato real da API.
 */
export function boundingBoxToQueryParams(box: BoundingBox): Record<string, string> {
  return {
    minLat: String(box.minLatitude),
    maxLat: String(box.maxLatitude),
    minLng: String(box.minLongitude),
    maxLng: String(box.maxLongitude),
  };
}

/**
 * Payload JSON alternativo (útil se a API preferir um único objeto `bbox`).
 */
export function boundingBoxToJsonBody(box: BoundingBox): {
  minLatitude: number;
  maxLatitude: number;
  minLongitude: number;
  maxLongitude: number;
} {
  return {
    minLatitude: box.minLatitude,
    maxLatitude: box.maxLatitude,
    minLongitude: box.minLongitude,
    maxLongitude: box.maxLongitude,
  };
}

/** Distância aproximada Haversine entre dois pontos (km). */
export function distanceKm(a: MapCoordinate, b: MapCoordinate): number {
  const dLat = toRadians(b.latitude - a.latitude);
  const dLng = toRadians(b.longitude - a.longitude);
  const lat1 = toRadians(a.latitude);
  const lat2 = toRadians(b.latitude);
  const h =
    Math.sin(dLat / 2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;
  return 2 * EARTH_RADIUS_KM * Math.asin(Math.min(1, Math.sqrt(h)));
}

/**
 * Verifica se um ponto cai dentro da caixa (inclusivo nos limites).
 */
export function coordinateInsideBoundingBox(coord: MapCoordinate, box: BoundingBox): boolean {
  return (
    coord.latitude >= box.minLatitude &&
    coord.latitude <= box.maxLatitude &&
    coord.longitude >= box.minLongitude &&
    coord.longitude <= box.maxLongitude
  );
}

/**
 * Compara duas caixas com tolerância numérica (útil para debounce de pedidos à API).
 */
export function boundingBoxesAlmostEqual(
  a: BoundingBox,
  b: BoundingBox,
  epsilon = 1e-5,
): boolean {
  return (
    Math.abs(a.minLatitude - b.minLatitude) < epsilon &&
    Math.abs(a.maxLatitude - b.maxLatitude) < epsilon &&
    Math.abs(a.minLongitude - b.minLongitude) < epsilon &&
    Math.abs(a.maxLongitude - b.maxLongitude) < epsilon
  );
}
