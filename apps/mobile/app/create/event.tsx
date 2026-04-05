import { StyleSheet, Text, View } from "react-native";
import { useTranslation } from "react-i18next";

import { getSchemeColors } from "@/constants/palette";
import { useColorScheme } from "@/hooks/use-color-scheme";

export default function CreateEventRoute() {
  const { t } = useTranslation("discover");
  const scheme = useColorScheme() ?? "light";
  const c = getSchemeColors(scheme);

  return (
    <View style={[styles.wrap, { backgroundColor: c.background }]}>
      <Text style={[styles.body, { color: c.textSecondary }]}>{t("createEventScreenPlaceholder")}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flex: 1,
    padding: 24,
  },
  body: {
    fontSize: 16,
    lineHeight: 24,
  },
});
