import { Alert, ScrollView, StyleSheet, View } from "react-native";
import { useTranslation } from "react-i18next";

import { StackContentPageTitle } from "@/components/navigation/StackContentPageTitle";
import { AppTextField } from "@/components/ui/Input/Input";
import { AppButton } from "@/components/ui/Button";
import { Layout } from "@/constants/layout";
import { getSchemeColors } from "@/constants/palette";
import { useAuth } from "@/contexts/auth-context";
import { useColorScheme } from "@/hooks/use-color-scheme";

export function SettingsAccountEmailScreen() {
  const { t } = useTranslation("settings");
  const { user } = useAuth();
  const scheme = useColorScheme() ?? "light";
  const c = getSchemeColors(scheme);

  return (
    <View style={[styles.root, { backgroundColor: c.background }]}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <StackContentPageTitle color={c.text}>{t("accountEmailTitle")}</StackContentPageTitle>
        <AppTextField
          label={t("emailLabel")}
          value={user?.email ?? "—"}
          editable={false}
          accessibilityLabel={t("emailLabel")}
        />
        <View style={styles.actions}>
          <AppButton
            title={t("emailEditAction")}
            onPress={() => Alert.alert(t("emailEditTitle"), t("emailEditMessage"))}
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
  actions: {
    marginTop: 16,
  },
});

