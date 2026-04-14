import type { StyleProp, ViewStyle } from "react-native";
import { StyleSheet } from "react-native";
import type { Edge } from "react-native-safe-area-context";
import { SafeAreaView } from "react-native-safe-area-context";

type ScreenProps = {
  children: React.ReactNode;
  /** Fundo e outros estilos do contentor (ex.: alinhar com `getSchemeColors`). */
  contentStyle?: StyleProp<ViewStyle>;
  /**
   * Por defeito aplica insets no topo e fundo. Em ecrãs com header nativo da stack,
   * usar `edges={["bottom"]}` para não duplicar o espaço do topo (safe area + header).
   */
  edges?: readonly Edge[];
};

export function Screen({
  children,
  contentStyle,
  edges = ["top", "bottom"],
}: ScreenProps) {
  return (
    <SafeAreaView style={[styles.container, contentStyle]} edges={edges}>
      {children}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});