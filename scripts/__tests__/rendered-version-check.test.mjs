#!/usr/bin/env node

/**
 * rendered-version-check.test.mjs
 *
 * F-183 — tests du comparateur de versions affichées (fonction pure).
 * Aucun réseau, aucune I/O : les pages sont des fragments de rendu, la
 * référence un objet littéral.
 *
 * Run : node --test scripts/__tests__/rendered-version-check.test.mjs
 */

import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

import { checkRenderedVersions } from '../rendered-version-check.mjs';

const REF = {
  tag: 'v2.0.0',
  assetNames: [
    'gradatum-server-v2.0.0-x86_64-unknown-linux-gnu.tar.gz',
    'gradatum-llm-v2.0.0-x86_64-unknown-linux-gnu.tar.gz',
    'gradatum-sbom-v2.0.0.tar.gz',
    'SHA256SUMS',
  ],
};

const page = (html, name = 'index.html') => [{ name, html }];
const marked = (v) => `<span data-gradatum-version="current">${v}</span>`;

// ---------------------------------------------------------------------------
// Critère 1 — un écart affiché/publié est détecté
// ---------------------------------------------------------------------------

describe('checkRenderedVersions — écart de version affichée', () => {
  it('PASS : la version affichée est la version publiée', () => {
    const { errors, markerCount } = checkRenderedVersions(
      page(`<footer>Open source — ${marked('v2.0.0')} current.</footer>`),
      REF
    );
    assert.deepEqual(errors, []);
    assert.equal(markerCount, 1);
  });

  it('VERSION_STALE : la version affichée est restée en arrière', () => {
    const { errors } = checkRenderedVersions(
      page(`<footer>Open source — ${marked('v1.0.0')} current.</footer>`),
      REF
    );
    assert.equal(errors.length, 1);
    assert.ok(errors[0].startsWith('VERSION_STALE'), errors[0]);
    assert.ok(errors[0].includes('v1.0.0'));
    assert.ok(errors[0].includes('v2.0.0'));
  });

  it('VERSION_STALE : un SEUL emplacement oublié suffit à faire échouer', () => {
    // Le défaut visé : la publication met à jour 13 chaînes sur 14.
    const html = [
      marked('v2.0.0'), marked('v2.0.0'), marked('v2.0.0'),
      marked('v2.0.0'), marked('v2.0.0'),
      marked('v1.0.0'), // ← la 14e, oubliée
    ].join(' ');
    const { errors, markerCount } = checkRenderedVersions(page(html), REF);
    assert.equal(markerCount, 6);
    assert.equal(errors.length, 1);
    assert.ok(errors[0].startsWith('VERSION_STALE'));
  });

  it('les mentions HISTORIQUES non marquées ne font pas échouer', () => {
    // « removed in v2.0.0 », « SemVer strict since v1.0.0 » sont des faits
    // sur une release donnée — ils ne doivent jamais suivre le tag courant.
    const html =
      `<p>The startup check was removed in v2.0.0. SemVer strict since v1.0.0. ` +
      `Live since v0.3.0, formalised at v1.0.0.</p>${marked('v2.0.0')}`;
    assert.deepEqual(checkRenderedVersions(page(html), REF).errors, []);
  });

  it('la référence reste correcte quand elle avance (v2.1.0)', () => {
    const ref = { tag: 'v2.1.0', assetNames: ['gradatum-server-v2.1.0-x86_64-unknown-linux-gnu.tar.gz'] };
    const { errors } = checkRenderedVersions(page(marked('v2.0.0')), ref);
    assert.equal(errors.length, 1);
    assert.ok(errors[0].includes('"v2.0.0"') && errors[0].includes('"v2.1.0"'));
  });
});

// ---------------------------------------------------------------------------
// Critère 2 — le contrôle porte sur le RENDU
// ---------------------------------------------------------------------------

describe('checkRenderedVersions — le rendu fait foi', () => {
  it('un composant NON inclus dans la page ne fait pas échouer', () => {
    // La chaîne périmée vit dans un composant retiré du rendu : elle
    // n'apparaît nulle part dans le HTML, donc rien à signaler.
    const rendu = `<main>${marked('v2.0.0')}</main>`; // le composant périmé est absent
    assert.deepEqual(checkRenderedVersions(page(rendu), REF).errors, []);
  });

  it('un composant inclus EST vu, sur n\'importe quelle page', () => {
    const pages = [
      { name: 'index.html', html: marked('v2.0.0') },
      { name: 'install/index.html', html: `<div>${marked('v1.0.0')}</div>` }, // périmée
      { name: 'vault/index.html', html: marked('v2.0.0') },
    ];
    const { errors, markerCount } = checkRenderedVersions(pages, REF);
    assert.equal(markerCount, 3);
    assert.equal(errors.length, 1);
    assert.ok(errors[0].includes('install/index.html'));
  });

  it('MARKER_UNPARSED : un marqueur déclaré mais illisible se rend illisible, pas conforme', () => {
    // Balise imbriquée : l'attribut est là, le texte n'est pas extractible.
    const html = `<span data-gradatum-version="current"><b>v2.0.0</b></span>${marked('v2.0.0')}`;
    const { errors } = checkRenderedVersions(page(html), REF);
    assert.ok(errors.some((e) => e.startsWith('MARKER_UNPARSED')), JSON.stringify(errors));
  });

  it('l\'attribut posé sur une balise existante (nav, code) est lu', () => {
    const html =
      `<span class="eyebrow nav-version" data-gradatum-version="current">v2.0.0</span>` +
      `<code data-gradatum-version="current">v2.0.0</code>`;
    const { errors, markerCount } = checkRenderedVersions(page(html), REF);
    assert.deepEqual(errors, []);
    assert.equal(markerCount, 2);
  });
});

