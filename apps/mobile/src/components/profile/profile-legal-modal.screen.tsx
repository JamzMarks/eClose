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
import { ExternalLink } from "lucide-react-native";

import { AppButton } from "@/components/ui/button";
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
    router.back();
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
        <Text style={[styles.headerTitle, { color: c.text }]} numberOfLines={1}>
          {title}
        </Text>
        <View style={[styles.headerSide, styles.headerSideRight]}>
          {config.isExternalLink ? (
            <View
              accessible
              accessibilityRole="image"
              accessibilityLabel={t("legalExternalLinkA11y")}
              style={styles.externalIconWrap}>
              <ExternalLink size={22} color={c.text} />
            </View>
          ) : null}
        </View>
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
          <AppButton
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
  externalIconWrap: {
    paddingVertical: 4,
    paddingLeft: 8,
  },
  backLabel: {
    fontSize: 17,
    fontWeight: "600",
  },
  headerTitle: {
    flex: 1,
    fontSize: 17,
    fontWeight: "700",
    textAlign: "center",
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
