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
      'Separate main from staging and bench-* vaults for testing, migration, A/B prompts. Atomic swap when ready. Multi-agent addressing with VaultScope planned v0.4.2.',
  },
  {
    name: 'Hierarchical ACL',
    description:
      'Bearer-scoped access to memory loci. Two built-in presets: hierarchical (default) — admin and studio with full access, plus a main-agent orchestrator and typed sub-agents each scoped to their own read/write patterns; flat — a single consumer, a single locus, no isolation. Or point --preset at your own TOML file.',
  },
  {
    name: 'Multi-storage',
    description:
      'OpenDAL abstraction — local filesystem (default) and S3/R2-compatible object storage available since v2.0.0. Azure, GCS planned on the same abstraction. The startup check that once refused NFS was removed in v2.0.0; POSIX lock incompatibility under concurrent writers is now the deploying operator\'s call to make.',
  },
  {
    name: 'Markdown truth',
    description:
      'Notes are Markdown files with YAML frontmatter. Readable by humans and by cat. The database is an index, not the source of truth.',
  },
  {
    name: 'Hybrid search',
    description:
      'BM25 (SQLite FTS5) + semantic search (cosine brute-force; ANN (sqlite-vec) planned v0.5.3). PageRank graph + reranker abstraction (no-op by default; cross-encoder ONNX optional). Multi-signal fusion via RRF (Reciprocal Rank Fusion).',
  },
] satisfies typeof rawProperties;

// Validate at build time — build fails if schema violated
export const properties: Property[] = rawProperties.map((p) =>
  propertySchema.parse(p)
);
