import { useMemo, useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { useTranslation } from "react-i18next";

import { AuthRequiredPlaceholder } from "@/components/auth";
import { ChatConversationCard } from "@/components/shared/listing/chat-conversation-card";
import { Screen } from "@/components/layout/screen";
import { AppTabScreenHeader } from "@/components/shared/tab-screen/AppTabScreenHeader";
import { TabScreenContent } from "@/components/shared/tab-screen/TabScreenContent";
import { TabHeaderChatNewButton } from "@/components/shared/tab-screen/TabHeaderChrome";
import { SettingsSectionHeader } from "@/components/settings/components/SettingsSectionHeader";
import { AppSearchField } from "@/components/ui/SearchField";
import { Layout, Paddings, Radii } from "@/constants/layout";
import { getSchemeColors } from "@/constants/palette";
import { useAuth } from "@/contexts/auth-context";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { LOCAL_CHAT_CONVERSATIONS } from "@/services/chat/chat.local-data";
import type { ChatConversationListItem } from "@/services/chat/chat-list.types";

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

/**
 * Conversas — lista estilo WhatsApp (individuais e grupos). Mock local até existir backend.
 */
export function ChatTabScreen() {
  const { t } = useTranslation("tabs");
  const { t: tAuth } = useTranslation("auth");
  const scheme = useColorScheme() ?? "light";
  const c = getSchemeColors(scheme);
  const { isReady, isSignedIn } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");

  const { individuals, groups } = useMemo(() => {
    const q = searchQuery.trim();
    const filtered = LOCAL_CHAT_CONVERSATIONS.filter((row) => matchesQuery(row, q)).sort(
      sortByRecent,
    );
    return {
      individuals: filtered.filter((row) => row.kind === "direct"),
      groups: filtered.filter((row) => row.kind === "group"),
    };
  }, [searchQuery]);

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

  const searchActive = searchQuery.trim().length > 0;
  const noSearchResults = searchActive && individuals.length === 0 && groups.length === 0;
  const showIndividualBlock = !searchActive || individuals.length > 0;
  const showGroupsBlock = !searchActive || groups.length > 0;

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
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder={t("chatSearchPlaceholder")}
            autoCapitalize="none"
            autoCorrect={false}
            accessibilityLabel={t("chatSearchA11y")}
          />
        </View>
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}>
          {noSearchResults ? (
            <View style={[styles.emptyCard, { backgroundColor: c.surface, borderColor: c.border }]}>
              <Text style={[styles.emptyText, { color: c.textSecondary }]}>
                {t("chatSearchNoResults")}
              </Text>
            </View>
          ) : null}

          {!noSearchResults ? (
            <>
              {showIndividualBlock ? (
                <>
                  <SettingsSectionHeader
                    title={t("chatSectionIndividual")}
                    color={c.textSecondary}
                  />
                  {individuals.length === 0 ? (
                    <View
                      style={[
                        styles.emptyCard,
                        { backgroundColor: c.surface, borderColor: c.border },
                      ]}>
                      <Text style={[styles.emptyText, { color: c.textSecondary }]}>
                        {t("chatEmptyIndividual")}
                      </Text>
                    </View>
                  ) : (
                    individuals.map((row, i) => (
                      <ChatConversationCard
                        key={row.id}
                        conversation={row}
                        textColor={c.text}
                        subtitleColor={c.textSecondary}
                        borderColor={c.border}
                        accentColor={c.tint}
                        yesterdayLabel={t("chatTimeYesterday")}
                        showDivider={i < individuals.length - 1}
                        onPress={() => undefined}
                      />
                    ))
                  )}
                </>
              ) : null}

              {showGroupsBlock ? (
                <>
                  <SettingsSectionHeader title={t("chatSectionGroups")} color={c.textSecondary} />
                  {groups.length === 0 ? (
                    <View
                      style={[
                        styles.emptyCard,
                        { backgroundColor: c.surface, borderColor: c.border },
                      ]}>
                      <Text style={[styles.emptyText, { color: c.textSecondary }]}>
                        {t("chatEmptyGroups")}
                      </Text>
                    </View>
                  ) : (
                    groups.map((row, i) => (
                      <ChatConversationCard
                        key={row.id}
                        conversation={row}
                        textColor={c.text}
                        subtitleColor={c.textSecondary}
                        borderColor={c.border}
                        accentColor={c.tint}
                        yesterdayLabel={t("chatTimeYesterday")}
                        showDivider={i < groups.length - 1}
                        onPress={() => undefined}
                      />
                    ))
                  )}
                </>
              ) : null}
            </>
          ) : null}
        </ScrollView>
      </TabScreenContent>
    </Screen>
  );
}

const styles = StyleSheet.create({
  searchWrap: {
    paddingTop: Layout.tab.content.topPaddingAfterHeader,
    paddingBottom: Paddings.md,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: Paddings.xxl,
  },
  emptyCard: {
    borderRadius: Radii.md,
    borderWidth: StyleSheet.hairlineWidth,
    paddingVertical: Paddings.xl,
    paddingHorizontal: Paddings.lg,
  },
  emptyText: {
    fontSize: 15,
    lineHeight: 22,
  },
});
