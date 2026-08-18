#!/usr/bin/env node

/**
 * rendered-version-check.mjs
 *
 * F-183 — les chaînes de version affichées sur le site sont recopiées à la
 * main dans plusieurs composants (nav, pied de page, section d'installation,
 * méta roadmap), noms d'archives téléchargeables compris. Un visiteur les
 * COPIE : si elles pointent une version dont les artefacts n'existent plus,
 * sa commande d'installation échoue.
 *
 * Ce contrôle VÉRIFIE ces chaînes — il ne les dérive pas. Elles restent
 * écrites à la main dans les composants ; le marqueur `data-gradatum-version`
 * déclare seulement « cette chaîne prétend être la version publiée courante »,
 * ce qui la rend comparable à la référence.
 *
 * Il porte sur le RENDU, pas sur les sources : un composant qui n'est plus
 * inclus dans une page n'apparaît pas dans le HTML et n'est donc pas contrôlé ;
 * un composant inclus est nécessairement vu.
 *
 * DEUX MODES — cf. « L'ARBITRAGE » plus bas :
 *   --dist [dir]        rendu local du commit qu'on s'apprête à pousser
 *                       (utilisé par scripts/hooks/pre-push)
 *   --served [baseUrl]  rendu réellement servi au public
 *                       (utilisé par scripts/published-check.mjs, sonde
 *                       post-publication)
 *
 * L'ARBITRAGE (criteres 2 et 4 de F-183 sont en tension) :
 *   « le rendu réellement servi » suppose d'interroger le site en ligne ;
 *   « au moment du push » vise un rendu qui n'est PAS encore publié. Les deux
 *   ne peuvent pas être satisfaits par un seul contrôle. Résolution — la même
 *   forme à deux temps que celle arbitrée le 2026-08-17 pour project-map :
 *     · au push (bloquant)  : on rend le commit (`astro build`) et on contrôle
 *       le HTML produit. C'est le rendu, pas les sources — et ce sont les
 *       octets qui DEVIENDRONT les octets servis (hébergement statique, aucune
 *       transformation côté serveur).
 *     · après publication   : on contrôle le HTML réellement téléchargé depuis
 *       le domaine public. Seul ce temps ferme l'écart que le push ne peut pas
 *       fermer (publication non faite, miroir en retard, mauvaise branche
 *       servie, cache).
 *   Un seul scanner et un seul comparateur pour les deux temps — même règle
 *   que « un seul comparateur » posée pour computeDrift.
 *
 * Exit codes :
 *   0 = rendu conforme à la référence
 *   1 = écart détecté (liste des écarts)
 *   2 = référence ou rendu illisible (fail-closed) — jamais rendu comme succès
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, '..');

const FETCH_TIMEOUT_MS = 10_000;

// Référence d'autorité : la release publiée du dépôt public. C'est elle qui
// détermine à la fois le tag courant et les noms d'archives réellement
// téléchargeables — donc ce qu'un visiteur peut effectivement récupérer.
const RELEASE_API =
  process.env.GRADATUM_RELEASE_API ??
  'https://api.github.com/repos/gradatum/gradatum/releases/latest';

const SERVED_BASE = process.env.GRADATUM_SITE_URL ?? 'https://gradatum.org';

// Marqueur porté par les chaînes qui prétendent être la version publiée
// courante. Les mentions HISTORIQUES (« removed in v2.0.0 », « SemVer strict
// since v1.0.0 ») n'en portent PAS : ce sont des faits sur une release donnée,
// vrais pour toujours, qui ne doivent jamais suivre le tag courant.
const MARKER_ATTR = 'data-gradatum-version';
const MARKER_VALUE = 'current';

// <span data-gradatum-version="current">v2.0.0</span>
const MARKER_RE = new RegExp(
  `<([a-zA-Z][a-zA-Z0-9]*)(?=[^>]*\\s${MARKER_ATTR}="${MARKER_VALUE}")[^>]*>([^<]*)</\\1>`,
  'g'
);
const MARKER_ATTR_RE = new RegExp(`\\s${MARKER_ATTR}="${MARKER_VALUE}"`, 'g');

// gradatum-server-v2.0.0-x86_64-unknown-linux-gnu.tar.gz · gradatum-sbom-v2.0.0.tar.gz
const ARCHIVE_RE = /gradatum-[a-z0-9]+-v\d+\.\d+\.\d+[A-Za-z0-9._-]*\.tar\.gz/g;

// ---------------------------------------------------------------------------
// Comparateur — fonction PURE, testable sans I/O ni réseau
// ---------------------------------------------------------------------------

/**
 * Extrait le texte qui PRÉCÈDE une occurrence, pour rendre un écart
 * localisable à l'oeil dans la page. Sans ça, quatorze chaînes périmées
 * rendent quatorze lignes d'erreur indiscernables.
 *
 * @param {string} html
 * @param {number} index
 * @returns {string}
 */
