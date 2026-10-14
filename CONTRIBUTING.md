# Contributing

Contributions may improve the gallery UI, accessibility, translations, documentation, tests or bugs in this local demo.

The demo must remain independent of the live game. Do not add production API calls, scraping, credentials, real match datasets, administrative controls, private rules or production backend behavior. Do not submit code that reconstructs production scoring or operational systems.

Before opening a pull request, run <code>npm ci</code>, <code>npm run check:forbidden</code>, <code>npm run check:links</code>, <code>npm run lint</code>, <code>npm run typecheck</code>, <code>npm test</code>, <code>npm run build</code>, <code>npm audit</code> and <code>npm run test:e2e</code>. Keep changes focused and include a screenshot for visible UI changes. The forbidden-pattern denylist is stored encoded in <code>scripts/forbidden-policy.b64</code>; the comment in <code>scripts/check-forbidden.mjs</code> explains how to update it.
