# gradatum-www — Dependencies

> Generated at scaffold time. Run `pnpm ls` for current tree.
> Delta 2026-09-16 (`18c03e1..c8a5886`): content-only commits (`features.ts`, `roadmap.ts`,
> site copy) — `package.json` untouched, no dependency change.

## Runtime dependencies

None — Astro SSG produces static HTML/CSS. Zero runtime JS dependencies by default.

## Build dependencies

| Package | Version | Role |
|---|---|---|
| `astro` | 5.7.1 | SSG framework (re-exports zod via astro/zod) |
| `typescript` | ^5.x | Type checking |
| `@astrojs/sitemap` | latest | sitemap.xml generation |
| `esbuild` | ^0.25.x | Bundler natif Astro (devDep explicite) |

## Dev dependencies

| Package | Role |
|---|---|
| `@types/node` | Node type definitions |

## Validation runtime

`zod` via `astro/zod` (re-export Astro — pas d'install séparé). Validation des schemas RFC/Phase au build time.

## CDN fonts (loaded in Base.astro `<link>`)

- Cormorant Garamond (400/500/600 italic) — Google Fonts
- Inter (400/500) — Google Fonts  
- JetBrains Mono (400/500) — Google Fonts

No npm font packages — loaded via `<link preconnect>` + `<link stylesheet>` in layout.
