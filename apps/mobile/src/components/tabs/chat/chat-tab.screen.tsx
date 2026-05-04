import { type ElementRef, useCallback, useMemo, useRef, useState } from "react";
import { Keyboard, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { useRouter } from "expo-router";
import { useTranslation } from "react-i18next";

import { AuthRequiredPlaceholder } from "@/components/auth";
import { ChatConversationActionsSheet } from "@/components/tabs/chat/chat-conversation-actions-sheet";
import { ChatInlineEmpty } from "@/components/tabs/chat/chat-inline-empty";
import { ChatConversationCard } from "@/components/shared/listing/chat-conversation-card";
import { Screen } from "@/components/layout/screen";
import { AppTabScreenHeader } from "@/components/shared/tab-screen/AppTabScreenHeader";
import { TabScreenContent } from "@/components/shared/tab-screen/TabScreenContent";
import { TabHeaderChatNewButton } from "@/components/shared/tab-screen/TabHeaderChrome";
import { AppSearchField } from "@/components/ui/SearchField";
import { Layout, Paddings, Radii } from "@/constants/layout";
import { AppPalette, getSchemeColors } from "@/constants/palette";
import { useAuth } from "@/contexts/auth-context";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { LOCAL_CHAT_CONVERSATIONS } from "@/services/chat/chat.local-data";
import type { ChatConversationListItem } from "@/types/entities/chat.types";

type ChatInboxFilter = "all" | "direct" | "group";

function sortByRecent(a: ChatConversationListItem, b: ChatConversationListItem): number {
  return new Date(b.lastMessageAt).getTime() - new Date(a.lastMessageAt).getTime();
}

function matchesQuery(row: ChatConversationListItem, q: string): boolean {
  if (!q) return true;
  const n = q.toLowerCase();
  return (
    row.title.toLowerCase().includes(n) || row.lastMessagePreview.toLowerCase().includes(n)
  );
}

function matchesInboxFilter(row: ChatConversationListItem, filter: ChatInboxFilter): boolean {
  if (filter === "all") return true;
  if (filter === "direct") return row.kind === "direct";
  return row.kind === "group";
}

/**
 * Conversas — lista única com filtro rápido (ALL / DIRECT / GRUPOS). Mock local até existir backend.
 */
export function ChatTabScreen() {
  const { t } = useTranslation("tabs");
  const { t: tAuth } = useTranslation("auth");
  const router = useRouter();
  const scheme = useColorScheme() ?? "light";
  const c = getSchemeColors(scheme);
  const { isReady, isSignedIn } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [inboxFilter, setInboxFilter] = useState<ChatInboxFilter>("all");
  const [sheetConversation, setSheetConversation] = useState<ChatConversationListItem | null>(null);
  const searchInputRef = useRef<ElementRef<typeof TextInput>>(null);

  const openChat = useCallback(
    (row: ChatConversationListItem) => {
      Keyboard.dismiss();
      searchInputRef.current?.blur();
      router.push(`/chat/${row.id}`);
    },
    [router],
  );

  const openConversationActions = useCallback((row: ChatConversationListItem) => {
    Keyboard.dismiss();
    searchInputRef.current?.blur();
    setSheetConversation(row);
  }, []);

  const selectedOverlayColor = useMemo(
    () => (scheme === "dark" ? "rgba(251, 146, 60, 0.14)" : "rgba(194, 65, 12, 0.09)"),
    [scheme],
  );

  const visibleList = useMemo(() => {
    const q = searchQuery.trim();
    return LOCAL_CHAT_CONVERSATIONS.filter((row) => matchesQuery(row, q))
      .filter((row) => matchesInboxFilter(row, inboxFilter))
      .sort(sortByRecent);
  }, [searchQuery, inboxFilter]);

  const searchActive = searchQuery.trim().length > 0;

  const emptyHint = useMemo(() => {
    if (searchActive) return t("chatSearchNoResults");
    switch (inboxFilter) {
      case "all":
        return t("chatEmptyAll");
      case "direct":
        return t("chatEmptyIndividual");
      case "group":
        return t("chatEmptyGroups");
      default:
        return t("chatEmptyAll");
    }
  }, [searchActive, inboxFilter, t]);

  if (!isReady) {
    return null;
  }

  if (!isSignedIn) {
    return (
      <Screen>
        <AppTabScreenHeader title={t("chatTitle")} borderColor={c.border} titleColor={c.text} />
        <TabScreenContent style={{ flex: 1 }}>
          <AuthRequiredPlaceholder message={tAuth("authRequiredChatBody")} insetFromParent />
        </TabScreenContent>
      </Screen>
    );
  }

  const filters: { id: ChatInboxFilter; labelKey: string; a11yKey: string }[] = [
    { id: "all", labelKey: "chatFilterAll", a11yKey: "chatFilterAllA11y" },
    { id: "direct", labelKey: "chatFilterDirect", a11yKey: "chatFilterDirectA11y" },
    { id: "group", labelKey: "chatFilterGroups", a11yKey: "chatFilterGroupsA11y" },
  ];

  return (
    <Screen>
      <AppTabScreenHeader
        title={t("chatTitle")}
        borderColor={c.border}
        titleColor={c.text}
        trailing={<TabHeaderChatNewButton color={c.text} />}
      />
      <TabScreenContent style={{ flex: 1 }}>
        <View style={styles.searchWrap}>
          <AppSearchField
            ref={searchInputRef}
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder={t("chatSearchPlaceholder")}
            autoCapitalize="none"
            autoCorrect={false}
            accessibilityLabel={t("chatSearchA11y")}
          />
        </View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          style={styles.filterScrollOuter}
          contentContainerStyle={styles.filterScrollContent}>
          <View style={styles.filterChipsRow}>
            {filters.map(({ id, labelKey, a11yKey }) => {
              const selected = inboxFilter === id;
              return (
                <Pressable
                  key={id}
                  onPress={() => setInboxFilter(id)}
                  style={[
                    styles.filterChip,
                    {
                      backgroundColor: selected ? AppPalette.primary : c.surface,
                      borderColor: selected ? AppPalette.primary : c.border,
                    },
                  ]}
                  accessibilityRole="button"
                  accessibilityLabel={t(a11yKey)}
                  accessibilityState={{ selected }}>
                  <Text
                    style={[styles.filterChipText, { color: selected ? AppPalette.white : c.text }]}
                    numberOfLines={1}>
                    {t(labelKey)}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </ScrollView>
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="always"
          showsVerticalScrollIndicator={false}>
          {visibleList.length === 0 ? (
            <ChatInlineEmpty
              message={emptyHint}
              textColor={c.textSecondary}
              backgroundColor={c.surface}
            />
          ) : (
            visibleList.map((row) => (
              <ChatConversationCard
                key={row.id}
                conversation={row}
                textColor={c.text}
                subtitleColor={c.textSecondary}
                borderColor={c.border}
                accentColor={c.tint}
                yesterdayLabel={t("chatTimeYesterday")}
                selected={sheetConversation?.id === row.id}
                selectedBackgroundColor={selectedOverlayColor}
                onPress={() => openChat(row)}
                onLongPress={() => openConversationActions(row)}
              />
            ))
          )}
        </ScrollView>
      </TabScreenContent>
      <ChatConversationActionsSheet
        conversation={sheetConversation}
        onClose={() => setSheetConversation(null)}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  searchWrap: {
    paddingTop: Layout.tab.content.topPaddingAfterHeader,
    paddingBottom: Paddings.sm,
  },
  /** Evita o ScrollView horizontal esticar na vertical (irmão de outro ScrollView com flex:1). */
  filterScrollOuter: {
    flexGrow: 0,
    flexShrink: 0,
    marginBottom: Paddings.sm,
  },
  filterScrollContent: {
    flexGrow: 0,
    alignItems: "center",
  },
  filterChipsRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  filterChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: Radii.full,
    borderWidth: StyleSheet.hairlineWidth,
  },
  filterChipText: {
    fontSize: 13,
    fontWeight: "700",
    letterSpacing: 0.3,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: Paddings.xxl,
  },
});
