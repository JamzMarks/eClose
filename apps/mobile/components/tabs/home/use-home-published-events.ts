import { useCallback, useEffect, useState } from "react";

import { EventService } from "@/infrastructure/api/event/event.service";
import type { EventDto } from "@/infrastructure/api/types/event.types";
import type { DiscoverEventListFilters } from "@/infrastructure/discover/discover-list-filters.types";
import { mockPaginatedEvents } from "@/infrastructure/discover/mock-discover-api";
import type { PublishedEventRow } from "@/infrastructure/discover/mock-discover-data";
import { normalizeHttpError } from "@/infrastructure/http/error-handler";
import { DISCOVER_PAGE_SIZE, USE_MOCK_DISCOVER } from "@/lib/discover-config";

export function useHomePublishedEvents(
  tError: (key: string) => string,
  filters: DiscoverEventListFilters,
  enabled = true,
) {
  const [items, setItems] = useState<PublishedEventRow[]>([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(() => enabled);
  const [loadingMore, setLoadingMore] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPage = useCallback(
    async (nextPage: number, mode: "replace" | "append") => {
      if (USE_MOCK_DISCOVER) {
        const res = await mockPaginatedEvents(nextPage, DISCOVER_PAGE_SIZE, filters);
        setTotal(res.total);
        if (mode === "replace") {
          setItems(res.items);
        } else {
          setItems((prev) => [...prev, ...res.items]);
        }
        setPage(nextPage);
        return;
      }

      const svc = new EventService();
      const res = await svc.listPublished({
        page: nextPage,
        limit: DISCOVER_PAGE_SIZE,
        sortBy: filters.sortBy,
        order: filters.order,
        city: filters.city.trim() || undefined,
        q: filters.query.trim() || undefined,
      });
      setTotal(res.total);
      let mapped: PublishedEventRow[] = res.items.map((event: EventDto) => ({
        event,
        primaryMediaUrl: null,
      }));
      if (filters.locationMode === "PHYSICAL") {
        mapped = mapped.filter((r) => r.event.locationMode === "PHYSICAL");
      } else if (filters.locationMode === "ONLINE") {
        mapped = mapped.filter((r) => r.event.locationMode === "ONLINE");
      }
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
