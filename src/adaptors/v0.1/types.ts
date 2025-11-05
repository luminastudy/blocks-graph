/**
 * Block schema v0.1
 */

import type { BlockTitle } from './block-title.js';

export interface BlockSchemaV01 {
  id: string;
  title: BlockTitle;
  prerequisites: string[];
  parents: string[];
  // Allow for additional properties as schema permits
  [key: string]: unknown;
}
