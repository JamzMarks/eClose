export enum AppIcon {
  Home = "home",
  Explore = "explore",
  Programacao = "programacao",
  Create = "create",
  Notifications = "notifications",
  Wishlist = "wishlist",
  Profile = "profile",
  Like = "like",
  Filter = "filter",
}

export const IconSizes = {
  sm: 15,
  md: 20,
  lg: 24,
  xl: 28,
} as const;

export type IconProps = {
  name: AppIcon;
  size?: IconSize;
  color: string;
  filled?: boolean;
};

export type IconSize = keyof typeof IconSizes;