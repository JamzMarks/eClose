import { Dimensions, StyleSheet, Text, View } from "react-native";

const GRID_GAP = 2;

export type ProfilePostsPlaceholderGridProps = {
  surfaceColor: string;
  borderColor: string;
  emptyHint: string;
  hintColor: string;
};

export function ProfilePostsPlaceholderGrid({
  surfaceColor,
  borderColor,
  emptyHint,
  hintColor,
}: ProfilePostsPlaceholderGridProps) {
  const gridWidth = Dimensions.get("window").width;
  const cell = (gridWidth - GRID_GAP * 2) / 3;

  return (
    <>
      <View style={styles.grid}>
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <View
            key={i}
            style={[
              styles.cell,
              {
                width: cell,
                height: cell,
                backgroundColor: surfaceColor,
                borderColor,
              },
            ]}
          />
        ))}
      </View>
      <Text style={[styles.hint, { color: hintColor }]}>{emptyHint}</Text>
    </>
  );
}

const styles = StyleSheet.create({
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: GRID_GAP,
    marginTop: 2,
    marginHorizontal: -16,
  },
  cell: {
    borderWidth: StyleSheet.hairlineWidth,
  },
  hint: {
    textAlign: "center",
    fontSize: 13,
    marginTop: 20,
    paddingHorizontal: 24,
  },
});
