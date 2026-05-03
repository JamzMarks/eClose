import { useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useNavigation, useRouter } from "expo-router";
import { useTranslation } from "react-i18next";

import { AuthRequiredPlaceholder } from "@/components/auth";
import { Screen } from "@/components/layout/screen";
import {
  CollapsingStackLargeTitle,
  collapsingScrollProps,
} from "@/components/navigation/collapsing-stack-header-title";
import { useStandardCollapsingTitle } from "@/components/navigation/use-standard-collapsing-title";
import { PartnerProgramSheet } from "@/components/tabs/create/components/partner-program-sheet";
import { AppButton } from "@/components/ui/Button";
import { AppPalette, getSchemeColors } from "@/constants/palette";
import { useAuth } from "@/contexts/auth-context";
import { useColorScheme } from "@/hooks/use-color-scheme";

/**
 * Hub de criação (espaço / evento) — aberto a partir do header ou stack `/create`.
 */
export function CreateHubScreen() {
  const { t } = useTranslation("discover");
  const { t: tAuth } = useTranslation("auth");
  const { t: tCommon } = useTranslation("common");
  const navigation = useNavigation();
  const router = useRouter();
  const scheme = useColorScheme() ?? "light";
  const c = getSchemeColors(scheme);
  const { isReady, isSignedIn } = useAuth();
  const [partnerOpen, setPartnerOpen] = useState(false);
  const isDark = scheme === "dark";

  const collapse = useStandardCollapsingTitle({
    navigation,
    title: t("createTitle"),
    headerTitleColor: c.text,
    headerBackgroundColor: c.background,
    tintColor: c.text,
    scheme: isDark ? "dark" : "light",
    backAccessibilityLabel: tCommon("backA11y"),
  });

  if (!isReady) {
    return null;
  }

  return (
    <Screen edges={["bottom"]}>
      {!isSignedIn ? (
        <AuthRequiredPlaceholder message={tAuth("authRequiredCreateBody")} />
      ) : (
        <ScrollView
          contentContainerStyle={[styles.content, { backgroundColor: c.background }]}
          showsVerticalScrollIndicator={false}
          {...collapsingScrollProps(collapse)}>
          <CollapsingStackLargeTitle color={c.text} collapse={collapse}>
            {t("createTitle")}
          </CollapsingStackLargeTitle>
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
            <Text style={[styles.sectionLabel, { color: c.textSecondary }]}>
              {t("createVenueScreenTitle")}
            </Text>
            <AppButton
              title={t("createVenueCta")}
              onPress={() => router.push("/create/venue")}
              fullWidth
            />
            <Text style={[styles.muted, { color: c.textSecondary }]}>{t("createVenueHint")}</Text>
          </View>

          <View style={styles.block}>
            <Text style={[styles.sectionLabel, { color: c.textSecondary }]}>
              {t("createEventSection")}
            </Text>
            <AppButton
              title={t("createEventCta")}
              onPress={() => router.push("/create/event")}
              fullWidth
            />
            <Text style={[styles.muted, { color: c.textSecondary }]}>{t("createEventHint")}</Text>
          </View>
        </ScrollView>
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
