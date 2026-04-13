import { useLayoutEffect } from "react";
import { StyleSheet, Text, View } from "react-native";
import { useNavigation } from "expo-router";
import { useTranslation } from "react-i18next";

import { Screen } from "@/components/layout/screen";
import {
  buildMinimalStackHeaderOptions,
  minimalStackBackCircleBackground,
} from "@/components/navigation/minimal-stack-header";
import { StackContentPageTitle } from "@/components/navigation/StackContentPageTitle";
import { getSchemeColors } from "@/constants/palette";
import { useColorScheme } from "@/hooks/use-color-scheme";

export default function NotificationsScreen() {
  const { t } = useTranslation("tabs");
  const { t: tCommon } = useTranslation("common");
  const navigation = useNavigation();
  const scheme = useColorScheme() ?? "light";
  const c = getSchemeColors(scheme);
  const isDark = scheme === "dark";

  useLayoutEffect(() => {
    navigation.setOptions({
      ...buildMinimalStackHeaderOptions({
        headerBackgroundColor: c.background,
        tintColor: c.text,
        circleBackgroundColor: minimalStackBackCircleBackground(isDark ? "dark" : "light"),
        backAccessibilityLabel: tCommon("backA11y"),
      }),
    });
  }, [navigation, c.background, c.text, isDark, tCommon]);

  return (
    <Screen>
      <View style={styles.body}>
        <StackContentPageTitle color={c.text}>{t("notificationsTitle")}</StackContentPageTitle>
        <Text style={[styles.placeholder, { color: c.textSecondary }]}>
          {t("notificationsPlaceholder")}
        </Text>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  body: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 8,
  },
  placeholder: {
    fontSize: 15,
    lineHeight: 22,
  },
});
