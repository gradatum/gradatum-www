#!/usr/bin/env node

/**
 * project-map-gate.mjs
 *
 * CI gate : vérifie que features.ts + roadmap.ts sont synchronisés avec le
 * project-map master de gradatum.
 *
 * Exit codes :
 *   0 = conformance vérifiée
 *   1 = dérive détectée (mismatch feature)
 *   2 = export indisponible (fail-closed)
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
// Logique de vérification (fonction PURE — testable sans I/O)
// ---------------------------------------------------------------------------

/**
 * Calcule la dérive entre le master project-map et les fichiers site.
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

  // Index de consultation O(1)
  const masterMap = new Map(master.map((f) => [f.feature, f]));
  const siteMap = new Map(siteFeatures.map((f) => [f.refLabel, f]));

  // ── Check 1 : anti-orphelin site → master
  // Chaque feature du site doit exister dans le master.
  for (const [refLabel] of siteMap) {
    if (!masterMap.has(refLabel)) {
      errors.push(`ORPHAN: ${refLabel} présente sur le site mais absente du master`);
    }
  }

  // ── Check 2 : master non-dropped → doit être sur le site avec status+version corrects
  for (const [key, masterFeat] of masterMap) {
    const siteStatus = mapToSiteStatus(masterFeat.release);

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
    const masterFeat = masterMap.get(ref);
    if (!masterFeat) {
      errors.push(`ROADMAP_ORPHAN: ${ref} dans roadmap.ts mais absent du master`);
    } else if (masterFeat.release === 'dropped') {
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
 * @returns {Promise<number>}
 */
export async function runGate() {
  console.log('[GATE] Démarrage vérification synchronisation project-map...');

  const master = await fetchExport();
  if (!master) {
    console.error('[GATE] FAIL-CLOSED : export indisponible — synchronisation non vérifiable');
    return 2;
  }

  console.log(`[GATE] Master export : ${master.length} features`);

  let siteFeatures, siteRoadmap;
  try {
    siteFeatures = parseFeatures();
    siteRoadmap = parseRoadmap();
    console.log(`[GATE] Site features.ts : ${siteFeatures.length} features`);
    console.log(`[GATE] Site roadmap.ts : ${Object.keys(siteRoadmap).length} versions`);
  } catch (err) {
    console.error(`[GATE] Erreur parse fichiers site : ${err.message}`);
    return 1;
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
