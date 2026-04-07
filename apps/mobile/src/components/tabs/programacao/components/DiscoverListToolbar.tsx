import { Pressable } from "react-native";

import { AppTabScreenHeader } from "@/components/shared/tab-screen/AppTabScreenHeader";
import { Icon } from "@/components/ui/icon/icon";
import { AppIcon } from "@/components/ui/icon/icon.types";

export type DiscoverListToolbarProps = {
  title: string;
  onFilterPress: () => void;
  filterAccessibilityLabel: string;
  colors: {
    border: string;
    title: string;
    filterIcon: string;
  };
};

/**
 * Cabeçalho da Programação (filtros à direita). Eventos/Espaços mudam nos filtros.
 */
export function DiscoverListToolbar({
  title,
  onFilterPress,
  filterAccessibilityLabel,
  colors,
}: DiscoverListToolbarProps) {
  return (
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
  );
}
