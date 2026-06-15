/**
 * gradatum-www — Roadmap data (9 linear versions, Bronze→Platinum)
 *
 * Maintenance notes:
 *   Updating status/date of an existing milestone: edit in place, rebuild.
 *   Adding/removing a VersionPhase: update public OSS structure and rebuild.
 *   Changing theme/description/grade: update and rebuild.
 */
import type { VersionPhase } from '../content/config';
import { versionPhaseArraySchema } from '../content/config';

const versions: VersionPhase[] = [
  {
    version: 'v0.1.0',
    grade: 'Bronze',
    status: 'done',
    theme: 'Architecture Foundation',
    description:
      'Establishes the public architecture foundation — four persistence traits, a warden layer for note integrity, an install wizard for first-time setup, and smoke-test coverage so that early adopters can deploy a working knowledge store with confidence from the first release.',
    showFeaturesLink: true,
    milestones: [
      {
        status: 'done',
        title: 'Functional core',
        version: 'v0.1.0-alpha.0→5',
        date: '2026-04',
      },
      {
        status: 'done',
        title: 'Service mode (HTTP + MCP)',
        version: 'v0.1.0-alpha.5',
        date: '2026-05-07',
      },
      {
        status: 'done',
        title: 'Hardening + search foundations',
        version: 'v0.1.0-alpha.7→10',
        date: '2026-05',
      },
      {
        status: 'done',
        title: 'Supply chain bumps',
        version: 'v0.1.0-alpha.10-bumps.1',
        date: '2026-05',
      },
      {
        status: 'done',
        title: 'Search quality (RRF + reranker)',
        version: 'v0.1.0-alpha.11→13',
        date: '2026-05',
      },
      {
        status: 'done',
        title: 'Migrated off the predecessor backend — gradatum primary store',
        version: 'v0.1.0-alpha.13',
        date: '2026-05-25',
      },
      {
        status: 'done',
        title: 'Security hardening — JWT validate_nbf',
        version: 'v0.1.0-alpha.14',
        date: '2026-05-28',
      },
      {
        status: 'done',
        title: 'Gradatum Skills (reminder + vault-search)',
        version: 'gradatum-skills v0.1.0',
        date: '2026-05-25',
      },
      {
        status: 'done',
        title: 'Polish — title resolution, batched lookups, parallel wikilinks',
        version: 'v0.1.0-alpha.15',
        date: '2026-05-28',
      },
      {
        status: 'done',
        title: 'Stabilisation — alpha series wrap-up, OSS feedback integration',
        version: 'v0.1.x closing',
        date: '2026-05-29',
      },
    ],
  },
  {
    version: 'v0.2.0',
    grade: 'Bronze',
    status: 'done',
    theme: 'Job Infrastructure + Observability',
    description:
      "Lays the foundation for gradatum's background job system and makes it fully observable. This release introduces the job queue layer built on Apalis (https://github.com/geofmureithi/apalis) — a type-safe, SQLite-backed Rust job framework — including the Job enum, JobRecord lifecycle tracking, and per-class worker configuration. On top of that foundation, it ships a Dead-Letter Queue (DLQ) for failed background jobs with configurable retry policies, timeout enforcement, and panic isolation, so jobs that fail definitively are captured rather than silently dropped. A /api/v1/jobs introspection endpoint surfaces job state over HTTP, with a Server-Sent Events (SSE) stream for real-time push updates and Prometheus metrics per job kind, giving operators full visibility into what the system is running and why without polling.",
    scopeTeaserItems: ['Apalis job foundation', 'Dead-letter queue', 'Jobs introspection API + SSE'],
    featureRefs: ['F-15', 'F-16'],
    showFeaturesLink: true,
    milestones: [
      {
        status: 'done',
        title: 'F-14 partial: Apalis foundation + forward-compatible type definitions',
        version: 'v0.2.0',
        date: '2026-05-29',
      },
      {
        status: 'done',
        title: 'F-15: DLQ + Apalis Monitor multi-worker + Prometheus exporter',
        version: 'v0.2.0',
        date: '2026-05-29',
      },
      {
        status: 'done',
        title: 'F-16: /api/v1/jobs API + SSE + Idempotency-Key + admin CLI',
        version: 'v0.2.0',
        date: '2026-05-29',
      },
      {
        status: 'done',
        title: 'Tag v0.2.0 — Bronze 2nd milestone OSS public',
        version: 'v0.2.0',
        date: '2026-05-29',
      },
    ],
  },
  {
    version: 'v0.3.0',
    grade: 'Bronze',
    status: 'done',
    theme: 'Storage Traits + Event-Log + Secrets DI',
    description:
      'Decomposes the monolithic storage trait into three granular, pluggable interfaces (DocumentStore, IndexStore, VectorStore), ships an append-only event-log table for LLM cost-attribution telemetry, adds an autonomous LLM gateway crate (proxy + reranker), introduces deterministic cognitive-kind tagging for notes (CoALA — Cognitive Architectures for Language Agents — episodic/semantic/procedural/reflective), and fixes a critical JWT signing-key persistence bug that caused every server restart to invalidate all live tokens. Patch releases v0.3.1–0.3.3 harden the multi-worker job queue.',
    scopeTeaserItems: ['Storage trait carve', 'Event-log sink', 'LLM gateway', 'Cognitive kind (F-42)', 'Secrets DI'],
    featureRefs: ['F-02', 'F-08', 'F-13', 'F-42'],
    showFeaturesLink: true,
    milestones: [
      {
        status: 'done',
        title: 'Storage trait carve — DocumentStore / IndexStore / VectorStore + AppState dyn-dispatch',
        version: 'v0.3.0',
        date: '2026-06-01',
      },
      {
        status: 'done',
        title: 'Event-log sink (table event_log) + gateway cost-attribution (QaEvent +5 fields)',
        version: 'v0.3.0',
        date: '2026-06-01',
      },
      {
        status: 'done',
        title: 'gradatum-gateway crate — LLM proxy + reranker v1 (F-08), code-complete',
        version: 'v0.3.0',
        date: '2026-06-01',
      },
      {
        status: 'done',
        title: 'F-42: c_kind / doc_kind columns — deterministic CoALA mapping, zero LLM',
        version: 'v0.3.0',
        date: '2026-06-02',
      },
      {
        status: 'done',
        title: 'Secrets DI (F-13) + P0 fix: JWT key persisted (boot-stable, load-or-generate)',
        version: 'v0.3.0',
        date: '2026-06-02',
      },
      {
        status: 'done',
        title: 'Tag v0.3.0 — 28 crates, 1088 tests PASS, Bronze 3rd milestone',
        version: 'v0.3.0',
        date: '2026-06-02',
      },
      {
        status: 'done',
        title: 'v0.3.1–0.3.3 reliability patches — multi-worker job-queue concurrency (BEGIN IMMEDIATE deadlock fix)',
        version: 'v0.3.3',
        date: '2026-06-02',
      },
      {
        status: 'done',
        title: 'v0.3.4 — vault_search title:null fix (write-path: title column populated at curate, migration 0009 backfill)',
        version: 'v0.3.4',
        date: '2026-06-03',
      },
      {
        status: 'done',
        title: 'v0.3.5 — search read-path: semantic-only hits enriched with title+snippet; legacy title recovery — 1223 tests PASS, live',
        version: 'v0.3.5',
        date: '2026-06-03',
      },
      {
        status: 'done',
        title: 'v0.3.6 — First public OSS release: 28 crates published on crates.io, source open on GitHub (Apache-2.0)',
        version: 'v0.3.6',
        date: '2026-06-05',
      },
      {
        status: 'done',
        title: 'v0.3.7 — Reliability: search/read/write round-trip fixes (title persistence, vault_read by ULID, wikilink reconciliation)',
        version: 'v0.3.7',
        date: '2026-06-05',
      },
    ],
  },
  {
    version: 'v0.4.0',
    status: 'done',
    theme: 'Vault Core — Durable Memory Layer',
    description:
      'Completes the core knowledge store: structured ingest with content-aware chunking, copy-on-write note history with optimistic locking for safe concurrent writes, stable wikilink graph traversal, temporal decay scoring and provenance trust so retrieved content carries verifiable lineage, declarative lifecycle rules that keep the vault compact without losing traceability, scheduled distillation that compresses raw notes into reusable knowledge, and pluggable storage backends.',
    scopeTeaserItems: ['Structured ingest', 'Note history + locking', 'Temporal decay + provenance', 'Lifecycle + compaction', 'Scheduled distillation', 'Pluggable backends'],
    featureRefs: ['F-06', 'F-39', 'F-40', 'F-41', 'F-47', 'F-17', 'F-19', 'F-09', 'F-36', 'F-31', 'F-32', 'F-44', 'F-55', 'F-22', 'F-25', 'F-26'],
    showFeaturesLink: true,
    milestones: [
      {
        status: 'done',
        title: 'F-47 Provenance Trust Score — verifiable note lineage, trust field integrated with search ranking',
        version: 'v0.4.0',
        date: '2026-06-06',
      },
      {
        status: 'done',
        title: 'F-39 Stable Wikilinks — redirect_table, ULID anchors, backlink index at write time',
        version: 'v0.4.0',
        date: '2026-06-06',
      },
      {
        status: 'done',
        title: 'F-41 Optimistic Locking — write_if_match SHA-256 content hash, 409 Conflict on race',
        version: 'v0.4.0',
        date: '2026-06-06',
      },
      {
        status: 'done',
        title: 'F-40 Note History — copy-on-write version trail, history/* endpoints, max_versions cap',
        version: 'v0.4.0',
        date: '2026-06-06',
      },
      {
        status: 'done',
        title: 'Tag v0.4.0 — 28 crates, 1178 tests PASS, « Écriture durable » milestone',
        version: 'v0.4.0',
        date: '2026-06-06',
      },
      {
        status: 'done',
        title: 'v0.4.1 — Quality & reliability: zero-panic API surface, doc-comments 28 crates, SECURITY.md, revocation wired, MSRV 1.88, first public release (crates.io + GitHub)',
        version: 'v0.4.1',
        date: '2026-06-06',
      },
      {
        status: 'done',
        title: 'v0.4.2 — Internal: note_id in vault_write response, vault_downgrade 404, DTO unification, gateway metrics cardinality',
        version: 'v0.4.2',
        date: '2026-06-07',
      },
      {
        status: 'done',
        title: 'v0.4.3 — Vault lifecycle: semantic forget (dry-run + decay), note lifecycle state machine, configurable history pruning, multi-vault query scoping, multimodal gateway support, temporal index foundation',
        version: 'v0.4.3',
        date: '2026-06-10',
      },
    ],
  },
  {
    version: 'v0.5.2',
    grade: 'Silver',
    status: 'done',
    theme: 'Static Code Index + Observability',
    description:
      'Adds a static code index built with tree-sitter (Rust, zero LLM) — symbols are derived deterministically from source, stored in a separate code vault, and queryable by symbol name, free-text, or file path with optional body extraction. Drift detection and incremental O(diff) updates keep the index fresh without full rebuilds. Also ships: vault_timeline for chronological note listing (as-of / valid_until), session-log Tier 1 for agent action tracing, corpus_match_count as a proof-of-absence search signal, native TLS termination (rustls, TLS 1.2+/1.3, fail-closed), and vault_write in-place update (optimistic-lock RMW, 409 on conflict).',
    scopeTeaserItems: [
      'Static code index (tree-sitter Rust, zero LLM)',
      'code_scope query (symbol / query / path, include_body)',
      'Drift detection + incremental O(diff) update',
      'vault_timeline (chronological listing, as-of / valid_until)',
      'session-log Tier 1 (agent action tracing)',
      'corpus_match_count (proof-of-absence signal)',
      'Native TLS (rustls, TLS 1.2+/1.3, fail-closed)',
      'vault_write in-place update (optimistic-lock RMW)',
    ],
    showFeaturesLink: false,
    milestones: [
      {
        status: 'done',
        title: 'vault_write in-place update — optimistic-lock RMW, SHA-256 guard, 409 on conflict',
        version: 'v0.5.0',
        date: '2026-06-12',
      },
      {
        status: 'done',
        title: 'session-log Tier 1 — append-only agent action tracing, 90-day retention, PII-safe',
        version: 'v0.5.0',
        date: '2026-06-12',
      },
      {
        status: 'done',
        title: 'corpus_match_count — BM25/FTS5 proof-of-absence signal, opt-in, cap 10001',
        version: 'v0.5.1',
        date: '2026-06-13',
      },
      {
        status: 'done',
        title: 'vault_timeline — chronological note listing, as-of / valid_until filtering',
        version: 'v0.5.1',
        date: '2026-06-13',
      },
      {
        status: 'done',
        title: 'Static code index — tree-sitter Rust, NoteId::derived_from, migration 0016',
        version: 'v0.5.2',
        date: '2026-06-13',
      },
      {
        status: 'done',
        title: 'code_scope query endpoint — symbol / query / path modes, include_body, drift detection',
        version: 'v0.5.2',
        date: '2026-06-13',
      },
      {
        status: 'done',
        title: 'Incremental O(diff) code update — idempotent, <10ms on unchanged files',
        version: 'v0.5.2',
        date: '2026-06-14',
      },
      {
        status: 'done',
        title: 'Native TLS termination — [server.tls], rustls, TLS 1.2+/1.3, fail-closed',
        version: 'v0.5.2',
        date: '2026-06-14',
      },
      {
        status: 'done',
        title: 'Tag v0.5.2 — 31 crates workspace, source on GitHub (Apache-2.0), 1925 tests PASS',
        version: 'v0.5.2',
        date: '2026-06-15',
      },
    ],
  },
  {
    version: 'v0.5.0',
    grade: 'Silver',
    status: 'planned',
    theme: 'Queryable Memory Store — MCP-Native Backend',
    description:
      'Turns the completed vault into a memory store any client can query directly through the Model Context Protocol (MCP) — a native MCP server with Streamable HTTP transport, multi-user isolation with OAuth-based remote access, write-time validation with automatic repair, and a vault audit & deduplication pass. This is a deliberate ordering: the memory store becomes a stable, externally consumable product first — usable today by any MCP client (Claude, IDEs, custom agents) — and only then does gradatum grow its own agent runtime (v0.6.0) on top of the exact same interface it already exposes to everyone else. The store earns its API by serving others before it serves itself.',
    scopeTeaserItems: ['Native MCP server', 'Streamable HTTP transport', 'Multi-user + OAuth', 'Validation + auto-repair', 'Vault audit'],
    featureRefs: ['F-38', 'F-56', 'F-43', 'F-45', 'F-57', 'F-51', 'F-55'],
    showFeaturesLink: true,
  },
  {
    version: 'v0.6.0',
    status: 'planned',
    theme: 'Context Builder + Agent Runtime',
    description:
      'Adds the context-assembly layer — identity rendering, sliding-window memory, proactive recall, a declarative user profile, and skill selection that picks only the relevant skills before injection — together with the native ReAct (reason-and-act) agent runtime, its router and safety guards. From here gradatum can consume its own memory store autonomously, reasoning across sessions instead of treating each query as stateless, not only serving that store to external clients.',
    scopeTeaserItems: ['Context builder', 'Sliding window', 'Proactive recall', 'Skill selection', 'ReAct agent + guards'],
    featureRefs: ['F-35', 'F-30', 'F-46', 'F-50', 'F-58', 'F-04', 'F-05', 'F-11', 'F-12', 'F-29'],
    showFeaturesLink: false,
  },
  {
    version: 'v0.7.0',
    status: 'planned',
    theme: 'Serving + Composability',
    description:
      'Rounds out the platform with a bundled local inference engine, a web collector and messaging bridge, a progressive operations UI, pipeline orchestration, and a service registry — turning gradatum into a composable substrate other tools can build on.',
    scopeTeaserItems: ['Local inference engine', 'Collector + messaging', 'Operations UI', 'Pipeline orchestration', 'Service registry'],
    featureRefs: ['F-07', 'F-20', 'F-21', 'F-37', 'F-52', 'F-54'],
    showFeaturesLink: false,
  },
  {
    version: 'v1.0.0',
    grade: 'Gold',
    status: 'planned',
    theme: 'Production Baseline',
    description:
      'The first production-certified release — the point where gradatum becomes safe to build on. The public trait contracts freeze as stable (semver guarantees you can depend on), the privacy filter runs on a local ONNX (portable inference) path with no external LLM dependency, the system proves 30 days of continuous operation, and the full LongMemEval long-term-memory benchmark runs reproducibly. v1.0.0 adds no new API surface by design: it is a stability and certification milestone, not a feature drop — the moment the contracts stop moving.',
    scopeTeaserItems: ['Stable API — semver guarantees', 'Local ONNX privacy filter', '30-day production proof', 'Full LongMemEval reproducible'],
    featureRefs: [],
    showFeaturesLink: false,
  },
  {
    version: 'v2.0.0',
    grade: 'Platinum',
    status: 'planned',
    theme: 'Multimodal + BYOC + Consolidation',
    description:
      "Extends the platform to multimodal inputs with a breaking-change chat API, a bring-your-own-compute layer for external inference, a desktop agent, and long-horizon memory consolidation — completing gradatum's trajectory from local knowledge store to autonomous cognitive infrastructure.",
    scopeTeaserItems: ['Multimodal chat (BREAKING)', 'BYOC L4', 'Desktop agent', 'Memory consolidation'],
    featureRefs: ['F-03', 'F-10', 'F-27', 'F-49'],
    showFeaturesLink: false,
  },
];

export const versionPhases = versionPhaseArraySchema.parse(versions);