function contextBefore(html, index) {
  return html
    .slice(Math.max(0, index - 160), index)
    .replace(/<[^>]*>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(-48);
}

/**
 * Contrôle un ensemble de pages rendues contre la référence publiée.
 *
 * @param {Array<{name:string, html:string}>} pages
 * @param {{tag:string, assetNames:string[]}} reference
 * @returns {{ errors: string[], markerCount: number, archiveCount: number }}
 */
export function checkRenderedVersions(pages, reference) {
  const errors = [];
  let markerCount = 0;
  let archiveCount = 0;

  if (!reference || typeof reference.tag !== 'string' || reference.tag.length === 0) {
    errors.push('REFERENCE_EMPTY: référence de version publiée absente ou illisible');
    return { errors, markerCount, archiveCount };
  }
  const assetNames = new Set(reference.assetNames ?? []);

  for (const page of pages) {
    // ── Check A : chaînes déclarées « version publiée courante »
    const declared = [...page.html.matchAll(MARKER_ATTR_RE)].length;
    const matched = [...page.html.matchAll(MARKER_RE)];
    markerCount += matched.length;

    if (matched.length !== declared) {
      // Un marqueur non apparié = une chaîne silencieusement non contrôlée.
      // Se rendre illisible, jamais conforme.
      errors.push(
        `MARKER_UNPARSED: ${page.name} — ${declared} marqueur(s) ${MARKER_ATTR} déclaré(s), ` +
        `${matched.length} lu(s) ; la chaîne échappe au contrôle`
      );
    }

    for (const m of matched) {
      const shown = m[2].trim();
      if (shown !== reference.tag) {
        errors.push(
          `VERSION_STALE: ${page.name} — affiche "${shown}" alors que la version publiée ` +
          `de référence est "${reference.tag}" (contexte : «…${contextBefore(page.html, m.index)}»)`
        );
      }
    }

    // ── Check B : noms d'archives téléchargeables (structurel, sans marqueur)
    // Un visiteur copie ce nom : il doit exister parmi les artefacts publiés.
    for (const name of new Set(page.html.match(ARCHIVE_RE) ?? [])) {
      archiveCount += 1;
      if (!assetNames.has(name)) {
        errors.push(
          `ARCHIVE_UNKNOWN: ${page.name} — l'archive "${name}" n'existe pas parmi les ` +
          `artefacts publiés de ${reference.tag} (${[...assetNames].join(', ') || 'aucun'})`
        );
      }
    }
  }

  // ── Check C : non-vacuité. Sans marqueur nulle part, le contrôle passerait
  // au vert en ne contrôlant rien — c'est exactement le défaut armé qu'il doit
  // désamorcer.
  if (markerCount === 0) {
    errors.push(
      `VACUOUS: aucune chaîne ${MARKER_ATTR}="${MARKER_VALUE}" dans le rendu ` +
      `(${pages.length} page(s)) — le contrôle ne vérifierait rien`
    );
  }

  return { errors, markerCount, archiveCount };
}

// ---------------------------------------------------------------------------
// Référence publiée
// ---------------------------------------------------------------------------

/**
 * Lit la release publiée de référence.
 *
 * @returns {Promise<{tag:string, assetNames:string[]} | null>} null = illisible
 */
export async function fetchReference() {
  let res;
  try {
    res = await fetch(RELEASE_API, {
      headers: { Accept: 'application/vnd.github+json' },
      signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
    });
  } catch (err) {
    console.error(`[RENDER-CHECK] Erreur réseau sur ${RELEASE_API} : ${err.message}`);
    return null;
  }
  if (!res.ok) {
    console.error(`[RENDER-CHECK] Référence publiée illisible : HTTP ${res.status} sur ${RELEASE_API}`);
    return null;
  }

  let body;
  try {
    body = await res.json();
  } catch (err) {
    console.error(`[RENDER-CHECK] JSON de release invalide : ${err.message}`);
    return null;
  }

  const tag = typeof body?.tag_name === 'string' ? body.tag_name : null;
  if (!tag) {
    console.error('[RENDER-CHECK] Release sans tag_name — référence inexploitable');
    return null;
  }
  const assetNames = Array.isArray(body.assets)
    ? body.assets.map((a) => a?.name).filter((n) => typeof n === 'string')
    : [];

  return { tag, assetNames };
}

// ---------------------------------------------------------------------------
// Lecture du rendu — deux sources, même forme
// ---------------------------------------------------------------------------

/**
 * Rendu local : le HTML produit par `astro build` pour le commit courant.
 *
 * @param {string} distDir
 * @returns {Array<{name:string, html:string}> | null}
 */
export function readDistPages(distDir) {
  const root = path.isAbsolute(distDir) ? distDir : path.join(projectRoot, distDir);
  if (!fs.existsSync(root)) {
    console.error(`[RENDER-CHECK] Répertoire de rendu absent : ${root} (lancer le build d'abord)`);
    return null;
  }

  const pages = [];
  const walk = (dir) => {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) walk(full);
      else if (entry.isFile() && entry.name.endsWith('.html')) {
        pages.push({ name: path.relative(root, full), html: fs.readFileSync(full, 'utf-8') });
      }
    }
  };
  walk(root);

  if (pages.length === 0) {
    console.error(`[RENDER-CHECK] Aucune page HTML sous ${root}`);
    return null;
  }
  pages.sort((a, b) => (a.name < b.name ? -1 : a.name > b.name ? 1 : 0));
  return pages;
}

