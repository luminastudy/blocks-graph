import { useEffect, useRef, useState } from 'react'
/*
 * Web Component Import:
 * Importing the blocks-graph library automatically registers
 * the 'blocks-graph' custom element globally.
 */
import '@lumina-study/blocks-graph'
import './App.css'

/**
 * TypeScript Type Definition for Web Component:
 * Defines the custom element interface with imperative API methods
 * and properties for type-safe access via React ref
 */
interface BlocksGraphElement extends HTMLElement {
  loadFromJson: (json: string, version: 'v0.1') => void
  language: string
  showPrerequisites: boolean
}

function App() {
  /*
   * Type-Safe Ref for Web Component:
   * useRef hook provides access to the Web Component instance
   * Typed with custom interface for imperative API access
   */
  const graphRef = useRef<BlocksGraphElement>(null)

  // State management for interactive controls
  const [language, setLanguage] = useState<'en' | 'he'>('en')
  const [showPrerequisites, setShowPrerequisites] = useState(true)
  const [status, setStatus] = useState('Ready to load data')
  const [selectedBlock, setSelectedBlock] = useState<string | null>(null)

  /**
   * Data Loading Lifecycle:
   * useEffect hook loads sample data when component mounts
   * Empty dependency array ensures this runs only once
   */
  useEffect(() => {
    const loadData = async () => {
      try {
        setStatus('Loading data...')

        /*
         * Fetch data from The Open University Combinatorics course
         * This demonstrates loading data from a remote URL
         */
        const response = await fetch(
          'https://raw.githubusercontent.com/luminastudy/the-open-university-combinatorics/refs/heads/main/lumina.json'
        )

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }

        const blocks = await response.json()

        /*
         * Call loadFromJson on Web Component instance via ref
         * This is the imperative API for loading data
         */
        if (graphRef.current) {
          graphRef.current.loadFromJson(JSON.stringify(blocks), 'v0.1')
          setStatus(`Loaded ${blocks.length} blocks successfully`)
        }
      } catch (error) {
        console.error('Error loading data:', error)
        setStatus(
          `Error loading data: ${
            error instanceof Error ? error.message : 'Unknown error'
          }`
        )
      }
    }

    loadData()
  }, []) // Run only on mount

  /**
   * Attribute Synchronization:
   * useEffect hooks to keep Web Component attributes in sync with React state
   * This demonstrates how to update Web Component properties from React
   */
  useEffect(() => {
    if (graphRef.current) {
      graphRef.current.language = language
    }
  }, [language])

  useEffect(() => {
    if (graphRef.current) {
      graphRef.current.showPrerequisites = showPrerequisites
    }
  }, [showPrerequisites])

  /**
   * Event Listener Registration:
   * useEffect hook to register Web Component event listeners
   * Cleanup function removes listeners when component unmounts
   */
  useEffect(() => {
    const graph = graphRef.current
    if (!graph) return

    // Handle blocks-rendered event
    const handleBlocksRendered = (event: Event) => {
      if (!(event instanceof CustomEvent)) return
      console.log('Blocks rendered:', event.detail)
      if (event.detail && event.detail.blockCount !== undefined) {
        setStatus(`Rendered ${event.detail.blockCount} blocks`)
      }
    }

    // Handle block-selected event
    const handleBlockSelected = (event: Event) => {
      if (!(event instanceof CustomEvent)) return
      console.log('Block selected:', event.detail)
      if (event.detail && event.detail.blockId) {
        setSelectedBlock(event.detail.blockId)
        const levelText =
          event.detail.selectionLevel === 0
            ? 'default view'
            : event.detail.selectionLevel === 1
              ? 'showing graph'
              : 'showing graph + sub-blocks'
        setStatus(`Selected block - ${levelText}`)
      } else {
        setSelectedBlock(null)
        setStatus('Selection cleared')
      }
    }

    // Add event listeners
    graph.addEventListener('blocks-rendered', handleBlocksRendered)
    graph.addEventListener('block-selected', handleBlockSelected)

    // Cleanup: remove event listeners when component unmounts
    return () => {
      graph.removeEventListener('blocks-rendered', handleBlocksRendered)
      graph.removeEventListener('block-selected', handleBlockSelected)
    }
  }, []) // Run only on mount/unmount

  return (
    <div className="app">
      <header className="header">
        <h1 className="header-title">@lumina-study/blocks-graph</h1>
        <p className="header-subtitle">
          The Open University - Combinatorics Course
        </p>
      </header>

      {/* Interactive Controls Panel */}
      <div className="controls">
        <div className="control-group">
          <label className="control-label" htmlFor="language-select">
            Language:
          </label>
          <select
            className="control-select"
            id="language-select"
            value={language}
            onChange={e => {
              const value = e.target.value
              if (value === 'en' || value === 'he') {
                setLanguage(value)
              }
            }}
          >
            <option className="control-option" value="en">
              English
            </option>
            <option className="control-option" value="he">
              Hebrew (עברית)
            </option>
          </select>
        </div>

        <div className="control-group checkbox">
          <label className="control-label">
            <input
              className="control-checkbox"
              type="checkbox"
              checked={showPrerequisites}
              onChange={e => setShowPrerequisites(e.target.checked)}
            />
            Show Prerequisites
          </label>
        </div>
      </div>

      {/* Web Component Integration */}
      <div className="graph-container">
        {/*
          Rendering Web Component in React:
          - ref prop connects to useRef hook for imperative API access
          - HTML attributes are passed as props
          - Inline styles can be applied via the style prop
        */}
        <blocks-graph
          className="blocks-graph-component"
          ref={graphRef}
          language={language}
          show-prerequisites={showPrerequisites ? 'true' : 'false'}
          style={{
            width: '100%',
            height: '600px',
            display: 'block',
          }}
        />
      </div>

      {/* Info Panel */}
      <div className="info-panel">
        <h3 className="info-title">How to Use This Example</h3>
        <ul className="info-list">
          <li className="info-list-item">
            Click on blocks to explore their relationships
          </li>
          <li className="info-list-item">
            Use the language selector to switch between English and Hebrew
          </li>
          <li className="info-list-item">
            Toggle checkboxes to show/hide relationships
          </li>
          <li className="info-list-item">
            Observe how React state updates the Web Component
          </li>
          <li className="info-list-item">
            Check the browser console for event logs
          </li>
        </ul>
        <div className="status">
          <strong className="status-label">Status:</strong> {status}
        </div>
        {selectedBlock && (
          <div className="selected-block">
            <strong className="selected-block-label">Selected Block ID:</strong>{' '}
            {selectedBlock.substring(0, 8)}
            ...
          </div>
        )}
      </div>
    </div>
  )
}

export default App
