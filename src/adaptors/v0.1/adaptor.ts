import type { Block } from '../../types/block.js'
import { InvalidBlockSchemaError } from '../../errors/invalid-block-schema-error.js'
import type { BlockSchemaV01 } from './types.js'
import { isBlockSchemaV01 } from './validators.js'
import { getValidationErrors } from './get-validation-errors.js'

/**
 * Adaptor for schema v0.1
 * Converts from schema v0.1 format to internal block format
 * Uses @lumina-study/block-schema for validation
 */
export class SchemaV01Adaptor {
  /**
   * Convert a single schema v0.1 block to internal format
   */
  adapt(schemaBlock: BlockSchemaV01): Block {
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
   * Convert multiple schema v0.1 blocks to internal format
   */
  adaptMany(schemaBlocks: BlockSchemaV01[]): Block[] {
    return schemaBlocks.map(block => this.adapt(block))
  }

  /**
   * Parse and adapt JSON data
   */
  adaptFromJson(json: string): Block[] {
    const parsed: unknown = JSON.parse(json)

    // Validate input is either a valid block or array
    if (!Array.isArray(parsed) && !isBlockSchemaV01(parsed)) {
      const errors = getValidationErrors()
      throw new InvalidBlockSchemaError(
        'Invalid block schema v0.1 format',
        errors !== null ? errors : undefined
      )
    }

    // Handle array of blocks
    if (Array.isArray(parsed)) {
      const validBlocks = parsed.filter(isBlockSchemaV01)
      if (validBlocks.length !== parsed.length) {
        console.warn(
          `Warning: ${parsed.length - validBlocks.length} invalid blocks were filtered out`
        )
      }
      return this.adaptMany(validBlocks)
    }

    // Handle single block
    return [this.adapt(parsed)]
  }

  /**
   * Validate if the data conforms to schema v0.1
   */
  static validate(data: unknown): data is BlockSchemaV01 | BlockSchemaV01[] {
    if (Array.isArray(data)) {
      return data.every(isBlockSchemaV01)
    }
    return isBlockSchemaV01(data)
  }
}
