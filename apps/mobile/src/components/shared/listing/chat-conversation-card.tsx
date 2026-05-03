import { Pressable, StyleSheet, Text, View } from "react-native";
import { Image } from "expo-image";

import { Radii } from "@/constants/layout";
import { formatChatListTime } from "@/lib/format-date";
import type { ChatConversationListItem } from "@/types/entities/chat.types";

const AVATAR = 52;

export type ChatConversationCardProps = {
  conversation: ChatConversationListItem;
  textColor: string;
  subtitleColor: string;
  borderColor: string;
  accentColor: string;
  yesterdayLabel: string;
  showDivider?: boolean;
  onPress: () => void;
};

export function ChatConversationCard({
  conversation,
  textColor,
  subtitleColor,
  borderColor,
  accentColor,
  yesterdayLabel,
  showDivider = true,
  onPress,
}: ChatConversationCardProps) {
  const timeLabel = formatChatListTime(conversation.lastMessageAt, yesterdayLabel);
  const unread = conversation.unreadCount ?? 0;

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`${conversation.title}. ${conversation.lastMessagePreview}`}>
      <View
        style={[
          styles.row,
          showDivider && { borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: borderColor },
        ]}>
        <View style={[styles.avatarWrap, { backgroundColor: borderColor }]}>
          {conversation.avatarUrl ? (
            <Image
              source={{ uri: conversation.avatarUrl }}
              style={styles.avatar}
              accessibilityIgnoresInvertColors
            />
          ) : (
            <Text style={[styles.avatarFallback, { color: subtitleColor }]}>
              {conversation.title.slice(0, 1).toUpperCase()}
            </Text>
          )}
        </View>
        <View style={styles.body}>
          <View style={styles.titleRow}>
            <Text style={[styles.title, { color: textColor }]} numberOfLines={1}>
              {conversation.title}
            </Text>
            <Text style={[styles.time, { color: subtitleColor }]} numberOfLines={1}>
              {timeLabel}
            </Text>
          </View>
          <View style={styles.previewRow}>
            <Text style={[styles.preview, { color: subtitleColor }]} numberOfLines={1}>
              {conversation.lastMessagePreview}
            </Text>
            {unread > 0 ? (
              <View style={[styles.badge, { backgroundColor: accentColor }]}>
                <Text style={styles.badgeText}>{unread > 99 ? "99+" : String(unread)}</Text>
              </View>
            ) : null}
          </View>
        </View>
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
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 4,
  },
  title: {
    flex: 1,
    fontSize: 16,
    fontWeight: "600",
    minWidth: 0,
  },
  time: {
    fontSize: 13,
    fontVariant: ["tabular-nums"],
  },
  previewRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  preview: {
    flex: 1,
    fontSize: 15,
    lineHeight: 20,
    minWidth: 0,
  },
  badge: {
    minWidth: 22,
    height: 22,
    borderRadius: Radii.full,
    paddingHorizontal: 6,
    alignItems: "center",
    justifyContent: "center",
  },
  badgeText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "700",
    fontVariant: ["tabular-nums"],
  },
});
