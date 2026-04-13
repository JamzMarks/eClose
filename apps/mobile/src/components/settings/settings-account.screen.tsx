import { useMemo } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { useTranslation } from "react-i18next";
import { useRouter } from "expo-router";

import { StackContentPageTitle } from "@/components/navigation/StackContentPageTitle";
import { SettingsSectionHeader } from "@/components/settings/components/SettingsSectionHeader";
import { SettingsGroupedCard } from "@/components/settings/components/SettingsGroupedCard";
import { SettingsNavigationRow } from "@/components/settings/components/SettingsNavigationRow";
import { Layout } from "@/constants/layout";
import { getSchemeColors } from "@/constants/palette";
import { useAuth } from "@/contexts/auth-context";
import { AppIcon } from "@/components/ui/icon/icon.types";
import { useColorScheme } from "@/hooks/use-color-scheme";

export function SettingsAccountScreen() {
  const { t } = useTranslation("settings");
  const router = useRouter();
  const { user } = useAuth();
  const scheme = useColorScheme() ?? "light";
  const c = getSchemeColors(scheme);

  const emailValue = useMemo(() => user?.email ?? "—", [user?.email]);
  const nameValue = useMemo(() => {
    const first = user?.firstName?.trim() ?? "";
    const last = user?.lastName?.trim() ?? "";
    const full = `${first} ${last}`.trim();
    return full || "—";
  }, [user?.firstName, user?.lastName]);

  return (
    <View style={[styles.root, { backgroundColor: c.background }]}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <StackContentPageTitle color={c.text}>{t("sectionAccount")}</StackContentPageTitle>

        <SettingsSectionHeader title={t("accountProfileHeader")} color={c.textMuted} insetHorizontal={0} />
        <SettingsGroupedCard borderColor={c.border} backgroundColor={c.surface}>
          <SettingsNavigationRow
            icon={AppIcon.Profile}
            title={t("accountNameTitle")}
            subtitle={nameValue}
            onPress={() => router.push("/settings/account/name")}
            textColor={c.text}
            subtitleColor={c.textMuted}
            borderColor={c.border}
            backgroundColor={c.surface}
            showDividerBelow
          />
          <SettingsNavigationRow
            icon={AppIcon.FileText}
            title={t("accountEmailTitle")}
            subtitle={emailValue}
            onPress={() => router.push("/settings/account/email")}
            textColor={c.text}
            subtitleColor={c.textMuted}
            borderColor={c.border}
            backgroundColor={c.surface}
            showDividerBelow
          />
          <SettingsNavigationRow
            icon={AppIcon.Shield}
            title={t("accountPasswordTitle")}
            subtitle={t("accountPasswordSubtitle")}
            onPress={() => router.push("/settings/account/password")}
            textColor={c.text}
            subtitleColor={c.textMuted}
            borderColor={c.border}
            backgroundColor={c.surface}
            showDividerBelow={false}
          />
        </SettingsGroupedCard>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  content: {
    paddingHorizontal: Layout.tab.content.horizontalPadding,
    paddingBottom: 24,
  },
});

