import { describe, expect, it } from 'vitest'
import { initialDemoState, reduceDemoState } from './state'

describe('demo UI state', () => {
  it('keeps picks local and clears the saved outcome when a pick changes', () => {
    const first = reduceDemoState(initialDemoState, { type: 'select', fixtureId: 'fixture-1', pick: '1' })
    const saved = reduceDemoState(first, {
      type: 'saved',
      outcome: { status: 'complete', displayPoints: 12, explanation: ['Demo only'] },
    })
    const edited = reduceDemoState(saved, { type: 'select', fixtureId: 'fixture-1', pick: 'X' })

    expect(first.picks['fixture-1']).toBe('1')
    expect(saved.saved).toBe(true)
    expect(edited).toEqual({ picks: { 'fixture-1': 'X' }, saved: false, outcome: null })
    expect(saved.picks['fixture-1']).toBe('1')
  })
})
