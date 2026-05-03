import { useCallback, useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Modal,
  Pressable,
  RefreshControl,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useLocalSearchParams, useNavigation, useRouter } from "expo-router";
import { useTranslation } from "react-i18next";

import { Screen } from "@/components/layout/screen";
import {
  CollapsingStackLargeTitle,
  collapsingScrollProps,
} from "@/components/navigation/collapsing-stack-header-title";
import { useStandardCollapsingTitle } from "@/components/navigation/use-standard-collapsing-title";
import { TabScreenCenterError } from "@/components/shared/tab-screen/TabScreenCenterError";
import { AppPalette, getSchemeColors } from "@/constants/palette";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { SharedEventListService } from "@/services/shared-event-list/shared-event-list.service";
import type {
  SharedEventListDetailDto,
  SharedListEventRowDto,
} from "@/contracts/shared-event-list.types";
import { normalizeHttpError } from "@/infrastructure/http/error-handler";
import { formatEventRange } from "@/lib/format-date";

export function WishlistDetailScreen() {
  const { id: rawId } = useLocalSearchParams<{ id: string }>();
  const listId = Array.isArray(rawId) ? rawId[0] : rawId;
  const { t } = useTranslation("wishlists");
  const { t: tCommon } = useTranslation("common");
  const { t: tDiscover } = useTranslation("discover");
  const router = useRouter();
  const navigation = useNavigation();
  const scheme = useColorScheme() ?? "light";
  const c = getSchemeColors(scheme);
  const isDark = scheme === "dark";

  const [detail, setDetail] = useState<SharedEventListDetailDto | null>(null);
  const [events, setEvents] = useState<SharedListEventRowDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [addMemberOpen, setAddMemberOpen] = useState(false);
  const [newMemberId, setNewMemberId] = useState("");
  const [newMemberRole, setNewMemberRole] = useState<"EDITOR" | "VIEWER">("VIEWER");

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

  const headerRight = useMemo(() => {
    if (detail?.myRole !== "OWNER") return undefined;
    const HeaderRight = () => (
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
        accessibilityRole="button"
        accessibilityLabel={t("deleteList")}>
        <Text style={{ color: AppPalette.error, fontWeight: "600" }}>{t("deleteList")}</Text>
      </Pressable>
    );
    HeaderRight.displayName = "WishlistDetailHeaderRight";
    return HeaderRight;
  }, [detail?.myRole, handleDeleteList, t]);

  const collapse = useStandardCollapsingTitle({
    navigation,
    title: detail?.title ?? t("title"),
    headerTitleColor: c.text,
    headerBackgroundColor: c.background,
    tintColor: c.text,
    scheme: isDark ? "dark" : "light",
    backAccessibilityLabel: tCommon("backA11y"),
    minimalHeaderOptions: { headerRight },
  });

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

  function roleLabel(role: string) {
    if (role === "OWNER") return t("roleOwner");
    if (role === "EDITOR") return t("roleEditor");
    return t("roleViewer");
  }

  async function handleAddMember() {
    if (!listId || !newMemberId.trim()) return;
    try {
      const svc = new SharedEventListService();
      await svc.addMember(listId, newMemberId.trim(), newMemberRole);
      setAddMemberOpen(false);
      setNewMemberId("");
      await load();
      Alert.alert("", t("memberAdded"));
    } catch (e) {
      setError(normalizeHttpError(e, t("error")).message);
    }
  }

  async function handleRemoveMember(userId: string) {
    if (!listId) return;
    try {
      const svc = new SharedEventListService();
      await svc.removeMember(listId, userId);
      await load();
    } catch (e) {
      setError(normalizeHttpError(e, t("error")).message);
    }
  }

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
      <Screen edges={["bottom"]}>
        <View style={[styles.centered, { backgroundColor: c.background }]}>
          <ActivityIndicator color={AppPalette.primary} size="large" />
        </View>
      </Screen>
    );
  }

  if (error && !detail) {
    return (
      <Screen edges={["bottom"]}>
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
    <Screen edges={["bottom"]}>
      <Modal visible={addMemberOpen} animationType="slide" transparent>
        <View style={styles.modalBackdrop}>
          <View style={[styles.modalCard, { backgroundColor: c.surface, borderColor: c.border }]}>
            <Text style={[styles.modalTitle, { color: c.text }]}>{t("addMember")}</Text>
            <Text style={[styles.modalLabel, { color: c.textSecondary }]}>{t("memberUserIdLabel")}</Text>
            <TextInput
              value={newMemberId}
              onChangeText={setNewMemberId}
              placeholder={t("memberUserIdLabel")}
              placeholderTextColor={c.textMuted}
              autoCapitalize="none"
              style={[styles.modalInput, { color: c.text, borderColor: c.border }]}
            />
            <Text style={[styles.modalLabel, { color: c.textSecondary }]}>{t("memberRolePick")}</Text>
            <View style={styles.roleRow}>
              <Pressable
                onPress={() => setNewMemberRole("EDITOR")}
                style={[
                  styles.roleChip,
                  { borderColor: newMemberRole === "EDITOR" ? AppPalette.primary : c.border },
                ]}>
                <Text style={{ color: c.text, fontWeight: "600" }}>{t("roleEditor")}</Text>
              </Pressable>
              <Pressable
                onPress={() => setNewMemberRole("VIEWER")}
                style={[
                  styles.roleChip,
                  { borderColor: newMemberRole === "VIEWER" ? AppPalette.primary : c.border },
                ]}>
                <Text style={{ color: c.text, fontWeight: "600" }}>{t("roleViewer")}</Text>
              </Pressable>
            </View>
            <View style={styles.modalActions}>
              <Pressable onPress={() => setAddMemberOpen(false)} style={styles.modalBtn}>
                <Text style={{ color: c.textSecondary, fontWeight: "600" }}>{t("cancel")}</Text>
              </Pressable>
              <Pressable onPress={() => void handleAddMember()} style={styles.modalBtn}>
                <Text style={{ color: AppPalette.primary, fontWeight: "700" }}>{t("create")}</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
      <FlatList
        data={events}
        keyExtractor={(it) => it.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.list, { backgroundColor: c.background }]}
        {...collapsingScrollProps(collapse)}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={AppPalette.primary} />
        }
        ListHeaderComponent={
          <View style={styles.headerBlock}>
            <CollapsingStackLargeTitle color={c.text} collapse={collapse}>
              {detail.title}
            </CollapsingStackLargeTitle>
            <Text style={[styles.meta, { color: c.textSecondary }]}>
              {t("members", { count: detail.memberCount, events: detail.eventCount })}
            </Text>
            <Text style={[styles.sectionTitle, { color: c.text }]}>{t("membersSection")}</Text>
            {detail.members.map((m) => (
              <View
                key={m.userId}
                style={[styles.memberRow, { borderColor: c.border, backgroundColor: c.surface }]}>
                <Text style={[styles.memberId, { color: c.text }]} numberOfLines={1} selectable>
                  {m.userId}
                </Text>
                <Text style={[styles.memberRole, { color: c.textSecondary }]}>
                  {roleLabel(m.role)}
                </Text>
                {detail.myRole === "OWNER" && m.role !== "OWNER" ? (
                  <Pressable
                    onPress={() =>
                      Alert.alert(t("removeMember"), undefined, [
                        { text: t("cancel"), style: "cancel" },
                        {
                          text: t("removeMember"),
                          style: "destructive",
                          onPress: () => void handleRemoveMember(m.userId),
                        },
                      ])
                    }>
                    <Text style={{ color: AppPalette.error, fontSize: 14 }}>{t("removeMember")}</Text>
                  </Pressable>
                ) : null}
              </View>
            ))}
            {detail.myRole === "OWNER" ? (
              <Pressable
                onPress={() => setAddMemberOpen(true)}
                style={[styles.addMemberBtn, { borderColor: AppPalette.primary }]}>
                <Text style={{ color: AppPalette.primary, fontWeight: "700" }}>{t("addMember")}</Text>
              </Pressable>
            ) : null}
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
  sectionTitle: { fontSize: 16, fontWeight: "700", marginTop: 20, marginBottom: 10 },
  memberRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: 10,
    padding: 10,
    marginBottom: 8,
  },
  memberId: { flex: 1, fontSize: 13 },
  memberRole: { fontSize: 13, fontWeight: "600" },
  addMemberBtn: {
    alignSelf: "flex-start",
    marginTop: 8,
    marginBottom: 8,
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 10,
    borderWidth: StyleSheet.hairlineWidth,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    padding: 24,
  },
  modalCard: {
    borderRadius: 16,
    borderWidth: StyleSheet.hairlineWidth,
    padding: 20,
  },
  modalTitle: { fontSize: 18, fontWeight: "700", marginBottom: 12 },
  modalLabel: { fontSize: 13, fontWeight: "600", marginBottom: 6, marginTop: 8 },
  modalInput: {
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
  },
  roleRow: { flexDirection: "row", gap: 10, marginTop: 8 },
  roleChip: {
    flex: 1,
    paddingVertical: 10,
    alignItems: "center",
    borderRadius: 10,
    borderWidth: StyleSheet.hairlineWidth,
  },
  modalActions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 16,
    marginTop: 20,
  },
  modalBtn: { paddingVertical: 8, paddingHorizontal: 4 },
});
