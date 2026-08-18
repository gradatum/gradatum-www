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
│   └── Base.astro              — HTML shell, meta, font loading, CSS global
├── pages/
│   ├── index.astro             — landing page
│   ├── features.astro          — fiches fonctionnalités (source : data/features.ts)
│   ├── vault.astro · install.astro · use-cases.astro · agents.astro
│   └── features.json.ts        — artefact machine, produit dist/features.json
│                                 (refLabel/status/version uniquement — surface minimale)
├── components/
│   ├── Nav.astro               — top navigation bar
│   ├── Hero.astro              — hero + Cicero quote
│   ├── PropertiesTable.astro   — properties table (roman numerals)
│   ├── ArchDiagram.astro       — SVG architecture diagram (5 swimlanes)
│   ├── VocabularySection.astro — 6 terms (Vault/Locus/Section/Note/Bearer/Preset)
│   ├── StorageSection.astro    — OpenDAL 8 backends grid + gradatum.toml snippet
│   ├── RoadmapSection.astro    — 6 phase cards (P1/P2.0/P2.1/P2.2/P3/P4)
│   ├── RfcSection.astro        — RFC-0001/0002/0003 cards
│   ├── QuickStart.astro        — install + quick commands
│   ├── Footer.astro            — license / contributing / related
│   └── TweaksPanel.astro       — density/typeFamily/dark/diagramMode (vanilla script)
├── styles/
│   └── global.css              — CSS custom properties, reset, typography scale
├── content/
│   └── config.ts               — Zod schemas (rfcSchema, phaseSchema, etc.) + export const collections = {}
└── data/
    ├── phases.ts               — Phase[] Zod-validated (source: PHASES.md)
    ├── rfcs.ts                 — RfcDisplay[] Zod-validated (source: RFC/*.md)
    ├── properties.ts           — Property[] Zod-validated (8 properties)
    └── storage.ts              — StorageBackend[] Zod-validated (8 backends)
```

## Content sources

Tout le contenu est hardcodé TypeScript dans `src/data/` — pas de loaders Astro cross-repo.
Mise à jour manuelle requise quand `gradatum` docs évoluent.

| Fichier | Source manuelle à synchroniser |
|---|---|
| `src/data/phases.ts` | `gradatum/docs/PHASES.md` (markers `gradatum-www:phaseX:start/end`) |
| `src/data/rfcs.ts` | `gradatum/docs/RFC/*.md` (YAML frontmatter `rfc_number`, `status`, etc.) |
| `src/data/properties.ts` | Inline hardcodé (8 propriétés stables) |
| `src/data/storage.ts` | Inline hardcodé (8 backends OpenDAL) |

## Islands

`TweaksPanel.astro` = vanilla `<script>` (pas `client:load`) — DOM direct + localStorage. Aucune dépendance React.

## Deployment

```
push main (Forgejo) → hook pre-push : gate project-map (source ↔ registre :19090)
                    → runner lxc-500 → gate project-map → pnpm build → gh-pages (Forgejo)
                    ⛔ s'arrête là — le site n'est PAS publié

publication        → POST /api/v1/repos/motreffs/gradatum-www/push_mirrors-sync
                    → miroir → GitHub → GitHub Pages sert gradatum.org
```

**La publication est un geste explicite depuis le 2026-08-17** (council 3/3). Le miroir GitHub est
en `sync_on_commit: false` / `interval: 0s` ; le miroir VPS (`10.77.0.2`) reste automatique — copie
interne, c'est voulu. ⚠️ La synchro est **par dépôt, pas par miroir** : publier pousse aussi le VPS.

Il n'existe **aucun GitHub Actions** sur ce dépôt : tout passe par la CI Forgejo puis le miroir.

**Contrôles** — deux objets contrôlés, chacun avec un comparateur unique.

*1. Synchronisation project-map* — comparateur `computeDrift` (`scripts/project-map-gate.mjs`) :
- avant push : `scripts/hooks/pre-push` → source `data/features.ts` ↔ registre
- après publication : `scripts/published-check.mjs` (sonde quotidienne côté `homelab-scripts`)
  → `gh-pages/features.json` lu sur `raw.githubusercontent` ↔ registre. Trois issues : conforme,
  divergent, **je n'ai pas pu lire** — cette dernière n'est jamais rendue comme un succès.

**Contrat de sortie — commun aux DEUX dispositifs ci-dessus** (`project-map-gate.mjs` et
`published-check.mjs`), trois états jamais deux : `0` conforme (mesuré) · `1` écart **réellement
mesuré** · `2` **incapable de conclure**. Toute cécité emprunte `2` :

| Dispositif | Chemins rendant `2` |
|---|---|
| `project-map-gate.mjs` | clé absente · export injoignable · **export vide** · **fichiers site illisibles** |
| `published-check.mjs` | artefact publié illisible (404, réseau, schéma) · vault injoignable · **registre master vide** |

Un contrôle qui n'a rien lu n'a rien mesuré : se déclarer « en écart » enverrait chercher un
écart inexistant et rendrait indiscernables « c'est désynchronisé » et « je n'ai pas pu regarder ».
⚠️ Piège commun aux deux : `fetchExport()` rend `[]` — *truthy* — sur un registre vide, donc un
garde `if (!master)` ne l'attrape pas ; il faut un test explicite sur la longueur.

Asymétrie assumée dans `published-check.mjs` : un **registre master** vide aveugle (`2`), un
**artefact publié** vide est une mesure (`1` — le site publié ne montre réellement aucune feature).
`published` est l'objet mesuré, `master` la référence.

Aucun consommateur (hook `pre-push`, CI, sonde quotidienne) ne doit reclasser un code par lecture
du texte de sortie : **les libellés ne sont pas un contrat, le code de sortie l'est.**

⚠️ L'export project-map **ne déduplique pas** : un même numéro peut porter plusieurs cartes.
`computeDrift` **détecte** cette multiplicité (`DUPLICATE`) au lieu de la résoudre en silence, et
son verdict ne dépend d'aucun ordre de sortie — API HTTP et CLI `gradatum-admin` rendent le même
tableau d'erreurs, élément par élément (F-192).

*2. Versions affichées* — comparateur `checkRenderedVersions`
(`scripts/rendered-version-check.mjs`), contre la **release publiée** de `gradatum/gradatum` :
- avant push : `scripts/hooks/pre-push` + CI Forgejo → `astro build` puis contrôle du **rendu**
  produit (`--dist`). Pas les sources : un composant retiré d'une page n'apparaît pas dans le HTML
  et n'est donc pas contrôlé ; un composant inclus est nécessairement vu.
- après publication : même script en `--served`, sur le HTML réellement téléchargé depuis
  `gradatum.org` (pages découvertes via le sitemap servi). **Pas encore branché sur la sonde** —
  activation possible dès que la première publication portant les marqueurs est en ligne.

Les chaînes restent écrites **à la main** dans les composants : le contrôle **vérifie**, il ne
dérive pas. L'attribut `data-gradatum-version="current"` déclare seulement « cette chaîne prétend
être la version publiée courante » — les mentions historiques (« removed in v2.0.0 », « SemVer
strict since v1.0.0 ») n'en portent pas et ne doivent jamais suivre le tag courant. Les noms
d'archives (`gradatum-*-vX.Y.Z*.tar.gz`) sont contrôlés sans marqueur, par leur forme, contre la
liste des artefacts réellement publiés : un visiteur les copie (F-183).

Domain cible : `gradatum.org` (CNAME dans `public/CNAME`).

Domain cible : `gradatum.org` (CNAME dans `public/CNAME`). DNS 4×A apex à propager.
