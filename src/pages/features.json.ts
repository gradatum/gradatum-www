import type { APIRoute } from 'astro';
import { featureGroups } from '../data/features';

/**
 * Artefact machine publié à la racine du site (dist/features.json).
 *
 * Surface publique MINIMALE : uniquement le triplet comparé par
 * scripts/project-map-gate.mjs (refLabel/status/version). Pas de name,
 * positioning, howItWorks, whoItsFor — ces champs restent réservés à la
 * page /features rendue.
 *
 * Source unique : le même src/data/features.ts que la page — jamais une
 * liste recopiée séparément (anti double-source de vérité).
 */
const entries = featureGroups.flatMap((group) =>
  group.features.map((feature) => ({
    refLabel: feature.refLabel,
    status: feature.status,
    version: feature.version,
  }))
);

export const GET: APIRoute = () => {
  return new Response(JSON.stringify(entries), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
    },
  });
};
