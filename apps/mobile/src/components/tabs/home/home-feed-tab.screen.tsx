import { useMemo, useState, type ReactElement } from "react";
import { Animated, StyleSheet, Text, View } from "react-native";
import { useRouter } from "expo-router";
import { useTranslation } from "react-i18next";

import { DiscoverPaginatedFlatList } from "@/components/shared/discover/DiscoverPaginatedFlatList";
import { EventListingCard } from "@/components/shared/listing/event-listing-card";
import { Screen } from "@/components/layout/screen";
import { AppTabScreenHeader } from "@/components/shared/tab-screen/AppTabScreenHeader";
import { TabScreenContent } from "@/components/shared/tab-screen/TabScreenContent";
import { Layout } from "@/constants/layout";
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
import { useScrollHideChrome } from "@/hooks/use-scroll-hide-chrome";
import { defaultDiscoverEventFilters } from "@/types/entities/discover.types";

/** Início — próximos eventos publicados via `EventService`. */
export function HomeFeedTabScreen() {
  const { t } = useTranslation("discover");
  const { t: tTabs } = useTranslation("tabs");
  const router = useRouter();
  const scheme = useColorScheme() ?? "light";
  const c = getSchemeColors(scheme);
  const [filters] = useState(() => defaultDiscoverEventFilters());
  const events = useHomePublishedEvents(t, filters, true);
  const { onChromeLayout, onScroll, chromeAnimatedStyle } = useScrollHideChrome();

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
        <TabScreenContent style={{ flex: 1 }}>
          <TabScreenCenterLoading message={t("loading")} subtitleColor={c.textSecondary} />
        </TabScreenContent>
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
        <TabScreenContent style={{ flex: 1 }}>
          <TabScreenCenterError
            message={events.error}
            retryLabel={t("retry")}
            onRetry={events.loadInitial}
          />
        </TabScreenContent>
      </Screen>
    );
  }

  return (
    <Screen>
      <Animated.View
        style={[
          chromeAnimatedStyle,
          {
            zIndex: 1,
            elevation: 2,
            backgroundColor: c.background,
          },
        ]}>
        <View onLayout={onChromeLayout}>
          <AppTabScreenHeader
            title={tTabs("appName")}
            borderColor={c.border}
            titleColor={c.text}
            leading={<TabHeaderCreateButton color={c.text} />}
            trailing={<TabHeaderNotificationsButton color={c.text} />}
          />
          <Text style={[styles.subtitle, { color: c.textSecondary }]}>{t("homeFeedSubtitle")}</Text>
        </View>
      </Animated.View>
      <TabScreenContent edgeToEdge style={{ flex: 1, zIndex: 0 }}>
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
        onScroll={onScroll}
        scrollEventThrottle={16}
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
      </TabScreenContent>
    </Screen>
  );
}

const styles = StyleSheet.create({
  subtitle: {
    paddingHorizontal: Layout.tab.content.horizontalPadding,
    paddingTop: 8,
    paddingBottom: 4,
    fontSize: 15,
    lineHeight: 22,
  },
});
