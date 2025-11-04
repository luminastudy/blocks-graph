/**
 * Schema v0.1 types
 * Uses @tupe12334/block-schema for validation
 */

import AjvImport from 'ajv';
import addFormatsImport from 'ajv-formats';
import blockSchemaV01 from '@tupe12334/block-schema/v0.1' with { type: 'json' };

// Handle both ESM and CJS imports
type AjvModule = typeof AjvImport & { default?: typeof AjvImport };
type AddFormatsModule = typeof addFormatsImport & { default?: typeof addFormatsImport };

const Ajv = (AjvImport as AjvModule).default || AjvImport;
const addFormats = (addFormatsImport as AddFormatsModule).default || addFormatsImport;

/**
 * Bilingual title object
 */
export interface BlockTitle {
  he_text: string;
  en_text: string;
}

/**
 * Block schema v0.1
 */
export interface BlockSchemaV01 {
  id: string;
  title: BlockTitle;
  prerequisites: string[];
  parents: string[];
  // Allow for additional properties as schema permits
  [key: string]: unknown;
}

// Create AJV validator (draft-07 compatible)
const ajv = new Ajv({ strict: false });
addFormats(ajv);
const validateBlock = ajv.compile(blockSchemaV01);

/**
 * Type guard to check if an object is a valid BlockSchemaV01
 * Uses JSON Schema validation from @tupe12334/block-schema
 */
export function isBlockSchemaV01(obj: unknown): obj is BlockSchemaV01 {
  return validateBlock(obj);
}

/**
 * Get validation errors from last validation
 */
export function getValidationErrors(): string | null {
  if (!validateBlock.errors) {
    return null;
  }
  return ajv.errorsText(validateBlock.errors);
}
