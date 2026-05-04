import { useCallback, useMemo } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import BottomSheet, {
  BottomSheetBackdrop,
  type BottomSheetBackdropProps,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTranslation } from "react-i18next";

import { Icon } from "@/components/ui/icon/icon";
import { AppIcon } from "@/components/ui/icon/icon.types";
import { AppPalette, getSchemeColors } from "@/constants/palette";
import { useColorScheme } from "@/hooks/use-color-scheme";
import type { ChatConversationListItem } from "@/types/entities/chat.types";

export type ChatConversationActionsSheetProps = {
  conversation: ChatConversationListItem | null;
  onClose: () => void;
  onMute?: () => void;
  onBlock?: () => void;
  onDelete?: () => void;
};

export function ChatConversationActionsSheet({
  conversation,
  onClose,
  onMute,
  onBlock,
  onDelete,
}: ChatConversationActionsSheetProps) {
  const { t } = useTranslation("tabs");
  const scheme = useColorScheme() ?? "light";
  const c = getSchemeColors(scheme);
  const insets = useSafeAreaInsets();
  const visible = conversation !== null;
  const snapPoints = useMemo(() => ["42%"], []);

  const renderBackdrop = useCallback(
    (props: BottomSheetBackdropProps) => (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
        opacity={0.4}
        pressBehavior="close"
      />
    ),
    [],
  );

  function fire(closeAfter: () => void) {
    closeAfter();
    onClose();
  }

  return (
    <BottomSheet
      index={visible ? 0 : -1}
      snapPoints={snapPoints}
      enablePanDownToClose
      onChange={(i) => {
        if (i === -1) onClose();
      }}
      backdropComponent={renderBackdrop}
      containerStyle={styles.hostContainer}
      backgroundStyle={{ backgroundColor: c.surface }}
      handleIndicatorStyle={{ backgroundColor: c.border }}>
      <BottomSheetView
        style={[styles.body, { paddingBottom: Math.max(24, insets.bottom + 12) }]}>
        {conversation ? (
          <>
            <Text style={[styles.title, { color: c.text }]} numberOfLines={2}>
              {conversation.title}
            </Text>
            <Text style={[styles.hint, { color: c.textSecondary }]}>{t("chatSheetHint")}</Text>

            <View style={[styles.actions, { borderColor: c.border }]}>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel={t("chatSheetMuteA11y")}
                style={({ pressed }) => [
                  styles.row,
                  { borderBottomColor: c.border },
                  pressed && { opacity: 0.65 },
                ]}
                onPress={() => fire(() => onMute?.())}>
                <Icon name={AppIcon.BellOff} size="md" color={c.text} />
                <Text style={[styles.rowLabel, { color: c.text }]}>{t("chatSheetMute")}</Text>
              </Pressable>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel={t("chatSheetBlockA11y")}
                style={({ pressed }) => [
                  styles.row,
                  { borderBottomColor: c.border },
                  pressed && { opacity: 0.65 },
                ]}
                onPress={() => fire(() => onBlock?.())}>
                <Icon name={AppIcon.Ban} size="md" color={c.text} />
                <Text style={[styles.rowLabel, { color: c.text }]}>{t("chatSheetBlock")}</Text>
              </Pressable>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel={t("chatSheetDeleteA11y")}
                style={({ pressed }) => [styles.row, styles.rowLast, pressed && { opacity: 0.65 }]}
                onPress={() => fire(() => onDelete?.())}>
                <Icon name={AppIcon.Trash} size="md" color={AppPalette.error} />
                <Text style={[styles.rowLabel, styles.destructive]}>{t("chatSheetDelete")}</Text>
              </Pressable>
            </View>
          </>
        ) : null}
      </BottomSheetView>
    </BottomSheet>
  );
}

const styles = StyleSheet.create({
  /** Garante stacking acima de listas com imagens (ex.: expo-image no Android). */
  hostContainer: {
    zIndex: 2000,
    elevation: 2000,
  },
  body: {
    paddingHorizontal: 20,
    paddingTop: 4,
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    lineHeight: 24,
  },
  hint: {
    fontSize: 14,
    marginTop: 6,
    marginBottom: 16,
    lineHeight: 20,
  },
  actions: {
    borderRadius: 12,
    borderWidth: StyleSheet.hairlineWidth,
    overflow: "hidden",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 16,
    paddingHorizontal: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  rowLast: {
    borderBottomWidth: 0,
  },
  rowLabel: {
    flex: 1,
    fontSize: 16,
    fontWeight: "500",
  },
  destructive: {
    color: AppPalette.error,
    fontWeight: "600",
  },
});
