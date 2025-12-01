import type { Block } from '../types/block.js'
import { isBlock } from '../types/is-block.js'
import { schemaV01Adaptor } from '../adaptors/v0.1/instance.js'
import type { BlockSchemaV01 } from '../adaptors/v0.1/types.js'
import { isBlockSchemaV01 } from '../adaptors/v0.1/validators.js'
import { InvalidBlockSchemaError } from '../errors/invalid-block-schema-error.js'

/**
 * Detect block schema format and convert to internal format
 *
 * @param blocks - Array of blocks in internal format or v0.1 schema format
 * @returns Blocks converted to internal format
 * @throws {InvalidBlockSchemaError} If blocks array contains invalid or mixed formats
 */
export function detectAndConvertBlocks(
  blocks: Block[] | BlockSchemaV01[]
): Block[] {
  // Auto-detect format based on first block
  const firstBlock = blocks[0]

  if (isBlockSchemaV01(firstBlock)) {
    // v0.1 schema format - convert to internal format
    // Validate all blocks are v0.1 format
    const allValid = blocks.every(isBlockSchemaV01)
    if (!allValid) {
      throw new InvalidBlockSchemaError(
        'Mixed block formats detected. All blocks must be in the same format.'
      )
    }
    return schemaV01Adaptor.adaptMany(blocks.filter(isBlockSchemaV01))
  } else if (isBlock(firstBlock)) {
    // Internal format - use directly
    // Validate all blocks are internal format
    const allValid = blocks.every(isBlock)
    if (!allValid) {
      throw new InvalidBlockSchemaError(
        'Mixed block formats detected. All blocks must be in the same format.'
      )
    }
    return blocks.filter(isBlock)
  } else {
    // Unknown format
    throw new InvalidBlockSchemaError(
      'Unable to detect block schema format. Blocks must be in internal format or v0.1 schema format.'
    )
  }
}
