import { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  View,
} from "react-native";
import { Redirect, useRouter } from "expo-router";
import { useTranslation } from "react-i18next";

import { Screen } from "@/components/layout/screen";
import { StackContentPageTitle } from "@/components/navigation/StackContentPageTitle";
import { AppButton } from "@/components/ui/Button";
import { AppTextField } from "@/components/ui/Input";
import { AppPalette, getSchemeColors } from "@/constants/palette";
import { useAuth } from "@/contexts/auth-context";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { slugifyLabel } from "@/lib/slugify";
import { normalizeHttpError } from "@/infrastructure/http/error-handler";
import { VenueService } from "@/services/venue/venue.service";

export default function CreateVenueRoute() {
  const { t } = useTranslation("discover");
  const router = useRouter();
  const { isSignedIn, user } = useAuth();
  const ownerUserId = user?.id;
  const scheme = useColorScheme() ?? "light";
  const c = getSchemeColors(scheme);

  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [slugTouched, setSlugTouched] = useState(false);
  const [line1, setLine1] = useState("");
  const [city, setCity] = useState("");
  const [region, setRegion] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [countryCode, setCountryCode] = useState("BR");
  const [timezone, setTimezone] = useState("America/Sao_Paulo");
  const [marketplaceListed, setMarketplaceListed] = useState(true);
  const [openToArtistInquiries, setOpenToArtistInquiries] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isSignedIn || !ownerUserId) {
    return <Redirect href="/login" />;
  }

  function onNameChange(text: string) {
    setName(text);
    if (!slugTouched) {
      setSlug(slugifyLabel(text, 80));
    }
  }

  async function onSubmit() {
    setError(null);
    const n = name.trim();
    const s = slug.trim();
    if (!n || !s || !line1.trim() || !city.trim() || !region.trim() || !countryCode.trim()) {
      setError(t("createValidationGeneric"));
      return;
    }
    setBusy(true);
    try {
      const svc = new VenueService();
      const created = await svc.create({
        name: n,
        slug: s,
        ownerUserId,
        address: {
          line1: line1.trim(),
          city: city.trim(),
          region: region.trim(),
          countryCode: countryCode.trim().toUpperCase(),
          postalCode: postalCode.trim() || undefined,
        },
        timezone: timezone.trim() || "America/Sao_Paulo",
        openingHours: [{ weekday: 1, openLocal: "09:00", closeLocal: "18:00", closesNextDay: false }],
        marketplaceListed,
        openToArtistInquiries,
      });
      router.replace(`/venue/${encodeURIComponent(created.id)}`);
    } catch (e) {
      setError(normalizeHttpError(e, t("error")).message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <Screen>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={64}>
        <ScrollView
          contentContainerStyle={[styles.content, { backgroundColor: c.background }]}
          keyboardShouldPersistTaps="handled">
          <StackContentPageTitle color={c.text}>{t("createVenueScreenTitle")}</StackContentPageTitle>
          <Text style={[styles.lead, { color: c.textSecondary }]}>{t("createVenueHint")}</Text>

          <AppTextField label={t("createVenueName")} value={name} onChangeText={onNameChange} />
          <AppTextField
            label={t("createVenueSlug")}
            value={slug}
            onChangeText={(x) => {
              setSlugTouched(true);
              setSlug(x);
            }}
            autoCapitalize="none"
          />
          <AppTextField label={t("createVenueLine1")} value={line1} onChangeText={setLine1} />
          <AppTextField label={t("createVenueCity")} value={city} onChangeText={setCity} />
          <AppTextField label={t("createVenueRegion")} value={region} onChangeText={setRegion} />
          <AppTextField label={t("createVenuePostal")} value={postalCode} onChangeText={setPostalCode} />
          <AppTextField
            label={t("createVenueCountry")}
            value={countryCode}
            onChangeText={setCountryCode}
            autoCapitalize="characters"
            maxLength={2}
          />
          <AppTextField label={t("createVenueTimezone")} value={timezone} onChangeText={setTimezone} />

          <View style={[styles.row, { borderColor: c.border }]}>
            <Text style={{ color: c.text, flex: 1 }}>{t("createVenueListMarketplace")}</Text>
            <Switch value={marketplaceListed} onValueChange={setMarketplaceListed} />
          </View>
          <View style={[styles.row, { borderColor: c.border }]}>
            <Text style={{ color: c.text, flex: 1 }}>{t("createVenueOpenInquiries")}</Text>
            <Switch value={openToArtistInquiries} onValueChange={setOpenToArtistInquiries} />
          </View>

          {error ? <Text style={{ color: AppPalette.error }}>{error}</Text> : null}

          <AppButton title={t("createVenueSubmit")} onPress={() => void onSubmit()} loading={busy} fullWidth />
        </ScrollView>
      </KeyboardAvoidingView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  content: { padding: 20, gap: 12, paddingBottom: 40 },
  lead: { fontSize: 15, lineHeight: 22, marginBottom: 8 },
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
});
