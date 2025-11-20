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
import type { BlocksRenderedEvent } from './blocks-rendered-event.js'
import type { BlockSelectedEvent } from './block-selected-event.js'

// Import the web component to ensure it's registered
import '../../index.js'

/**
 * Vue wrapper component for the blocks-graph Web Component.
 * Provides a clean Vue API with props and events.
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
 * const blocks: Block[] = [...];
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
      type: Array as PropType<Block[]>,
      default: undefined,
    },
    blocksV01: {
      type: Array as PropType<BlockSchemaV01[]>,
      default: undefined,
    },
    jsonUrl: {
      type: String,
      default: undefined,
    },

    // Configuration props
    language: {
      type: String as PropType<'en' | 'he'>,
      default: 'en',
    },
    orientation: {
      type: String as PropType<'ttb' | 'ltr' | 'rtl' | 'btt'>,
      default: 'ttb',
    },
    showPrerequisites: {
      type: Boolean,
      default: true,
    },
    showParents: {
      type: Boolean,
      default: true,
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

    // Edge style props
    prerequisiteLineStyle: {
      type: String as PropType<EdgeLineStyle>,
      default: 'dashed',
    },
    parentLineStyle: {
      type: String as PropType<EdgeLineStyle>,
      default: 'straight',
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
    watch(
      () => [props.blocks, props.blocksV01, props.jsonUrl] as const,
      ([blocks, blocksV01, jsonUrl]) => {
        const element = elementRef.value
        if (!element) return

        if (blocks) {
          element.setBlocks(blocks)
        } else if (blocksV01) {
          element.loadFromJson(JSON.stringify(blocksV01), 'v0.1')
        } else if (jsonUrl) {
          element.loadFromUrl(jsonUrl, 'v0.1').catch(console.error)
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

    watch(
      () => props.showParents,
      showParents => {
        if (elementRef.value) {
          elementRef.value.showParents = showParents
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
      () => props.parentLineStyle,
      parentLineStyle => {
        if (elementRef.value) {
          elementRef.value.parentLineStyle = parentLineStyle
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
