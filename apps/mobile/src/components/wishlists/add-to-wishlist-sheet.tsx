import { useCallback, useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  View,
  type ListRenderItemInfo,
} from "react-native";
import BottomSheet, {
  BottomSheetBackdrop,
  type BottomSheetBackdropProps,
  BottomSheetFlatList,
} from "@gorhom/bottom-sheet";
import { useTranslation } from "react-i18next";

import { AppPalette, getSchemeColors } from "@/constants/palette";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { normalizeHttpError } from "@/infrastructure/http/error-handler";
import { SharedEventListService } from "@/services/shared-event-list/shared-event-list.service";
import type { SharedEventListSummaryDto } from "@/contracts/shared-event-list.types";

export type AddToWishlistSheetProps = {
  visible: boolean;
  eventId: string;
  onClose: () => void;
  onAdded?: () => void;
};

export function AddToWishlistSheet({ visible, eventId, onClose, onAdded }: AddToWishlistSheetProps) {
  const { t } = useTranslation("wishlists");
  const scheme = useColorScheme() ?? "light";
  const c = getSchemeColors(scheme);
  const snapPoints = useMemo(() => ["42%", "72%"], []);

  const [lists, setLists] = useState<SharedEventListSummaryDto[]>([]);
  const [loading, setLoading] = useState(false);
  const [addingId, setAddingId] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const loadLists = useCallback(async () => {
    setLoading(true);
    setMessage(null);
    try {
      const svc = new SharedEventListService();
      const data = await svc.listMine();
      const editable = data.filter((l) => l.myRole === "OWNER" || l.myRole === "EDITOR");
      setLists(editable);
    } catch (e) {
      setMessage(normalizeHttpError(e, t("listsLoadError")).message);
    } finally {
      setLoading(false);
    }
  }, [t]);

  useEffect(() => {
    if (visible) {
      void loadLists();
    }
  }, [visible, loadLists]);

  const renderBackdrop = useCallback(
    (props: BottomSheetBackdropProps) => (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
        opacity={0.4}
        pressBehavior="close"
      />
    ),
    [],
  );

  async function pickList(listId: string) {
    if (!eventId || addingId) return;
    setAddingId(listId);
    setMessage(null);
    try {
      const svc = new SharedEventListService();
      await svc.addEvent(listId, eventId);
      onAdded?.();
      onClose();
    } catch (e) {
      const err = normalizeHttpError(e, t("error"));
      if (err.status === 409) {
        setMessage(t("alreadyInList"));
      } else {
        setMessage(err.message);
      }
    } finally {
      setAddingId(null);
    }
  }

  return (
    <BottomSheet
      index={visible ? 0 : -1}
      snapPoints={snapPoints}
      enablePanDownToClose
      onChange={(i) => {
        if (i === -1) onClose();
      }}
      backdropComponent={renderBackdrop}
      backgroundStyle={{ backgroundColor: c.background }}
      handleIndicatorStyle={{ backgroundColor: c.border }}>
      <BottomSheetFlatList
        data={loading ? [] : lists}
        keyExtractor={(it: SharedEventListSummaryDto) => it.id}
        contentContainerStyle={styles.list}
        ListHeaderComponent={
          <View style={styles.header}>
            <Text style={[styles.title, { color: c.text }]}>{t("addToWishlist")}</Text>
            <Text style={[styles.sub, { color: c.textSecondary }]}>{t("pickList")}</Text>
            {message ? (
              <Text style={[styles.msg, { color: AppPalette.error }]}>{message}</Text>
            ) : null}
            {loading ? <ActivityIndicator style={styles.loader} color={AppPalette.primary} /> : null}
            {!loading && lists.length === 0 ? (
              <Text style={[styles.hint, { color: c.textSecondary }]}>{t("noListsHint")}</Text>
            ) : null}
          </View>
        }
        renderItem={({ item }: ListRenderItemInfo<SharedEventListSummaryDto>) => (
          <Pressable
            style={[styles.row, { borderColor: c.border }]}
            onPress={() => void pickList(item.id)}
            disabled={addingId !== null}>
            <Text style={[styles.rowTitle, { color: c.text }]} numberOfLines={2}>
              {item.title}
            </Text>
            {addingId === item.id ? (
              <ActivityIndicator color={AppPalette.primary} size="small" />
            ) : null}
          </Pressable>
        )}
      />
    </BottomSheet>
  );
}

const styles = StyleSheet.create({
  header: { paddingHorizontal: 20, paddingBottom: 8 },
  title: { fontSize: 20, fontWeight: "700" },
  sub: { fontSize: 14, marginTop: 6 },
  msg: { fontSize: 14, marginTop: 8 },
  loader: { marginVertical: 16 },
  hint: { fontSize: 14, marginTop: 8 },
  list: { paddingHorizontal: 20, paddingBottom: 32, flexGrow: 1 },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
    gap: 12,
  },
  rowTitle: { flex: 1, fontSize: 16 },
});
