import { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTranslation } from "react-i18next";

import { AppButton } from "@/components/ui/button";
import { AppTextField } from "@/components/ui/text-field";
import { AppPalette, getSchemeColors } from "@/constants/palette";
import { useColorScheme } from "@/hooks/use-color-scheme";
import type { IAuthService } from "@/infrastructure/api/auth/auth.service.interface";
import { AuthService } from "@/infrastructure/api/auth/auth.service";
import type { UserProfileResponse } from "@/infrastructure/api/types/auth.types";
import { normalizeHttpError } from "@/infrastructure/http/error-handler";

export type ProfileNamesSetupSheetProps = {
  visible: boolean;
  user: UserProfileResponse;
  onDismiss: (reason: "saved" | "later") => void;
  authService?: IAuthService;
};

export function ProfileNamesSetupSheet({
  visible,
  user,
  onDismiss,
  authService: injectedAuth,
}: ProfileNamesSetupSheetProps) {
  const authService = useMemo(
    () => injectedAuth ?? new AuthService(),
    [injectedAuth],
  );
  const { t } = useTranslation("onboarding");
  const insets = useSafeAreaInsets();
  const scheme = useColorScheme() ?? "light";
  const c = getSchemeColors(scheme);

  const [firstName, setFirstName] = useState(user.firstName ?? "");
  const [lastName, setLastName] = useState(user.lastName ?? "");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const bothPrefilled = Boolean(
    user.firstName?.trim() && user.lastName?.trim(),
  );

  useEffect(() => {
    if (!visible) return;
    setFirstName(user.firstName ?? "");
    setLastName(user.lastName ?? "");
    setError(null);
  }, [visible, user.firstName, user.lastName]);

  async function handleConfirm() {
    const fn = firstName.trim();
    const ln = lastName.trim();
    if (!fn || !ln) {
      setError(t("namesErrorRequired"));
      return;
    }
    if (user.needsEmailVerification) {
      setError(t("namesErrorEmailNotVerified"));
      return;
    }
    setError(null);
    setSaving(true);
    try {
      await authService.submitOnboardingStep({
        step: "names",
        firstName: fn,
        lastName: ln,
      });
      onDismiss("saved");
    } catch (e) {
      setError(normalizeHttpError(e, t("namesSaveError")).message);
    } finally {
      setSaving(false);
    }
  }

  function handleBackdrop() {
    onDismiss("later");
  }

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={handleBackdrop}
    >
      <Pressable style={styles.backdrop} onPress={handleBackdrop}>
        <Pressable
          style={[
            styles.sheet,
            {
              backgroundColor: c.surfaceElevated,
              paddingBottom: Math.max(insets.bottom, 20),
            },
          ]}
          onPress={(e) => e.stopPropagation()}
        >
          <View style={[styles.handle, { backgroundColor: c.borderStrong }]} />

          <Text style={[styles.title, { color: c.text }]}>
            {bothPrefilled ? t("namesConfirmTitle") : t("namesTitle")}
          </Text>
          <Text style={[styles.subtitle, { color: c.textSecondary }]}>
            {bothPrefilled ? t("namesConfirmSubtitle") : t("namesSubtitle")}
          </Text>

          {user.needsEmailVerification ? (
            <Text style={[styles.banner, { color: c.textSecondary }]}>
              {t("namesEmailVerifyHint")}
            </Text>
          ) : null}

          <AppTextField
            label={t("namesFirstName")}
            value={firstName}
            onChangeText={setFirstName}
            autoCapitalize="words"
            editable={!saving}
          />
          <View style={styles.fieldGap} />
          <AppTextField
            label={t("namesLastName")}
            value={lastName}
            onChangeText={setLastName}
            autoCapitalize="words"
            editable={!saving}
          />

          {error ? <Text style={styles.error}>{error}</Text> : null}

          <View style={styles.actions}>
            {saving ? (
              <View style={styles.loading}>
                <ActivityIndicator color={AppPalette.primary} />
              </View>
            ) : (
              <>
                <AppButton
                  title={
                    bothPrefilled ? t("namesConfirmAction") : t("namesSave")
                  }
                  onPress={() => void handleConfirm()}
                  fullWidth
                />
                <AppButton
                  title={t("namesLater")}
                  variant="ghost"
                  onPress={handleBackdrop}
                  fullWidth
                />
              </>
            )}
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0,0,0,0.45)",
  },
  sheet: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 24,
    paddingTop: 12,
  },
  handle: {
    alignSelf: "center",
    width: 40,
    height: 4,
    borderRadius: 2,
    marginBottom: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 15,
    lineHeight: 22,
    marginBottom: 16,
  },
  banner: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 12,
  },
  fieldGap: { height: 12 },
  error: {
    color: AppPalette.error,
    fontSize: 14,
    marginTop: 8,
  },
  actions: {
    gap: 8,
    marginTop: 20,
  },
  loading: {
    paddingVertical: 16,
    alignItems: "center",
  },
});
