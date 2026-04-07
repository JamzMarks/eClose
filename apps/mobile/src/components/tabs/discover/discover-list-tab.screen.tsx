import { useEffect, useMemo, useState } from "react";
import { Text, View } from "react-native";
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
import { TabScreenCenterError } from "@/components/shared/tab-screen/TabScreenCenterError";
import { TabScreenCenterLoading } from "@/components/shared/tab-screen/TabScreenCenterLoading";
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
    <View>
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

  const header = (
    <DiscoverListToolbar
      title={t("programacaoTitle")}
      listKind={listKind}
      onListKindChange={setListKind}
      segmentLabels={{ events: t("segmentEvents"), venues: t("segmentVenues") }}
      onFilterPress={() => setFiltersOpen(true)}
      filterAccessibilityLabel={t("filtersTitle")}
      colors={toolbarColors}
    />
  );

  const columnWrap = {
    gap: columnGap,
    marginBottom: 4,
  };

  const gridMode = numColumns > 1;

  if (active.loading && active.items.length === 0) {
    return (
      <Screen>
        {header}
        {listHeader}
        <TabScreenCenterLoading message={t("loading")} subtitleColor={c.textSecondary} />
        {filtersSheet}
      </Screen>
    );
  }

  if (active.error && active.items.length === 0) {
    return (
      <Screen>
        {header}
        {listHeader}
        <TabScreenCenterError
          message={active.error}
          retryLabel={t("retry")}
          onRetry={active.loadInitial}
        />
        {filtersSheet}
      </Screen>
    );
  }

  return (
    <Screen>
      {header}
      {listKind === "events" ? (
        <DiscoverPaginatedFlatList
          data={displayEvents}
          keyExtractor={(it) => it.event.id}
          emptyMessage={t("emptyEvents")}
          emptyHintColor={c.textSecondary}
          listHeaderComponent={listHeader}
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
