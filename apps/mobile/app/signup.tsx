import { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  View,
} from "react-native";
import { useRouter } from "expo-router";
import { useTranslation } from "react-i18next";

import { AppButton } from "@/components/ui/Button";
import { AppTextField } from "@/components/ui/Input";
import { Screen } from "@/components/layout/screen";
import { AppPalette } from "@/constants/palette";
import { useAuth } from "@/contexts/auth-context";
import { normalizeHttpError } from "@/infrastructure/http/error-handler";
import {
  getClientPrivacyVersion,
  getClientTermsVersion,
} from "@/constants/legal-document-versions";
import { getSchemeColors } from "@/constants/palette";
import { useColorScheme } from "@/hooks/use-color-scheme";

const USERNAME_MIN = 2;
const USERNAME_MAX = 80;
const PASSWORD_MIN = 8;

export default function SignupScreen() {
  const { t } = useTranslation("auth");
  const router = useRouter();
  const { signUp } = useAuth();
  const scheme = useColorScheme() ?? "light";
  const c = getSchemeColors(scheme);

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [acceptPrivacy, setAcceptPrivacy] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function validate(): string | null {
    const u = username.trim();
    const e = email.trim();
    if (u.length < USERNAME_MIN || u.length > USERNAME_MAX) {
      return t("signupUsernameLength");
    }
    if (!e.includes("@")) {
      return t("signupEmailInvalid");
    }
    if (password.length < PASSWORD_MIN) {
      return t("signupPasswordLength");
    }
    if (!acceptTerms || !acceptPrivacy) {
      return t("signupLegalRequired");
    }
    return null;
  }

  async function onSubmit() {
    setError(null);
    const v = validate();
    if (v) {
      setError(v);
      return;
    }
    setLoading(true);
    try {
      await signUp({
        username: username.trim(),
        email: email.trim(),
        password,
        termsVersion: getClientTermsVersion(),
        privacyVersion: getClientPrivacyVersion(),
      });
      router.replace("/(tabs)");
    } catch (e) {
      setError(normalizeHttpError(e, t("signupErrorGeneric")).message);
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
            <Text style={[styles.title, { color: c.text }]}>{t("signupTitle")}</Text>
            <Text style={[styles.subtitle, { color: c.textSecondary }]}>
              {t("signupSubtitle")}
            </Text>
          </View>

          <View style={styles.form}>
            <AppTextField
              label={t("username")}
              value={username}
              onChangeText={setUsername}
              autoCapitalize="none"
              autoComplete="username"
              textContentType="username"
              returnKeyType="next"
              accessibilityLabel={t("username")}
            />
            <AppTextField
              label={t("email")}
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              autoComplete="email"
              keyboardType="email-address"
              textContentType="emailAddress"
              returnKeyType="next"
              accessibilityLabel={t("email")}
            />
            <AppTextField
              label={t("password")}
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              autoComplete="new-password"
              textContentType="newPassword"
              returnKeyType="done"
              onSubmitEditing={onSubmit}
              accessibilityLabel={t("password")}
            />

            <View style={[styles.legalRow, { borderColor: c.border }]}>
              <Switch
                value={acceptTerms}
                onValueChange={setAcceptTerms}
                trackColor={{ false: c.border, true: AppPalette.primary }}
                accessibilityLabel={t("signupAcceptTerms")}
              />
              <View style={styles.legalRowText}>
                <Text style={{ color: c.text }}>{t("signupAcceptTerms")}</Text>
                <Pressable
                  onPress={() => router.push({ pathname: "/profile-legal", params: { kind: "terms" } })}
                  accessibilityRole="link"
                  accessibilityLabel={t("signupOpenTermsA11y")}>
                  <Text style={[styles.legalLink, { color: AppPalette.primary }]}>
                    {t("signupViewTermsLink")}
                  </Text>
                </Pressable>
              </View>
            </View>

            <View style={[styles.legalRow, { borderColor: c.border }]}>
              <Switch
                value={acceptPrivacy}
                onValueChange={setAcceptPrivacy}
                trackColor={{ false: c.border, true: AppPalette.primary }}
                accessibilityLabel={t("signupAcceptPrivacy")}
              />
              <View style={styles.legalRowText}>
                <Text style={{ color: c.text }}>{t("signupAcceptPrivacy")}</Text>
                <Pressable
                  onPress={() => router.push({ pathname: "/profile-legal", params: { kind: "privacy" } })}
                  accessibilityRole="link"
                  accessibilityLabel={t("signupOpenPrivacyA11y")}>
                  <Text style={[styles.legalLink, { color: AppPalette.primary }]}>
                    {t("signupViewPrivacyLink")}
                  </Text>
                </Pressable>
              </View>
            </View>

            {error ? <Text style={styles.formError}>{error}</Text> : null}

            <AppButton
              title={t("signUp")}
              onPress={onSubmit}
              loading={loading}
              fullWidth
            />

            <Pressable
              onPress={() => router.push("/login")}
              accessibilityRole="link"
              accessibilityLabel={t("signupHasAccountLink")}
            >
              <Text style={[styles.link, { color: c.textSecondary }]}>
                {t("signupHasAccount")}
              </Text>
            </Pressable>
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
  legalRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
    paddingVertical: 8,
    paddingHorizontal: 4,
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: 12,
  },
  legalRowText: {
    flex: 1,
    gap: 4,
  },
  legalLink: {
    fontSize: 14,
    fontWeight: "600",
    textDecorationLine: "underline",
  },
  formError: {
    color: "#B91C1C",
    fontSize: 14,
  },
  link: {
    fontSize: 15,
    textAlign: "center",
    textDecorationLine: "underline",
    marginTop: 8,
  },
});
