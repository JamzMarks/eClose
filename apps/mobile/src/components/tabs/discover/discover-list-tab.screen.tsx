import { useEffect, useMemo, useState } from "react";
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from "react-native";
import { useRouter } from "expo-router";
import { useTranslation } from "react-i18next";

import { DiscoverFiltersSheet } from "@/components/discover/DiscoverFiltersSheet";
import { DiscoverListToolbar } from "@/components/discover/DiscoverListToolbar";
import { DiscoverPaginatedFlatList } from "@/components/discover/DiscoverPaginatedFlatList";
import type { DiscoverListKind } from "@/components/discover/discover-segmented-kind";
import { DiscoverQuickCategoriesRow } from "@/components/discover/DiscoverQuickCategoriesRow";
import type { DiscoverQuickFilterId } from "@/components/discover/DiscoverQuickFilterChips";
import { DiscoverQuickFilterChips } from "@/components/discover/DiscoverQuickFilterChips";
import { DiscoverSearchBar } from "@/components/discover/DiscoverSearchBar";
import { EventListingCard } from "@/components/listing/event-listing-card";
import { VenueListingCard } from "@/components/listing/venue-listing-card";
import { Screen } from "@/components/layout/screen";
import { useExploreVenues } from "@/components/tabs/explore/use-explore-venues";
import { useHomePublishedEvents } from "@/components/tabs/home/use-home-published-events";
import { AppPalette, getSchemeColors } from "@/constants/palette";
import { useDiscoverGrid } from "@/hooks/use-discover-grid";
import { useColorScheme } from "@/hooks/use-color-scheme";
import type { DiscoverQuickCategory } from "@/services/discover/discover-quick-categories.mock";
import {
  defaultDiscoverEventFilters,
  defaultDiscoverVenueFilters,
  type DiscoverEventListFilters,
  type DiscoverVenueListFilters,
} from "@/services/discover/discover-list-filters.types";

function filterVenueItems<
  T extends { venue: { name: string; slug: string; address: { city: string }; isVerifiedL2?: boolean } },
>(
  items: T[],
  search: string,
  category: DiscoverQuickCategory | null,
  quick: DiscoverQuickFilterId,
): T[] {
  let list = items;
  const q = search.trim().toLowerCase();
  if (q) {
    list = list.filter(
      (it) =>
        it.venue.name.toLowerCase().includes(q) ||
        it.venue.slug.toLowerCase().includes(q) ||
        it.venue.address.city.toLowerCase().includes(q),
    );
  }
  if (category?.filterKeyword) {
    const k = category.filterKeyword.toLowerCase();
    list = list.filter((it) => it.venue.name.toLowerCase().includes(k));
  }
  if (quick === "popular") {
    list = list.filter((it) => Boolean(it.venue.isVerifiedL2));
  }
  return list;
}

function filterEventItems<
  T extends {
    event: { title: string; description: string | null; primaryMediaUrl?: string | null };
    primaryMediaUrl?: string | null;
  },
>(items: T[], category: DiscoverQuickCategory | null, quick: DiscoverQuickFilterId): T[] {
  let list = items;
  if (category?.filterKeyword) {
    const k = category.filterKeyword.toLowerCase();
    list = list.filter(
      (it) =>
        it.event.title.toLowerCase().includes(k) ||
        (it.event.description?.toLowerCase().includes(k) ?? false),
    );
  }
  if (quick === "popular") {
    list = [...list].sort(
      (a, b) =>
        Number(!!(b.primaryMediaUrl ?? b.event.primaryMediaUrl)) -
        Number(!!(a.primaryMediaUrl ?? a.event.primaryMediaUrl)),
    );
  }
  return list;
}

function ListEmptyLoading({ message, subtitleColor }: { message: string; subtitleColor: string }) {
  return (
    <View style={styles.listEmptyBlock}>
      <ActivityIndicator color={AppPalette.primary} size="large" />
      <Text style={[styles.listEmptyText, { color: subtitleColor }]}>{message}</Text>
    </View>
  );
}

function ListEmptyError({
  message,
  retryLabel,
  onRetry,
}: {
  message: string;
  retryLabel: string;
  onRetry: () => void;
}) {
  return (
    <View style={styles.listEmptyBlock}>
      <Text style={[styles.listEmptyErrorText, { color: AppPalette.error }]}>{message}</Text>
      <Pressable onPress={onRetry} style={styles.listEmptyRetry} accessibilityRole="button">
        <Text style={styles.listEmptyRetryText}>{retryLabel}</Text>
      </Pressable>
    </View>
  );
}

