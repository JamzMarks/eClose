import {
  StyleSheet,
  Text,
  TextInput,
  View,
  type TextInputProps,
} from "react-native";

import { AppPalette, getSchemeColors } from "@/constants/palette";
import { useColorScheme } from "@/hooks/use-color-scheme";

export type AppTextFieldProps = TextInputProps & {
  label: string;
  error?: string;
};

export function AppTextField({
  label,
  error,
  style,
  editable = true,
  ...rest
}: AppTextFieldProps) {
  const scheme = useColorScheme() ?? "light";
  const c = getSchemeColors(scheme);
  const hasError = Boolean(error?.trim());

  return (
    <View style={styles.wrapper}>
      <Text style={[styles.label, { color: c.textSecondary }]}>{label}</Text>
      <TextInput
        placeholderTextColor={c.textMuted}
        style={[
          styles.input,
          {
            color: c.text,
            backgroundColor: c.inputBackground,
            borderColor: hasError ? AppPalette.error : c.border,
          },
          !editable && styles.inputDisabled,
          style,
        ]}
        editable={editable}
        {...rest}
      />
      {hasError ? (
        <Text style={styles.errorText}>{error}</Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    gap: 6,
  },
  label: {
    fontSize: 14,
    fontWeight: "500",
  },
  input: {
    minHeight: 48,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: StyleSheet.hairlineWidth * 2,
    fontSize: 16,
  },
  inputDisabled: {
    opacity: 0.6,
  },
  errorText: {
    fontSize: 13,
    color: AppPalette.error,
  },
});
