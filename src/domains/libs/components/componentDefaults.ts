import { CmsComponentType, ComponentProps } from '@src/shared/types';
import { textDefaults } from './text/defaults';
import { imageDefaults } from './image/defaults';
import { containerDefaults } from './container/defaults';
import { linkDefaults } from './link/defaults';
import { videoDefaults } from './video/defaults';

export const COMPONENT_DEFAULTS: Record<CmsComponentType, ComponentProps> = {
  text: textDefaults,
  image: imageDefaults,
  container: containerDefaults,
  link: linkDefaults,
  video: videoDefaults,
};
