import { StyleSheet, Text, View } from "react-native";

import { AppPalette } from "@/constants/palette";
import { MVP_DISCOVERY_ONLY } from "@/lib/mvp-scope";

export type CreateMvpNoticeProps = {
  badgeLabel: string;
  title: string;
  body: string;
  textColor: string;
  subtitleColor: string;
  backgroundColor: string;
};

export function CreateMvpNotice({
  badgeLabel,
  title,
  body,
  textColor,
  subtitleColor,
  backgroundColor,
}: CreateMvpNoticeProps) {
  return (
    <View style={[styles.container, { backgroundColor }]}>
      {MVP_DISCOVERY_ONLY ? (
        <View
          style={[
            styles.badge,
            { backgroundColor: AppPalette.primaryMuted, borderColor: AppPalette.primary },
          ]}
        >
          <Text style={[styles.badgeText, { color: AppPalette.primary }]}>
            {badgeLabel}
          </Text>
        </View>
      ) : null}
      <Text style={[styles.title, { color: textColor }]}>{title}</Text>
      <Text style={[styles.body, { color: subtitleColor }]}>{body}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 24,
    gap: 16,
  },
  badge: {
    alignSelf: "flex-start",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: StyleSheet.hairlineWidth * 2,
  },
  badgeText: { fontSize: 12, fontWeight: "700" },
  title: { fontSize: 26, fontWeight: "700" },
  body: { fontSize: 16, lineHeight: 24 },
});
