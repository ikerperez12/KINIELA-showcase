import type { DemoOutcome, DemoPick } from './types'

export interface DemoState {
  picks: Record<string, DemoPick>
  saved: boolean
  outcome: DemoOutcome | null
}

export type DemoAction =
  | { type: 'select'; fixtureId: string; pick: DemoPick }
  | { type: 'saved'; outcome: DemoOutcome }

export const initialDemoState: DemoState = { picks: {}, saved: false, outcome: null }

export function reduceDemoState(state: DemoState, action: DemoAction): DemoState {
  switch (action.type) {
    case 'select':
      return {
        picks: { ...state.picks, [action.fixtureId]: action.pick },
        saved: false,
        outcome: null,
      }
    case 'saved':
      return { ...state, saved: true, outcome: action.outcome }
  }
}
