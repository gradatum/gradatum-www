#!/usr/bin/env node

/**
 * project-map-gate.test.mjs
 *
 * Tests unitaires pour la logique de gate (fonctions pures).
 * Utilise node:test + node:assert — aucune dépendance externe.
 *
 * Run : node --test scripts/__tests__/project-map-gate.test.mjs
 */

import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

// Import des fonctions pures exportées par le gate
import {
  mapToSiteStatus,
  computeDrift,
} from '../project-map-gate.mjs';

// ---------------------------------------------------------------------------
// mapToSiteStatus — Règle A
// ---------------------------------------------------------------------------

describe('mapToSiteStatus (Règle A)', () => {
  it('released → "released"', () => {
    assert.equal(mapToSiteStatus('released'), 'released');
  });

  it('planned → "planned"', () => {
    assert.equal(mapToSiteStatus('planned'), 'planned');
  });

  it('roadmap → "planned" (backlog remonte comme planned, Règle A)', () => {
    assert.equal(mapToSiteStatus('roadmap'), 'planned');
  });

  it('dropped → null (absent du site)', () => {
    assert.equal(mapToSiteStatus('dropped'), null);
  });

  it('inconnu → "UNMAPPABLE"', () => {
    assert.equal(mapToSiteStatus('whatever'), 'UNMAPPABLE');
  });
});

// ---------------------------------------------------------------------------
// computeDrift — vérification PASS
// ---------------------------------------------------------------------------

describe('computeDrift — PASS en conformance', () => {
  it('(a) PASS : master et site parfaitement synchronisés', () => {
    const master = [
      { feature: 'F-01', release: 'released', version: 'v0.1.0', title: 'Warden' },
      { feature: 'F-10', release: 'planned', version: 'v0.5.0', title: 'Feature planifiée' },
    ];
    const siteFeatures = [
      { refLabel: 'F-01', status: 'released', version: 'v0.1.0' },
      { refLabel: 'F-10', status: 'planned', version: 'v0.5.0' },
    ];
    const siteRoadmap = {
      'v0.1.0': { featureRefs: ['F-01'] },
      'v0.5.0': { featureRefs: ['F-10'] },
    };
    const { errors } = computeDrift(master, siteFeatures, siteRoadmap);
    assert.deepEqual(errors, []);
  });

  it('(a-bis) PASS : dropped absent du site = correct', () => {
    const master = [
      { feature: 'F-01', release: 'released', version: 'v0.1.0', title: 'A' },
      { feature: 'F-99', release: 'dropped', version: 'v0.5.0', title: 'Dropped' },
    ];
    const siteFeatures = [{ refLabel: 'F-01', status: 'released', version: 'v0.1.0' }];
    const siteRoadmap = { 'v0.1.0': { featureRefs: ['F-01'] } };
    const { errors } = computeDrift(master, siteFeatures, siteRoadmap);
    assert.deepEqual(errors, []);
  });

  it('(d-bis) PASS : master roadmap → site planned = conforme (Règle A, cas backlog)', () => {
    const master = [
      { feature: 'F-62', release: 'roadmap', version: 'vX.Y.Z', title: 'Backlog' },
    ];
    const siteFeatures = [
      { refLabel: 'F-62', status: 'planned', version: 'vX.Y.Z' },
    ];
    const siteRoadmap = { 'vX.Y.Z': { featureRefs: ['F-62'] } };
    const { errors } = computeDrift(master, siteFeatures, siteRoadmap);
    assert.deepEqual(errors, []);
  });
});

// ---------------------------------------------------------------------------
// computeDrift — Check 1 : ORPHAN
// ---------------------------------------------------------------------------

describe('computeDrift — Check 1 : ORPHAN site→master', () => {
  it('(b) ORPHAN : feature sur le site absente du master', () => {
    const master = [
      { feature: 'F-01', release: 'released', version: 'v0.1.0', title: 'A' },
    ];
    const siteFeatures = [
      { refLabel: 'F-01', status: 'released', version: 'v0.1.0' },
      { refLabel: 'F-99', status: 'planned', version: 'v0.5.0' }, // orphan
    ];
    const siteRoadmap = {};
    const { errors } = computeDrift(master, siteFeatures, siteRoadmap);
    assert.equal(errors.length, 1);
    assert.ok(errors[0].startsWith('ORPHAN'), `attendu ORPHAN, obtenu: ${errors[0]}`);
    assert.ok(errors[0].includes('F-99'));
  });
});

