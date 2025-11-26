import {
  defineComponent,
  ref,
  onMounted,
  watch,
  h,
  type PropType,
  type CSSProperties,
} from 'vue'
import type { Block } from '../../types/block.js'
import type { BlockSchemaV01 } from '../../adaptors/v0.1/types.js'
import type { BlocksGraph } from '../../components/blocks-graph.js'
import type { EdgeLineStyle } from '../../types/edge-style.js'
import type { BlocksRenderedEvent } from '../blocks-rendered-event.js'
import type { BlockSelectedEvent } from '../block-selected-event.js'
import { DEFAULT_CONFIG } from '../default-config.js'

// Import the web component to ensure it's registered
import '../../index.js'

/**
 * Vue wrapper component for the blocks-graph Web Component.
 * Provides a clean Vue API with props and events.
 *
 * The `blocks` prop accepts both internal Block[] format and v0.1 schema format.
 * Schema version is automatically detected - no need to specify it manually.
 *
 * @example
 * ```vue
 * <template>
 *   <BlocksGraphVue
 *     :blocks="blocks"
 *     language="en"
 *     orientation="ttb"
 *     @block-selected="handleBlockSelected"
 *   />
 * </template>
 *
 * <script setup lang="ts">
 * import { BlocksGraphVue } from '@lumina-study/blocks-graph/vue';
 * import type { Block } from '@lumina-study/blocks-graph';
 *
 * // Blocks can be in internal format or v0.1 schema format (auto-detected)
 * const blocks: Block[] = [
 *   {
 *     id: 'uuid',
 *     title: { he: 'כותרת', en: 'Title' },
 *     prerequisites: [],
 *     parents: []
 *   }
 * ];
 *
 * function handleBlockSelected(event: BlockSelectedEvent) {
 *   console.log(event.blockId, event.selectionLevel);
 * }
 * </script>
 * ```
 */
export const BlocksGraphVue = defineComponent({
  name: 'BlocksGraphVue',
  props: {
    // Data props
    blocks: {
      type: Array as PropType<Block[] | BlockSchemaV01[]>,
      default: undefined,
    },
    jsonUrl: {
      type: String,
      default: undefined,
    },
    /**
     * @deprecated Schema version is now auto-detected. This prop is ignored.
     */
    schemaVersion: {
      type: String as PropType<'v0.1' | 'internal'>,
      default: 'v0.1',
    },

    // Configuration props
    language: {
      type: String as PropType<'en' | 'he'>,
      default: DEFAULT_CONFIG.language,
    },
    orientation: {
      type: String as PropType<'ttb' | 'ltr' | 'rtl' | 'btt'>,
      default: DEFAULT_CONFIG.orientation,
    },
    showPrerequisites: {
      type: Boolean,
      default: DEFAULT_CONFIG.showPrerequisites,
    },
    nodeWidth: {
      type: Number,
      default: undefined,
    },
    nodeHeight: {
      type: Number,
      default: undefined,
    },
    horizontalSpacing: {
      type: Number,
      default: undefined,
    },
    verticalSpacing: {
      type: Number,
      default: undefined,
    },
    maxNodesPerLevel: {
      type: Number,
      default: undefined,
    },

    // Edge style props
    prerequisiteLineStyle: {
      type: String as PropType<EdgeLineStyle>,
      default: DEFAULT_CONFIG.prerequisiteLineStyle,
    },

    // Standard props
    className: {
      type: String,
      default: undefined,
    },
    customStyle: {
      type: Object as PropType<CSSProperties>,
      default: undefined,
    },
  },
  emits: {
    'blocks-rendered': (event: BlocksRenderedEvent) => true,
    'block-selected': (event: BlockSelectedEvent) => true,
  },
  setup(props, { emit }) {
    const elementRef = ref<BlocksGraph | null>(null)

    // Initialize and load data
    onMounted(() => {
      const element = elementRef.value
      if (!element) return

      // Set up event listeners
      const handleBlocksRendered = (event: Event) => {
        const customEvent = event as CustomEvent<BlocksRenderedEvent>
        emit('blocks-rendered', customEvent.detail)
      }

      const handleBlockSelected = (event: Event) => {
        const customEvent = event as CustomEvent<BlockSelectedEvent>
        emit('block-selected', customEvent.detail)
      }

      element.addEventListener('blocks-rendered', handleBlocksRendered)
      element.addEventListener('block-selected', handleBlockSelected)

      // Cleanup on unmount
      return () => {
        element.removeEventListener('blocks-rendered', handleBlocksRendered)
        element.removeEventListener('block-selected', handleBlockSelected)
      }
    })

    // Watch data props
    // Schema version is now auto-detected by BlocksGraph.setBlocks()
    watch(
      () => [props.blocks, props.jsonUrl] as const,
      ([blocks, jsonUrl]) => {
        const element = elementRef.value
        if (!element) return

        if (blocks) {
          // Auto-detection handled by BlocksGraph.setBlocks()
          element.setBlocks(blocks)
        }
      },
      { immediate: true }
    )

    // Watch configuration props
    watch(
      () => props.language,
      language => {
        if (elementRef.value) {
          elementRef.value.language = language
        }
      }
    )

    watch(
      () => props.orientation,
      orientation => {
        if (elementRef.value) {
          elementRef.value.orientation = orientation
        }
      }
    )

    watch(
      () => props.showPrerequisites,
      showPrerequisites => {
        if (elementRef.value) {
          elementRef.value.showPrerequisites = showPrerequisites
        }
      }
    )

    // Watch layout props
    watch(
      () => props.nodeWidth,
      nodeWidth => {
        if (elementRef.value && nodeWidth !== undefined) {
          elementRef.value.setAttribute('node-width', String(nodeWidth))
        }
      }
    )

    watch(
      () => props.nodeHeight,
      nodeHeight => {
        if (elementRef.value && nodeHeight !== undefined) {
          elementRef.value.setAttribute('node-height', String(nodeHeight))
        }
      }
    )

    watch(
      () => props.horizontalSpacing,
      horizontalSpacing => {
        if (elementRef.value && horizontalSpacing !== undefined) {
          elementRef.value.setAttribute(
            'horizontal-spacing',
            String(horizontalSpacing)
          )
        }
      }
    )

    watch(
      () => props.verticalSpacing,
      verticalSpacing => {
        if (elementRef.value && verticalSpacing !== undefined) {
          elementRef.value.setAttribute(
            'vertical-spacing',
            String(verticalSpacing)
          )
        }
      }
    )

    // Watch edge style props
    watch(
      () => props.prerequisiteLineStyle,
      prerequisiteLineStyle => {
        if (elementRef.value) {
          elementRef.value.prerequisiteLineStyle = prerequisiteLineStyle
        }
      }
    )

    watch(
      () => props.maxNodesPerLevel,
      maxNodesPerLevel => {
        if (elementRef.value && maxNodesPerLevel !== undefined) {
          elementRef.value.setAttribute(
            'max-nodes-per-level',
            String(maxNodesPerLevel)
          )
        }
      }
    )

    return {
      elementRef,
    }
  },
  render() {
    return h('blocks-graph', {
      ref: 'elementRef',
      class: this.className,
      style: this.customStyle,
    })
  },
})
