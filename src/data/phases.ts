/**
 * Phase data — synthèse roadmap projet gradatum.
 * Source : ../gradatum/CHANGELOG.md + ARCHITECTURE.md + tags Forgejo.
 * Validated at build time by Zod schema (see src/content/config.ts).
 * Update this file when new tag landed on main.
 *
 * Last sync : 2026-05-10 — alpha.13 LIVE.
 */
import { phaseSchema, type Phase } from '@/content/config';

const rawPhases = [
  {
    id: 'phase-1',
    name: 'Phase 1 — Core',
    status: 'done',
    version: 'v0.1.0-alpha.0 → alpha.5',
    summary:
      'Operational Cargo workspace — tokio async, multi-vault schema, 22 focused crates. 244 tests ported from predecessor suite. Foundation for everything that follows.',
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
      'Multi-vault schema operational',
      'CPU embed fallback tested',
      'Latency baseline documented',
    ],
  },
  {
    id: 'phase-2-0',
    name: 'Phase 2.0 — Service MVP',
    status: 'done',
    version: 'v0.1.0-alpha.5',
    summary:
      'HTTP/MCP façade + async worker + bearer auth + hierarchical ACL + presets. 12 MCP methods exposed — equivalent to vault-mem v1.6.2 baseline.',
    deliverables: [
      'gradatum-acl: glob pattern matching + argon2id bearer + rate limiting',
      'gradatum-server: Axum + rmcp + bearer auth + ACL middleware',
      'gradatum-worker: queue consumer + curator LLM + maintenance jobs',
      'gradatum-admin: CLI init/vault/backup/restore + presets materialisation',
      'gradatum-mcp-stub: stdio to HTTP thin proxy with auto-refresh JWT',
      '/health endpoint JSON structured + bearer auth argon2id',
      'Presets: flat, hierarchical, multi-project, team',
      '12 MCP methods live: vault_authors, vault_classify, vault_context, vault_downgrade, vault_graph, vault_list, vault_read, vault_search, vault_status, vault_tags, vault_trace, vault_write',
    ],
    exit_criteria: [
      'gradatum-server responds /health correctly',
      'ACL read-deny / write-deny tested per locus',
      'Bearer auth argon2id + rate limit validated',
      '12 MCP methods exposed end-to-end',
    ],
  },
  {
    id: 'phase-2-1',
    name: 'Phase 2.1 — Hardening',
    status: 'done',
    version: 'v0.1.0-alpha.8 → alpha.9',
    summary:
      'Production hardening: embedding pipeline + warden + vault_downgrade parity. Prepares safe dual-write coexistence with vault-mem during the migration window.',
    deliverables: [
      'gradatum-warden: invariant guard tower layer (read-only checks)',
      'Embedding pipeline async + backpressure + circuit breaker',
      'vault_downgrade endpoint with REFERENCES replaced_by',
      'VaultSearchRequest.include_downgraded flag (default false)',
      'PATCH /api/v1/notes/:id status flexibility',
      'Migration 0004_vault_downgrade.sql + partial index',
    ],
    exit_criteria: [
      'Warden tower layer rejects bad requests early',
      'vault_downgrade smoke test PASS LIVE',
      'Embed pipeline graceful under embedder outage',
    ],
  },
  {
    id: 'phase-2-3-search',
    name: 'Phase 2.3 — Search Quality',
    status: 'live',
    version: 'v0.1.0-alpha.10 → alpha.13',
    summary:
      'Hybrid search at parity-plus with vault-mem v1.6.2: foundations, semantic + RRF, multi-factor scoring, optional Jina cross-encoder reranker, endpoints completeness. Four sub-phases shipped in tight succession.',
    deliverables: [
      '2.3.1 Foundations (alpha.10): vault_status real, vault_list pagination, FTS5 native snippet, H1 title extract, +22 tests',
      '2.3.2 Semantic + RRF (alpha.11 + patch.1): cosine search in-process, RRF fusion k=60, DTO SearchHit.title, GradatumError::Inference, +34 tests',
      '2.3.3 Multi-Factor + Reranker (alpha.12): recency decay (λ=0.01), pagerank backlinks, composite scoring (α=0.2 β=0.1), Jina cross-encoder ONNX feature-gated, +25 tests',
      '2.3.4 Endpoints Completeness (alpha.13): wikilinks post-curate, title_lookup vault_read, vault_trace multi-mode, vault_context budget tokens, +17 tests',
      'TNR cumulative: 244 → 796 PASS workspace, 0 clippy, 0 fmt diff, cargo deny GREEN',
      '6 tags pushed Forgejo: alpha.10 / alpha.10-bumps.1 / alpha.11-patch.1 / alpha.12 / alpha.12-bumps.1 / alpha.13',
    ],
    exit_criteria: [
      'BM25 + semantic + RRF fusion live in handler',
      'Multi-factor composite scoring active by default',
      'Reranker pluggable trait + NoopReranker default + ONNX feature flag',
      '4 endpoints completeness landed (vault_read titre, vault_trace texte, vault_context budget, B5 wikilinks)',
    ],
  },
  {
    id: 'phase-2-2-bumps',
    name: 'Phase 2.2 — Supply Chain Hardening',
    status: 'done',
    version: 'v0.1.0-alpha.10-bumps.1 → alpha.12-bumps.1',
    summary:
      'Workspace dependency hardening: 5 of 6 planned bumps merged on main, with full TNR validation after each merge. Prepares the ground for OSS public release.',
    deliverables: [
      'PR-1 serde_yaml deprecated → serde_yml drop-in',
      'PR-2 rmcp 0.x → 1.x + schemars 1.x (breaking adapt)',
      'PR-3 HTTP stack: axum 0.8.9 + tower-http 0.6.10 + reqwest 0.13.3',
      'PR-5 crypto: sha2 0.11 + governor 0.10 + nix 0.31 + 12 minor catch-up',
      'PR-6 TOML stack 1.x + MSRV workspace 1.75 → 1.85',
      'TNR after each merge: 779 PASS / 0 clippy / 0 fmt / cargo deny GREEN',
    ],
    exit_criteria: [
      '5 of 6 PRs merged on main (PR-4 rusqlite deferred to Phase 2.3)',
      'Workspace MSRV 1.85 stable',
      'cargo deny GREEN after each bump',
    ],
  },
  {
    id: 'phase-2-x-5',
    name: 'Phase 2.x.5 — Polish',
    status: 'pending',
    version: null,
    summary:
      'Tail-end caveats accumulated through 2.x.1–2.x.4. Cosmetic + edge-case + N+1 query batching. Targeting alpha.14.',
    deliverables: [
      'C1 — title_lookup LIKE escape on user-input %/_',
      'C2 — vault_trace IN(...) batch (replaces N+1 trace_lineage)',
      'C7-bis — title column backfill on legacy notes (1/552 today)',
      'C9 — wikilinks N×N parallel via tokio::join_all or batch IN(...)',
      'Re-rank tokenizer query cached (skip repeated tokenisation per pair)',
      'Decommission build_snippet helper (replaced by FTS5 native)',
    ],
    exit_criteria: [
      'All Phase 2.x caveats closed or tracked Phase 3',
      'TNR 796+ PASS preserved, 0 regression',
    ],
  },
  {
    id: 'phase-2-3',
    name: 'Phase 2.3 — Migration vault-mem',
    status: 'pending',
    version: null,
    summary:
      'Migrate vault-mem v1.6.2 data into gradatum LIVE. Start the 30-day real-world usage counter (D5 criterion for the public v0.1.0 tag). PR-4 rusqlite bump unblocked once sqlx 0.9 stable lands.',
    deliverables: [
      'gradatum migrate-from-v0 CLI (under gradatum-admin)',
      'ULID assignment + wikilink resolution + checksum calculation',
      'Post-migration validation: count / drift-zero / FTS5 indexed / embeddings',
      'Coexistence plan vault-mem v1.6.2 with gradatum documented',
      'PR-4 rusqlite 0.32 → 0.39 (post sqlx 0.9 stable, links="sqlite3" conflict resolved)',
      'Dogfooding D5: gradatum becomes primary knowledge management system',
    ],
    exit_criteria: [
      'Migration tested on real vault-mem dataset (zero drift)',
      'vault-mem v1.6.2 archived or decommissioned',
      'gradatum LIVE = primary knowledge management system',
      '30-day D5 counter started',
    ],
  },
  {
    id: 'phase-3',
    name: 'Phase 3 — Production Reranker',
    status: 'pending',
    version: null,
    summary:
      'Take the alpha.12 reranker from feature-gated to first-class production: real Jina ONNX model wired in main.rs, golden set evaluation, recall measurement, ort 2.x stable migration once upstream releases.',
    deliverables: [
      'main.rs wires JinaOnnxReranker conditional on RERANKER_ONNX_PATH env var',
      'install-gradatum-services.sh fetches Jina cross-encoder ONNX model on opt-in',
      'tests/golden_set_recall.json: 50 manual query/expected_id pairs',
      'recall@5 measurement script + nightly CI run',
      'Migration ort 2.0.0-rc.9 → 2.x stable (post upstream release + council Art.19 if breaking)',
      'docs/specs/2026-05-10-phase-2x5-alpha-14-polish-spec.md backlog cleared',
    ],
    exit_criteria: [
      'Reranker live in production pipeline (not just feature-gated)',
      'recall@5 ≥ 0.75 measured on golden set',
      'ort 2.x stable shipped (no -rc.X dependency)',
    ],
  },
  {
    id: 'phase-4',
    name: 'Phase 4 — OSS Release',
    status: 'pending',
    version: null,
    summary:
      'Public v0.1.0 release: ULID wikilinks, note history, integrity check, offline bundle, .deb packaging, Docker image, SIEM-friendly audit log, full OSS docs.',
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
      'D5 30-day counter elapsed → public v0.1.0 tag',
    ],
  },
] as const;

// Validate at build time — throws ZodError on schema violation (fail-fast)
export const phases: Phase[] = rawPhases.map((p) => phaseSchema.parse(p));
