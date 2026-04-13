import { StyleSheet, Text, View } from "react-native";

import { Layout } from "@/constants/layout";

export type TabScreenHeaderProps = {
  title: string;
  subtitle?: string;
  borderColor: string;
  titleColor: string;
  subtitleColor: string;
};

export function TabScreenHeader({
  title,
  subtitle,
  borderColor,
  titleColor,
  subtitleColor,
}: TabScreenHeaderProps) {
  return (
    <View style={styles.wrap}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: titleColor }]}>{title}</Text>
        {subtitle ? (
          <Text style={[styles.subtitle, { color: subtitleColor }]}>{subtitle}</Text>
        ) : null}
      </View>
      <View
        style={[styles.divider, { backgroundColor: borderColor }]}
        pointerEvents="none"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    width: "100%",
  },
  header: {
    paddingHorizontal: Layout.tab.header.horizontalPadding,
    paddingTop: 8,
    paddingBottom: 16,
  },
  divider: {
    height: 1,
    width: "100%",
    opacity: Layout.tab.header.dividerOpacity,
  },
  title: { fontSize: 28, fontWeight: "700" },
  subtitle: { fontSize: 15, marginTop: 4 },
});
