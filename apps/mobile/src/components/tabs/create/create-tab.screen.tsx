import { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useRouter } from "expo-router";
import { useTranslation } from "react-i18next";

import { AuthRequiredPlaceholder } from "@/components/auth";
import { Screen } from "@/components/layout/screen";
import { AppTabScreenHeader } from "@/components/shared/tab-screen/AppTabScreenHeader";
import { PartnerProgramSheet } from "@/components/tabs/create/components/partner-program-sheet";
import { AppButton } from "@/components/ui/Button";
import { AppPalette, getSchemeColors } from "@/constants/palette";
import { useAuth } from "@/contexts/auth-context";
import { useColorScheme } from "@/hooks/use-color-scheme";

export function CreateTabScreen() {
  const { t } = useTranslation("discover");
  const { t: tAuth } = useTranslation("auth");
  const router = useRouter();
  const scheme = useColorScheme() ?? "light";
  const c = getSchemeColors(scheme);
  const { isReady, isSignedIn } = useAuth();
  const [partnerOpen, setPartnerOpen] = useState(false);

  if (!isReady) {
    return null;
  }

  return (
    <Screen>
      <AppTabScreenHeader title={t("createTitle")} borderColor={c.border} titleColor={c.text} />
      {!isSignedIn ? (
        <AuthRequiredPlaceholder message={tAuth("authRequiredCreateBody")} />
      ) : (
      <View style={[styles.content, { backgroundColor: c.background }]}>
        <Pressable
          onPress={() => setPartnerOpen(true)}
          style={({ pressed }) => [
            styles.partnerCta,
            { borderColor: c.border, backgroundColor: c.surface },
            pressed && styles.pressed,
          ]}
          accessibilityRole="button"
          accessibilityLabel={t("createPartnerVenueA11y")}>
          <Text style={[styles.partnerCtaLabel, { color: AppPalette.primary }]}>
            {t("createPartnerVenueCta")}
          </Text>
          <Text style={[styles.partnerCtaHint, { color: c.textSecondary }]}>
            {t("createPartnerVenueHint")}
          </Text>
        </Pressable>

        <View style={styles.block}>
          <Text style={[styles.sectionLabel, { color: c.textSecondary }]}>{t("createVenueScreenTitle")}</Text>
          <AppButton
            title={t("createVenueCta")}
            onPress={() => router.push("/create/venue")}
            fullWidth
          />
          <Text style={[styles.muted, { color: c.textSecondary }]}>{t("createVenueHint")}</Text>
        </View>

        <View style={styles.block}>
          <Text style={[styles.sectionLabel, { color: c.textSecondary }]}>{t("createEventSection")}</Text>
          <AppButton
            title={t("createEventCta")}
            onPress={() => router.push("/create/event")}
            fullWidth
          />
          <Text style={[styles.muted, { color: c.textSecondary }]}>{t("createEventHint")}</Text>
        </View>
      </View>
      )}
      <PartnerProgramSheet visible={partnerOpen} onClose={() => setPartnerOpen(false)} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 20,
    gap: 28,
  },
  partnerCta: {
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 16,
    gap: 4,
  },
  pressed: {
    opacity: 0.9,
  },
  partnerCtaLabel: {
    fontSize: 16,
    fontWeight: "700",
  },
  partnerCtaHint: {
    fontSize: 14,
    lineHeight: 20,
  },
  block: {
    gap: 12,
  },
  sectionLabel: {
    fontSize: 13,
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 0.6,
  },
  muted: {
    fontSize: 14,
    lineHeight: 20,
  },
});
