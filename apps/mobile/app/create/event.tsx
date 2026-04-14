import { useCallback, useEffect, useMemo, useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  View,
} from "react-native";
import { useRouter } from "expo-router";
import { useTranslation } from "react-i18next";

import { AuthRequiredPlaceholder } from "@/components/auth";
import { Screen } from "@/components/layout/screen";
import { StackContentPageTitle } from "@/components/navigation/StackContentPageTitle";
import { AppButton } from "@/components/ui/Button";
import { AppTextField } from "@/components/ui/Input";
import { AppPalette, getSchemeColors } from "@/constants/palette";
import { useAuth } from "@/contexts/auth-context";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { slugifyLabel } from "@/lib/slugify";
import { normalizeHttpError } from "@/infrastructure/http/error-handler";
import { ArtistService } from "@/services/artist/artist.service";
import { EventService } from "@/services/event/event.service";
import { LinkedEntitiesService } from "@/services/user/linked-entities.service";
import type { LinkedArtistSummary, LinkedVenueSummary } from "@/services/types/linked-entities.types";

type LocMode = "PHYSICAL" | "ONLINE" | "HYBRID";

export default function CreateEventRoute() {
  const { t } = useTranslation("discover");
  const { t: tAuth } = useTranslation("auth");
  const router = useRouter();
  const { isSignedIn, user } = useAuth();
  const ownerUserId = user?.id;
  const scheme = useColorScheme() ?? "light";
  const c = getSchemeColors(scheme);

  const [artists, setArtists] = useState<LinkedArtistSummary[]>([]);
  const [venues, setVenues] = useState<LinkedVenueSummary[]>([]);
  const [linkedLoading, setLinkedLoading] = useState(true);

  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [slugTouched, setSlugTouched] = useState(false);
  const [organizerArtistId, setOrganizerArtistId] = useState<string | null>(null);
  const [newArtistName, setNewArtistName] = useState("");
  const [locationMode, setLocationMode] = useState<LocMode>("PHYSICAL");
  const [venueId, setVenueId] = useState<string | null>(null);
  const [locationLabel, setLocationLabel] = useState("");
  const [onlineUrl, setOnlineUrl] = useState("");
  const [startsAt, setStartsAt] = useState("");
  const [endsAt, setEndsAt] = useState("");
  const [timezone, setTimezone] = useState("America/Sao_Paulo");
  const [publishNow, setPublishNow] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const defaultIso = useMemo(() => {
    const start = new Date();
    start.setDate(start.getDate() + 1);
    start.setHours(20, 0, 0, 0);
    const end = new Date(start.getTime() + 2 * 3600000);
    return { start: start.toISOString(), end: end.toISOString() };
  }, []);

  useEffect(() => {
    setStartsAt((s) => s || defaultIso.start);
    setEndsAt((e) => e || defaultIso.end);
  }, [defaultIso.end, defaultIso.start]);

  const loadLinked = useCallback(async () => {
    if (!isSignedIn) return;
    setLinkedLoading(true);
    try {
      const svc = new LinkedEntitiesService();
      const data = await svc.getMine();
      setArtists(data.artists);
      setVenues(data.venues);
      if (data.artists.length === 1) {
        setOrganizerArtistId(data.artists[0]!.id);
      }
    } catch {
      setArtists([]);
      setVenues([]);
    } finally {
      setLinkedLoading(false);
    }
  }, [isSignedIn]);

  useEffect(() => {
    void loadLinked();
  }, [loadLinked]);

  if (!isSignedIn || !ownerUserId) {
    return (
      <Screen edges={["bottom"]}>
        <ScrollView
          contentContainerStyle={[styles.content, { backgroundColor: c.background, flexGrow: 1 }]}
          keyboardShouldPersistTaps="handled">
          <StackContentPageTitle color={c.text}>{t("createEventScreenTitle")}</StackContentPageTitle>
          <AuthRequiredPlaceholder message={tAuth("authRequiredCreateBody")} insetFromParent />
        </ScrollView>
      </Screen>
    );
  }

  function onTitleChange(text: string) {
    setTitle(text);
    if (!slugTouched) {
      setSlug(slugifyLabel(text, 64));
    }
  }

  function validate(): string | null {
    const hasArtist = organizerArtistId != null || newArtistName.trim().length >= 2;
    if (!hasArtist) return t("createEventValidationArtist");
    if (locationMode === "PHYSICAL") {
      if (!venueId && !locationLabel.trim()) return t("createEventValidationPhysical");
    }
    if (locationMode === "ONLINE" || locationMode === "HYBRID") {
      if (!onlineUrl.trim()) return t("createEventValidationOnline");
    }
    if (!title.trim() || !slug.trim() || !startsAt.trim() || !endsAt.trim()) {
      return t("createValidationGeneric");
    }
    return null;
  }

  async function onSubmit() {
    setError(null);
    const v = validate();
    if (v) {
      setError(v);
      return;
    }
    setBusy(true);
    try {
      if (!ownerUserId) return;
      let artistId = organizerArtistId;
      if (!artistId) {
        const artistsSvc = new ArtistService();
        const created = await artistsSvc.create({
          name: newArtistName.trim(),
          slug: slugifyLabel(newArtistName, 80),
          type: "SOLO",
          ownerId: ownerUserId,
          marketplaceVisible: true,
          openToVenueBookings: true,
        });
        artistId = created.id;
      }

      const eventsSvc = new EventService();
      const body = {
        title: title.trim(),
        slug: slug.trim(),
        locationMode,
        startsAt: startsAt.trim(),
        endsAt: endsAt.trim(),
        timezone: timezone.trim() || "America/Sao_Paulo",
        organizerArtistId: artistId!,
        status: publishNow ? ("PUBLISHED" as const) : ("DRAFT" as const),
        venueId: venueId ?? undefined,
        locationLabel: locationLabel.trim() || undefined,
        onlineUrl: onlineUrl.trim() || undefined,
      };

      const ev = await eventsSvc.create(body);
      router.replace(`/event/${encodeURIComponent(ev.id)}`);
    } catch (e) {
      setError(normalizeHttpError(e, t("error")).message);
    } finally {
      setBusy(false);
    }
  }

  const modeBtn = (mode: LocMode, label: string) => {
    const active = locationMode === mode;
    return (
      <Pressable
        onPress={() => setLocationMode(mode)}
        style={[
          styles.modeChip,
          { borderColor: c.border, backgroundColor: active ? AppPalette.primary : c.surface },
        ]}>
        <Text style={{ color: active ? AppPalette.white : c.text, fontWeight: "600", fontSize: 13 }}>
          {label}
        </Text>
      </Pressable>
    );
  };

  return (
    <Screen edges={["bottom"]}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={64}>
        <ScrollView
          contentContainerStyle={[styles.content, { backgroundColor: c.background }]}
          keyboardShouldPersistTaps="handled">
          <StackContentPageTitle color={c.text}>{t("createEventScreenTitle")}</StackContentPageTitle>
          {linkedLoading ? (
            <Text style={{ color: c.textSecondary }}>{t("loading")}</Text>
          ) : null}

          <Text style={[styles.section, { color: c.textMuted }]}>{t("createEventOrganizer")}</Text>
          {artists.length > 0 ? (
            <View style={{ gap: 8 }}>
              {artists.map((a) => {
                const sel = organizerArtistId === a.id;
                return (
                  <Pressable
                    key={a.id}
                    onPress={() => {
                      setOrganizerArtistId(a.id);
                      setNewArtistName("");
                    }}
                    style={[
                      styles.pickRow,
                      { borderColor: sel ? AppPalette.primary : c.border, backgroundColor: c.surface },
                    ]}>
                    <Text style={{ color: c.text, fontWeight: sel ? "700" : "500" }}>{a.name}</Text>
                  </Pressable>
                );
              })}
            </View>
          ) : null}
          <AppTextField
            label={t("createEventNewArtistName")}
            value={newArtistName}
            onChangeText={(x) => {
              setNewArtistName(x);
              setOrganizerArtistId(null);
            }}
            placeholder={artists.length === 0 ? "DJ Maria" : undefined}
          />

          <AppTextField label={t("createEventTitle")} value={title} onChangeText={onTitleChange} />
          <AppTextField
            label={t("createEventSlug")}
            value={slug}
            onChangeText={(x) => {
              setSlugTouched(true);
              setSlug(x);
            }}
            autoCapitalize="none"
          />

          <Text style={[styles.section, { color: c.textMuted }]}>{t("createEventLocationMode")}</Text>
          <View style={styles.modeRow}>
            {modeBtn("PHYSICAL", t("createEventLocPhysical"))}
            {modeBtn("ONLINE", t("createEventLocOnline"))}
            {modeBtn("HYBRID", t("createEventLocHybrid"))}
          </View>

          {(locationMode === "PHYSICAL" || locationMode === "HYBRID") && venues.length > 0 ? (
            <>
              <Text style={[styles.section, { color: c.textMuted }]}>{t("createEventVenueOptional")}</Text>
              <View style={{ gap: 8 }}>
                <Pressable
                  onPress={() => setVenueId(null)}
                  style={[
                    styles.pickRow,
                    { borderColor: venueId == null ? AppPalette.primary : c.border, backgroundColor: c.surface },
                  ]}>
                  <Text style={{ color: c.text }}>{t("createEventSkipVenue")}</Text>
                </Pressable>
                {venues.map((v) => {
                  const sel = venueId === v.id;
                  return (
                    <Pressable
                      key={v.id}
                      onPress={() => setVenueId(v.id)}
                      style={[
                        styles.pickRow,
                        { borderColor: sel ? AppPalette.primary : c.border, backgroundColor: c.surface },
                      ]}>
                      <Text style={{ color: c.text, fontWeight: sel ? "700" : "500" }}>{v.name}</Text>
                    </Pressable>
                  );
                })}
              </View>
            </>
          ) : null}

          {(locationMode === "PHYSICAL" || locationMode === "HYBRID") && (
            <AppTextField
              label={t("createEventLocationLabel")}
              value={locationLabel}
              onChangeText={setLocationLabel}
            />
          )}

          {(locationMode === "ONLINE" || locationMode === "HYBRID") && (
            <AppTextField
              label={t("createEventOnlineUrl")}
              value={onlineUrl}
              onChangeText={setOnlineUrl}
              autoCapitalize="none"
              keyboardType="url"
            />
          )}

          <AppTextField label={t("createEventStartsAt")} value={startsAt} onChangeText={setStartsAt} />
          <AppTextField label={t("createEventEndsAt")} value={endsAt} onChangeText={setEndsAt} />
          <AppTextField label={t("createEventTimezone")} value={timezone} onChangeText={setTimezone} />

          <View style={[styles.row, { borderColor: c.border }]}>
            <Text style={{ color: c.text, flex: 1 }}>{t("createEventPublish")}</Text>
            <Switch value={publishNow} onValueChange={setPublishNow} />
          </View>

          {error ? <Text style={{ color: AppPalette.error }}>{error}</Text> : null}

          <AppButton title={t("createEventSubmit")} onPress={() => void onSubmit()} loading={busy} fullWidth />
        </ScrollView>
      </KeyboardAvoidingView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  content: { padding: 20, gap: 12, paddingBottom: 40 },
  section: { fontSize: 12, fontWeight: "700", textTransform: "uppercase", marginTop: 8 },
  modeRow: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  modeChip: { paddingVertical: 10, paddingHorizontal: 14, borderRadius: 10, borderWidth: 1 },
  pickRow: { padding: 12, borderRadius: 10, borderWidth: 1 },
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
});
