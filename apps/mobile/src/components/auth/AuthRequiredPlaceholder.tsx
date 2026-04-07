import { StyleSheet, Text, View } from "react-native";
import { useRouter } from "expo-router";
import { useTranslation } from "react-i18next";

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
};

/**
 * Estado vazio padronizado quando o utilizador não tem sessão mas abriu um ecrã que a exige.
 */
export function AuthRequiredPlaceholder({
  message,
  title,
  loginLabel,
}: AuthRequiredPlaceholderProps) {
  const router = useRouter();
  const { t } = useTranslation("auth");
  const scheme = useColorScheme() ?? "light";
  const c = getSchemeColors(scheme);

  const headline = title ?? t("authRequiredDefaultTitle");
  const cta = loginLabel ?? t("signIn");

  return (
    <View
      style={styles.root}
      accessibilityRole="summary"
      accessibilityLabel={`${headline}. ${message}`}>
      <Text style={[styles.title, { color: c.text }]}>{headline}</Text>
      <Text style={[styles.message, { color: c.textSecondary }]}>{message}</Text>
      <PrimaryButton title={cta} onPress={() => router.push("/login")} fullWidth />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 28,
    paddingVertical: 32,
    gap: 16,
    maxWidth: 420,
    alignSelf: "center",
    width: "100%",
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    letterSpacing: -0.3,
    textAlign: "center",
  },
  message: {
    fontSize: 16,
    lineHeight: 24,
    textAlign: "center",
    marginBottom: 8,
  },
});
