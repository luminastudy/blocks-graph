/**
 * Internal representation of a block in the graph
 */
export interface Block {
  id: string;
  title: {
    he: string;
    en: string;
  };
  prerequisites: string[];
  parents: string[];
  // Allow for extension properties
  [key: string]: unknown;
}
