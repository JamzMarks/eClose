import { Pressable } from "react-native";

import { AppTabScreenHeader } from "@/components/shared/tab-screen/AppTabScreenHeader";
import {
  DiscoverSegmentedKind,
  type DiscoverListKind,
} from "@/components/discover/discover-segmented-kind";
import { Icon } from "@/components/ui/icon/icon";
import { AppIcon } from "@/components/ui/icon/icon.types";

export type DiscoverListToolbarProps = {
  title: string;
  listKind: DiscoverListKind;
  onListKindChange: (kind: DiscoverListKind) => void;
  segmentLabels: { events: string; venues: string };
  onFilterPress: () => void;
  filterAccessibilityLabel: string;
  colors: {
    border: string;
    title: string;
    filterIcon: string;
    segmentTrack: string;
    segmentActiveBg: string;
    segmentActiveText: string;
    segmentInactiveText: string;
  };
};

/**
 * Cabeçalho + segmento Eventos | Espaços (tab Programação).
 */
export function DiscoverListToolbar({
  title,
  listKind,
  onListKindChange,
  segmentLabels,
  onFilterPress,
  filterAccessibilityLabel,
  colors,
}: DiscoverListToolbarProps) {
  return (
    <>
      <AppTabScreenHeader
        title={title}
        borderColor={colors.border}
        titleColor={colors.title}
        trailing={
          <Pressable
            onPress={onFilterPress}
            hitSlop={12}
            accessibilityRole="button"
            accessibilityLabel={filterAccessibilityLabel}>
            <Icon name={AppIcon.Filter} size="lg" color={colors.filterIcon} />
          </Pressable>
        }
      />
      <DiscoverSegmentedKind
        value={listKind}
        onChange={onListKindChange}
        labels={segmentLabels}
        activeBackground={colors.segmentActiveBg}
        activeText={colors.segmentActiveText}
        inactiveText={colors.segmentInactiveText}
        trackBackground={colors.segmentTrack}
      />
    </>
  );
}
