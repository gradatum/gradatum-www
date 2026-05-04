# CLAUDE-GRADATUM-WWW.md

## Contexte

Landing page statique pour le projet OSS **Gradatum** — memory backbone for AI agents (Rust + SQLite + Tantivy).

- **Domaine** : `gradatum.org` (acquis par Stéphane, DNS à configurer post-deploy)
- **Hosting** : GitHub Pages (branche `gh-pages`, custom domain)
- **Stack** : Astro SSG + TypeScript strict + CSS custom properties
- **Design** : Direction A "Editorial" — Cormorant Garamond, papier crème, ambiance Ars Memoriae, numérotation romaine
- **Chemin** : A (site statique, pas de service LIVE homelab)

## Architecture

Voir `ARCHITECTURE.md` pour l'arbre complet.

- Zero-JS par défaut (Astro SSG)
- Seul composant interactif : `TweaksPanel` (island `client:load`) — density/typeFamily/dark/diagramMode
- Sources de contenu : `../gradatum/` (repo sibling, lecture CI uniquement)

## Repos

- **Forgejo origin** : `http://localhost:3000/motreffs/gradatum-www`
- **GitHub mirror PUBLIC** : `https://github.com/mymomot/gradatum-www`
- **Branche deploy** : `gh-pages` (artifact CI, pas de push manuel)

## État actuel

- Version : 0.1.0
- Statut : scaffolding → implémentation
- Port : N/A (site statique)
- Dernière MAJ : 2026-05-04

## DNS — Instructions Stéphane

Pour finaliser `gradatum.org` → GitHub Pages :

1. Ajouter ces 4 enregistrements A apex chez le registrar :
   - `185.199.108.153`
   - `185.199.109.153`
   - `185.199.110.153`
   - `185.199.111.153`
2. Optionnel CNAME `www` → `mymomot.github.io`
3. GitHub : Settings → Pages → Custom domain = `gradatum.org` + Enable HTTPS
4. Le fichier `public/CNAME` dans le repo contient déjà `gradatum.org`
5. Propagation DNS : 5 min à 48h selon registrar

## CI/CD

`.forgejo/workflows/build-deploy.yaml` :
- Trigger : push sur `main`
- Runner : `lxc-500` (forge-actions, accès local aux deux repos)
- Steps : checkout gradatum-www + checkout gradatum (sibling) → pnpm install → pnpm build → push dist/ vers gh-pages

## Roadmap

- Phase 1 (actuelle) : scaffold + composants statiques + CI + deploy
- Phase 2 (future) : wire content collections depuis gradatum repo automatiquement
- Phase 3 (future) : changelog dynamique + badges version

## Ajustements contenu vs proto Claude Design

Le proto (2026-05-04 16:38 UTC) a des hardcodes à corriger :
1. Phase 2 monolithique → décomposée P2.0/P2.1/P2.2 (voir docs/PHASES.md)
2. GitHub URL `gradatum/gradatum` → `mymomot/gradatum`
3. Install URL `gradatum.io` → `gradatum.org`
4. RFC-0002 cross-platform + RFC-0003 HTTP/MCP → sections dédiées
5. Status badge `v0.1.0-alpha LIVE` + `244 tests` + `22 crates`
