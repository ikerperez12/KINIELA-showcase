import type { DemoGameService, DemoOutcome, DemoScenario } from './types'

const scenario: DemoScenario = {
  matchday: 'Jornada 04',
  fixtures: [
    { id: 'fixture-1', home: 'Puerto Brisa', away: 'Monteverde', kickoff: '16:15' },
    { id: 'fixture-2', home: 'Río Azul', away: 'Villa Nube', kickoff: '18:30' },
    { id: 'fixture-3', home: 'Costa Norte', away: 'Valle Claro', kickoff: '20:45' },
  ],
}

const outcome: DemoOutcome = {
  status: 'complete',
  displayPoints: 12,
  explanation: ['Correct outcome', 'Close score prediction', 'Demo bonus'],
}

export const fixtureGameService: DemoGameService = {
  loadScenario: () => scenario,
  submitAction: async () => outcome,
}
