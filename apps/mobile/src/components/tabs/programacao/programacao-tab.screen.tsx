import { useEffect, useMemo, useState } from "react";
import { useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import { View } from "react-native";

import { Screen } from "@/components/layout/screen";
import { TabScreenContent } from "@/components/shared/tab-screen/TabScreenContent";
import { DiscoverPaginatedFlatList } from "@/components/shared/discover/DiscoverPaginatedFlatList";
import { EventListingCard } from "@/components/shared/listing/event-listing-card";
import { useHomePublishedEvents } from "@/hooks/use-home-published-events";
import { ProgramacaoFiltersSheet } from "./components/ProgramacaoFiltersSheet";
import { DiscoverListToolbar } from "./components/DiscoverListToolbar";
import { DiscoverQuickCategoriesRow } from "./components/DiscoverQuickCategoriesRow";
import { ProgramacaoTimeQuickChips } from "./components/ProgramacaoTimeQuickChips";
import { DiscoverSearchBar } from "./components/DiscoverSearchBar";
import { TabScreenCenterError } from "@/components/shared/tab-screen/TabScreenCenterError";
import { TabScreenCenterLoading } from "@/components/shared/tab-screen/TabScreenCenterLoading";
import { ListingInlineErrorBanner } from "@/components/shared/tab-screen/ListingInlineErrorBanner";
import { getSchemeColors } from "@/constants/palette";
import { useDiscoverGrid } from "@/hooks/use-discover-grid";
import { useColorScheme } from "@/hooks/use-color-scheme";
import type { DiscoverQuickCategory } from "@/services/discover/discover-quick-categories.mock";
import { defaultDiscoverEventFilters, type DiscoverEventListFilters } from "@/types/entities/discover.types";
import {
  eventFiltersForTimeQuick,
  inferProgramacaoTimeQuickId,
  type ProgramacaoTimeQuickId,
  type ProgramacaoTimeQuickSelection,
} from "./programacao-date-presets";

function filterEventItemsByCategoryKeyword<
  T extends { event: { title: string; description: string | null } },
>(items: T[], category: DiscoverQuickCategory | null): T[] {
  if (!category?.filterKeyword || category.taxonomyTermIds?.length) return items;
  const k = category.filterKeyword.toLowerCase();
  return items.filter(
    (it) =>
      it.event.title.toLowerCase().includes(k) ||
      (it.event.description?.toLowerCase().includes(k) ?? false),
  );
}

/** Tab Programação — listagem temporal de eventos publicados. */
export function ProgramacaoTabScreen() {
  const { t } = useTranslation("discover");
  const router = useRouter();
  const scheme = useColorScheme() ?? "light";
  const c = getSchemeColors(scheme);
  const { numColumns, cardWidth, columnGap } = useDiscoverGrid();

  const [eventFilters, setEventFilters] = useState<DiscoverEventListFilters>(() => defaultDiscoverEventFilters());
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [searchDraft, setSearchDraft] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<DiscoverQuickCategory | null>(null);

  useEffect(() => {
    const h = setTimeout(() => {
      setEventFilters((prev) => ({ ...prev, query: searchDraft }));
    }, 320);
    return () => clearTimeout(h);
  }, [searchDraft]);

  const taxonomyCsv = useMemo(
    () =>
      selectedCategory?.taxonomyTermIds?.length ? selectedCategory.taxonomyTermIds.join(",") : undefined,
    [selectedCategory],
  );

  const eventFiltersForApi = useMemo(
    () => ({
      ...eventFilters,
      taxonomyTermIds: taxonomyCsv,
    }),
    [eventFilters, taxonomyCsv],
  );

  const events = useHomePublishedEvents(t, eventFiltersForApi, true);

  const displayEvents = useMemo(
    () => filterEventItemsByCategoryKeyword(events.items, selectedCategory),
    [events.items, selectedCategory],
  );

  const timeQuickValue = useMemo((): ProgramacaoTimeQuickSelection => inferProgramacaoTimeQuickId(eventFilters), [eventFilters]);

  const onTimeQuickChange = (id: ProgramacaoTimeQuickId) => {
    setEventFilters((prev) => eventFiltersForTimeQuick(id, prev));
  };

  const toolbarColors = {
    border: c.border,
    title: c.text,
    filterIcon: c.text,
  };

  const filterLabels = {
    title: t("filtersTitle"),
    apply: t("filtersApply"),
    reset: t("filtersReset"),
    city: t("filtersCity"),
    locationModeAll: t("filtersLocationAll"),
    locationModePhysical: t("filtersLocationPhysical"),
    locationModeOnline: t("filtersLocationOnline"),
    locationModeSection: t("filtersLocationModeSection"),
    dateRangeSection: t("programacaoFiltersDateRangeSection"),
    dateFromLabel: t("programacaoFiltersDateFrom"),
    dateToLabel: t("programacaoFiltersDateTo"),
    datePlaceholder: t("programacaoFiltersDatePlaceholder"),
  };

  const listHeader = (
    <View style={{ paddingBottom: 8 }}>
      <DiscoverSearchBar value={searchDraft} onChangeText={setSearchDraft} placeholderKey="programacaoSearchPlaceholder" />
      <DiscoverQuickCategoriesRow listKind="events" selectedId={selectedCategory?.id ?? null} onSelect={setSelectedCategory} />
      <ProgramacaoTimeQuickChips
        value={timeQuickValue}
        onChange={onTimeQuickChange}
        onMorePress={() => setFiltersOpen(true)}
      />
      {events.error && events.items.length > 0 ? <ListingInlineErrorBanner message={events.error} /> : null}
    </View>
  );

  const columnWrap = {
    gap: columnGap,
    marginBottom: 4,
  };

  const gridMode = numColumns > 1;

  const eventsEmptyExtra =
    events.loading && events.items.length === 0 ? (
      <TabScreenCenterLoading message={t("loading")} subtitleColor={c.textSecondary} variant="embedded" />
    ) : events.error && events.items.length === 0 ? (
      <TabScreenCenterError
        message={events.error}
        retryLabel={t("retry")}
        onRetry={events.loadInitial}
        variant="embedded"
      />
    ) : undefined;

  return (
    <Screen>
      <DiscoverListToolbar
        title={t("programacaoTitle")}
        onFilterPress={() => setFiltersOpen(true)}
        filterAccessibilityLabel={t("filtersTitle")}
        colors={toolbarColors}
      />
      <TabScreenContent edgeToEdge style={{ flex: 1 }}>
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
                variant={gridMode ? "compact" : "list"}
              />
            </View>
          )}
        />
      </TabScreenContent>
      <ProgramacaoFiltersSheet
        visible={filtersOpen}
        onClose={() => setFiltersOpen(false)}
        eventFilters={eventFilters}
        onApply={setEventFilters}
        labels={filterLabels}
      />
    </Screen>
  );
}
