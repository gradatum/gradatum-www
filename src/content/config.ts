/**
 * gradatum-www — content schemas (Zod strict)
 *
 * Architecture: schemas are exported from here for use in src/data/*.ts
 * TypeScript data files. Zod validation runs at import time (build fail-fast).
 * No Astro content loaders are used — data comes from static TS data files
 * to avoid cross-repo path resolution issues in sibling repos.
 *
 * Zod: from 'astro/zod' (re-exports zod, no separate install needed in Astro 5)
 */
import { z } from 'astro/zod';

export const RFC_STATUSES = ['accepted', 'postponed', 'rejected'] as const;
export const PHASE_STATUSES = ['pending', 'in-progress', 'done', 'live'] as const;
export const STORAGE_TIERS = ['primary', 'secondary', 'experimental'] as const;

// ── RFC schema ────────────────────────────────────────────────────────────────

export const rfcSchema = z.object({
  rfc_number: z
    .string()
    .regex(/^\d{4}$/, 'rfc_number must be 4-digit string e.g. "0003"'),
  title: z.string().min(1),
  status: z.enum(RFC_STATUSES),
  started: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'ISO date YYYY-MM-DD'),
  resolved: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'ISO date YYYY-MM-DD'),
  affected_crates: z.array(z.string().min(1)).min(1),
});

export type RfcEntry = z.infer<typeof rfcSchema>;

// ── Phase schema ──────────────────────────────────────────────────────────────

export const phaseSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  status: z.enum(PHASE_STATUSES),
  version: z.string().nullable(),
  summary: z.string().min(1),
  deliverables: z.array(z.string().min(1)).min(1),
  exit_criteria: z.array(z.string().min(1)).min(1),
});

export type Phase = z.infer<typeof phaseSchema>;

// ── Property schema ───────────────────────────────────────────────────────────

export const propertySchema = z.object({
  name: z.string().min(1),
  description: z.string().min(1),
});

export type Property = z.infer<typeof propertySchema>;

// ── Storage backend schema ────────────────────────────────────────────────────

export const storageBackendSchema = z.object({
  name: z.string().min(1),
  tier: z.enum(STORAGE_TIERS),
  scheme: z.string().min(1),
  notes: z.string().optional(),
});

export type StorageBackend = z.infer<typeof storageBackendSchema>;

// ── Feature schema ────────────────────────────────────────────────────────────

export const featureSchema = z.object({
  id: z.string().regex(/^f-\d{2}$/),
  refLabel: z.string().regex(/^F-\d{2}$/),
  name: z.string().min(10),
  positioning: z.string().min(20).max(200),
  howItWorks: z.array(z.string()).min(1).max(4),
  whoItsFor: z.string().min(20).max(200),
  status: z.enum(['released', 'planned', 'roadmap']),
  version: z.string().regex(/^v\d+\.\d+\.\d+$/),
});

export const featureGroupSchema = z.object({
  grade: z.enum(['Bronze', 'Silver', 'Gold', 'Platinum']),
  versionPrefix: z.string(),
  description: z.string(),
  features: z.array(featureSchema),
});

export const featureGroupArraySchema = z.array(featureGroupSchema);

export type Feature = z.infer<typeof featureSchema>;
export type FeatureGroup = z.infer<typeof featureGroupSchema>;

// Required by Astro — no file-based collections used
export const collections = {};
