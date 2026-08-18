#!/usr/bin/env node

/**
 * project-map-gate.mjs
 *
 * CI gate : vérifie que features.ts + roadmap.ts sont synchronisés avec le
 * project-map master de gradatum.
 *
 * Exit codes — trois états, jamais deux :
 *   0 = conformance vérifiée
 *   1 = dérive RÉELLEMENT MESURÉE (le gate a comparé, et ça diverge)
 *   2 = incapable de conclure (fail-closed) : clé absente, export injoignable,
 *       export vide, ou fichiers site illisibles.
 *
 * `1` n'est PAS un fourre-tout. Un gate qui n'a rien pu lire n'a rien mesuré :
 * se déclarer « en dérive » enverrait chercher un écart qui n'existe pas, et
 * rendrait indiscernables « le site est désynchronisé » et « je n'ai pas pu
 * regarder ». C'est la classe de défaut que F-192 corrige dans computeDrift —
 * rendre un verdict ferme sur une mesure non faite ; elle vaut aussi pour le
 * code de sortie du dispositif lui-même.
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, '..');

const EXPORT_TIMEOUT_MS = 10_000;
const VAULT_SERVER = process.env.VAULT_SERVER ?? 'http://127.0.0.1:19090';
// Clé API gradatum — obligatoire pour le gate ; absente = fail-closed exit 2.
const GRADATUM_API_KEY = process.env.GRADATUM_API_KEY ?? null;

// ---------------------------------------------------------------------------
// Auth + Fetch
// ---------------------------------------------------------------------------

/**
 * Échange la clé API contre un JWT, puis requête l'endpoint export-features.
 *
 * @returns {Promise<Array<{feature:string,release:string,version:string,title:string}> | null>}
 *   null si export indisponible (réseau, auth, timeout, env manquant).
 */
export async function fetchExport() {
  if (!GRADATUM_API_KEY) {
    console.error('[GATE] GRADATUM_API_KEY absent — export indisponible (fail-closed)');
    return null;
  }

  let token;
  try {
    const authRes = await fetch(`${VAULT_SERVER}/auth/exchange`, {
      method: 'POST',
      headers: {
        // NE PAS logger la clé : les logs CI sont publics.
        Authorization: `Bearer ${GRADATUM_API_KEY}`,
        'Content-Type': 'application/json',
      },
      signal: AbortSignal.timeout(EXPORT_TIMEOUT_MS),
    });
    if (!authRes.ok) {
      console.error(`[GATE] Auth exchange failed: HTTP ${authRes.status}`);
      return null;
    }
    const authBody = await authRes.json();
    token = authBody.token;
    if (!token) {
      console.error('[GATE] Auth response missing token field');
      return null;
    }
  } catch (err) {
    console.error(`[GATE] Auth exchange error: ${err.message}`);
    return null;
  }

  try {
    const exportRes = await fetch(
      `${VAULT_SERVER}/api/v1/project-map/export-features`,
      {
        method: 'GET',
        headers: {
          // NE PAS logger le JWT
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
        },
        signal: AbortSignal.timeout(EXPORT_TIMEOUT_MS),
      }
    );
    if (!exportRes.ok) {
      console.error(`[GATE] Export endpoint: HTTP ${exportRes.status}`);
      return null;
    }
    return await exportRes.json();
  } catch (err) {
    console.error(`[GATE] Export fetch error: ${err.message}`);
    return null;
  }
}

// ---------------------------------------------------------------------------
// Parsers site (INTERDITS de modification — features.ts/roadmap.ts sont source de vérité)
// ---------------------------------------------------------------------------

/**
 * Parse features.ts et extrait le tableau de features.
 *
 * @returns {Array<{refLabel:string, status:string, version:string}>}
 */
