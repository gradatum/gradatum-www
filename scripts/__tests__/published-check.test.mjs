#!/usr/bin/env node

/**
 * published-check.test.mjs
 *
 * Contrat de sortie de la sonde post-publication : cécité ≠ divergence.
 * Même contrat que project-map-gate — `1` ne signale qu'un écart RÉELLEMENT
 * MESURÉ, toute incapacité à conclure emprunte `2`.
 *
 * Enjeu concret : cette sonde tourne quotidiennement et quelqu'un lit son
 * verdict. Annoncer « artefact publié divergent » sur un registre vide, c'est
 * accuser un artefact sain et envoyer chercher un écart qui n'existe pas.
 *
 * Run : node --test scripts/__tests__/published-check.test.mjs
 */

import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

import { runPublishedCheck } from '../published-check.mjs';

const MASTER_OK = [{ feature: 'F-01', release: 'released', version: 'v0.1.0', title: 'A' }];
const PUBLISHED_OK = [{ refLabel: 'F-01', status: 'released', version: 'v0.1.0' }];

describe('runPublishedCheck — contrat de sortie 0 / 1 / 2', () => {
  it('0 : mesuré des deux côtés et conforme', async () => {
    const code = await runPublishedCheck({
      fetchPublished: async () => PUBLISHED_OK,
      fetchExport: async () => MASTER_OK,
    });
    assert.equal(code, 0);
  });

  it('1 : divergence RÉELLEMENT MESURÉE (version publiée périmée)', async () => {
    const code = await runPublishedCheck({
      fetchPublished: async () => [{ refLabel: 'F-01', status: 'released', version: 'v0.0.9' }],
      fetchExport: async () => MASTER_OK,
    });
    assert.equal(code, 1);
  });

  it('2 : registre master VIDE → cécité, PAS une divergence publiée', async () => {
    const code = await runPublishedCheck({
      fetchPublished: async () => PUBLISHED_OK, // artefact sain, parfaitement lisible
      fetchExport: async () => [],              // référence absente
    });
    assert.equal(
      code, 2,
      'un artefact sain ne doit jamais être déclaré divergent parce que la référence est vide'
    );
  });

  it('2 : artefact publié illisible (chemin inchangé)', async () => {
    const code = await runPublishedCheck({
      fetchPublished: async () => null,
      fetchExport: async () => MASTER_OK,
    });
    assert.equal(code, 2);
  });

  it('2 : vault injoignable (chemin inchangé)', async () => {
    const code = await runPublishedCheck({
      fetchPublished: async () => PUBLISHED_OK,
      fetchExport: async () => null,
    });
    assert.equal(code, 2);
  });

  it('discrimination : référence vide et artefact divergent ne rendent JAMAIS le même code', async () => {
    const aveugle = await runPublishedCheck({
      fetchPublished: async () => PUBLISHED_OK,
      fetchExport: async () => [],
    });
    const divergent = await runPublishedCheck({
      fetchPublished: async () => [],           // artefact publié VIDE mais lu
      fetchExport: async () => MASTER_OK,
    });
    assert.equal(aveugle, 2);
    assert.equal(divergent, 1, 'un artefact publié vide EST une mesure : le site ne montre rien');
    assert.notEqual(aveugle, divergent);
  });
});
