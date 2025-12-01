import type { BlockGraph } from '../types/block-graph.js'
import type { PositionedBlock } from '../types/positioned-block.js'
import { edgeLineStyleToDashArray } from '../types/edge-line-style-to-dash-array.js'
import type { RendererConfig } from './renderer-config.js'
import { DEFAULT_RENDERER_CONFIG } from './default-renderer-config.js'
import { calculateViewBox } from './calculate-view-box.js'
import { calculateConnectionPoints } from './calculate-connection-points.js'
import { createBlockRect } from './create-block-rect.js'
import { createBlockText } from './create-block-text.js'
import { createExternalIcon } from './create-external-icon.js'

/**
 * SVG renderer for block graphs
 */
export class GraphRenderer {
  private config: RendererConfig

  constructor(config?: Partial<RendererConfig>) {
    const configToUse = config !== undefined ? config : {}
    this.config = { ...DEFAULT_RENDERER_CONFIG, ...configToUse }
  }

  updateConfig(config: Partial<RendererConfig>): void {
    this.config = { ...this.config, ...config }
  }

  private renderEdges(
    graph: BlockGraph,
    positioned: PositionedBlock[]
  ): SVGGElement {
    const group = document.createElementNS('http://www.w3.org/2000/svg', 'g')
    group.setAttribute('class', 'edges')

    const positionMap = new Map(
      positioned.map(pb => [pb.block.id, pb.position])
    )
    const orientation =
      this.config.orientation !== undefined ? this.config.orientation : 'ttb'

    for (const edge of graph.edges) {
      const fromPos = positionMap.get(edge.from)
      const toPos = positionMap.get(edge.to)
      if (!fromPos || !toPos) continue

      const shouldRender =
        edge.type === 'prerequisite' && this.config.showPrerequisites
      if (!shouldRender) continue

      const line = document.createElementNS(
        'http://www.w3.org/2000/svg',
        'line'
      )

      const { x1, y1, x2, y2 } = calculateConnectionPoints(
        fromPos,
        toPos,
        orientation
      )

      line.setAttribute('x1', String(x1))
      line.setAttribute('y1', String(y1))
      line.setAttribute('x2', String(x2))
      line.setAttribute('y2', String(y2))

      const style = this.config.edgeStyle.prerequisite
      line.setAttribute('stroke', style.stroke)
      line.setAttribute('stroke-width', String(style.strokeWidth))

      const dashArray =
        style.lineStyle !== undefined
          ? edgeLineStyleToDashArray(style.lineStyle)
          : style.dashArray
      if (dashArray) {
        line.setAttribute('stroke-dasharray', dashArray)
      }

      const isFromDimmed = this.config.dimmedBlocks
        ? this.config.dimmedBlocks.has(edge.from)
        : false
      const isToDimmed = this.config.dimmedBlocks
        ? this.config.dimmedBlocks.has(edge.to)
        : false
      if (isFromDimmed || isToDimmed) {
        line.setAttribute('opacity', '0.3')
      }

      line.setAttribute('class', `edge edge-${edge.type}`)
      line.setAttribute('data-from', edge.from)
      line.setAttribute('data-to', edge.to)
      group.appendChild(line)
    }

    return group
  }

  private renderBlocks(positioned: PositionedBlock[]): SVGGElement {
    const group = document.createElementNS('http://www.w3.org/2000/svg', 'g')
    group.setAttribute('class', 'blocks')

    for (const { block, position } of positioned) {
      const blockGroup = document.createElementNS(
        'http://www.w3.org/2000/svg',
        'g'
      )
      blockGroup.setAttribute('class', 'block')
      blockGroup.setAttribute('data-id', block.id)

      // Check if this is an external block
      const isExternal = block._external === true
      const externalPlatform =
        typeof block._externalPlatform === 'string'
          ? block._externalPlatform
          : undefined

      if (isExternal) {
        blockGroup.setAttribute('data-external', 'true')
        if (externalPlatform) {
          blockGroup.setAttribute('data-external-platform', externalPlatform)
        }
      }

      const isSelected = this.config.selectedBlockId === block.id
      const isDimmed = this.config.dimmedBlocks
        ? this.config.dimmedBlocks.has(block.id)
        : false
      const opacity = isDimmed ? '0.3' : '1'

      const rect = createBlockRect(
        position,
        isSelected,
        opacity,
        this.config.blockStyle
      )
      blockGroup.appendChild(rect)

      const title =
        this.config.language === 'he' ? block.title.he : block.title.en
      const { text, isTruncated, lineCount } = createBlockText(
        title,
        position,
        opacity,
        this.config.textStyle
      )
      blockGroup.appendChild(text)

      // Add external icon if this block references an external repository
      if (isExternal) {
        const platformName =
          externalPlatform !== undefined ? externalPlatform : 'unknown'
        const icon = createExternalIcon(position, platformName, opacity)
        blockGroup.appendChild(icon)
      }

      if (isTruncated || lineCount > 1) {
        const titleElement = document.createElementNS(
          'http://www.w3.org/2000/svg',
          'title'
        )
        titleElement.textContent = title
        blockGroup.appendChild(titleElement)
      }
      group.appendChild(blockGroup)
    }

    return group
  }

  render(graph: BlockGraph, positioned: PositionedBlock[]): SVGSVGElement {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
    svg.setAttribute('xmlns', 'http://www.w3.org/2000/svg')

    const viewBox = calculateViewBox(positioned)
    svg.setAttribute(
      'viewBox',
      `${viewBox.x} ${viewBox.y} ${viewBox.width} ${viewBox.height}`
    )
    svg.setAttribute('width', '100%')
    svg.setAttribute('height', '100%')

    const edgesGroup = this.renderEdges(graph, positioned)
    svg.appendChild(edgesGroup)

    const blocksGroup = this.renderBlocks(positioned)
    svg.appendChild(blocksGroup)

    return svg
  }
}
