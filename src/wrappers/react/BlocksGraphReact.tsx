import { useEffect, useRef, type CSSProperties, type RefObject } from 'react'
import type { Block } from '../../types/block.js'
import type { BlockSchemaV01 } from '../../adaptors/v0.1/types.js'
import type { BlocksGraph } from '../../components/blocks-graph.js'
import type { EdgeLineStyle } from '../../types/edge-style.js'
import type { BlocksGraphBaseConfig } from '../blocks-graph-base-config.js'
import type { BlocksRenderedEvent } from '../blocks-rendered-event.js'
import type { BlockSelectedEvent } from '../block-selected-event.js'
import { DEFAULT_CONFIG } from '../default-config.js'

// Import the web component to ensure it's registered
import '../../index.js'

// Custom hook for data loading
// The BlocksGraph component now auto-detects schema versions
function useBlocksGraphData(
  ref: RefObject<BlocksGraph | null>,
  blocks: Block[] | BlockSchemaV01[] | undefined,
  jsonUrl: string | undefined
) {
  useEffect(() => {
    if (!ref.current) return
    if (blocks) {
      // Auto-detection handled by BlocksGraph.setBlocks()
      ref.current.setBlocks(blocks)
    }
  }, [ref, blocks, jsonUrl])
}

// Custom hook for configuration props
function useBlocksGraphConfig(
  ref: RefObject<BlocksGraph | null>,
  lang: 'en' | 'he',
  orient: 'ttb' | 'ltr' | 'rtl' | 'btt',
  showPrereq: boolean,
  prereqStyle: EdgeLineStyle
) {
  useEffect(() => {
    if (!ref.current) return
    ref.current.language = lang
  }, [ref, lang])
  useEffect(() => {
    if (!ref.current) return
    ref.current.orientation = orient
  }, [ref, orient])
  useEffect(() => {
    if (!ref.current) return
    ref.current.showPrerequisites = showPrereq
  }, [ref, showPrereq])
  useEffect(() => {
    if (!ref.current) return
    ref.current.prerequisiteLineStyle = prereqStyle
  }, [ref, prereqStyle])
}

// Custom hook for layout props
function useBlocksGraphLayout(
  ref: RefObject<BlocksGraph | null>,
  nodeWidth: number | undefined,
  nodeHeight: number | undefined,
  horizontalSpacing: number | undefined,
  verticalSpacing: number | undefined,
  maxNodesPerLevel: number | undefined
) {
  useEffect(() => {
    if (!ref.current) return
    if (nodeWidth !== undefined) {
      ref.current.setAttribute('node-width', String(nodeWidth))
    }
  }, [ref, nodeWidth])
  useEffect(() => {
    if (!ref.current) return
    if (nodeHeight !== undefined) {
      ref.current.setAttribute('node-height', String(nodeHeight))
    }
  }, [ref, nodeHeight])
  useEffect(() => {
    if (!ref.current) return
    if (horizontalSpacing !== undefined) {
      ref.current.setAttribute('horizontal-spacing', String(horizontalSpacing))
    }
  }, [ref, horizontalSpacing])
  useEffect(() => {
    if (!ref.current) return
    if (verticalSpacing !== undefined) {
      ref.current.setAttribute('vertical-spacing', String(verticalSpacing))
    }
  }, [ref, verticalSpacing])
  useEffect(() => {
    if (!ref.current) return
    if (maxNodesPerLevel !== undefined) {
      ref.current.setAttribute('max-nodes-per-level', String(maxNodesPerLevel))
    }
  }, [ref, maxNodesPerLevel])
}

