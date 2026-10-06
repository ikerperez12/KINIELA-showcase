export type DemoPick = '1' | 'X' | '2'

export interface DemoFixture {
  id: string
  home: string
  away: string
  kickoff: string
}

export interface DemoScenario {
  matchday: string
  fixtures: DemoFixture[]
}

export interface DemoPrediction {
  fixtureId: string
  pick: DemoPick
}

export interface DemoOutcome {
  status: 'complete'
  displayPoints: number
  explanation: string[]
}

export interface DemoGameService {
  loadScenario(): DemoScenario
  submitAction(predictions: DemoPrediction[]): Promise<DemoOutcome>
}
