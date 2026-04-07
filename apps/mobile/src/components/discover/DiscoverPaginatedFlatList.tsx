import type { ReactElement } from "react";
import type { ListRenderItem, StyleProp, ViewStyle } from "react-native";
import { ActivityIndicator, FlatList, RefreshControl, StyleSheet, View } from "react-native";

import { TabScreenEmptyHint } from "@/components/shared/tab-screen/TabScreenEmptyHint";
import { AppPalette } from "@/constants/palette";

export type DiscoverPaginatedFlatListProps<T> = {
  data: T[];
  keyExtractor: (item: T) => string;
  renderItem: ListRenderItem<T>;
  emptyMessage: string;
  emptyHintColor: string;
  refreshing: boolean;
  onRefresh: () => void;
  onEndReached: () => void;
  loadingMore: boolean;
  canLoadMore: boolean;
  listHeaderComponent?: ReactElement | null;
  /** Se definido, substitui o hint vazio por defeito (ex.: loading / erro inicial). */
  listEmptyComponent?: ReactElement | null;
  numColumns?: number;
  columnWrapperStyle?: StyleProp<ViewStyle>;
};

/**
 * Lista partilhada para descoberta (eventos ou espaços): pull-to-refresh, página infinita, vazio.
 */
export function DiscoverPaginatedFlatList<T>({
  data,
  keyExtractor,
  renderItem,
  emptyMessage,
  emptyHintColor,
  refreshing,
  onRefresh,
  onEndReached,
  loadingMore,
  canLoadMore,
  listHeaderComponent,
  listEmptyComponent,
  numColumns = 1,
  columnWrapperStyle,
}: DiscoverPaginatedFlatListProps<T>) {
  const cols = numColumns > 1 ? numColumns : 1;
  const empty =
    listEmptyComponent !== undefined ? (
      listEmptyComponent
    ) : (
      <TabScreenEmptyHint message={emptyMessage} color={emptyHintColor} />
    );
  return (
    <FlatList
      data={data}
      keyExtractor={keyExtractor}
      numColumns={cols}
      columnWrapperStyle={cols > 1 ? columnWrapperStyle : undefined}
      ListHeaderComponent={listHeaderComponent ?? null}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          tintColor={AppPalette.primary}
        />
      }
      onEndReached={onEndReached}
      onEndReachedThreshold={0.35}
      contentContainerStyle={styles.listContent}
      ListEmptyComponent={empty}
      ListFooterComponent={
        loadingMore && canLoadMore ? (
          <View style={styles.footer}>
            <ActivityIndicator color={AppPalette.primary} />
          </View>
        ) : null
      }
      renderItem={renderItem}
    />
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
