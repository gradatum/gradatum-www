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
        title: 'Working knowledge store — read, write, search, first deployment',
        version: 'v0.1.0-alpha.0→5',
        date: '2026-04',
      },
      {
        status: 'done',
        title: 'Accessible over HTTP and MCP — any client can connect without custom integration',
        version: 'v0.1.0-alpha.5',
        date: '2026-05-07',
      },
      {
        status: 'done',
        title: 'Search hardened — full-text and semantic results fused, accuracy improved',
        version: 'v0.1.0-alpha.7→10',
        date: '2026-05',
      },
      {
        status: 'done',
        title: 'Dependencies updated — no known vulnerabilities in the supply chain',
        version: 'v0.1.0-alpha.10-bumps.1',
        date: '2026-05',
      },
      {
        status: 'done',
        title: 'Search ranking improved — results reordered by relevance, not just keyword match',
        version: 'v0.1.0-alpha.11→13',
        date: '2026-05',
      },
      {
        status: 'done',
        title: 'Migrated to gradatum as its own primary store — dog-fooding from day one',
        version: 'v0.1.0-alpha.13',
        date: '2026-05-25',
      },
      {
        status: 'done',
        title: 'Auth tokens validated more strictly — future-dated tokens rejected',
        version: 'v0.1.0-alpha.14',
        date: '2026-05-28',
      },
      {
        status: 'done',
        title: 'Agent skills shipped — gradatum can remind itself what it knows and search its own vault',
        version: 'gradatum-skills v0.1.0',
        date: '2026-05-25',
      },
      {
        status: 'done',
        title: 'Note titles always resolve correctly — no more missing titles in search results',
        version: 'v0.1.0-alpha.15',
        date: '2026-05-28',
      },
      {
        status: 'done',
        title: 'Alpha series closed — stable enough for early adopters',
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
    scopeTeaserItems: ['Background jobs that survive restarts', 'Failed jobs captured, never silently dropped', 'Live job status via HTTP + real-time stream'],
    featureRefs: ['F-15', 'F-16'],
    showFeaturesLink: true,
    milestones: [
      {
        status: 'done',
        title: 'Background job engine wired — tasks run reliably in the background without blocking the API',
        version: 'v0.2.0',
        date: '2026-05-29',
      },
      {
        status: 'done',
        title: 'Failed jobs captured in a dead-letter queue — nothing is silently lost, retries are configurable',
        version: 'v0.2.0',
        date: '2026-05-29',
      },
      {
        status: 'done',
        title: 'Job status visible over HTTP with live push updates — operators see what is running and why',
        version: 'v0.2.0',
        date: '2026-05-29',
      },
      {
        status: 'done',
        title: 'v0.2.0 tagged — Bronze milestone, public OSS release',
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
    scopeTeaserItems: ['Pluggable storage (swap backend without rewriting)', 'Cost tracking per LLM call', 'Built-in LLM proxy + reranker', 'Notes tagged by cognitive type (episodic / semantic / procedural)', 'Auth key never hardcoded — injected at startup'],
    featureRefs: ['F-02', 'F-08', 'F-13', 'F-42'],
    showFeaturesLink: true,
    milestones: [
      {
        status: 'done',
        title: 'Storage split into three independent layers — swap the database, search index, or vector store without touching the rest',
        version: 'v0.3.0',
        date: '2026-06-01',
      },
      {
        status: 'done',
        title: 'Every LLM call logged with cost attribution — know exactly what each operation spent',
        version: 'v0.3.0',
        date: '2026-06-01',
      },
      {
        status: 'done',
        title: 'Built-in LLM proxy and reranker — route model calls and reorder results by relevance without a separate service',
        version: 'v0.3.0',
        date: '2026-06-01',
      },
      {
        status: 'done',
        title: 'Notes automatically tagged by memory type (episodic, semantic, procedural) — no LLM inference required, fully deterministic',
        version: 'v0.3.0',
        date: '2026-06-02',
      },
      {
        status: 'done',
        title: 'Auth key survives server restarts — sessions no longer expire unexpectedly on reboot',
        version: 'v0.3.0',
        date: '2026-06-02',
      },
      {
        status: 'done',
        title: 'v0.3.0 tagged — 28 crates, 1088 tests PASS, Bronze 3rd milestone',
        version: 'v0.3.0',
        date: '2026-06-02',
      },
      {
        status: 'done',
        title: 'v0.3.1–0.3.3 — Parallel workers no longer deadlock under concurrent job load',
        version: 'v0.3.3',
        date: '2026-06-02',
      },
      {
        status: 'done',
        title: 'v0.3.4 — Search results always show their title — no more blank note titles in results',
        version: 'v0.3.4',
        date: '2026-06-03',
      },
      {
        status: 'done',
        title: 'v0.3.5 — Semantic search results enriched with title and excerpt — easier to scan at a glance',
        version: 'v0.3.5',
        date: '2026-06-03',
      },
      {
        status: 'done',
        title: 'v0.3.6 — First public OSS release: source on GitHub, 28 crates published on crates.io (Apache-2.0)',
        version: 'v0.3.6',
        date: '2026-06-05',
      },
      {
        status: 'done',
        title: 'v0.3.7 — Read and write reliability fixed: search titles persist, notes retrievable by ID, internal links reconcile correctly',
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
    scopeTeaserItems: ['Smart document ingestion (content-aware chunking)', 'Full version history — every edit preserved', 'Safe concurrent writes — no lost updates', 'Notes decay by age, sources carry verifiable lineage', 'Auto-compaction keeps the vault lean without losing traceability', 'Scheduled distillation — raw notes compressed into reusable knowledge'],
    featureRefs: ['F-06', 'F-39', 'F-40', 'F-41', 'F-47', 'F-17', 'F-19', 'F-09', 'F-36', 'F-31', 'F-32', 'F-44', 'F-55', 'F-22', 'F-25', 'F-26'],
    showFeaturesLink: true,
    milestones: [
      {
        status: 'done',
        title: 'Every note carries a trust score based on its origin — search results rank sources you can verify higher',
        version: 'v0.4.0',
        date: '2026-06-06',
      },
      {
        status: 'done',
        title: 'Internal links between notes are stable — rename a note without breaking the references that point to it',
        version: 'v0.4.0',
        date: '2026-06-06',
      },
      {
        status: 'done',
        title: 'Concurrent edits are safe — two writers on the same note at once get a clear conflict error, not silent data loss',
        version: 'v0.4.0',
        date: '2026-06-06',
      },
      {
        status: 'done',
        title: 'Full edit history kept for every note — restore any previous version at any time',
        version: 'v0.4.0',
        date: '2026-06-06',
      },
      {
        status: 'done',
        title: 'v0.4.0 tagged — 28 crates, 1178 tests PASS, durable write milestone',
        version: 'v0.4.0',
        date: '2026-06-06',
      },
      {
        status: 'done',
        title: 'v0.4.1 — API never panics on bad input, all public docs written, SECURITY.md published, first crates.io + GitHub release',
        version: 'v0.4.1',
        date: '2026-06-06',
      },
      {
        status: 'done',
        title: 'v0.4.2 — Write response now returns the note ID, demote-note returns a clear 404 when the note does not exist',
        version: 'v0.4.2',
        date: '2026-06-07',
      },
      {
        status: 'done',
        title: 'v0.4.3 — Notes can be intentionally forgotten (with a dry-run preview), history pruning is configurable, multimodal input supported in the gateway',
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
      'Code index built from source — no LLM needed, zero hallucination',
      'Search your codebase by symbol, keyword, or file path',
      'Index stays in sync automatically — only changed files are reprocessed',
      'Browse notes chronologically, filter by date range',
      'Agent action tracing — what ran, when, and why',
      'Know for certain if a topic exists in the vault, not just "nothing found"',
      'Encrypted connections out of the box (TLS 1.2+/1.3)',
      'Edit notes safely under concurrent load — conflicts detected, never silently overwritten',
    ],
    showFeaturesLink: false,
    milestones: [
      {
        status: 'done',
        title: 'Edit a note in place without creating a new version — conflicts detected automatically if two writers race',
        version: 'v0.5.0',
        date: '2026-06-12',
      },
      {
        status: 'done',
        title: 'Every agent action logged for 90 days — audit what ran, when, and what it touched, without storing personal data',
        version: 'v0.5.0',
        date: '2026-06-12',
      },
      {
        status: 'done',
        title: 'Search can now confirm a topic is truly absent — not just "nothing ranked high enough"',
        version: 'v0.5.1',
        date: '2026-06-13',
      },
      {
        status: 'done',
        title: 'Browse notes in chronological order, filter by date range — see what was written before or after a given moment',
        version: 'v0.5.1',
        date: '2026-06-13',
      },
      {
        status: 'done',
        title: 'Codebase indexed from source — find any Rust function, struct, or file by name or keyword, no LLM required',
        version: 'v0.5.2',
        date: '2026-06-13',
      },
      {
        status: 'done',
        title: 'Code search by symbol, free text, or file path — optionally include the full source body in results',
        version: 'v0.5.2',
        date: '2026-06-13',
      },
      {
        status: 'done',
        title: 'Index updates only what changed — re-indexing after an edit takes milliseconds, not seconds',
        version: 'v0.5.2',
        date: '2026-06-14',
      },
      {
        status: 'done',
        title: 'Encrypted connections enabled natively — no reverse proxy required for TLS',
        version: 'v0.5.2',
        date: '2026-06-14',
      },
      {
        status: 'done',
        title: 'v0.5.2 tagged — 31 crates, 1925 tests PASS, source on GitHub (Apache-2.0)',
        version: 'v0.5.2',
        date: '2026-06-15',
      },
    ],
  },
  {
    version: 'v0.5.5',
    grade: 'Silver',
    status: 'planned',
    theme: 'Foundation Polish',
    description:
      'Closes the v0.5.x foundation window before the MCP-native pivot: real-time health observability (queue depth with accurate oldest-message age, build SHA in /health for unambiguous version proof), Rust 2024 edition upgrade across the full workspace, and surface-hardening of the knowledge base (backfill, public API hygiene). No new capabilities — the goal is a clean, verifiable baseline to build on.',
    scopeTeaserItems: ['Real-time health endpoint — queue depth + version proof', 'Codebase modernized to Rust 2024 edition', 'API surface cleaned and hardened before the MCP pivot'],
    featureRefs: [],
    showFeaturesLink: false,
  },
  {
    version: 'v0.6.0',
    grade: 'Silver',
    status: 'planned',
    theme: 'Queryable Memory Store — MCP-Native Backend',
    description:
      'Turns the completed vault into a memory store any client can query directly through the Model Context Protocol (MCP) — a native MCP server with Streamable HTTP transport, write-time schema validation with automatic repair, and a vault audit & deduplication pass. This is a deliberate ordering: the memory store becomes a stable, externally consumable product first — usable today by any MCP client (Claude, IDEs, custom agents) — and only then does gradatum grow its own context layer (v0.7.0) on top of the exact same interface it already exposes to everyone else. The store earns its API by serving others before it serves itself.',
    scopeTeaserItems: ['Connect Claude Code, IDEs, or any agent directly via MCP', 'Standard HTTP transport — no sidecar, no stdio pipe', 'Notes validated and auto-repaired on write', 'Vault audit — duplicates detected and cleaned'],
    featureRefs: ['F-38', 'F-56'],
    showFeaturesLink: true,
  },
  {
    version: 'v0.6.4',
    grade: 'Silver',
    status: 'done',
    theme: 'Studio Hardening + Security Baseline',
    description:
      'Closes the v0.6.x series with a focused security pass and a deep correctness audit. The admin UI now uses short-lived sessions (1 hour instead of 24), with a strict browser security policy that prevents script injection. The code index understands five languages. Twelve bugs found by the round-2 audit are fixed — including note deletion regressions and embedding edge cases. 2337 tests pass in optimized mode.',
    scopeTeaserItems: [
      'Admin UI sessions expire in 1 hour — shorter window if credentials are ever compromised',
      'Strict browser security policy (CSP) — no external scripts can run in the UI',
      'Clickjacking protection added for older browsers',
      'Request size capped at 512 KB — protection against oversized payloads',
      'Code index now understands Rust, Bash, TypeScript, React (TSX), and Python',
      '12 correctness bugs fixed (note deletion, embedding index validation, internal API encapsulation)',
      '2337 tests pass',
    ],
    showFeaturesLink: false,
  },
  {
    version: 'v0.7.0',
    status: 'planned',
    theme: 'Memory Layer + Context Assembly',
    description:
      'Adds the context-assembly layer that turns the vault from a passive store into an active participant: identity rendering, sliding-window memory, proactive recall, a declarative user profile, and skill selection that picks only relevant context before injection. gradatum can now consume its own memory store coherently across sessions — reasoning over accumulated knowledge rather than treating each query as stateless.',
    scopeTeaserItems: ['Assembles relevant context before each query — not raw retrieval', 'Memory window slides with the conversation — no context cliff', 'Proactively surfaces what you forgot you knew', 'Declarative user profile — gradatum knows who it is talking to', 'Picks only the skills relevant to the current task'],
    featureRefs: ['F-35', 'F-30', 'F-46', 'F-50', 'F-58', 'F-29'],
    showFeaturesLink: false,
  },
  {
    version: 'v0.8.0',
    status: 'planned',
    theme: 'gradatum-code — Sovereign Terminal Agent',
    description:
      'Ships the first version of gradatum-code: a terminal agent that reasons over the local codebase using the vault as its memory — symbol lookup, diff-aware context, project history recall, and task execution. gradatum-code runs entirely on local hardware, with no cloud dependency and no external code upload. Phase A covers the agentic core; later phases extend to IDE integration and collaborative workflows.',
    scopeTeaserItems: ['Terminal agent that reasons over your codebase', 'Finds the right symbol and understands what changed in the diff', 'Recalls past decisions and project history before acting', 'Runs entirely on local hardware — no code ever leaves your machine', 'Executes tasks end-to-end, not just suggestions'],
    featureRefs: [],
    showFeaturesLink: false,
  },
  {
    version: 'v1.0.0',
    grade: 'Gold',
    status: 'planned',
    theme: 'Production Baseline',
    description:
      'The first production-certified release — the point where gradatum becomes safe to build on. The public trait contracts freeze as stable (semver guarantees you can depend on), the privacy filter runs on a local ONNX (portable inference) path with no external LLM dependency, the system proves 30 days of continuous operation, and the full LongMemEval long-term-memory benchmark runs reproducibly. v1.0.0 adds no new API surface by design: it is a stability and certification milestone, not a feature drop — the moment the contracts stop moving.',
    scopeTeaserItems: ['API contracts frozen — safe to build on without breaking changes', 'Privacy filter runs locally — no data sent to external models', '30 days of continuous production operation proven', 'Long-term memory benchmark reproduced and published', 'Multi-user access + OAuth login'],
    featureRefs: ['F-45', 'F-57'],
    showFeaturesLink: false,
  },
  {
    version: 'v2.0.0',
    grade: 'Platinum',
    status: 'planned',
    theme: 'Multimodal + Consolidation',
    description:
      "Extends the platform to multimodal inputs with a breaking-change chat API and long-horizon memory consolidation — completing gradatum's trajectory from local knowledge store to autonomous cognitive infrastructure.",
    scopeTeaserItems: ['Images, audio, and documents understood alongside text', 'Long-horizon memory consolidation — the system learns from its own history'],
    featureRefs: ['F-49'],
    showFeaturesLink: false,
  },
];

export const versionPhases = versionPhaseArraySchema.parse(versions);
