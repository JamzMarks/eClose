import { IconProvider } from './providers/icon.provider';
import { lucideProvider } from './providers/icon.lucide';
// import { ioniconsProvider } from './icon.ionicons';

const CURRENT_PROVIDER: IconProvider = lucideProvider;

export function getIconProvider() {
  return CURRENT_PROVIDER;
}