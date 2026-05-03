import { useCallback, useMemo } from "react";
import {
  Modal,
  Pressable,
  Share,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import * as Clipboard from "expo-clipboard";
import { useTranslation } from "react-i18next";

import { AppButton } from "@/components/ui/Button";
import { getSchemeColors } from "@/constants/palette";
import { useColorScheme } from "@/hooks/use-color-scheme";

export type GroupInviteLinkModalProps = {
  visible: boolean;
  onDismiss: () => void;
  /** Nome do grupo (só para o título contextual). */
  groupName: string;
  /** URL de convite; se vazio, gera-se a partir do nome. */
  inviteUrl?: string;
};

function buildDefaultInviteUrl(groupName: string): string {
  const slug = groupName
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
  const token = Math.random().toString(36).slice(2, 10);
  return `https://eclose.app/g/join/${slug || "grupo"}/${token}`;
}

export function GroupInviteLinkModal({
  visible,
  onDismiss,
  groupName,
  inviteUrl,
}: GroupInviteLinkModalProps) {
  const { t } = useTranslation("tabs");
  const scheme = useColorScheme() ?? "light";
  const c = getSchemeColors(scheme);

  const url = useMemo(
    () => (inviteUrl?.trim() ? inviteUrl.trim() : buildDefaultInviteUrl(groupName)),
    [groupName, inviteUrl],
  );

  const copy = useCallback(async () => {
    await Clipboard.setStringAsync(url);
  }, [url]);

  const share = useCallback(async () => {
    try {
      await Share.share({
        message: url,
        url,
      });
    } catch {
      /* utilizador cancelou */
    }
  }, [url]);

  return (
    <Modal visible={visible} animationType="fade" transparent onRequestClose={onDismiss}>
      <Pressable style={styles.backdrop} onPress={onDismiss}>
        <Pressable
          style={[styles.card, { backgroundColor: c.surface, borderColor: c.border }]}
          onPress={(e) => e.stopPropagation()}>
          <Text style={[styles.title, { color: c.text }]}>{t("chatGroupInviteLinkTitle")}</Text>
          <Text style={[styles.hint, { color: c.textSecondary }]}>{t("chatGroupInviteLinkHint")}</Text>
          <TextInput
            value={url}
            editable={false}
            multiline
            selectTextOnFocus
            style={[styles.urlField, { color: c.text, borderColor: c.border }]}
            accessibilityLabel={t("chatGroupInviteLinkA11y")}
          />
          <View style={styles.actions}>
            <AppButton title={t("chatGroupInviteCopy")} onPress={() => void copy()} fullWidth />
            <AppButton
              title={t("chatGroupInviteShare")}
              onPress={() => void share()}
              variant="outline"
              fullWidth
            />
            <AppButton title={t("chatGroupInviteClose")} onPress={onDismiss} variant="ghost" fullWidth />
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    padding: 24,
  },
  card: {
    borderRadius: 16,
    borderWidth: StyleSheet.hairlineWidth,
    padding: 20,
  },
  title: { fontSize: 18, fontWeight: "700", marginBottom: 8 },
  hint: { fontSize: 14, lineHeight: 20, marginBottom: 14 },
  urlField: {
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    minHeight: 48,
  },
  actions: { marginTop: 16, gap: 8 },
});
