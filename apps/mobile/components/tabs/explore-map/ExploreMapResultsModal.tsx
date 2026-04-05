import {
  FlatList,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { EventListingCard } from "@/components/listing/event-listing-card";
import { VenueListingCard } from "@/components/listing/venue-listing-card";
import { getSchemeColors } from "@/constants/palette";
import { useColorScheme } from "@/hooks/use-color-scheme";

import type { ExploreMapResultRow } from "./use-explore-map-region-results";

export type ExploreMapResultsModalProps = {
  visible: boolean;
  onClose: () => void;
  rows: ExploreMapResultRow[];
  title: string;
  emptyMessage: string;
  onlineLabel: string;
};

export function ExploreMapResultsModal({
  visible,
  onClose,
  rows,
  title,
  emptyMessage,
  onlineLabel,
}: ExploreMapResultsModalProps) {
  const router = useRouter();
  const scheme = useColorScheme() ?? "light";
  const c = getSchemeColors(scheme);
  const insets = useSafeAreaInsets();

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View style={styles.backdrop}>
        <Pressable style={StyleSheet.absoluteFill} onPress={onClose} accessibilityLabel="Close" />
        <View
          style={[
            styles.sheet,
            {
              backgroundColor: c.background,
              maxHeight: "78%",
              paddingBottom: Math.max(insets.bottom, 16),
            },
          ]}>
          <View style={[styles.handle, { backgroundColor: c.border }]} />
          <Text style={[styles.sheetTitle, { color: c.text }]}>{title}</Text>
          {rows.length > 0 ? (
            <Text style={[styles.count, { color: c.textSecondary }]}>{rows.length}</Text>
          ) : null}
          <FlatList
            data={rows}
            keyExtractor={(item) =>
              item.kind === "venue" ? `v-${item.data.venue.id}` : `e-${item.data.event.id}`
            }
            contentContainerStyle={styles.list}
            renderItem={({ item }) =>
              item.kind === "venue" ? (
                <VenueListingCard
                  card={item.data}
                  categoryLabel={item.data.categoryLabel}
                  textColor={c.text}
                  subtitleColor={c.textSecondary}
                  imagePlaceholderColor={c.border}
                  onPress={() => {
                    onClose();
                    router.push(`/venue/${item.data.venue.id}`);
                  }}
                />
              ) : (
                <EventListingCard
                  event={item.data.event}
                  primaryMediaUrl={item.data.primaryMediaUrl}
                  categoryLabel={item.data.categoryLabel}
                  textColor={c.text}
                  subtitleColor={c.textSecondary}
                  imagePlaceholderColor={c.border}
                  onlineLabel={onlineLabel}
                  onPress={() => {
                    onClose();
                    router.push(`/event/${item.data.event.id}`);
                  }}
                />
              )
            }
            ListEmptyComponent={
              rows.length === 0 ? (
                <Text style={[styles.empty, { color: c.textSecondary }]}>{emptyMessage}</Text>
              ) : null
            }
          />
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0,0,0,0.35)",
  },
  sheet: {
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  handle: {
    alignSelf: "center",
    width: 40,
    height: 4,
    borderRadius: 2,
    marginBottom: 12,
  },
  sheetTitle: {
    fontSize: 20,
    fontWeight: "700",
  },
  count: {
    fontSize: 14,
    marginBottom: 8,
  },
  list: {
    paddingBottom: 8,
    flexGrow: 1,
  },
  empty: {
    textAlign: "center",
    marginTop: 24,
    fontSize: 15,
  },
});
