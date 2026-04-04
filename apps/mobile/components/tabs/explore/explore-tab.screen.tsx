import { ActivityIndicator, FlatList, RefreshControl, StyleSheet, View } from "react-native";
import { useRouter } from "expo-router";
import { useTranslation } from "react-i18next";

import { VenueListingCard } from "@/components/listing/venue-listing-card";
import { Screen } from "@/components/layout/screen";
import { TabScreenCenterError } from "@/components/shared/tab-screen/TabScreenCenterError";
import { TabScreenCenterLoading } from "@/components/shared/tab-screen/TabScreenCenterLoading";
import { TabScreenEmptyHint } from "@/components/shared/tab-screen/TabScreenEmptyHint";
import { TabScreenHeader } from "@/components/shared/tab-screen/TabScreenHeader";
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
            <View style={styles.footer}>
              <ActivityIndicator color={AppPalette.primary} />
            </View>
          ) : null
        }
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
