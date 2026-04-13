import { Ionicons } from "@expo/vector-icons";
import {
  Pressable,
  StyleSheet,
  Text,
  View,
  type PressableProps,
  type StyleProp,
  type ViewStyle,
} from "react-native";

import { Icon } from "@/components/ui/icon/icon";
import type { AppIcon, IconSize } from "@/components/ui/icon/icon.types";
import { AppPalette, getSchemeColors } from "@/constants/palette";
import { Radius } from "@/constants/layout";
import { useColorScheme } from "@/hooks/use-color-scheme";

type AppPressableBase = Omit<PressableProps, "children" | "style"> & {
  style?: StyleProp<ViewStyle>;
  /** Cor do ícone e do título (por defeito: texto do tema; ignorado se `destructive`). */
  color?: string;
  iconSize?: IconSize;
};

type DefaultPressableProps = AppPressableBase & {
  variant?: "default";
} & (
  | { icon: AppIcon; title?: string }
  | { icon?: AppIcon; title: string }
);

export type NavigationPressableProps = AppPressableBase & {
  variant: "navigation";
  title: string;
  icon?: AppIcon;
  subtitle?: string;
  /** Cor do subtítulo e do chevron (por defeito: texto secundário do tema). */
  mutedColor?: string;
  showChevron?: boolean;
  /** Lista em Configurações usa `forward`; linhas expansíveis podem usar `down`. */
  navigationChevron?: "forward" | "down";
  destructive?: boolean;
};

export type AppPressableProps = DefaultPressableProps | NavigationPressableProps;

function isNavigationProps(p: AppPressableProps): p is NavigationPressableProps {
  return p.variant === "navigation";
}

/**
 * Pressable transparente (sem cor de fundo), com ícone opcional (`AppIcon`) e/ou texto.
 * `variant="navigation"`: linha tipo definições (título, subtítulo opcional, chevron opcional).
 * Feedback ao toque: opacidade — sem preenchimento de fundo.
 */
export function AppPressable(props: AppPressableProps) {
  const scheme = useColorScheme() ?? "light";
  const c = getSchemeColors(scheme);

  if (isNavigationProps(props)) {
    const {
      variant: _v,
      title,
      icon,
      subtitle,
      mutedColor,
      showChevron = true,
      navigationChevron = "forward",
      destructive,
      color,
      iconSize = "md",
      disabled,
      style,
      ...rest
    } = props;
    const isDisabled = disabled ?? false;
    const titleColor = destructive ? AppPalette.error : (color ?? c.text);
    const subColor = mutedColor ?? c.textSecondary;
    const chevColor = mutedColor ?? c.textSecondary;

    return (
      <Pressable
        accessibilityRole="button"
        disabled={isDisabled}
        style={({ pressed }) => [
          styles.navBase,
          pressed && !isDisabled && styles.pressed,
          isDisabled && styles.disabled,
          style as StyleProp<ViewStyle>,
        ]}
        {...rest}>
        <>
          {icon ? (
            <View style={styles.navIconSlot}>
              <Icon name={icon} size={iconSize} color={titleColor} />
            </View>
          ) : null}
          <View style={styles.navTextCol}>
            <Text style={[styles.navTitle, { color: titleColor }]} numberOfLines={1}>
              {title}
            </Text>
            {subtitle ? (
              <Text style={[styles.navSubtitle, { color: subColor }]} numberOfLines={2}>
                {subtitle}
              </Text>
            ) : null}
          </View>
          {showChevron ? (
            <Ionicons
              name={navigationChevron === "down" ? "chevron-down" : "chevron-forward"}
              size={16}
              color={chevColor}
              style={styles.chevron}
            />
          ) : null}
        </>
      </Pressable>
    );
  }

  const {
    icon,
    title,
    color,
    iconSize = "md",
    disabled,
    style,
    variant: _v,
    ...rest
  } = props;
  const tint = color ?? c.text;
  const isDisabled = disabled ?? false;

  return (
    <Pressable
      accessibilityRole="button"
      disabled={isDisabled}
      style={({ pressed }) => [
        styles.base,
        pressed && !isDisabled && styles.pressed,
        isDisabled && styles.disabled,
        style as StyleProp<ViewStyle>,
      ]}
      {...rest}>
      <>
        {icon ? <Icon name={icon} size={iconSize} color={tint} /> : null}
        {title ? (
          <Text
            style={[styles.label, icon ? styles.labelWithIcon : null, { color: tint }]}
            numberOfLines={1}>
            {title}
          </Text>
        ) : null}
      </>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    minHeight: 44,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: Radius.sm,
    backgroundColor: "transparent",
  },
  navBase: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 14,
    gap: 12,
    backgroundColor: "transparent",
  },
  navIconSlot: {
    width: 28,
    alignItems: "center",
    justifyContent: "center",
  },
  navTextCol: {
    flex: 1,
    minWidth: 0,
  },
  navTitle: {
    fontSize: 16,
    fontWeight: "500",
  },
  navSubtitle: {
    fontSize: 13,
    marginTop: 4,
  },
  chevron: {
    opacity: 0.55,
  },
  pressed: {
    opacity: 0.55,
  },
  disabled: {
    opacity: 0.45,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
  },
  labelWithIcon: {
    marginLeft: 8,
  },
});
