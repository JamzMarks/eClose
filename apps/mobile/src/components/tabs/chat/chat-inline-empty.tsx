import { StyleSheet, Text, View, type StyleProp, type ViewStyle } from "react-native";

import { Paddings, Radii } from "@/constants/layout";

export type ChatInlineEmptyProps = {
  message: string;
  textColor: string;
  /** Fundo opcional (sem borda). */
  backgroundColor?: string;
  style?: StyleProp<ViewStyle>;
};

/** Estado vazio partilhado: Chat, nova mensagem, novo grupo — mesmo tipo e sem contorno. */
export function ChatInlineEmpty({ message, textColor, backgroundColor, style }: ChatInlineEmptyProps) {
  return (
    <View style={[styles.wrap, backgroundColor != null && { backgroundColor }, style]}>
      <Text style={[styles.text, { color: textColor }]}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    paddingVertical: Paddings.xl,
    paddingHorizontal: Paddings.lg,
    borderRadius: Radii.md,
  },
  text: {
    fontSize: 15,
    lineHeight: 22,
    textAlign: "center",
  },
});