// ---------------------------------------------------------------------------
// computeDrift — Check 2 : MISSING / STATUS_MISMATCH / VERSION_MISMATCH / DROPPED_VISIBLE
// ---------------------------------------------------------------------------

describe('computeDrift — Check 2 : master vs site', () => {
  it('(c) MISSING : feature master non-dropped absente du site', () => {
    const master = [
      { feature: 'F-10', release: 'planned', version: 'v0.5.0', title: 'B' },
    ];
    const siteFeatures = [];
    const siteRoadmap = {};
    const { errors } = computeDrift(master, siteFeatures, siteRoadmap);
    assert.equal(errors.length, 1);
    assert.ok(errors[0].startsWith('MISSING'), `attendu MISSING, obtenu: ${errors[0]}`);
    assert.ok(errors[0].includes('F-10'));
  });

  it('(d) STATUS_MISMATCH : status site incorrect', () => {
    const master = [
      { feature: 'F-31', release: 'released', version: 'v0.4.3', title: 'C' },
    ];
    const siteFeatures = [
      { refLabel: 'F-31', status: 'planned', version: 'v0.4.3' }, // mauvais status
    ];
    const siteRoadmap = {};
    const { errors } = computeDrift(master, siteFeatures, siteRoadmap);
    assert.equal(errors.length, 1);
    assert.ok(errors[0].startsWith('STATUS_MISMATCH'), `attendu STATUS_MISMATCH, obtenu: ${errors[0]}`);
  });

  it('(d) STATUS_MISMATCH : master roadmap, site "roadmap" = FAIL (doit être "planned" Règle A)', () => {
    const master = [
      { feature: 'F-62', release: 'roadmap', version: 'vX.Y.Z', title: 'Backlog' },
    ];
    const siteFeatures = [
      { refLabel: 'F-62', status: 'roadmap', version: 'vX.Y.Z' }, // wrong: doit être planned
    ];
    const siteRoadmap = {};
    const { errors } = computeDrift(master, siteFeatures, siteRoadmap);
    assert.equal(errors.length, 1);
    assert.ok(errors[0].startsWith('STATUS_MISMATCH'), `attendu STATUS_MISMATCH, obtenu: ${errors[0]}`);
    assert.ok(errors[0].includes('"planned"'), `le message doit mentionner "planned": ${errors[0]}`);
  });

  it('(e) VERSION_MISMATCH : version site incorrecte', () => {
    const master = [
      { feature: 'F-31', release: 'released', version: 'v0.4.3', title: 'D' },
    ];
    const siteFeatures = [
      { refLabel: 'F-31', status: 'released', version: 'v0.4.0' }, // mauvaise version
    ];
    const siteRoadmap = {};
    const { errors } = computeDrift(master, siteFeatures, siteRoadmap);
    assert.equal(errors.length, 1);
    assert.ok(errors[0].startsWith('VERSION_MISMATCH'), `attendu VERSION_MISMATCH, obtenu: ${errors[0]}`);
  });

  it('(f) DROPPED_VISIBLE : feature dropped encore visible sur le site', () => {
    const master = [
      { feature: 'F-99', release: 'dropped', version: 'v0.5.0', title: 'E' },
    ];
    const siteFeatures = [
      { refLabel: 'F-99', status: 'planned', version: 'v0.5.0' }, // ne devrait pas être là
    ];
    const siteRoadmap = {};
    const { errors } = computeDrift(master, siteFeatures, siteRoadmap);
    assert.equal(errors.length, 1);
    assert.ok(errors[0].startsWith('DROPPED_VISIBLE'), `attendu DROPPED_VISIBLE, obtenu: ${errors[0]}`);
  });
});

// ---------------------------------------------------------------------------
// computeDrift — Check 3 : ROADMAP_ORPHAN
// ---------------------------------------------------------------------------

