import { useMemo, useState } from "react";
import { Alert, ScrollView, StyleSheet, View } from "react-native";
import { useNavigation, useRouter, type Href } from "expo-router";
import { useTranslation } from "react-i18next";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import {
  CollapsingStackLargeTitle,
  collapsingScrollProps,
  useCollapsingStackHeaderTitle,
} from "@/components/navigation/collapsing-stack-header-title";
import { minimalStackBackCircleBackground } from "@/components/navigation/minimal-stack-header";
import { SettingsNavigationRow } from "@/components/settings/components/SettingsNavigationRow";
import {
  SettingsPreferencePickerSheet,
  type SettingsPickerOption,
} from "@/components/settings/components/SettingsPreferencePickerSheet";
import { SettingsScreenGroup } from "@/components/settings/components/SettingsScreenGroup";
import { AppIcon } from "@/components/ui/icon/icon.types";
import { getSchemeColors } from "@/constants/palette";
import { useAuth } from "@/contexts/auth-context";
import { useLocalePreference, type AppLocale } from "@/contexts/locale-preference-context";
import { useThemePreference, type ThemePreference } from "@/contexts/theme-preference-context";
import { useAccountSetup } from "@/features/account-setup";
import { useColorScheme } from "@/hooks/use-color-scheme";

/**
 * Modal de definições: grupos por finalidade; traço só no fim de cada grupo; linhas transparentes.
 */
