import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  type PressableProps,
  type StyleProp,
  type TextStyle,
  type ViewStyle,
} from "react-native";

import { AppPalette, getSchemeColors } from "@/constants/palette";
import { Radius } from "@/constants/radius";
import { useColorScheme } from "@/hooks/use-color-scheme";

export type AppButtonVariant = "primary" | "secondary" | "outline" | "ghost";

export type AppButtonProps = Omit<PressableProps, "children"> & {
  title: string;
  variant?: AppButtonVariant;
  loading?: boolean;
  fullWidth?: boolean;
};

export function AppButton({
  title,
  variant = "primary",
  loading = false,
  fullWidth = false,
  disabled,
  style,
  ...rest
}: AppButtonProps) {
  const scheme = useColorScheme() ?? "light";
  const variantStyles = getVariantStyles(variant, scheme);
  const isDisabled = disabled || loading;

  return (
    <Pressable
      accessibilityRole="button"
      disabled={isDisabled}
      style={({ pressed }) => [
        styles.base,
        fullWidth && styles.fullWidth,
        variantStyles.container,
        pressed && !isDisabled && variantStyles.pressed,
        isDisabled && styles.disabled,
        style as StyleProp<ViewStyle>,
      ]}
      {...rest}
    >
      {loading ? (
        <ActivityIndicator color={variantStyles.spinnerColor} size="small" />
      ) : (
        <Text style={[styles.label, variantStyles.label]} numberOfLines={1}>
          {title}
        </Text>
      )}
    </Pressable>
  );
}

function getVariantStyles(variant: AppButtonVariant, scheme: "light" | "dark") {
  const c = getSchemeColors(scheme);

  const primary = {
    container: {
      backgroundColor: AppPalette.primary,
      borderWidth: 0,
    } as ViewStyle,
    pressed: { backgroundColor: AppPalette.primaryPressed } as ViewStyle,
    label: { color: AppPalette.white } as TextStyle,
    spinnerColor: AppPalette.white,
  };

  const secondary = {
    container: {
      backgroundColor: AppPalette.secondary,
      borderWidth: 0,
    } as ViewStyle,
    pressed: { backgroundColor: AppPalette.secondaryPressed } as ViewStyle,
    label: { color: AppPalette.white } as TextStyle,
    spinnerColor: AppPalette.white,
  };

  const outline = {
    container: {
      backgroundColor: "transparent",
      borderWidth: StyleSheet.hairlineWidth * 2,
      borderColor: AppPalette.primary,
    } as ViewStyle,
    pressed: { backgroundColor: AppPalette.primaryMuted } as ViewStyle,
    label: { color: AppPalette.primary } as TextStyle,
    spinnerColor: AppPalette.primary,
  };

  const ghost = {
    container: {
      backgroundColor: "transparent",
      borderWidth: 0,
    } as ViewStyle,
    pressed: { backgroundColor: c.border } as ViewStyle,
    label: { color: c.text } as TextStyle,
    spinnerColor: c.text,
  };

  switch (variant) {
    case "secondary":
      return secondary;
    case "outline":
      return outline;
    case "ghost":
      return ghost;
    default:
      return primary;
  }
}

const styles = StyleSheet.create({
  base: {
    minHeight: 48,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: Radius.medium,
    alignItems: "center",
    justifyContent: "center",
  },
  fullWidth: {
    alignSelf: "stretch",
  },
  disabled: {
    opacity: 0.5,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
  },
});
