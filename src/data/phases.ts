/**
 * Phase data derived from ../gradatum/docs/PHASES.md
 * Validated at build time by Zod schema (see src/content/config.ts).
 * Zod .parse() is called for every entry — build fails on schema violation.
 * Update this file when PHASES.md changes.
 */
import { phaseSchema, type Phase } from '@/content/config';

const rawPhases = [
  {
    id: 'phase-1',
    name: 'Phase 1 — Core',
    status: 'done',
    version: 'v0.1.0-alpha',
    summary:
      'Operational Cargo workspace — tokio async, multi-vault schema, 22 focused crates. 244 tests ported from predecessor suite.',
    deliverables: [
      'gradatum-core: canonical types, traits, AuditEvent, schema_registry',
      'gradatum-markdown: MD parse/serialize + wikilink extractor',
      'gradatum-cache: moka LRU + checksum validation',
      'gradatum-queue: SQLite UPDATE…RETURNING atomic lease',
      'gradatum-chat: Heuristic + HttpChat + CircuitBreaker',
      'gradatum-embed: FastEmbedCpu (feature-gated) + HttpEmbedder + Fallback',
      'gradatum-index: SQLite FTS5 + drift Phase A',
      'gradatum-storage: OpenDAL + NFS reject (nfs_check.rs)',
      'gradatum-vault: registry + lifecycle + drift orchestration',
      'gradatum-curator: heuristic gating + LLM review + 3 fallback strategies',
      'v1-parity-tests: 22 integration tests across 8 domains',
      'gradatum-bench: 9 Criterion benches (docs/BENCH.md)',
    ],
    exit_criteria: [
      '244 tests pass (unit + integration)',
      'Multi-vault schema operational — single-vault "main", forward-compat staging',
      'CPU embed fallback tested',
      'Latency maintenance baseline documented (docs/BENCH.md)',
    ],
  },
  {
    id: 'phase-2-0',
    name: 'Phase 2.0 — Service',
    status: 'pending',
    version: null,
    summary:
      'HTTP/MCP façade + async worker + bearer auth + hierarchical ACL + presets. MVP equivalent to vault-mem v1.6.2 — 12 MCP methods exposed.',
    deliverables: [
      'gradatum-acl: glob pattern matching + argon2id bearer + rate limiting',
      'gradatum-server: Axum + rmcp 0.17 SSE + bearer auth + ACL middleware',
      'gradatum-worker: queue consumer + curator LLM + maintenance jobs',
      'gradatum-admin: CLI init/vault/backup/restore + presets materialisation',
      'gradatum-mcp-stub: stdio to HTTP thin proxy (MCP adapter)',
      '/health endpoint JSON structured',
      'gradatum-chat::OpenAICompat gateway',
      'Bench curator F1 at or above baseline on labeled v1 dataset',
      'Presets: flat, hierarchical, multi-project, team',
    ],
    exit_criteria: [
      'gradatum-server responds /health correctly',
      'ACL read-deny / write-deny tested per locus',
      'Bearer auth argon2id + rate limit validated',
      'Bench curator F1 at or above baseline v1',
      'Atomic vault swap tested',
      'MCP stdio adapter correctly proxies to HTTP server',
      '12 MCP methods live: vault_authors, vault_classify, vault_context, vault_downgrade, vault_graph, vault_list, vault_read, vault_search, vault_status, vault_tags, vault_trace, vault_write',
    ],
  },
  {
    id: 'phase-2-1',
    name: 'Phase 2.1 — Migration',
    status: 'pending',
    version: null,
    summary:
      'Migrate vault-mem v1.6.2 data to gradatum LIVE. Start 30-day real-world usage counter (D5 criterion for public v0.1.0 tag).',
    deliverables: [
      'gradatum migrate-from-v0 CLI (under gradatum-admin)',
      'ULID assignment + wikilink resolution + checksum calculation',
      'Post-migration validation: count / drift-zero / FTS5 indexed / embeddings',
      'Coexistence plan vault-mem v1.6.2 with gradatum documented',
      'Dogfooding D5: gradatum becomes primary knowledge management system',
    ],
    exit_criteria: [
      'Migration tested on real vault-mem dataset (zero drift)',
      'vault-mem v1.6.2 archived or decommissioned',
      'gradatum LIVE = primary knowledge management system',
      '30-day D5 counter started (date documented)',
    ],
  },
  {
    id: 'phase-2-2',
    name: 'Phase 2.2 — Agent Skill',
    status: 'pending',
    version: null,
    summary:
      'gradatum-usage skill for LLM/agent consumers — mapping of 12 MCP methods, note format, anti-rejection rules. Triple-mirror sync.',
    deliverables: [
      'SKILL.md gradatum-usage (multi-agent registry mirrors)',
      'MCP method mapping + note format guide + anti-rejection curator rules',
      'Council Art.19 review (skill = structural document)',
      'Practical test: agent writes a note without curator rejection',
    ],
    exit_criteria: [
      'SKILL.md live in 3 mirrors',
      'Council Art.19 GO',
      'Agent can write decisions/debug notes without curator rejection',
    ],
  },
  {
    id: 'phase-3',
    name: 'Phase 3 — Index v2',
    status: 'pending',
    version: null,
    summary:
      'Hybrid search quality on par with Lucene: sqlite-vec ANN, Tantivy full-text, RRF fusion, cross-encoder rerank, Prometheus metrics.',
    deliverables: [
      'sqlite-vec extension (ANN HNSW)',
      'Tantivy FTS migration from FTS5',
      'gradatum-search: RRF fusion (k=60) + 5 search modes',
      'gradatum-llm complete: circuit breaker + fallback Heuristic',
      'LlmBackend impls: OpenAICompat, Heuristic, Noop + example docs',
      '/metrics Prometheus pull endpoint',
      'JSON tracing via tracing-subscriber',
      'PageRank cross-project preserved',
    ],
    exit_criteria: [
      'Search recall at or above +30% vs v1 (measured)',
      'Circuit breaker switches to Heuristic in under 1s',
      'Prometheus metrics exposed',
      'LlmBackend tested on 3 or more backends',
    ],
  },
  {
    id: 'phase-4',
    name: 'Phase 4 — Polish',
    status: 'pending',
    version: null,
    summary:
      'Production quality: ULID wikilinks, note history, integrity check, offline bundle, .deb packaging, Docker, SIEM audit log.',
    deliverables: [
      'Wikilinks ULID + alias + resolution at write',
      'note_history table + rollback + diff commands',
      'Backlinks pre-computed (note_links_inverse)',
      'gradatum-admin integrity-check: checksum_md drift detection',
      'gradatum-admin backup/restore (SQLite .backup + tar.gz MD)',
      'gradatum-bundle.tar.gz offline self-contained',
      'Packaging: .deb (Debian/Ubuntu) + Dockerfile + binary release',
      'docs/DEPLOYMENT-HA.md: Litestream + rsync patterns',
      'SIEM integration: audit log JSONL + FIM groups',
      'Full OSS documentation: CONTRIBUTORS.md, SECURITY.md finalised',
    ],
    exit_criteria: [
      'Offline bundle tested on clean machine',
      '.deb + Docker image published',
      'Full OSS docs (READMETIME 5 min or under)',
      'Audit log ingested by a third-party SIEM',
    ],
  },
] as const;

// Validate at build time — throws ZodError on schema violation (fail-fast)
export const phases: Phase[] = rawPhases.map((p) => phaseSchema.parse(p));
