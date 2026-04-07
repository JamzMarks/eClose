import { Alert, ScrollView, StyleSheet, View } from "react-native";
import { useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { SettingsNavigationRow } from "@/components/settings/components/SettingsNavigationRow";
import { SettingsSectionHeader } from "@/components/settings/components/SettingsSectionHeader";
import { SettingsValueRow } from "@/components/settings/components/SettingsValueRow";
import { getSchemeColors } from "@/constants/palette";
import { useAuth } from "@/contexts/auth-context";
import { useOnboardingSetup } from "@/contexts/onboarding-setup-context";
import { useColorScheme } from "@/hooks/use-color-scheme";

/**
 * Modal central de definições (padrão tipo Instagram: um único ecrã com secções).
 * Sub-opções pesadas podem virar rotas filhas mais tarde (`/settings/appearance`, etc.).
 */
export function SettingsModalScreen() {
  const { t } = useTranslation("settings");
  const { t: tProfile } = useTranslation("profile");
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const scheme = useColorScheme() ?? "light";
  const c = getSchemeColors(scheme);
  const { user, signOut } = useAuth();
  const { openNotificationPreferencesSetup } = useOnboardingSetup();

  async function handleSignOut() {
    await signOut();
    router.replace("/login");
  }

  function confirmSignOut() {
    Alert.alert(t("signOutConfirmTitle"), t("signOutConfirmMessage"), [
      { text: t("cancel"), style: "cancel" },
      {
        text: t("signOutConfirmAction"),
        style: "destructive",
        onPress: () => void handleSignOut(),
      },
    ]);
  }

  return (
    <View style={[styles.root, { backgroundColor: c.background }]}>
      <ScrollView
        contentContainerStyle={{ paddingBottom: insets.bottom + 24 }}
        showsVerticalScrollIndicator={false}
      >
        <SettingsSectionHeader title={t("sectionAccount")} color={c.textMuted} />
        <SettingsValueRow
          label={t("emailLabel")}
          value={user?.email ?? "—"}
          labelColor={c.textSecondary}
          valueColor={c.text}
          borderColor={c.border}
          backgroundColor={c.surface}
        />

        <SettingsSectionHeader title={t("sectionGeneral")} color={c.textMuted} />
        <SettingsNavigationRow
          title={t("notifications")}
          onPress={() => {
            router.back();
            requestAnimationFrame(() => openNotificationPreferencesSetup());
          }}
          textColor={c.text}
          subtitleColor={c.textMuted}
          borderColor={c.border}
          backgroundColor={c.surface}
        />
        <SettingsNavigationRow
          title={t("appearance")}
          subtitle={t("appearanceHint")}
          onPress={() => {}}
          textColor={c.textSecondary}
          subtitleColor={c.textMuted}
          borderColor={c.border}
          backgroundColor={c.surface}
        />
        <SettingsNavigationRow
          title={t("language")}
          subtitle={t("languageHint")}
          onPress={() => {}}
          textColor={c.textSecondary}
          subtitleColor={c.textMuted}
          borderColor={c.border}
          backgroundColor={c.surface}
        />
        <SettingsNavigationRow
          title={t("about")}
          subtitle={t("aboutHint")}
          onPress={() => {}}
          textColor={c.textSecondary}
          subtitleColor={c.textMuted}
          borderColor={c.border}
          backgroundColor={c.surface}
        />

        <SettingsSectionHeader title={t("sectionLegal")} color={c.textMuted} />
        <SettingsNavigationRow
          title={tProfile("privacyPolicy")}
          onPress={() => router.push({ pathname: "/profile-legal", params: { kind: "privacy" } })}
          textColor={c.text}
          subtitleColor={c.textMuted}
          borderColor={c.border}
          backgroundColor={c.surface}
        />
        <SettingsNavigationRow
          title={tProfile("termsOfService")}
          onPress={() => router.push({ pathname: "/profile-legal", params: { kind: "terms" } })}
          textColor={c.text}
          subtitleColor={c.textMuted}
          borderColor={c.border}
          backgroundColor={c.surface}
        />
        <SettingsNavigationRow
          title={tProfile("helpContact")}
          onPress={() => router.push({ pathname: "/profile-legal", params: { kind: "help" } })}
          textColor={c.text}
          subtitleColor={c.textMuted}
          borderColor={c.border}
          backgroundColor={c.surface}
        />

        <SettingsSectionHeader title={t("sectionSession")} color={c.textMuted} />
        <SettingsNavigationRow
          title={t("signOut")}
          onPress={confirmSignOut}
          textColor={c.text}
          subtitleColor={c.textMuted}
          borderColor={c.border}
          backgroundColor={c.surface}
          destructive
          showChevron={false}
        />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
});
