import { StyleSheet, Text, ScrollView } from "react-native";
import { useNavigation } from "expo-router";
import { useTranslation } from "react-i18next";

import { Screen } from "@/components/layout/screen";
import {
  CollapsingStackLargeTitle,
  collapsingScrollProps,
} from "@/components/navigation/collapsing-stack-header-title";
import { useStandardCollapsingTitle } from "@/components/navigation/use-standard-collapsing-title";
import { getSchemeColors } from "@/constants/palette";
import { useColorScheme } from "@/hooks/use-color-scheme";

export default function NotificationsScreen() {
  const { t } = useTranslation("tabs");
  const { t: tCommon } = useTranslation("common");
  const navigation = useNavigation();
  const scheme = useColorScheme() ?? "light";
  const c = getSchemeColors(scheme);
  const isDark = scheme === "dark";

  const collapse = useStandardCollapsingTitle({
    navigation,
    title: t("notificationsTitle"),
    headerTitleColor: c.text,
    headerBackgroundColor: c.background,
    tintColor: c.text,
    scheme: isDark ? "dark" : "light",
    backAccessibilityLabel: tCommon("backA11y"),
  });

  return (
    <Screen edges={["bottom"]}>
      <ScrollView
        contentContainerStyle={[styles.body, { backgroundColor: c.background }]}
        showsVerticalScrollIndicator={false}
        {...collapsingScrollProps(collapse)}
      >
        <CollapsingStackLargeTitle color={c.text} collapse={collapse}>
          {t("notificationsTitle")}
        </CollapsingStackLargeTitle>
        <Text style={[styles.placeholder, { color: c.textSecondary }]}>
          {t("notificationsPlaceholder")}
        </Text>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  body: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 0,
  },
  placeholder: {
    fontSize: 15,
    lineHeight: 22,
  },
});
