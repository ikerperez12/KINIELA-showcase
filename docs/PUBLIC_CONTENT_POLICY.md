# Public content policy

This repository is a visual gallery and a limited clean-room reference implementation. It is not the production game and must not become a client for production services.

## Allowed

- Product name and player-facing descriptions.
- Original gallery artwork and UI created for this showcase.
- Invented fixtures, players, groups, standings and precomputed demonstration outcomes.
- Owner-approved real product captures included as self-contained gallery media (the product trailer and the guest-mode captures), after a separate rights and privacy review.
- Generic engineering patterns that do not disclose production contracts or structure.
- Documentation, translations, accessibility fixes and tests for the showcase.

## Never add

- Production scoring, rules, formulas, private test vectors or implementation identifiers.
- Production APIs, database models, authorization policies, service credentials or secrets.
- Ingestion, scheduled operations, administration, deployment or infrastructure details.
- Real user data, provider datasets, complete match calendars, unlicensed team marks or private screenshots.
- Local author paths, editor/agent history, logs, terminal captures or production telemetry.

## Demo boundary

The demo uses local synthetic fixtures and a precomputed outcome. It makes no API, database, authentication, analytics, websocket or production service calls. A future Play Now control may only be a direct outbound link to the canonical game URL confirmed by the owner; it must not embed, proxy or programmatically call the game.

Every file and asset added to this repository needs a clean-room origin and a reason to be public. If provenance or rights are uncertain, omit it.

The approved product trailer is a bounded visual exception to the clean-room rule. It is not source code, does not contain account identifiers or operational screens, and must never become a route to production services.
