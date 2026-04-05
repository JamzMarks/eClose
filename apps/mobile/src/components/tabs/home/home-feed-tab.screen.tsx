import { StyleSheet, Text, View } from "react-native";
import { useTranslation } from "react-i18next";

import { Screen } from "@/components/layout/screen";
import { AppTabScreenHeader } from "@/components/shared/tab-screen/AppTabScreenHeader";
import { getSchemeColors } from "@/constants/palette";
import { useColorScheme } from "@/hooks/use-color-scheme";

/**
 * Início — feed leve (placeholder até haver conteúdo social/curado sem posts completos).
 */
export function HomeFeedTabScreen() {
  const { t } = useTranslation("discover");
  const scheme = useColorScheme() ?? "light";
  const c = getSchemeColors(scheme);

  return (
    <Screen>
      <AppTabScreenHeader title={t("homeFeedTitle")} borderColor={c.border} titleColor={c.text} />
      <View style={[styles.body, { backgroundColor: c.background }]}>
        <Text style={[styles.hint, { color: c.textSecondary }]}>{t("homeFeedPlaceholder")}</Text>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  body: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 24,
  },
  hint: {
    fontSize: 16,
    lineHeight: 24,
  },
});
