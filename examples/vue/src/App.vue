<template>
  <div class="app">
    <header class="header">
      <h1>@lumina-study/blocks-graph</h1>
      <p v-if="!blocks">Loading data...</p>
      <template v-else>
        <p>The Open University - Combinatorics Course</p>
        <small>Using Vue Wrapper (No refs needed!)</small>
      </template>
    </header>

    <!-- Loading State -->
    <div v-if="!blocks" class="info-panel">
      <p>{{ status }}</p>
    </div>

    <!-- Main Content -->
    <template v-else>
      <!-- Interactive Controls Panel -->
      <div class="controls">
        <div class="control-group">
          <label for="language-select">Language:</label>
          <select id="language-select" v-model="language">
            <option value="en">English</option>
            <option value="he">Hebrew (עברית)</option>
          </select>
        </div>

        <div class="control-group">
          <label for="orientation-select">Orientation:</label>
          <select id="orientation-select" v-model="orientation">
            <option value="ttb">Top to Bottom</option>
            <option value="ltr">Left to Right</option>
            <option value="rtl">Right to Left</option>
            <option value="btt">Bottom to Top</option>
          </select>
        </div>

        <div class="control-group checkbox">
          <label>
            <input type="checkbox" v-model="showPrerequisites" />
            Show Prerequisites
          </label>
        </div>
      </div>

      <!-- Vue Wrapper Component - Clean Props API! -->
      <div class="graph-container">
        <BlocksGraphVue
          :blocks="blocks"
          :language="language"
          :orientation="orientation"
          :show-prerequisites="showPrerequisites"
          :node-width="200"
          :node-height="80"
          @blocks-rendered="handleBlocksRendered"
          @block-selected="handleBlockSelected"
          custom-style="width: 100%; height: 600px; display: block;"
        />
      </div>

      <!-- Info Panel -->
      <div class="info-panel">
        <h3>Vue Wrapper Benefits</h3>
        <ul>
          <li>✅ No refs needed - just use props</li>
          <li>✅ Full TypeScript support with autocomplete</li>
          <li>✅ Vue-style events with typed payloads</li>
          <li>✅ Automatic prop synchronization</li>
          <li>✅ Clean, declarative API</li>
        </ul>
        <div class="status"><strong>Status:</strong> {{ status }}</div>
        <div v-if="selectedBlock" class="selected-block">
          <strong>Selected Block ID:</strong>
          {{ selectedBlock.substring(0, 8) }}...
        </div>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import {
  BlocksGraphVue,
  type BlockSchemaV01,
  type BlocksRenderedEvent,
  type BlockSelectedEvent,
} from '@lumina-study/blocks-graph/vue'

/**
 * Vue Example Using the BlocksGraphVue Wrapper
 *
 * This demonstrates the recommended approach for Vue 3 apps.
 * No refs needed - just pass props and use @events!
 */

// State management using Vue refs
const blocks = ref<BlockSchemaV01[] | null>(null)
const language = ref<'en' | 'he'>('en')
const orientation = ref<'ttb' | 'ltr' | 'rtl' | 'btt'>('ttb')
const showPrerequisites = ref(true)
const status = ref('Loading data...')
const selectedBlock = ref<string | null>(null)

/**
 * Load data on mount
 * The wrapper handles converting data and passing it to the Web Component
 */
onMounted(async () => {
  try {
    const response = await fetch(
      'https://raw.githubusercontent.com/luminastudy/the-open-university-combinatorics/refs/heads/main/lumina.json'
    )

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()

    // Data from API is in v0.1 schema format (he_text/en_text)
    // We'll pass it to blocks prop which auto-detects and converts automatically
    blocks.value = data
    status.value = `Loaded ${data.length} blocks successfully`
  } catch (error) {
    console.error('Error loading data:', error)
    status.value = `Error: ${error instanceof Error ? error.message : 'Unknown error'}`
  }
})

/**
 * Event handlers
 */
function handleBlocksRendered(event: BlocksRenderedEvent) {
  console.log('Blocks rendered:', event)
  status.value = `Rendered ${event.blockCount} blocks`
}

function handleBlockSelected(event: BlockSelectedEvent) {
  console.log('Block selected:', event)
  if (event.blockId) {
    selectedBlock.value = event.blockId
    const levelText =
      event.selectionLevel === 0
        ? 'default view'
        : event.selectionLevel === 1
          ? 'showing graph'
          : 'showing graph + sub-blocks'
    status.value = `Selected block - ${levelText}`
  } else {
    selectedBlock.value = null
    status.value = 'Selection cleared'
  }
}
</script>

<style scoped>
.app {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  font-family:
    -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu',
    'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
}

.header {
  text-align: center;
  margin-bottom: 2rem;
}

.header h1 {
  margin: 0;
  font-size: 2.5rem;
  color: #2c3e50;
}

.header p {
  margin: 0.5rem 0;
  color: #666;
}

.header small {
  color: #999;
  font-style: italic;
}

.controls {
  display: flex;
  gap: 1.5rem;
  flex-wrap: wrap;
  padding: 1.5rem;
  background: #f5f5f5;
  border-radius: 8px;
  margin-bottom: 2rem;
}

.control-group {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.control-group label {
  font-weight: 500;
  color: #333;
}

.control-group select {
  padding: 0.4rem 0.8rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  background: white;
  cursor: pointer;
  font-size: 0.9rem;
}

.control-group.checkbox {
  padding: 0.4rem 0.8rem;
}

.control-group.checkbox label {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  cursor: pointer;
}

.control-group.checkbox input[type='checkbox'] {
  cursor: pointer;
}

.graph-container {
  margin-bottom: 2rem;
  border: 1px solid #ddd;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.info-panel {
  padding: 1.5rem;
  background: #f9f9f9;
  border-radius: 8px;
  border: 1px solid #e0e0e0;
}

.info-panel h3 {
  margin-top: 0;
  color: #2c3e50;
}

.info-panel ul {
  margin: 1rem 0;
  padding-left: 1.5rem;
}

.info-panel li {
  margin: 0.5rem 0;
  color: #555;
}

.status {
  margin-top: 1rem;
  padding: 0.75rem;
  background: #e8f5e9;
  border-left: 3px solid #4caf50;
  border-radius: 4px;
}

.selected-block {
  margin-top: 1rem;
  padding: 0.75rem;
  background: #e3f2fd;
  border-left: 3px solid #2196f3;
  border-radius: 4px;
}

.selected-block strong,
.status strong {
  color: #333;
}
</style>
