import { getIconProvider } from './icon.registry';
import { IconProps } from './icon.types';

export function Icon(props: IconProps) {
  const Provider = getIconProvider();
  return <Provider {...props} />;
}