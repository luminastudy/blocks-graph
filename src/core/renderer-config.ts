/**
 * Renderer configuration
 */
export interface RendererConfig {
  language: 'en' | 'he';
  showPrerequisites: boolean;
  showParents: boolean;
  selectedBlockId?: string | null;
  visibleBlocks?: Set<string>;
  dimmedBlocks?: Set<string>;
  blockStyle: {
    fill: string;
    stroke: string;
    strokeWidth: number;
    cornerRadius: number;
  };
  textStyle: {
    fontSize: number;
    fill: string;
    fontFamily: string;
    maxLines?: number;
    lineHeight?: number;
    horizontalPadding?: number;
  };
  edgeStyle: {
    prerequisite: {
      stroke: string;
      strokeWidth: number;
      dashArray?: string;
    };
    parent: {
      stroke: string;
      strokeWidth: number;
      dashArray?: string;
    };
  };
}
