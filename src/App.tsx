import { useEffect, useState } from 'react'
import { DemoMatchday } from './components/DemoMatchday'

type Locale = 'es' | 'en'

const copy = {
  es: {
    navGame: 'El juego', navModes: 'Modos', navDemo: 'Probar demo', language: 'EN', languageLabel: 'Switch to English',
    eyebrow: 'FÚTBOL · AMIGOS · ORGULLO', lineOne: 'Acierta.', lineTwo: 'Afina.', lineThree: 'Pica a tus amigos.',
    intro: 'Cada jornada cuenta. Pronostica, compite con tu gente y celebra cada acierto.',
    play: 'Play now ↗', pending: 'Enlace al juego pendiente de confirmar', explore: 'Explorar la demo ↓',
    heroNote: 'Un juego de fútbol para llevar la rivalidad amistosa al siguiente nivel.',
    demoEyebrow: 'ELIGE · GUARDA · COMPARA', demoTitle: 'La emoción empieza antes del pitido.',
    demoIntro: 'Una muestra interactiva con partidos, nombres y resultados inventados. Todo funciona aquí mismo, sin conectar con el juego real.',
    modesEyebrow: 'CADA GRUPO TIENE SU HISTORIA', modesTitle: 'Más formas de picarse.',
    groupsTitle: 'Grupos', groupsText: 'Tu gente, una jornada y una clasificación que se mueve con cada partido.',
    h2hTitle: 'Cara a cara', h2hText: 'Un reto directo para que la conversación siga después del partido.',
    cupTitle: 'Copa', cupText: 'Cuadros, cruces y una ruta hacia la final para tu grupo.',
    progressEyebrow: 'CADA PUNTO, UNA HISTORIA', progressTitle: 'Tu temporada, a tu manera.',
    progressText: 'Sigue tus rachas, mira cómo evoluciona tu juego y comparte los momentos que importan.',
    streak: 'Racha de demo', streakValue: '3 jornadas', badges: 'Logros de ejemplo', badgesValue: '2 desbloqueados',
    galleryEyebrow: 'HECHO PARA VERSE BIEN EN CUALQUIER PANTALLA', galleryTitle: 'La jornada te acompaña.',
    galleryText: 'Una experiencia pensada para consultar, pronosticar y volver a la clasificación desde el móvil o el escritorio.',
    trailerEyebrow: 'CAPTURA REAL DEL PRODUCTO', trailerTitle: 'Así se siente una jornada.',
    trailerText: 'Un recorrido visual por la aplicación original. El vídeo muestra únicamente pantallas reales capturadas para esta galería; no conecta con servicios desde el showcase.', trailerNote: 'Vídeo de producto · 21 s',
    includedTitle: 'Una base pequeña, hecha para enseñar.', includedText: 'Componentes tipados, fixtures locales y un resultado de demo precalculado para mostrar el flujo de interfaz.',
    privacyTitle: 'El producto completo sigue privado.', privacyText: 'El motor real, el backend, los datos, la seguridad, las operaciones y una parte sustancial de KINIELA no forman parte de este showcase.',
    footerLine: 'Acierta. Afina. Pica a tus amigos.', footerTerms: 'Galería pública y referencia limitada. Demo sintética, sin conexión a producción.',
  },
  en: {
    navGame: 'The game', navModes: 'Modes', navDemo: 'Try demo', language: 'ES', languageLabel: 'Cambiar a español',
    eyebrow: 'FOOTBALL · FRIENDS · BRAGGING RIGHTS', lineOne: 'Call it.', lineTwo: 'Refine it.', lineThree: 'Rival your friends.',
    intro: 'Every matchday counts. Make your picks, compete with your people and celebrate every call.',
    play: 'Play now ↗', pending: 'Game link awaiting owner confirmation', explore: 'Explore the demo ↓',
    heroNote: 'A football game that takes friendly rivalry to the next level.',
    demoEyebrow: 'PICK · SAVE · COMPARE', demoTitle: 'The fun starts before kick-off.',
    demoIntro: 'An interactive sample with invented fixtures, names and results. Everything runs here, without connecting to the real game.',
    modesEyebrow: 'EVERY GROUP HAS A STORY', modesTitle: 'More ways to compete.',
    groupsTitle: 'Groups', groupsText: 'Your people, one matchday and a leaderboard that shifts with every game.',
    h2hTitle: 'Head-to-head', h2hText: 'A direct challenge that keeps the conversation going after the match.',
    cupTitle: 'Cup', cupText: 'A bracket, the knockout rounds and a route to the final for your group.',
    progressEyebrow: 'EVERY POINT HAS A STORY', progressTitle: 'Your season, your way.',
    progressText: 'Follow your streaks, see how your game evolves and share the moments that matter.',
    streak: 'Demo streak', streakValue: '3 matchdays', badges: 'Sample achievements', badgesValue: '2 unlocked',
    galleryEyebrow: 'MADE TO LOOK GREAT ON EVERY SCREEN', galleryTitle: 'Your matchday goes with you.',
    galleryText: 'An experience made for checking in, making picks and returning to the leaderboard from phone or desktop.',
    trailerEyebrow: 'REAL PRODUCT CAPTURE', trailerTitle: 'See a matchday in motion.',
    trailerText: 'A visual walk through the original application. This video contains only real screens captured for the gallery; the showcase itself does not connect to production services.', trailerNote: 'Product video · 21 sec',
    includedTitle: 'A small foundation, made to show how.', includedText: 'Typed components, local fixtures and a precomputed demo outcome that shows the interface flow.',
    privacyTitle: 'The full product stays private.', privacyText: 'The real engine, backend, data, security, operations and a substantial part of KINIELA are not part of this showcase.',
    footerLine: 'Call it. Refine it. Rival your friends.', footerTerms: 'Public gallery and limited reference. Synthetic demo, disconnected from production.',
  },
} as const

