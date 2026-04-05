import { DiscoverScreenHeader } from "@/components/discover/DiscoverScreenHeader";
import {
  DiscoverSegmentedKind,
  type DiscoverListKind,
} from "@/components/discover/discover-segmented-kind";

export type DiscoverListToolbarProps = {
  title: string;
  subtitle: string;
  listKind: DiscoverListKind;
  onListKindChange: (kind: DiscoverListKind) => void;
  segmentLabels: { events: string; venues: string };
  onFilterPress: () => void;
  filterAccessibilityLabel: string;
  colors: {
    border: string;
    title: string;
    subtitle: string;
    filterIcon: string;
    segmentTrack: string;
    segmentActiveBg: string;
    segmentActiveText: string;
    segmentInactiveText: string;
  };
};

/**
 * Cabeçalho da tab Descobrir: título, subtítulo dinâmico, filtro e segmento Eventos | Espaços.
 */
export function DiscoverListToolbar({
  title,
  subtitle,
  listKind,
  onListKindChange,
  segmentLabels,
  onFilterPress,
  filterAccessibilityLabel,
  colors,
}: DiscoverListToolbarProps) {
  return (
    <>
      <DiscoverScreenHeader
        title={title}
        subtitle={subtitle}
        borderColor={colors.border}
        titleColor={colors.title}
        subtitleColor={colors.subtitle}
        filterIconColor={colors.filterIcon}
        filterAccessibilityLabel={filterAccessibilityLabel}
        onFilterPress={onFilterPress}
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
