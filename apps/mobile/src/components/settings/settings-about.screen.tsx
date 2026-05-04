import Constants from "expo-constants";
import { useCallback } from "react";
import { Alert, Linking, ScrollView, StyleSheet, Text, View } from "react-native";
import { useNavigation } from "expo-router";
import { useTranslation } from "react-i18next";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import {
  CollapsingStackLargeTitle,
  collapsingScrollProps,
} from "@/components/navigation/collapsing-stack-header-title";
import { useStandardCollapsingTitle } from "@/components/navigation/use-standard-collapsing-title";
import { SettingsNavigationRow } from "@/components/settings/components/SettingsNavigationRow";
import { SettingsSectionHeader } from "@/components/settings/components/SettingsSectionHeader";
import { SettingsScreenGroup } from "@/components/settings/components/SettingsScreenGroup";
import { Layout } from "@/constants/layout";
import { getSchemeColors } from "@/constants/palette";
import { useColorScheme } from "@/hooks/use-color-scheme";

type Extra = {
  privacyPolicyUrl?: string;
  termsOfServiceUrl?: string;
  helpMailto?: string;
};

export function SettingsAboutScreen() {
  const { t } = useTranslation("settings");
  const { t: tCommon } = useTranslation("common");
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const scheme = useColorScheme() ?? "light";
  const c = getSchemeColors(scheme);
  const isDark = scheme === "dark";

  const collapse = useStandardCollapsingTitle({
    navigation,
    title: t("aboutScreenTitle"),
    headerTitleColor: c.text,
    headerBackgroundColor: c.surface,
    tintColor: c.text,
    scheme: isDark ? "dark" : "light",
    backAccessibilityLabel: tCommon("backA11y"),
  });
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

  const navProps = {
    textColor: c.text,
    subtitleColor: c.textMuted,
    borderColor: c.border,
    backgroundColor: "transparent",
    flat: true as const,
  };

  return (
    <View style={[styles.root, { backgroundColor: c.surface }]}>
      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: Layout.tab.content.horizontalPadding,
          paddingBottom: insets.bottom + 24,
        }}
        showsVerticalScrollIndicator={false}
        {...collapsingScrollProps(collapse)}>
        <CollapsingStackLargeTitle color={c.text} collapse={collapse}>
          {t("aboutScreenTitle")}
        </CollapsingStackLargeTitle>
        <SettingsSectionHeader title={t("aboutLinks")} color={c.textMuted} />
        <SettingsScreenGroup borderColor={c.border} showBottomRule={false} paddingTop={0}>
          <SettingsNavigationRow
            title={t("aboutPrivacy")}
            onPress={() => void openUrl(extra.privacyPolicyUrl)}
            {...navProps}
          />
          <SettingsNavigationRow
            title={t("aboutTerms")}
            onPress={() => void openUrl(extra.termsOfServiceUrl)}
            {...navProps}
          />
          <SettingsNavigationRow
            title={t("aboutHelp")}
            onPress={() => void openUrl(extra.helpMailto)}
            {...navProps}
          />
        </SettingsScreenGroup>

        <Text style={[styles.footer, { color: c.textMuted }]}>
          {t("aboutVersionFooter", { version })}
        </Text>
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
