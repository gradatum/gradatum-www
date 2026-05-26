# gradatum-www

Landing page for [Gradatum](https://github.com/gradatum/gradatum) — memory backbone for AI agents.

Built with [Astro](https://astro.build) SSG. Deployed to [gradatum.org](https://gradatum.org) via GitHub Pages.

## Development

```bash
pnpm install
pnpm dev         # localhost:4321
pnpm build       # dist/
pnpm preview     # preview dist/
```

## Architecture

- `src/components/` — Astro components (zero-JS by default, tweaks panel = island)
- `src/layouts/` — page layout
- `src/pages/` — Astro pages (index.astro)
- `src/styles/` — global CSS (custom properties, no CSS-in-JS)
- `src/data/` — TOML data files (storage backends, properties)

Content sources are read from `../gradatum/` during CI build.

## Deployment

CI: `.forgejo/workflows/build-deploy.yaml` — builds on push main, pushes `dist/` to `gh-pages` branch.
GitHub Pages serves `gh-pages` at `gradatum.org`.

## License

Apache-2.0 — same as Gradatum.
