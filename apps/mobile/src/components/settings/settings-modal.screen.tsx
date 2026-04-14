import { useMemo } from "react";
import {
  ActionSheetIOS,
  Alert,
  Platform,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
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
      headerBackgroundColor: c.background,
      tintColor: c.text,
      circleBackgroundColor: minimalStackBackCircleBackground(isDark ? "dark" : "light"),
      backAccessibilityLabel: tCommon("backA11y"),
    },
  });
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
    <View style={[styles.root, { backgroundColor: c.background }]}>
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
            onPress={openAppearancePicker}
            {...navProps}
          />
          <SettingsNavigationRow
            icon={AppIcon.Explore}
            title={t("language")}
            subtitle={t(languageSubtitleKey)}
            onPress={openLanguagePicker}
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
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  scrollContent: {
    paddingHorizontal: 16,
  },
});
