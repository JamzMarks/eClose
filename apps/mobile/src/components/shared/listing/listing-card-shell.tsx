import type { ReactNode } from "react";
import { useCallback, useMemo, useState } from "react";
import {
  NativeScrollEvent,
  NativeSyntheticEvent,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from "react-native";
import { Image } from "expo-image";

import { Radius } from "@/constants/layout";

const LIST_HORIZONTAL_INSET = 32;
const CAROUSEL_HEIGHT = 132;

export type ListingCardShellProps = {
  /** URLs das imagens do carrossel (primeira = capa). */
  mediaUrls: string[];
  imageAccessibilityLabel: string;
  title: string;
  subtitle: string;
  onPress: () => void;
  meta?: string | null;
  imageOverlay?: ReactNode;
  colors: {
    text: string;
    subtitle: string;
    imagePlaceholder: string;
  };
  /** Largura útil da imagem (grelha 2 colunas ou lista completa). */
  cardInnerWidth?: number;
  /** Altura do carrossel; em grelha usar mais baixo. */
  carouselHeight?: number;
  marginBottom?: number;
  /** Destaque visual para a primeira posição do feed. */
  emphasis?: "default" | "hero";
};

/**
 * Marketplace: carrossel de imagens compacto + texto.
 */
export function ListingCardShell({
  mediaUrls,
  imageAccessibilityLabel,
  title,
  subtitle,
  meta,
  onPress,
  imageOverlay,
  colors,
  cardInnerWidth: cardInnerWidthProp,
  carouselHeight: carouselHeightProp,
  marginBottom = 18,
  emphasis = "default",
}: ListingCardShellProps) {
  const { width: windowWidth } = useWindowDimensions();
  const slideWidth = Math.max(
    0,
    cardInnerWidthProp ?? Math.max(0, windowWidth - LIST_HORIZONTAL_INSET),
  );
  const carouselHeight =
    carouselHeightProp ?? (emphasis === "hero" ? 200 : CAROUSEL_HEIGHT);
  const urls = useMemo(
    () => mediaUrls.map((u) => u.trim()).filter((u) => u.length > 0),
    [mediaUrls],
  );
  const [page, setPage] = useState(0);

  const onMomentumScrollEnd = useCallback(
    (e: NativeSyntheticEvent<NativeScrollEvent>) => {
      const x = e.nativeEvent.contentOffset.x;
      const i = Math.round(x / slideWidth);
      setPage(Math.min(Math.max(i, 0), Math.max(urls.length - 1, 0)));
    },
    [slideWidth, urls.length],
  );

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.card, { marginBottom }, pressed && styles.pressed]}
      accessibilityRole="button"
      accessibilityLabel={`${title}. ${subtitle}`}
    >
      <View style={[styles.carouselWrap, { width: slideWidth }]}>
        <View
          style={[
            styles.slidesViewport,
            { height: carouselHeight, backgroundColor: colors.imagePlaceholder },
          ]}
          accessibilityLabel={imageAccessibilityLabel}
        >
          {urls.length === 0 ? null : urls.length === 1 ? (
            <Image
              source={{ uri: urls[0] }}
              style={{ width: slideWidth, height: carouselHeight }}
              contentFit="cover"
              transition={200}
            />
          ) : (
            <ScrollView
              horizontal
              nestedScrollEnabled
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              decelerationRate="fast"
              snapToInterval={slideWidth}
              snapToAlignment="start"
              onMomentumScrollEnd={onMomentumScrollEnd}
              style={StyleSheet.absoluteFill}
              contentContainerStyle={styles.pagerContent}
            >
              {urls.map((uri) => (
                <Image
                  key={uri}
                  source={{ uri }}
                  style={{ width: slideWidth, height: carouselHeight }}
                  contentFit="cover"
                  transition={200}
                />
              ))}
            </ScrollView>
          )}
        </View>
        {urls.length > 1 ? (
          <View style={styles.dots} pointerEvents="none">
            {urls.map((_, i) => (
              <View
                key={i}
                style={[
                  styles.dot,
                  {
                    backgroundColor: i === page ? colors.text : colors.subtitle,
                    opacity: i === page ? 1 : 0.35,
                  },
                ]}
              />
            ))}
          </View>
        ) : null}
        {imageOverlay ? <View style={styles.overlay}>{imageOverlay}</View> : null}
      </View>
      <View style={styles.body}>
        <Text
          style={[
            styles.title,
            emphasis === "hero" && styles.titleHero,
            { color: colors.text },
          ]}
          numberOfLines={2}>
          {title}
        </Text>
        <Text
          style={[
            styles.subtitle,
            emphasis === "hero" && styles.subtitleHero,
            { color: colors.subtitle },
          ]}
          numberOfLines={2}>
          {subtitle}
        </Text>
        {meta ? (
          <Text style={[styles.meta, { color: colors.subtitle }]} numberOfLines={1}>
            {meta}
          </Text>
        ) : null}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {},
  pressed: {
    opacity: 0.92,
  },
  carouselWrap: {
    borderRadius: Radius.medium,
    overflow: "hidden",
    alignSelf: "center",
  },
  slidesViewport: {
    borderRadius: Radius.medium,
    overflow: "hidden",
  },
  pagerContent: {
    flexDirection: "row",
  },
  dots: {
    position: "absolute",
    bottom: 8,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "center",
    gap: 6,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  overlay: {
    position: "absolute",
    left: 10,
    top: 10,
    maxWidth: "85%",
  },
  body: {
    marginTop: 8,
    gap: 2,
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    letterSpacing: -0.2,
  },
  titleHero: {
    fontSize: 18,
    fontWeight: "700",
    letterSpacing: -0.25,
  },
  subtitle: {
    fontSize: 14,
    lineHeight: 19,
  },
  subtitleHero: {
    fontSize: 15,
    lineHeight: 21,
  },
  meta: {
    fontSize: 13,
    marginTop: 2,
  },
});
