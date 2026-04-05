import type { ReactNode } from "react";
import { StyleSheet, Text, View } from "react-native";

/**
 * Cabeçalho reutilizável para ecrãs dentro das tabs (título + ação à direita opcional).
 */
export type AppTabScreenHeaderProps = {
  title: string;
  borderColor: string;
  titleColor: string;
  trailing?: ReactNode;
};

export function AppTabScreenHeader({
  title,
  borderColor,
  titleColor,
  trailing,
}: AppTabScreenHeaderProps) {
  return (
    <View style={[styles.header, { borderBottomColor: borderColor }]}>
      <View style={styles.topRow}>
        <View style={styles.titles}>
          <Text style={[styles.title, { color: titleColor }]}>{title}</Text>
        </View>
        {trailing ? <View style={styles.trailing}>{trailing}</View> : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: 20,
    paddingTop: 6,
    paddingBottom: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  topRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },
  titles: {
    flex: 1,
    minWidth: 0,
  },
  title: { fontSize: 22, fontWeight: "700", letterSpacing: -0.3 },
  trailing: {
    alignSelf: "center",
  },
});
