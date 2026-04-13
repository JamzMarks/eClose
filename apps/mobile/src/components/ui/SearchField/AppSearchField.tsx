import {
  Platform,
  StyleSheet,
  TextInput,
  View,
  type StyleProp,
  type TextInputProps,
  type TextStyle,
  type ViewStyle,
} from "react-native";

import { Icon } from "@/components/ui/icon/icon";
import { AppIcon } from "@/components/ui/icon/icon.types";
import { getSchemeColors } from "@/constants/palette";
import { Radius } from "@/constants/radius";
import { useColorScheme } from "@/hooks/use-color-scheme";

export type AppSearchFieldProps = Omit<TextInputProps, "style" | "placeholderTextColor"> & {
  /** Estilo do contentor (barra completa). */
  containerStyle?: StyleProp<ViewStyle>;
  /** Estilo do `TextInput`. */
  inputStyle?: StyleProp<TextStyle>;
};

/**
 * Campo de pesquisa padronizado — ícone à esquerda, fundo e borda do tema.
 */
export function AppSearchField({
  containerStyle,
  inputStyle,
  editable = true,
  ...rest
}: AppSearchFieldProps) {
  const scheme = useColorScheme() ?? "light";
  const c = getSchemeColors(scheme);

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: c.inputBackground,
          borderColor: c.border,
        },
        !editable && styles.containerDisabled,
        containerStyle,
      ]}>
      <Icon name={AppIcon.Search} size="sm" color={c.icon} />
      <TextInput
        placeholderTextColor={c.textMuted}
        style={[styles.input, { color: c.text }, !editable && styles.inputDisabled, inputStyle]}
        editable={editable}
        returnKeyType="search"
        clearButtonMode="while-editing"
        {...rest}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    minHeight: 44,
    paddingLeft: 12,
    paddingRight: 10,
    borderRadius: Radius.medium,
    borderWidth: StyleSheet.hairlineWidth * 2,
    gap: 8,
  },
  containerDisabled: {
    opacity: 0.65,
  },
  input: {
    flex: 1,
    minWidth: 0,
    paddingVertical: Platform.select({ ios: 10, android: 8, default: 8 }),
    fontSize: 16,
  },
  inputDisabled: {
    opacity: 0.85,
  },
});
