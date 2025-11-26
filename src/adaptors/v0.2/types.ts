/**
 * Block schema v0.2
 *
 * v0.2 extends v0.1 by allowing external block references in prerequisites and parents.
 * External references follow the format: <platform>:<org>/<repo>[/<block-id>][#<ref>]
 *
 * Examples:
 * - Local UUID: "550e8400-e29b-41d4-a716-446655440000"
 * - External repo: "github:lumina-study/math-blocks"
 * - External block: "github:lumina-study/math-blocks/550e8400-e29b-41d4-a716-446655440000"
 * - With git ref: "github:lumina-study/math-blocks#v1.0.0"
 */

import type { BlockTitle } from '../v0.1/block-title.js'

export interface BlockSchemaV02 {
  id: string
  title: BlockTitle
  /** Array of block references - can be local UUIDs or external refs (github:org/repo[/block-id][#ref]) */
  prerequisites: string[]
  /** Array of block references - can be local UUIDs or external refs (github:org/repo[/block-id][#ref]) */
  parents: string[]
  // Allow for additional properties as schema permits
  [key: string]: unknown
}
