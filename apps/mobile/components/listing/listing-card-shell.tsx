import type { ReactNode } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Image } from "expo-image";

export type ListingCardShellProps = {
  imageUri: string | null | undefined;
  imageAccessibilityLabel: string;
  title: string;
  subtitle: string;
  onPress: () => void;
  /** Texto pequeno por baixo do subtítulo (ex.: datas, preço). */
  meta?: string | null;
  /** Conteúdo sobre a imagem (ex.: chip de categoria). */
  imageOverlay?: ReactNode;
  colors: {
    text: string;
    subtitle: string;
    imagePlaceholder: string;
  };
};

/**
 * Layout partilhado estilo marketplace (imagem grande + texto), especializado por Venue/Event.
 */
export function ListingCardShell({
  imageUri,
  imageAccessibilityLabel,
  title,
  subtitle,
  meta,
  onPress,
  imageOverlay,
  colors,
}: ListingCardShellProps) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.card, pressed && styles.pressed]}
      accessibilityRole="button"
      accessibilityLabel={`${title}. ${subtitle}`}
    >
      <View style={styles.imageWrap}>
        <View
          style={[styles.imageInner, { backgroundColor: colors.imagePlaceholder }]}
          accessibilityLabel={imageAccessibilityLabel}
        >
          {imageUri ? (
            <Image
              source={{ uri: imageUri }}
              style={styles.image}
              contentFit="cover"
              transition={200}
            />
          ) : null}
        </View>
        {imageOverlay ? <View style={styles.overlay}>{imageOverlay}</View> : null}
      </View>
      <View style={styles.body}>
        <Text style={[styles.title, { color: colors.text }]} numberOfLines={2}>
          {title}
        </Text>
        <Text style={[styles.subtitle, { color: colors.subtitle }]} numberOfLines={2}>
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
  card: {
    marginBottom: 20,
  },
  pressed: {
    opacity: 0.92,
  },
  imageWrap: {
    borderRadius: 12,
    overflow: "hidden",
    aspectRatio: 1.15,
    width: "100%",
  },
  imageInner: {
    ...StyleSheet.absoluteFillObject,
  },
  image: {
    width: "100%",
    height: "100%",
  },
  overlay: {
    position: "absolute",
    left: 10,
    top: 10,
    maxWidth: "85%",
  },
  body: {
    marginTop: 10,
    gap: 4,
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    letterSpacing: -0.2,
  },
  subtitle: {
    fontSize: 14,
    lineHeight: 19,
  },
  meta: {
    fontSize: 13,
    marginTop: 2,
  },
});
