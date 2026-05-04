import { useCallback, useMemo, useState } from "react";
import { FlatList, Pressable, RefreshControl, StyleSheet, Text, TextInput, View } from "react-native";
import BottomSheet, {
  BottomSheetBackdrop,
  type BottomSheetBackdropProps,
  BottomSheetScrollView,
} from "@gorhom/bottom-sheet";
import { useFocusEffect, useNavigation, useRouter } from "expo-router";
import { useTranslation } from "react-i18next";

import { Screen } from "@/components/layout/screen";
import {
  CollapsingStackLargeTitle,
  collapsingScrollProps,
} from "@/components/navigation/collapsing-stack-header-title";
import { useStandardCollapsingTitle } from "@/components/navigation/use-standard-collapsing-title";
import { TabScreenCenterError } from "@/components/shared/tab-screen/TabScreenCenterError";
import { TabScreenCenterLoading } from "@/components/shared/tab-screen/TabScreenCenterLoading";
import { TabScreenEmptyHint } from "@/components/shared/tab-screen/TabScreenEmptyHint";
import { AppPalette, getSchemeColors } from "@/constants/palette";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { normalizeHttpError } from "@/infrastructure/http/error-handler";
import { SharedEventListService } from "@/services/shared-event-list/shared-event-list.service";
import type { SharedEventListSummaryDto } from "@/contracts/shared-event-list.types";

export type WishlistsIndexScreenProps = {
  /** Base path for list/detail routes (ex.: `/wishlists` ou `/settings/wishlists`). */
  hrefBase?: string;
};

export function WishlistsIndexScreen({ hrefBase = "/wishlists" }: WishlistsIndexScreenProps) {
  const { t } = useTranslation("wishlists");
  const { t: tCommon } = useTranslation("common");
  const navigation = useNavigation();
  const router = useRouter();
  const scheme = useColorScheme() ?? "light";
  const c = getSchemeColors(scheme);
  const isDark = scheme === "dark";
  const snapPoints = useMemo(() => ["38%", "55%"], []);

  const collapse = useStandardCollapsingTitle({
    navigation,
    title: t("title"),
    headerTitleColor: c.text,
    headerBackgroundColor: c.background,
    tintColor: c.text,
    scheme: isDark ? "dark" : "light",
    backAccessibilityLabel: tCommon("backA11y"),
  });

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

  const retryInitial = useCallback(() => {
    setLoading(true);
    void (async () => {
      try {
        await load();
      } catch (e) {
        setError(normalizeHttpError(e, t("error")).message);
      } finally {
        setLoading(false);
      }
    })();
  }, [load, t]);

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
      router.push(`${hrefBase}/${created.id}`);
    } catch (e) {
      setError(normalizeHttpError(e, t("error")).message);
    } finally {
      setCreating(false);
    }
  }

  const titleEl = (
    <CollapsingStackLargeTitle color={c.text} collapse={collapse}>
      {t("title")}
    </CollapsingStackLargeTitle>
  );

  if (loading && items.length === 0 && !error) {
    return (
      <Screen edges={["bottom"]}>
        <View style={styles.titleWrap}>{titleEl}</View>
        <TabScreenCenterLoading message={t("loading")} subtitleColor={c.textSecondary} />
      </Screen>
    );
  }

  if (error && items.length === 0) {
    return (
      <Screen edges={["bottom"]}>
        <View style={styles.titleWrap}>{titleEl}</View>
        <TabScreenCenterError message={error} retryLabel={t("retry")} onRetry={retryInitial} />
      </Screen>
    );
  }

  return (
    <Screen edges={["bottom"]}>
      <FlatList
        data={items}
        keyExtractor={(it) => it.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.list, { backgroundColor: c.background }]}
        {...collapsingScrollProps(collapse)}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={AppPalette.primary} />
        }
        ListHeaderComponent={
          <View>
            {titleEl}
            <Pressable
              style={[styles.newRow, { backgroundColor: c.surface, borderColor: c.border }]}
              onPress={() => setCreateOpen(true)}>
              <Text style={[styles.newRowText, { color: AppPalette.primary }]}>{t("newList")}</Text>
            </Pressable>
          </View>
        }
        ListEmptyComponent={
          <TabScreenEmptyHint message={t("empty")} color={c.textSecondary} minHeight={220} />
        }
        renderItem={({ item }) => (
          <Pressable
            style={[styles.card, { backgroundColor: c.surface, borderColor: c.border }]}
            onPress={() => router.push(`${hrefBase}/${item.id}`)}>
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

      <BottomSheet
        index={createOpen ? 0 : -1}
        snapPoints={snapPoints}
        enablePanDownToClose
        onChange={(i) => {
          if (i === -1) setCreateOpen(false);
        }}
        backdropComponent={renderBackdrop}
        backgroundStyle={{ backgroundColor: c.surface }}
        handleIndicatorStyle={{ backgroundColor: c.border }}>
        <BottomSheetScrollView
          contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 32 }}
          keyboardShouldPersistTaps="handled">
          <Text style={[styles.sheetLabel, { color: c.text }]}>{t("newListTitle")}</Text>
          <TextInput
            value={newTitle}
            onChangeText={setNewTitle}
            placeholder={t("newListPlaceholder")}
            placeholderTextColor={c.textMuted}
            style={[styles.input, { color: c.text, borderColor: c.border }]}
            editable={!creating}
          />
          <View style={styles.sheetActions}>
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
        </BottomSheetScrollView>
      </BottomSheet>
    </Screen>
  );
}

const styles = StyleSheet.create({
  titleWrap: { paddingHorizontal: 16, paddingTop: 8 },
  list: { paddingHorizontal: 16, paddingBottom: 32, flexGrow: 1 },
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
  sheetLabel: { fontSize: 18, fontWeight: "700", marginBottom: 12, marginTop: 8 },
  input: {
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
  },
  sheetActions: { flexDirection: "row", justifyContent: "flex-end", gap: 16, marginTop: 20 },
  modalBtn: { paddingVertical: 12, paddingHorizontal: 8 },
  modalBtnPrimary: { paddingVertical: 12, paddingHorizontal: 20, borderRadius: 12 },
  modalBtnPrimaryText: { color: "#fff", fontWeight: "700" },
});