// ---------------------------------------------------------------------------
// Critère 3 — les noms d'archives sont couverts
// ---------------------------------------------------------------------------

describe('checkRenderedVersions — noms d\'archives téléchargeables', () => {
  it('PASS : les trois archives affichées existent parmi les artefacts publiés', () => {
    const html =
      `${marked('v2.0.0')}` +
      `<code>gradatum-server-v2.0.0-x86_64-unknown-linux-gnu.tar.gz</code>` +
      `<code>gradatum-llm-v2.0.0-x86_64-unknown-linux-gnu.tar.gz</code>` +
      `<code>gradatum-sbom-v2.0.0.tar.gz</code>`;
    const { errors, archiveCount } = checkRenderedVersions(page(html), REF);
    assert.deepEqual(errors, []);
    assert.equal(archiveCount, 3);
  });

  it('ARCHIVE_UNKNOWN : une archive dont les artefacts n\'existent plus', () => {
    // C'est la commande que le visiteur copie — elle échouerait chez lui.
    const html = `${marked('v2.0.0')}<code>gradatum-server-v1.0.0-x86_64-unknown-linux-gnu.tar.gz</code>`;
    const { errors } = checkRenderedVersions(page(html), REF);
    assert.equal(errors.length, 1);
    assert.ok(errors[0].startsWith('ARCHIVE_UNKNOWN'), errors[0]);
    assert.ok(errors[0].includes('gradatum-server-v1.0.0-x86_64-unknown-linux-gnu.tar.gz'));
  });

  it('ARCHIVE_UNKNOWN : archive au bon numéro mais à la cible inexistante', () => {
    const html = `${marked('v2.0.0')}<code>gradatum-server-v2.0.0-aarch64-unknown-linux-gnu.tar.gz</code>`;
    const { errors } = checkRenderedVersions(page(html), REF);
    assert.equal(errors.length, 1);
    assert.ok(errors[0].startsWith('ARCHIVE_UNKNOWN'));
  });

  it('les archives sont contrôlées sans marqueur (structurel, dans un <pre>)', () => {
    const html =
      `${marked('v2.0.0')}<pre><code>curl -LO .../gradatum-server-v1.0.0-x86_64-unknown-linux-gnu.tar.gz \\\n</code></pre>`;
    const { errors } = checkRenderedVersions(page(html), REF);
    assert.equal(errors.length, 1);
    assert.ok(errors[0].startsWith('ARCHIVE_UNKNOWN'));
  });

  it('une archive répétée sur la même page n\'est signalée qu\'une fois', () => {
    const a = 'gradatum-server-v1.0.0-x86_64-unknown-linux-gnu.tar.gz';
    const { errors } = checkRenderedVersions(page(`${marked('v2.0.0')}<code>${a}</code><pre>${a}</pre>`), REF);
    assert.equal(errors.length, 1);
  });
});

// ---------------------------------------------------------------------------
// Non-vacuité et fail-closed
// ---------------------------------------------------------------------------

describe('checkRenderedVersions — non-vacuité et référence', () => {
  it('VACUOUS : sans aucune chaîne marquée, le contrôle ne vérifierait rien', () => {
    const { errors } = checkRenderedVersions(page('<p>v2.0.0 quelque part, non marquée</p>'), REF);
    assert.equal(errors.length, 1);
    assert.ok(errors[0].startsWith('VACUOUS'), errors[0]);
  });

  it('REFERENCE_EMPTY : référence absente → jamais un succès', () => {
    assert.ok(checkRenderedVersions(page(marked('v2.0.0')), null).errors[0].startsWith('REFERENCE_EMPTY'));
    assert.ok(checkRenderedVersions(page(marked('v2.0.0')), { tag: '' }).errors[0].startsWith('REFERENCE_EMPTY'));
  });

  it('référence sans artefact publié → toute archive affichée est signalée', () => {
    const ref = { tag: 'v2.0.0', assetNames: [] };
    const html = `${marked('v2.0.0')}<code>gradatum-sbom-v2.0.0.tar.gz</code>`;
    const { errors } = checkRenderedVersions(page(html), ref);
    assert.equal(errors.length, 1);
    assert.ok(errors[0].startsWith('ARCHIVE_UNKNOWN'));
  });
});
