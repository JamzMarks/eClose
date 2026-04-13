import { Alert, ScrollView, StyleSheet, View } from "react-native";
import { useTranslation } from "react-i18next";

import { StackContentPageTitle } from "@/components/navigation/StackContentPageTitle";
import { AppButton } from "@/components/ui/Button";
import { Layout } from "@/constants/layout";
import { getSchemeColors } from "@/constants/palette";
import { useColorScheme } from "@/hooks/use-color-scheme";

export function SettingsAccountPasswordScreen() {
  const { t } = useTranslation("settings");
  const scheme = useColorScheme() ?? "light";
  const c = getSchemeColors(scheme);

  return (
    <View style={[styles.root, { backgroundColor: c.background }]}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <StackContentPageTitle color={c.text}>{t("accountPasswordTitle")}</StackContentPageTitle>
        <AppButton
          title={t("changePasswordAction")}
          onPress={() => Alert.alert(t("changePasswordTitle"), t("changePasswordMessage"))}
          fullWidth
        />
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
});

