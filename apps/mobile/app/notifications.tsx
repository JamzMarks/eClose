import { useLayoutEffect } from "react";
import { StyleSheet, Text, View } from "react-native";
import { useNavigation } from "expo-router";
import { useTranslation } from "react-i18next";

import { Screen } from "@/components/layout/screen";
import { getSchemeColors } from "@/constants/palette";
import { useColorScheme } from "@/hooks/use-color-scheme";

export default function NotificationsScreen() {
  const { t } = useTranslation("tabs");
  const navigation = useNavigation();
  const scheme = useColorScheme() ?? "light";
  const c = getSchemeColors(scheme);

  useLayoutEffect(() => {
    navigation.setOptions({ title: t("notificationsTitle") });
  }, [navigation, t]);

  return (
    <Screen>
      <View style={styles.body}>
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
    paddingHorizontal: 24,
    paddingTop: 24,
  },
  placeholder: {
    fontSize: 15,
    lineHeight: 22,
  },
});
