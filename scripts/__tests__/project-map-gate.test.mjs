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
  compareFeatureKey,
  groupMasterByFeature,
  runGate,
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

// ---------------------------------------------------------------------------
// F-192 — Check 0 : DUPLICATE + indépendance à l'ordre de projection
//
// L'export project-map NE déduplique PAS. L'ancien index
// `new Map(master.map(f => [f.feature, f]))` gardait la DERNIÈRE entrée vue :
// le verdict dépendait donc de l'ordre de sortie, non spécifié.
// Mesuré le 2026-08-18 sur trois numéros alors dupliqués :
//   API HTTP  → roadmap puis released → gate VERT
//   CLI admin → released puis roadmap → gate ROUGE
// Mêmes données, mêmes cardinaux, ordre opposé.
//
// Les doublons ne sont PAS réintroduits dans le registre réel : ils vivent
// ici, en fixture.
// ---------------------------------------------------------------------------

// Fixture reproduisant le cas mesuré : F-36 porte deux cartes non-dropped,
// une `roadmap` et une `released`. Le site n'en connaît qu'une.
const DUP_MASTER_API_ORDER = [
  { feature: 'F-01', release: 'released', version: 'v0.1.0', title: 'Warden' },
  { feature: 'F-36', release: 'roadmap', version: 'v2.1.0', title: 'Drift scope (backlog)' },
  { feature: 'F-36', release: 'released', version: 'v0.7.6', title: 'Drift scope (livrée)' },
];
// Même contenu, ordre CLI (les deux entrées F-36 permutées).
const DUP_MASTER_CLI_ORDER = [
  { feature: 'F-01', release: 'released', version: 'v0.1.0', title: 'Warden' },
  { feature: 'F-36', release: 'released', version: 'v0.7.6', title: 'Drift scope (livrée)' },
  { feature: 'F-36', release: 'roadmap', version: 'v2.1.0', title: 'Drift scope (backlog)' },
];
// Le site est aligné sur la projection « chanceuse » (roadmap → planned v2.1.0).
const DUP_SITE_FEATURES = [
  { refLabel: 'F-01', status: 'released', version: 'v0.1.0' },
  { refLabel: 'F-36', status: 'planned', version: 'v2.1.0' },
];

describe('computeDrift — F-192 Check 0 : DUPLICATE', () => {
  it('(i) DUPLICATE : deux entrées non-dropped sur un numéro → FAIL', () => {
    const { errors } = computeDrift(DUP_MASTER_API_ORDER, DUP_SITE_FEATURES, {});
    assert.equal(errors.length, 1, `attendu 1 erreur, obtenu: ${JSON.stringify(errors)}`);
    assert.ok(errors[0].startsWith('DUPLICATE'), `attendu DUPLICATE, obtenu: ${errors[0]}`);
    assert.ok(errors[0].includes('F-36'));
    assert.ok(errors[0].includes('2 entrées'));
  });

  it('(i-bis) DUPLICATE : échoue MÊME si le site est d\'accord avec une des entrées', () => {
    // Le site porte exactement l'état de l'entrée `roadmap` (planned/v2.1.0).
    // L'accord apparent ne doit PAS absoudre la multiplicité.
    const { errors } = computeDrift(DUP_MASTER_API_ORDER, DUP_SITE_FEATURES, {});
    assert.ok(errors.some((e) => e.startsWith('DUPLICATE')));
  });

  it('(i-ter) DUPLICATE : verdict IDENTIQUE sur les deux projections (API / CLI)', () => {
    const api = computeDrift(DUP_MASTER_API_ORDER, DUP_SITE_FEATURES, {});
    const cli = computeDrift(DUP_MASTER_CLI_ORDER, DUP_SITE_FEATURES, {});
    assert.deepEqual(api.errors, cli.errors);
    assert.equal(api.errors.length, 1);
  });

  it('(i-quater) DUPLICATE : trois entrées non-dropped → une seule erreur, détail trié', () => {
    const master = [
      { feature: 'F-36', release: 'roadmap', version: 'v2.1.0', title: 'c' },
      { feature: 'F-36', release: 'released', version: 'v0.7.6', title: 'a' },
      { feature: 'F-36', release: 'planned', version: 'v1.0.0', title: 'b' },
    ];
    const { errors } = computeDrift(master, [], {});
    assert.equal(errors.length, 1);
    assert.ok(errors[0].includes('3 entrées'));
    // Détail trié → même chaîne quel que soit l'ordre d'entrée
    const reversed = computeDrift([...master].reverse(), [], {});
    assert.deepEqual(errors, reversed.errors);
  });

  it('(i-5) DUPLICATE : deux entrées IDENTIQUES restent une erreur', () => {
    const master = [
      { feature: 'F-36', release: 'released', version: 'v0.7.6', title: 'x' },
      { feature: 'F-36', release: 'released', version: 'v0.7.6', title: 'x' },
    ];
    const siteFeatures = [{ refLabel: 'F-36', status: 'released', version: 'v0.7.6' }];
    const { errors } = computeDrift(master, siteFeatures, {});
    assert.equal(errors.length, 1);
    assert.ok(errors[0].startsWith('DUPLICATE'));
  });

  it('PASS : 1 non-dropped + 1 dropped sur le même numéro = état défini, pas un doublon', () => {
    const master = [
      { feature: 'F-36', release: 'dropped', version: 'v0.6.0', title: 'abandonnée' },
      { feature: 'F-36', release: 'released', version: 'v0.7.6', title: 'livrée' },
    ];
    const siteFeatures = [{ refLabel: 'F-36', status: 'released', version: 'v0.7.6' }];
    const api = computeDrift(master, siteFeatures, {});
    const cli = computeDrift([...master].reverse(), siteFeatures, {});
    assert.deepEqual(api.errors, []);
    // ...et l'ancien code aurait rendu DROPPED_VISIBLE dans un des deux ordres.
    assert.deepEqual(api.errors, cli.errors);
  });

  it('PASS : deux entrées dropped sur le même numéro → doit rester absent du site', () => {
    const master = [
      { feature: 'F-36', release: 'dropped', version: 'v0.6.0', title: 'a' },
      { feature: 'F-36', release: 'dropped', version: 'v0.7.0', title: 'b' },
    ];
    assert.deepEqual(computeDrift(master, [], {}).errors, []);
    const { errors } = computeDrift(master, [{ refLabel: 'F-36', status: 'planned', version: 'v0.6.0' }], {});
    assert.equal(errors.length, 1);
    assert.ok(errors[0].startsWith('DROPPED_VISIBLE'));
  });
});

