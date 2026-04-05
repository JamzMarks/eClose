import { useCallback, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Modal,
  Pressable,
  RefreshControl,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useFocusEffect, useRouter } from "expo-router";
import { useTranslation } from "react-i18next";

import { Screen } from "@/components/layout/screen";
import { TabScreenCenterError } from "@/components/shared/tab-screen/TabScreenCenterError";
import { AppPalette, getSchemeColors } from "@/constants/palette";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { SharedEventListService } from "@/infrastructure/api/shared-event-list/shared-event-list.service";
import type { SharedEventListSummaryDto } from "@/infrastructure/api/shared-event-list/shared-event-list.types";
import { normalizeHttpError } from "@/infrastructure/http/error-handler";

export function WishlistsIndexScreen() {
  const { t } = useTranslation("wishlists");
  const router = useRouter();
  const scheme = useColorScheme() ?? "light";
  const c = getSchemeColors(scheme);

  const [items, setItems] = useState<SharedEventListSummaryDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [createOpen, setCreateOpen] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [creating, setCreating] = useState(false);

  const load = useCallback(async () => {
    setError(null);
    const svc = new SharedEventListService();
    const data = await svc.listMine();
    setItems(data);
  }, []);

  useFocusEffect(
    useCallback(() => {
      let cancelled = false;
      setLoading(true);
      void (async () => {
        try {
          await load();
        } catch (e) {
          if (!cancelled) setError(normalizeHttpError(e, t("error")).message);
        } finally {
          if (!cancelled) setLoading(false);
        }
      })();
      return () => {
        cancelled = true;
      };
    }, [load, t]),
  );

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await load();
      setError(null);
    } catch (e) {
      setError(normalizeHttpError(e, t("error")).message);
    } finally {
      setRefreshing(false);
    }
  }, [load, t]);

  async function handleCreate() {
    const title = newTitle.trim();
    if (!title || creating) return;
    setCreating(true);
    try {
      const svc = new SharedEventListService();
      const created = await svc.create(title);
      setNewTitle("");
      setCreateOpen(false);
      setItems((prev) => [created, ...prev]);
      router.push(`/wishlists/${created.id}`);
    } catch (e) {
      setError(normalizeHttpError(e, t("error")).message);
    } finally {
      setCreating(false);
    }
  }

  if (loading && items.length === 0 && !error) {
    return (
      <Screen>
        <View style={[styles.centered, { backgroundColor: c.background }]}>
          <ActivityIndicator color={AppPalette.primary} size="large" />
          <Text style={[styles.hint, { color: c.textSecondary }]}>{t("loading")}</Text>
        </View>
      </Screen>
    );
  }

  if (error && items.length === 0) {
    return (
      <Screen>
        <TabScreenCenterError message={error} retryLabel={t("retry")} onRetry={() => void load()} />
      </Screen>
    );
  }

  return (
    <Screen>
      <FlatList
        data={items}
        keyExtractor={(it) => it.id}
        contentContainerStyle={[styles.list, { backgroundColor: c.background }]}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={AppPalette.primary} />
        }
        ListHeaderComponent={
          <Pressable
            style={[styles.newRow, { backgroundColor: c.surface, borderColor: c.border }]}
            onPress={() => setCreateOpen(true)}>
            <Text style={[styles.newRowText, { color: AppPalette.primary }]}>{t("newList")}</Text>
          </Pressable>
        }
        ListEmptyComponent={
          <Text style={[styles.empty, { color: c.textSecondary }]}>{t("empty")}</Text>
        }
        renderItem={({ item }) => (
          <Pressable
            style={[styles.card, { backgroundColor: c.surface, borderColor: c.border }]}
            onPress={() => router.push(`/wishlists/${item.id}`)}>
            <Text style={[styles.cardTitle, { color: c.text }]} numberOfLines={2}>
              {item.title}
            </Text>
            <Text style={[styles.cardMeta, { color: c.textSecondary }]}>
              {t("members", { count: item.memberCount, events: item.eventCount })}
            </Text>
            <Text style={[styles.cardRole, { color: c.textMuted }]}>
              {item.myRole === "OWNER"
                ? t("roleOwner")
                : item.myRole === "EDITOR"
                  ? t("roleEditor")
                  : t("roleViewer")}
            </Text>
          </Pressable>
        )}
      />

      <Modal visible={createOpen} animationType="slide" transparent onRequestClose={() => setCreateOpen(false)}>
        <View style={styles.modalRoot}>
          <Pressable style={styles.modalFlex} onPress={() => setCreateOpen(false)} />
          <View style={[styles.modalSheet, { backgroundColor: c.background }]}>
            <Text style={[styles.modalLabel, { color: c.text }]}>{t("newListTitle")}</Text>
            <TextInput
              value={newTitle}
              onChangeText={setNewTitle}
              placeholder={t("newListPlaceholder")}
              placeholderTextColor={c.textMuted}
              style={[styles.input, { color: c.text, borderColor: c.border }]}
              editable={!creating}
            />
            <View style={styles.modalActions}>
              <Pressable onPress={() => setCreateOpen(false)} style={styles.modalBtn}>
                <Text style={{ color: c.textSecondary }}>{t("cancel")}</Text>
              </Pressable>
              <Pressable
                onPress={() => void handleCreate()}
                style={[styles.modalBtnPrimary, { backgroundColor: AppPalette.primary }]}
                disabled={creating}>
                <Text style={styles.modalBtnPrimaryText}>{t("create")}</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </Screen>
  );
}

const styles = StyleSheet.create({
  centered: { flex: 1, justifyContent: "center", alignItems: "center" },
  hint: { marginTop: 12, fontSize: 15 },
  list: { padding: 16, paddingBottom: 32, flexGrow: 1 },
  newRow: {
    padding: 16,
    borderRadius: 12,
    borderWidth: StyleSheet.hairlineWidth,
    marginBottom: 12,
    alignItems: "center",
  },
  newRowText: { fontSize: 16, fontWeight: "700" },
  card: {
    padding: 16,
    borderRadius: 12,
    borderWidth: StyleSheet.hairlineWidth,
    marginBottom: 10,
  },
  cardTitle: { fontSize: 17, fontWeight: "600" },
  cardMeta: { fontSize: 14, marginTop: 6 },
  cardRole: { fontSize: 12, marginTop: 4, textTransform: "uppercase" },
  empty: { textAlign: "center", marginTop: 40, fontSize: 15, paddingHorizontal: 24 },
  modalRoot: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0,0,0,0.35)",
  },
  modalFlex: {
    flex: 1,
  },
  modalSheet: {
    padding: 24,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    marginTop: "auto",
  },
  modalLabel: { fontSize: 18, fontWeight: "700", marginBottom: 12 },
  input: {
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
  },
  modalActions: { flexDirection: "row", justifyContent: "flex-end", gap: 16, marginTop: 20 },
  modalBtn: { paddingVertical: 12, paddingHorizontal: 8 },
  modalBtnPrimary: { paddingVertical: 12, paddingHorizontal: 20, borderRadius: 12 },
  modalBtnPrimaryText: { color: "#fff", fontWeight: "700" },
});
