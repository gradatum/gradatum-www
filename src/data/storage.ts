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
    notes: 'Default. NVMe local only — NFS explicitly rejected (RFC-0002 §8 nfs_check.rs).',
  },
  {
    name: 'S3 / R2',
    tier: 'primary' as const,
    scheme: 's3',
    notes: 'AWS S3, Cloudflare R2, MinIO, Backblaze B2. Any S3-compatible endpoint.',
  },
  {
    name: 'Azure Blob',
    tier: 'secondary' as const,
    scheme: 'azblob',
    notes: 'Azure Blob Storage via OpenDAL azblob service.',
  },
  {
    name: 'GCS',
    tier: 'secondary' as const,
    scheme: 'gcs',
    notes: 'Google Cloud Storage. Service account or ADC auth.',
  },
  {
    name: 'WebDAV',
    tier: 'secondary' as const,
    scheme: 'webdav',
    notes: 'Self-hosted WebDAV (Nextcloud, Nginx, Apache). HTTP-based.',
  },
  {
    name: 'SFTP',
    tier: 'secondary' as const,
    scheme: 'sftp',
    notes: 'SSH File Transfer Protocol. Useful for remote NAS with SSH access.',
  },
  {
    name: 'HDFS',
    tier: 'experimental' as const,
    scheme: 'hdfs',
    notes: 'Hadoop Distributed File System. Enterprise / data-lake scenarios.',
  },
  {
    name: 'IPFS',
    tier: 'experimental' as const,
    scheme: 'ipfs',
    notes: 'InterPlanetary File System. Decentralised, content-addressed storage.',
  },
];

// Validate at build time — build fails if schema violated
export const storageBackends: StorageBackend[] = rawBackends.map((b) =>
  storageBackendSchema.parse(b)
);
