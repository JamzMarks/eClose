import { useMemo } from "react";

import type { ExploreVenuePin } from "@/types/entities/explore.types";
import { EXPLORE_VENUE_MOCK_PINS } from "@/components/tabs/explore/explore-venues.mock";
import { coordinateInsideBoundingBox } from "@/lib/maps/map-geometry";
import { useMapViewport } from "@/lib/maps/map-provider";

/**
 * Espaços cuja coordenada cai dentro do viewport actual (mock local até existir API).
 */
export function useExploreVenuesInViewport(source: ExploreVenuePin[] = EXPLORE_VENUE_MOCK_PINS) {
  const { viewportBounds } = useMapViewport();

  return useMemo(() => {
    if (!viewportBounds) return [];
    return source.filter((v) =>
      coordinateInsideBoundingBox(
        { latitude: v.latitude, longitude: v.longitude },
        viewportBounds,
      ),
    );
  }, [source, viewportBounds]);
}
