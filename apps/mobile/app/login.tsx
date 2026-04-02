import { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useRouter } from "expo-router";
import { useTranslation } from "react-i18next";

import { AppButton } from "@/components/ui/button";
import { AppTextField } from "@/components/ui/text-field";
import { Screen } from "@/components/layout/screen";
import { useAuth } from "@/contexts/auth-context";
import { normalizeHttpError } from "@/infrastructure/http/error-handler";
import { getSchemeColors } from "@/constants/palette";
import { useColorScheme } from "@/hooks/use-color-scheme";

export default function LoginScreen() {
  const { t } = useTranslation("auth");
  const router = useRouter();
  const { signIn } = useAuth();
  const scheme = useColorScheme() ?? "light";
  const c = getSchemeColors(scheme);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit() {
    setError(null);
    setLoading(true);
    try {
      await signIn(email.trim(), password);
      router.replace("/(tabs)");
    } catch (e) {
      setError(normalizeHttpError(e, t("errorGeneric")).message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Screen>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.header}>
            <Text style={[styles.title, { color: c.text }]}>{t("title")}</Text>
            <Text style={[styles.subtitle, { color: c.textSecondary }]}>
              {t("subtitle")}
            </Text>
          </View>

          <View style={styles.form}>
            <AppTextField
              label={t("email")}
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              autoComplete="email"
              keyboardType="email-address"
              textContentType="emailAddress"
              returnKeyType="next"
            />
            <AppTextField
              label={t("password")}
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              autoComplete="password"
              textContentType="password"
              returnKeyType="done"
              onSubmitEditing={onSubmit}
            />

            {error ? (
              <Text style={styles.formError}>{error}</Text>
            ) : null}

            <AppButton
              title={t("signIn")}
              onPress={onSubmit}
              loading={loading}
              fullWidth
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  scroll: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 32,
    justifyContent: "center",
    gap: 32,
  },
  header: {
    gap: 8,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
  },
  subtitle: {
    fontSize: 16,
    lineHeight: 22,
  },
  form: {
    gap: 16,
  },
  formError: {
    color: "#B91C1C",
    fontSize: 14,
  },
});
