import { StyleSheet, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export type ProfileMediaTabStripProps = {
  textColor: string;
  mutedColor: string;
  borderColor: string;
};

export function ProfileMediaTabStrip({
  textColor,
  mutedColor,
  borderColor,
}: ProfileMediaTabStripProps) {
  return (
    <View style={[styles.tabBar, { borderTopColor: borderColor }]}>
      <View style={styles.tabActive}>
        <Ionicons name="grid-outline" size={20} color={textColor} />
        <View style={[styles.underline, { backgroundColor: textColor }]} />
      </View>
      <View style={styles.tabInactive}>
        <Ionicons name="play-outline" size={20} color={mutedColor} />
      </View>
      <View style={styles.tabInactive}>
        <Ionicons name="person-outline" size={20} color={mutedColor} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    marginTop: 20,
    marginHorizontal: -16,
    paddingTop: 10,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  tabActive: {
    flex: 1,
    alignItems: "center",
    paddingBottom: 8,
    gap: 8,
  },
  tabInactive: {
    flex: 1,
    alignItems: "center",
    paddingBottom: 8,
    opacity: 0.45,
  },
  underline: {
    width: 28,
    height: 2,
    borderRadius: 1,
  },
});
