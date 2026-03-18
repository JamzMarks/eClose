import { Ionicons } from '@expo/vector-icons';
import { IconProps, IconSizes, AppIcon } from './icon.types';
import { IconProvider } from './providers/icon.provider';

function map(name: AppIcon, filled?: boolean) {
  switch (name) {
    case AppIcon.Home:
      return filled ? 'home' : 'home-outline';

    case AppIcon.Explore:
      return filled ? 'compass' : 'compass-outline';

    case AppIcon.Create:
      return 'add-circle';

    case AppIcon.Profile:
      return filled ? 'person' : 'person-outline';

    case AppIcon.Like:
      return filled ? 'heart' : 'heart-outline';

    default:
      return 'help-circle';
  }
}

export const ioniconsProvider: IconProvider = ({
  name,
  size = 'md',
  color,
  filled,
}) => {
  return (
    <Ionicons
      name={map(name, filled)}
      size={IconSizes[size]}
      color={color}
    />
  );
};