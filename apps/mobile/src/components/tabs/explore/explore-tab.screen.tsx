import { StyleSheet, Text, View } from "react-native";
import { useTranslation } from "react-i18next";

import { Screen } from "@/components/layout/screen";
import { AppTabScreenHeader } from "@/components/shared/tab-screen/AppTabScreenHeader";
import { TabScreenContent } from "@/components/shared/tab-screen/TabScreenContent";
import { Paddings } from "@/constants/layout";
import { getSchemeColors } from "@/constants/palette";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { useSuggestedExploreRegion } from "@/lib/maps";

import { ExploreMapView } from "./explore-map-view";

/** Tab Explorar — `react-native-maps` + `MapViewportProvider` para bounds à API. */
export function ExploreTabScreen() {
  const { t } = useTranslation("explore");
  const scheme = useColorScheme() ?? "light";
  const c = getSchemeColors(scheme);
  const initialRegion = useSuggestedExploreRegion();

  return (
    <Screen>
      <AppTabScreenHeader title={t("screenTitle")} borderColor={c.border} titleColor={c.text} />
      <TabScreenContent edgeToEdge>
        <View style={styles.column}>
          <Text style={[styles.screenSubtitle, { color: c.textSecondary }]}>
            {t("screenSubtitle")}
          </Text>
          <View style={[styles.mapHost, { backgroundColor: c.surface }]}>
            <ExploreMapView initialRegion={initialRegion} />
          </View>
        </View>
      </TabScreenContent>
    </Screen>
  );
}

const styles = StyleSheet.create({
  column: {
    flex: 1,
  },
  screenSubtitle: {
    fontSize: 15,
    lineHeight: 22,
    paddingHorizontal: Paddings.xl,
    paddingTop: Paddings.sm,
    paddingBottom: Paddings.md,
  },
  mapHost: {
    flex: 1,
    position: "relative",
  },
});
