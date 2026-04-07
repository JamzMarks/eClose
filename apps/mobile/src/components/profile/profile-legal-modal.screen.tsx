import { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Linking,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { WebView } from "react-native-webview";

import { PrimaryButton } from "@/components/ui";
import {
  getClientPrivacyVersion,
  getClientTermsVersion,
} from "@/constants/legal-document-versions";
import {
  getProfileLegalModalConfig,
  isProfileLegalModalKind,
  type ProfileLegalModalKind,
} from "@/constants/profile-legal-modal.config";
import { AppPalette, getSchemeColors } from "@/constants/palette";
import { useColorScheme } from "@/hooks/use-color-scheme";

export type ProfileLegalModalScreenProps = {
  kind: string | undefined;
};

export function ProfileLegalModalScreen({ kind }: ProfileLegalModalScreenProps) {
  const { t } = useTranslation("profile");
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const scheme = useColorScheme() ?? "light";
  const c = getSchemeColors(scheme);
  const [webLoading, setWebLoading] = useState(true);

  const validKind: ProfileLegalModalKind | null = isProfileLegalModalKind(kind) ? kind : null;
  const config = validKind ? getProfileLegalModalConfig(validKind) : null;

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
    <View style={[styles.root, { backgroundColor: c.background, paddingTop: insets.top }]}>
      <View style={[styles.header, { borderBottomColor: c.border }]}>
        <Pressable
          onPress={close}
          hitSlop={12}
          accessibilityRole="button"
          accessibilityLabel={t("legalModalCloseA11y")}
          style={styles.headerSide}>
          <Text style={[styles.backLabel, { color: AppPalette.primary }]}>{t("legalModalBack")}</Text>
        </Pressable>
        <View style={styles.headerTitleBlock}>
          <Text style={[styles.headerTitle, { color: c.text }]} numberOfLines={1}>
            {title}
          </Text>
          {versionLine ? (
            <Text style={[styles.versionLine, { color: c.textSecondary }]} numberOfLines={2}>
              {versionLine}
            </Text>
          ) : null}
        </View>
        <View style={[styles.headerSide, styles.headerSideRight]} />
      </View>

      {config.requiresWebView ? (
        <View style={styles.webWrap}>
          {webLoading ? (
            <View style={[styles.webLoading, { backgroundColor: c.background }]}>
              <ActivityIndicator size="large" color={AppPalette.primary} />
            </View>
          ) : null}
          <WebView
            source={{ uri: config.url }}
            style={styles.webview}
            onLoadEnd={() => setWebLoading(false)}
            onError={() => setWebLoading(false)}
          />
        </View>
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
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
    gap: 8,
  },
  headerSide: {
    minWidth: 72,
    justifyContent: "center",
  },
  headerSideRight: {
    alignItems: "flex-end",
  },
  backLabel: {
    fontSize: 17,
    fontWeight: "600",
  },
  headerTitleBlock: {
    flex: 1,
    alignItems: "center",
    gap: 2,
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: "700",
    textAlign: "center",
  },
  versionLine: {
    fontSize: 12,
    lineHeight: 16,
    textAlign: "center",
    paddingHorizontal: 4,
  },
  webWrap: {
    flex: 1,
  },
  webview: {
    flex: 1,
    backgroundColor: "transparent",
  },
  webLoading: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1,
  },
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
