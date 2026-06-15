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
    notes: 'Default. NVMe local only — NFS rejected: POSIX lock incompatibility causes data corruption under concurrent writers.',
  },
  {
    name: 'S3 / R2',
    tier: 'planned' as const,
    scheme: 's3',
    notes: 'AWS S3, Cloudflare R2, MinIO, Backblaze B2. Any S3-compatible endpoint. Feature flag available; backend implementation pending.',
  },
  {
    name: 'Azure Blob',
    tier: 'planned' as const,
    scheme: 'azblob',
    notes: 'Azure Blob Storage via OpenDAL azblob service. Feature flag available; backend implementation pending.',
  },
  {
    name: 'GCS',
    tier: 'planned' as const,
    scheme: 'gcs',
    notes: 'Google Cloud Storage. Service account or ADC auth. Feature flag available; backend implementation pending.',
  },
];

// Validate at build time — build fails if schema violated
export const storageBackends: StorageBackend[] = rawBackends.map((b) =>
  storageBackendSchema.parse(b)
);
