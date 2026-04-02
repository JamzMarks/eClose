import { ActivityIndicator, FlatList, RefreshControl, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { useTranslation } from "react-i18next";

import { Screen } from "@/components/layout/screen";
import { TabScreenCenterError } from "@/components/shared/tab-screen/TabScreenCenterError";
import { TabScreenCenterLoading } from "@/components/shared/tab-screen/TabScreenCenterLoading";
import { TabScreenEmptyHint } from "@/components/shared/tab-screen/TabScreenEmptyHint";
import { TabScreenHeader } from "@/components/shared/tab-screen/TabScreenHeader";
import { VenueRowCard } from "@/components/tabs/explore/components/VenueRowCard";
import { useExploreVenues } from "@/components/tabs/explore/use-explore-venues";
import { AppPalette, getSchemeColors } from "@/constants/palette";
import { useColorScheme } from "@/hooks/use-color-scheme";

export function ExploreTabScreen() {
  const { t } = useTranslation("discover");
  const router = useRouter();
  const scheme = useColorScheme() ?? "light";
  const c = getSchemeColors(scheme);

  const venues = useExploreVenues(t);

  const header = (
    <TabScreenHeader
      title={t("exploreTitle")}
      subtitle={t("exploreSubtitle")}
      borderColor={c.border}
      titleColor={c.text}
      subtitleColor={c.textSecondary}
    />
  );

  if (venues.loading && venues.items.length === 0) {
    return (
      <Screen>
        {header}
        <TabScreenCenterLoading message={t("loading")} subtitleColor={c.textSecondary} />
      </Screen>
    );
  }

  if (venues.error && venues.items.length === 0) {
    return (
      <Screen>
        {header}
        <TabScreenCenterError
          message={venues.error}
          retryLabel={t("retry")}
          onRetry={venues.loadInitial}
        />
      </Screen>
    );
  }

  return (
    <Screen>
      {header}
      <FlatList
        data={venues.items}
        keyExtractor={(it) => it.venue.id}
        refreshControl={
          <RefreshControl
            refreshing={venues.refreshing}
            onRefresh={venues.onRefresh}
            tintColor={AppPalette.primary}
          />
        }
        onEndReached={venues.onEndReached}
        onEndReachedThreshold={0.35}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <TabScreenEmptyHint message={t("emptyVenues")} color={c.textSecondary} />
        }
        ListFooterComponent={
          venues.loadingMore && venues.canLoadMore ? (
            <ActivityIndicator style={{ marginVertical: 16 }} color={AppPalette.primary} />
          ) : null
        }
        renderItem={({ item }) => (
          <VenueRowCard
            card={item}
            textColor={c.text}
            subtitleColor={c.textSecondary}
            thumbBackgroundColor={c.border}
            borderColor={c.border}
            onPress={() => router.push(`/venue/${item.venue.id}`)}
          />
        )}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  listContent: { paddingBottom: 32, flexGrow: 1 },
});