export function parseFeatures() {
  const featuresFile = path.join(projectRoot, 'src/data/features.ts');
  const content = fs.readFileSync(featuresFile, 'utf-8');

  // Capture id/refLabel/status/version pour chaque objet feature
  const featureRegex =
    /id:\s*'(f-\d+)'[\s\S]*?refLabel:\s*'(F-\d+)'[\s\S]*?status:\s*'(\w+)'[\s\S]*?version:\s*'([^']+)'/g;

  const features = [];
  let match;
  while ((match = featureRegex.exec(content)) !== null) {
    features.push({
      refLabel: match[2],
      status: match[3],
      version: match[4],
    });
  }
  return features;
}

/**
 * Parse roadmap.ts et extrait les featureRefs par version.
 *
 * @returns {Object.<string, {featureRefs: string[]}>}
 */
export function parseRoadmap() {
  const roadmapFile = path.join(projectRoot, 'src/data/roadmap.ts');
  const content = fs.readFileSync(roadmapFile, 'utf-8');

  const versionRegex =
    /version:\s*'(v[\d.]+)'[\s\S]*?featureRefs:\s*\[([\s\S]*?)\]/g;

  const roadmap = {};
  let match;
  while ((match = versionRegex.exec(content)) !== null) {
    const version = match[1];
    const refsStr = match[2];

    const refRegex = /'(F-\d+)'/g;
    const refs = [];
    let refMatch;
    while ((refMatch = refRegex.exec(refsStr)) !== null) {
      refs.push(refMatch[1]);
    }
    roadmap[version] = { featureRefs: refs };
  }
  return roadmap;
}

// ---------------------------------------------------------------------------
// Règle A — mapping release (master) → status (site)
// ---------------------------------------------------------------------------

/**
 * Mappe le champ `release` du master vers le champ `status` attendu sur le site.
 *
 * Règle A :
 *   released → 'released'
 *   planned  → 'planned'
 *   roadmap  → 'planned'   ← backlog remonte sur le site comme planned
 *   dropped  → null        ← absent du site
 *   inconnu  → 'UNMAPPABLE'
 *
 * @param {string} pmRelease
 * @returns {string | null}  null = feature absente du site (dropped)
 */
export function mapToSiteStatus(pmRelease) {
  switch (pmRelease) {
    case 'released': return 'released';
    case 'planned':  return 'planned';
    case 'roadmap':  return 'planned'; // Règle A : backlog remonte comme planned
    case 'dropped':  return null;
    default:         return 'UNMAPPABLE';
  }
}

// ---------------------------------------------------------------------------
// F-192 — multiplicité : l'export NE déduplique PAS
// ---------------------------------------------------------------------------

/**
 * Ordre total et déterministe sur les numéros de feature.
 *
 * F-192 : sans cet ordre, la LISTE d'erreurs suivrait l'ordre du tableau
 * master, donc la projection interrogée (API HTTP vs CLI `gradatum-admin`),
 * qui n'est spécifié nulle part. Le verdict serait identique, mais pas sa
 * restitution — et un diff de sortie CI deviendrait illisible.
 *
 * @param {string} a
 * @param {string} b
 * @returns {number}
 */
export function compareFeatureKey(a, b) {
  const na = /^F-(\d+)$/.exec(a);
  const nb = /^F-(\d+)$/.exec(b);
  if (na && nb) return Number(na[1]) - Number(nb[1]);
  if (na) return -1;
  if (nb) return 1;
  return a < b ? -1 : a > b ? 1 : 0;
}

/**
 * Regroupe le master par numéro de feature — SANS écraser.
 *
 * F-192 : `new Map(master.map(f => [f.feature, f]))` gardait la DERNIÈRE
 * entrée vue. L'export ne dédupliquant pas, l'état retenu dépendait de
 * l'ordre de sortie : mesuré le 2026-08-18, l'API HTTP rendait
 * `roadmap` puis `released` (gate vert) et la CLI `released` puis `roadmap`
 * (gate rouge) sur les MÊMES données. Un dispositif de contrôle dont le
 * verdict dépend d'un ordre non spécifié ne contrôle rien.
 *
 * @param {Array<{feature:string,release:string,version:string}>} master
 * @returns {Map<string, Array<{feature:string,release:string,version:string}>>}
 */
