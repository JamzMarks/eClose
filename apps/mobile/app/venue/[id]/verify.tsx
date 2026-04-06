import { useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useTranslation } from "react-i18next";

import { Screen } from "@/components/layout/screen";
import { AppButton } from "@/components/ui/button";
import { AppTextField } from "@/components/ui/text-field";
import { AppPalette, getSchemeColors } from "@/constants/palette";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { normalizeHttpError } from "@/infrastructure/http/error-handler";
import { MediaApiService } from "@/services/media/media.service";
import { VenueService } from "@/services/venue/venue.service";

function guessDocKindAndMime(
  url: string,
): { kind: "DOCUMENT" | "IMAGE"; mimeType: string } {
  const path = url.trim().toLowerCase().split("?")[0] ?? "";
  if (path.endsWith(".pdf")) return { kind: "DOCUMENT", mimeType: "application/pdf" };
  if (path.endsWith(".png")) return { kind: "IMAGE", mimeType: "image/png" };
  if (path.endsWith(".webp")) return { kind: "IMAGE", mimeType: "image/webp" };
  if (path.endsWith(".gif")) return { kind: "IMAGE", mimeType: "image/gif" };
  return { kind: "IMAGE", mimeType: "image/jpeg" };
}

export default function VenueVerifyScreen() {
  const { id: rawId } = useLocalSearchParams<{ id: string }>();
  const id = Array.isArray(rawId) ? rawId[0] : rawId;
  const router = useRouter();
  const { t } = useTranslation("discover");
  const scheme = useColorScheme() ?? "light";
  const c = getSchemeColors(scheme);

  const [cnpj, setCnpj] = useState("");
  const [urlCnpjDoc, setUrlCnpjDoc] = useState("");
  const [urlAddress, setUrlAddress] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async () => {
    if (!id?.trim()) return;
    setError(null);
    setBusy(true);
    try {
      const media = new MediaApiService();
      const venues = new VenueService();
      const a = guessDocKindAndMime(urlCnpjDoc);
      const b = guessDocKindAndMime(urlAddress);
      const reg1 = await media.registerAsset({
        parentType: "VENUE",
        parentId: id,
        kind: a.kind,
        sourceUrl: urlCnpjDoc.trim(),
        mimeType: a.mimeType,
        listable: false,
        caption: "venue-trust-cnpj-doc",
      });
      const reg2 = await media.registerAsset({
        parentType: "VENUE",
        parentId: id,
        kind: b.kind,
        sourceUrl: urlAddress.trim(),
        mimeType: b.mimeType,
        listable: false,
        caption: "venue-trust-address-proof",
      });
      await venues.submitTrustVerification(id, {
        cnpj: cnpj.trim(),
        cnpjDocumentMediaAssetId: reg1.id,
        addressProofMediaAssetId: reg2.id,
      });
      router.replace(`/venue/${encodeURIComponent(id)}`);
    } catch (e) {
      setError(normalizeHttpError(e, t("error")).message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <Screen>
      <ScrollView
        style={[styles.scroll, { backgroundColor: c.background }]}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={[styles.title, { color: c.text }]}>{t("venueVerifyTitle")}</Text>
        <Text style={[styles.hint, { color: c.textSecondary }]}>{t("venueVerifyHint")}</Text>

        <AppTextField
          label={t("venueVerifyCnpj")}
          value={cnpj}
          onChangeText={setCnpj}
          autoCapitalize="none"
          keyboardType="numbers-and-punctuation"
          placeholder="00.000.000/0001-00"
        />
        <AppTextField
          label={t("venueVerifyDocCnpjUrl")}
          value={urlCnpjDoc}
          onChangeText={setUrlCnpjDoc}
          autoCapitalize="none"
          keyboardType="url"
          placeholder="https://..."
        />
        <AppTextField
          label={t("venueVerifyDocAddressUrl")}
          value={urlAddress}
          onChangeText={setUrlAddress}
          autoCapitalize="none"
          keyboardType="url"
          placeholder="https://..."
        />

        {error ? (
          <Text style={[styles.err, { color: AppPalette.error }]}>{error}</Text>
        ) : null}

        <AppButton
          title={t("venueVerifySubmit")}
          onPress={() => void onSubmit()}
          disabled={busy || !cnpj.trim() || !urlCnpjDoc.trim() || !urlAddress.trim()}
          fullWidth
        />
        {busy ? (
          <View style={styles.spinner}>
            <ActivityIndicator color={AppPalette.primary} />
          </View>
        ) : null}
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1 },
  content: { padding: 20, paddingBottom: 40, gap: 14 },
  title: { fontSize: 22, fontWeight: "700" },
  hint: { fontSize: 14, lineHeight: 20, marginBottom: 8 },
  err: { fontSize: 14, lineHeight: 20 },
  spinner: { marginTop: 16, alignItems: "center" },
});
