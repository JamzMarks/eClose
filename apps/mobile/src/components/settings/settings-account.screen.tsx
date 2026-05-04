import { useCallback, useEffect, useMemo, useState } from "react";
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useLocalSearchParams, useNavigation, useRouter } from "expo-router";
import { useTranslation } from "react-i18next";

import {
  CollapsingStackLargeTitle,
  collapsingScrollProps,
} from "@/components/navigation/collapsing-stack-header-title";
import { useStandardCollapsingTitle } from "@/components/navigation/use-standard-collapsing-title";
import { SettingsAccountExpandableRow } from "@/components/settings/components/SettingsAccountExpandableRow";
import { SettingsSectionHeader } from "@/components/settings/components/SettingsSectionHeader";
import { SettingsScreenGroup } from "@/components/settings/components/SettingsScreenGroup";
import { AppButton } from "@/components/ui/Button";
import { AppTextField } from "@/components/ui/Input/Input";
import { AppIcon } from "@/components/ui/icon/icon.types";
import { getSchemeColors } from "@/constants/palette";
import { useAuth } from "@/contexts/auth-context";
import { AuthService } from "@/services/auth/auth.service";
import { useColorScheme } from "@/hooks/use-color-scheme";

type ExpandSection = "name" | "email" | "password";

function parseExpandParam(raw: string | string[] | undefined): ExpandSection | null {
  const v = Array.isArray(raw) ? raw[0] : raw;
  if (v === "name" || v === "email" || v === "password") return v;
  return null;
}

export function SettingsAccountScreen() {
  const { t } = useTranslation("settings");
  const { t: tCommon } = useTranslation("common");
  const navigation = useNavigation();
  const router = useRouter();
  const params = useLocalSearchParams<{ expand?: string | string[] }>();
  const { user, refreshUser } = useAuth();
  const scheme = useColorScheme() ?? "light";
  const c = getSchemeColors(scheme);
  const isDark = scheme === "dark";

  const [expanded, setExpanded] = useState<ExpandSection | null>(null);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [savingName, setSavingName] = useState(false);

  const collapse = useStandardCollapsingTitle({
    navigation,
    title: t("sectionAccount"),
    headerTitleColor: c.text,
    headerBackgroundColor: c.surface,
    tintColor: c.text,
    scheme: isDark ? "dark" : "light",
    backAccessibilityLabel: tCommon("backA11y"),
  });

  useEffect(() => {
    const fromRoute = parseExpandParam(params.expand);
    if (fromRoute) {
      setExpanded(fromRoute);
    }
  }, [params.expand]);

  const stripExpandFromUrl = useCallback(() => {
    if (parseExpandParam(params.expand) != null) {
      router.replace("/settings/account");
    }
  }, [params.expand, router]);

  useEffect(() => {
    if (expanded === "name" && user) {
      setFirstName(user.firstName ?? "");
      setLastName(user.lastName ?? "");
    }
  }, [expanded, user]);

  const emailValue = useMemo(() => user?.email ?? "—", [user?.email]);
  const nameValue = useMemo(() => {
    const first = user?.firstName?.trim() ?? "";
    const last = user?.lastName?.trim() ?? "";
    const full = `${first} ${last}`.trim();
    return full || "—";
  }, [user?.firstName, user?.lastName]);

  const initialFirstName = user?.firstName ?? "";
  const initialLastName = user?.lastName ?? "";

  const canSaveName = useMemo(() => {
    if (savingName) return false;
    const a = `${initialFirstName}`.trim();
    const b = `${initialLastName}`.trim();
    const x = firstName.trim();
    const y = lastName.trim();
    return x.length > 0 && y.length > 0 && (x !== a || y !== b);
  }, [savingName, initialFirstName, initialLastName, firstName, lastName]);

  const toggle = useCallback(
    (section: ExpandSection) => {
      setExpanded((cur) => {
        if (cur === section) {
          queueMicrotask(stripExpandFromUrl);
          return null;
        }
        return section;
      });
    },
    [stripExpandFromUrl],
  );

  async function handleSaveName() {
    const nextFirst = firstName.trim();
    const nextLast = lastName.trim();
    setSavingName(true);
    try {
      await new AuthService().submitOnboardingStep({
        step: "names",
        firstName: nextFirst,
        lastName: nextLast,
      });
      await refreshUser();
      setExpanded(null);
      stripExpandFromUrl();
      Alert.alert(t("accountSavedTitle"), t("accountSavedMessage"));
    } catch {
      Alert.alert(t("accountSaveErrorTitle"), t("accountSaveErrorMessage"));
    } finally {
      setSavingName(false);
    }
  }

  return (
    <View style={[styles.root, { backgroundColor: c.surface }]}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        {...collapsingScrollProps(collapse)}>
        <CollapsingStackLargeTitle color={c.text} collapse={collapse}>
          {t("sectionAccount")}
        </CollapsingStackLargeTitle>

        <SettingsSectionHeader title={t("accountProfileHeader")} color={c.textMuted} insetHorizontal={0} />
        <SettingsScreenGroup borderColor={c.border} showBottomRule={false} paddingTop={0}>
          <SettingsAccountExpandableRow
            icon={AppIcon.Profile}
            title={t("accountNameTitle")}
            value={nameValue}
            expanded={expanded === "name"}
            onToggle={() => toggle("name")}
            textColor={c.text}
            mutedColor={c.textMuted}>
            <View style={styles.panelBar}>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel={t("cancel")}
                onPress={() => {
                  setExpanded(null);
                  stripExpandFromUrl();
                }}
                hitSlop={8}>
                <Text style={[styles.cancelText, { color: c.text }]}>{t("cancel")}</Text>
              </Pressable>
            </View>
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
            <AppButton
              title={t("saveAccountAction")}
              onPress={() => void handleSaveName()}
              loading={savingName}
              disabled={!canSaveName}
              fullWidth
            />
          </SettingsAccountExpandableRow>

          <SettingsAccountExpandableRow
            icon={AppIcon.FileText}
            title={t("accountEmailTitle")}
            value={emailValue}
            expanded={expanded === "email"}
            onToggle={() => toggle("email")}
            textColor={c.text}
            mutedColor={c.textMuted}>
            <AppTextField
              label={t("emailLabel")}
              value={user?.email ?? "—"}
              editable={false}
              accessibilityLabel={t("emailLabel")}
            />
            <AppButton
              title={t("emailEditAction")}
              onPress={() => Alert.alert(t("emailEditTitle"), t("emailEditMessage"))}
              fullWidth
            />
          </SettingsAccountExpandableRow>

          <SettingsAccountExpandableRow
            icon={AppIcon.Shield}
            title={t("accountPasswordTitle")}
            value={t("accountPasswordSubtitle")}
            expanded={expanded === "password"}
            onToggle={() => toggle("password")}
            textColor={c.text}
            mutedColor={c.textMuted}>
            <AppButton
              title={t("changePasswordAction")}
              onPress={() => Alert.alert(t("changePasswordTitle"), t("changePasswordMessage"))}
              fullWidth
            />
          </SettingsAccountExpandableRow>
        </SettingsScreenGroup>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  content: {
    /** Igual à lista principal em `SettingsModalScreen`. */
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  panelBar: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: -4,
    marginBottom: 4,
  },
  cancelText: {
    fontSize: 16,
    fontWeight: "600",
    textDecorationLine: "underline",
  },
});
