import { useEffect, useRef, type CSSProperties } from 'react'
import type { Block } from '../../types/block.js'
import type { BlockSchemaV01 } from '../../adaptors/v0.1/types.js'
import type { BlocksGraph } from '../../components/blocks-graph.js'
import type { EdgeLineStyle } from '../../types/edge-style.js'

// Import the web component to ensure it's registered
import '../../index.js'

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

  // Helper to detect if blocks are in v0.1 schema format
  const isV01Format = (data: unknown[]): data is BlockSchemaV01[] => {
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

  // Load data when blocks change
  useEffect(() => {
    if (!ref.current) return

    if (blocks) {
      // Auto-detect schema version if not explicitly internal format
      const isV01 = schemaVer === 'v0.1' && isV01Format(blocks)

      if (isV01) {
        // Convert from v0.1 schema - blocks is BlockSchemaV01[] here
        ref.current.loadFromJson(JSON.stringify(blocks), 'v0.1')
      } else {
        // Set internal format directly
        // TypeScript can't narrow union types across control flow branches
        // We've verified it's not v0.1 format, so it must be Block[]
        // @ts-expect-error - Type guard doesn't narrow union for TypeScript
        ref.current.setBlocks(blocks)
      }
    } else if (jsonUrl) {
      // Load from URL (defaults to v0.1)
      ref.current.loadFromUrl(jsonUrl, 'v0.1').catch(console.error)
    }
  }, [blocks, jsonUrl, schemaVer])

  // Sync configuration props
  useEffect(() => {
    if (!ref.current) return
    ref.current.language = lang
  }, [lang])

  useEffect(() => {
    if (!ref.current) return
    ref.current.orientation = orient
  }, [orient])

  useEffect(() => {
    if (!ref.current) return
    ref.current.showPrerequisites = showPrereq
  }, [showPrereq])

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
    ref.current.prerequisiteLineStyle = prereqStyle
  }, [prereqStyle])

  useEffect(() => {
    if (!ref.current) return
    ref.current.parentLineStyle = parentStyle
  }, [parentStyle])

  // Event listeners
  useEffect(() => {
    const element = ref.current
    if (!element || !onBlocksRendered) return

    const handler = (event: Event) => {
      if (event instanceof CustomEvent) {
        onBlocksRendered(event)
      }
    }

    element.addEventListener('blocks-rendered', handler)
    return () => element.removeEventListener('blocks-rendered', handler)
  }, [onBlocksRendered])

  useEffect(() => {
    const element = ref.current
    if (!element || !onBlockSelected) return

    const handler = (event: Event) => {
      if (event instanceof CustomEvent) {
        onBlockSelected(event)
      }
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
