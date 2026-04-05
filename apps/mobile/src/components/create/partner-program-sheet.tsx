import { useCallback, useMemo } from "react";
import { StyleSheet, Text } from "react-native";
import BottomSheet, {
  BottomSheetBackdrop,
  type BottomSheetBackdropProps,
  BottomSheetScrollView,
} from "@gorhom/bottom-sheet";
import { useTranslation } from "react-i18next";

import { AppButton } from "@/components/ui/button";
import { getSchemeColors } from "@/constants/palette";
import { useColorScheme } from "@/hooks/use-color-scheme";

export type PartnerProgramSheetProps = {
  visible: boolean;
  onClose: () => void;
};

export function PartnerProgramSheet({ visible, onClose }: PartnerProgramSheetProps) {
  const { t } = useTranslation("discover");
  const scheme = useColorScheme() ?? "light";
  const c = getSchemeColors(scheme);
  const snapPoints = useMemo(() => ["48%", "78%"], []);

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

  return (
    <BottomSheet
      index={visible ? 0 : -1}
      snapPoints={snapPoints}
      enablePanDownToClose
      onChange={(i) => {
        if (i === -1) onClose();
      }}
      backdropComponent={renderBackdrop}
      backgroundStyle={{ backgroundColor: c.background }}
      handleIndicatorStyle={{ backgroundColor: c.border }}>
      <BottomSheetScrollView contentContainerStyle={styles.body}>
        <Text style={[styles.title, { color: c.text }]}>{t("partnerSheetTitle")}</Text>
        <Text style={[styles.lead, { color: c.textSecondary }]}>{t("partnerSheetLead")}</Text>
        <Text style={[styles.para, { color: c.textSecondary }]}>{t("partnerSheetBody")}</Text>
        <AppButton title={t("partnerSheetClose")} onPress={onClose} fullWidth />
      </BottomSheetScrollView>
    </BottomSheet>
  );
}

const styles = StyleSheet.create({
  body: {
    paddingHorizontal: 24,
    paddingBottom: 32,
    gap: 14,
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
  },
  lead: {
    fontSize: 16,
    lineHeight: 22,
    fontWeight: "600",
  },
  para: {
    fontSize: 15,
    lineHeight: 22,
  },
});
