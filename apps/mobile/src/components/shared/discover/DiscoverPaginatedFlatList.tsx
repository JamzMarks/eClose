import type { ReactElement } from "react";
import type {
  ListRenderItem,
  NativeScrollEvent,
  NativeSyntheticEvent,
  StyleProp,
  ViewStyle,
} from "react-native";
import { ActivityIndicator, FlatList, RefreshControl, StyleSheet, View } from "react-native";

import { TabScreenEmptyHint } from "@/components/shared/tab-screen/TabScreenEmptyHint";
import { Layout } from "@/constants/layout";
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
  onScroll?: (event: NativeSyntheticEvent<NativeScrollEvent>) => void;
  scrollEventThrottle?: number;
  /** Altura mínima do estado vazio (alinhada com loading/erro embebidos). */
  emptyMinHeight?: number;
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
  emptyMinHeight = 220,
  numColumns = 1,
  columnWrapperStyle,
  onScroll,
  scrollEventThrottle,
}: DiscoverPaginatedFlatListProps<T>) {
  const cols = numColumns > 1 ? numColumns : 1;
  const empty =
    listEmptyComponent !== undefined ? (
      listEmptyComponent
    ) : (
      <TabScreenEmptyHint message={emptyMessage} color={emptyHintColor} minHeight={emptyMinHeight} />
    );
  return (
    <FlatList
      data={data}
      keyExtractor={keyExtractor}
      showsVerticalScrollIndicator={false}
      numColumns={cols}
      columnWrapperStyle={cols > 1 ? columnWrapperStyle : undefined}
      ListHeaderComponent={listHeaderComponent ?? null}
      onScroll={onScroll}
      scrollEventThrottle={scrollEventThrottle}
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
    paddingHorizontal: Layout.tab.content.horizontalPadding,
    paddingBottom: 32,
    flexGrow: 1,
    paddingTop: 10,
  },
  footer: {
    paddingVertical: 16,
    alignItems: "center",
  },
});
