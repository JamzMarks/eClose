import {
  Home,
  Compass,
  User,
  Heart,
  SlidersHorizontal,
  CalendarDays,
  Bookmark,
  CirclePlus,
} from "lucide-react-native";

import { IconSizes, AppIcon } from "../icon.types";
import { IconProvider } from "./icon.provider";

const map = {
  [AppIcon.Home]: Home,
  [AppIcon.Explore]: Compass,
  [AppIcon.Programacao]: CalendarDays,
  [AppIcon.Create]: CirclePlus,
  [AppIcon.Wishlist]: Bookmark,
  [AppIcon.Profile]: User,
  [AppIcon.Like]: Heart,
  [AppIcon.Filter]: SlidersHorizontal,
};

export const lucideProvider: IconProvider = ({
  name,
  size = 'md',
  color,
  filled,
}) => {
  const Icon = map[name];
  const iconSize = IconSizes[size];

  return (
    <Icon
      size={iconSize}
      color={color}
      strokeWidth={filled ? 2.5 : 2}
    />
  );
};