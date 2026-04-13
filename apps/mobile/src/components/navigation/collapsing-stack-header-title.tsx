import type { ReactNode } from "react";
import { useCallback, useLayoutEffect, useRef } from "react";
import {
  Animated,
  LayoutChangeEvent,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Platform,
  StyleSheet,
} from "react-native";
import type { NativeStackNavigationOptions } from "@react-navigation/native-stack";

import {
  buildMinimalStackHeaderOptions,
  type MinimalStackHeaderChrome,
} from "@/components/navigation/minimal-stack-header";
import { StackContentPageTitle } from "@/components/navigation/StackContentPageTitle";

/** Distância de scroll (px) para o fade entre título grande e título no header. */
const INLINE_TITLE_FADE_RANGE_PX = 32;

export type UseCollapsingStackHeaderTitleParams = {
  /**
   * Quando false, o header mantém-se como em `buildMinimalStackHeaderOptions` (título vazio).
   */
  enabled?: boolean;
  /**
   * Quando true, o hook não chama `navigation.setOptions` (ex.: outro `useLayoutEffect` define o título no mesmo ecrã).
   */
  skipHeaderSync?: boolean;
  /** Compatível com `useNavigation()` (expo-router / React Navigation). */
  navigation: { setOptions: (options: Partial<NativeStackNavigationOptions>) => void };
  collapsedTitle: string;
  headerTitleColor: string;
  chrome: MinimalStackHeaderChrome;
  minimalHeaderOptions?: Parameters<typeof buildMinimalStackHeaderOptions>[1];
};

export type CollapsingStackHeaderTitleHandle = {
  active: boolean;
  onLargeTitleLayout: (e: LayoutChangeEvent) => void;
  onScroll: (e: NativeSyntheticEvent<NativeScrollEvent>) => void;
  scrollEventThrottle: number;
  /** Estilo para envolver `StackContentPageTitle` (Animated.View). Só usar quando `active`. */
  largeTitleAnimatedStyle: { opacity: Animated.Value } | undefined;
};

/**
 * Título grande no conteúdo que, ao sair do ecrã no scroll, aparece centrado no header (com fade).
 * Combina com stacks que usam `buildMinimalStackHeaderOptions`.
 */
export function useCollapsingStackHeaderTitle({
  enabled = true,
  skipHeaderSync = false,
  navigation,
  collapsedTitle,
  headerTitleColor,
  chrome,
  minimalHeaderOptions,
}: UseCollapsingStackHeaderTitleParams): CollapsingStackHeaderTitleHandle {
  const titleBottomY = useRef(0);
  const lastScrollY = useRef(0);
  const headerOpacity = useRef(new Animated.Value(0)).current;
  const largeTitleOpacity = useRef(new Animated.Value(1)).current;

  const minimalOptsRef = useRef(minimalHeaderOptions);
  minimalOptsRef.current = minimalHeaderOptions;
  const chromeRef = useRef(chrome);
  chromeRef.current = chrome;

  const headerActive = enabled && !skipHeaderSync;

  const updateFromScrollY = useCallback(
    (scrollY: number) => {
      if (!headerActive || titleBottomY.current <= 0) {
        headerOpacity.setValue(0);
        largeTitleOpacity.setValue(1);
        return;
      }
      const end = titleBottomY.current;
      const start = Math.max(0, end - INLINE_TITLE_FADE_RANGE_PX);
      let t: number;
      if (end <= start) {
        t = scrollY >= end ? 1 : 0;
      } else {
        t = (scrollY - start) / (end - start);
      }
      t = Math.min(1, Math.max(0, t));
      headerOpacity.setValue(t);
      largeTitleOpacity.setValue(1 - t);
    },
    [headerActive, headerOpacity, largeTitleOpacity],
  );

  const onLargeTitleLayout = useCallback(
    (e: LayoutChangeEvent) => {
      const { height, y } = e.nativeEvent.layout;
      titleBottomY.current = y + height;
      updateFromScrollY(lastScrollY.current);
    },
    [updateFromScrollY],
  );

  const onScroll = useCallback(
    (e: NativeSyntheticEvent<NativeScrollEvent>) => {
      const y = e.nativeEvent.contentOffset.y;
      lastScrollY.current = y;
      updateFromScrollY(y);
    },
    [updateFromScrollY],
  );

  useLayoutEffect(() => {
    if (skipHeaderSync) {
      return;
    }

    const base = buildMinimalStackHeaderOptions(chromeRef.current, minimalOptsRef.current);

    if (!enabled) {
      navigation.setOptions({
        ...base,
        headerTitle: () => null,
        headerTitleAlign: "left",
      } as NativeStackNavigationOptions);
      headerOpacity.setValue(0);
      largeTitleOpacity.setValue(1);
      return;
    }

    function HeaderInlineTitle() {
      return (
        <Animated.Text
          accessibilityRole="header"
          numberOfLines={1}
          style={[
            styles.inlineHeaderTitle,
            { color: headerTitleColor, opacity: headerOpacity },
          ]}
          {...(Platform.OS === "android" ? { includeFontPadding: false } : {})}>
          {collapsedTitle}
        </Animated.Text>
      );
    }

    navigation.setOptions({
      ...base,
      headerTitleAlign: "center",
      headerTitle: () => <HeaderInlineTitle />,
    } as NativeStackNavigationOptions);
  }, [
    skipHeaderSync,
    enabled,
    navigation,
    collapsedTitle,
    headerTitleColor,
    chrome.headerBackgroundColor,
    chrome.tintColor,
    chrome.circleBackgroundColor,
    chrome.backAccessibilityLabel,
    headerOpacity,
    largeTitleOpacity,
  ]);

  return {
    active: headerActive,
    onLargeTitleLayout,
    onScroll,
    scrollEventThrottle: 16,
    largeTitleAnimatedStyle: headerActive ? { opacity: largeTitleOpacity } : undefined,
  };
}

export function CollapsingStackLargeTitle({
  color,
  collapse,
  children,
}: {
  color: string;
  collapse: CollapsingStackHeaderTitleHandle;
  children: ReactNode;
}) {
  if (!collapse.active || collapse.largeTitleAnimatedStyle == null) {
    return <StackContentPageTitle color={color}>{children}</StackContentPageTitle>;
  }
  return (
    <Animated.View style={collapse.largeTitleAnimatedStyle} onLayout={collapse.onLargeTitleLayout}>
      <StackContentPageTitle color={color}>{children}</StackContentPageTitle>
    </Animated.View>
  );
}

/** Props de scroll a espalhar no `ScrollView` / `FlatList` quando `collapse.active`. */
export function collapsingScrollProps(collapse: CollapsingStackHeaderTitleHandle) {
  if (!collapse.active) {
    return {};
  }
  return {
    onScroll: collapse.onScroll,
    scrollEventThrottle: collapse.scrollEventThrottle,
  };
}

const styles = StyleSheet.create({
  inlineHeaderTitle: {
    fontSize: 17,
    fontWeight: "600",
    letterSpacing: -0.28,
    textAlign: "center",
  },
});
