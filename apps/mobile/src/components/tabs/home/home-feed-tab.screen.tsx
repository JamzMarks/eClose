import { useMemo, useState, type ReactElement } from "react";
import { StyleSheet, Text } from "react-native";
import { useRouter } from "expo-router";
import { useTranslation } from "react-i18next";

import { DiscoverPaginatedFlatList } from "@/components/shared/discover/DiscoverPaginatedFlatList";
import { EventListingCard } from "@/components/shared/listing/event-listing-card";
import { Screen } from "@/components/layout/screen";
import { AppTabScreenHeader } from "@/components/shared/tab-screen/AppTabScreenHeader";
import {
  TabHeaderCreateButton,
  TabHeaderNotificationsButton,
} from "@/components/shared/tab-screen/TabHeaderChrome";
import { TabScreenCenterError } from "@/components/shared/tab-screen/TabScreenCenterError";
import { TabScreenCenterLoading } from "@/components/shared/tab-screen/TabScreenCenterLoading";
import { ListingInlineErrorBanner } from "@/components/shared/tab-screen/ListingInlineErrorBanner";
import { useHomePublishedEvents } from "@/hooks/use-home-published-events";
import { getSchemeColors } from "@/constants/palette";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { defaultDiscoverEventFilters } from "@/services/discover/discover-list-filters.types";

/**
 * Início — próximos eventos publicados (API real quando `EXPO_PUBLIC_USE_MOCK_DISCOVER` ≠ true).
 */
export function HomeFeedTabScreen() {
  const { t } = useTranslation("discover");
  const { t: tTabs } = useTranslation("tabs");
  const router = useRouter();
  const scheme = useColorScheme() ?? "light";
  const c = getSchemeColors(scheme);
  const [filters] = useState(() => defaultDiscoverEventFilters());
  const events = useHomePublishedEvents(t, filters, true);

  const errorBanner: ReactElement | undefined = useMemo(() => {
    if (!events.error || events.items.length === 0) return undefined;
    return <ListingInlineErrorBanner message={events.error} />;
  }, [events.error, events.items]);

  if (events.loading && events.items.length === 0) {
    return (
      <Screen>
        <AppTabScreenHeader
          title={tTabs("appName")}
          borderColor={c.border}
          titleColor={c.text}
          leading={<TabHeaderCreateButton color={c.text} />}
          trailing={<TabHeaderNotificationsButton color={c.text} />}
        />
        <TabScreenCenterLoading message={t("loading")} subtitleColor={c.textSecondary} />
      </Screen>
    );
  }

  if (events.error && events.items.length === 0) {
    return (
      <Screen>
        <AppTabScreenHeader
          title={tTabs("appName")}
          borderColor={c.border}
          titleColor={c.text}
          leading={<TabHeaderCreateButton color={c.text} />}
          trailing={<TabHeaderNotificationsButton color={c.text} />}
        />
        <TabScreenCenterError
          message={events.error}
          retryLabel={t("retry")}
          onRetry={events.loadInitial}
        />
      </Screen>
    );
  }

  return (
    <Screen>
      <AppTabScreenHeader
        title={tTabs("appName")}
        borderColor={c.border}
        titleColor={c.text}
        leading={<TabHeaderCreateButton color={c.text} />}
        trailing={<TabHeaderNotificationsButton color={c.text} />}
      />
      <Text style={[styles.subtitle, { color: c.textSecondary }]}>{t("homeFeedSubtitle")}</Text>
      <DiscoverPaginatedFlatList
        data={events.items}
        keyExtractor={(it) => it.event.id}
        emptyMessage={t("emptyEvents")}
        emptyHintColor={c.textSecondary}
        listHeaderComponent={errorBanner}
        refreshing={events.refreshing}
        onRefresh={events.onRefresh}
        onEndReached={events.onEndReached}
        loadingMore={events.loadingMore}
        canLoadMore={events.canLoadMore}
        renderItem={({ item }) => (
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
          />
        )}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  subtitle: {
    paddingHorizontal: 24,
    paddingTop: 8,
    paddingBottom: 4,
    fontSize: 15,
    lineHeight: 22,
  },
});
