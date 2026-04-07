import { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Modal,
  Pressable,
  StyleSheet,
  Switch,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTranslation } from "react-i18next";

import { AppButton } from "@/components/ui/Button";
import { AppPalette, getSchemeColors } from "@/constants/palette";
import { useColorScheme } from "@/hooks/use-color-scheme";
import type { IAuthService } from "@/services/auth/auth.service.interface";
import { AuthService } from "@/services/auth/auth.service";
import type { INotificationPreferencesService } from "@/services/user/notification-preferences.service.interface";
import { NotificationPreferencesService } from "@/services/user/notification-preferences.service";
import type { NotificationPreferencesDto } from "@/services/types/notification-preferences.types";
import { normalizeHttpError } from "@/infrastructure/http/error-handler";

/** `account_flow`: após registo; permite saltar e grava estado local. `manual`: aberto pelas definições. */
export type ContinueSetupSheetMode = "account_flow" | "manual";

export type ContinueSetupSheetProps = {
  visible: boolean;
  mode: ContinueSetupSheetMode;
  onDismiss: (reason: "save" | "skip" | "close") => void;
  preferencesService?: INotificationPreferencesService;
  /** Gravação via `PATCH /auth/me/onboarding` (fluxo Auth); leitura continua em `/users/me/notification-preferences`. */
  authService?: IAuthService;
};

export function ContinueSetupSheet({
  visible,
  mode,
  onDismiss,
  preferencesService: injectedPreferencesService,
  authService: injectedAuthService,
}: ContinueSetupSheetProps) {
  const preferencesService = useMemo(
    () =>
      injectedPreferencesService ?? new NotificationPreferencesService(),
    [injectedPreferencesService],
  );
  const authService = useMemo(
    () => injectedAuthService ?? new AuthService(),
    [injectedAuthService],
  );
  const { t } = useTranslation("onboarding");
  const insets = useSafeAreaInsets();
  const scheme = useColorScheme() ?? "light";
  const c = getSchemeColors(scheme);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [prefs, setPrefs] = useState<NotificationPreferencesDto>({
    email: true,
    push: true,
    sms: false,
  });
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!visible) return;
    let cancelled = false;
    setError(null);
    setLoading(true);
    void (async () => {
      try {
        const next = await preferencesService.get();
        if (!cancelled) setPrefs(next);
      } catch (e) {
        if (!cancelled) {
          setError(normalizeHttpError(e, t("loadError")).message);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [visible, preferencesService, t]);

  async function handleSave() {
    setError(null);
    setSaving(true);
    try {
      await authService.submitOnboardingStep({
        step: "notification_preferences",
        email: prefs.email,
        push: prefs.push,
        sms: prefs.sms,
      });
      onDismiss("save");
    } catch (e) {
      setError(normalizeHttpError(e, t("saveError")).message);
    } finally {
      setSaving(false);
    }
  }

  function handleBackdropClose() {
    if (mode === "account_flow") {
      onDismiss("skip");
    } else {
      onDismiss("close");
    }
  }

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={handleBackdropClose}
    >
      <Pressable style={styles.backdrop} onPress={handleBackdropClose}>
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

          <Text style={[styles.title, { color: c.text }]}>{t("title")}</Text>
          <Text style={[styles.subtitle, { color: c.textSecondary }]}>
            {t("subtitle")}
          </Text>

          {loading ? (
            <View style={styles.loading}>
              <ActivityIndicator color={AppPalette.primary} />
            </View>
          ) : (
            <View style={styles.toggles}>
              <PrefRow
                label={t("channelEmail")}
                value={prefs.email}
                onValueChange={(email) => setPrefs((p) => ({ ...p, email }))}
                scheme={scheme}
              />
              <PrefRow
                label={t("channelPush")}
                value={prefs.push}
                onValueChange={(push) => setPrefs((p) => ({ ...p, push }))}
                scheme={scheme}
              />
              <PrefRow
                label={t("channelSms")}
                value={prefs.sms}
                onValueChange={(sms) => setPrefs((p) => ({ ...p, sms }))}
                scheme={scheme}
              />
            </View>
          )}

          {error ? <Text style={styles.error}>{error}</Text> : null}

          <View style={styles.actions}>
            <AppButton
              title={t("save")}
              onPress={handleSave}
              loading={saving}
              disabled={loading}
              fullWidth
            />
            {mode === "account_flow" ? (
              <AppButton
                title={t("skip")}
                variant="ghost"
                onPress={() => onDismiss("skip")}
                disabled={saving}
                fullWidth
              />
            ) : null}
          </View>

          <Text style={[styles.hint, { color: c.textMuted }]}>{t("hint")}</Text>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

function PrefRow({
  label,
  value,
  onValueChange,
  scheme,
}: {
  label: string;
  value: boolean;
  onValueChange: (v: boolean) => void;
  scheme: "light" | "dark";
}) {
  const c = getSchemeColors(scheme);
  return (
    <View style={[styles.row, { borderBottomColor: c.border }]}>
      <Text style={[styles.rowLabel, { color: c.text }]}>{label}</Text>
      <Switch
        value={value}
        onValueChange={onValueChange}
        trackColor={{ false: c.border, true: AppPalette.primaryMuted }}
        thumbColor={value ? AppPalette.primary : c.textMuted}
      />
    </View>
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
    marginBottom: 20,
  },
  loading: {
    paddingVertical: 32,
    alignItems: "center",
  },
  toggles: {
    marginBottom: 8,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  rowLabel: {
    fontSize: 16,
    flex: 1,
    paddingRight: 12,
  },
  error: {
    color: AppPalette.error,
    fontSize: 14,
    marginBottom: 8,
  },
  actions: {
    gap: 8,
    marginTop: 16,
  },
  hint: {
    fontSize: 13,
    textAlign: "center",
    marginTop: 16,
  },
});
