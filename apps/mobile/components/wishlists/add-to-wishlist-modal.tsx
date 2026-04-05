import { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useTranslation } from "react-i18next";

import { AppPalette, getSchemeColors } from "@/constants/palette";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { SharedEventListService } from "@/infrastructure/api/shared-event-list/shared-event-list.service";
import type { SharedEventListSummaryDto } from "@/infrastructure/api/shared-event-list/shared-event-list.types";
import { normalizeHttpError } from "@/infrastructure/http/error-handler";

export type AddToWishlistModalProps = {
  visible: boolean;
  eventId: string;
  onClose: () => void;
  onAdded?: () => void;
};

export function AddToWishlistModal({ visible, eventId, onClose, onAdded }: AddToWishlistModalProps) {
  const { t } = useTranslation("wishlists");
  const scheme = useColorScheme() ?? "light";
  const c = getSchemeColors(scheme);

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
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View style={styles.modalRoot}>
        <Pressable style={styles.modalFlex} onPress={onClose} />
        <View style={[styles.sheet, { backgroundColor: c.background }]}>
          <Text style={[styles.title, { color: c.text }]}>{t("addToWishlist")}</Text>
          <Text style={[styles.sub, { color: c.textSecondary }]}>{t("pickList")}</Text>
          {message ? (
            <Text style={[styles.msg, { color: AppPalette.error }]}>{message}</Text>
          ) : null}
          {loading ? (
            <ActivityIndicator style={styles.loader} color={AppPalette.primary} />
          ) : lists.length === 0 ? (
            <Text style={[styles.hint, { color: c.textSecondary }]}>{t("noListsHint")}</Text>
          ) : (
            <FlatList
              data={lists}
              keyExtractor={(it) => it.id}
              style={styles.list}
              renderItem={({ item }) => (
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
          )}
          <Pressable style={styles.closeBtn} onPress={onClose}>
            <Text style={{ color: c.textSecondary, fontWeight: "600" }}>{t("cancel")}</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalRoot: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0,0,0,0.35)",
  },
  modalFlex: { flex: 1 },
  sheet: {
    maxHeight: "70%",
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 24,
  },
  title: { fontSize: 20, fontWeight: "700" },
  sub: { fontSize: 14, marginTop: 6, marginBottom: 12 },
  msg: { fontSize: 14, marginBottom: 8 },
  loader: { marginVertical: 24 },
  hint: { fontSize: 14, marginVertical: 16 },
  list: { maxHeight: 320 },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
    gap: 12,
  },
  rowTitle: { flex: 1, fontSize: 16 },
  closeBtn: { alignSelf: "center", marginTop: 16, padding: 8 },
});
