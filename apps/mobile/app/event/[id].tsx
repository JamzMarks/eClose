import { useEffect, useLayoutEffect, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { Image } from "expo-image";
import { useLocalSearchParams, useNavigation } from "expo-router";
import { useTranslation } from "react-i18next";

import { AddToWishlistSheet } from "@/components/wishlists/add-to-wishlist-sheet";
import { AppPalette, getSchemeColors } from "@/constants/palette";
import { useAuth } from "@/contexts/auth-context";
import { EventService } from "@/services/event/event.service";
import type { EventDto } from "@/services/types/event.types";
import { normalizeHttpError } from "@/infrastructure/http/error-handler";
import { formatEventRange } from "@/lib/format-date";
import { useColorScheme } from "@/hooks/use-color-scheme";

export default function EventDetailScreen() {
  const { id: rawId } = useLocalSearchParams<{ id: string }>();
  const id = Array.isArray(rawId) ? rawId[0] : rawId;
  const navigation = useNavigation();
  const { t } = useTranslation("discover");
  const { t: tWishlists } = useTranslation("wishlists");
  const { isSignedIn } = useAuth();
  const scheme = useColorScheme() ?? "light";
  const c = getSchemeColors(scheme);

  const [event, setEvent] = useState<EventDto | null>(null);
  const [wishlistOpen, setWishlistOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useLayoutEffect(() => {
    navigation.setOptions({
      title: event?.title ?? t("eventDetail"),
      headerTintColor: AppPalette.primary,
      headerStyle: { backgroundColor: c.surface },
      headerTitleStyle: { color: c.text },
      headerRight:
        isSignedIn && id
          ? () => (
              <Pressable onPress={() => setWishlistOpen(true)} hitSlop={12} style={{ marginRight: 12 }}>
                <Text style={{ color: AppPalette.primary, fontWeight: "600", fontSize: 15 }}>
                  {tWishlists("addToWishlist")}
                </Text>
              </Pressable>
            )
          : undefined,
    });
  }, [navigation, event?.title, t, c.surface, c.text, isSignedIn, id, tWishlists]);

  useEffect(() => {
    if (!id) {
      setLoading(false);
      setError("—");
      return;
    }
    const svc = new EventService();
    let cancelled = false;
    setLoading(true);
    setError(null);
    void (async () => {
      try {
        const e = await svc.getPublicById(id);
        if (!cancelled) setEvent(e);
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

  if (error || !event) {
    return (
      <View style={[styles.centered, { backgroundColor: c.background }]}>
        <Text style={[styles.err, { color: c.text }]}>{error ?? t("error")}</Text>
      </View>
    );
  }

  const adhocCity =
    typeof event.adhocAddress === "object" &&
    event.adhocAddress &&
    "city" in event.adhocAddress
      ? String((event.adhocAddress as { city?: string }).city ?? "").trim()
      : "";
  const locationLine =
    event.locationLabel?.trim() ||
    adhocCity ||
    (event.locationMode === "ONLINE" || event.locationMode === "HYBRID"
      ? t("online")
      : "—");

  return (
    <>
    <ScrollView
      style={[styles.scroll, { backgroundColor: c.background }]}
      contentContainerStyle={styles.content}
    >
      {event.primaryMediaUrl?.trim() ? (
        <Image
          source={{ uri: event.primaryMediaUrl }}
          style={styles.hero}
          contentFit="cover"
          accessibilityLabel={event.title}
        />
      ) : null}
      <Text style={[styles.title, { color: c.text }]}>{event.title}</Text>
      <Text style={[styles.meta, { color: c.textSecondary }]}>
        {formatEventRange(event.startsAt, event.endsAt)}
      </Text>
      <Text style={[styles.section, { color: c.textMuted }]}>{t("location")}</Text>
      <Text style={[styles.body, { color: c.text }]}>{locationLine}</Text>
      {event.description?.trim() ? (
        <>
          <Text style={[styles.section, { color: c.textMuted }]}>
            {t("description")}
          </Text>
          <Text style={[styles.body, { color: c.text }]}>{event.description}</Text>
        </>
      ) : null}
    </ScrollView>
    {id ? (
      <AddToWishlistSheet
        visible={wishlistOpen}
        eventId={id}
        onClose={() => setWishlistOpen(false)}
      />
    ) : null}
    </>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1 },
  content: { padding: 20, paddingBottom: 40 },
  hero: {
    width: "100%",
    height: 200,
    borderRadius: 12,
    marginBottom: 16,
    backgroundColor: "#E7E5E4",
  },
  centered: { flex: 1, justifyContent: "center", alignItems: "center" },
  title: { fontSize: 24, fontWeight: "700", marginBottom: 8 },
  meta: { fontSize: 15, marginBottom: 20 },
  section: { fontSize: 13, fontWeight: "600", textTransform: "uppercase", marginTop: 16, marginBottom: 6 },
  body: { fontSize: 16, lineHeight: 24 },
  err: { textAlign: "center", paddingHorizontal: 24 },
});
