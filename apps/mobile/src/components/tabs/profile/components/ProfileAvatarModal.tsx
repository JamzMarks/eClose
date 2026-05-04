import { useCallback, useMemo } from "react";
import { Alert, Pressable, StyleSheet, Text, View } from "react-native";
import BottomSheet, {
  BottomSheetBackdrop,
  type BottomSheetBackdropProps,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import { Image } from "expo-image";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTranslation } from "react-i18next";

import { Icon } from "@/components/ui/icon/icon";
import { AppIcon } from "@/components/ui/icon/icon.types";
import { Radii } from "@/constants/layout";
import { AppPalette, getSchemeColors } from "@/constants/palette";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { pickAvatarFromCamera, pickAvatarFromLibrary } from "@/services/profile/pick-profile-avatar";
import type { ProfileUiDraft } from "@/types/profile-ui-draft.types";

const PREVIEW = 112;

export type ProfileAvatarModalProps = {
  visible: boolean;
  draft: ProfileUiDraft;
  avatarSeed: string;
  onClose: () => void;
  onSave: (patch: Pick<ProfileUiDraft, "useCustomAvatar" | "customAvatarUri">) => void;
};

export function ProfileAvatarModal({
  visible,
  draft,
  avatarSeed,
  onClose,
  onSave,
}: ProfileAvatarModalProps) {
  const { t } = useTranslation("profile");
  const scheme = useColorScheme() ?? "light";
  const c = getSchemeColors(scheme);
  const insets = useSafeAreaInsets();
  const snapPoints = useMemo(() => ["52%"], []);

  const defaultUri = useMemo(
    () => `https://api.dicebear.com/7.x/avataaars/png?seed=${encodeURIComponent(avatarSeed)}`,
    [avatarSeed],
  );

  const previewUri =
    draft.useCustomAvatar && draft.customAvatarUri?.trim()
      ? draft.customAvatarUri.trim()
      : defaultUri;

  const hasCustomPhoto = draft.useCustomAvatar && Boolean(draft.customAvatarUri?.trim());

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

  const applyUri = useCallback(
    (uri: string | null) => {
      if (!uri) return;
      onSave({ useCustomAvatar: true, customAvatarUri: uri });
      onClose();
    },
    [onClose, onSave],
  );

  const handleLibrary = useCallback(async () => {
    const outcome = await pickAvatarFromLibrary();
    if (outcome.status === "picked") applyUri(outcome.uri);
    else if (outcome.status === "denied") {
      Alert.alert(t("profileAvatarPermissionTitle"), t("profileAvatarPermissionLibrary"));
    }
  }, [applyUri, t]);

  const handleCamera = useCallback(async () => {
    const outcome = await pickAvatarFromCamera();
    if (outcome.status === "picked") applyUri(outcome.uri);
    else if (outcome.status === "denied") {
      Alert.alert(t("profileAvatarPermissionTitle"), t("profileAvatarPermissionCamera"));
    }
  }, [applyUri, t]);

  const handleRemove = useCallback(() => {
    onSave({ useCustomAvatar: false, customAvatarUri: null });
    onClose();
  }, [onClose, onSave]);

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
      <BottomSheetView style={[styles.body, { paddingBottom: Math.max(20, insets.bottom + 8) }]}>
        <Text style={[styles.title, { color: c.text }]}>{t("profileAvatarModalTitle")}</Text>
        <Text style={[styles.subtitle, { color: c.textSecondary }]}>{t("profileAvatarSheetSubtitle")}</Text>

        <View style={styles.previewWrap}>
          <Image
            source={{ uri: previewUri }}
            style={[styles.preview, { borderColor: c.border, backgroundColor: c.surface }]}
            accessibilityIgnoresInvertColors
          />
        </View>

        <View style={[styles.actions, { borderColor: c.border }]}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={t("profileAvatarTakePhoto")}
            onPress={() => void handleCamera()}
            style={({ pressed }) => [
              styles.row,
              {
                borderBottomWidth: StyleSheet.hairlineWidth,
                borderBottomColor: c.border,
              },
              pressed && { opacity: 0.65 },
            ]}>
            <Icon name={AppIcon.Camera} size="md" color={c.text} />
            <Text style={[styles.rowLabel, { color: c.text }]}>{t("profileAvatarTakePhoto")}</Text>
          </Pressable>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={t("profileAvatarChooseLibrary")}
            onPress={() => void handleLibrary()}
            style={({ pressed }) => [
              styles.row,
              hasCustomPhoto
                ? {
                    borderBottomWidth: StyleSheet.hairlineWidth,
                    borderBottomColor: c.border,
                  }
                : null,
              pressed && { opacity: 0.65 },
            ]}>
            <Icon name={AppIcon.ImageLibrary} size="md" color={c.text} />
            <Text style={[styles.rowLabel, { color: c.text }]}>{t("profileAvatarChooseLibrary")}</Text>
          </Pressable>
          {hasCustomPhoto ? (
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={t("profileAvatarRemovePhoto")}
              onPress={handleRemove}
              style={({ pressed }) => [styles.row, pressed && { opacity: 0.65 }]}>
              <Text style={styles.destructiveRow}>{t("profileAvatarRemovePhoto")}</Text>
            </Pressable>
          ) : null}
        </View>

        <Pressable
          accessibilityRole="button"
          accessibilityLabel={t("profileSheetCancel")}
          onPress={onClose}
          style={({ pressed }) => [styles.cancelBtn, { borderColor: c.border }, pressed && { opacity: 0.75 }]}>
          <Text style={[styles.cancelText, { color: c.text }]}>{t("profileSheetCancel")}</Text>
        </Pressable>
      </BottomSheetView>
    </BottomSheet>
  );
}

const styles = StyleSheet.create({
  hostContainer: {
    zIndex: 2100,
    elevation: 2100,
  },
  body: {
    paddingHorizontal: 20,
    paddingTop: 4,
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
  },
  subtitle: {
    fontSize: 14,
    lineHeight: 20,
    marginTop: 6,
    marginBottom: 16,
  },
  previewWrap: {
    alignItems: "center",
    marginBottom: 18,
  },
  preview: {
    width: PREVIEW,
    height: PREVIEW,
    borderRadius: PREVIEW / 2,
    borderWidth: StyleSheet.hairlineWidth * 2,
  },
  actions: {
    borderRadius: Radii.md,
    borderWidth: StyleSheet.hairlineWidth,
    overflow: "hidden",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 16,
    paddingHorizontal: 14,
  },
  rowLabel: {
    flex: 1,
    fontSize: 16,
    fontWeight: "600",
  },
  destructiveRow: {
    flex: 1,
    fontSize: 16,
    color: AppPalette.error,
    fontWeight: "600",
    textAlign: "center",
  },
  cancelBtn: {
    marginTop: 14,
    alignItems: "center",
    paddingVertical: 14,
    borderRadius: Radii.md,
    borderWidth: StyleSheet.hairlineWidth,
  },
  cancelText: {
    fontSize: 16,
    fontWeight: "600",
  },
});
