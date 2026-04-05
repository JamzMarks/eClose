import { useMemo } from "react";
import type { Region } from "react-native-maps";

import { MOCK_EVENT_MAP_COORDS } from "@/infrastructure/discover/mock-map-pins";
import {
  MOCK_EXPLORE_VENUES,
  MOCK_HOME_EVENTS,
  type ExploreVenueRow,
  type PublishedEventRow,
} from "@/infrastructure/discover/mock-discover-data";

import { coordinateInsideRegion } from "./explore-map-region";
import type { ExploreMapMarker } from "./ExploreMapView";

export type ExploreMapResultRow =
  | { kind: "venue"; data: ExploreVenueRow }
  | { kind: "event"; data: PublishedEventRow };

/**
 * Agrega pins e linhas visíveis para a região actual do mapa.
 * Quando a API expuser bbox / geoqueries, a lógica de carregamento fica aqui ou num serviço chamado pelo ecrã pai.
 */
export function useExploreMapRegionResults(region: Region): {
  markers: ExploreMapMarker[];
  rows: ExploreMapResultRow[];
} {
  return useMemo(() => {
    const markers: ExploreMapMarker[] = [];
    const rows: ExploreMapResultRow[] = [];

    for (const v of MOCK_EXPLORE_VENUES) {
      const lat = v.venue.geoLat;
      const lng = v.venue.geoLng;
      if (lat == null || lng == null) continue;
      if (!coordinateInsideRegion(lat, lng, region)) continue;
      markers.push({
        id: `venue-${v.venue.id}`,
        latitude: lat,
        longitude: lng,
        title: v.venue.name,
      });
      rows.push({ kind: "venue", data: v });
    }

    for (const e of MOCK_HOME_EVENTS) {
      const c = MOCK_EVENT_MAP_COORDS[e.event.id];
      if (!c) continue;
      if (!coordinateInsideRegion(c.latitude, c.longitude, region)) continue;
      markers.push({
        id: `event-${e.event.id}`,
        latitude: c.latitude,
        longitude: c.longitude,
        title: e.event.title,
      });
      rows.push({ kind: "event", data: e });
    }

    return { markers, rows };
  }, [region]);
}
