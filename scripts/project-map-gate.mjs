#!/usr/bin/env node

/**
 * project-map-gate.mjs
 *
 * CI gate: verifies that features.ts + roadmap.ts are synchronized with gradatum project-map.
 *
 * Exit codes:
 *   0 = conformance verified
 *   1 = drift detected (feature mismatch)
 *   2 = export unavailable (fail-closed)
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { execFile } from 'child_process';
import { promisify } from 'util';

const execFilePromise = promisify(execFile);
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, '..');

const EXPORT_TIMEOUT_MS = 5000;
const VAULT_SERVER = process.env.VAULT_SERVER || 'http://127.0.0.1:19090';
const SKIP_GATE = process.env.PMAP_GATE_SKIP === '1';

/**
 * Fetch project-map export from gradatum server
 */
async function fetchExport() {
  try {
    // Try gradatum-admin command first if available
    try {
      const { stdout } = await execFilePromise('gradatum-admin', ['project-map', 'export-features', '--json'], {
        encoding: 'utf-8',
        timeout: EXPORT_TIMEOUT_MS,
      });
      return JSON.parse(stdout);
    } catch (e) {
      // Fall back to HTTP endpoint
      const response = await fetch(`${VAULT_SERVER}/api/v1/project-map/export-features`, {
        method: 'GET',
        headers: { 'Accept': 'application/json' },
        signal: AbortSignal.timeout(EXPORT_TIMEOUT_MS),
      });
      if (!response.ok) {
        throw new Error(`Export endpoint returned ${response.status}`);
      }
      return await response.json();
    }
  } catch (err) {
    console.error(`[GATE] Export unavailable: ${err.message}`);
    return null;
  }
}

/**
 * Parse features.ts to extract feature array (simplified parser for testing)
 */
function parseFeatures() {
  const featuresFile = path.join(projectRoot, 'src/data/features.ts');
  const content = fs.readFileSync(featuresFile, 'utf-8');

  // Simple regex to find each feature object
  const featureRegex = /\{\s*id:\s*'(f-[\d]+)'[\s\S]*?refLabel:\s*'(F-[\d]+)'[\s\S]*?status:\s*'(\w+)'[\s\S]*?version:\s*'([^']+)'/g;

  const features = [];
  let match;
  while ((match = featureRegex.exec(content)) !== null) {
    features.push({
      id: match[1].toUpperCase(),
      refLabel: match[2],
      status: match[3],
      version: match[4],
    });
  }
  return features;
}

/**
 * Parse roadmap.ts to extract version and featureRefs
 */
function parseRoadmap() {
  const roadmapFile = path.join(projectRoot, 'src/data/roadmap.ts');
  const content = fs.readFileSync(roadmapFile, 'utf-8');

  // Find all version blocks: version: 'vX.Y.Z', ... featureRefs: [...],
  const versionRegex = /version:\s*'(v[\d.]+)'[\s\S]*?featureRefs:\s*\[([\s\S]*?)\]/g;

  const roadmap = {};
  let match;
  while ((match = versionRegex.exec(content)) !== null) {
    const version = match[1];
    const refsStr = match[2];

    // Extract feature refs from the array
    const refRegex = /'(F-[\d]+)'/g;
    const refs = [];
    let refMatch;
    while ((refMatch = refRegex.exec(refsStr)) !== null) {
      refs.push(refMatch[1]);
    }

    roadmap[version] = { featureRefs: refs };
  }
  return roadmap;
}

/**
 * Map project-map release/version to site status/version
 */
function mapToSiteFormat(pmRelease, pmVersion) {
  if (pmRelease === 'dropped') return null; // Dropped = not on site
  if (pmVersion === 'gradatum/backlog') {
    // Backlog displays as 'vX.Y.Z' (Règle A)
    return { status: 'planned', version: 'vX.Y.Z' };
  }

  // Map gradatum/x.y.z → vx.y.z
  const versionMatch = pmVersion.match(/gradatum\/([\d.]+)/);
  if (!versionMatch) return null;
  const v = versionMatch[1];

  return {
    status: pmRelease === 'roadmap' ? 'roadmap' : pmRelease,
    version: `v${v}`,
  };
}

/**
 * Main gate logic
 */
