import type { Block } from '../../types/block.js';
import type { BlockSchemaV01 } from './types.js';
import { isBlockSchemaV01, getValidationErrors } from './types.js';
import { InvalidBlockSchemaError } from '../../errors.js';

/**
 * Adaptor for schema v0.1
 * Converts from schema v0.1 format to internal block format
 * Uses @tupe12334/block-schema for validation
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
          ([key]) => !['id', 'title', 'prerequisites', 'parents'].includes(key),
        ),
      ),
    };
  }

  /**
   * Convert multiple schema v0.1 blocks to internal format
   */
  adaptMany(schemaBlocks: BlockSchemaV01[]): Block[] {
    return schemaBlocks.map(block => this.adapt(block));
  }

  /**
   * Parse and adapt JSON data
   */
  adaptFromJson(json: string): Block[] {
    const parsed: unknown = JSON.parse(json);

    // Handle both single block and array of blocks
    if (Array.isArray(parsed)) {
      const validBlocks = parsed.filter(isBlockSchemaV01);
      if (validBlocks.length !== parsed.length) {
        console.warn(
          `Warning: ${parsed.length - validBlocks.length} invalid blocks were filtered out`,
        );
      }
      return this.adaptMany(validBlocks);
    }

    if (isBlockSchemaV01(parsed)) {
      return [this.adapt(parsed)];
    }

    const errors = getValidationErrors();
    throw new InvalidBlockSchemaError('Invalid block schema v0.1 format', errors ?? undefined);
  }

  /**
   * Validate if the data conforms to schema v0.1
   */
  static validate(data: unknown): data is BlockSchemaV01 | BlockSchemaV01[] {
    if (Array.isArray(data)) {
      return data.every(isBlockSchemaV01);
    }
    return isBlockSchemaV01(data);
  }
}

/**
 * Default instance for convenience
 */
export const schemaV01Adaptor = new SchemaV01Adaptor();
