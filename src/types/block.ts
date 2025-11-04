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

/**
 * Position information for a block in the graph
 */
export interface BlockPosition {
  x: number;
  y: number;
  width: number;
  height: number;
}

/**
 * Positioned block combining block data with layout information
 */
export interface PositionedBlock {
  block: Block;
  position: BlockPosition;
}

/**
 * Graph edge representing a relationship between blocks
 */
export interface GraphEdge {
  from: string;
  to: string;
  type: 'prerequisite' | 'parent';
}

/**
 * Complete graph structure with blocks and edges
 */
export interface BlockGraph {
  blocks: Map<string, Block>;
  edges: GraphEdge[];
}
