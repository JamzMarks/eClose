import { useMemo } from "react";
import {
  ActionSheetIOS,
  Alert,
  Platform,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import { useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { SettingsGroupedCard } from "@/components/settings/components/SettingsGroupedCard";
import { SettingsNavigationRow } from "@/components/settings/components/SettingsNavigationRow";
import { SettingsSectionHeader } from "@/components/settings/components/SettingsSectionHeader";
import { SettingsValueRow } from "@/components/settings/components/SettingsValueRow";
import { getSchemeColors } from "@/constants/palette";
import { useAuth } from "@/contexts/auth-context";
import { useLocalePreference, type AppLocale } from "@/contexts/locale-preference-context";
import { useThemePreference, type ThemePreference } from "@/contexts/theme-preference-context";
import { useAccountSetup } from "@/features/account-setup";
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
  const { openNotificationPreferencesSetup } = useAccountSetup();
  const { preference, setPreference } = useThemePreference();
  const { locale, setLocale } = useLocalePreference();

  const appearanceSubtitleKey = useMemo(() => {
    const map: Record<ThemePreference, string> = {
      system: "appearanceValueSystem",
      light: "appearanceValueLight",
      dark: "appearanceValueDark",
    };
    return map[preference];
  }, [preference]);

  function openAppearancePicker() {
    const options: { key: ThemePreference; labelKey: string }[] = [
      { key: "system", labelKey: "appearanceOptionSystem" },
      { key: "light", labelKey: "appearanceOptionLight" },
      { key: "dark", labelKey: "appearanceOptionDark" },
    ];

    if (Platform.OS === "ios") {
      ActionSheetIOS.showActionSheetWithOptions(
        {
          options: [t("cancel"), ...options.map((o) => t(o.labelKey))],
          cancelButtonIndex: 0,
          title: t("appearance"),
        },
        (index) => {
          if (index === 0) return;
          const opt = options[index - 1];
          if (opt) void setPreference(opt.key);
        },
      );
      return;
    }

    Alert.alert(
      t("appearance"),
      undefined,
      [
        ...options.map((o) => ({
          text: t(o.labelKey),
          onPress: () => void setPreference(o.key),
        })),
        { text: t("cancel"), style: "cancel" as const },
      ],
      { cancelable: true },
    );
  }

  const languageSubtitleKey = useMemo(() => {
    const map: Record<AppLocale, string> = {
      pt: "languageValuePt",
      en: "languageValueEn",
    };
    return map[locale];
  }, [locale]);

  function openLanguagePicker() {
    const options: { key: AppLocale; labelKey: string }[] = [
      { key: "pt", labelKey: "languageOptionPt" },
      { key: "en", labelKey: "languageOptionEn" },
    ];

    if (Platform.OS === "ios") {
      ActionSheetIOS.showActionSheetWithOptions(
        {
          options: [t("cancel"), ...options.map((o) => t(o.labelKey))],
          cancelButtonIndex: 0,
          title: t("language"),
        },
        (index) => {
          if (index === 0) return;
          const opt = options[index - 1];
          if (opt) void setLocale(opt.key);
        },
      );
      return;
    }

    Alert.alert(
      t("language"),
      undefined,
      [
        ...options.map((o) => ({
          text: t(o.labelKey),
          onPress: () => void setLocale(o.key),
        })),
        { text: t("cancel"), style: "cancel" as const },
      ],
      { cancelable: true },
    );
  }

  const legalItems = useMemo(
    () =>
      [
        { kind: "privacy" as const, titleKey: "privacyPolicy" as const },
        { kind: "terms" as const, titleKey: "termsOfService" as const },
        { kind: "help" as const, titleKey: "helpContact" as const },
      ] as const,
    [],
  );

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
          subtitle={t(appearanceSubtitleKey)}
          onPress={openAppearancePicker}
          textColor={c.textSecondary}
          subtitleColor={c.textMuted}
          borderColor={c.border}
          backgroundColor={c.surface}
        />
        <SettingsNavigationRow
          title={t("language")}
          subtitle={t(languageSubtitleKey)}
          onPress={openLanguagePicker}
          textColor={c.textSecondary}
          subtitleColor={c.textMuted}
          borderColor={c.border}
          backgroundColor={c.surface}
        />
        <SettingsNavigationRow
          title={t("about")}
          onPress={() => router.push("/settings/about")}
          textColor={c.textSecondary}
          subtitleColor={c.textMuted}
          borderColor={c.border}
          backgroundColor={c.surface}
        />

        <SettingsSectionHeader title={t("sectionLegal")} color={c.textMuted} />
        <SettingsGroupedCard borderColor={c.border} backgroundColor={c.surface}>
          {legalItems.map((item, index) => (
            <SettingsNavigationRow
              key={item.kind}
              title={tProfile(item.titleKey)}
              onPress={() => router.push({ pathname: "/profile-legal", params: { kind: item.kind } })}
              textColor={c.text}
              subtitleColor={c.textMuted}
              borderColor={c.border}
              backgroundColor={c.surface}
              showDividerBelow={index < legalItems.length - 1}
            />
          ))}
        </SettingsGroupedCard>

        <SettingsSectionHeader title={t("sectionSession")} color={c.textMuted} />
        <SettingsGroupedCard borderColor={c.border} backgroundColor={c.surface}>
          <SettingsNavigationRow
            title={t("signOut")}
            onPress={confirmSignOut}
            textColor={c.text}
            subtitleColor={c.textMuted}
            borderColor={c.border}
            backgroundColor={c.surface}
            destructive
            showChevron={false}
            showDividerBelow={false}
          />
        </SettingsGroupedCard>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
});
