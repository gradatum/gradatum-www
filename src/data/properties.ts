/**
 * Property data — derived from src/data/properties.toml + gradatum README.md
 * Validated at build time by Zod schema (see src/content/config.ts).
 */
import { propertySchema, type Property } from '@/content/config';

const rawProperties = [
  {
    name: 'Embedded',
    description:
      'One Rust binary. No PostgreSQL. No Redis. No external services. apt install and you\'re running.',
  },
  {
    name: 'Self-hosted',
    description: 'Your memory, your machine. No telemetry. No vendor lock-in.',
  },
  {
    name: 'LLM-agnostic',
    description:
      'Plug any OpenAI-compatible backend (Ollama, vLLM, llama.cpp, OpenRouter, Anthropic) — or run heuristic-only with no LLM at all.',
  },
  {
    name: 'Multi-vault',
    description:
      'Separate main from staging and bench-* vaults for testing, migration, A/B prompts. Atomic swap when ready.',
  },
  {
    name: 'Hierarchical ACL',
    description:
      'Bearer-scoped access to memory loci. Configure from presets (flat, hierarchical, multi-project, team) or write your own.',
  },
  {
    name: 'Multi-storage',
    description:
      'OpenDAL abstraction — 8 backends: Local FS, S3/R2, Azure, GCS, WebDAV, SFTP, HDFS, IPFS. NFS explicitly rejected.',
  },
  {
    name: 'Markdown truth',
    description:
      'Notes are Markdown files with YAML frontmatter. Readable by humans, by Obsidian, by cat. The database is an index, not the source of truth.',
  },
  {
    name: 'Hybrid search',
    description:
      'BM25 (Tantivy) + semantic ANN (sqlite-vec) + PageRank graph + cross-encoder rerank. Multi-signal fusion via RRF.',
  },
] satisfies typeof rawProperties;

// Validate at build time — build fails if schema violated
export const properties: Property[] = rawProperties.map((p) =>
  propertySchema.parse(p)
);
