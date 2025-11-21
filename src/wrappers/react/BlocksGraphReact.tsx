import { useEffect, useRef, type CSSProperties, type RefObject } from 'react'
import type { Block } from '../../types/block.js'
import type { BlockSchemaV01 } from '../../adaptors/v0.1/types.js'
import type { BlocksGraph } from '../../components/blocks-graph.js'
import type { EdgeLineStyle } from '../../types/edge-style.js'

// Import the web component to ensure it's registered
import '../../index.js'

// Helper to detect if blocks are in v0.1 schema format
function isV01Format(data: unknown[]): data is BlockSchemaV01[] {
  if (data.length === 0) return false
  const firstBlock = data[0]
  if (typeof firstBlock !== 'object' || firstBlock === null) return false
  if (!('title' in firstBlock)) return false
  const title = firstBlock.title
  return (
    typeof title === 'object' &&
    title !== null &&
    'he_text' in title &&
    'en_text' in title
  )
}

// Custom hook for data loading
function useBlocksGraphData(
  ref: RefObject<BlocksGraph>,
  blocks: Block[] | BlockSchemaV01[] | undefined,
  jsonUrl: string | undefined,
  schemaVer: 'v0.1' | 'internal'
) {
  useEffect(() => {
    if (!ref.current) return
    if (blocks) {
      const isV01 = schemaVer === 'v0.1' && isV01Format(blocks)
      if (isV01) {
        ref.current.loadFromJson(JSON.stringify(blocks), 'v0.1')
      } else {
        // @ts-expect-error - Type guard doesn't narrow union for TypeScript
        ref.current.setBlocks(blocks)
      }
    } else if (jsonUrl) {
      ref.current.loadFromUrl(jsonUrl, 'v0.1').catch(console.error)
    }
  }, [ref, blocks, jsonUrl, schemaVer])
}

// Custom hook for configuration props
function useBlocksGraphConfig(
  ref: RefObject<BlocksGraph>,
  lang: 'en' | 'he',
  orient: 'ttb' | 'ltr' | 'rtl' | 'btt',
  showPrereq: boolean,
  prereqStyle: EdgeLineStyle,
  parentStyle: EdgeLineStyle
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
  useEffect(() => {
    if (!ref.current) return
    ref.current.parentLineStyle = parentStyle
  }, [ref, parentStyle])
}

// Custom hook for layout props
function useBlocksGraphLayout(
  ref: RefObject<BlocksGraph>,
  nodeWidth: number | undefined,
  nodeHeight: number | undefined,
  horizontalSpacing: number | undefined,
  verticalSpacing: number | undefined
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
}

// Custom hook for event listeners
function useBlocksGraphEvents(
  ref: RefObject<BlocksGraph>,
  onBlocksRendered:
    | ((event: CustomEvent<{ blockCount: number }>) => void)
    | undefined,
  onBlockSelected:
    | ((
        event: CustomEvent<{ blockId: string | null; selectionLevel: number }>
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

export interface BlocksGraphProps {
  // Data props
  blocks?: Block[] | BlockSchemaV01[]
  jsonUrl?: string
  schemaVersion?: 'v0.1' | 'internal'

  // Configuration props
  language?: 'en' | 'he'
  orientation?: 'ttb' | 'ltr' | 'rtl' | 'btt'
  showPrerequisites?: boolean
  nodeWidth?: number
  nodeHeight?: number
  horizontalSpacing?: number
  verticalSpacing?: number

  // Edge style props
  prerequisiteLineStyle?: EdgeLineStyle
  parentLineStyle?: EdgeLineStyle

  // Event callbacks
  onBlocksRendered?: (event: CustomEvent<{ blockCount: number }>) => void
  onBlockSelected?: (
    event: CustomEvent<{ blockId: string | null; selectionLevel: number }>
  ) => void

  // Standard props
  className?: string
  style?: CSSProperties
}

/**
 * React wrapper component for the blocks-graph Web Component.
 * Provides a clean React API without needing refs.
 *
 * @example
 * ```tsx
 * import { BlocksGraphReact } from '@lumina-study/blocks-graph/react';
 *
 * function App() {
 *   // Blocks can be in internal format or v0.1 schema format
 *   // The component auto-detects the format
 *   const blocks = [...];
 *
 *   return (
 *     <BlocksGraphReact
 *       blocks={blocks}
 *       language="en"
 *       orientation="ttb"
 *       onBlockSelected={(e) => console.log(e.detail)}
 *     />
 *   );
 * }
 * ```
 */
export function BlocksGraphReact({
  blocks,
  jsonUrl,
  schemaVersion,
  language,
  orientation,
  showPrerequisites,
  nodeWidth,
  nodeHeight,
  horizontalSpacing,
  verticalSpacing,
  prerequisiteLineStyle,
  parentLineStyle,
  onBlocksRendered,
  onBlockSelected,
  className,
  style,
}: BlocksGraphProps) {
  const schemaVer = schemaVersion !== undefined ? schemaVersion : 'v0.1'
  const lang = language !== undefined ? language : 'en'
  const orient = orientation !== undefined ? orientation : 'ttb'
  const showPrereq = showPrerequisites !== undefined ? showPrerequisites : true
  const prereqStyle =
    prerequisiteLineStyle !== undefined ? prerequisiteLineStyle : 'dashed'
  const parentStyle =
    parentLineStyle !== undefined ? parentLineStyle : 'straight'
  const ref = useRef<BlocksGraph>(null)
  useBlocksGraphData(ref, blocks, jsonUrl, schemaVer)
  useBlocksGraphConfig(ref, lang, orient, showPrereq, prereqStyle, parentStyle)
  useBlocksGraphLayout(
    ref,
    nodeWidth,
    nodeHeight,
    horizontalSpacing,
    verticalSpacing
  )
  useBlocksGraphEvents(ref, onBlocksRendered, onBlockSelected)

  return (
    <blocks-graph
      ref={ref}
      class={className}
      // @ts-expect-error - React CSSProperties type conflicts with DOM CSSStyleDeclaration
      style={style}
    />
  )
}
