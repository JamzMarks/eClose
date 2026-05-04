import { StyleSheet, Text, View } from "react-native";
import { Image } from "expo-image";
import { useTranslation } from "react-i18next";

import type { ChatConversationListItem } from "@/types/entities/chat.types";

const AVATAR = 36;

export type ChatThreadHeaderTitleProps = {
  conversation: ChatConversationListItem;
  textColor: string;
  subtitleColor: string;
  borderColor: string;
  surfaceColor: string;
};

export function ChatThreadHeaderTitle({
  conversation,
  textColor,
  subtitleColor,
  borderColor,
  surfaceColor,
}: ChatThreadHeaderTitleProps) {
  const { t } = useTranslation("tabs");
  const uri = conversation.avatarUrl?.trim();

  return (
    <View style={styles.row}>
      <View style={[styles.avatarWrap, { borderColor, backgroundColor: surfaceColor }]}>
        {uri ? (
          <Image source={{ uri }} style={styles.avatar} accessibilityIgnoresInvertColors />
        ) : (
          <Text style={[styles.fallback, { color: subtitleColor }]}>
            {conversation.title.slice(0, 1).toUpperCase()}
          </Text>
        )}
      </View>
      <View style={styles.textCol}>
        <Text style={[styles.title, { color: textColor }]} numberOfLines={1}>
          {conversation.title}
        </Text>
        {conversation.kind === "group" ? (
          <Text style={[styles.subtitle, { color: subtitleColor }]} numberOfLines={1}>
            {t("chatThreadHeaderGroup")}
          </Text>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    maxWidth: "100%",
    paddingVertical: 2,
  },
  avatarWrap: {
    width: AVATAR,
    height: AVATAR,
    borderRadius: AVATAR / 2,
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: StyleSheet.hairlineWidth,
  },
  avatar: {
    width: AVATAR,
    height: AVATAR,
  },
  fallback: {
    fontSize: 16,
    fontWeight: "700",
  },
  textCol: {
    flexShrink: 1,
    minWidth: 0,
    justifyContent: "center",
  },
  title: {
    fontSize: 17,
    fontWeight: "600",
  },
  subtitle: {
    fontSize: 12,
    fontWeight: "500",
    marginTop: 1,
  },
});
