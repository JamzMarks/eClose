import { useEffect, useLayoutEffect, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useLocalSearchParams, useNavigation } from "expo-router";
import { useTranslation } from "react-i18next";

import { AppPalette, getSchemeColors } from "@/constants/palette";
import type { VenueDto } from "@/infrastructure/api/types/venue.types";
import { VenueService } from "@/infrastructure/api/venue/venue.service";
import { normalizeHttpError } from "@/infrastructure/http/error-handler";
import { useColorScheme } from "@/hooks/use-color-scheme";

export default function VenueDetailScreen() {
  const { id: rawId } = useLocalSearchParams<{ id: string }>();
  const id = Array.isArray(rawId) ? rawId[0] : rawId;
  const navigation = useNavigation();
  const { t } = useTranslation("discover");
  const scheme = useColorScheme() ?? "light";
  const c = getSchemeColors(scheme);

  const [venue, setVenue] = useState<VenueDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useLayoutEffect(() => {
    navigation.setOptions({
      title: venue?.name ?? t("venueDetail"),
      headerTintColor: AppPalette.primary,
      headerStyle: { backgroundColor: c.surface },
      headerTitleStyle: { color: c.text },
    });
  }, [navigation, venue?.name, t, c.surface, c.text]);

  useEffect(() => {
    if (!id) {
      setLoading(false);
      setError("—");
      return;
    }
    const svc = new VenueService();
    let cancelled = false;
    setLoading(true);
    setError(null);
    void (async () => {
      try {
        const v = await svc.getById(id);
        if (!cancelled) setVenue(v);
      } catch (err) {
        if (!cancelled) {
          setError(normalizeHttpError(err, t("error")).message);
        }
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

  if (error || !venue) {
    return (
      <View style={[styles.centered, { backgroundColor: c.background }]}>
        <Text style={[styles.err, { color: c.text }]}>{error ?? t("error")}</Text>
      </View>
    );
  }

  const addr = venue.address;
  const addressLine = [addr.line1, addr.postalCode, addr.city, addr.region]
    .filter(Boolean)
    .join(", ");

  return (
    <ScrollView
      style={[styles.scroll, { backgroundColor: c.background }]}
      contentContainerStyle={styles.content}
    >
      <Text style={[styles.title, { color: c.text }]}>{venue.name}</Text>
      <Text style={[styles.section, { color: c.textMuted }]}>{t("location")}</Text>
      <Text style={[styles.body, { color: c.text }]}>{addressLine}</Text>
      {venue.description?.trim() ? (
        <>
          <Text style={[styles.section, { color: c.textMuted }]}>
            {t("description")}
          </Text>
          <Text style={[styles.body, { color: c.text }]}>{venue.description}</Text>
        </>
      ) : null}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1 },
  content: { padding: 20, paddingBottom: 40 },
  centered: { flex: 1, justifyContent: "center", alignItems: "center" },
  title: { fontSize: 24, fontWeight: "700", marginBottom: 16 },
  section: { fontSize: 13, fontWeight: "600", textTransform: "uppercase", marginTop: 16, marginBottom: 6 },
  body: { fontSize: 16, lineHeight: 24 },
  err: { textAlign: "center", paddingHorizontal: 24 },
});
