import { StyleSheet, Text, View } from "react-native";
import { useTranslation } from "react-i18next";

import { Screen } from "@/components/layout/screen";
import { AppTabScreenHeader } from "@/components/shared/tab-screen/AppTabScreenHeader";
import { TabScreenContent } from "@/components/shared/tab-screen/TabScreenContent";
import { getSchemeColors } from "@/constants/palette";
import { useColorScheme } from "@/hooks/use-color-scheme";

/** Tab Mapa — `react-native-maps` foi removido por instabilidade; mapa interactivo volta quando reinstalarmos a lib (ou alternativa). */
export function ExploreTabScreen() {
  const { t } = useTranslation("discover");
  const scheme = useColorScheme() ?? "light";
  const c = getSchemeColors(scheme);

  return (
    <Screen>
      <AppTabScreenHeader title={t("mapExploreTitle")} borderColor={c.border} titleColor={c.text} />
      <TabScreenContent edgeToEdge>
        <View style={[styles.mapHost, { backgroundColor: c.surface }]}>
          <View style={styles.mapPlaceholderInner}>
            <Text style={[styles.mockTitle, { color: c.text }]}>{t("mapTabPlaceholderTitle")}</Text>
            <Text style={[styles.mockBody, { color: c.textSecondary }]}>
              {t("mapTabPlaceholderBody")}
            </Text>
          </View>
        </View>
      </TabScreenContent>
    </Screen>
  );
}

const styles = StyleSheet.create({
  mapHost: {
    flex: 1,
  },
  mapPlaceholderInner: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  mockTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 8,
    textAlign: "center",
  },
  mockBody: {
    fontSize: 15,
    lineHeight: 22,
    textAlign: "center",
  },
});