/**
 * Rendu servi : le HTML réellement téléchargé depuis le domaine public.
 * Les pages sont découvertes depuis le sitemap SERVI — le contrôle n'utilise
 * aucune connaissance locale de ce que le site est censé contenir.
 *
 * @param {string} baseUrl
 * @returns {Promise<Array<{name:string, html:string}> | null>}
 */
export async function fetchServedPages(baseUrl) {
  const base = baseUrl.replace(/\/$/, '');

  const get = async (url) => {
    const res = await fetch(url, {
      headers: { 'Cache-Control': 'no-cache' },
      signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status} sur ${url}`);
    return res.text();
  };
  const locs = (xml) => [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1].trim());

  let urls;
  try {
    const index = await get(`${base}/sitemap-index.xml`);
    urls = [];
    for (const sm of locs(index)) urls.push(...locs(await get(sm)));
  } catch (err) {
    console.error(`[RENDER-CHECK] Sitemap servi illisible : ${err.message}`);
    return null;
  }

  if (urls.length === 0) {
    console.error(`[RENDER-CHECK] Sitemap servi vide sur ${base}`);
    return null;
  }

  const pages = [];
  for (const url of urls) {
    try {
      pages.push({ name: url, html: await get(url) });
    } catch (err) {
      console.error(`[RENDER-CHECK] Page servie illisible : ${err.message}`);
      return null;
    }
  }
  pages.sort((a, b) => (a.name < b.name ? -1 : a.name > b.name ? 1 : 0));
  return pages;
}

// ---------------------------------------------------------------------------
// Orchestrateur I/O
// ---------------------------------------------------------------------------

/**
 * @param {{mode?: 'dist'|'served', target?: string}} [opts]
 * @returns {Promise<number>} 0 | 1 | 2
 */
export async function runRenderedVersionCheck(opts = {}) {
  const mode = opts.mode ?? 'dist';
  const target = opts.target ?? (mode === 'served' ? SERVED_BASE : 'dist');

  console.log(`[RENDER-CHECK] Mode ${mode} — cible ${target}`);

  const reference = await fetchReference();
  if (!reference) {
    console.error('[RENDER-CHECK] FAIL-CLOSED : référence de version publiée illisible');
    return 2;
  }
  console.log(
    `[RENDER-CHECK] Référence publiée : ${reference.tag} ` +
    `(${reference.assetNames.length} artefact(s))`
  );

  const pages = mode === 'served'
    ? await fetchServedPages(target)
    : readDistPages(target);
  if (!pages) {
    console.error('[RENDER-CHECK] FAIL-CLOSED : rendu illisible');
    return 2;
  }
  console.log(`[RENDER-CHECK] Rendu lu : ${pages.length} page(s)`);

  const { errors, markerCount, archiveCount } = checkRenderedVersions(pages, reference);
  console.log(
    `[RENDER-CHECK] Contrôlé : ${markerCount} chaîne(s) de version courante, ` +
    `${archiveCount} nom(s) d'archive`
  );

  console.log('[RENDER-CHECK] ========== RÉSULTATS ==========');
  if (errors.length === 0) {
    console.log(`[RENDER-CHECK] ✓ PASS : le rendu affiche ${reference.tag}, conforme au publié`);
    return 0;
  }

  console.error(`[RENDER-CHECK] ✗ FAIL : ${errors.length} écart(s) :`);
  for (const err of errors) console.error(`  - ${err}`);
  return 1;
}

// ---------------------------------------------------------------------------
// Point d'entrée CLI — process.exit UNIQUEMENT ici
// ---------------------------------------------------------------------------

const isMain = process.argv[1] === fileURLToPath(import.meta.url);
if (isMain) {
  const argv = process.argv.slice(2);
  const mode = argv.includes('--served') ? 'served' : 'dist';
  const flagIdx = argv.indexOf(mode === 'served' ? '--served' : '--dist');
  const next = flagIdx !== -1 ? argv[flagIdx + 1] : undefined;
  const target = next && !next.startsWith('--') ? next : undefined;

  try {
    process.exit(await runRenderedVersionCheck({ mode, target }));
  } catch (err) {
    console.error(`[RENDER-CHECK] Erreur inattendue : ${err.message}`);
    process.exit(2);
  }
}
