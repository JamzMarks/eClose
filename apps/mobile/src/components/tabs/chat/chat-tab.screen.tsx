import { useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { useTranslation } from "react-i18next";

import { Screen } from "@/components/layout/screen";
import { AppTabScreenHeader } from "@/components/shared/tab-screen/AppTabScreenHeader";
import { TabScreenContent } from "@/components/shared/tab-screen/TabScreenContent";
import { TabHeaderChatNewButton } from "@/components/shared/tab-screen/TabHeaderChrome";
import { SettingsSectionHeader } from "@/components/settings/components/SettingsSectionHeader";
import { AppSearchField } from "@/components/ui/SearchField";
import { getSchemeColors } from "@/constants/palette";
import { useColorScheme } from "@/hooks/use-color-scheme";

/**
 * Conversas — lista estilo WhatsApp (individuais e grupos). Conteúdo real quando existir backend.
 */
export function ChatTabScreen() {
  const { t } = useTranslation("tabs");
  const scheme = useColorScheme() ?? "light";
  const c = getSchemeColors(scheme);
  const [searchQuery, setSearchQuery] = useState("");

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
          <SettingsSectionHeader title={t("chatSectionIndividual")} color={c.textSecondary} />
          <View style={[styles.emptyCard, { backgroundColor: c.surface, borderColor: c.border }]}>
            <Text style={[styles.emptyText, { color: c.textSecondary }]}>
              {t("chatEmptyIndividual")}
            </Text>
          </View>

          <SettingsSectionHeader title={t("chatSectionGroups")} color={c.textSecondary} />
          <View style={[styles.emptyCard, { backgroundColor: c.surface, borderColor: c.border }]}>
            <Text style={[styles.emptyText, { color: c.textSecondary }]}>
              {t("chatEmptyGroups")}
            </Text>
          </View>
        </ScrollView>
      </TabScreenContent>
    </Screen>
  );
}

const styles = StyleSheet.create({
  searchWrap: {
    paddingBottom: 12,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 24,
  },
  emptyCard: {
    borderRadius: 12,
    borderWidth: StyleSheet.hairlineWidth,
    paddingVertical: 20,
    paddingHorizontal: 16,
  },
  emptyText: {
    fontSize: 15,
    lineHeight: 22,
  },
});
