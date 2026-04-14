export type { BoundingBox, MapCoordinate, MapPin, MapRegion } from "@/lib/maps/types";

export {
  boundingBoxToJsonBody,
  boundingBoxToQueryParams,
  boundingBoxesAlmostEqual,
  coordinateInsideBoundingBox,
  distanceKm,
  regionToBoundingBox,
} from "@/lib/maps/map-geometry";

export {
  MapViewportProvider,
  useMapViewport,
  type MapViewportContextValue,
  type MapViewportProviderProps,
} from "@/lib/maps/map-provider";

export { DEFAULT_EXPLORE_REGION_PT, useSuggestedExploreRegion } from "@/lib/maps/map-initial-region";
