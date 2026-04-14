import { useEffect, useLayoutEffect, useState } from "react";
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from "react-native";
import { useLocalSearchParams, useNavigation } from "expo-router";
import { useTranslation } from "react-i18next";

import { AppPalette, getSchemeColors } from "@/constants/palette";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { normalizeHttpError } from "@/infrastructure/http/error-handler";
import { EventService } from "@/services/event/event.service";
import type { EventDto } from "@/services/types/event.types";
import { formatEventRange } from "@/lib/format-date";

export default function EventOrganizerScreen() {
  const { id: rawId } = useLocalSearchParams<{ id: string }>();
  const id = Array.isArray(rawId) ? rawId[0] : rawId;
  const navigation = useNavigation();
  const { t } = useTranslation("discover");
  const scheme = useColorScheme() ?? "light";
  const c = getSchemeColors(scheme);

  const [event, setEvent] = useState<EventDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useLayoutEffect(() => {
    navigation.setOptions({
      title: t("eventOrganizerTitle"),
      headerTintColor: AppPalette.primary,
      headerStyle: { backgroundColor: c.surface },
      headerTitleStyle: { color: c.text },
    });
  }, [navigation, t, c.surface, c.text]);

  useEffect(() => {
    if (!id) {
      setLoading(false);
      setError("—");
      return;
    }
    let cancelled = false;
    setLoading(true);
    setError(null);
    void (async () => {
      try {
        const svc = new EventService();
        const e = await svc.getOrganizerView(id);
        if (!cancelled) setEvent(e);
      } catch (err) {
        if (!cancelled) setError(normalizeHttpError(err, t("error")).message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [id, t]);

  if (loading) {
    return (
      <View style={[styles.centered, { backgroundColor: c.background }]}>
        <ActivityIndicator color={AppPalette.primary} size="large" />
      </View>
    );
  }

  if (error || !event) {
    return (
      <View style={[styles.centered, { backgroundColor: c.background }]}>
        <Text style={[styles.err, { color: c.text }]}>{error ?? t("error")}</Text>
      </View>
    );
  }

  return (
    <ScrollView style={[styles.scroll, { backgroundColor: c.background }]} contentContainerStyle={styles.content}>
      <Text style={[styles.title, { color: c.text }]}>{event.title}</Text>
      <Text style={[styles.meta, { color: c.textSecondary }]}>
        {formatEventRange(event.startsAt, event.endsAt)}
      </Text>
      <Text style={[styles.kv, { color: c.textMuted }]}>Status</Text>
      <Text style={[styles.val, { color: c.text }]}>{event.status}</Text>
      <Text style={[styles.kv, { color: c.textMuted }]}>Slug</Text>
      <Text style={[styles.val, { color: c.text }]}>{event.slug}</Text>
      <Text style={[styles.kv, { color: c.textMuted }]}>ID</Text>
      <Text style={[styles.val, { color: c.text }]} selectable>
        {event.id}
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1 },
  content: { padding: 20, paddingBottom: 40 },
  centered: { flex: 1, justifyContent: "center", alignItems: "center" },
  title: { fontSize: 22, fontWeight: "700", marginBottom: 8 },
  meta: { fontSize: 15, marginBottom: 20 },
  kv: { fontSize: 12, fontWeight: "600", textTransform: "uppercase", marginTop: 12 },
  val: { fontSize: 16, marginTop: 4 },
  err: { textAlign: "center", paddingHorizontal: 24 },
});
