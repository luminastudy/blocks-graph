/**
 * JSX type declarations for Web Components used in React
 */

import type { BlocksGraph } from '../../components/blocks-graph.js'

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'blocks-graph': Partial<BlocksGraph> & {
        ref?: React.Ref<BlocksGraph>
        className?: string
        style?: React.CSSProperties | string
      }
    }
  }
}

export {}
