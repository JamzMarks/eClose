import { useCallback, useEffect, useState } from "react";

import { MarketplaceService } from "@/infrastructure/api/marketplace/marketplace.service";
import type { MarketplaceVenueCardDto } from "@/infrastructure/api/types/venue.types";
import { normalizeHttpError } from "@/infrastructure/http/error-handler";
import { DISCOVER_PAGE_SIZE } from "@/lib/discover-config";

export function useExploreVenues(tError: (key: string) => string) {
  const [items, setItems] = useState<MarketplaceVenueCardDto[]>([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPage = useCallback(
    async (nextPage: number, mode: "replace" | "append") => {
      const svc = new MarketplaceService();
      const res = await svc.listVenues({
        page: nextPage,
        limit: DISCOVER_PAGE_SIZE,
        sortBy: "name",
        order: "ASC",
      });
      setTotal(res.total);
      if (mode === "replace") {
        setItems(res.items);
      } else {
        setItems((prev) => [...prev, ...res.items]);
      }
      setPage(nextPage);
    },
    [],
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
    void loadInitial();
  }, [loadInitial]);

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
    loadInitial,
    onRefresh,
    onEndReached,
    canLoadMore,
  };
}
