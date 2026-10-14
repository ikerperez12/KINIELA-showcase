# Engineering overview

This small app exists to demonstrate frontend quality without exposing production logic.

<pre><code>Player
  ↓
Responsive showcase UI
  ↓
Demo reducer
  ↓
DemoGameService
  ↓
Fixture adapter
  ↓
Synthetic local data and precomputed display outcome</code></pre>

The browser owns only presentation state in this demo. The fixture adapter returns a fixed example result; it does not calculate points. Nothing is persisted or sent over the network.

The production game makes competitive decisions in protected server-side systems. Those systems, rules, storage and operational boundaries are not modeled here.

## Quality checks

- Strict TypeScript with unchecked indexed access enabled.
- Semantic HTML, visible keyboard focus, skip navigation and reduced-motion support.
- Vitest checks for the local adapter and demo reducer.
- Playwright checks the interaction, responsive width, accessibility and outbound network isolation.
- CI runs lint, types, tests, build, production dependency audit, forbidden-pattern scan and Gitleaks. CodeQL runs with least-privilege workflow permissions.
