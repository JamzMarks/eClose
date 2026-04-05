import { Ionicons } from "@expo/vector-icons";
import { IconSizes, AppIcon } from "../icon.types";
import { IconProvider } from "./icon.provider";

function map(name: AppIcon, filled?: boolean) {
  switch (name) {
    case AppIcon.Home:
      return filled ? "home" : "home-outline";

    case AppIcon.Explore:
      return filled ? "compass" : "compass-outline";

    case AppIcon.Programacao:
      return filled ? "calendar" : "calendar-outline";

    case AppIcon.Wishlist:
      return filled ? "bookmark" : "bookmark-outline";

    case AppIcon.Profile:
      return filled ? "person" : "person-outline";

    case AppIcon.Like:
      return filled ? "heart" : "heart-outline";

    case AppIcon.Filter:
      return "options-outline";

    default:
      return "help-circle";
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