import type { ExternalPlatform } from './external-platform.js'

/**
 * Parsed external block reference
 */
export interface ParsedExternalReference {
  platform: ExternalPlatform
  org: string
  repo: string
  blockId: string | null
  gitRef: string | null
  raw: string
}
