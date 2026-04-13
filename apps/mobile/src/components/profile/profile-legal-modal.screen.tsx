import { useCallback, useEffect, useLayoutEffect, useMemo, useState } from "react";
import { Image, Linking, ScrollView, StyleSheet, Text, View } from "react-native";
import { useNavigation, useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import type { NativeStackNavigationOptions } from "@react-navigation/native-stack";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import {
  CollapsingStackLargeTitle,
  collapsingScrollProps,
  useCollapsingStackHeaderTitle,
} from "@/components/navigation/collapsing-stack-header-title";
import { LegalDocumentModalLayout } from "@/components/legal/LegalDocumentModalLayout";
import { LegalWebDocumentViewer } from "@/components/legal/LegalWebDocumentViewer";
import {
  buildMinimalStackHeaderOptions,
  minimalStackBackCircleBackground,
} from "@/components/navigation/minimal-stack-header";
import { PrimaryButton } from "@/components/ui";
import { getLegalBundledHtmlModule } from "@/constants/legal-bundled-assets";
import {
  appendLegalViewerParams,
  normalizeLegalLang,
} from "@/constants/legal-document-url";
import {
  getClientPrivacyVersion,
  getClientTermsVersion,
} from "@/constants/legal-document-versions";
import {
  getProfileLegalModalConfig,
  isProfileLegalModalKind,
  type ProfileLegalModalKind,
} from "@/constants/profile-legal-modal.config";
import { Layout } from "@/constants/layout";
import { getSchemeColors } from "@/constants/palette";
import { useColorScheme } from "@/hooks/use-color-scheme";

function LegalHelpScrollBody({
  textColor,
  insetsBottom,
  backgroundColor,
  onOpenMail,
}: {
  textColor: string;
  insetsBottom: number;
  backgroundColor: string;
  onOpenMail: () => void;
}) {
  const { t } = useTranslation("profile");
  return (
    <ScrollView
      contentContainerStyle={[
        styles.mailBody,
        { paddingBottom: insetsBottom + 24, backgroundColor },
      ]}
      keyboardShouldPersistTaps="handled">
      <Text style={[styles.mailCopy, { color: textColor }]}>{t("legalHelpBody")}</Text>
      <PrimaryButton
        title={t("legalHelpOpenExternal")}
        onPress={onOpenMail}
        fullWidth
        accessibilityLabel={t("legalHelpOpenExternalA11y")}
      />
    </ScrollView>
  );
}

export type ProfileLegalModalScreenProps = {
  kind: string | undefined;
};

/** Modal fullscreen (ex.: signup) — mesmo conteúdo, chrome tipo sheet com header minimal. */
export function ProfileLegalModalScreen({ kind }: ProfileLegalModalScreenProps) {
  const { t, i18n } = useTranslation("profile");
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const scheme = useColorScheme() ?? "light";
  const c = getSchemeColors(scheme);

  const validKind: ProfileLegalModalKind | null = isProfileLegalModalKind(kind) ? kind : null;
  const config = validKind ? getProfileLegalModalConfig(validKind) : null;

  const [fallbackFileUri, setFallbackFileUri] = useState<string | null>(null);

  const close = useCallback(() => {
    if (router.canGoBack()) {
      router.back();
      return;
    }
    router.replace("/(tabs)");
  }, [router]);

  useEffect(() => {
    if (!config) {
      close();
    }
  }, [config, close]);

  const resolvedWebUri = useMemo(() => {
    if (!config?.url || !config.requiresWebView) return "";
    return appendLegalViewerParams(config.url, {
      lang: i18n.language,
      theme: scheme === "dark" ? "dark" : "light",
    });
  }, [config?.requiresWebView, config?.url, i18n.language, scheme]);

  useEffect(() => {
    if (!validKind || validKind === "help") {
      setFallbackFileUri(null);
      return;
    }
    const lang = normalizeLegalLang(i18n.language);
    const mod = getLegalBundledHtmlModule(validKind, lang);
    const resolved = Image.resolveAssetSource(mod);
    setFallbackFileUri(resolved?.uri ?? null);
  }, [validKind, i18n.language]);

  const openExternalUrl = useCallback(async () => {
    if (!config?.url) return;
    const can = await Linking.canOpenURL(config.url);
    if (can) await Linking.openURL(config.url);
  }, [config?.url]);

  if (!config) {
    return null;
  }

  const title = t(config.titleI18nKey);
  const versionLine =
    validKind === "terms"
      ? t("legalDocumentVersionLabel", { version: getClientTermsVersion() })
      : validKind === "privacy"
        ? t("legalDocumentVersionLabel", { version: getClientPrivacyVersion() })
        : null;

  return (
    <LegalDocumentModalLayout
      title={title}
      versionLine={versionLine}
      onClose={close}
      backAccessibilityLabel={t("legalModalBack")}
      showDragHandle={false}>
      {config.requiresWebView ? (
        <LegalWebDocumentViewer
          uri={resolvedWebUri}
          backgroundColor={c.background}
          fallbackFileUri={fallbackFileUri}
          retryLabel={t("legalWebRetry")}
          openInBrowserLabel={t("legalWebOpenInBrowser")}
          loadErrorMessage={t("legalWebLoadError")}
          offlineFallbackLabel={t("legalWebOfflineFallback")}
        />
      ) : (
        <LegalHelpScrollBody
          textColor={c.textSecondary}
          insetsBottom={insets.bottom}
          backgroundColor={c.background}
          onOpenMail={() => void openExternalUrl()}
        />
      )}
    </LegalDocumentModalLayout>
  );
}

export type ProfileLegalStackScreenProps = {
  kind: string | undefined;
};

/** Dentro da stack Definições: header nativo + versão no conteúdo (WebView) ou título colapsável (ajuda). */
export function ProfileLegalStackScreen({ kind }: ProfileLegalStackScreenProps) {
  const { t, i18n } = useTranslation("profile");
  const { t: tCommon } = useTranslation("common");
  const navigation = useNavigation();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const scheme = useColorScheme() ?? "light";
  const c = getSchemeColors(scheme);
  const isDark = scheme === "dark";

  const validKind: ProfileLegalModalKind | null = isProfileLegalModalKind(kind) ? kind : null;
  const config = validKind ? getProfileLegalModalConfig(validKind) : null;

  const [fallbackFileUri, setFallbackFileUri] = useState<string | null>(null);

  useEffect(() => {
    if (!config && router.canGoBack()) {
      router.back();
    }
  }, [config, router]);

  const resolvedWebUri = useMemo(() => {
    if (!config?.url || !config.requiresWebView) return "";
    return appendLegalViewerParams(config.url, {
      lang: i18n.language,
      theme: scheme === "dark" ? "dark" : "light",
    });
  }, [config?.requiresWebView, config?.url, i18n.language, scheme]);

  useEffect(() => {
    if (!validKind || validKind === "help") {
      setFallbackFileUri(null);
      return;
    }
    const lang = normalizeLegalLang(i18n.language);
    const mod = getLegalBundledHtmlModule(validKind, lang);
    const resolved = Image.resolveAssetSource(mod);
    setFallbackFileUri(resolved?.uri ?? null);
  }, [validKind, i18n.language]);

  const openExternalUrl = useCallback(async () => {
    if (!config?.url) return;
    const can = await Linking.canOpenURL(config.url);
    if (can) await Linking.openURL(config.url);
  }, [config?.url]);

  const title = config ? t(config.titleI18nKey) : "";
  const versionLine =
    validKind === "terms"
      ? t("legalDocumentVersionLabel", { version: getClientTermsVersion() })
      : validKind === "privacy"
        ? t("legalDocumentVersionLabel", { version: getClientPrivacyVersion() })
        : null;

  const chrome = useMemo(
    () => ({
      headerBackgroundColor: c.background,
      tintColor: c.text,
      circleBackgroundColor: minimalStackBackCircleBackground(isDark ? "dark" : "light"),
      backAccessibilityLabel: tCommon("backA11y"),
    }),
    [c.background, c.text, isDark, tCommon],
  );

  const isHelp = validKind === "help";

  const collapse = useCollapsingStackHeaderTitle({
    enabled: isHelp,
    skipHeaderSync: !isHelp,
    navigation,
    collapsedTitle: title,
    headerTitleColor: c.text,
    chrome,
  });

  useLayoutEffect(() => {
    if (!config || isHelp) {
      return;
    }
    navigation.setOptions({
      ...buildMinimalStackHeaderOptions(chrome),
      headerTitleAlign: "center",
      headerTitle: () => (
        <Text
          numberOfLines={1}
          style={[styles.stackNavTitle, { color: c.text }]}
          accessibilityRole="header">
          {title}
        </Text>
      ),
    } as NativeStackNavigationOptions);
  }, [navigation, chrome, config, isHelp, title, c.text]);

  if (!config) {
    return null;
  }

  return (
    <View style={[styles.stackRoot, { backgroundColor: c.background }]}>
      {config.requiresWebView ? (
        <>
          {versionLine ? (
            <Text
              style={[
                styles.versionBanner,
                {
                  color: c.textSecondary,
                  borderBottomColor: c.border,
                  paddingHorizontal: Layout.tab.content.horizontalPadding,
                },
              ]}>
              {versionLine}
            </Text>
          ) : null}
          <LegalWebDocumentViewer
            uri={resolvedWebUri}
            backgroundColor={c.background}
            fallbackFileUri={fallbackFileUri}
            retryLabel={t("legalWebRetry")}
            openInBrowserLabel={t("legalWebOpenInBrowser")}
            loadErrorMessage={t("legalWebLoadError")}
            offlineFallbackLabel={t("legalWebOfflineFallback")}
          />
        </>
      ) : (
        <ScrollView
          contentContainerStyle={[
            styles.stackHelpContent,
            { paddingBottom: insets.bottom + 24, paddingHorizontal: Layout.tab.content.horizontalPadding },
          ]}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          {...collapsingScrollProps(collapse)}>
          <CollapsingStackLargeTitle color={c.text} collapse={collapse}>
            {title}
          </CollapsingStackLargeTitle>
          <Text style={[styles.mailCopy, { color: c.textSecondary }]}>{t("legalHelpBody")}</Text>
          <PrimaryButton
            title={t("legalHelpOpenExternal")}
            onPress={() => void openExternalUrl()}
            fullWidth
            accessibilityLabel={t("legalHelpOpenExternalA11y")}
          />
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  stackRoot: {
    flex: 1,
  },
  stackNavTitle: {
    fontSize: 17,
    fontWeight: "600",
    letterSpacing: -0.28,
    textAlign: "center",
    maxWidth: 220,
  },
  versionBanner: {
    fontSize: 12,
    lineHeight: 16,
    paddingVertical: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  stackHelpContent: {
    flexGrow: 1,
    paddingTop: 0,
    gap: 20,
  },
  mailBody: {
    flexGrow: 1,
    paddingHorizontal: Layout.tab.content.horizontalPadding,
    paddingTop: 24,
    gap: 20,
  },
  mailCopy: {
    fontSize: 16,
    lineHeight: 24,
  },
});
