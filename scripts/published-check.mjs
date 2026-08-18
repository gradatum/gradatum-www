#!/usr/bin/env node

/**
 * published-check.mjs
 *
 * Contrôle POST-publication : compare ce qui est réellement publié
 * (dist/features.json déployé sur gh-pages) au registre project-map
 * du serveur gradatum.
 *
 * Distinct de project-map-gate.mjs, qui compare la SOURCE (features.ts) —
 * jamais le résultat publié. Celui-ci vérifie l'artefact livré.
 *
 * RÈGLE — un seul comparateur : la logique de comparaison (computeDrift,
 * qui consomme mapToSiteStatus en interne) est importée depuis
 * project-map-gate.mjs, jamais réimplémentée ici. Ce script n'ajoute que
 * la mécanique de lecture de l'artefact publié.
 *
 * Exit codes — MÊME contrat que project-map-gate.mjs, trois états jamais deux :
 *   0 = publié et conforme (mesuré)
 *   1 = divergence RÉELLEMENT MESURÉE (les deux côtés lus, et ça diverge)
 *   2 = incapable de conclure (fail-closed) : artefact publié illisible (404,
 *       réseau, JSON/schéma invalide), vault injoignable, ou registre master
 *       VIDE — ne doit JAMAIS se rendre comme un succès, ni comme un `1`.
 *
 * Un registre vide n'est pas une divergence : c'est l'absence de référence à
 * laquelle comparer. Asymétrie assumée avec un artefact publié vide, lui
 * PARFAITEMENT mesuré (le site publié ne montre réellement aucune feature) —
 * `published` est l'objet mesuré, `master` la référence. Vider la référence
 * aveugle ; vider l'objet mesuré est un constat.
 */

import { fileURLToPath } from 'node:url';
import { fetchExport, computeDrift } from './project-map-gate.mjs';

const FETCH_TIMEOUT_MS = 10_000;

// Domaine gh-pages brut, PAS https://gradatum.org (cache varnish max-age=600 —
// rendrait des faux positifs juste après publication).
const PUBLISHED_URL =
  process.env.PUBLISHED_FEATURES_URL ??
  'https://raw.githubusercontent.com/gradatum/gradatum-www/gh-pages/features.json';

// ---------------------------------------------------------------------------
// Lecture de l'artefact publié
// ---------------------------------------------------------------------------

/**
 * Vérifie qu'une entrée porte refLabel/status/version, tous trois des
 * chaînes non vides. Un artefact au mauvais schéma doit se lire
 * ILLISIBLE (exit 2), jamais DIVERGENT (exit 1) — les deux erreurs ne
 * doivent jamais se confondre.
 *
 * @param {unknown} entry
 * @returns {boolean}
 */
function isValidEntry(entry) {
  return (
    entry !== null &&
    typeof entry === 'object' &&
    typeof entry.refLabel === 'string' && entry.refLabel.length > 0 &&
    typeof entry.status === 'string' && entry.status.length > 0 &&
    typeof entry.version === 'string' && entry.version.length > 0
  );
}

/**
 * Récupère le features.json réellement publié sur gh-pages.
 *
 * @returns {Promise<Array<{refLabel:string,status:string,version:string}> | null>}
 *   null si la lecture échoue (404, réseau, timeout, JSON invalide,
 *   ou entrée ne respectant pas le schéma refLabel/status/version).
 */
export async function fetchPublished() {
  let res;
  try {
    res = await fetch(PUBLISHED_URL, {
      signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
    });
  } catch (err) {
    console.error(`[PUBLISHED-CHECK] Erreur réseau sur ${PUBLISHED_URL} : ${err.message}`);
    return null;
  }

  if (!res.ok) {
    console.error(`[PUBLISHED-CHECK] Artefact publié introuvable : HTTP ${res.status} sur ${PUBLISHED_URL}`);
    return null;
  }

  let body;
  try {
    body = await res.json();
  } catch (err) {
    console.error(`[PUBLISHED-CHECK] JSON publié invalide : ${err.message}`);
    return null;
  }

  if (!Array.isArray(body)) {
    console.error('[PUBLISHED-CHECK] JSON publié inattendu : racine non-tableau');
    return null;
  }

  const invalidIndex = body.findIndex((entry) => !isValidEntry(entry));
  if (invalidIndex !== -1) {
    console.error(
      `[PUBLISHED-CHECK] Schéma publié invalide : entrée[${invalidIndex}] ne porte pas ` +
      `refLabel/status/version (chaînes non vides) — reçu ${JSON.stringify(body[invalidIndex])}`
    );
    return null;
  }

  return body;
}

