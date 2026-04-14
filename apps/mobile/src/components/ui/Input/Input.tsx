import type { ReactNode } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  type TextInputProps,
} from "react-native";

import { Icon } from "@/components/ui/icon/icon";
import { AppIcon } from "@/components/ui/icon/icon.types";
import { Paddings, Radii } from "@/constants/layout";
import { AppPalette, getSchemeColors } from "@/constants/palette";
import { useColorScheme } from "@/hooks/use-color-scheme";

export type AppTextFieldProps = TextInputProps & {
  label: string;
  error?: string;
  /**
   * "above" shows a visible label (default).
   * "placeholder" uses the label string as the input placeholder; set accessibilityLabel
   * (defaults to label) so screen readers still announce the field when the placeholder is empty.
   */
  labelLayout?: "above" | "placeholder";
  /** Ícone à esquerda dentro do campo. */
  startIcon?: AppIcon;
  /** Conteúdo à esquerda dentro do campo (tem precedência sobre `startIcon`). */
  startAccessory?: ReactNode;
};

export function AppTextField({
  label,
  error,
  labelLayout = "above",
  startIcon,
  startAccessory,
  style,
  editable = true,
  placeholder,
  accessibilityLabel,
  ...rest
}: AppTextFieldProps) {
  const scheme = useColorScheme() ?? "light";
  const c = getSchemeColors(scheme);
  const hasError = Boolean(error?.trim());
  const baseA11yLabel = accessibilityLabel ?? label;
  const resolvedA11yLabel =
    hasError && error ? `${baseA11yLabel}, ${error}` : baseA11yLabel;
  const resolvedPlaceholder =
    labelLayout === "placeholder" ? (placeholder ?? label) : placeholder;

  const borderColor = hasError ? AppPalette.error : c.border;
  const start =
    startAccessory ??
    (startIcon != null ? (
      <View style={styles.startIconWrap} pointerEvents="none" importantForAccessibility="no">
        <Icon name={startIcon} size="sm" color={c.icon} />
      </View>
    ) : null);

  return (
    <View style={styles.wrapper}>
      {labelLayout === "above" ? (
        <Text
          style={[styles.label, { color: c.textSecondary }]}
          accessible={false}
          importantForAccessibility="no">
          {label}
        </Text>
      ) : null}
      {start != null ? (
        <View
          style={[
            styles.inputShell,
            {
              backgroundColor: c.inputBackground,
              borderColor,
            },
            !editable && styles.inputShellDisabled,
          ]}>
          {start}
          <TextInput
            placeholderTextColor={c.textMuted}
            underlineColorAndroid="transparent"
            style={[
              styles.inputWithStart,
              {
                color: c.text,
              },
              style,
            ]}
            editable={editable}
            {...rest}
            placeholder={resolvedPlaceholder}
            accessibilityLabel={resolvedA11yLabel}
          />
        </View>
      ) : (
        <TextInput
          placeholderTextColor={c.textMuted}
          style={[
            styles.input,
            {
              color: c.text,
              backgroundColor: c.inputBackground,
              borderColor,
            },
            !editable && styles.inputDisabled,
            style,
          ]}
          editable={editable}
          {...rest}
          placeholder={resolvedPlaceholder}
          accessibilityLabel={resolvedA11yLabel}
        />
      )}
      {hasError ? (
        <Text style={styles.errorText} accessibilityLiveRegion="polite">
          {error}
        </Text>
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
  inputShell: {
    minHeight: 48,
    flexDirection: "row",
    alignItems: "center",
    borderRadius: Radii.md,
    borderWidth: StyleSheet.hairlineWidth * 2,
    paddingRight: Paddings.md,
  },
  inputShellDisabled: {
    opacity: 0.6,
  },
  startIconWrap: {
    paddingLeft: Paddings.md,
    paddingRight: Paddings.md,
    justifyContent: "center",
    alignItems: "center",
  },
  inputWithStart: {
    flex: 1,
    minHeight: 48,
    paddingVertical: 10,
    paddingRight: Paddings.sm,
    borderWidth: 0,
    fontSize: 16,
    backgroundColor: "transparent",
  },
  input: {
    minHeight: 48,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: Radii.md,
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
