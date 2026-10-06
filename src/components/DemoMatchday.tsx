import { useReducer } from 'react'
import { fixtureGameService } from '../demo/fixtureGameService'
import { initialDemoState, reduceDemoState } from '../demo/state'

const scenario = fixtureGameService.loadScenario()
const standings = [
  { name: 'Nerea', group: 'Las de siempre', points: 28, place: '01' },
  { name: 'Alex', group: 'Las de siempre', points: 24, place: '02' },
  { name: 'Marcos', group: 'Las de siempre', points: 21, place: '03' },
]

interface DemoMatchdayProps {
  locale: 'es' | 'en'
}

export function DemoMatchday({ locale }: DemoMatchdayProps) {
  const [state, dispatch] = useReducer(reduceDemoState, initialDemoState)
  const english = locale === 'en'
  const allSelected = scenario.fixtures.every((fixture) => state.picks[fixture.id])

  async function savePredictions() {
    if (!allSelected) return
    const predictions = scenario.fixtures.flatMap((fixture) => {
      const pick = state.picks[fixture.id]
      return pick ? [{ fixtureId: fixture.id, pick }] : []
    })
    const outcome = await fixtureGameService.submitAction(predictions)
    dispatch({ type: 'saved', outcome })
  }

  return (
    <section className="demo-layout" aria-label={english ? 'Interactive matchday demo' : 'Demo interactiva de jornada'}>
      <div className="matchday-panel">
        <div className="panel-heading">
          <div>
            <p className="eyebrow">{english ? 'A FICTIONAL ROUND' : 'UNA JORNADA FICTICIA'}</p>
            <h3>{english ? 'Pick your outcomes' : 'Haz tus pronósticos'}</h3>
          </div>
          <span className="round-label">{scenario.matchday}</span>
        </div>

        <div className="fixture-list">
          {scenario.fixtures.map((fixture, index) => (
            <article className="fixture" key={fixture.id}>
              <div className="fixture-topline">
                <span>{english ? `MATCH ${String(index + 1).padStart(2, '0')}` : `PARTIDO ${String(index + 1).padStart(2, '0')}`}</span>
                <time>{fixture.kickoff}</time>
              </div>
              <div className="fixture-teams">
                <span>{fixture.home}</span>
                <span aria-hidden="true" className="fixture-vs">—</span>
                <span>{fixture.away}</span>
              </div>
              <div className="pick-row" role="group" aria-label={english ? `${fixture.home} against ${fixture.away}` : `${fixture.home} contra ${fixture.away}`}>
                {(['1', 'X', '2'] as const).map((pick) => (
                  <button
                    aria-pressed={state.picks[fixture.id] === pick}
                    className={`pick-button${state.picks[fixture.id] === pick ? ' is-selected' : ''}`}
                    key={pick}
                    onClick={() => dispatch({ type: 'select', fixtureId: fixture.id, pick })}
                    type="button"
                  >
                    {pick}
                  </button>
                ))}
              </div>
            </article>
          ))}
        </div>

        <div className="save-row">
          <p aria-live="polite" className="save-status">
            {state.saved
              ? (english ? 'Your demo picks are saved.' : 'Tus pronósticos de demo están guardados.')
              : (english ? 'Choose 1, X or 2 for each match.' : 'Elige 1, X o 2 en cada partido.')}
          </p>
          <button className="button button-dark" disabled={!allSelected} onClick={savePredictions} type="button">
            {state.saved ? (english ? 'Saved ✓' : 'Guardado ✓') : (english ? 'Save picks' : 'Guardar pronósticos')}
          </button>
        </div>

        {state.outcome && (
          <div className="outcome" role="status">
            <div className="outcome-score">
              <span>{english ? 'DEMO RESULT' : 'RESULTADO DEMO'}</span>
              <strong>{state.outcome.displayPoints}</strong>
              <small>{english ? 'display points' : 'puntos visuales'}</small>
            </div>
            <ul>
              {state.outcome.explanation.map((item) => <li key={item}>{item}</li>)}
            </ul>
            <p>{english ? 'Precalculated example. This is not the production scoring system.' : 'Ejemplo precalculado. No es el sistema de puntuación de producción.'}</p>
          </div>
        )}
      </div>

      <aside className="leaderboard-panel" aria-labelledby="leaderboard-title">
        <div className="leaderboard-top">
          <div>
            <p className="eyebrow">{english ? 'YOUR FRIEND GROUP' : 'TU GRUPO DE AMIGOS'}</p>
            <h3 id="leaderboard-title">{english ? 'The Stand' : 'La Grada'}</h3>
          </div>
          <span aria-hidden="true" className="leaderboard-icon">↗</span>
        </div>
        <p className="leaderboard-caption">{english ? 'A playful leaderboard for this fictional round.' : 'Una clasificación de juego para esta jornada ficticia.'}</p>
        <ol className="standings-list">
          {standings.map((player) => (
            <li key={player.name}>
              <span className="standing-place">{player.place}</span>
              <span className="standing-player"><strong>{player.name}</strong><small>{player.group}</small></span>
              <strong className="standing-points">{player.points}<small> pts</small></strong>
            </li>
          ))}
        </ol>
        <div className="h2h-callout">
          <span aria-hidden="true">VS</span>
          <p><strong>{english ? 'Next up: a head-to-head.' : 'Lo siguiente: un cara a cara.'}</strong><br />{english ? 'Challenge someone from your group.' : 'Reta a alguien de tu grupo.'}</p>
          <span aria-hidden="true">→</span>
        </div>
      </aside>
    </section>
  )
}