export function groupMasterByFeature(master) {
  const groups = new Map();
  for (const entry of master) {
    const existing = groups.get(entry.feature);
    if (existing) existing.push(entry);
    else groups.set(entry.feature, [entry]);
  }
  return groups;
}

// ---------------------------------------------------------------------------
// Logique de vérification (fonction PURE — testable sans I/O)
// ---------------------------------------------------------------------------

/**
 * Calcule la dérive entre le master project-map et les fichiers site.
 *
 * Le résultat est INDÉPENDANT de l'ordre du tableau `master` — tableau
 * d'erreurs identique élément par élément quelle que soit la projection
 * interrogée (F-192).
 *
 * @param {Array<{feature:string,release:string,version:string}>} master
 * @param {Array<{refLabel:string,status:string,version:string}>} siteFeatures
 * @param {Object.<string, {featureRefs:string[]}>} siteRoadmap
 * @returns {{ errors: string[] }}
 */
export function computeDrift(master, siteFeatures, siteRoadmap) {
  const errors = [];

  if (!master || master.length === 0) {
    errors.push('MASTER_EMPTY: export master vide ou null');
    return { errors };
  }

  // Index de consultation O(1). masterGroups conserve TOUTES les entrées
  // d'un même numéro — la multiplicité est détectée, jamais résolue.
  const masterGroups = groupMasterByFeature(master);
  const masterKeys = [...masterGroups.keys()].sort(compareFeatureKey);
  const siteMap = new Map(siteFeatures.map((f) => [f.refLabel, f]));

  // ── Check 1 : anti-orphelin site → master
  // Chaque feature du site doit exister dans le master.
  for (const [refLabel] of siteMap) {
    if (!masterGroups.has(refLabel)) {
      errors.push(`ORPHAN: ${refLabel} présente sur le site mais absente du master`);
    }
  }

  // ── Check 2 : master non-dropped → doit être sur le site avec status+version corrects
  // Précédé du check 0 (DUPLICATE) : un numéro portant plus d'une entrée
  // non-dropped n'a pas d'état défini, donc rien à comparer en aval.
  for (const key of masterKeys) {
    const entries = masterGroups.get(key);
    const live = entries.filter((e) => e.release !== 'dropped');

    // ── Check 0 : multiplicité (F-192)
    if (live.length > 1) {
      // Détail trié : la RESTITUTION aussi doit être indépendante de l'ordre.
      const detail = live
        .map((e) => `${e.release}/${e.version}`)
        .sort()
        .join(', ');
      errors.push(
        `DUPLICATE: ${key} porte ${live.length} entrées non-dropped à l'export ` +
        `(${detail}) — l'état retenu dépendrait de l'ordre de sortie, ` +
        `aucune comparaison possible`
      );
      continue;
    }

    const masterFeat = live[0] ?? entries[0];
    const siteStatus = live.length === 0 ? null : mapToSiteStatus(masterFeat.release);

    if (siteStatus === null) {
      // dropped : ne doit PAS être sur le site
      if (siteMap.has(key)) {
        errors.push(`DROPPED_VISIBLE: ${key} marqué dropped mais visible sur le site`);
      }
      continue;
    }

    if (siteStatus === 'UNMAPPABLE') {
      errors.push(
        `UNMAPPABLE: ${key} a un release inconnu "${masterFeat.release}"`
      );
      continue;
    }

    // Non-dropped : doit être présent sur le site
    const siteFeat = siteMap.get(key);
    if (!siteFeat) {
      errors.push(`MISSING: ${key} présent dans le master mais absent du site`);
      continue;
    }

    if (siteFeat.status !== siteStatus) {
      errors.push(
        `STATUS_MISMATCH: ${key} attendu status="${siteStatus}" (release master="${masterFeat.release}") mais site="${siteFeat.status}"`
      );
    }

    if (siteFeat.version !== masterFeat.version) {
      errors.push(
        `VERSION_MISMATCH: ${key} attendu version="${masterFeat.version}" mais site="${siteFeat.version}"`
      );
    }
  }

  // ── Check 3 : anti-orphelin roadmap → master
  // Les refs de roadmap.ts doivent exister dans le master et ne pas être dropped.
  // roadmap.ts est éditorial/marketing — NON exhaustif : on ne force PAS
  // que chaque feature master apparaisse dans roadmap.ts.
  const allRoadmapRefs = new Set(
    Object.values(siteRoadmap).flatMap((v) => v.featureRefs)
  );
  for (const ref of allRoadmapRefs) {
    const group = masterGroups.get(ref);
    if (!group) {
      errors.push(`ROADMAP_ORPHAN: ${ref} dans roadmap.ts mais absent du master`);
    } else if (group.every((e) => e.release === 'dropped')) {
      errors.push(`ROADMAP_ORPHAN: ${ref} dans roadmap.ts mais marqué dropped dans le master`);
    }
  }

  return { errors };
}

