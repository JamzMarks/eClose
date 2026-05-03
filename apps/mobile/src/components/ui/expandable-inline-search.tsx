import { useCallback, useRef, useState } from "react";
import {
  Keyboard,
  LayoutChangeEvent,
  Platform,
  Pressable,
  StyleSheet,
  TextInput,
  useWindowDimensions,
  View,
  type TextInputProps,
} from "react-native";
import Animated, {
  Easing,
  interpolate,
  interpolateColor,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";

import { Icon } from "@/components/ui/icon/icon";
import { AppIcon } from "@/components/ui/icon/icon.types";
import { Radius } from "@/constants/layout";
import { AppPalette, getSchemeColors } from "@/constants/palette";
import { useColorScheme } from "@/hooks/use-color-scheme";

/** Alinhado ao hit target do botão de filtros no header das tabs. */
const COLLAPSED_SIZE = 44;
const BORDER_W = StyleSheet.hairlineWidth;

export type ExpandableInlineSearchProps = {
  value: string;
  onChangeText: (text: string) => void;
  placeholder: string;
  expandAccessibilityLabel: string;
  inputAccessibilityLabel: string;
  collapseAccessibilityLabel: string;
  /** Quando `true`, o estado expandido preenche a largura do contentor pai (ex.: entre título e ícones). */
  expandToAvailableWidth?: boolean;
} & Pick<TextInputProps, "autoCorrect" | "autoCapitalize">;

/**
 * Botão compacto que expande para campo de texto (ex.: pesquisa de cidade no header).
 * Reutilizável em qualquer barra com espaço limitado.
 */
export function ExpandableInlineSearch({
  value,
  onChangeText,
  placeholder,
  expandAccessibilityLabel,
  inputAccessibilityLabel,
  collapseAccessibilityLabel,
  expandToAvailableWidth = false,
  autoCorrect = false,
  autoCapitalize = "words",
}: ExpandableInlineSearchProps) {
  const scheme = useColorScheme() ?? "light";
  const c = getSchemeColors(scheme);
  const { width: windowW } = useWindowDimensions();
  const expandedMaxW = expandToAvailableWidth
    ? undefined
    : Math.min(220, Math.round(windowW * 0.42));

  const [expandedUi, setExpandedUi] = useState(false);
  const progress = useSharedValue(0);
  const expandedTargetW = useSharedValue(COLLAPSED_SIZE);
  const inputRef = useRef<TextInput>(null);

  const focusInput = useCallback(() => {
    inputRef.current?.focus();
  }, []);

  const onContainerLayout = useCallback(
    (e: LayoutChangeEvent) => {
      const w = e.nativeEvent.layout.width;
      if (w <= 0) return;
      const cap = expandToAvailableWidth ? w : Math.min(expandedMaxW ?? 220, w);
      expandedTargetW.value = Math.max(COLLAPSED_SIZE, cap);
    },
    [expandToAvailableWidth, expandedMaxW],
  );

  const expand = useCallback(() => {
    setExpandedUi(true);
    progress.value = withSpring(
      1,
      {
        damping: 22,
        stiffness: 240,
        mass: 0.9,
        overshootClamping: true,
        restDisplacementThreshold: 0.001,
        restSpeedThreshold: 0.001,
      },
      (finished) => {
        "worklet";
        if (finished) runOnJS(focusInput)();
      },
    );
  }, [progress, focusInput]);

  const collapse = useCallback(() => {
    setExpandedUi(false);
    Keyboard.dismiss();
    progress.value = withSpring(0, {
      damping: 24,
      stiffness: 260,
      mass: 0.95,
      overshootClamping: true,
      restDisplacementThreshold: 0.001,
      restSpeedThreshold: 0.001,
    });
  }, [progress]);

  const shellStyle = useAnimatedStyle(() => {
    const w = interpolate(progress.value, [0, 1], [COLLAPSED_SIZE, expandedTargetW.value]);
    return {
      width: w,
      backgroundColor: interpolateColor(progress.value, [0, 0.22], ["transparent", c.inputBackground]),
      borderColor: interpolateColor(progress.value, [0, 0.18], ["transparent", c.border]),
      borderWidth: interpolate(progress.value, [0, 0.14], [0, BORDER_W]),
    };
  }, [c.inputBackground, c.border]);

  const innerPadStyle = useAnimatedStyle(() => ({
    paddingLeft: interpolate(progress.value, [0, 1], [8, 12]),
    paddingRight: interpolate(progress.value, [0, 1], [8, 10]),
  }));

  const fadeExtraStyle = useAnimatedStyle(() => ({
    opacity: interpolate(progress.value, [0.2, 0.55], [0, 1]),
  }));

  return (
    <View
      style={expandToAvailableWidth ? styles.wrapperFill : styles.wrapperShrink}
      onLayout={onContainerLayout}>
      <Animated.View style={[styles.shell, shellStyle]}>
        <Animated.View style={[styles.innerRow, innerPadStyle]} pointerEvents="box-none">
          <Icon name={AppIcon.Search} size="sm" color={c.icon} />
          <Animated.View style={[styles.inputSlot, fadeExtraStyle]} pointerEvents="box-none">
            <TextInput
              ref={inputRef}
              value={value}
              onChangeText={onChangeText}
              placeholder={placeholder}
              placeholderTextColor={c.textMuted}
              style={[styles.input, { color: c.text }]}
              returnKeyType="search"
              clearButtonMode="while-editing"
              autoCorrect={autoCorrect}
              autoCapitalize={autoCapitalize}
              accessibilityLabel={inputAccessibilityLabel}
              onBlur={expandedUi ? collapse : undefined}
              editable={expandedUi}
              pointerEvents={expandedUi ? "auto" : "none"}
            />
          </Animated.View>
          <Animated.View style={fadeExtraStyle} pointerEvents="box-none">
            <Pressable
              onPress={collapse}
              hitSlop={10}
              disabled={!expandedUi}
              style={({ pressed }) => [styles.collapseBtn, pressed && styles.pressed]}
              accessibilityRole="button"
              accessibilityLabel={collapseAccessibilityLabel}>
              <Icon name={AppIcon.Close} size="sm" color={c.textSecondary} />
            </Pressable>
          </Animated.View>
        </Animated.View>

        {!expandedUi ? (
          <Pressable
            onPress={expand}
            hitSlop={8}
            style={styles.expandHit}
            accessibilityRole="button"
            accessibilityLabel={expandAccessibilityLabel}
            accessibilityState={{ expanded: false }}
          />
        ) : null}

        {!expandedUi && value.length > 0 ? (
          <View style={[styles.activeDot, { backgroundColor: AppPalette.primary }]} pointerEvents="none" />
        ) : null}
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapperFill: {
    flex: 1,
    minWidth: 0,
    alignItems: "flex-end",
  },
  wrapperShrink: {
    alignSelf: "flex-end",
  },
  shell: {
    position: "relative",
    minHeight: 44,
    borderRadius: Radius.medium,
    overflow: "hidden",
  },
  innerRow: {
    flexDirection: "row",
    alignItems: "center",
    minHeight: 44,
    gap: 8,
  },
  inputSlot: {
    flex: 1,
    minWidth: 0,
  },
  input: {
    flex: 1,
    minWidth: 0,
    paddingVertical: Platform.select({ ios: 10, android: 8, default: 8 }),
    fontSize: 16,
  },
  collapseBtn: {
    padding: 6,
    justifyContent: "center",
    alignItems: "center",
  },
  expandHit: {
    ...StyleSheet.absoluteFillObject,
  },
  pressed: {
    opacity: 0.85,
  },
  activeDot: {
    position: "absolute",
    top: 6,
    right: 6,
    width: 8,
    height: 8,
    borderRadius: 4,
    zIndex: 2,
  },
});
