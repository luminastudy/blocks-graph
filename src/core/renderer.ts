import type { BlockGraph } from '../types/block-graph.js'
import type { PositionedBlock } from '../types/positioned-block.js'
import type { BlockPosition } from '../types/block-position.js'
import type { Orientation } from '../types/orientation.js'
import { edgeLineStyleToDashArray } from '../types/edge-line-style-to-dash-array.js'
import type { RendererConfig } from './renderer-config.js'
import { DEFAULT_RENDERER_CONFIG } from './default-renderer-config.js'
import { wrapTextToLines } from './text-wrapper.js'
import { calculateViewBox } from './calculate-view-box.js'

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

  private calculateConnectionPoints(
    fromPos: BlockPosition,
    toPos: BlockPosition,
    orientation: Orientation
  ): { x1: number; y1: number; x2: number; y2: number } {
    switch (orientation) {
      case 'ttb':
        return {
          x1: fromPos.x + fromPos.width / 2,
          y1: fromPos.y + fromPos.height,
          x2: toPos.x + toPos.width / 2,
          y2: toPos.y,
        }
      case 'btt':
        return {
          x1: fromPos.x + fromPos.width / 2,
          y1: fromPos.y,
          x2: toPos.x + toPos.width / 2,
          y2: toPos.y + toPos.height,
        }
      case 'ltr':
        return {
          x1: fromPos.x + fromPos.width,
          y1: fromPos.y + fromPos.height / 2,
          x2: toPos.x,
          y2: toPos.y + toPos.height / 2,
        }
      case 'rtl':
        return {
          x1: fromPos.x,
          y1: fromPos.y + fromPos.height / 2,
          x2: toPos.x + toPos.width,
          y2: toPos.y + toPos.height / 2,
        }
    }
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

      const { x1, y1, x2, y2 } = this.calculateConnectionPoints(
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

  private createBlockRect(
    position: BlockPosition,
    isSelected: boolean,
    opacity: string
  ): SVGRectElement {
    const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect')
    rect.setAttribute('x', String(position.x))
    rect.setAttribute('y', String(position.y))
    rect.setAttribute('width', String(position.width))
    rect.setAttribute('height', String(position.height))
    rect.setAttribute('fill', this.config.blockStyle.fill)
    if (isSelected) {
      rect.setAttribute('stroke', '#4a90e2')
      rect.setAttribute(
        'stroke-width',
        String(this.config.blockStyle.strokeWidth + 2)
      )
      rect.setAttribute(
        'filter',
        'drop-shadow(0 0 8px rgba(74, 144, 226, 0.5))'
      )
    } else {
      rect.setAttribute('stroke', this.config.blockStyle.stroke)
      rect.setAttribute(
        'stroke-width',
        String(this.config.blockStyle.strokeWidth)
      )
    }
    rect.setAttribute('rx', String(this.config.blockStyle.cornerRadius))
    rect.setAttribute('opacity', opacity)
    return rect
  }

  private createBlockText(
    title: string,
    position: BlockPosition,
    opacity: string
  ): { text: SVGTextElement; isTruncated: boolean; lineCount: number } {
    const fontSize = this.config.textStyle.fontSize
    const fontFamily = this.config.textStyle.fontFamily
    const lineHeight =
      this.config.textStyle.lineHeight !== undefined
        ? this.config.textStyle.lineHeight
        : 1.2
    const horizontalPadding =
      this.config.textStyle.horizontalPadding !== undefined
        ? this.config.textStyle.horizontalPadding
        : 10
    const maxLines =
      this.config.textStyle.maxLines !== undefined
        ? this.config.textStyle.maxLines
        : 3
    const maxTextWidth = position.width - 2 * horizontalPadding

    const { lines, isTruncated } = wrapTextToLines(
      title,
      maxTextWidth,
      fontSize,
      fontFamily,
      maxLines
    )

    const text = document.createElementNS('http://www.w3.org/2000/svg', 'text')
    text.setAttribute('x', String(position.x + position.width / 2))
    text.setAttribute('text-anchor', 'middle')
    text.setAttribute('fill', this.config.textStyle.fill)
    text.setAttribute('font-size', String(fontSize))
    text.setAttribute('font-family', fontFamily)
    text.setAttribute('opacity', opacity)

    const totalTextHeight = lines.length * fontSize * lineHeight
    const startY =
      position.y + position.height / 2 - totalTextHeight / 2 + fontSize / 2

    lines.forEach((line, index) => {
      const tspan = document.createElementNS(
        'http://www.w3.org/2000/svg',
        'tspan'
      )
      tspan.setAttribute('x', String(position.x + position.width / 2))
      tspan.setAttribute('y', String(startY + index * fontSize * lineHeight))
      tspan.setAttribute('dominant-baseline', 'middle')
      tspan.textContent = line
      text.appendChild(tspan)
    })

    return { text, isTruncated, lineCount: lines.length }
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

      const isSelected = this.config.selectedBlockId === block.id
      const isDimmed = this.config.dimmedBlocks
        ? this.config.dimmedBlocks.has(block.id)
        : false
      const opacity = isDimmed ? '0.3' : '1'

      const rect = this.createBlockRect(position, isSelected, opacity)
      blockGroup.appendChild(rect)

      const title =
        this.config.language === 'he' ? block.title.he : block.title.en
      const { text, isTruncated, lineCount } = this.createBlockText(
        title,
        position,
        opacity
      )
      blockGroup.appendChild(text)

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