describe('computeDrift — F-192 : ordre de projection indifférent (cas généraux)', () => {
  it('sans doublon : verdict identique sur master inversé', () => {
    const master = [
      { feature: 'F-01', release: 'released', version: 'v0.1.0', title: 'A' },
      { feature: 'F-10', release: 'planned', version: 'v0.5.0', title: 'B' },
      { feature: 'F-99', release: 'dropped', version: 'v0.5.0', title: 'C' },
    ];
    const siteFeatures = [
      { refLabel: 'F-01', status: 'released', version: 'v0.1.0' },
      { refLabel: 'F-10', status: 'released', version: 'v0.5.0' }, // status faux
    ];
    const siteRoadmap = { 'v0.5.0': { featureRefs: ['F-99'] } }; // dropped
    const a = computeDrift(master, siteFeatures, siteRoadmap);
    const b = computeDrift([...master].reverse(), siteFeatures, siteRoadmap);
    assert.deepEqual(a.errors, b.errors);
    assert.equal(a.errors.length, 2);
  });

  it('l\'ordre des erreurs suit le numéro de feature, pas l\'ordre du master', () => {
    const master = [
      { feature: 'F-50', release: 'planned', version: 'v1.0.0', title: 'B' },
      { feature: 'F-07', release: 'planned', version: 'v1.0.0', title: 'A' },
    ];
    const { errors } = computeDrift(master, [], {});
    assert.equal(errors.length, 2);
    assert.ok(errors[0].includes('F-07'), `F-07 doit venir avant F-50 : ${errors[0]}`);
    assert.ok(errors[1].includes('F-50'));
  });
});

describe('groupMasterByFeature — F-192', () => {
  it('conserve toutes les entrées d\'un numéro (n\'écrase pas)', () => {
    const groups = groupMasterByFeature([
      { feature: 'F-36', release: 'roadmap', version: 'v2.1.0' },
      { feature: 'F-36', release: 'released', version: 'v0.7.6' },
      { feature: 'F-01', release: 'released', version: 'v0.1.0' },
    ]);
    assert.equal(groups.size, 2);
    assert.equal(groups.get('F-36').length, 2);
    assert.equal(groups.get('F-01').length, 1);
  });
});