describe('computeDrift — Check 3 : ROADMAP_ORPHAN (anti-orphelin roadmap.ts)', () => {
  it('(g) ROADMAP_ORPHAN : ref roadmap.ts absente du master', () => {
    const master = [
      { feature: 'F-01', release: 'released', version: 'v0.1.0', title: 'A' },
    ];
    const siteFeatures = [
      { refLabel: 'F-01', status: 'released', version: 'v0.1.0' },
    ];
    const siteRoadmap = {
      'v0.1.0': { featureRefs: ['F-01', 'F-GHOST'] }, // F-GHOST inexistant dans master
    };
    const { errors } = computeDrift(master, siteFeatures, siteRoadmap);
    assert.equal(errors.length, 1);
    assert.ok(errors[0].startsWith('ROADMAP_ORPHAN'), `attendu ROADMAP_ORPHAN, obtenu: ${errors[0]}`);
    assert.ok(errors[0].includes('F-GHOST'));
  });

  it('(g-bis) ROADMAP_ORPHAN : ref roadmap.ts sur feature dropped', () => {
    const master = [
      { feature: 'F-01', release: 'released', version: 'v0.1.0', title: 'A' },
      { feature: 'F-50', release: 'dropped', version: 'v0.5.0', title: 'Dropped' },
    ];
    const siteFeatures = [
      { refLabel: 'F-01', status: 'released', version: 'v0.1.0' },
    ];
    const siteRoadmap = {
      'v0.1.0': { featureRefs: ['F-01'] },
      'v0.5.0': { featureRefs: ['F-50'] }, // dropped : roadmap orphan
    };
    const { errors } = computeDrift(master, siteFeatures, siteRoadmap);
    assert.equal(errors.length, 1);
    assert.ok(errors[0].startsWith('ROADMAP_ORPHAN'));
    assert.ok(errors[0].includes('F-50'));
  });

  it('PASS : roadmap.ts ne cite PAS toutes les features master = normal (éditorial)', () => {
    // roadmap.ts est non-exhaustif — ne pas exiger que chaque feature y soit
    const master = [
      { feature: 'F-01', release: 'released', version: 'v0.1.0', title: 'A' },
      { feature: 'F-10', release: 'planned', version: 'v0.5.0', title: 'B' },
    ];
    const siteFeatures = [
      { refLabel: 'F-01', status: 'released', version: 'v0.1.0' },
      { refLabel: 'F-10', status: 'planned', version: 'v0.5.0' },
    ];
    // Roadmap cite seulement F-01, pas F-10 — c'est acceptable
    const siteRoadmap = {
      'v0.1.0': { featureRefs: ['F-01'] },
    };
    const { errors } = computeDrift(master, siteFeatures, siteRoadmap);
    assert.deepEqual(errors, []);
  });
});

// ---------------------------------------------------------------------------
// computeDrift — cas limites
// ---------------------------------------------------------------------------

describe('computeDrift — cas limites', () => {
  it('(h) master null → MASTER_EMPTY', () => {
    const { errors } = computeDrift(null, [], {});
    assert.equal(errors.length, 1);
    assert.ok(errors[0].startsWith('MASTER_EMPTY'));
  });

  it('(h) master vide [] → MASTER_EMPTY', () => {
    const { errors } = computeDrift([], [], {});
    assert.equal(errors.length, 1);
    assert.ok(errors[0].startsWith('MASTER_EMPTY'));
  });

  it('(h) sémantique exit-2 : fetchExport null → fail-closed', () => {
    // computeDrift n'est pas appelé quand fetchExport retourne null —
    // runGate() retourne directement 2. Ce test vérifie que le contrat
    // de master null est géré proprement si jamais appelé directement.
    const { errors } = computeDrift(null, [], {});
    assert.ok(errors.some((e) => e.startsWith('MASTER_EMPTY')));
  });

  it('UNMAPPABLE : release inconnu signalé', () => {
    const master = [
      { feature: 'F-42', release: 'staging', version: 'v0.3.0', title: 'X' },
    ];
    const siteFeatures = [
      { refLabel: 'F-42', status: 'planned', version: 'v0.3.0' },
    ];
    const { errors } = computeDrift(master, siteFeatures, {});
    assert.equal(errors.length, 1);
    assert.ok(errors[0].startsWith('UNMAPPABLE'));
  });
});