// Custom hook for event listeners
function useBlocksGraphEvents(
  ref: RefObject<BlocksGraph | null>,
  onBlocksRendered:
    | ((event: CustomEvent<{ blockCount: number }>) => void)
    | undefined,
  onBlockSelected:
    | ((
        event: CustomEvent<{
          blockId: string | null
          selectionLevel: number
          navigationStack: string[]
        }>
      ) => void)
    | undefined
) {
  useEffect(() => {
    const element = ref.current
    if (!element || !onBlocksRendered) return
    const handler = (e: Event) => {
      // Event is actually CustomEvent from web component
      // @ts-expect-error - Web component dispatches CustomEvent but typed as Event
      onBlocksRendered(e)
    }
    element.addEventListener('blocks-rendered', handler)
    return () => {
      element.removeEventListener('blocks-rendered', handler)
    }
  }, [ref, onBlocksRendered])
  useEffect(() => {
    const element = ref.current
    if (!element || !onBlockSelected) return
    const handler = (e: Event) => {
      // Event is actually CustomEvent from web component
      // @ts-expect-error - Web component dispatches CustomEvent but typed as Event
      onBlockSelected(e)
    }
    element.addEventListener('block-selected', handler)
    return () => {
      element.removeEventListener('block-selected', handler)
    }
  }, [ref, onBlockSelected])
}

export interface BlocksGraphProps extends BlocksGraphBaseConfig {
  /**
   * @deprecated Schema version is now auto-detected. This prop is ignored.
   */
  schemaVersion?: 'v0.1' | 'internal'

  // Event callbacks
  onBlocksRendered?: (event: CustomEvent<BlocksRenderedEvent>) => void
  onBlockSelected?: (event: CustomEvent<BlockSelectedEvent>) => void

  // Standard props
  className?: string
  style?: CSSProperties
}

/**
 * React wrapper component for the blocks-graph Web Component.
 * Provides a clean React API without needing refs.
 *
 * The `blocks` prop accepts both internal Block[] format and v0.1 schema format.
 * Schema version is automatically detected - no need to specify it manually.
 *
 * @example
 * ```tsx
 * import { BlocksGraphReact } from '@lumina-study/blocks-graph/react';
 *
 * function App() {
 *   // Blocks can be in internal format or v0.1 schema format
 *   // The component auto-detects the format
 *   const blocks = [
 *     {
 *       id: 'uuid',
 *       title: { he: 'כותרת', en: 'Title' }, // Internal format
 *       prerequisites: [],
 *       parents: []
 *     }
 *   ];
 *
 *   return (
 *     <BlocksGraphReact
 *       blocks={blocks}
 *       language="en"
 *       orientation="ttb"
 *       onBlockSelected={(e) => console.log(e.detail)}
 *     />
 *   );
 *   }
 * }
 * ```
 */
export function BlocksGraphReact({
  blocks,
  jsonUrl,
  language,
  orientation,
  showPrerequisites,
  nodeWidth,
  nodeHeight,
  horizontalSpacing,
  verticalSpacing,
  maxNodesPerLevel,
  prerequisiteLineStyle,
  onBlocksRendered,
  onBlockSelected,
  className,
  style,
}: BlocksGraphProps) {
  const lang = language !== undefined ? language : DEFAULT_CONFIG.language
  const orient =
    orientation !== undefined ? orientation : DEFAULT_CONFIG.orientation
  const showPrereq =
    showPrerequisites !== undefined
      ? showPrerequisites
      : DEFAULT_CONFIG.showPrerequisites
  const prereqStyle =
    prerequisiteLineStyle !== undefined
      ? prerequisiteLineStyle
      : DEFAULT_CONFIG.prerequisiteLineStyle
  const ref = useRef<BlocksGraph>(null)
  useBlocksGraphData(ref, blocks, jsonUrl)
  useBlocksGraphConfig(ref, lang, orient, showPrereq, prereqStyle)
  useBlocksGraphLayout(
    ref,
    nodeWidth,
    nodeHeight,
    horizontalSpacing,
    verticalSpacing,
    maxNodesPerLevel
  )
  useBlocksGraphEvents(ref, onBlocksRendered, onBlockSelected)

  return (
    // @ts-expect-error - Web Component is not in JSX.IntrinsicElements
    <blocks-graph ref={ref} class={className} style={style} />
  )
}
