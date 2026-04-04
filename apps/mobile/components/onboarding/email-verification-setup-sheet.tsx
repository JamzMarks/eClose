import { useEffect, useMemo, useState } from "react";
import { Modal, Pressable, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTranslation } from "react-i18next";

import { AppButton } from "@/components/ui/button";
import { AppTextField } from "@/components/ui/text-field";
import { getSchemeColors } from "@/constants/palette";
import { useColorScheme } from "@/hooks/use-color-scheme";
import type { IAuthService } from "@/infrastructure/api/auth/auth.service.interface";
import { AuthService } from "@/infrastructure/api/auth/auth.service";
import type { UserProfileResponse } from "@/infrastructure/api/types/auth.types";
import { normalizeHttpError } from "@/infrastructure/http/error-handler";

export type EmailVerificationSetupSheetProps = {
  visible: boolean;
  user: UserProfileResponse;
  onDismiss: (reason: "verified" | "later") => void;
  /** Atualiza o perfil após o utilizador confirmar o e-mail (ex.: deep link ou outro dispositivo). */
  onRefreshProfile: () => Promise<void>;
  authService?: IAuthService;
};

export function EmailVerificationSetupSheet({
  visible,
  user,
  onDismiss,
  onRefreshProfile,
  authService: injectedAuth,
}: EmailVerificationSetupSheetProps) {
  const authService = useMemo(
    () => injectedAuth ?? new AuthService(),
    [injectedAuth],
  );
  const { t } = useTranslation("onboarding");
  const insets = useSafeAreaInsets();
  const scheme = useColorScheme() ?? "light";
  const c = getSchemeColors(scheme);

  const [token, setToken] = useState("");
  const [busy, setBusy] = useState<"resend" | "confirm" | "refresh" | null>(
    null,
  );
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!visible) return;
    setToken("");
    setError(null);
  }, [visible, user.id]);

  async function handleResend() {
    setError(null);
    setBusy("resend");
    try {
      await authService.sendEmailVerification();
    } catch (e) {
      setError(normalizeHttpError(e, t("emailVerifyResendError")).message);
    } finally {
      setBusy(null);
    }
  }

  async function handleConfirmToken() {
    const trimmed = token.trim();
    if (!trimmed) {
      setError(t("emailVerifyTokenRequired"));
      return;
    }
    setError(null);
    setBusy("confirm");
    try {
      await authService.confirmEmailVerification(trimmed);
      await onRefreshProfile();
      onDismiss("verified");
    } catch (e) {
      setError(normalizeHttpError(e, t("emailVerifyConfirmError")).message);
    } finally {
      setBusy(null);
    }
  }

  async function handleRefreshed() {
    setError(null);
    setBusy("refresh");
    try {
      await onRefreshProfile();
    } catch (e) {
      setError(normalizeHttpError(e, t("emailVerifyRefreshError")).message);
    } finally {
      setBusy(null);
    }
  }

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={[styles.backdrop, { paddingTop: insets.top + 12 }]}>
        <View style={[styles.card, { backgroundColor: c.surface }]}>
          <Text style={[styles.title, { color: c.text }]}>{t("emailVerifyTitle")}</Text>
          <Text style={[styles.body, { color: c.textSecondary }]}>
            {t("emailVerifyBody", { email: user.email })}
          </Text>

          {error ? <Text style={styles.err}>{error}</Text> : null}

          <AppButton
            title={t("emailVerifyResend")}
            onPress={handleResend}
            loading={busy === "resend"}
            variant="secondary"
            fullWidth
          />

          <AppTextField
            label={t("emailVerifyTokenLabel")}
            value={token}
            onChangeText={setToken}
            autoCapitalize="none"
            autoComplete="off"
            returnKeyType="done"
            accessibilityLabel={t("emailVerifyTokenLabel")}
          />

          <AppButton
            title={t("emailVerifyConfirmToken")}
            onPress={handleConfirmToken}
            loading={busy === "confirm"}
            fullWidth
          />

          <AppButton
            title={t("emailVerifyRefreshed")}
            onPress={handleRefreshed}
            loading={busy === "refresh"}
            variant="secondary"
            fullWidth
          />

          <Pressable
            onPress={() => onDismiss("later")}
            accessibilityRole="button"
            accessibilityLabel={t("emailVerifyLater")}
          >
            <Text style={[styles.later, { color: c.textSecondary }]}>
              {t("emailVerifyLater")}
            </Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.45)",
    justifyContent: "flex-end",
  },
  card: {
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    paddingHorizontal: 20,
    paddingBottom: 28,
    gap: 14,
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    marginTop: 8,
  },
  body: {
    fontSize: 15,
    lineHeight: 22,
  },
  err: {
    color: "#B91C1C",
    fontSize: 14,
  },
  later: {
    fontSize: 15,
    textAlign: "center",
    paddingVertical: 8,
  },
});
