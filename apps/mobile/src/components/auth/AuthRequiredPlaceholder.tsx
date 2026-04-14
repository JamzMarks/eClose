import { StyleSheet, Text, View } from "react-native";
import { useRouter } from "expo-router";
import { useTranslation } from "react-i18next";

import { Layout, Paddings } from "@/constants/layout";
import { PrimaryButton } from "@/components/ui";
import { getSchemeColors } from "@/constants/palette";
import { useColorScheme } from "@/hooks/use-color-scheme";

export type AuthRequiredPlaceholderProps = {
  /** Texto explicativo específico do ecrã (já traduzido). */
  message: string;
  /** Título curto; omite para usar `auth.authRequiredDefaultTitle`. */
  title?: string;
  /** Rótulo do botão; omite para usar `auth.signIn`. */
  loginLabel?: string;
  /** Quando `true`, sem padding horizontal no bloco (o pai define o gutter, ex. `TabScreenContent`). */
  insetFromParent?: boolean;
};

/**
 * Estado vazio padronizado quando o utilizador não tem sessão mas abriu um ecrã que a exige.
 */
export function AuthRequiredPlaceholder({
  message,
  title,
  loginLabel,
  insetFromParent,
}: AuthRequiredPlaceholderProps) {
  const router = useRouter();
  const { t } = useTranslation("auth");
  const scheme = useColorScheme() ?? "light";
  const c = getSchemeColors(scheme);

  const headline = title ?? t("authRequiredDefaultTitle");
  const cta = loginLabel ?? t("signIn");

  return (
    <View
      style={[styles.root, insetFromParent && styles.rootInsetParent]}
      accessibilityRole="summary"
      accessibilityLabel={`${headline}. ${message}`}>
      <Text style={[styles.title, { color: c.text }]}>{headline}</Text>
      <Text style={[styles.message, { color: c.textSecondary }]}>{message}</Text>
      <PrimaryButton title={cta} onPress={() => router.push("/login")} style={styles.loginCta} />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    justifyContent: "flex-start",
    paddingHorizontal: Layout.tab.content.horizontalPadding,
    paddingTop: Layout.tab.content.topPaddingAfterHeader + Paddings.sm,
    paddingBottom: Paddings.xxl,
    gap: Paddings.lg,
    maxWidth: 420,
    alignSelf: "center",
    width: "100%",
    alignItems: "flex-start",
  },
  rootInsetParent: {
    paddingHorizontal: 0,
  },
  title: {
    fontSize: 26,
    fontWeight: "700",
    letterSpacing: -0.35,
    textAlign: "left",
  },
  message: {
    fontSize: 18,
    lineHeight: 28,
    textAlign: "left",
  },
  loginCta: {
    alignSelf: "flex-start",
  },
});
