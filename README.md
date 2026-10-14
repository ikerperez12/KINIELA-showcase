<div align="center">
  <img src="public/brand/favicon.svg" width="54" height="54" alt="" />
  <h1>KINIELA</h1>
  <p><strong>Acierta. Afina. Pica a tus amigos.</strong></p>
  <p><strong>PLAY NOW</strong> — pendiente de confirmar por el propietario la URL canónica del juego.</p>
</div>

![KINIELA showcase desktop preview](public/gallery/showcase-desktop.png)

> **Public Showcase / Limited Reference Implementation**  
> This repository is a product gallery and a limited clean-room reference implementation created for demonstration. It does not contain the complete production application. The production scoring engine, backend, data model, security and abuse-prevention systems, integrations, operations, and a substantial portion of KINIELA remain private.
>
> **Galería pública / Implementación de referencia limitada.** Este repositorio muestra el producto e incluye una demo de referencia limitada creada desde cero. No contiene la aplicación de producción completa. El motor de puntuación, backend, modelo de datos, seguridad, prevención de abusos, integraciones, operaciones y una parte sustancial de KINIELA permanecen privados.

## The game

KINIELA is a social football prediction game built around matchday competition, groups, rankings and head-to-head challenges. Make predictions, compare them with friends, and follow a season together.

KINIELA es un juego social de pronósticos de fútbol. Cada jornada se convierte en una excusa para competir con amigos, seguir una clasificación y lanzar retos cara a cara.

## Real app: a matchday, end to end

Captures of the running KINIELA app in guest mode: no account, no backend, predictions kept on the device. They come from a local production build, not from the hosted game.

<video controls preload="metadata" poster="public/gallery/kiniela-walkthrough-guest-poster.jpg" src="public/gallery/kiniela-walkthrough-guest.mp4" width="100%"></video>

*Walkthrough (44 s): home, a full matchday of 1 / X / 2 picks with scorelines, saving as a guest, and the profile page.*

| Home | Picks | Saved |
| --- | --- | --- |
| ![KINIELA home in guest mode](public/gallery/guest-home-desktop.png) | ![Ten predictions entered on one matchday](public/gallery/guest-picks-desktop.png) | ![Predictions saved as a guest](public/gallery/guest-saved-desktop.png) |

| Mobile home | Mobile saved |
| --- | --- |
| ![KINIELA home on a phone-sized viewport](public/gallery/guest-home-mobile.png) | ![Saved matchday on a phone-sized viewport](public/gallery/guest-saved-mobile.png) |

![Matchday cards with saved predictions](public/gallery/guest-matchday-desktop.png)

## Original app trailer

<video controls preload="metadata" poster="public/gallery/kiniela-original-app-poster.jpg" src="public/gallery/kiniela-original-app-trailer.mp4"></video>

Owner-approved captures of the original application, kept as a self-contained media file. The showcase does not connect to the production application.

## Interactive demo stills

These images come from the showcase's own demo, which uses invented fixtures and sample profiles:

![Interactive fictional matchday and leaderboard](public/gallery/showcase-desktop.png)

![Responsive mobile showcase](public/gallery/showcase-mobile.png)

![Fictional group leaderboard](public/gallery/leaderboard-desktop.png)

![Groups, head-to-head and cup modes](public/gallery/competition-modes.png)

![Synthetic profile and progress preview](public/gallery/profile-stats.png)

![Pick, save and review demo flow](public/gallery/predict-save-review.gif)

See the [gallery notes](docs/GALLERY.md) for the asset list and review boundary.

## Matchday experience

Choose a 1, X or 2 outcome for three fictional fixtures, save locally in the page state, and review a precalculated demo outcome. Its display points and explanation are illustrative only; they do not describe or calculate production scoring.

## Groups, H2H & Cup

The product experience includes social groups, head-to-head challenges and cup competition. This showcase describes those player-facing modes without publishing their production rules or implementation.

## Stats & progress

The page includes sample standings, fictional profile details, a streak preview and sample achievements. Every name and value shown in the demo is synthetic.

## Engineering showcase

The reference app uses strict TypeScript, small React components, accessible HTML controls, local fixtures, a reducer for demo UI state, unit tests, Playwright, accessibility checks and a CI pipeline. Its architecture is documented at [docs/ENGINEERING_OVERVIEW.md](docs/ENGINEERING_OVERVIEW.md).

## Demo architecture

<pre><code>Player
  ↓
Showcase UI
  ↓
Demo UI state
  ↓
Demo service interface
  ↓
Local fixture adapter → synthetic fixtures and precomputed outcome</code></pre>

Competitive state in the production game is decided by protected services. This public demo uses local synthetic fixtures and does not connect to production.

## Run the showcase

Requirements: Node.js 24 and npm.

<pre><code>npm ci
npm run dev</code></pre>

The demo needs no environment file, account, API, database or external service. To run checks:

<pre><code>npm run lint
npm run typecheck
npm test
npm run build
npx playwright install chromium
npm run test:e2e
npm run check:forbidden
npm run check:links
npm audit</code></pre>

## What is included

- A responsive product gallery with fictional profiles and fixtures.
- A limited, local-only prediction flow with a precomputed example outcome.
- Reusable presentation components, accessible controls and Spanish/English interface copy.
- Unit tests, browser tests, offline network checks, secret scanning and static analysis workflows.

## What is intentionally private

- Production scoring engine, formulas, rules and private test vectors.
- Production backend, database schema, policies and security systems.
- Match ingestion, data providers, operational tooling and infrastructure.
- Admin and scheduled operations, anti-abuse mechanisms and deployment details.
- A substantial portion of the production features and application.

## Security

Please do not report vulnerabilities in public Issues or Discussions. Use the repository's private vulnerability reporting feature when available; see [SECURITY.md](SECURITY.md).

## Contributing

Contributions are limited to gallery UI, accessibility, translations, documentation and bugs in this isolated demo. Read [CONTRIBUTING.md](CONTRIBUTING.md) first.

## License

This is a **public-source showcase, not an open-source release**. Copyright © 2026 Iker Pérez. All rights reserved. See [LICENSE.md](LICENSE.md) and [NOTICE.md](NOTICE.md).

## Credits

The hero artwork and interactive demo were created specifically for this showcase and use synthetic fixtures. The approved trailer is the only real-product media asset. See [ATTRIBUTION.md](ATTRIBUTION.md).

<div align="center">
  <p><strong>PLAY NOW</strong> — the canonical game URL will be added after owner confirmation.</p>
</div>
