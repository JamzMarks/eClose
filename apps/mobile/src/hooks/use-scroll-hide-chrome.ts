import { useCallback, useRef, useState } from "react";
import type { LayoutChangeEvent, NativeScrollEvent, NativeSyntheticEvent } from "react-native";
import { Animated } from "react-native";

const SCROLL_DIRECTION_THRESHOLD = 10;
const NEAR_TOP_PX = 8;
const ANIM_MS = 220;

/**
 * Comportamento tipo feed: ao deslizar para baixo o “chrome” (header + bloco opcional) recolhe;
 * qualquer deslize para cima volta a mostrá-lo, mesmo longe do topo.
 */
export function useScrollHideChrome() {
  const lastOffsetY = useRef(0);
  const visible = useRef(true);
  const chromeHeight = useRef(0);
  const maxHeight = useRef(new Animated.Value(0)).current;
  /** Evita `maxHeight: 0` antes da primeira medição — nesse frame o header ficava colapsado e a lista ocupava o ecrã. */
  const [chromeMeasured, setChromeMeasured] = useState(false);

  const onChromeLayout = useCallback(
    (e: LayoutChangeEvent) => {
      const h = e.nativeEvent.layout.height;
      if (h <= 0) return;
      chromeHeight.current = h;
      if (!chromeMeasured) {
        maxHeight.setValue(h);
        visible.current = true;
        setChromeMeasured(true);
        return;
      }
      if (visible.current) {
        maxHeight.setValue(h);
      }
    },
    [maxHeight, chromeMeasured],
  );

  const show = useCallback(() => {
    const h = chromeHeight.current;
    if (h <= 0) return;
    if (visible.current) return;
    visible.current = true;
    Animated.timing(maxHeight, {
      toValue: h,
      duration: ANIM_MS,
      useNativeDriver: false,
    }).start();
  }, [maxHeight]);

  const hide = useCallback(() => {
    const h = chromeHeight.current;
    if (h <= 0) return;
    if (!visible.current) return;
    visible.current = false;
    Animated.timing(maxHeight, {
      toValue: 0,
      duration: ANIM_MS,
      useNativeDriver: false,
    }).start();
  }, [maxHeight]);

  const onScroll = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      const y = event.nativeEvent.contentOffset.y;
      const dy = y - lastOffsetY.current;
      lastOffsetY.current = y;

      if (y <= NEAR_TOP_PX) {
        show();
        return;
      }

      if (dy > SCROLL_DIRECTION_THRESHOLD) {
        hide();
      } else if (dy < -SCROLL_DIRECTION_THRESHOLD) {
        show();
      }
    },
    [hide, show],
  );

  const chromeAnimatedStyle = chromeMeasured
    ? {
        maxHeight,
        overflow: "hidden" as const,
      }
    : undefined;

  return { onChromeLayout, onScroll, chromeAnimatedStyle };
}
