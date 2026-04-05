import { Pressable, StyleSheet, Text, View } from "react-native";

import { Icon } from "@/components/ui/icon/icon";
import { AppIcon } from "@/components/ui/icon/icon.types";

export type DiscoverScreenHeaderProps = {
  title: string;
  subtitle?: string;
  borderColor: string;
  titleColor: string;
  subtitleColor: string;
  filterIconColor: string;
  filterAccessibilityLabel: string;
  onFilterPress: () => void;
};

export function DiscoverScreenHeader({
  title,
  subtitle,
  borderColor,
  titleColor,
  subtitleColor,
  filterIconColor,
  filterAccessibilityLabel,
  onFilterPress,
}: DiscoverScreenHeaderProps) {
  return (
    <View style={[styles.header, { borderBottomColor: borderColor }]}>
      <View style={styles.topRow}>
        <View style={styles.titles}>
          <Text style={[styles.title, { color: titleColor }]}>{title}</Text>
          {subtitle ? (
            <Text style={[styles.subtitle, { color: subtitleColor }]}>{subtitle}</Text>
          ) : null}
        </View>
        <Pressable
          onPress={onFilterPress}
          hitSlop={12}
          accessibilityRole="button"
          accessibilityLabel={filterAccessibilityLabel}>
          <Icon name={AppIcon.Filter} size="lg" color={filterIconColor} />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  topRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: 12,
  },
  titles: {
    flex: 1,
    minWidth: 0,
  },
  title: { fontSize: 28, fontWeight: "700" },
  subtitle: { fontSize: 15, marginTop: 4 },
});
