import { useState, useEffect } from 'react'
import {
  BlocksGraphReact,
  type BlockSchemaV01,
} from '@lumina-study/blocks-graph/react'
import './App.css'

/**
 * React Example Using the BlocksGraphReact Wrapper
 *
 * This demonstrates the recommended approach for React apps.
 * No refs needed - just pass props like any React component!
 */
function AppWithWrapper() {
  // State management
  const [blocks, setBlocks] = useState<BlockSchemaV01[] | null>(null)
  const [language, setLanguage] = useState<'en' | 'he'>('en')
  const [orientation, setOrientation] = useState<'ttb' | 'ltr' | 'rtl' | 'btt'>(
    'ttb'
  )
  const [showPrerequisites, setShowPrerequisites] = useState(true)
  const [status, setStatus] = useState('Loading data...')
  const [selectedBlock, setSelectedBlock] = useState<string | null>(null)

  /**
   * Load data on mount
   * The wrapper auto-detects the schema format
   */
  useEffect(() => {
    const loadData = async () => {
      try {
        const response = await fetch(
          'https://raw.githubusercontent.com/luminastudy/the-open-university-combinatorics/refs/heads/main/lumina.json'
        )

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }

        const data = await response.json()

        // Data from API is in v0.1 schema format (he_text/en_text)
        // The blocks prop auto-detects the format and converts automatically
        setBlocks(data)
        setStatus(`Loaded ${data.length} blocks successfully`)
      } catch (error) {
        console.error('Error loading data:', error)
        setStatus(
          `Error: ${error instanceof Error ? error.message : 'Unknown error'}`
        )
      }
    }

    loadData()
  }, [])

  // Loading state
  if (!blocks) {
    return (
      <div className="app">
        <header className="header">
          <h1 className="header-title">@lumina-study/blocks-graph</h1>
          <p className="header-subtitle">React Wrapper Example</p>
        </header>
        <div className="info-panel">
          <p className="info-text">{status}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="app">
      <header className="header">
        <h1 className="header-title">@lumina-study/blocks-graph</h1>
        <p className="header-subtitle">
          The Open University - Combinatorics Course
        </p>
        <small className="header-note">
          Using React Wrapper (No refs needed!)
        </small>
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

        <div className="control-group">
          <label className="control-label" htmlFor="orientation-select">
            Orientation:
          </label>
          <select
            className="control-select"
            id="orientation-select"
            value={orientation}
            onChange={e => {
              const value = e.target.value
              if (
                value === 'ttb' ||
                value === 'ltr' ||
                value === 'rtl' ||
                value === 'btt'
              ) {
                setOrientation(value)
              }
            }}
          >
            <option className="control-option" value="ttb">
              Top to Bottom
            </option>
            <option className="control-option" value="ltr">
              Left to Right
            </option>
            <option className="control-option" value="rtl">
              Right to Left
            </option>
            <option className="control-option" value="btt">
              Bottom to Top
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

      {/* React Wrapper Component - Clean Props API! */}
      <div className="graph-container">
        <BlocksGraphReact
          blocks={blocks}
          language={language}
          orientation={orientation}
          showPrerequisites={showPrerequisites}
          nodeWidth={200}
          nodeHeight={80}
          onBlocksRendered={e => {
            console.log('Blocks rendered:', e.detail)
            setStatus(`Rendered ${e.detail.blockCount} blocks`)
          }}
          onBlockSelected={e => {
            console.log('Block selected:', e.detail)
            if (e.detail.blockId) {
              setSelectedBlock(e.detail.blockId)
              const levelText =
                e.detail.selectionLevel === 0
                  ? 'default view'
                  : e.detail.selectionLevel === 1
                    ? 'showing graph'
                    : 'showing graph + sub-blocks'
              setStatus(`Selected block - ${levelText}`)
            } else {
              setSelectedBlock(null)
              setStatus('Selection cleared')
            }
          }}
          style={{
            width: '100%',
            height: '600px',
            display: 'block',
          }}
        />
      </div>

      {/* Info Panel */}
      <div className="info-panel">
        <h3 className="info-title">React Wrapper Benefits</h3>
        <ul className="info-list">
          <li className="info-list-item">
            ✅ No refs needed - just pass props
          </li>
          <li className="info-list-item">
            ✅ Full TypeScript support with autocomplete
          </li>
          <li className="info-list-item">
            ✅ React-style event handlers (onBlocksRendered, onBlockSelected)
          </li>
          <li className="info-list-item">✅ Automatic prop synchronization</li>
          <li className="info-list-item">✅ Clean, declarative API</li>
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

export default AppWithWrapper
