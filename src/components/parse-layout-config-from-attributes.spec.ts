import { describe, it, expect } from 'vitest'
import { parseLayoutConfigFromAttributes } from './parse-layout-config-from-attributes.js'

describe('parseLayoutConfigFromAttributes', () => {
  it('should parse node-width attribute', () => {
    const element = {
      getAttribute: (attr: string) => (attr === 'node-width' ? '200' : null),
    } as unknown as HTMLElement
    const config = parseLayoutConfigFromAttributes(element)
    expect(config.nodeWidth).toBe(200)
  })

  it('should parse orientation attribute', () => {
    const element = {
      getAttribute: (attr: string) => (attr === 'orientation' ? 'ltr' : null),
    } as unknown as HTMLElement
    const config = parseLayoutConfigFromAttributes(element)
    expect(config.orientation).toBe('ltr')
  })

  it('should return empty config for element with no attributes', () => {
    const element = {
      getAttribute: () => null,
    } as unknown as HTMLElement
    const config = parseLayoutConfigFromAttributes(element)
    expect(config).toEqual({})
  })

  it('should parse max-nodes-per-level attribute', () => {
    const element = {
      getAttribute: (attr: string) =>
        attr === 'max-nodes-per-level' ? '5' : null,
    } as unknown as HTMLElement
    const config = parseLayoutConfigFromAttributes(element)
    expect(config.maxNodesPerLevel).toBe(5)
  })
})
