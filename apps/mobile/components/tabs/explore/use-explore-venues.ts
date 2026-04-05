import { useCallback, useEffect, useState } from "react";

import { MarketplaceService } from "@/infrastructure/api/marketplace/marketplace.service";
import type { MarketplaceVenueCardDto } from "@/infrastructure/api/types/venue.types";
import type { DiscoverVenueListFilters } from "@/infrastructure/discover/discover-list-filters.types";
import { mockPaginatedVenues } from "@/infrastructure/discover/mock-discover-api";
import type { ExploreVenueRow } from "@/infrastructure/discover/mock-discover-data";
import { normalizeHttpError } from "@/infrastructure/http/error-handler";
import { DISCOVER_PAGE_SIZE, USE_MOCK_DISCOVER } from "@/lib/discover-config";

export function useExploreVenues(
  tError: (key: string) => string,
  filters: DiscoverVenueListFilters,
  enabled = true,
) {
  const [items, setItems] = useState<ExploreVenueRow[]>([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(() => enabled);
  const [loadingMore, setLoadingMore] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPage = useCallback(
    async (nextPage: number, mode: "replace" | "append") => {
      if (USE_MOCK_DISCOVER) {
        const res = await mockPaginatedVenues(nextPage, DISCOVER_PAGE_SIZE, filters);
        setTotal(res.total);
        if (mode === "replace") {
          setItems(res.items);
        } else {
          setItems((prev) => [...prev, ...res.items]);
        }
        setPage(nextPage);
        return;
      }

      const svc = new MarketplaceService();
      const res = await svc.listVenues({
        page: nextPage,
        limit: DISCOVER_PAGE_SIZE,
        sortBy: filters.sortBy,
        order: filters.order,
        city: filters.city.trim() || undefined,
        region: filters.region.trim() || undefined,
        openToInquiriesOnly: filters.openToInquiriesOnly ? true : undefined,
      });
      setTotal(res.total);
      const mapped: ExploreVenueRow[] = res.items.map((row: MarketplaceVenueCardDto) => ({
        ...row,
      }));
      if (mode === "replace") {
        setItems(mapped);
      } else {
        setItems((prev) => [...prev, ...mapped]);
      }
      setPage(nextPage);
    },
    [filters],
  );

  const loadInitial = useCallback(async () => {
    setError(null);
    setLoading(true);
    try {
      await fetchPage(1, "replace");
    } catch (e) {
      setError(normalizeHttpError(e, tError("error")).message);
    } finally {
      setLoading(false);
    }
  }, [fetchPage, tError]);

  useEffect(() => {
    if (!enabled) {
      setLoading(false);
      return;
    }
    void loadInitial();
  }, [loadInitial, enabled]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await fetchPage(1, "replace");
      setError(null);
    } catch (e) {
      setError(normalizeHttpError(e, tError("error")).message);
    } finally {
      setRefreshing(false);
    }
  }, [fetchPage, tError]);

  const onEndReached = useCallback(async () => {
    if (loading || loadingMore || error) return;
    if (items.length >= total) return;
    setLoadingMore(true);
    try {
      await fetchPage(page + 1, "append");
    } catch (e) {
      setError(normalizeHttpError(e, tError("error")).message);
    } finally {
      setLoadingMore(false);
    }
  }, [loading, loadingMore, error, items.length, total, page, fetchPage, tError]);

  const canLoadMore = items.length < total;

  return {
    items,
    loading,
    loadingMore,
    refreshing,
    error,
    total,
    loadInitial,
    onRefresh,
    onEndReached,
    canLoadMore,
  };
}
