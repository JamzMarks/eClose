import { useState } from "react";
import { useRouter } from "expo-router";
import { useTranslation } from "react-i18next";

import { DiscoverFiltersSheet } from "@/components/discover/DiscoverFiltersSheet";
import { DiscoverListToolbar } from "@/components/discover/DiscoverListToolbar";
import { DiscoverPaginatedFlatList } from "@/components/discover/DiscoverPaginatedFlatList";
import type { DiscoverListKind } from "@/components/discover/discover-segmented-kind";
import { EventListingCard } from "@/components/listing/event-listing-card";
import { VenueListingCard } from "@/components/listing/venue-listing-card";
import { Screen } from "@/components/layout/screen";
import { TabScreenCenterError } from "@/components/shared/tab-screen/TabScreenCenterError";
import { TabScreenCenterLoading } from "@/components/shared/tab-screen/TabScreenCenterLoading";
import { useExploreVenues } from "@/components/tabs/explore/use-explore-venues";
import { useHomePublishedEvents } from "@/components/tabs/home/use-home-published-events";
import { AppPalette, getSchemeColors } from "@/constants/palette";
import { useColorScheme } from "@/hooks/use-color-scheme";
import {
  defaultDiscoverEventFilters,
  defaultDiscoverVenueFilters,
  type DiscoverEventListFilters,
  type DiscoverVenueListFilters,
} from "@/infrastructure/discover/discover-list-filters.types";

export function DiscoverListTabScreen() {
  const { t } = useTranslation("discover");
  const router = useRouter();
  const scheme = useColorScheme() ?? "light";
  const c = getSchemeColors(scheme);

  const [listKind, setListKind] = useState<DiscoverListKind>("events");
  const [eventFilters, setEventFilters] =
    useState<DiscoverEventListFilters>(defaultDiscoverEventFilters);
  const [venueFilters, setVenueFilters] =
    useState<DiscoverVenueListFilters>(defaultDiscoverVenueFilters);
  const [filtersOpen, setFiltersOpen] = useState(false);

  const events = useHomePublishedEvents(t, eventFilters, listKind === "events");
  const venues = useExploreVenues(t, venueFilters, listKind === "venues");
  const active = listKind === "events" ? events : venues;

  const toolbarColors = {
    border: c.border,
    title: c.text,
    subtitle: c.textSecondary,
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
      subtitle={listKind === "events" ? t("homeSubtitle") : t("exploreSubtitle")}
      listKind={listKind}
      onListKindChange={setListKind}
      segmentLabels={{ events: t("segmentEvents"), venues: t("segmentVenues") }}
      onFilterPress={() => setFiltersOpen(true)}
      filterAccessibilityLabel={t("filtersTitle")}
      colors={toolbarColors}
    />
  );

  if (active.loading && active.items.length === 0) {
    return (
      <Screen>
        {header}
        <TabScreenCenterLoading message={t("loading")} subtitleColor={c.textSecondary} />
        {filtersSheet}
      </Screen>
    );
  }

  if (active.error && active.items.length === 0) {
    return (
      <Screen>
        {header}
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
          data={events.items}
          keyExtractor={(it) => it.event.id}
          emptyMessage={t("emptyEvents")}
          emptyHintColor={c.textSecondary}
          refreshing={events.refreshing}
          onRefresh={events.onRefresh}
          onEndReached={events.onEndReached}
          loadingMore={events.loadingMore}
          canLoadMore={events.canLoadMore}
          renderItem={({ item }) => (
            <EventListingCard
              event={item.event}
              primaryMediaUrl={item.primaryMediaUrl}
              categoryLabel={item.categoryLabel}
              textColor={c.text}
              subtitleColor={c.textSecondary}
              imagePlaceholderColor={c.border}
              onlineLabel={t("online")}
              onPress={() => router.push(`/event/${item.event.id}`)}
            />
          )}
        />
      ) : (
        <DiscoverPaginatedFlatList
          data={venues.items}
          keyExtractor={(it) => it.venue.id}
          emptyMessage={t("emptyVenues")}
          emptyHintColor={c.textSecondary}
          refreshing={venues.refreshing}
          onRefresh={venues.onRefresh}
          onEndReached={venues.onEndReached}
          loadingMore={venues.loadingMore}
          canLoadMore={venues.canLoadMore}
          renderItem={({ item }) => (
            <VenueListingCard
              card={item}
              categoryLabel={item.categoryLabel}
              textColor={c.text}
              subtitleColor={c.textSecondary}
              imagePlaceholderColor={c.border}
              onPress={() => router.push(`/venue/${item.venue.id}`)}
            />
          )}
        />
      )}
      {filtersSheet}
    </Screen>
  );
}
