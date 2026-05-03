import { useCallback, useEffect, useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Image } from "expo-image";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useTranslation } from "react-i18next";

import { AppButton } from "@/components/ui/Button";
import { AppTextField } from "@/components/ui/Input";
import {
  OAuthOrSeparator,
  shouldShowAppleAuth,
  SocialAuthIconRow,
} from "@/components/auth/social-auth-section";
import { useAuth } from "@/contexts/auth-context";
import { isAuthMockEnabled } from "@/lib/auth-mock";
import { normalizeHttpError } from "@/infrastructure/http/error-handler";
import {
  getClientPrivacyVersion,
  getClientTermsVersion,
} from "@/constants/legal-document-versions";
import { Layout, Paddings, Radii } from "@/constants/layout";
import { AppIcon } from "@/components/ui/icon/icon.types";
import { AppPalette, getSchemeColors } from "@/constants/palette";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { OAuthProviderId } from "@/contracts/auth.types";

const USERNAME_MIN = 2;
const USERNAME_MAX = 80;
const PASSWORD_MIN = 8;

type AuthMode = "login" | "signup";

const APP_LOGO = require("../assets/images/icon.png");

function mapOAuthError(e: unknown, t: (k: string) => string): string {
  if (e instanceof Error && e.message === "OAUTH_CANCELLED") {
    return t("oauthCancelled");
  }
  if (e instanceof Error && e.message === "OAUTH_LOCAL") {
    return t("oauthUnavailableLocal");
  }
  return normalizeHttpError(e, t("errorGeneric")).message;
}