// ---------------------------------------------------------------------------
// Orchestrateur I/O
// ---------------------------------------------------------------------------

/**
 * Point d'entrée principal du contrôle post-publication.
 * Retourne le code de sortie (0/1/2) — NE fait PAS process.exit() lui-même.
 *
 * Dépendances d'I/O injectables, comme runGate : c'est le seul moyen de
 * PROUVER par test la discrimination entre « ça diverge » (1) et « je n'ai
 * pas pu conclure » (2).
 *
 * @param {{fetchPublished?:Function, fetchExport?:Function}} [deps]
 * @returns {Promise<number>}
 */
export async function runPublishedCheck(deps = {}) {
  const io = { fetchPublished, fetchExport, ...deps };

  console.log('[PUBLISHED-CHECK] Démarrage vérification post-publication...');
  console.log(`[PUBLISHED-CHECK] Source publiée : ${PUBLISHED_URL}`);

  const published = await io.fetchPublished();
  if (!published) {
    console.error('[PUBLISHED-CHECK] FAIL-CLOSED : je n\'ai pas pu lire l\'artefact publié');
    return 2;
  }
  console.log(`[PUBLISHED-CHECK] Publié : ${published.length} features`);

  const master = await io.fetchExport();
  if (!master) {
    console.error('[PUBLISHED-CHECK] FAIL-CLOSED : je n\'ai pas pu lire le registre master (vault injoignable)');
    return 2;
  }

  // Registre master vide = plus de référence à laquelle comparer. Le contrôle
  // n'a rien mesuré : c'est une cécité, pas une divergence publiée. Sans ce
  // garde, computeDrift rend MASTER_EMPTY et la sonde quotidienne annoncerait
  // « artefact publié divergent » sur un vault vide — accusation fausse d'un
  // artefact sain. Même traitement que runGate (fetchExport rend `[]`, truthy,
  // sur un export vide : le garde `!master` ci-dessus ne l'attrape pas).
  if (master.length === 0) {
    console.error('[PUBLISHED-CHECK] FAIL-CLOSED : registre master vide — conformité non vérifiable');
    return 2;
  }
  console.log(`[PUBLISHED-CHECK] Master export : ${master.length} features`);

  // Pas de roadmap publié dans features.json (surface minimale, cf features.json.ts)
  // → siteRoadmap vide, le check 3 (ROADMAP_ORPHAN) de computeDrift ne s'applique
  // pas ici : ce contrôle porte sur le triplet publié, pas sur roadmap.ts.
  const { errors } = computeDrift(master, published, {});

  console.log('[PUBLISHED-CHECK] ========== RÉSULTATS ==========');
  if (errors.length === 0) {
    console.log('[PUBLISHED-CHECK] ✓ PASS : artefact publié conforme au master');
    return 0;
  }

  console.error(`[PUBLISHED-CHECK] ✗ FAIL : ${errors.length} écart(s) publié(s) :`);
  for (const err of errors) {
    console.error(`  - ${err}`);
  }
  return 1;
}

// ---------------------------------------------------------------------------
// Point d'entrée CLI — process.exit UNIQUEMENT ici
// ---------------------------------------------------------------------------

const isMain = process.argv[1] === fileURLToPath(import.meta.url);
if (isMain) {
  try {
    const code = await runPublishedCheck();
    process.exit(code);
  } catch (err) {
    console.error(`[PUBLISHED-CHECK] Erreur inattendue : ${err.message}`);
    process.exit(2);
  }
}
