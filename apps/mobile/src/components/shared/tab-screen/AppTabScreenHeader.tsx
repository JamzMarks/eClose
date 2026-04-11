import type { ReactNode } from "react";
import { Platform, StyleSheet, Text, View } from "react-native";

/**
 * Cabeçalho para ecrãs nas tabs.
 * Com `leading` (ex.: Início): ação à esquerda, título centrado, `trailing` à direita.
 * Sem `leading`: título à esquerda e `trailing` opcional (comportamento clássico).
 */
export type AppTabScreenHeaderProps = {
  title: string;
  borderColor: string;
  titleColor: string;
  leading?: ReactNode;
  trailing?: ReactNode;
};

export function AppTabScreenHeader({
  title,
  borderColor,
  titleColor,
  leading,
  trailing,
}: AppTabScreenHeaderProps) {
  if (leading) {
    return (
      <View style={[styles.header, { borderBottomColor: borderColor }]}>
        <View style={styles.topRowBalanced}>
          <View style={styles.edgeSlotStart}>{leading}</View>
          <View style={styles.titleColumn} pointerEvents="box-none">
            <Text
              style={[styles.title, styles.titleCentered, { color: titleColor }]}
              numberOfLines={1}
              ellipsizeMode="tail"
              {...(Platform.OS === "android" ? { includeFontPadding: false } : {})}>
              {title}
            </Text>
          </View>
          <View style={styles.edgeSlotEnd}>{trailing}</View>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.header, { borderBottomColor: borderColor }]}>
      <View style={styles.topRowSimple}>
        <View style={styles.simpleTitleColumn}>
          <Text
            style={[styles.title, styles.titleStart, { color: titleColor }]}
            numberOfLines={1}
            ellipsizeMode="tail"
            {...(Platform.OS === "android" ? { includeFontPadding: false } : {})}>
            {title}
          </Text>
        </View>
        {trailing ? <View style={styles.simpleTrailingSlot}>{trailing}</View> : null}
      </View>
    </View>
  );
}

const EDGE_SLOT_W = 44;

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  topRowBalanced: {
    flexDirection: "row",
    alignItems: "center",
    minHeight: 40,
  },
  edgeSlotStart: {
    width: EDGE_SLOT_W,
    minHeight: 40,
    justifyContent: "center",
    alignItems: "flex-start",
  },
  edgeSlotEnd: {
    width: EDGE_SLOT_W,
    minHeight: 40,
    justifyContent: "center",
    alignItems: "flex-end",
  },
  titleColumn: {
    flex: 1,
    minWidth: 0,
    minHeight: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  topRowSimple: {
    flexDirection: "row",
    alignItems: "center",
    minHeight: 40,
  },
  simpleTitleColumn: {
    flex: 1,
    minWidth: 0,
    minHeight: 40,
    justifyContent: "center",
  },
  simpleTrailingSlot: {
    minWidth: EDGE_SLOT_W,
    minHeight: 40,
    justifyContent: "center",
    alignItems: "flex-end",
    marginLeft: 8,
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    letterSpacing: -0.3,
    lineHeight: 26,
  },
  titleCentered: {
    textAlign: "center",
  },
  titleStart: {
    textAlign: "left",
  },
});