function ArrowMark() {
  return <span aria-hidden="true" className="arrow-mark">↗</span>
}

function App() {
  const [locale, setLocale] = useState<Locale>('es')
  const t = copy[locale]

  useEffect(() => {
    document.documentElement.lang = locale
    document.title = locale === 'es' ? 'KINIELA — Acierta. Afina. Pica a tus amigos.' : 'KINIELA — Call it. Refine it. Rival your friends.'
  }, [locale])

  return (
    <>
      <a className="skip-link" href="#main">{locale === 'es' ? 'Saltar al contenido' : 'Skip to content'}</a>
      <header className="site-header">
        <a aria-label="KINIELA, inicio" className="brand" href="#top"><span className="brand-mark">K</span><span>KINIELA</span></a>
        <nav aria-label={locale === 'es' ? 'Navegación principal' : 'Main navigation'} className="main-nav">
          <a href="#game">{t.navGame}</a>
          <a href="#modes">{t.navModes}</a>
          <a href="#demo">{t.navDemo}</a>
        </nav>
        <button aria-label={t.languageLabel} className="language-switch" onClick={() => setLocale(locale === 'es' ? 'en' : 'es')} type="button">{t.language}</button>
      </header>

      <main id="main" tabIndex={-1}>
        <section aria-labelledby="hero-title" className="hero" id="top">
          <div className="hero-copy">
            <p className="eyebrow eyebrow-light"><span className="live-dot" />{t.eyebrow}</p>
            <h1 id="hero-title">{t.lineOne}<br />{t.lineTwo}<br /><em>{t.lineThree}</em></h1>
            <p className="hero-intro">{t.intro}</p>
            <div className="hero-actions">
              <button aria-describedby="play-status" className="button button-lime button-pending" disabled type="button" title={t.pending}>{t.play}</button>
              <a className="text-link" href="#demo">{t.explore}</a>
            </div>
            <p className="pending-note" id="play-status">{t.pending}</p>
            <p className="hero-note">{t.heroNote}</p>
          </div>
          <div aria-label={locale === 'es' ? 'Ilustración original de un campo de fútbol al atardecer' : 'Original illustration of a football pitch at sunset'} className="hero-art" role="img">
            <img alt="" fetchPriority="high" src="/brand/kiniela-pitch-editorial.webp" />
            <div className="art-stamp"><span>90’</span><small>PLAY<br />TOGETHER</small></div>
            <span className="art-caption">{locale === 'es' ? 'TU JORNADA · TU GRUPO' : 'YOUR MATCHDAY · YOUR GROUP'}</span>
          </div>
          <div aria-label={locale === 'es' ? 'Tres partidos ficticios, pronósticos y clasificación de ejemplo' : 'Three fictional fixtures, predictions and sample leaderboard'} className="hero-index">
            <span>01</span><span>{locale === 'es' ? 'EL JUEGO' : 'THE GAME'}</span><span className="index-line" /><span>03</span>
          </div>
        </section>

        <section className="intro-strip" id="game">
          <p><span className="section-number">01 /</span> {locale === 'es' ? 'NO HACE FALTA SABERLO TODO. SOLO SABER MÁS QUE TUS AMIGOS.' : 'YOU DON’T NEED TO KNOW IT ALL. JUST MORE THAN YOUR FRIENDS.'}</p>
          <span aria-hidden="true" className="strip-ball">●</span>
        </section>

        <section aria-labelledby="demo-title" className="section demo-section" id="demo">
          <div className="section-heading">
            <div><p className="eyebrow"><span className="section-number">02 /</span> {t.demoEyebrow}</p><h2 id="demo-title">{t.demoTitle}</h2></div>
            <p>{t.demoIntro}</p>
          </div>
          <DemoMatchday locale={locale} />
        </section>

        <section aria-labelledby="modes-title" className="modes-section" id="modes">
          <div className="section modes-inner">
            <div className="section-heading section-heading-light">
              <div><p className="eyebrow"><span className="section-number">03 /</span> {t.modesEyebrow}</p><h2 id="modes-title">{t.modesTitle}</h2></div>
              <p>{locale === 'es' ? 'Una misma pasión, muchas maneras de jugarla juntos.' : 'One shared passion, plenty of ways to play together.'}</p>
            </div>
            <div className="mode-grid">
              <article className="mode-feature">
                <span className="mode-count">01</span><span aria-hidden="true" className="mode-symbol symbol-group">✳</span>
                <div><h3>{t.groupsTitle}</h3><p>{t.groupsText}</p></div>
              </article>
              <article className="mode-feature mode-feature-coral">
                <span className="mode-count">02</span><span aria-hidden="true" className="mode-symbol symbol-h2h">VS</span>
                <div><h3>{t.h2hTitle}</h3><p>{t.h2hText}</p></div>
              </article>
              <article className="mode-feature mode-feature-paper">
                <span className="mode-count">03</span><span aria-hidden="true" className="mode-symbol symbol-cup"><svg viewBox="0 0 48 48"><path d="M15 8h18v8h7v3c0 7-4 11-11 12a9 9 0 0 1-3 4v5h9v4H13v-4h9v-5a9 9 0 0 1-3-4c-7-1-11-5-11-12v-3h7zm0 12h-3c0 4 2 6 6 7a19 19 0 0 1-1-6v-1zm18 0v1a19 19 0 0 1-1 6c4-1 6-3 6-7h-5z" /></svg></span>
                <div><h3>{t.cupTitle}</h3><p>{t.cupText}</p></div>
              </article>
            </div>
          </div>
        </section>

        <section aria-labelledby="progress-title" className="section progress-section">
          <div className="progress-copy">
            <p className="eyebrow"><span className="section-number">04 /</span> {t.progressEyebrow}</p>
            <h2 id="progress-title">{t.progressTitle}</h2>
            <p>{t.progressText}</p>
          </div>
          <div className="progress-board" aria-label={locale === 'es' ? 'Estadísticas sintéticas de demo' : 'Synthetic demo statistics'}>
            <div className="progress-board-top"><span>{locale === 'es' ? 'PERFIL DE EJEMPLO' : 'SAMPLE PROFILE'}</span><span aria-hidden="true">↗</span></div>
            <div className="profile-name"><span className="profile-avatar" aria-hidden="true">N</span><span><strong>Nerea</strong><small>{locale === 'es' ? 'La Grada · demo' : 'The Stand · demo'}</small></span><span className="profile-rank">#01</span></div>
            <div className="progress-stat"><span>{t.streak}</span><strong>{t.streakValue}</strong><div className="streak-bars" aria-hidden="true"><i /><i /><i /><i className="is-future" /><i className="is-future" /></div></div>
            <div className="progress-stat progress-stat-bottom"><span>{t.badges}</span><strong>{t.badgesValue}</strong><span aria-hidden="true" className="badge-mark">✳</span></div>
            <small className="synthetic-label">{locale === 'es' ? 'DATOS SINTÉTICOS' : 'SYNTHETIC DATA'}</small>
          </div>
        </section>

        <section aria-labelledby="gallery-title" className="gallery-banner">
          <div className="gallery-photo"><img alt="" loading="lazy" src="/brand/kiniela-pitch-editorial.webp" /></div>
          <div className="gallery-copy"><p className="eyebrow"><span className="section-number">05 /</span> {t.galleryEyebrow}</p><h2 id="gallery-title">{t.galleryTitle}</h2><p>{t.galleryText}</p><a className="text-link text-link-dark" href="#demo">{locale === 'es' ? 'Ver la demo' : 'See the demo'} <ArrowMark /></a></div>
        </section>

        <section aria-labelledby="trailer-title" className="section trailer-section">
          <div className="trailer-copy"><p className="eyebrow"><span className="section-number">06 /</span> {t.trailerEyebrow}</p><h2 id="trailer-title">{t.trailerTitle}</h2><p>{t.trailerText}</p><small>{t.trailerNote}</small></div>
          <div className="trailer-frame"><video controls preload="metadata" poster="/gallery/kiniela-original-app-poster.jpg"><source src="/gallery/kiniela-original-app-trailer.mp4" type="video/mp4" />{locale === 'es' ? 'Tu navegador no puede reproducir este vídeo.' : 'Your browser cannot play this video.'}</video></div>
        </section>

        <section className="section boundary-section" aria-labelledby="included-title">
          <div className="boundary-block boundary-included"><span className="boundary-index">THE SHOWCASE</span><h2 id="included-title">{t.includedTitle}</h2><p>{t.includedText}</p><ul><li>{locale === 'es' ? 'UI responsive y accesible' : 'Responsive, accessible UI'}</li><li>{locale === 'es' ? 'Fixtures locales ficticios' : 'Fictional local fixtures'}</li><li>{locale === 'es' ? 'Sin variables de entorno' : 'No environment variables'}</li></ul></div>
          <div className="boundary-block boundary-private"><span className="boundary-index">INTENTIONALLY PRIVATE</span><h2>{t.privacyTitle}</h2><p>{t.privacyText}</p><a className="text-link text-link-dark" href="https://github.com/ikerperez12/KINIELA-showcase/blob/main/docs/PUBLIC_CONTENT_POLICY.md">{locale === 'es' ? 'Leer la política de contenido' : 'Read the content policy'} <ArrowMark /></a></div>
        </section>
      </main>

      <footer className="site-footer">
        <a aria-label="KINIELA, volver al inicio" className="brand footer-brand" href="#top"><span className="brand-mark">K</span><span>KINIELA</span></a>
        <p>{t.footerLine}</p>
        <div><small>{t.footerTerms}</small><a className="footer-github" href="https://github.com/ikerperez12/KINIELA-showcase">GitHub ↗</a></div>
      </footer>
    </>
  )
}

export default App
