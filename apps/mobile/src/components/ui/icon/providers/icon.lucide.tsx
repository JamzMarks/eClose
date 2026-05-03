import {
  Home,
  Compass,
  User,
  Heart,
  Share2,
  Ellipsis,
  SlidersHorizontal,
  CalendarDays,
  Bookmark,
  CirclePlus,
  Bell,
  MessagesSquare,
  Settings,
  Shield,
  FileText,
  HelpCircle,
  LogOut,
  Search,
  MessageSquarePlus,
  SquarePen,
  Undo2,
  ChevronLeft,
  X,
  Mail,
  Lock,
} from "lucide-react-native";

import { IconSizes, AppIcon } from "../icon.types";
import { IconProvider } from "./icon.provider";

const map = {
  [AppIcon.Home]: Home,
  [AppIcon.Explore]: Compass,
  [AppIcon.Programacao]: CalendarDays,
  [AppIcon.Create]: CirclePlus,
  [AppIcon.Notifications]: Bell,
  [AppIcon.Wishlist]: Bookmark,
  [AppIcon.Profile]: User,
  [AppIcon.Chat]: MessagesSquare,
  [AppIcon.Settings]: Settings,
  [AppIcon.Shield]: Shield,
  [AppIcon.FileText]: FileText,
  [AppIcon.Help]: HelpCircle,
  [AppIcon.LogOut]: LogOut,
  [AppIcon.Search]: Search,
  [AppIcon.NewMessage]: MessageSquarePlus,
  [AppIcon.Like]: Heart,
  [AppIcon.Filter]: SlidersHorizontal,
  [AppIcon.Edit]: SquarePen,
  [AppIcon.Undo]: Undo2,
  [AppIcon.ChevronLeft]: ChevronLeft,
  [AppIcon.Close]: X,
  [AppIcon.Mail]: Mail,
  [AppIcon.Lock]: Lock,
  [AppIcon.Share]: Share2,
  [AppIcon.More]: Ellipsis,
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
      strokeWidth={filled ? 1.65 : 1.35}
    />
  );
};