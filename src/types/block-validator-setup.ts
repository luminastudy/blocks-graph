/**
 * AJV validator setup for internal Block format
 */

import AjvImport from 'ajv'
import blockSchemaInternal from './block.schema.json' with { type: 'json' }

// Handle both ESM and CJS imports
type AjvModule = typeof AjvImport & { default?: typeof AjvImport }

const AjvModule: AjvModule = AjvImport
const Ajv = AjvModule.default !== undefined ? AjvModule.default : AjvImport

// Create AJV validator (draft-07 compatible)
const ajv = new Ajv({ strict: false })
export const validateInternalBlock = ajv.compile(blockSchemaInternal)
