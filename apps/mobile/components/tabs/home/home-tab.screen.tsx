import { ActivityIndicator, FlatList, RefreshControl, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { useTranslation } from "react-i18next";

import { Screen } from "@/components/layout/screen";
import { TabScreenCenterError } from "@/components/shared/tab-screen/TabScreenCenterError";
import { TabScreenCenterLoading } from "@/components/shared/tab-screen/TabScreenCenterLoading";
import { TabScreenEmptyHint } from "@/components/shared/tab-screen/TabScreenEmptyHint";
import { TabScreenHeader } from "@/components/shared/tab-screen/TabScreenHeader";
import { EventCard } from "@/components/tabs/home/components/EventCard";
import { useHomePublishedEvents } from "@/components/tabs/home/use-home-published-events";
import { AppPalette, getSchemeColors } from "@/constants/palette";
import { useColorScheme } from "@/hooks/use-color-scheme";

/**
 * Orquestra a tab Home: dados via hook, UI composta por componentes partilhados e específicos da tab.
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
        keyExtractor={(it) => it.id}
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
            <ActivityIndicator style={{ marginVertical: 16 }} color={AppPalette.primary} />
          ) : null
        }
        renderItem={({ item }) => (
          <EventCard
            event={item}
            textColor={c.text}
            subtitleColor={c.textSecondary}
            surfaceColor={c.surface}
            borderColor={c.border}
            onlineLabel={t("online")}
            onPress={() => router.push(`/event/${item.id}`)}
          />
        )}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  listContent: { padding: 16, paddingBottom: 32, flexGrow: 1 },
});
