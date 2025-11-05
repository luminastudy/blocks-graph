import type { BlockGraph } from '../types/block-graph.js';
import type { PositionedBlock } from '../types/positioned-block.js';
import type { RendererConfig } from './renderer-config.js';
import { DEFAULT_RENDERER_CONFIG } from './default-renderer-config.js';

/**
 * SVG renderer for block graphs
 */
export class GraphRenderer {
  private config: RendererConfig;

  constructor(config: Partial<RendererConfig> = {}) {
    this.config = { ...DEFAULT_RENDERER_CONFIG, ...config };
  }

  /**
   * Update renderer configuration
   */
  updateConfig(config: Partial<RendererConfig>): void {
    this.config = { ...this.config, ...config };
  }

  /**
   * Render edges (connections between blocks)
   */
  private renderEdges(graph: BlockGraph, positioned: PositionedBlock[]): SVGGElement {
    const group = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    group.setAttribute('class', 'edges');

    const positionMap = new Map(positioned.map(pb => [pb.block.id, pb.position]));

    for (const edge of graph.edges) {
      const fromPos = positionMap.get(edge.from);
      const toPos = positionMap.get(edge.to);

      if (!fromPos || !toPos) {
        continue;
      }

      const shouldRender =
        (edge.type === 'prerequisite' && this.config.showPrerequisites) ||
        (edge.type === 'parent' && this.config.showParents);

      if (!shouldRender) {
        continue;
      }

      const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');

      // Connect from bottom center of source to top center of target
      line.setAttribute('x1', String(fromPos.x + fromPos.width / 2));
      line.setAttribute('y1', String(fromPos.y + fromPos.height));
      line.setAttribute('x2', String(toPos.x + toPos.width / 2));
      line.setAttribute('y2', String(toPos.y));

      const style = this.config.edgeStyle[edge.type];
      line.setAttribute('stroke', style.stroke);
      line.setAttribute('stroke-width', String(style.strokeWidth));

      if (style.dashArray) {
        line.setAttribute('stroke-dasharray', style.dashArray);
      }

      // Dim edge if either endpoint is dimmed
      const isFromDimmed = this.config.dimmedBlocks?.has(edge.from) ?? false;
      const isToDimmed = this.config.dimmedBlocks?.has(edge.to) ?? false;
      if (isFromDimmed || isToDimmed) {
        line.setAttribute('opacity', '0.3');
      }

      line.setAttribute('class', `edge edge-${edge.type}`);
      line.setAttribute('data-from', edge.from);
      line.setAttribute('data-to', edge.to);

      group.appendChild(line);
    }

    return group;
  }

  /**
   * Render blocks (nodes in the graph)
   */
  private renderBlocks(positioned: PositionedBlock[]): SVGGElement {
    const group = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    group.setAttribute('class', 'blocks');

    for (const { block, position } of positioned) {
      const blockGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
      blockGroup.setAttribute('class', 'block');
      blockGroup.setAttribute('data-id', block.id);

      // Determine visual state
      const isSelected = this.config.selectedBlockId === block.id;
      const isDimmed = this.config.dimmedBlocks?.has(block.id) ?? false;
      const opacity = isDimmed ? '0.3' : '1';

      // Render block rectangle
      const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
      rect.setAttribute('x', String(position.x));
      rect.setAttribute('y', String(position.y));
      rect.setAttribute('width', String(position.width));
      rect.setAttribute('height', String(position.height));
      rect.setAttribute('fill', this.config.blockStyle.fill);

      // Highlight selected block
      if (isSelected) {
        rect.setAttribute('stroke', '#4a90e2');
        rect.setAttribute('stroke-width', String(this.config.blockStyle.strokeWidth + 2));
        rect.setAttribute('filter', 'drop-shadow(0 0 8px rgba(74, 144, 226, 0.5))');
      } else {
        rect.setAttribute('stroke', this.config.blockStyle.stroke);
        rect.setAttribute('stroke-width', String(this.config.blockStyle.strokeWidth));
      }

      rect.setAttribute('rx', String(this.config.blockStyle.cornerRadius));
      rect.setAttribute('opacity', opacity);
      blockGroup.appendChild(rect);

      // Render block text
      const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      text.setAttribute('x', String(position.x + position.width / 2));
      text.setAttribute('y', String(position.y + position.height / 2));
      text.setAttribute('text-anchor', 'middle');
      text.setAttribute('dominant-baseline', 'middle');
      text.setAttribute('fill', this.config.textStyle.fill);
      text.setAttribute('font-size', String(this.config.textStyle.fontSize));
      text.setAttribute('font-family', this.config.textStyle.fontFamily);
      text.setAttribute('opacity', opacity);

      const title = this.config.language === 'he' ? block.title.he : block.title.en;
      text.textContent = title;
      blockGroup.appendChild(text);

      group.appendChild(blockGroup);
    }

    return group;
  }

  /**
   * Calculate the bounding box of all positioned blocks
   */
  private calculateViewBox(positioned: PositionedBlock[]): { x: number; y: number; width: number; height: number } {
    if (positioned.length === 0) {
      return { x: 0, y: 0, width: 800, height: 600 };
    }

    let minX = Number.POSITIVE_INFINITY;
    let minY = Number.POSITIVE_INFINITY;
    let maxX = Number.NEGATIVE_INFINITY;
    let maxY = Number.NEGATIVE_INFINITY;

    for (const { position } of positioned) {
      minX = Math.min(minX, position.x);
      minY = Math.min(minY, position.y);
      maxX = Math.max(maxX, position.x + position.width);
      maxY = Math.max(maxY, position.y + position.height);
    }

    const padding = 40;
    return {
      x: minX - padding,
      y: minY - padding,
      width: maxX - minX + 2 * padding,
      height: maxY - minY + 2 * padding,
    };
  }

  /**
   * Render the complete graph to an SVG element
   */
  render(graph: BlockGraph, positioned: PositionedBlock[]): SVGSVGElement {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('xmlns', 'http://www.w3.org/2000/svg');

    // Calculate and set viewBox
    const viewBox = this.calculateViewBox(positioned);
    svg.setAttribute('viewBox', `${viewBox.x} ${viewBox.y} ${viewBox.width} ${viewBox.height}`);
    svg.setAttribute('width', '100%');
    svg.setAttribute('height', '100%');

    // Render edges first (so they appear behind blocks)
    const edgesGroup = this.renderEdges(graph, positioned);
    svg.appendChild(edgesGroup);

    // Render blocks
    const blocksGroup = this.renderBlocks(positioned);
    svg.appendChild(blocksGroup);

    return svg;
  }
}
