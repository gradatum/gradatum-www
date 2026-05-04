# gradatum-www — Architecture

> Static site generator landing page for Gradatum OSS project.

## Stack

- **Astro 5** SSG — zero-JS by default, islands for interactive components
- **TypeScript strict** — `noImplicitAny`, `strict: true`
- **CSS custom properties** — no CSS-in-JS, no Tailwind (pure custom props)
- **GitHub Pages** — deployment target (`gh-pages` branch)

## Component tree

```
src/
├── layouts/
│   └── Base.astro          — HTML shell, meta, font loading, CSS global
├── pages/
│   └── index.astro         — single landing page
├── components/
│   ├── Nav.astro           — top navigation bar
│   ├── Hero.astro          — hero + Cicero quote
│   ├── WhySection.astro    — problem / Gradatum answer (2-col)
│   ├── PropertiesTable.astro — properties table (roman numerals)
│   ├── ArchDiagram.astro   — SVG architecture diagram (5 swimlanes)
│   ├── Vocabulary.astro    — 6 terms (Vault/Locus/Section/Note/Bearer/Preset)
│   ├── MultiStorage.astro  — OpenDAL 8 backends grid + gradatum.toml snippet
│   ├── RoadmapSection.astro — 4 phase cards (P1/P2.0+P2.1+P2.2/P3/P4)
│   ├── RfcCards.astro      — RFC-0001/0002/0003 cards
│   ├── QuickStart.astro    — install + quick commands
│   ├── Footer.astro        — license / contributing / related
│   └── TweaksPanel.astro   — island: density/typeFamily/dark/diagramMode
├── styles/
│   └── global.css          — CSS custom properties, reset, typography scale
└── data/
    ├── storage.toml        — 8 OpenDAL storage backends
    └── properties.toml     — properties table rows
```

## Content sources (CI build)

Read from `../gradatum/` (sibling repo, local to LXC 500 runner):

| File | Used in |
|---|---|
| `../gradatum/docs/PHASES.md` | RoadmapSection — phase cards |
| `../gradatum/docs/RFC/RFC-0001-*.md` | RfcCards |
| `../gradatum/docs/RFC/RFC-0002-*.md` | RfcCards |
| `../gradatum/docs/RFC/RFC-0003-*.md` | RfcCards |
| `../gradatum/CHANGELOG.md` | StatusBadge version |

## Islands

Only `TweaksPanel.astro` uses `client:load` (interactive JS). All other components are static Astro.

## Deployment

```
push main → Forgejo CI → pnpm build → push dist/ to gh-pages → GitHub Pages
```
