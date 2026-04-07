import { StyleSheet, TextInput, View } from "react-native";
import { useTranslation } from "react-i18next";

import { Radius } from "@/constants/radius";
import { getSchemeColors } from "@/constants/palette";
import { useColorScheme } from "@/hooks/use-color-scheme";

export type DiscoverSearchBarProps = {
  value: string;
  onChangeText: (text: string) => void;
};

export function DiscoverSearchBar({ value, onChangeText }: DiscoverSearchBarProps) {
  const { t } = useTranslation("discover");
  const scheme = useColorScheme() ?? "light";
  const c = getSchemeColors(scheme);

  return (
    <View style={[styles.wrap, { backgroundColor: c.surface, borderColor: c.border }]}>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={t("discoverSearchPlaceholder")}
        placeholderTextColor={c.textMuted}
        style={[styles.input, { color: c.text }]}
        returnKeyType="search"
        autoCapitalize="none"
        autoCorrect={false}
        accessibilityLabel={t("discoverSearchA11y")}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: Radius.medium,
    marginHorizontal: 16,
    marginBottom: 14,
  },
  input: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
  },
});
