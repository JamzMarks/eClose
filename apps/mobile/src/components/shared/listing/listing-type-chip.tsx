import { StyleSheet, Text, View } from "react-native";

import { Radius } from "@/constants/radius";

export type ListingTypeChipProps = {
  label: string;
  textColor: string;
  backgroundColor: string;
};

export function ListingTypeChip({ label, textColor, backgroundColor }: ListingTypeChipProps) {
  return (
    <View style={[styles.chip, { backgroundColor }]}>
      <Text style={[styles.text, { color: textColor }]} numberOfLines={1}>
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  chip: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: Radius.sm,
    alignSelf: "flex-start",
  },
  text: {
    fontSize: 12,
    fontWeight: "600",
  },
});
