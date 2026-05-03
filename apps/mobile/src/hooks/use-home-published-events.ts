import { useCallback, useEffect, useState } from "react";

import type { HomePublishedEventsFilters, PublishedEventListItem } from "@/types/entities/discover.types";
import { EventService } from "@/services/event/event.service";
import { DISCOVER_PAGE_SIZE } from "@/services/config/discover-mode";
import { normalizeHttpError } from "@/infrastructure/http/error-handler";

export function useHomePublishedEvents(
  tError: (key: string) => string,
  filters: HomePublishedEventsFilters,
  enabled = true,
) {
  const [items, setItems] = useState<PublishedEventListItem[]>([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(() => enabled);
  const [loadingMore, setLoadingMore] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPage = useCallback(
    async (nextPage: number, mode: "replace" | "append") => {
      const svc = new EventService();
      const res = await svc.listPublished({
        page: nextPage,
        limit: DISCOVER_PAGE_SIZE,
        sortBy: "startsAt",
        order: "ASC",
        city: filters.city.trim() || undefined,
        q: filters.query.trim() || undefined,
        from: filters.from.trim() || undefined,
        to: filters.to.trim() || undefined,
        taxonomyTermIds: filters.taxonomyTermIds?.trim() || undefined,
        discoveryLocationMode: filters.locationMode,
      });
      setTotal(res.total);
      if (mode === "replace") {
        setItems(res.items);
      } else {
        setItems((prev) => [...prev, ...res.items]);
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
