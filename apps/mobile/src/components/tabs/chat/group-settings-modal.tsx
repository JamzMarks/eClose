import { useState } from "react";
import { Modal, Pressable, StyleSheet, Switch, Text, View } from "react-native";
import { useTranslation } from "react-i18next";

import { AppPalette, getSchemeColors } from "@/constants/palette";
import { useColorScheme } from "@/hooks/use-color-scheme";

export type GroupSettingsModalProps = {
  visible: boolean;
  onDismiss: () => void;
};

export function GroupSettingsModal({ visible, onDismiss }: GroupSettingsModalProps) {
  const { t } = useTranslation("tabs");
  const scheme = useColorScheme() ?? "light";
  const c = getSchemeColors(scheme);
  const [adminsOnly, setAdminsOnly] = useState(false);
  const [linkInvites, setLinkInvites] = useState(true);

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onDismiss}>
      <Pressable style={styles.backdrop} onPress={onDismiss}>
        <Pressable
          style={[styles.sheet, { backgroundColor: c.surface, borderColor: c.border }]}
          onPress={(e) => e.stopPropagation()}>
          <View style={styles.handle} />
          <Text style={[styles.title, { color: c.text }]}>{t("chatGroupSettingsTitle")}</Text>
          <View style={[styles.row, { borderColor: c.border }]}>
            <Text style={[styles.label, { color: c.text }]}>{t("chatGroupSettingsAdminsOnly")}</Text>
            <Switch
              value={adminsOnly}
              onValueChange={setAdminsOnly}
              trackColor={{ false: c.border, true: AppPalette.primary }}
            />
          </View>
          <View style={[styles.row, { borderColor: c.border }]}>
            <Text style={[styles.label, { color: c.text }]}>{t("chatGroupSettingsLinkInvites")}</Text>
            <Switch
              value={linkInvites}
              onValueChange={setLinkInvites}
              trackColor={{ false: c.border, true: AppPalette.primary }}
            />
          </View>
          <Pressable
            onPress={onDismiss}
            style={({ pressed }) => [styles.done, { opacity: pressed ? 0.85 : 1 }]}>
            <Text style={{ color: AppPalette.primary, fontWeight: "700" }}>{t("chatGroupSettingsDone")}</Text>
          </Pressable>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "flex-end",
  },
  sheet: {
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    borderWidth: StyleSheet.hairlineWidth,
    paddingHorizontal: 20,
    paddingBottom: 28,
    paddingTop: 8,
  },
  handle: {
    alignSelf: "center",
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: "rgba(128,128,128,0.35)",
    marginBottom: 16,
  },
  title: { fontSize: 17, fontWeight: "700", marginBottom: 16 },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  label: { flex: 1, fontSize: 15, paddingRight: 12 },
  done: { alignSelf: "flex-end", marginTop: 18, paddingVertical: 8 },
});
