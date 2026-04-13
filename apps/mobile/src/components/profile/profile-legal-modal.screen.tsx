import { useCallback, useEffect, useMemo, useState } from "react";
import { Image, Linking, ScrollView, StyleSheet, Text } from "react-native";
import { useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { LegalDocumentModalLayout } from "@/components/legal/LegalDocumentModalLayout";
import { LegalWebDocumentViewer } from "@/components/legal/LegalWebDocumentViewer";
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
import { getSchemeColors } from "@/constants/palette";
import { useColorScheme } from "@/hooks/use-color-scheme";

export type ProfileLegalModalScreenProps = {
  kind: string | undefined;
};

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
      backLabel={t("legalModalBack")}
      closeA11yLabel={t("legalModalCloseA11y")}
      showDragHandle>
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
        <ScrollView
          contentContainerStyle={[
            styles.mailBody,
            { paddingBottom: insets.bottom + 24, backgroundColor: c.background },
          ]}
          keyboardShouldPersistTaps="handled">
          <Text style={[styles.mailCopy, { color: c.textSecondary }]}>{t("legalHelpBody")}</Text>
          <PrimaryButton
            title={t("legalHelpOpenExternal")}
            onPress={() => void openExternalUrl()}
            fullWidth
            accessibilityLabel={t("legalHelpOpenExternalA11y")}
          />
        </ScrollView>
      )}
    </LegalDocumentModalLayout>
  );
}

const styles = StyleSheet.create({
  mailBody: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 24,
    gap: 20,
  },
  mailCopy: {
    fontSize: 16,
    lineHeight: 24,
  },
});
