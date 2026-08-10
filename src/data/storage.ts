/**
 * Storage backend data — derived from src/data/storage.toml
 * Validated at build time by Zod schema (see src/content/config.ts).
 */
import { storageBackendSchema, type StorageBackend } from '@/content/config';

const rawBackends = [
  {
    name: 'Local FS',
    tier: 'primary' as const,
    scheme: 'fs',
    notes: 'Default. NVMe local recommended. The startup check that once refused NFS was removed in v2.0.0 — POSIX lock incompatibility under concurrent writers is now the deploying operator\'s call to make, not a blocked configuration.',
  },
  {
    name: 'S3 / R2',
    tier: 'secondary' as const,
    scheme: 's3',
    notes: 'AWS S3, Cloudflare R2, MinIO, Backblaze B2. Any S3-compatible endpoint. Available since v2.0.0 as an alternative to local filesystem — configuration-level choice, no code changes.',
  },
  {
    name: 'Azure Blob',
    tier: 'planned' as const,
    scheme: 'azblob',
    notes: 'Azure Blob Storage via OpenDAL azblob service. Same abstraction as S3; no backend wired up yet.',
  },
  {
    name: 'GCS',
    tier: 'planned' as const,
    scheme: 'gcs',
    notes: 'Google Cloud Storage. Same abstraction as S3; no backend wired up yet.',
  },
];

// Validate at build time — build fails if schema violated
export const storageBackends: StorageBackend[] = rawBackends.map((b) =>
  storageBackendSchema.parse(b)
);
