import type { Block } from '../../types/block.js'
import { InvalidBlockSchemaError } from '../../errors/invalid-block-schema-error.js'
import type { BlockSchemaV02 } from './types.js'
import { isBlockSchemaV02 } from './validators.js'
import { getValidationErrors } from './get-validation-errors.js'
import { isExternalReference } from './is-external-reference.js'
import { parseExternalReference } from './parse-external-reference.js'
import { getExternalReferenceUrl } from './get-external-reference-url.js'
import { getExternalReferenceLabel } from './get-external-reference-label.js'

/**
 * Adaptor for schema v0.2
 *
 * Converts from schema v0.2 format to internal block format.
 * Handles external block references by creating placeholder nodes.
 *
 * External references (e.g., "github:org/repo#v1.0.0") are converted to
 * placeholder blocks with:
 * - `_external: true` flag for renderer styling
 * - `_externalUrl` for click-to-open functionality
 * - Display label as the title
 */
export class SchemaV02Adaptor {
  /**
   * Convert a single schema v0.2 block to internal format
   */
  adapt(schemaBlock: BlockSchemaV02): Block {
    return {
      id: schemaBlock.id,
      title: {
        he: schemaBlock.title.he_text,
        en: schemaBlock.title.en_text,
      },
      prerequisites: schemaBlock.prerequisites,
      parents: schemaBlock.parents,
      // Preserve any additional properties
      ...Object.fromEntries(
        Object.entries(schemaBlock).filter(
          ([key]) => !['id', 'title', 'prerequisites', 'parents'].includes(key)
        )
      ),
    }
  }

  /**
   * Convert multiple schema v0.2 blocks to internal format
   * Also generates placeholder blocks for any external references
   */
  adaptMany(schemaBlocks: BlockSchemaV02[]): Block[] {
    const adaptedBlocks = schemaBlocks.map(block => this.adapt(block))
    const placeholderBlocks = this.createPlaceholderBlocks(schemaBlocks)

    return [...adaptedBlocks, ...placeholderBlocks]
  }

  /**
   * Parse and adapt JSON data
   * Returns adapted blocks plus placeholder blocks for external references
   */
  adaptFromJson(json: string): Block[] {
    const parsed: unknown = JSON.parse(json)

    // Validate input is either a valid block or array
    if (!Array.isArray(parsed) && !isBlockSchemaV02(parsed)) {
      const errors = getValidationErrors()
      throw new InvalidBlockSchemaError(
        'Invalid block schema v0.2 format',
        errors !== null ? errors : undefined
      )
    }

    // Handle array of blocks
    if (Array.isArray(parsed)) {
      const validBlocks = parsed.filter(isBlockSchemaV02)
      if (validBlocks.length !== parsed.length) {
        console.warn(
          `Warning: ${parsed.length - validBlocks.length} invalid blocks were filtered out`
        )
      }
      return this.adaptMany(validBlocks)
    }

    // Handle single block
    const adaptedBlock = this.adapt(parsed)
    const placeholders = this.createPlaceholderBlocks([parsed])
    return [adaptedBlock, ...placeholders]
  }

  /**
   * Validate if the data conforms to schema v0.2
   */
  static validate(data: unknown): data is BlockSchemaV02 | BlockSchemaV02[] {
    if (Array.isArray(data)) {
      return data.every(isBlockSchemaV02)
    }
    return isBlockSchemaV02(data)
  }

  /**
   * Create placeholder blocks for all external references found in the blocks.
   * Each unique external reference becomes a placeholder block.
   */
  private createPlaceholderBlocks(schemaBlocks: BlockSchemaV02[]): Block[] {
    // Collect all unique external references
    const externalRefs = new Set<string>()

    for (const block of schemaBlocks) {
      for (const prereq of block.prerequisites) {
        if (isExternalReference(prereq)) {
          externalRefs.add(prereq)
        }
      }
      for (const parent of block.parents) {
        if (isExternalReference(parent)) {
          externalRefs.add(parent)
        }
      }
    }

    // Create placeholder blocks for each external reference
    const placeholders: Block[] = []

    for (const ref of externalRefs) {
      const parsed = parseExternalReference(ref)
      if (!parsed) {
        continue
      }

      const label = getExternalReferenceLabel(parsed)
      const url = getExternalReferenceUrl(parsed)

      placeholders.push({
        id: ref, // Use the full reference string as the ID
        title: {
          he: label,
          en: label,
        },
        prerequisites: [],
        parents: [],
        _external: true,
        _externalPlatform: parsed.platform,
        _externalUrl: url,
        _externalOrg: parsed.org,
        _externalRepo: parsed.repo,
        _externalBlockId: parsed.blockId,
        _externalGitRef: parsed.gitRef,
      })
    }

    return placeholders
  }

  /**
   * Extract all external references from a set of blocks
   * Useful for consumers who want to resolve external blocks themselves
   */
  extractExternalReferences(schemaBlocks: BlockSchemaV02[]): string[] {
    const externalRefs = new Set<string>()

    for (const block of schemaBlocks) {
      for (const prereq of block.prerequisites) {
        if (isExternalReference(prereq)) {
          externalRefs.add(prereq)
        }
      }
      for (const parent of block.parents) {
        if (isExternalReference(parent)) {
          externalRefs.add(parent)
        }
      }
    }

    return Array.from(externalRefs)
  }
}
