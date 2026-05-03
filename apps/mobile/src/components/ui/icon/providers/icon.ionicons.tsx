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

    case AppIcon.Create:
      return filled ? "add-circle" : "add-circle-outline";

    case AppIcon.Notifications:
      return filled ? "notifications" : "notifications-outline";

    case AppIcon.Wishlist:
      return filled ? "bookmark" : "bookmark-outline";

    case AppIcon.Profile:
      return filled ? "person" : "person-outline";

    case AppIcon.Chat:
      return filled ? "chatbubbles" : "chatbubbles-outline";

    case AppIcon.Settings:
      return filled ? "settings" : "settings-outline";

    case AppIcon.Shield:
      return filled ? "shield" : "shield-outline";

    case AppIcon.FileText:
      return filled ? "document-text" : "document-text-outline";

    case AppIcon.Help:
      return filled ? "help-circle" : "help-circle-outline";

    case AppIcon.LogOut:
      return filled ? "log-out" : "log-out-outline";

    case AppIcon.Search:
      return filled ? "search" : "search-outline";

    case AppIcon.NewMessage:
      return filled ? "create" : "create-outline";

    case AppIcon.Like:
      return filled ? "heart" : "heart-outline";

    case AppIcon.Filter:
      return "options-outline";

    case AppIcon.ChevronLeft:
      return "chevron-back";

    case AppIcon.Share:
      return filled ? "share-social" : "share-social-outline";

    case AppIcon.More:
      return "ellipsis-horizontal";

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