describe('compareFeatureKey — F-192', () => {
  it('ordonne numériquement, pas lexicographiquement', () => {
    const keys = ['F-100', 'F-2', 'F-01', 'F-20'].sort(compareFeatureKey);
    assert.deepEqual(keys, ['F-01', 'F-2', 'F-20', 'F-100']);
  });

  it('reste un ordre total sur les clés non conformes', () => {
    const keys = ['F-GHOST', 'F-10', 'ZZZ', 'F-2'].sort(compareFeatureKey);
    assert.deepEqual(keys, ['F-2', 'F-10', 'F-GHOST', 'ZZZ']);
  });
});

// ---------------------------------------------------------------------------
// F-192 (complément) — contrat de sortie : cécité ≠ dérive
//
// `1` ne doit signaler qu'un écart RÉELLEMENT MESURÉ. Toute incapacité à
// conclure emprunte `2`, comme le fail-closed export. Sans cette distinction,
// « le site est désynchronisé » et « je n'ai pas pu regarder » sont
// indiscernables — et une sonde doit compenser en relisant le texte de sortie,
// contournement que le moindre changement de libellé casserait en silence.
// ---------------------------------------------------------------------------

const MASTER_OK = [{ feature: 'F-01', release: 'released', version: 'v0.1.0', title: 'A' }];
const SITE_OK = [{ refLabel: 'F-01', status: 'released', version: 'v0.1.0' }];

describe('runGate — contrat de sortie 0 / 1 / 2', () => {
  it('0 : mesuré et conforme', async () => {
    const code = await runGate({
      fetchExport: async () => MASTER_OK,
      parseFeatures: () => SITE_OK,
      parseRoadmap: () => ({}),
    });
    assert.equal(code, 0);
  });

  it('1 : écart RÉELLEMENT MESURÉ (le gate a comparé, et ça diverge)', async () => {
    const code = await runGate({
      fetchExport: async () => MASTER_OK,
      parseFeatures: () => [{ refLabel: 'F-01', status: 'planned', version: 'v0.1.0' }],
      parseRoadmap: () => ({}),
    });
    assert.equal(code, 1);
  });

  it('2 : fichiers site ILLISIBLES → cécité, pas dérive (ENOENT features.ts)', async () => {
    const enoent = Object.assign(
      new Error("ENOENT: no such file or directory, open 'src/data/features.ts'"),
      { code: 'ENOENT' }
    );
    const code = await runGate({
      fetchExport: async () => MASTER_OK,
      parseFeatures: () => { throw enoent; },
      parseRoadmap: () => ({}),
    });
    assert.equal(code, 2, 'un gate qui n\'a pas pu lire le site ne peut pas affirmer une dérive');
  });

  it('2 : roadmap.ts illisible aussi (le second parse compte autant)', async () => {
    const code = await runGate({
      fetchExport: async () => MASTER_OK,
      parseFeatures: () => SITE_OK,
      parseRoadmap: () => { throw new Error('EACCES: permission denied'); },
    });
    assert.equal(code, 2);
  });

  it('2 : export VIDE → rien à comparer, pas une dérive', async () => {
    const code = await runGate({
      fetchExport: async () => [],
      parseFeatures: () => SITE_OK,
      parseRoadmap: () => ({}),
    });
    assert.equal(code, 2, 'MASTER_EMPTY ne doit jamais se traduire en 1');
  });

  it('2 : export injoignable (contrat fail-closed inchangé)', async () => {
    const code = await runGate({
      fetchExport: async () => null,
      parseFeatures: () => SITE_OK,
      parseRoadmap: () => ({}),
    });
    assert.equal(code, 2);
  });

  it('discrimination : illisible et divergent ne rendent JAMAIS le même code', async () => {
    const aveugle = await runGate({
      fetchExport: async () => MASTER_OK,
      parseFeatures: () => { throw new Error('ENOENT'); },
      parseRoadmap: () => ({}),
    });
    const divergent = await runGate({
      fetchExport: async () => MASTER_OK,
      parseFeatures: () => [],
      parseRoadmap: () => ({}),
    });
    assert.equal(aveugle, 2);
    assert.equal(divergent, 1);
    assert.notEqual(aveugle, divergent);
  });

  it('computeDrift garde son contrat MASTER_EMPTY (inchangé)', () => {
    // Le code de sortie change, pas la sémantique du comparateur.
    assert.ok(computeDrift([], [], {}).errors[0].startsWith('MASTER_EMPTY'));
  });
});
