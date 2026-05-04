import { useLayoutEffect, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useLocalSearchParams, useNavigation, useRouter } from "expo-router";
import { useTranslation } from "react-i18next";

import { AppPalette, getSchemeColors } from "@/constants/palette";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { normalizeHttpError } from "@/infrastructure/http/error-handler";
import { BookingService } from "@/services/booking/booking.service";

function oneParam(v: string | string[] | undefined): string | undefined {
  if (v === undefined) return undefined;
  return Array.isArray(v) ? v[0] : v;
}

export default function NewBookingInquiryScreen() {
  const { artistId: rawArtist, venueId: rawVenue, organizerArtistId: rawOrg } = useLocalSearchParams<{
    artistId?: string;
    venueId?: string;
    organizerArtistId?: string;
  }>();
  const artistId = oneParam(rawArtist);
  const venueId = oneParam(rawVenue);
  const organizerArtistIdParam = oneParam(rawOrg);

  const navigation = useNavigation();
  const router = useRouter();
  const { t } = useTranslation("discover");
  const scheme = useColorScheme() ?? "light";
  const c = getSchemeColors(scheme);

  const [notes, setNotes] = useState("");
  const [organizerArtistId, setOrganizerArtistId] = useState(organizerArtistIdParam ?? "");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  useLayoutEffect(() => {
    navigation.setOptions({
      title: t("bookingInquiryTitle"),
      headerTintColor: AppPalette.primary,
      headerStyle: { backgroundColor: c.surface },
      headerTitleStyle: { color: c.text },
    });
  }, [navigation, t, c.surface, c.text]);

  const hasTarget = Boolean(artistId || venueId);
  const needsOrganizer = Boolean(venueId) && !organizerArtistId.trim();

  async function submit() {
    if (!hasTarget) {
      setError(t("bookingNeedTarget"));
      return;
    }
    if (needsOrganizer) {
      setError(t("bookingNeedOrganizerArtist"));
      return;
    }
    setBusy(true);
    setError(null);
    try {
      const svc = new BookingService();
      await svc.createInquiry({
        artistId,
        venueId,
        organizerArtistId: venueId ? organizerArtistId.trim() : undefined,
        notes: notes.trim() || undefined,
      });
      setDone(true);
    } catch (e) {
      setError(normalizeHttpError(e, t("error")).message);
    } finally {
      setBusy(false);
    }
  }

  if (!hasTarget) {
    return (
      <View style={[styles.centered, { backgroundColor: c.background }]}>
        <Text style={[styles.hint, { color: c.textSecondary }]}>{t("bookingNeedTarget")}</Text>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <Text style={{ color: AppPalette.primary, fontWeight: "600" }}>{t("retry")}</Text>
        </Pressable>
      </View>
    );
  }

  if (done) {
    return (
      <View style={[styles.centered, { backgroundColor: c.background }]}>
        <Text style={[styles.hint, { color: c.text }]}>{t("bookingCreated")}</Text>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <Text style={{ color: AppPalette.primary, fontWeight: "600" }}>OK</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <ScrollView
      style={[styles.scroll, { backgroundColor: c.background }]}
      contentContainerStyle={styles.content}
      keyboardShouldPersistTaps="handled">
      {venueId ? (
        <TextInput
          value={organizerArtistId}
          onChangeText={setOrganizerArtistId}
          placeholder={t("bookingOrganizerArtistPlaceholder")}
          placeholderTextColor={c.textMuted}
          autoCapitalize="none"
          accessibilityLabel={t("bookingOrganizerArtistLabel")}
          style={[styles.input, { color: c.text, borderColor: c.border }]}
        />
      ) : null}
      <TextInput
        value={notes}
        onChangeText={setNotes}
        placeholder={t("bookingNotesLabel")}
        placeholderTextColor={c.textMuted}
        multiline
        accessibilityLabel={t("bookingNotesLabel")}
        style={[
          styles.input,
          styles.notes,
          { color: c.text, borderColor: c.border },
          venueId ? styles.inputAfterBlock : null,
        ]}
      />
      {error ? <Text style={styles.err}>{error}</Text> : null}
      <Pressable
        onPress={() => void submit()}
        disabled={busy}
        style={[styles.submit, { backgroundColor: AppPalette.primary, opacity: busy ? 0.7 : 1 }]}>
        {busy ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.submitText}>{t("bookingSubmit")}</Text>
        )}
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1 },
  content: { padding: 20, paddingBottom: 40 },
  centered: { flex: 1, justifyContent: "center", alignItems: "center", padding: 24 },
  hint: { textAlign: "center", fontSize: 16, lineHeight: 22 },
  backBtn: { marginTop: 16 },
  input: {
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
  },
  notes: { minHeight: 100, textAlignVertical: "top" },
  inputAfterBlock: { marginTop: 16 },
  err: { color: AppPalette.error, marginTop: 12 },
  submit: { marginTop: 24, paddingVertical: 14, borderRadius: 12, alignItems: "center" },
  submitText: { color: "#fff", fontWeight: "700", fontSize: 16 },
});
