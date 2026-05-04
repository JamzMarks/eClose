import { useCallback, useEffect, useMemo, useState } from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import BottomSheet, {
  BottomSheetBackdrop,
  type BottomSheetBackdropProps,
  BottomSheetScrollView,
} from "@gorhom/bottom-sheet";
import { useTranslation } from "react-i18next";

import { AppPalette, getSchemeColors } from "@/constants/palette";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { defaultProfileUiDraft, type ProfileUiDraft } from "@/types/profile-ui-draft.types";

export type ProfileEditDraftSheetProps = {
  visible: boolean;
  draft: ProfileUiDraft;
  onClose: () => void;
  onApply: (next: ProfileUiDraft) => void;
};

export function ProfileEditDraftSheet({ visible, draft, onClose, onApply }: ProfileEditDraftSheetProps) {
  const { t } = useTranslation("profile");
  const scheme = useColorScheme() ?? "light";
  const c = getSchemeColors(scheme);
  const snapPoints = useMemo(() => ["85%"], []);

  const [local, setLocal] = useState<ProfileUiDraft>(() => draft);

  useEffect(() => {
    if (visible) {
      setLocal({ ...defaultProfileUiDraft(), ...draft });
    }
  }, [visible, draft]);

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

  const apply = () => {
    onApply(local);
    onClose();
  };

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
      keyboardBehavior="interactive"
      android_keyboardInputMode="adjustResize"
      handleIndicatorStyle={{ backgroundColor: c.border }}>
      <BottomSheetScrollView
        contentContainerStyle={[styles.scrollContent, { paddingBottom: 36 }]}
        keyboardShouldPersistTaps="handled">
        <Text style={[styles.sheetTitle, { color: c.text }]}>{t("profileEditSheetTitle")}</Text>

        <TextInput
          value={local.city}
          onChangeText={(city) => setLocal((p) => ({ ...p, city }))}
          placeholder={t("profileFieldCity")}
          placeholderTextColor={c.textSecondary}
          accessibilityLabel={t("profileFieldCity")}
          style={[styles.input, styles.fieldFirst, { color: c.text, borderColor: c.border }]}
        />

        <TextInput
          value={local.bio}
          onChangeText={(bio) => setLocal((p) => ({ ...p, bio }))}
          placeholder={t("profileFieldBioPlaceholder")}
          placeholderTextColor={c.textSecondary}
          multiline
          numberOfLines={3}
          accessibilityLabel={t("profileFieldBio")}
          style={[styles.input, styles.inputMulti, styles.fieldNext, { color: c.text, borderColor: c.border }]}
        />

        <TextInput
          value={local.interestsCsv}
          onChangeText={(interestsCsv) => setLocal((p) => ({ ...p, interestsCsv }))}
          placeholder={t("profileFieldInterestsPlaceholder")}
          placeholderTextColor={c.textSecondary}
          accessibilityLabel={t("profileFieldInterests")}
          style={[styles.input, styles.fieldNext, { color: c.text, borderColor: c.border }]}
        />

        <TextInput
          value={local.preferredLanguage}
          onChangeText={(preferredLanguage) => setLocal((p) => ({ ...p, preferredLanguage }))}
          placeholder={t("profileFieldLanguagePlaceholder")}
          placeholderTextColor={c.textSecondary}
          autoCapitalize="none"
          autoCorrect={false}
          accessibilityLabel={t("profileFieldLanguage")}
          style={[styles.input, styles.fieldNext, { color: c.text, borderColor: c.border }]}
        />

        <Text style={[styles.avatarHint, styles.fieldNext, { color: c.textSecondary }]}>
          {t("profileEditAvatarHint")}
        </Text>

        <View style={styles.actions}>
          <Pressable onPress={onClose} style={[styles.btnSecondary, { borderColor: c.border }]}>
            <Text style={{ color: c.text, fontWeight: "600" }}>{t("profileSheetCancel")}</Text>
          </Pressable>
          <Pressable onPress={apply} style={[styles.btnPrimary, { backgroundColor: AppPalette.primary }]}>
            <Text style={{ color: "#fff", fontWeight: "700" }}>{t("profileSheetSave")}</Text>
          </Pressable>
        </View>
      </BottomSheetScrollView>
    </BottomSheet>
  );
}

const styles = StyleSheet.create({
  hostContainer: {
    zIndex: 2000,
    elevation: 2000,
  },
  scrollContent: { paddingHorizontal: 20, paddingTop: 8 },
  sheetTitle: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 12,
  },
  fieldFirst: {
    marginTop: 4,
  },
  fieldNext: {
    marginTop: 14,
  },
  input: {
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
  },
  inputMulti: {
    minHeight: 88,
    textAlignVertical: "top",
  },
  avatarHint: {
    fontSize: 14,
    lineHeight: 20,
  },
  actions: {
    flexDirection: "row",
    gap: 12,
    marginTop: 24,
    paddingTop: 16,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: "rgba(128,128,128,0.25)",
  },
  btnSecondary: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: StyleSheet.hairlineWidth,
  },
  btnPrimary: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 14,
    borderRadius: 12,
  },
});
