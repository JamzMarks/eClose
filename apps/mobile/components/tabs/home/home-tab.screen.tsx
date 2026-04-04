import { ActivityIndicator, FlatList, RefreshControl, StyleSheet, View } from "react-native";
import { useRouter } from "expo-router";
import { useTranslation } from "react-i18next";

import { EventListingCard } from "@/components/listing/event-listing-card";
import { Screen } from "@/components/layout/screen";
import { TabScreenCenterError } from "@/components/shared/tab-screen/TabScreenCenterError";
import { TabScreenCenterLoading } from "@/components/shared/tab-screen/TabScreenCenterLoading";
import { TabScreenEmptyHint } from "@/components/shared/tab-screen/TabScreenEmptyHint";
import { TabScreenHeader } from "@/components/shared/tab-screen/TabScreenHeader";
import { useHomePublishedEvents } from "@/components/tabs/home/use-home-published-events";
import { AppPalette, getSchemeColors } from "@/constants/palette";
import { useColorScheme } from "@/hooks/use-color-scheme";

/**
 * Tab Home: eventos em cartões partilhando layout com espaços (tab Explorar).
 */
export function HomeTabScreen() {
  const { t } = useTranslation("discover");
  const router = useRouter();
  const scheme = useColorScheme() ?? "light";
  const c = getSchemeColors(scheme);

  const events = useHomePublishedEvents(t);

  const header = (
    <TabScreenHeader
      title={t("homeTitle")}
      subtitle={t("homeSubtitle")}
      borderColor={c.border}
      titleColor={c.text}
      subtitleColor={c.textSecondary}
    />
  );

  if (events.loading && events.items.length === 0) {
    return (
      <Screen>
        {header}
        <TabScreenCenterLoading message={t("loading")} subtitleColor={c.textSecondary} />
      </Screen>
    );
  }

  if (events.error && events.items.length === 0) {
    return (
      <Screen>
        {header}
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
      {header}
      <FlatList
        data={events.items}
        keyExtractor={(it) => it.event.id}
        refreshControl={
          <RefreshControl
            refreshing={events.refreshing}
            onRefresh={events.onRefresh}
            tintColor={AppPalette.primary}
          />
        }
        onEndReached={events.onEndReached}
        onEndReachedThreshold={0.35}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <TabScreenEmptyHint message={t("emptyEvents")} color={c.textSecondary} />
        }
        ListFooterComponent={
          events.loadingMore && events.canLoadMore ? (
            <View style={styles.footer}>
              <ActivityIndicator color={AppPalette.primary} />
            </View>
          ) : null
        }
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
    </Screen>
  );
}

const styles = StyleSheet.create({
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 32,
    flexGrow: 1,
    paddingTop: 4,
  },
  footer: {
    paddingVertical: 16,
    alignItems: "center",
  },
});
