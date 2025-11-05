/**
 * AJV validator setup for schema v0.1
 */

import AjvImport from 'ajv';
import addFormatsImport from 'ajv-formats';
import blockSchemaV01 from '@tupe12334/block-schema/v0.1' with { type: 'json' };

// Handle both ESM and CJS imports
type AjvModule = typeof AjvImport & { default?: typeof AjvImport };
type AddFormatsModule = typeof addFormatsImport & { default?: typeof addFormatsImport };

const Ajv = (AjvImport as AjvModule).default || AjvImport;
const addFormats = (addFormatsImport as AddFormatsModule).default || addFormatsImport;

// Create AJV validator (draft-07 compatible)
const ajv = new Ajv({ strict: false });
addFormats(ajv);
export const validateBlock = ajv.compile(blockSchemaV01);
