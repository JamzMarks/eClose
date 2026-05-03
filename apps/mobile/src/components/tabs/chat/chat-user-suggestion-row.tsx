import { Pressable, StyleSheet, Text, View } from "react-native";
import { Image } from "expo-image";

import { Radii } from "@/constants/layout";
import { AppPalette } from "@/constants/palette";
import type { ChatNewMessageUserSuggestion } from "@/types/entities/chat.types";

const AVATAR = 52;

export type ChatUserSuggestionRowProps = {
  user: ChatNewMessageUserSuggestion;
  textColor: string;
  subtitleColor: string;
  borderColor: string;
  showDivider?: boolean;
  onPress: () => void;
  /** Quando definido, mostra indicador de selecção à direita. */
  selection?: "checked" | "unchecked";
};

export function ChatUserSuggestionRow({
  user,
  textColor,
  subtitleColor,
  borderColor,
  showDivider = true,
  onPress,
  selection,
}: ChatUserSuggestionRowProps) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={user.displayName}
      accessibilityState={selection ? { selected: selection === "checked" } : undefined}>
      <View
        style={[
          styles.row,
          showDivider && {
            borderBottomWidth: StyleSheet.hairlineWidth,
            borderBottomColor: borderColor,
          },
        ]}>
        <View style={[styles.avatarWrap, { backgroundColor: borderColor }]}>
          {user.avatarUrl ? (
            <Image
              source={{ uri: user.avatarUrl }}
              style={styles.avatar}
              accessibilityIgnoresInvertColors
            />
          ) : (
            <Text style={[styles.avatarFallback, { color: subtitleColor }]}>
              {user.displayName.slice(0, 1).toUpperCase()}
            </Text>
          )}
        </View>
        <View style={styles.body}>
          <Text style={[styles.title, { color: textColor }]} numberOfLines={1}>
            {user.displayName}
          </Text>
          {user.subtitle ? (
            <Text style={[styles.subtitle, { color: subtitleColor }]} numberOfLines={1}>
              {user.subtitle}
            </Text>
          ) : null}
        </View>
        {selection ? (
          <View
            style={[
              styles.selectDot,
              {
                borderColor: selection === "checked" ? AppPalette.primary : borderColor,
                backgroundColor: selection === "checked" ? AppPalette.primary : "transparent",
              },
            ]}>
            {selection === "checked" ? (
              <Text style={styles.checkMark}>✓</Text>
            ) : null}
          </View>
        ) : null}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
  },
  avatarWrap: {
    width: AVATAR,
    height: AVATAR,
    borderRadius: AVATAR / 2,
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  avatar: {
    width: AVATAR,
    height: AVATAR,
  },
  avatarFallback: {
    fontSize: 20,
    fontWeight: "700",
  },
  body: {
    flex: 1,
    minWidth: 0,
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
  },
  subtitle: {
    fontSize: 14,
    marginTop: 3,
    lineHeight: 18,
  },
  selectDot: {
    width: 24,
    height: 24,
    borderRadius: Radii.full,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 8,
  },
  checkMark: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "800",
  },
});