export function SettingsModalScreen() {
  const { t } = useTranslation("settings");
  const { t: tProfile } = useTranslation("profile");
  const { t: tCommon } = useTranslation("common");
  const navigation = useNavigation();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const scheme = useColorScheme() ?? "light";
  const c = getSchemeColors(scheme);
  const isDark = scheme === "dark";

  const collapse = useCollapsingStackHeaderTitle({
    enabled: true,
    navigation,
    collapsedTitle: t("title"),
    headerTitleColor: c.text,
    chrome: {
      headerBackgroundColor: c.surface,
      tintColor: c.text,
      circleBackgroundColor: minimalStackBackCircleBackground(isDark ? "dark" : "light"),
      backAccessibilityLabel: tCommon("backA11y"),
    },
  });
  const { user, signOut } = useAuth();
  const { openNotificationPreferencesSetup } = useAccountSetup();
  const { preference, setPreference } = useThemePreference();
  const { locale, setLocale } = useLocalePreference();
  const [pickerKind, setPickerKind] = useState<"appearance" | "language" | null>(null);

  const appearanceSubtitleKey = useMemo(() => {
    const map: Record<ThemePreference, string> = {
      system: "appearanceValueSystem",
      light: "appearanceValueLight",
      dark: "appearanceValueDark",
    };
    return map[preference];
  }, [preference]);

  const appearanceOptions = useMemo<SettingsPickerOption[]>(
    () => [
      { key: "system", icon: AppIcon.Contrast, label: t("appearanceOptionSystem") },
      { key: "light", icon: AppIcon.Sun, label: t("appearanceOptionLight") },
      { key: "dark", icon: AppIcon.Moon, label: t("appearanceOptionDark") },
    ],
    [t],
  );

  const languageSubtitleKey = useMemo(() => {
    const map: Record<AppLocale, string> = {
      pt: "languageValuePt",
      en: "languageValueEn",
    };
    return map[locale];
  }, [locale]);

  const languageOptions = useMemo<SettingsPickerOption[]>(
    () => [
      { key: "pt", icon: AppIcon.Globe, label: t("languageOptionPt") },
      { key: "en", icon: AppIcon.Globe, label: t("languageOptionEn") },
    ],
    [t],
  );

  const legalItems = useMemo(
    () =>
      [
        {
          kind: "privacy" as const,
          titleKey: "privacyPolicy" as const,
          icon: AppIcon.Shield,
        },
        {
          kind: "terms" as const,
          titleKey: "termsOfService" as const,
          icon: AppIcon.FileText,
        },
        {
          kind: "help" as const,
          titleKey: "helpContact" as const,
          icon: AppIcon.Help,
        },
      ] as const,
    [],
  );

  const rowBg = "transparent";
  const navProps = {
    textColor: c.text,
    subtitleColor: c.textMuted,
    borderColor: c.border,
    backgroundColor: rowBg,
    flat: true as const,
  };

  async function handleSignOut() {
    await signOut();
    router.replace("/(tabs)");
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
    <View style={[styles.root, { backgroundColor: c.surface }]}>
      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: insets.bottom + 24 },
        ]}
        showsVerticalScrollIndicator={false}
        {...collapsingScrollProps(collapse)}>
        <CollapsingStackLargeTitle color={c.text} collapse={collapse}>
          {t("title")}
        </CollapsingStackLargeTitle>
        {/* Conta: identidade + conteúdo associado */}
        <SettingsScreenGroup borderColor={c.border} showBottomRule paddingTop={0}>
          <SettingsNavigationRow
            icon={AppIcon.Profile}
            title={t("sectionAccount")}
            subtitle={user?.email ?? "—"}
            onPress={() => router.push("/settings/account")}
            {...navProps}
          />
          <SettingsNavigationRow
            icon={AppIcon.Wishlist}
            title={tProfile("wishlistsMenuTitle")}
            subtitle={tProfile("wishlistsMenuHint")}
            onPress={() => router.push("/settings/wishlists" as Href)}
            {...navProps}
          />
        </SettingsScreenGroup>

        {/* Experiência da app: alertas e personalização (UI + língua) */}
        <SettingsScreenGroup borderColor={c.border} showBottomRule paddingTop={14}>
          <SettingsNavigationRow
            icon={AppIcon.Notifications}
            title={t("notifications")}
            onPress={() => {
              router.back();
              requestAnimationFrame(() => openNotificationPreferencesSetup());
            }}
            {...navProps}
          />
          <SettingsNavigationRow
            icon={AppIcon.Settings}
            title={t("appearance")}
            subtitle={t(appearanceSubtitleKey)}
            onPress={() => setPickerKind("appearance")}
            {...navProps}
          />
          <SettingsNavigationRow
            icon={AppIcon.Globe}
            title={t("language")}
            subtitle={t(languageSubtitleKey)}
            onPress={() => setPickerKind("language")}
            {...navProps}
          />
        </SettingsScreenGroup>

        {/* Informação sobre o produto */}
        <SettingsScreenGroup borderColor={c.border} showBottomRule paddingTop={14}>
          <SettingsNavigationRow
            icon={AppIcon.Help}
            title={t("about")}
            onPress={() => router.push("/settings/about")}
            {...navProps}
          />
        </SettingsScreenGroup>

        {/* Documentos legais e apoio formal */}
        <SettingsScreenGroup borderColor={c.border} showBottomRule paddingTop={14}>
          {legalItems.map((item) => (
            <SettingsNavigationRow
              key={item.kind}
              icon={item.icon}
              title={tProfile(item.titleKey)}
              onPress={() =>
                router.push({ pathname: "/settings/legal/[kind]", params: { kind: item.kind } })
              }
              {...navProps}
            />
          ))}
        </SettingsScreenGroup>

        {/* Sessão */}
        <SettingsScreenGroup borderColor={c.border} showBottomRule={false} paddingTop={14}>
          <SettingsNavigationRow
            icon={AppIcon.LogOut}
            title={t("signOut")}
            onPress={confirmSignOut}
            {...navProps}
            destructive
            showChevron={false}
          />
        </SettingsScreenGroup>
      </ScrollView>
      <SettingsPreferencePickerSheet
        visible={pickerKind !== null}
        title={pickerKind === "language" ? t("language") : t("appearance")}
        titleIcon={pickerKind === "language" ? AppIcon.Globe : AppIcon.Settings}
        options={pickerKind === "language" ? languageOptions : appearanceOptions}
        selectedKey={pickerKind === "language" ? locale : preference}
        onSelect={(k) => {
          if (pickerKind === "language") void setLocale(k as AppLocale);
          else void setPreference(k as ThemePreference);
        }}
        onClose={() => setPickerKind(null)}
        cancelLabel={t("cancel")}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  scrollContent: {
    paddingHorizontal: 16,
  },
});
