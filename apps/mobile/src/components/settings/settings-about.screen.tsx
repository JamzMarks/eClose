import Constants from "expo-constants";
import { useCallback } from "react";
import { Alert, Linking, ScrollView, StyleSheet, Text, View } from "react-native";
import { useTranslation } from "react-i18next";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { SettingsGroupedCard } from "@/components/settings/components/SettingsGroupedCard";
import { SettingsNavigationRow } from "@/components/settings/components/SettingsNavigationRow";
import { SettingsSectionHeader } from "@/components/settings/components/SettingsSectionHeader";
import { SettingsValueRow } from "@/components/settings/components/SettingsValueRow";
import { getSchemeColors } from "@/constants/palette";
import { useColorScheme } from "@/hooks/use-color-scheme";

type Extra = {
  privacyPolicyUrl?: string;
  termsOfServiceUrl?: string;
  helpMailto?: string;
};

export function SettingsAboutScreen() {
  const { t } = useTranslation("settings");
  const insets = useSafeAreaInsets();
  const scheme = useColorScheme() ?? "light";
  const c = getSchemeColors(scheme);
  const extra = (Constants.expoConfig?.extra ?? {}) as Extra;
  const version =
    Constants.expoConfig?.version ??
    Constants.nativeApplicationVersion ??
    "—";

  const openUrl = useCallback(async (url: string | undefined) => {
    if (!url?.trim()) {
      Alert.alert(t("aboutLinkError"));
      return;
    }
    try {
      const ok = await Linking.canOpenURL(url);
      if (!ok) {
        Alert.alert(t("aboutLinkError"));
        return;
      }
      await Linking.openURL(url);
    } catch {
      Alert.alert(t("aboutLinkError"));
    }
  }, [t]);

  return (
    <View style={[styles.root, { backgroundColor: c.background }]}>
      <ScrollView
        contentContainerStyle={{ paddingBottom: insets.bottom + 24 }}
        showsVerticalScrollIndicator={false}
      >
        <SettingsSectionHeader title={t("aboutVersion")} color={c.textMuted} />
        <SettingsValueRow
          label="eClose"
          value={version}
          labelColor={c.textSecondary}
          valueColor={c.text}
          borderColor={c.border}
          backgroundColor={c.surface}
        />

        <SettingsSectionHeader title={t("aboutLinks")} color={c.textMuted} />
        <SettingsGroupedCard borderColor={c.border} backgroundColor={c.surface}>
          <SettingsNavigationRow
            title={t("aboutPrivacy")}
            onPress={() => void openUrl(extra.privacyPolicyUrl)}
            textColor={c.text}
            subtitleColor={c.textMuted}
            borderColor={c.border}
            backgroundColor={c.surface}
            showDividerBelow
          />
          <SettingsNavigationRow
            title={t("aboutTerms")}
            onPress={() => void openUrl(extra.termsOfServiceUrl)}
            textColor={c.text}
            subtitleColor={c.textMuted}
            borderColor={c.border}
            backgroundColor={c.surface}
            showDividerBelow
          />
          <SettingsNavigationRow
            title={t("aboutHelp")}
            onPress={() => void openUrl(extra.helpMailto)}
            textColor={c.text}
            subtitleColor={c.textMuted}
            borderColor={c.border}
            backgroundColor={c.surface}
            showDividerBelow={false}
          />
        </SettingsGroupedCard>

        <Text style={[styles.footer, { color: c.textMuted }]}>eClose</Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  footer: {
    textAlign: "center",
    marginTop: 24,
    fontSize: 13,
  },
});