// ---------------------------------------------------------------------------
// Orchestrateur I/O
// ---------------------------------------------------------------------------

/**
 * Point d'entrée principal du gate.
 * Retourne le code de sortie (0/1/2) — NE fait PAS process.exit() lui-même.
 *
 * Les trois dépendances d'I/O sont injectables : c'est le seul moyen de
 * PROUVER par test la discrimination entre « je diverge » (1) et « je n'ai
 * pas pu regarder » (2), sans casser un fichier source réel.
 *
 * @param {{fetchExport?:Function, parseFeatures?:Function, parseRoadmap?:Function}} [deps]
 * @returns {Promise<number>}
 */
export async function runGate(deps = {}) {
  const io = {
    fetchExport,
    parseFeatures,
    parseRoadmap,
    ...deps,
  };

  console.log('[GATE] Démarrage vérification synchronisation project-map...');

  const master = await io.fetchExport();
  if (!master) {
    console.error('[GATE] FAIL-CLOSED : export indisponible — synchronisation non vérifiable');
    return 2;
  }

  // Export vide = le registre n'a rien rendu. Le gate n'a RIEN à comparer :
  // c'est une cécité, pas une dérive. (computeDrift rend MASTER_EMPTY dans ce
  // cas — son contrat est inchangé, mais il ne doit pas se traduire en 1.)
  if (master.length === 0) {
    console.error('[GATE] FAIL-CLOSED : export master vide — synchronisation non vérifiable');
    return 2;
  }

  console.log(`[GATE] Master export : ${master.length} features`);

  let siteFeatures, siteRoadmap;
  try {
    siteFeatures = io.parseFeatures();
    siteRoadmap = io.parseRoadmap();
    console.log(`[GATE] Site features.ts : ${siteFeatures.length} features`);
    console.log(`[GATE] Site roadmap.ts : ${Object.keys(siteRoadmap).length} versions`);
  } catch (err) {
    // Fichiers site illisibles (ENOENT, droits, disque) : le gate n'a pas
    // regardé le site. Même classe que l'export injoignable → même code.
    console.error(`[GATE] FAIL-CLOSED : fichiers site illisibles — synchronisation non vérifiable : ${err.message}`);
    return 2;
  }

  const { errors } = computeDrift(master, siteFeatures, siteRoadmap);

  console.log('[GATE] ========== RÉSULTATS ==========');
  if (errors.length === 0) {
    console.log('[GATE] ✓ PASS : site synchronisé avec le master');
    return 0;
  }

  console.error(`[GATE] ✗ FAIL : ${errors.length} erreur(s) de synchronisation :`);
  for (const err of errors) {
    console.error(`  - ${err}`);
  }
  return 1;
}

// ---------------------------------------------------------------------------
// Point d'entrée CLI — process.exit UNIQUEMENT ici
// ---------------------------------------------------------------------------

// Détecter si on est le module principal (ESM)
const isMain = process.argv[1] === fileURLToPath(import.meta.url);
if (isMain) {
  try {
    const code = await runGate();
    process.exit(code);
  } catch (err) {
    console.error(`[GATE] Erreur inattendue : ${err.message}`);
    process.exit(2);
  }
}