export function DiscoverListTabScreen() {
  const { t } = useTranslation("discover");
  const router = useRouter();
  const scheme = useColorScheme() ?? "light";
  const c = getSchemeColors(scheme);
  const { numColumns, cardWidth, columnGap } = useDiscoverGrid();

  const [listKind, setListKind] = useState<DiscoverListKind>("events");
  const [eventFilters, setEventFilters] = useState<DiscoverEventListFilters>(defaultDiscoverEventFilters);
  const [venueFilters, setVenueFilters] = useState<DiscoverVenueListFilters>(defaultDiscoverVenueFilters);
  const [filtersOpen, setFiltersOpen] = useState(false);

  const [searchDraft, setSearchDraft] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<DiscoverQuickCategory | null>(null);
  const [quickFilter, setQuickFilter] = useState<DiscoverQuickFilterId>("all");

  useEffect(() => {
    const h = setTimeout(() => {
      setEventFilters((prev) => ({ ...prev, query: searchDraft }));
    }, 320);
    return () => clearTimeout(h);
  }, [searchDraft]);

  const venueFiltersForApi = useMemo(
    () => ({
      ...venueFilters,
      openToInquiriesOnly: venueFilters.openToInquiriesOnly || quickFilter === "recommends",
    }),
    [venueFilters, quickFilter],
  );

  const events = useHomePublishedEvents(t, eventFilters, listKind === "events");
  const venues = useExploreVenues(t, venueFiltersForApi, listKind === "venues");
  const active = listKind === "events" ? events : venues;

  const displayEvents = useMemo(
    () => filterEventItems(events.items, selectedCategory, quickFilter),
    [events.items, selectedCategory, quickFilter],
  );

  const displayVenues = useMemo(
    () => filterVenueItems(venues.items, searchDraft, selectedCategory, quickFilter),
    [venues.items, searchDraft, selectedCategory, quickFilter],
  );

  const toolbarColors = {
    border: c.border,
    title: c.text,
    filterIcon: c.text,
    segmentTrack: scheme === "dark" ? c.surfaceElevated : c.border,
    segmentActiveBg: AppPalette.primary,
    segmentActiveText: AppPalette.white,
    segmentInactiveText: c.textSecondary,
  };

  const filterLabels = {
    title: t("filtersTitle"),
    apply: t("filtersApply"),
    reset: t("filtersReset"),
    city: t("filtersCity"),
    region: t("filtersRegion"),
    query: t("filtersQuery"),
    locationModeAll: t("filtersLocationAll"),
    locationModePhysical: t("filtersLocationPhysical"),
    locationModeOnline: t("filtersLocationOnline"),
    openToInquiries: t("filtersOpenToInquiries"),
    locationModeSection: t("filtersLocationModeSection"),
  };

  const listHeader = (
    <View style={{ paddingBottom: 4 }}>
      <DiscoverListToolbar
        title={t("programacaoTitle")}
        listKind={listKind}
        onListKindChange={setListKind}
        segmentLabels={{ events: t("segmentEvents"), venues: t("segmentVenues") }}
        onFilterPress={() => setFiltersOpen(true)}
        filterAccessibilityLabel={t("filtersTitle")}
        colors={toolbarColors}
      />
      <DiscoverSearchBar value={searchDraft} onChangeText={setSearchDraft} />
      <DiscoverQuickCategoriesRow
        selectedId={selectedCategory?.id ?? null}
        onSelect={setSelectedCategory}
      />
      <DiscoverQuickFilterChips
        value={quickFilter}
        onChange={setQuickFilter}
        onMorePress={() => setFiltersOpen(true)}
      />
      {listKind === "events" && events.error && events.items.length > 0 ? (
        <View style={{ paddingBottom: 10, paddingHorizontal: 4 }}>
          <Text style={{ color: AppPalette.error, fontSize: 14, lineHeight: 20 }}>{events.error}</Text>
        </View>
      ) : null}
      {listKind === "venues" && venues.error && venues.items.length > 0 ? (
        <View style={{ paddingBottom: 10, paddingHorizontal: 4 }}>
          <Text style={{ color: AppPalette.error, fontSize: 14, lineHeight: 20 }}>{venues.error}</Text>
        </View>
      ) : null}
    </View>
  );

  const filtersSheet = (
    <DiscoverFiltersSheet
      visible={filtersOpen}
      onClose={() => setFiltersOpen(false)}
      listKind={listKind}
      eventFilters={eventFilters}
      venueFilters={venueFilters}
      onApplyEvents={setEventFilters}
      onApplyVenues={setVenueFilters}
      labels={filterLabels}
    />
  );

  const columnWrap = {
    gap: columnGap,
    marginBottom: 4,
  };

  const gridMode = numColumns > 1;

  const eventsEmptyExtra =
    events.loading && events.items.length === 0 ? (
      <ListEmptyLoading message={t("loading")} subtitleColor={c.textSecondary} />
    ) : events.error && events.items.length === 0 ? (
      <ListEmptyError message={events.error} retryLabel={t("retry")} onRetry={events.loadInitial} />
    ) : undefined;

  const venuesEmptyExtra =
    venues.loading && venues.items.length === 0 ? (
      <ListEmptyLoading message={t("loading")} subtitleColor={c.textSecondary} />
    ) : venues.error && venues.items.length === 0 ? (
      <ListEmptyError message={venues.error} retryLabel={t("retry")} onRetry={venues.loadInitial} />
    ) : undefined;

  return (
    <Screen>
      {listKind === "events" ? (
        <DiscoverPaginatedFlatList
          data={displayEvents}
          keyExtractor={(it) => it.event.id}
          emptyMessage={t("emptyEvents")}
          emptyHintColor={c.textSecondary}
          listHeaderComponent={listHeader}
          listEmptyComponent={eventsEmptyExtra}
          refreshing={events.refreshing}
          onRefresh={events.onRefresh}
          onEndReached={events.onEndReached}
          loadingMore={events.loadingMore}
          canLoadMore={events.canLoadMore}
          numColumns={numColumns}
          columnWrapperStyle={gridMode ? columnWrap : undefined}
          renderItem={({ item }) => (
            <View style={gridMode ? { width: cardWidth } : undefined}>
              <EventListingCard
                event={item.event}
                primaryMediaUrl={item.primaryMediaUrl}
                galleryUrls={item.galleryUrls}
                categoryLabel={item.categoryLabel}
                textColor={c.text}
                subtitleColor={c.textSecondary}
                imagePlaceholderColor={c.border}
                onlineLabel={t("online")}
                onPress={() => router.push(`/event/${item.event.id}`)}
                cardInnerWidth={cardWidth}
                gridMode={gridMode}
              />
            </View>
          )}
        />
      ) : (
        <DiscoverPaginatedFlatList
          data={displayVenues}
          keyExtractor={(it) => it.venue.id}
          emptyMessage={t("emptyVenues")}
          emptyHintColor={c.textSecondary}
          listHeaderComponent={listHeader}
          listEmptyComponent={venuesEmptyExtra}
          refreshing={venues.refreshing}
          onRefresh={venues.onRefresh}
          onEndReached={venues.onEndReached}
          loadingMore={venues.loadingMore}
          canLoadMore={venues.canLoadMore}
          numColumns={numColumns}
          columnWrapperStyle={gridMode ? columnWrap : undefined}
          renderItem={({ item }) => (
            <View style={gridMode ? { width: cardWidth } : undefined}>
              <VenueListingCard
                card={item}
                categoryLabel={item.categoryLabel}
                trustBadgeLabel={t("trustSemiReliable")}
                textColor={c.text}
                subtitleColor={c.textSecondary}
                imagePlaceholderColor={c.border}
                onPress={() => router.push(`/venue/${item.venue.id}`)}
                cardInnerWidth={cardWidth}
                gridMode={gridMode}
              />
            </View>
          )}
        />
      )}
      {filtersSheet}
    </Screen>
  );
}

const styles = StyleSheet.create({
  listEmptyBlock: {
    minHeight: 200,
    paddingVertical: 32,
    paddingHorizontal: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  listEmptyText: {
    marginTop: 12,
    fontSize: 15,
  },
  listEmptyErrorText: {
    textAlign: "center",
    fontSize: 15,
    lineHeight: 22,
    marginBottom: 12,
  },
  listEmptyRetry: {
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  listEmptyRetryText: {
    color: AppPalette.primary,
    fontWeight: "600",
    fontSize: 16,
  },
});