async function runGate() {
  if (SKIP_GATE) {
    console.warn('[GATE] Skipped (PMAP_GATE_SKIP=1)');
    return 0;
  }

  console.log('[GATE] Starting project-map synchronization check...');

  // Fetch master export
  const master = await fetchExport();
  if (!master) {
    console.error('[GATE] FAIL-CLOSED: Export unavailable — cannot verify synchronization');
    return 2;
  }

  console.log(`[GATE] Master export: ${master.length} features`);

  // Parse site files
  let siteFeatures, siteRoadmap;
  try {
    siteFeatures = parseFeatures();
    siteRoadmap = parseRoadmap();
    console.log(`[GATE] Site features: ${siteFeatures.length} features`);
    console.log(`[GATE] Site roadmap: ${Object.keys(siteRoadmap).length} versions`);
  } catch (err) {
    console.error(`[GATE] Parse error: ${err.message}`);
    return 1;
  }

  // Build lookup maps
  const masterMap = new Map();
  for (const feat of master) {
    const key = `F-${feat.feature.padStart(2, '0')}`;
    masterMap.set(key, feat);
  }

  const siteMap = new Map();
  for (const feat of siteFeatures) {
    siteMap.set(feat.refLabel, feat);
  }

  // Collect errors
  const errors = [];

  // Check 1: Features in site must exist in master (anti-orphelin)
  console.log('[GATE] Check 1: Site features vs master...');
  for (const [refLabel, siteFeat] of siteMap) {
    if (!masterMap.has(refLabel)) {
      errors.push(`ORPHAN: ${refLabel} present on site but missing in master`);
    }
  }

  // Check 2: Features in master must sync to site (unless dropped/backlog-only)
  console.log('[GATE] Check 2: Master features vs site...');
  for (const [masterKey, masterFeat] of masterMap) {
    const siteFeat = siteMap.get(masterKey);

    // Skip dropped
    if (masterFeat.release === 'dropped') {
      if (siteFeat) {
        errors.push(`DROPPED_VISIBLE: ${masterKey} marked dropped but visible on site`);
      }
      continue;
    }

    // Skip backlog (unless explicitly checking)
    if (masterFeat.version === 'gradatum/backlog') {
      // Backlog should appear as 'planned vX.Y.Z' per Règle A
      if (!siteFeat) {
        errors.push(`BACKLOG_MISSING: ${masterKey} backlog not found on site`);
      } else {
        const expected = mapToSiteFormat(masterFeat.release, masterFeat.version);
        if (siteFeat.status !== expected.status || siteFeat.version !== expected.version) {
          errors.push(
            `BACKLOG_MISMATCH: ${masterKey} expected status=${expected.status} version=${expected.version} ` +
            `but got status=${siteFeat.status} version=${siteFeat.version}`
          );
        }
      }
      continue;
    }

    // Concrete version: must be on site
    if (!siteFeat) {
      errors.push(`MISSING: ${masterKey} present in master but missing from site`);
      continue;
    }

    // Check status match
    const expected = mapToSiteFormat(masterFeat.release, masterFeat.version);
    if (!expected) {
      errors.push(`UNMAPPABLE: ${masterKey} has unexpected release=${masterFeat.release}`);
      continue;
    }

    if (siteFeat.status !== expected.status) {
      errors.push(
        `STATUS_MISMATCH: ${masterKey} expected status=${expected.status} but got ${siteFeat.status}`
      );
    }

    if (siteFeat.version !== expected.version) {
      errors.push(
        `VERSION_MISMATCH: ${masterKey} expected version=${expected.version} but got ${siteFeat.version}`
      );
    }
  }

  // Check 3: Roadmap.ts must include feature refs for released/planned features
  console.log('[GATE] Check 3: Roadmap feature refs...');
  for (const [masterKey, masterFeat] of masterMap) {
    if (masterFeat.release === 'dropped' || masterFeat.version === 'gradatum/backlog') {
      continue; // Skipped (per spec)
    }

    // Extract version (e.g., 'v0.4.3' from 'gradatum/0.4.3')
    const vMatch = masterFeat.version.match(/gradatum\/([\d.]+)/);
    if (!vMatch) continue;
    const versionKey = `v${vMatch[1]}`;

    if (!siteRoadmap[versionKey]) {
      errors.push(`ROADMAP_MISSING: Version ${versionKey} not found in roadmap for ${masterKey}`);
      continue;
    }

    const roadmapVersion = siteRoadmap[versionKey];
    if (!roadmapVersion.featureRefs.includes(masterKey)) {
      errors.push(
        `ROADMAP_REF_MISSING: ${masterKey} (v${vMatch[1]}) not listed in roadmap featureRefs`
      );
    }
  }

  // Report results
  console.log('[GATE] ========== RESULTS ==========');
  if (errors.length === 0) {
    console.log('[GATE] ✓ PASS: Site is synchronized with master');
    return 0;
  }

  console.error(`[GATE] ✗ FAIL: ${errors.length} synchronization error(s):`);
  for (const err of errors) {
    console.error(`  - ${err}`);
  }
  return 1;
}

// Run gate
try {
  const code = await runGate();
  process.exit(code);
} catch (err) {
  console.error(`[GATE] Unexpected error: ${err.message}`);
  process.exit(2);
}
