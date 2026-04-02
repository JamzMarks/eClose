import { ActivityIndicator, StyleSheet, Text, View } from "react-native";

import { AppPalette } from "@/constants/palette";

export type TabScreenCenterLoadingProps = {
  message: string;
  subtitleColor: string;
};

export function TabScreenCenterLoading({
  message,
  subtitleColor,
}: TabScreenCenterLoadingProps) {
  return (
    <View style={styles.center}>
      <ActivityIndicator color={AppPalette.primary} size="large" />
      <Text style={[styles.text, { color: subtitleColor }]}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  text: { marginTop: 12 },
});
