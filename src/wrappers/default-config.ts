import type { BlocksGraphBaseConfig } from './blocks-graph-base-config.js'

/**
 * Default values for configuration options
 */
export const DEFAULT_CONFIG = {
  language: 'en',
  orientation: 'ttb',
  showPrerequisites: true,
  prerequisiteLineStyle: 'dashed',
} satisfies Required<
  Pick<
    BlocksGraphBaseConfig,
    'language' | 'orientation' | 'showPrerequisites' | 'prerequisiteLineStyle'
  >
>
