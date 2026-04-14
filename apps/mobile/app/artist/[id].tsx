import { useEffect, useLayoutEffect, useState } from "react";
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useLocalSearchParams, useNavigation, useRouter, type Href } from "expo-router";
import { useTranslation } from "react-i18next";

import { AppPalette, getSchemeColors } from "@/constants/palette";
import { useAuth } from "@/contexts/auth-context";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { normalizeHttpError } from "@/infrastructure/http/error-handler";
import { ArtistService } from "@/services/artist/artist.service";
import type { ArtistDto } from "@/services/types/artist.types";

export default function ArtistDetailScreen() {
  const { id: rawId } = useLocalSearchParams<{ id: string }>();
  const id = Array.isArray(rawId) ? rawId[0] : rawId;
  const navigation = useNavigation();
  const router = useRouter();
  const { t } = useTranslation("discover");
  const { isSignedIn } = useAuth();
  const scheme = useColorScheme() ?? "light";
  const c = getSchemeColors(scheme);

  const [artist, setArtist] = useState<ArtistDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useLayoutEffect(() => {
    navigation.setOptions({
      title: artist?.name ?? t("artistDetail"),
      headerTintColor: AppPalette.primary,
      headerStyle: { backgroundColor: c.surface },
      headerTitleStyle: { color: c.text },
    });
  }, [navigation, artist?.name, t, c.surface, c.text]);

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
        const svc = new ArtistService();
        const a = await svc.getById(id);
        if (cancelled) return;
        setArtist(a);
      } catch (e) {
        if (!cancelled) setError(normalizeHttpError(e, t("error")).message);
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

  if (error || !artist) {
    return (
      <View style={[styles.centered, { backgroundColor: c.background }]}>
        <Text style={[styles.err, { color: c.text }]}>{error ?? t("error")}</Text>
      </View>
    );
  }

  return (
    <ScrollView style={[styles.scroll, { backgroundColor: c.background }]} contentContainerStyle={styles.content}>
      <Text style={[styles.title, { color: c.text }]}>{artist.name}</Text>
      {artist.headline ? (
        <Text style={[styles.headline, { color: c.textSecondary }]}>{artist.headline}</Text>
      ) : null}
      {artist.bio?.trim() ? (
        <Text style={[styles.bio, { color: c.text }]}>{artist.bio}</Text>
      ) : null}
      {isSignedIn && artist.openToVenueBookings ? (
        <Pressable
          onPress={() =>
            router.push({
              pathname: "/booking/new-inquiry",
              params: { artistId: artist.id },
            } as Href)
          }
          style={[styles.cta, { backgroundColor: AppPalette.primary }]}>
          <Text style={styles.ctaText}>{t("bookingInquiryTitle")}</Text>
        </Pressable>
      ) : null}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1 },
  content: { padding: 20, paddingBottom: 40 },
  centered: { flex: 1, justifyContent: "center", alignItems: "center" },
  title: { fontSize: 24, fontWeight: "700", marginBottom: 8 },
  headline: { fontSize: 16, marginBottom: 12 },
  bio: { fontSize: 16, lineHeight: 24, marginTop: 8 },
  err: { textAlign: "center", paddingHorizontal: 24 },
  cta: { marginTop: 24, paddingVertical: 14, borderRadius: 12, alignItems: "center" },
  ctaText: { color: "#fff", fontWeight: "700", fontSize: 16 },
});
