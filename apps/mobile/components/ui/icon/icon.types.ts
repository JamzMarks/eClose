export enum AppIcon {
  Home = 'home',
  Explore = 'explore',
  Create = 'create',
  Profile = 'profile',
  Like = 'like',
  Filter = 'filter',
}

export const IconSizes = {
  sm: 16,
  md: 22,
  lg: 28,
  xl: 32,
} as const;

export type IconProps = {
  name: AppIcon;
  size?: IconSize;
  color: string;
  filled?: boolean;
};

export type IconSize = keyof typeof IconSizes;