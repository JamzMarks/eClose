import { useCallback, useEffect, useLayoutEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Pressable,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useLocalSearchParams, useNavigation, useRouter } from "expo-router";
import { useTranslation } from "react-i18next";

import { Screen } from "@/components/layout/screen";
import { TabScreenCenterError } from "@/components/shared/tab-screen/TabScreenCenterError";
import { AppPalette, getSchemeColors } from "@/constants/palette";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { SharedEventListService } from "@/services/shared-event-list/shared-event-list.service";
import type {
  SharedEventListDetailDto,
  SharedListEventRowDto,
} from "@/services/shared-event-list/shared-event-list.types";
import { normalizeHttpError } from "@/infrastructure/http/error-handler";
import { formatEventRange } from "@/lib/format-date";

export function WishlistDetailScreen() {
  const { id: rawId } = useLocalSearchParams<{ id: string }>();
  const listId = Array.isArray(rawId) ? rawId[0] : rawId;
  const { t } = useTranslation("wishlists");
  const { t: tDiscover } = useTranslation("discover");
  const router = useRouter();
  const navigation = useNavigation();
  const scheme = useColorScheme() ?? "light";
  const c = getSchemeColors(scheme);

  const [detail, setDetail] = useState<SharedEventListDetailDto | null>(null);
  const [events, setEvents] = useState<SharedListEventRowDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const canEditEvents = detail?.myRole === "OWNER" || detail?.myRole === "EDITOR";

  const load = useCallback(async () => {
    if (!listId) return;
    setError(null);
    const svc = new SharedEventListService();
    const [d, evs] = await Promise.all([svc.getDetail(listId), svc.listEvents(listId)]);
    setDetail(d);
    setEvents(evs);
  }, [listId]);

  const handleDeleteList = useCallback(async () => {
    if (!listId) return;
    try {
      const svc = new SharedEventListService();
      await svc.deleteList(listId);
      router.back();
    } catch (e) {
      setError(normalizeHttpError(e, t("error")).message);
    }
  }, [listId, router, t]);

  useEffect(() => {
    if (!listId) {
      setLoading(false);
      setError("—");
      return;
    }
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
  }, [listId, load, t]);

  useLayoutEffect(() => {
    navigation.setOptions({
      title: detail?.title ?? t("detailTitle"),
      headerTintColor: AppPalette.primary,
      headerStyle: { backgroundColor: c.surface },
      headerTitleStyle: { color: c.text },
      headerRight:
        detail?.myRole === "OWNER"
          ? () => (
              <Pressable
                onPress={() =>
                  Alert.alert(t("deleteList"), t("deleteListConfirm"), [
                    { text: t("cancel"), style: "cancel" },
                    {
                      text: t("deleteList"),
                      style: "destructive",
                      onPress: () => void handleDeleteList(),
                    },
                  ])
                }
                hitSlop={12}
                style={{ marginRight: 12 }}>
                <Text style={{ color: AppPalette.error, fontWeight: "600" }}>{t("deleteList")}</Text>
              </Pressable>
            )
          : undefined,
    });
  }, [navigation, detail?.title, detail?.myRole, c.surface, c.text, t, handleDeleteList]);

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

  async function handleRemoveEvent(eventId: string) {
    if (!listId) return;
    try {
      const svc = new SharedEventListService();
      await svc.removeEvent(listId, eventId);
      setEvents((prev) => prev.filter((e) => e.id !== eventId));
      setDetail((d) =>
        d ? { ...d, eventCount: Math.max(0, d.eventCount - 1) } : d,
      );
    } catch (e) {
      setError(normalizeHttpError(e, t("error")).message);
    }
  }

  if (loading && !detail) {
    return (
      <Screen>
        <View style={[styles.centered, { backgroundColor: c.background }]}>
          <ActivityIndicator color={AppPalette.primary} size="large" />
        </View>
      </Screen>
    );
  }

  if (error && !detail) {
    return (
      <Screen>
        <TabScreenCenterError message={error} retryLabel={t("retry")} onRetry={() => void load()} />
      </Screen>
    );
  }

  if (!detail) {
    return null;
  }

  const locationLine = (row: SharedListEventRowDto) =>
    row.locationLabel?.trim() ||
    (row.locationMode === "ONLINE" || row.locationMode === "HYBRID" ? tDiscover("online") : "—");

  return (
    <Screen>
      <FlatList
        data={events}
        keyExtractor={(it) => it.id}
        contentContainerStyle={[styles.list, { backgroundColor: c.background }]}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={AppPalette.primary} />
        }
        ListHeaderComponent={
          <View style={styles.headerBlock}>
            <Text style={[styles.meta, { color: c.textSecondary }]}>
              {t("members", { count: detail.memberCount, events: detail.eventCount })}
            </Text>
          </View>
        }
        ListEmptyComponent={
          <Text style={[styles.empty, { color: c.textSecondary }]}>{t("eventsEmpty")}</Text>
        }
        renderItem={({ item }) => (
          <View style={[styles.eventCard, { borderColor: c.border, backgroundColor: c.surface }]}>
            <Pressable onPress={() => router.push(`/event/${item.id}`)}>
              <Text style={[styles.eventTitle, { color: c.text }]}>{item.title}</Text>
              <Text style={[styles.eventMeta, { color: c.textSecondary }]}>
                {formatEventRange(item.startsAt, item.endsAt)}
              </Text>
              <Text style={[styles.eventLoc, { color: c.textMuted }]}>{locationLine(item)}</Text>
            </Pressable>
            {canEditEvents ? (
              <Pressable
                style={styles.removeBtn}
                onPress={() =>
                  Alert.alert(t("removeEvent"), undefined, [
                    { text: t("cancel"), style: "cancel" },
                    {
                      text: t("removeEvent"),
                      style: "destructive",
                      onPress: () => void handleRemoveEvent(item.id),
                    },
                  ])
                }>
                <Text style={{ color: AppPalette.error, fontSize: 14 }}>{t("removeEvent")}</Text>
              </Pressable>
            ) : null}
          </View>
        )}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  centered: { flex: 1, justifyContent: "center", alignItems: "center" },
  list: { padding: 16, paddingBottom: 32, flexGrow: 1 },
  headerBlock: { marginBottom: 12 },
  meta: { fontSize: 14 },
  empty: { textAlign: "center", marginTop: 32, fontSize: 15 },
  eventCard: {
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
  },
  eventTitle: { fontSize: 17, fontWeight: "600" },
  eventMeta: { fontSize: 14, marginTop: 4 },
  eventLoc: { fontSize: 13, marginTop: 4 },
  removeBtn: { marginTop: 10, alignSelf: "flex-start" },
});
