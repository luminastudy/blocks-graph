/**
 * Graph edge representing a relationship between blocks
 */
export interface GraphEdge {
  from: string
  to: string
  type: 'prerequisite' | 'parent'
}
