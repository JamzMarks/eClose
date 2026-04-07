import { StyleSheet, Text, View } from "react-native";

import { AppPalette } from "@/constants/palette";

export type ListingInlineErrorBannerProps = {
  message: string;
};

/** Faixa de erro por baixo do cabeçalho da lista (ex.: refresh falhou mas há dados em cache). */
export function ListingInlineErrorBanner({ message }: ListingInlineErrorBannerProps) {
  return (
    <View style={styles.wrap} accessibilityRole="alert">
      <Text style={styles.text}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { paddingBottom: 10, paddingHorizontal: 4 },
  text: { color: AppPalette.error, fontSize: 14, lineHeight: 20 },
});
