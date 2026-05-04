import { useCallback, useLayoutEffect, useMemo, useState } from "react";
import {
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useLocalSearchParams, useNavigation, useRouter } from "expo-router";
import i18n from "i18next";
import { useTranslation } from "react-i18next";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Screen } from "@/components/layout/screen";
import { ChatThreadHeaderTitle } from "@/components/tabs/chat/chat-thread-header-title";
import { Icon } from "@/components/ui/icon/icon";
import { AppIcon } from "@/components/ui/icon/icon.types";
import { Paddings, Radii } from "@/constants/layout";
import { AppPalette, getSchemeColors } from "@/constants/palette";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { formatChatBubbleTime } from "@/lib/format-date";
import { LOCAL_CHAT_CONVERSATIONS } from "@/services/chat/chat.local-data";
import { getMockConversationMessages } from "@/services/chat/chat.messages.mock";
import type { ChatMessageBubble } from "@/types/entities/chat.types";

export function ChatConversationScreen() {
  const params = useLocalSearchParams<{ id: string | string[] }>();
  const navigation = useNavigation();
  const router = useRouter();
  const { t } = useTranslation("tabs");
  const insets = useSafeAreaInsets();
  const scheme = useColorScheme() ?? "light";
  const c = getSchemeColors(scheme);

  const conversationId = useMemo(() => {
    const raw = params.id;
    if (Array.isArray(raw)) return raw[0] ?? "";
    return typeof raw === "string" ? raw : "";
  }, [params.id]);

  const locale = i18n.language?.startsWith("en") ? "en-GB" : "pt-PT";

  const conversation = useMemo(
    () => LOCAL_CHAT_CONVERSATIONS.find((row) => row.id === conversationId),
    [conversationId],
  );

  const baseMessages = useMemo(
    () => (conversationId ? getMockConversationMessages(conversationId) : []),
    [conversationId],
  );

  const [sentMessages, setSentMessages] = useState<ChatMessageBubble[]>([]);
  const [draft, setDraft] = useState("");

  const messages = useMemo(
    () => [...baseMessages, ...sentMessages],
    [baseMessages, sentMessages],
  );

  const listData = useMemo(() => [...messages].reverse(), [messages]);

  useLayoutEffect(() => {
    if (!conversationId || !conversation) {
      navigation.setOptions({
        title: t("chatThreadFallbackTitle"),
        headerTitleAlign: undefined,
        headerTitle: undefined,
      });
      return;
    }
    navigation.setOptions({
      title: "",
      headerTitleAlign: "left",
      headerTitle: () => (
        <ChatThreadHeaderTitle
          conversation={conversation}
          textColor={c.text}
          subtitleColor={c.textSecondary}
          borderColor={c.border}
          surfaceColor={c.surface}
        />
      ),
    });
  }, [conversation, conversationId, c.border, c.surface, c.text, c.textSecondary, navigation, t]);

  const send = useCallback(() => {
    const body = draft.trim();
    if (!body) return;
    setSentMessages((prev) => [
      ...prev,
      {
        id: `local-${Date.now()}`,
        sentAt: new Date().toISOString(),
        body,
        from: "me",
      },
    ]);
    setDraft("");
  }, [draft]);

  if (!conversationId || !conversation) {
    return (
      <Screen edges={["bottom"]}>
        <View style={[styles.center, { backgroundColor: c.background }]}>
          <Text style={[styles.notFound, { color: c.textSecondary }]}>{t("chatThreadNotFound")}</Text>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={t("chatThreadBackA11y")}
            onPress={() => router.back()}
            style={({ pressed }) => [
              styles.backBtn,
              { borderColor: c.border, opacity: pressed ? 0.85 : 1 },
            ]}>
            <Text style={[styles.backBtnText, { color: AppPalette.primary }]}>{t("chatThreadBack")}</Text>
          </Pressable>
        </View>
      </Screen>
    );
  }

  const canSend = draft.trim().length > 0;

  return (
    <Screen edges={["bottom"]}>
      <KeyboardAvoidingView
        style={[styles.flex, { backgroundColor: c.background }]}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={Platform.OS === "ios" ? 88 : 0}>
        <FlatList
          data={listData}
          inverted
          keyExtractor={(item) => item.id}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={[
            styles.listContent,
            messages.length === 0 && styles.listEmptyGrow,
          ]}
          ListEmptyComponent={
            <Text style={[styles.emptyHint, { color: c.textSecondary }]}>{t("chatThreadEmpty")}</Text>
          }
          renderItem={({ item }) => {
            const mine = item.from === "me";
            return (
              <View style={[styles.msgRow, mine ? styles.msgRowMe : styles.msgRowThem]}>
                <View
                  style={[
                    styles.bubble,
                    mine
                      ? { backgroundColor: AppPalette.primary }
                      : {
                          backgroundColor: c.surface,
                          borderColor: c.border,
                          borderWidth: StyleSheet.hairlineWidth,
                        },
                  ]}>
                  <Text style={[styles.bubbleText, { color: mine ? "#fff" : c.text }]}>{item.body}</Text>
                  <Text
                    style={[
                      styles.bubbleTime,
                      { color: mine ? "rgba(255,255,255,0.82)" : c.textMuted },
                    ]}>
                    {formatChatBubbleTime(item.sentAt, locale)}
                  </Text>
                </View>
              </View>
            );
          }}
        />
        <View
          style={[
            styles.inputBar,
            {
              borderTopColor: c.border,
              backgroundColor: c.background,
              paddingBottom: Math.max(insets.bottom, Paddings.sm),
            },
          ]}>
          <TextInput
            value={draft}
            onChangeText={setDraft}
            placeholder={t("chatThreadMessagePlaceholder")}
            placeholderTextColor={c.textMuted}
            multiline
            maxLength={4000}
            style={[
              styles.input,
              {
                color: c.text,
                borderColor: c.border,
                backgroundColor: c.surface,
              },
            ]}
            accessibilityLabel={t("chatThreadMessagePlaceholder")}
          />
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={t("chatThreadSendA11y")}
            disabled={!canSend}
            onPress={send}
            style={({ pressed }) => [
              styles.sendBtn,
              {
                backgroundColor: canSend ? AppPalette.primary : `${AppPalette.primary}55`,
                opacity: pressed && canSend ? 0.92 : 1,
              },
            ]}>
            <Icon name={AppIcon.Send} size="lg" color="#FFFFFF" filled />
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: Paddings.xl,
    gap: Paddings.md,
  },
  notFound: {
    fontSize: 15,
    textAlign: "center",
    lineHeight: 22,
  },
  backBtn: {
    paddingHorizontal: Paddings.lg,
    paddingVertical: Paddings.sm,
    borderRadius: Radii.sm,
    borderWidth: StyleSheet.hairlineWidth,
  },
  backBtnText: {
    fontSize: 16,
    fontWeight: "700",
  },
  listContent: {
    paddingHorizontal: Paddings.xl,
    paddingVertical: Paddings.md,
  },
  listEmptyGrow: {
    flexGrow: 1,
    justifyContent: "center",
  },
  emptyHint: {
    textAlign: "center",
    fontSize: 14,
    paddingHorizontal: Paddings.xl,
  },
  msgRow: {
    width: "100%",
    flexDirection: "row",
    marginBottom: Paddings.sm,
  },
  msgRowMe: {
    justifyContent: "flex-end",
  },
  msgRowThem: {
    justifyContent: "flex-start",
  },
  bubble: {
    maxWidth: "82%",
    borderRadius: Radii.md,
    paddingHorizontal: Paddings.md,
    paddingVertical: Paddings.sm,
    gap: 4,
  },
  bubbleText: {
    fontSize: 16,
    lineHeight: 22,
  },
  bubbleTime: {
    fontSize: 11,
    alignSelf: "flex-end",
    fontVariant: ["tabular-nums"],
  },
  inputBar: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: Paddings.sm,
    paddingHorizontal: Paddings.xl,
    paddingTop: Paddings.sm,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  input: {
    flex: 1,
    minHeight: 44,
    maxHeight: 120,
    borderRadius: Radii.sm,
    borderWidth: StyleSheet.hairlineWidth,
    paddingHorizontal: Paddings.md,
    paddingVertical: Platform.OS === "ios" ? 10 : 8,
    fontSize: 16,
  },
  sendBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
  },
});
