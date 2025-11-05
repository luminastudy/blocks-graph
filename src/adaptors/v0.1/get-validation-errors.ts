/**
 * Get validation errors from AJV validator
 */

import AjvImport from 'ajv';
import { validateBlock } from './validator-setup.js';

// Handle both ESM and CJS imports
type AjvModule = typeof AjvImport & { default?: typeof AjvImport };

const Ajv = (AjvImport as AjvModule).default || AjvImport;

// We need access to ajv to format errors, but validateBlock is created in validator-setup
// To avoid circular dependencies and maintain single-export, we'll create ajv here too
const ajv = new Ajv({ strict: false });

/**
 * Get validation errors from last validation
 */
export function getValidationErrors(): string | null {
  if (!validateBlock.errors) {
    return null;
  }
  return ajv.errorsText(validateBlock.errors);
}
