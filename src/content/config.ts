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

export const PHASE_STATUSES = ['pending', 'in-progress', 'done', 'live'] as const;
export const STORAGE_TIERS = ['primary', 'secondary', 'experimental', 'planned'] as const;

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

// ── Roadmap schemas ───────────────────────────────────────────────────────────

export const MILESTONE_STATUSES = ['done', 'in-progress', 'next', 'planned'] as const;
export const VERSION_STATUSES = ['in-progress', 'planned', 'done'] as const;
export const VERSION_GRADES = ['Bronze', 'Silver', 'Gold', 'Platinum'] as const;

const milestoneSchema = z.object({
  status: z.enum(MILESTONE_STATUSES),
  title: z.string().min(1),
  version: z.string().min(1),
  date: z.string().optional(),
});

const versionPhaseSchema = z.object({
  version: z.string().regex(/^v\d+\.\d+\.\d+$/),
  grade: z.enum(VERSION_GRADES).optional(),
  status: z.enum(VERSION_STATUSES),
  theme: z.string().min(5),
  description: z.string().min(20),
  milestones: z.array(milestoneSchema).optional(),
  scopeTeaserItems: z.array(z.string().min(1)).optional(),
  featureRefs: z.array(z.string().regex(/^F-\d{2}$/)).optional(),
  showFeaturesLink: z.boolean().default(false),
});

export const versionPhaseArraySchema = z.array(versionPhaseSchema);
export type Milestone = z.infer<typeof milestoneSchema>;
export type VersionPhase = z.infer<typeof versionPhaseSchema>;

// ── Feature schema ────────────────────────────────────────────────────────────

export const featureSchema = z.object({
  id: z.string().regex(/^f-\d{2,3}$/),
  refLabel: z.string().regex(/^F-\d{2,3}$/),
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

export const featureGroupArraySchema = z.array(featureGroupSchema).superRefine((groups, ctx) => {
  const seen = new Set<string>();
  groups.forEach((group, gi) => {
    group.features.forEach((feature, fi) => {
      if (seen.has(feature.id)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: `Duplicate feature id '${feature.id}' found in group[${gi}].features[${fi}] — each feature id must be unique across all groups.`,
          path: [gi, 'features', fi, 'id'],
        });
      } else {
        seen.add(feature.id);
      }
    });
  });
});

export type Feature = z.infer<typeof featureSchema>;
export type FeatureGroup = z.infer<typeof featureGroupSchema>;

// ── Install mode schema ──────────────────────────────────────────────────────

export const INSTALL_LEVELS = ['L0', 'L1', 'L1+', 'L2', 'L3'] as const;
export const MCP_ACCESS_TYPES = ['stub', 'remote-oauth', 'both'] as const;
export const INSTALL_STATUSES = ['available', 'planned-v0.5', 'planned-v0.5.1', 'planned-v1.0'] as const;

export const installModeSchema = z.object({
  id: z.string().regex(/^[a-z-]+$/),
  name: z.string().min(1),
  level: z.enum(INSTALL_LEVELS),
  isDefault: z.boolean().default(false),
  tagline: z.string().min(20).max(180),
  useCase: z.string().min(20).max(200),
  command: z.string().min(5),
  services: z.array(z.string().min(1)).min(1),
  llm: z.string().min(1),
  mcpAccess: z.enum(MCP_ACCESS_TYPES),
  status: z.enum(INSTALL_STATUSES),
});

export const installModeArraySchema = z.array(installModeSchema);
export type InstallMode = z.infer<typeof installModeSchema>;

// ── Use case schema ──────────────────────────────────────────────────────────

export const useCaseSchema = z.object({
  id: z.string().regex(/^uc-\d{2}$/),
  title: z.string().min(8).max(80),
  withoutGradatum: z.string().min(20).max(300),
  withGradatum: z.string().min(20).max(300),
  featureRef: z.string().regex(/^F-\d{2}( · D-\d{2,3})?$/).optional(),
  sinceVersion: z.string().regex(/^v\d+\.\d+\.\d+$/),
  grade: z.enum(VERSION_GRADES),
  isPlanned: z.boolean().default(false),
});

export const useCaseArraySchema = z.array(useCaseSchema);
export type UseCase = z.infer<typeof useCaseSchema>;

// Required by Astro — no file-based collections used
export const collections = {};