export default function LoginScreen() {
  const { t } = useTranslation("auth");
  const router = useRouter();
  const { mode: modeParam } = useLocalSearchParams<{ mode?: string | string[] }>();
  const resolvedParam = Array.isArray(modeParam) ? modeParam[0] : modeParam;

  const { signIn, signInMock, signUp, signInWithOAuth } = useAuth();
  const mockAuth = isAuthMockEnabled();
  const scheme = useColorScheme() ?? "light";
  const c = getSchemeColors(scheme);

  const [authMode, setAuthMode] = useState<AuthMode>(() =>
    resolvedParam === "signup" ? "signup" : "login",
  );

  useEffect(() => {
    if (resolvedParam === "signup") setAuthMode("signup");
    if (resolvedParam === "login") setAuthMode("login");
  }, [resolvedParam]);

  const dismissModal = useCallback(() => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace("/(tabs)");
    }
  }, [router]);

  const insets = useSafeAreaInsets();
  const { height: windowHeight } = useWindowDimensions();
  /** Altura fixa do sheet (~90% do ecrã) para o modal não ficar só à altura do conteúdo. */
  const sheetFillHeight = Math.min(windowHeight * 0.9, windowHeight - insets.top);
  const sheetPadBottom = Math.max(insets.bottom, Paddings.lg);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const [oauthBusy, setOauthBusy] = useState<OAuthProviderId | null>(null);
  const [error, setError] = useState<string | null>(null);
  const formLocked = loading || oauthBusy !== null;

  function switchToSignup() {
    setError(null);
    setAuthMode("signup");
  }

  function switchToLogin() {
    setError(null);
    setAuthMode("login");
  }

  async function onMockExplore() {
    setError(null);
    setLoading(true);
    try {
      await signInMock();
      router.replace("/(tabs)");
    } catch (e) {
      setError(normalizeHttpError(e, t("errorGeneric")).message);
    } finally {
      setLoading(false);
    }
  }

  async function onLoginSubmit() {
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

  async function onOAuth(provider: OAuthProviderId) {
    if (provider === "apple" && Platform.OS !== "ios") {
      setError(t("oauthAppleUnavailable"));
      return;
    }
    setError(null);
    setOauthBusy(provider);
    try {
      await signInWithOAuth(provider);
      router.replace("/(tabs)");
    } catch (e) {
      setError(mapOAuthError(e, t));
    } finally {
      setOauthBusy(null);
    }
  }

  function validateSignup(): string | null {
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
    return null;
  }

  async function onSignupSubmit() {
    setError(null);
    const v = validateSignup();
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

  const isSignup = authMode === "signup";
  const showApple = shouldShowAppleAuth();
  const overlayColor = scheme === "dark" ? "rgba(0,0,0,0.62)" : "rgba(0,0,0,0.38)";

  return (
    <View style={styles.root}>
      <Pressable
        onPress={dismissModal}
        style={[StyleSheet.absoluteFillObject, { backgroundColor: overlayColor }]}
        accessibilityRole="button"
        accessibilityLabel={t("loginCloseA11y")}
      />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={styles.sheetKeyboard}
        keyboardVerticalOffset={Platform.OS === "ios" ? insets.bottom : 0}>
        <View
          style={[
            styles.sheet,
            {
              backgroundColor: c.background,
              borderTopLeftRadius: Radii.xl,
              borderTopRightRadius: Radii.xl,
              paddingBottom: sheetPadBottom,
              height: sheetFillHeight,
            },
          ]}>
          <ScrollView
            contentContainerStyle={styles.scroll}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
            style={styles.sheetScroll}>
            <View style={styles.brandBlock}>
              <Image
                source={APP_LOGO}
                style={styles.logo}
                contentFit="contain"
                accessibilityIgnoresInvertColors
                accessibilityLabel={t("appLogoA11y")}
              />
              <Text style={[styles.title, { color: c.text }]}>
                {isSignup ? t("signupTitle") : t("title")}
              </Text>
            </View>

            <View style={styles.form}>
              {isSignup ? (
                <AppTextField
                  label={t("username")}
                  labelLayout="placeholder"
                  startIcon={AppIcon.Profile}
                  value={username}
                  onChangeText={setUsername}
                  autoCapitalize="none"
                  autoComplete="username"
                  textContentType="username"
                  returnKeyType="next"
                  accessibilityHint={t("fieldUsernameA11yHint")}
                />
              ) : null}

              <AppTextField
                label={t("email")}
                labelLayout="placeholder"
                startIcon={AppIcon.Mail}
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                autoComplete="email"
                keyboardType="email-address"
                textContentType="emailAddress"
                returnKeyType="next"
                accessibilityHint={t("fieldEmailA11yHint")}
              />
              <AppTextField
                label={t("password")}
                labelLayout="placeholder"
                startIcon={AppIcon.Lock}
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                autoComplete={isSignup ? "new-password" : "password"}
                textContentType={isSignup ? "newPassword" : "password"}
                returnKeyType="done"
                onSubmitEditing={isSignup ? onSignupSubmit : onLoginSubmit}
                accessibilityHint={
                  isSignup ? t("fieldPasswordSignupA11yHint") : t("fieldPasswordLoginA11yHint")
                }
              />

              {isSignup ? (
                <Text style={[styles.legalNotice, { color: c.textSecondary }]}>
                  {t("signupLegalLead")}{" "}
                  <Text
                    onPress={() =>
                      router.push({ pathname: "/profile-legal", params: { kind: "terms" } })
                    }
                    style={[styles.legalLinkInline, { color: AppPalette.primary }]}
                    accessibilityRole="link"
                    accessibilityLabel={t("signupOpenTermsA11y")}>
                    {t("signupLegalTerms")}
                  </Text>
                  {` ${t("signupLegalJoin")} `}
                  <Text
                    onPress={() =>
                      router.push({ pathname: "/profile-legal", params: { kind: "privacy" } })
                    }
                    style={[styles.legalLinkInline, { color: AppPalette.primary }]}
                    accessibilityRole="link"
                    accessibilityLabel={t("signupOpenPrivacyA11y")}>
                    {t("signupLegalPrivacy")}
                  </Text>
                  .
                </Text>
              ) : null}

              {error ? <Text style={styles.formError}>{error}</Text> : null}

              <AppButton
                title={isSignup ? t("signUp") : t("signIn")}
                onPress={isSignup ? onSignupSubmit : onLoginSubmit}
                loading={loading}
                disabled={formLocked}
                fullWidth
              />

              <OAuthOrSeparator orLabel={t("orSeparator")} isDark={scheme === "dark"} />

              <SocialAuthIconRow
                onGooglePress={() => void onOAuth("google")}
                onApplePress={showApple ? () => void onOAuth("apple") : undefined}
                showApple={showApple}
                disabled={formLocked}
                googleLoading={oauthBusy === "google"}
                appleLoading={oauthBusy === "apple"}
                googleA11y={t("continueWithGoogle")}
                appleA11y={t("continueWithApple")}
                isDark={scheme === "dark"}
              />

              {!isSignup && mockAuth ? (
                <AppButton
                  title={t("signInMock")}
                  onPress={onMockExplore}
                  loading={loading}
                  disabled={formLocked}
                  fullWidth
                  variant="secondary"
                />
              ) : null}

              <Pressable
                onPress={isSignup ? switchToLogin : switchToSignup}
                accessibilityRole="link"
                accessibilityLabel={isSignup ? t("signupHasAccountLink") : t("createAccountLink")}>
                <Text style={[styles.link, { color: c.textSecondary }]}>
                  {isSignup ? t("signupHasAccount") : t("createAccount")}
                </Text>
              </Pressable>
            </View>
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "transparent",
  },
  sheetKeyboard: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    width: "100%",
  },
  sheet: {
    overflow: "hidden",
  },
  sheetScroll: {
    flex: 1,
  },
  /** Com o sheet alto (~90% do ecrã), o bloco fica centrado verticalmente; se o teclado/conteúdo exceder a altura, continua a rolar. */
  scroll: {
    flexGrow: 1,
    justifyContent: "center",
    paddingHorizontal: Layout.tab.content.horizontalPadding,
    paddingVertical: Paddings.lg,
    gap: Paddings.xxl,
  },
  brandBlock: {
    alignItems: "center",
    gap: Paddings.md,
  },
  logo: {
    width: 72,
    height: 72,
    borderRadius: Radii.lg,
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    letterSpacing: -0.3,
    textAlign: "center",
  },
  form: {
    gap: Paddings.md,
  },
  legalNotice: {
    fontSize: 12,
    lineHeight: 17,
  },
  legalLinkInline: {
    fontSize: 12,
    lineHeight: 17,
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
    marginTop: Paddings.sm,
  },
});
