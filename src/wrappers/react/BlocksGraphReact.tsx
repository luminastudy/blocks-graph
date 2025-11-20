import { useEffect, useRef, type CSSProperties } from 'react'
import type { Block } from '../../types/block.js'
import type { BlockSchemaV01 } from '../../adaptors/v0.1/types.js'
import type { BlocksGraph } from '../../components/blocks-graph.js'
import type { EdgeLineStyle } from '../../types/edge-style.js'

// Import the web component to ensure it's registered
import '../../index.js'

export interface BlocksGraphProps {
  // Data props
  blocks?: Block[]
  blocksV01?: BlockSchemaV01[]
  jsonUrl?: string

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
 * import { BlocksGraphReact } from '@luminastudy/blocks-graph/react';
 *
 * function App() {
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
  blocksV01,
  jsonUrl,
  language = 'en',
  orientation = 'ttb',
  showPrerequisites = true,
  nodeWidth,
  nodeHeight,
  horizontalSpacing,
  verticalSpacing,
  prerequisiteLineStyle = 'dashed',
  parentLineStyle = 'straight',
  onBlocksRendered,
  onBlockSelected,
  className,
  style,
}: BlocksGraphProps) {
  const ref = useRef<BlocksGraph>(null)

  // Load data when blocks change
  useEffect(() => {
    if (!ref.current) return

    if (blocks) {
      // Set internal format directly
      ref.current.setBlocks(blocks)
    } else if (blocksV01) {
      // Convert from v0.1 schema
      ref.current.loadFromJson(JSON.stringify(blocksV01), 'v0.1')
    } else if (jsonUrl) {
      // Load from URL
      ref.current.loadFromUrl(jsonUrl, 'v0.1').catch(console.error)
    }
  }, [blocks, blocksV01, jsonUrl])

  // Sync configuration props
  useEffect(() => {
    if (!ref.current) return
    ref.current.language = language
  }, [language])

  useEffect(() => {
    if (!ref.current) return
    ref.current.orientation = orientation
  }, [orientation])

  useEffect(() => {
    if (!ref.current) return
    ref.current.showPrerequisites = showPrerequisites
  }, [showPrerequisites])

  // Sync layout props
  useEffect(() => {
    if (!ref.current) return
    if (nodeWidth !== undefined) {
      ref.current.setAttribute('node-width', String(nodeWidth))
    }
  }, [nodeWidth])

  useEffect(() => {
    if (!ref.current) return
    if (nodeHeight !== undefined) {
      ref.current.setAttribute('node-height', String(nodeHeight))
    }
  }, [nodeHeight])

  useEffect(() => {
    if (!ref.current) return
    if (horizontalSpacing !== undefined) {
      ref.current.setAttribute('horizontal-spacing', String(horizontalSpacing))
    }
  }, [horizontalSpacing])

  useEffect(() => {
    if (!ref.current) return
    if (verticalSpacing !== undefined) {
      ref.current.setAttribute('vertical-spacing', String(verticalSpacing))
    }
  }, [verticalSpacing])

  // Sync edge style props
  useEffect(() => {
    if (!ref.current) return
    ref.current.prerequisiteLineStyle = prerequisiteLineStyle
  }, [prerequisiteLineStyle])

  useEffect(() => {
    if (!ref.current) return
    ref.current.parentLineStyle = parentLineStyle
  }, [parentLineStyle])

  // Event listeners
  useEffect(() => {
    const element = ref.current
    if (!element || !onBlocksRendered) return

    const handler = (event: Event) => {
      onBlocksRendered(event as CustomEvent)
    }

    element.addEventListener('blocks-rendered', handler)
    return () => element.removeEventListener('blocks-rendered', handler)
  }, [onBlocksRendered])

  useEffect(() => {
    const element = ref.current
    if (!element || !onBlockSelected) return

    const handler = (event: Event) => {
      onBlockSelected(event as CustomEvent)
    }

    element.addEventListener('block-selected', handler)
    return () => element.removeEventListener('block-selected', handler)
  }, [onBlockSelected])

  return (
    <blocks-graph
      ref={ref}
      class={className}
      // @ts-expect-error - React CSSProperties type conflicts with DOM CSSStyleDeclaration
      style={style}
    />
  )
}
