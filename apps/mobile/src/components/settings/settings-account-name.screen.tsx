import { useMemo, useState } from "react";
import { Alert, ScrollView, StyleSheet, View } from "react-native";
import { useRouter } from "expo-router";
import { useTranslation } from "react-i18next";

import { StackContentPageTitle } from "@/components/navigation/StackContentPageTitle";
import { AppTextField } from "@/components/ui/Input/Input";
import { AppButton } from "@/components/ui/Button";
import { Layout } from "@/constants/layout";
import { getSchemeColors } from "@/constants/palette";
import { useAuth } from "@/contexts/auth-context";
import { AuthService } from "@/services/auth/auth.service";
import { useColorScheme } from "@/hooks/use-color-scheme";

export function SettingsAccountNameScreen() {
  const { t } = useTranslation("settings");
  const router = useRouter();
  const { user, refreshUser } = useAuth();
  const scheme = useColorScheme() ?? "light";
  const c = getSchemeColors(scheme);

  const initialFirstName = user?.firstName ?? "";
  const initialLastName = user?.lastName ?? "";
  const [firstName, setFirstName] = useState(initialFirstName);
  const [lastName, setLastName] = useState(initialLastName);
  const [saving, setSaving] = useState(false);

  const canSave = useMemo(() => {
    if (saving) return false;
    const a = `${initialFirstName}`.trim();
    const b = `${initialLastName}`.trim();
    const x = firstName.trim();
    const y = lastName.trim();
    return x.length > 0 && y.length > 0 && (x !== a || y !== b);
  }, [saving, initialFirstName, initialLastName, firstName, lastName]);

  async function handleSave() {
    const nextFirst = firstName.trim();
    const nextLast = lastName.trim();
    setSaving(true);
    try {
      await new AuthService().submitOnboardingStep({
        step: "names",
        firstName: nextFirst,
        lastName: nextLast,
      });
      await refreshUser();
      Alert.alert(t("accountSavedTitle"), t("accountSavedMessage"));
      router.back();
    } catch {
      Alert.alert(t("accountSaveErrorTitle"), t("accountSaveErrorMessage"));
    } finally {
      setSaving(false);
    }
  }

  return (
    <View style={[styles.root, { backgroundColor: c.background }]}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <StackContentPageTitle color={c.text}>{t("accountNameTitle")}</StackContentPageTitle>
        <View style={styles.block}>
          <AppTextField
            label={t("firstNameLabel")}
            value={firstName}
            onChangeText={setFirstName}
            autoCapitalize="words"
            accessibilityLabel={t("firstNameLabel")}
          />
          <AppTextField
            label={t("lastNameLabel")}
            value={lastName}
            onChangeText={setLastName}
            autoCapitalize="words"
            accessibilityLabel={t("lastNameLabel")}
          />
        </View>
        <View style={styles.actions}>
          <AppButton
            title={t("saveAccountAction")}
            onPress={handleSave}
            loading={saving}
            disabled={!canSave}
            fullWidth
          />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  content: {
    paddingHorizontal: Layout.tab.content.horizontalPadding,
    paddingBottom: 24,
  },
  block: {
    gap: 12,
  },
  actions: {
    marginTop: 20,
  },
});

