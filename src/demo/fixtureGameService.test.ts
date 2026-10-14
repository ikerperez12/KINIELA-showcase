import { describe, expect, it } from 'vitest'
import { fixtureGameService } from './fixtureGameService'

describe('fictional fixture service', () => {
  it('uses three invented fixtures and returns a precomputed display outcome', async () => {
    const scenario = fixtureGameService.loadScenario()
    const outcome = await fixtureGameService.submitAction([
      { fixtureId: scenario.fixtures[0]!.id, pick: '1' },
      { fixtureId: scenario.fixtures[1]!.id, pick: 'X' },
      { fixtureId: scenario.fixtures[2]!.id, pick: '2' },
    ])

    expect(scenario.fixtures).toHaveLength(3)
    expect(outcome).toEqual({
      status: 'complete',
      displayPoints: 12,
      explanation: ['Correct outcome', 'Close score prediction', 'Demo bonus'],
    })
  })
})
