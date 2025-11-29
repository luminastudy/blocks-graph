import { describe, it, expect } from 'vitest'
import { HorizontalRelationshipsAlgorithms } from './horizontal-relationships-algorithms.js'

describe('horizontal-relationships-algorithms', () => {
  it('should export HorizontalRelationshipsAlgorithms', () => {
    expect(HorizontalRelationshipsAlgorithms).toBeDefined()
  })

  it('should export computeAllPrerequisites', () => {
    expect(
      HorizontalRelationshipsAlgorithms.computeAllPrerequisites
    ).toBeDefined()
  })

  it('should export computeAllPostrequisites', () => {
    expect(
      HorizontalRelationshipsAlgorithms.computeAllPostrequisites
    ).toBeDefined()
  })

  it('should export detectCyclesInGraph', () => {
    expect(HorizontalRelationshipsAlgorithms.detectCyclesInGraph).toBeDefined()
  })

  it('should export computeTopologicalOrder', () => {
    expect(
      HorizontalRelationshipsAlgorithms.computeTopologicalOrder
    ).toBeDefined()
  })
})
