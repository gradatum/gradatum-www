import type { FeatureGroup } from '../content/config';
import { featureGroupArraySchema } from '../content/config';

const groups: FeatureGroup[] = [
  {
    grade: 'Bronze',
    versionPrefix: 'v0.1.x',
    description:
      'First public release. Core memory abstractions, baseline network protection, and agent identity primitives.',
    features: [
      {
        id: 'f-01',
        refLabel: 'F-01',
        name: 'Warden: Network Access Control Layer',
        positioning:
          'Blocks unauthorized requests at the network boundary — before they reach any application logic.',
        howItWorks: [
          'Warden acts as an Axum (Rust web framework) middleware layer.',
          'On every incoming HTTP request, it evaluates the source IP address against a configurable list of CIDR (Classless Inter-Domain Routing) ranges.',
          'Requests outside the allowlist receive an immediate 403 Forbidden response; the request body is never read or logged.',
        ],
        whoItsFor:
          'Vault maintainers deploying gradatum on an internal or private network who want a first access control barrier without configuring a full reverse proxy.',
        status: 'released',
        version: 'v0.1.0',
      },
      {
        id: 'f-23',
        refLabel: 'F-23',
        name: 'Eval: Reproducible Memory Benchmarking',
        positioning:
          'Measures recall quality objectively using a curated subset of LongMemEval, a public reference benchmark for long-term memory systems.',
        howItWorks: [
          'The gradatum-bench crate exposes three coverage levels — smoke (a small set of fast sanity queries), full LongMemEval (deterministic, anchored on a public dataset), and governance-bench (write / forget / consolidate cycles targeting axes not covered by standard benchmarks).',
          'Scores are computed deterministically so results are comparable across versions.',
        ],
        whoItsFor:
          'OSS developers who want to confirm that code changes have not degraded recall fidelity, and researchers who want to compare gradatum with other systems on a neutral baseline.',
        status: 'released',
        version: 'v0.1.0',
      },
      {
        id: 'f-24',
        refLabel: 'F-24',
        name: 'Four Persistence Traits: Decoupled Storage Abstraction',
        positioning:
          "Defines four Rust traits that decouple gradatum's core logic from the underlying storage engine, making each backend independently replaceable.",
        howItWorks: [
          "DocumentStore (note read/write), IndexStore (full-text search index using FTS5 — SQLite's built-in full-text engine), VectorStore (embeddings and semantic search (ANN planned v0.5.3)), QueueStore (async job queue).",
          "The default implementation targets SQLite.",
          'Optional alternative backends (LanceDB, remote libsql) are planned for later releases.',
        ],
        whoItsFor:
          "Contributors who want to integrate a different storage backend or add a new implementation without touching gradatum's core.",
        status: 'released',
        version: 'v0.1.0',
      },
      {
        id: 'f-28',
        refLabel: 'F-28',
        name: 'Install Wizard and One-liner',
        positioning:
          'Reduces gradatum setup to two commands, including on a fresh system.',
        howItWorks: [
          'gradatum-admin init bootstraps a root directory (directories, permissions, base configuration).',
          'A downloadable one-liner script covers the bootstrapping case where no binary is pre-installed.',
        ],
        whoItsFor:
          'Anyone installing gradatum for the first time.',
        status: 'released',
        version: 'v0.1.0',
      },
      {
        id: 'f-33',
        refLabel: 'F-33',
        name: 'Session Memory Discipline for LLM Agents',
        positioning:
          'Opt-in conventions (a SKILL.md file) that prompt an LLM agent to record decisions and retrieve prior context before acting — preventing behavioral drift across long or resumed sessions.',
        howItWorks: [
          'Four mechanisms are covered — session trace (structured log of decisions made during the session), vault discipline (write rules to prevent duplicate entries), context sliding window (compaction protocol before the context window saturates), and skill crystallization (process for promoting an ad-hoc pattern into a reusable named skill). Internally referenced as SKILL.md Mode 2.',
          "These conventions ship as Markdown files injected directly into the agent's context.",
        ],
        whoItsFor:
          'Developers integrating gradatum into an LLM agent pipeline who want to prevent behavioral drift across long or resumed sessions.',
        status: 'released',
        version: 'v0.1.0',
      },
      {
        id: 'f-34',
        refLabel: 'F-34',
        name: 'Agent identity, protected',
        positioning:
          'Each agent can store a soul note — invariants, gates, narrative — in a protected identity section.',
        howItWorks: [
          'Enumeration of identity notes is hidden from non-privileged callers, preventing unauthorized discovery of agent identities.',
          'Reads and writes to identity notes are guarded per-agent with JWT-based access control, ensuring only the authorized agent can modify its own identity.',
          'The MCP server automatically injects an agent\'s own identity at initialize time, making agent context immediately available without requiring explicit retrieval.',
        ],
        whoItsFor:
          'Teams running persistent agents that need isolated, protected identity markers (invariants, gates, narrative) hidden from unauthorized callers.',
        status: 'released',
        version: 'v0.7.3',
      },
      {
        id: 'f-53',
        refLabel: 'F-53',
        name: 'Per-binary Scoped Configuration (conf.d/)',
        positioning:
          'Lets each gradatum component load only its own configuration, using a conf.d/ directory instead of a monolithic config file.',
        howItWorks: [
          'At startup, each binary (gradatum-server, gradatum-worker, gradatum-admin) reads only the configuration files whose for= directive matches its own name.',
          'This prevents configuration conflicts between co-located components and simplifies deployments where multiple gradatum processes run on the same host.',
        ],
        whoItsFor:
          'System operators deploying multiple gradatum components on a single host, or maintainers who want per-service configuration isolation to simplify updates and rollbacks.',
        status: 'released',
        version: 'v0.1.0',
      },
    ],
  },
  {
    grade: 'Silver',
    versionPrefix: 'v0.5.x',
    description:
      'Completes the durable memory layer and exposes the vault as a queryable MCP-native backend, authenticated with a server-issued API key.',
    features: [
      {
        id: 'f-06',
        refLabel: 'F-06',
        name: 'Ingest: Structure-Guided Document Chunking',
        positioning:
          'Turns external documents (PDF, HTML, DOCX, Markdown) into indexed, searchable notes — preserving structural boundaries instead of splitting arbitrarily.',
        howItWorks: [
          'A skeleton tree parses the document hierarchy; each logical section becomes one atomic note, so a clause is never split across two chunks.',
          'Table extraction converts tabular rows into indexable sentences (RowToSentence) so column relationships survive retrieval.',
          'A noise filter discards non-informative nodes (table of contents, executive summaries, glossaries) that degrade retrieval quality.',
          'Ingestion runs as a background Job::Ingest with progress tracking and automatic retry via the job queue.',
        ],
        whoItsFor:
          'Teams that need to import technical documentation, research papers, or meeting transcripts into the vault without losing the structural context that makes answers accurate.',
        status: 'planned',
        version: 'v2.2.0',
      },
      {
        id: 'f-39',
        refLabel: 'F-39',
        name: 'Stable Wikilinks: Persistent Cross-Note Graph',
        positioning:
          'Makes wikilink references between notes durable — links survive renames and deletions by anchoring to a stable ULID identifier rather than a file path.',
        howItWorks: [
          'A redirect_table maps every past title or path to the canonical ULID anchor, so [[old-title]] resolves correctly after the note is renamed.',
          'Backlinks are indexed at write time, exposing links_in/links_out on every search result for graph-neighborhood traversal.',
          'vault_search_multi merges results from multiple queries using Reciprocal Rank Fusion (RRF), so wikilink clusters surface naturally alongside keyword matches.',
        ],
        whoItsFor:
          'Knowledge engineers and developers who build interconnected notes and need cross-references to remain valid as the vault evolves over time.',
        status: 'released',
        version: 'v0.4.0',
      },
      {
        id: 'f-40',
        refLabel: 'F-40',
        name: 'Note History: Copy-on-Write Version Trail',
        positioning:
          'Records a complete version history for every note write, so any previous state of a note can be retrieved or diffed without external tooling.',
        howItWorks: [
          'On each vault_write, the previous version is stored in a .history/<ulid>/ directory before the note is updated (Copy-on-Write semantics).',
          'Dedicated history/* endpoints let callers inspect or restore any prior version by timestamp or sequence number.',
          'Lifecycle configuration caps storage at max_versions=50 per note, pruning the oldest revisions automatically.',
        ],
        whoItsFor:
          'Developers and teams who need an audit trail of how knowledge evolved — including distillation drift detection and rollback of accidental overwrites.',
        status: 'released',
        version: 'v0.4.0',
      },
      {
        id: 'f-41',
        refLabel: 'F-41',
        name: 'Optimistic Locking: Safe Concurrent Writes',
        positioning:
          'Prevents silent data loss when two processes write the same note concurrently, using a content-hash check instead of pessimistic locks.',
        howItWorks: [
          'vault_write accepts an optional write_if_match parameter containing the SHA-256 hash of the note version the caller last read.',
          'If the stored note has changed since that read, the server returns 409 Conflict with a WriteConflict descriptor — the caller decides how to merge.',
          'Writes without a hash succeed unconditionally, preserving backward compatibility for append-only workflows.',
        ],
        whoItsFor:
          'Developers building multi-agent pipelines or concurrent writer workflows where two agents may update the same note within the same time window.',
        status: 'released',
        version: 'v0.4.0',
      },
      {
        id: 'f-47',
        refLabel: 'F-47',
        name: 'Provenance Trust Score: Verifiable Note Lineage',
        positioning:
          'Attaches a computed trust score to every note, derived from its origin and distillation history, so retrieved content carries verifiable lineage.',
        howItWorks: [
          'Trust is calculated from four sources: the writing agent, the distillation chain, the number of corroborating notes, and the confidence score at ingestion.',
          'Distilled notes inherit a weighted mean of their source trust scores multiplied by the distillation confidence.',
          'The trust field integrates with temporal decay (F-17): notes from less-trusted provenance decay faster in search ranking.',
        ],
        whoItsFor:
          'Teams running multi-agent pipelines who need to distinguish high-confidence knowledge from speculative or low-provenance notes before acting on retrieved content.',
        status: 'released',
        version: 'v0.4.0',
      },
      {
        id: 'f-17',
        refLabel: 'F-17',
        name: 'Temporal Decay: Recency-Weighted Search Ranking',
        positioning:
          'Makes search results reflect how fresh and still-valid each note is — older or expired content scores lower without being deleted.',
        howItWorks: [
          'Each note carries a validity state (valid, temporal, or expired) and a document kind (static, versioned, or event), which together determine its decay profile.',
          'A recency score computed relative to the current date is blended with the semantic score using a configurable temporal weight (default 0.40).',
          'Event notes use a raw cosine relevance gate before decay is applied, preventing stale event records from surfacing on unrelated queries.',
        ],
        whoItsFor:
          'Agents and search clients that need results biased toward current knowledge — particularly useful for decision logs, meeting notes, and time-sensitive technical documentation.',
        status: 'released',
        version: 'v0.7.4',
      },
      {
        id: 'f-19',
        refLabel: 'F-19',
        name: 'Event-Log Vault: LLM Cost Attribution',
        positioning:
          'Records every LLM call made by the vault with model, token count, estimated cost, latency, and the feature that triggered it — giving full budget visibility per feature.',
        howItWorks: [
          'A QaEvent struct is captured by the gateway intercept layer at each LLM completion: model identifier, prompt/completion token counts, cost estimate, latency, and a feature_id tag.',
          'Events are stored in an append-only event_log table, queryable via the jobs introspection API for per-feature cost breakdowns.',
          'The event log feeds the distillation learn job (F-22), which uses token patterns to identify cost-optimization candidates over time.',
        ],
        whoItsFor:
          'Operators who need to understand which vault features drive LLM spend, and developers building cost-attribution dashboards or budget-alert workflows on top of the vault.',
        status: 'released',
        version: 'v0.4.4',
      },
      {
        id: 'f-36',
        refLabel: 'F-36',
        name: 'Drift Detection: Identity Write Hook',
        positioning:
          "Detects incoherent changes to an agent's identity notes (category-title mismatches) and flags them so they do not silently alter agent behavior.",
        howItWorks: [
          'A DriftDetector is registered as a WriteHook on DocumentStore at startup; it monitors writes to the identity/ locus without a direct vault dependency.',
          'On each write, the detector runs a deterministic category-title coherence check; a divergence triggers a drift_detected event (warn-only — it never blocks the write).',
          'The drift event is surfaced via the jobs SSE (Server-Sent Events) stream, allowing operators or higher-level workflows to review the change before it takes effect.',
        ],
        whoItsFor:
          'Operators running persistent agents whose identity notes must not change without explicit authorization — detecting accidental overwrites and adversarial prompt-injection attempts.',
        status: 'released',
        version: 'v0.7.3',
      },
      {
        id: 'f-31',
        refLabel: 'F-31',
        name: 'VaultScope: Multi-Vault and Multi-Agent Addressing',
        positioning:
          'Introduces a single addressing type that targets any locus across multiple vaults and agents with a single, unambiguous address — usable from any background job without per-job workarounds.',
        howItWorks: [
          'VaultScope encodes the vault identifier, the agent identifier, and the locus path as a single composable value, eliminating ambiguity when multiple vaults share a worker.',
          'Every background job (distillation, purge, audit, migration, and others) carries a VaultScope, making cross-vault operations a first-class primitive rather than a per-job workaround.',
          'All existing jobs are migrated to use VaultScope in a single coordinated change — no incremental per-job migration is needed.',
        ],
        whoItsFor:
          'Developers building multi-agent systems where several agents share or exchange knowledge across isolated vaults, and need deterministic addressing for background jobs.',
        status: 'released',
        version: 'v0.4.3',
      },
      {
        id: 'f-32',
        refLabel: 'F-32',
        name: 'Vault Lifecycle Management: State Machine, Retention and History Pruning',
        positioning:
          'Adds an explicit note lifecycle state machine (Draft → PendingReview → Live → Deprecated → Garbage) and declarative retention rules — keeping the vault compact and high-quality automatically.',
        howItWorks: [
          'Each note carries a lifecycle_state field; transitions are explicit API calls with optional guard conditions so no note skips a required validation step. Draft notes are excluded from search by default; Deprecated notes are downweighted.',
          'Operators define [[vault.lifecycle]] rules in TOML: conditions such as age, decay score, or locus pattern trigger a Job::Purge(Lifecycle). The purge job runs after distillation so no note is deleted before its value has been extracted.',
          'Configurable history pruning caps per-note version history with max_versions and a TTL, preventing unbounded growth of the .history/ directories.',
        ],
        whoItsFor:
          'Operators who want the vault to self-regulate quality over time, and teams building multi-agent pipelines that need a formal quality gate between note production and retrieval.',
        status: 'released',
        version: 'v0.4.3',
      },
      {
        id: 'f-44',
        refLabel: 'F-44',
        name: 'Semantic Forget: Intentional Scoped Deletion',
        positioning:
          'Lets operators explicitly remove a topic or locus from the vault — with a mandatory dry-run preview, double confirmation, and progressive decay instead of immediate deletion.',
        howItWorks: [
          'vault_forget(scope, dry_run: true) returns the full list of affected notes and any derived skills before any state change — the operator reviews and confirms explicitly.',
          'On confirmed deletion, notes are marked forgotten=true and decay accelerates over a configurable window, removing them from search results progressively rather than immediately.',
          'Cascade behavior is configurable: forgetting a knowledge/ topic can optionally propagate to linked skills/ and peers/ entries derived from it, with each cascade step listed in the dry-run preview.',
        ],
        whoItsFor:
          'Teams or individuals removing a project, topic, or person from the vault intentionally — with full visibility into what will be affected before committing, and a decay window to undo.',
        status: 'released',
        version: 'v0.4.3',
      },
      {
        id: 'f-55',
        refLabel: 'F-55',
        name: 'Temporal Index Foundation: Chronological Memory Queries',
        positioning:
          'Lays the foundation for time-aware vault queries — a chronological index from note frontmatter lets agents ask what happened before, after, or around a date without a calendar or graph database.',
        howItWorks: [
          'A TemporalIndex is derived at write time from frontmatter fields (occurred_at, valid_from, event-date, created) — no LLM extraction, no separate store. This release ships the index and the vault_timeline API surface; higher-level temporal reasoning ships in v0.5.0.',
          'The vault_timeline tool exposes before/after/around/upcoming queries; the index is fully reconstructible via a ReIndex job if frontmatter changes.',
          'Job::Validate cross-checks temporal contradictions between notes (e.g., two notes asserting conflicting event orders) as part of the memory validation pipeline.',
        ],
        whoItsFor:
          'Agents and developers who need to reconstruct decision timelines, detect sequencing contradictions, or surface upcoming-deadline notes — without adding a calendar or graph infrastructure.',
        status: 'released',
        version: 'v0.5.2',
      },
      {
        id: 'f-22',
        refLabel: 'F-22',
        name: 'Distill: Scheduled Knowledge Compression',
        positioning:
          'Automatically compresses accumulated raw notes into compact, reusable knowledge — running as scheduled background jobs while the vault is idle.',
        howItWorks: [
          'Four distillation modes run as Job::Distill: Semantic (synthesizes topic clusters into a single knowledge note), Learn (requires enough recorded LLM interactions (QaEvents) to extract meaningful cost and quality patterns), Peer (requires ≥5 sessions, builds a user behavior profile), and Rationale (preserves the reasoning chain behind decisions).',
          'Distilled notes inherit a trust score computed from their source notes, and a Note History fingerprint is stored so drift from the validated version can be detected later.',
          'DistillSource supports multi-vault targeting via VaultScope, allowing a distillation job to draw from notes across isolated vaults.',
        ],
        whoItsFor:
          'Developers running long-lived agent sessions who want raw notes compressed into searchable knowledge automatically — and teams building shared knowledge stores that grow in quality over time.',
        status: 'released',
        version: 'v0.5.2',
      },
      {
        id: 'f-60',
        refLabel: 'F-60',
        name: 'Lessons Recall: Dedicated Endpoint, MCP Tool, and Hook',
        positioning:
          'Surfaces distilled lessons-learned notes on demand via a dedicated recall endpoint, a native MCP tool, and an agent hook — making accumulated lessons actionable at decision time.',
        howItWorks: [
          'A dedicated GET /api/v1/lessons/recall endpoint queries the lessons-learned corpus with semantic search and returns ranked results with source attribution.',
          'A vault_lessons_recall MCP tool exposes the same surface directly to MCP clients, with optional role and tag filters so agents retrieve only domain-relevant lessons.',
          'A pre-action hook fires automatically when the agent is about to start a new task, injecting the top-3 matching lessons into the context before the first response.',
        ],
        whoItsFor:
          'Developers and agents who want past mistakes and validated patterns surfaced automatically before acting — not just stored somewhere and manually searched.',
        status: 'released',
        version: 'v0.5.2',
      },
      {
        id: 'f-61',
        refLabel: 'F-61',
        name: 'Multimodal Gateway: OpenAI Content-Array and Vision Routing',
        positioning:
          'Extends the gateway to accept the OpenAI content-array message format and route vision requests to an appropriate model — enabling multimodal inputs without changing the vault API.',
        howItWorks: [
          'The gateway parses ChatMessage::User as either a plain string or a Vec<ContentPart> (text + image_url), matching the OpenAI chat completions schema, so existing text-only clients are unaffected.',
          'A vision routing gate inspects the content array at request time: messages containing image parts are forwarded to a configured vision-capable endpoint; text-only messages follow the standard routing path.',
          'Configuration exposes a vision_endpoint field in the gateway TOML; if unset, image-bearing requests return a 422 with an explicit error rather than silently stripping the image.',
        ],
        whoItsFor:
          'Developers building agents that process screenshots, diagrams, or documents alongside text, and operators who want multimodal inputs handled at the gateway layer without routing logic in each client.',
        status: 'released',
        version: 'v0.4.3',
      },
      {
        id: 'f-62',
        refLabel: 'F-62',
        name: 'Code-Map: Multi-Language Source Indexing with Reverse-Dependency Graph',
        positioning:
          'Extends code search to multiple languages with a reverse-dependency graph — find every call site instantly without regex scanning.',
        howItWorks: [
          'Language-specific parsers extract definitions and call sites from source files; a unified code graph stores both forward dependencies (what a function calls) and reverse dependencies (what calls this function).',
          'The reverse-dependency index powers questions like "every place this function is used" — no regex scanning required, instant query results on any codebase.',
          'Symbol resolution is deterministic and language-aware: method names, free functions, imports, and exports are properly disambiguated without semantic analysis.',
        ],
        whoItsFor: 'Teams maintaining polyglot codebases needing call chain understanding across multiple languages.',
        status: 'released',
        version: 'v0.6.4',
      },
      {
        id: 'f-63',
        refLabel: 'F-63',
        name: 'VaultScope Patterns: Wildcard and Role-Filtered Agent Fan-Out',
        positioning:
          "Extends F-31's addressing from one target to many: a single scope pattern with wildcards and role filters reaches a set of agents in parallel, and merged results still respect agent boundaries.",
        howItWorks: [
          'Query scoping extends beyond single-agent addressing to reach multiple agents in parallel: scope definitions support wildcards and role filters so a distillation job can consolidate knowledge across all agents matching a pattern.',
          'Audit and compaction jobs can target a vault region or agent role rather than hard-coded addresses, making deployments flexible without custom per-agent coordination.',
          'Result merging respects agent boundaries so data stays isolated; a unified result set optionally labels which agent each note came from.',
        ],
        whoItsFor: 'Operators managing multi-agent deployments with distributed knowledge consolidation and querying.',
        status: 'planned',
        version: 'v2.2.0',
      },
      {
        id: 'f-64',
        refLabel: 'F-64',
        name: 'Compliance Forget: Retention Classes with Tamper-Evident Audit Trail',
        positioning:
          'Adds a compliance layer over F-44: a tamper-evident audit trail of every forget, declarative retention classes, and a graduated decay window after which the note can no longer be recovered.',
        howItWorks: [
          'Compliance mode appends a record of each forget to an append-only audit log, cryptographically hashed against the previous entry, so the trail of what was forgotten, and when, is tamper-evident.',
          'Retention policies are declarative: notes tagged with a retention_class are automatically forgotten when their retention window expires, without manual review.',
          'Graduated decay supports GDPR right-to-be-forgotten: rather than erasing on request, a configurable window keeps the note recoverable; once that window expires the note can no longer be recovered, and the forget stays in the audit log.',
        ],
        whoItsFor: 'Teams handling regulated data requiring audit-trail deletion compliance.',
        status: 'planned',
        version: 'vX.Y.Z',
      },
      {
        id: 'f-195',
        refLabel: 'F-195',
        name: 'Bounded Chronological Queries: Time-Window Vault Search',
        positioning:
          'Restricts vault search to a time window, so an agent can ask what was known before or after a given date instead of searching the whole history.',
        howItWorks: [
          'Search accepts an optional lower and upper time bound; either may be given alone, and an inverted range is rejected at the boundary rather than silently returning nothing.',
          'The filter applies to both retrieval paths — lexical and semantic — so a bounded query cannot leak results through the path that skipped the filter.',
          'Each result carries its temporal anchor, letting the caller order and reason about hits without a second lookup. Notes with no temporal entry are excluded when a bound is set, rather than assumed to match.',
        ],
        whoItsFor: 'Agents and analysts reconstructing what was known at a point in time, and anyone narrowing a search to a specific period.',
        status: 'released',
        version: 'v0.7.4',
      },
      {
        id: 'f-196',
        refLabel: 'F-196',
        name: 'Temporal Graph: Causal Chains, Concurrent Clusters and Contradictions',
        positioning:
          'Models the relationships between events rather than their timestamps alone — which event caused which, which happened together, and which pairs contradict each other.',
        howItWorks: [
          'A temporal graph records relationships between events — not just individual timestamps, but causal chains (A caused B) and concurrent clusters (A, B, C happened at the same time).',
          'Contradiction detection flags notes whose claimed ordering disagrees with their timestamps — event A claims to follow B, while the recorded times say B came later — and surfaces them to the validation pipeline.',
          'Open design question, deliberately unresolved: whether a causal edge is declared by the writer or inferred from timing and links. A declared edge is data; an inferred one is a hypothesis, and mixing them would make the graph mean nothing in particular.',
        ],
        whoItsFor: 'Researchers and analysts reconstructing event timelines and auditing them for internal contradictions.',
        status: 'planned',
        version: 'vX.Y.Z',
      },
      {
        id: 'f-197',
        refLabel: 'F-197',
        name: 'Historical Trends: How a Decision Evolved and What Triggered Each Change',
        positioning:
          'Turns a point-in-time lookup into a trajectory: not only what the decision was on a given date, but how it changed and what drove each change.',
        howItWorks: [
          'A trend query returns the ordered series of states a note went through, rather than only its latest revision.',
          'Each transition can be attributed to what triggered it — this part depends on the temporal graph, and is the only one of the three that does.',
          'Scope still to be established: whether a trend is computed over a note body, its typed roles, or an extracted value. The vault already keeps note history, so the open question is what is missing between that history and a trend query — not whether to build one from scratch.',
        ],
        whoItsFor: 'Analysts auditing how a decision or a value drifted over time, and agents that must explain a change rather than only report the current state.',
        status: 'planned',
        version: 'vX.Y.Z',
      },
      {
        id: 'f-26',
        refLabel: 'F-26',
        name: 'LanceDB Vector Backend: Scalable Embedding Store',
        positioning:
          'Replaces the default SQLite vector store with LanceDB for workloads where Approximate Nearest Neighbor (ANN) search on large embedding sets becomes a bottleneck.',
        howItWorks: [
          'The gradatum-db-lancedb crate implements the VectorStore trait backed by LanceDB, an embedded columnar vector database.',
          'Switching is opt-in via configuration — IndexStore (full-text) stays on SQLite; only the vector path moves to LanceDB, keeping the deployment simple.',
          'A Parquet-backed DocStore variant (planned for a later phase) will extend LanceDB to cover document storage as well for very large vaults.',
        ],
        whoItsFor:
          'Developers with vaults exceeding tens of thousands of notes who find SQLite ANN performance insufficient, and contributors who want to benchmark retrieval quality across storage backends.',
        status: 'planned',
        version: 'v2.1.0',
      },
      {
        id: 'f-37',
        refLabel: 'F-37',
        name: 'gradatum-studio: Vault Management Interface',
        positioning:
          'A local web interface for reading, searching, reviewing, and monitoring the vault — without exposing any API key or modifying the vault write path.',
        howItWorks: [
          'Five surfaces ship in the MVP: a dashboard (live vault metrics and recent activity), a note browser with inline markdown rendering, a search panel with score and section filters, a review queue (notes pending lifecycle validation), and a jobs monitor showing background task status.',
          'Authentication is handled via a single API key injected at startup; no OAuth or user database is required for the single-user deployment.',
          'A WHY scores panel surfaces the curator confidence and section classification for each note — making the reasoning behind search ranking visible and auditable.',
          'The interface is read-only for vault content by design; writes still go through the standard API so the vault write path remains the sole source of truth.',
        ],
        whoItsFor:
          'Developers and operators who want to inspect and monitor their vault through a browser rather than raw API calls, without adding infrastructure or weakening data sovereignty.',
        status: 'released',
        version: 'v0.5.2',
      },
      {
        id: 'f-38',
        refLabel: 'F-38',
        name: 'gradatum-mcp: Native Model Context Protocol Server',
        positioning:
          'Exposes the full vault API as a native MCP (Model Context Protocol) server — usable from any MCP-compatible client without an intermediary stub.',
        howItWorks: [
          'The gradatum-mcp crate publishes vault tools (vault_write, vault_search, vault_forget, vault_timeline, and others) as MCP capabilities with full JSON Schema definitions.',
          'Authentication is handled MCP-side, decoupled from the HTTP API auth layer, so the MCP surface has its own access control.',
          'The stdio transport (for local clients) and the Streamable HTTP transport (F-56, for remote clients) are both supported from the same crate.',
        ],
        whoItsFor:
          'Developers using MCP-compatible LLM clients (Claude Desktop, Cursor, custom agents) who want direct vault access without installing a local proxy stub.',
        status: 'released',
        version: 'v0.6.4',
      },
      {
        id: 'f-56',
        refLabel: 'F-56',
        name: 'Streamable HTTP Transport: Load-Balancer-Friendly MCP',
        positioning:
          'Implements the MCP 2025-11-25 Streamable HTTP transport — a single /mcp endpoint that works with load balancers, serverless runtimes, and mobile clients.',
        howItWorks: [
          'A single POST+GET /mcp endpoint handles all MCP traffic; responses are either plain JSON or upgrade to Server-Sent Events (SSE) per-request, without maintaining a persistent connection.',
          'This replaces the deprecated HTTP+SSE transport (spec 2024-11-05), which required a persistent SSE connection incompatible with most load balancers.',
          'The local stdio transport is preserved for desktop clients; optional backward-compatible SSE mode allows a smooth migration for existing integrations.',
        ],
        whoItsFor:
          'Operators deploying gradatum behind a reverse proxy or in a containerized environment, and mobile MCP clients (Claude for iOS/Android) that require a stateless HTTP transport.',
        status: 'released',
        version: 'v0.6.4',
      },
      {
        id: 'f-43',
        refLabel: 'F-43',
        name: 'Memory Validation: Self-Healing Before Storage',
        positioning:
          'Intercepts distilled notes before they enter long-term memory, corrects detectable errors automatically, and discards notes that cannot be repaired.',
        howItWorks: [
          'A background validation job computes a composite quality score; notes above a configurable threshold are accepted, notes with specific error patterns are routed to a repair strategy.',
          'Three repair strategies: contradiction patch (corrects numeric contradictions against source notes), entity scrub (removes hallucinated entity claims), and grounding rewrite (reconstructs under-anchored text from source material). Internally: ContradictionPatch, EntityScrub, GroundingRewrite.',
          'Repaired notes are stored with an audit flag (HEALED_ACCEPT) and a change log; notes that cannot be repaired are discarded cleanly — never silently stored.',
        ],
        whoItsFor:
          'Teams where distillation quality is critical — RAG pipelines, shared knowledge bases, long-running agents — who cannot afford hallucinated or contradictory notes accumulating in the vault.',
        status: 'released',
        version: 'v0.7.6',
      },
      {
        id: 'f-45',
        refLabel: 'F-45',
        name: 'Multi-Tenant Isolation: Enforced Scopes and Vault Boundaries',
        positioning:
          'Enforces tenant-level isolation at the storage layer — scoped vault resolution and write-path guards that fail closed, not just decorative permission checks.',
        howItWorks: [
          'Write paths are gated by an explicit scope check, not a label that looks like access control without enforcing it.',
          'A dedicated, fail-closed guard resolves the effective read vault, tenant, and write vault for every request.',
          'The multi-tenant flag runs active in production, backed by a fuzzed no-leak-between-vaults test as a continuous integration guard.',
        ],
        whoItsFor:
          'Operators running gradatum for more than one tenant who need vault boundaries enforced at the storage layer rather than assumed by convention.',
        status: 'released',
        version: 'v1.0.0',
      },
      {
        id: 'f-57',
        refLabel: 'F-57',
        name: 'OAuth MCP: Remote Access for Mobile and ChatGPT',
        positioning:
          'Enables gradatum to be reached from mobile MCP clients and ChatGPT without weakening sovereignty — using a self-hosted OAuth 2.1 authorization server.',
        howItWorks: [
          'Gradatum acts as an OAuth 2.1 resource server: it validates tokens and publishes Protected Resource Metadata (RFC 9728) but delegates token issuance to a self-hosted identity provider using OIDC (OpenID Connect) — such as Kanidm.',
          'The IdentityProvider trait decouples the identity provider from gradatum-auth (D-14), so the IdP is replaceable without modifying the authorization layer.',
          'PKCE (Proof Key for Code Exchange) S256, Dynamic Client Registration, and explicit consent flows are required — bearer-static tokens are not accepted, matching what Claude for mobile and ChatGPT require.',
        ],
        whoItsFor:
          'Operators who want to reach their vault from a mobile MCP client or ChatGPT without a VPN, and who want token rotation, explicit consent, and centralized revocation instead of static bearer tokens.',
        status: 'planned',
        version: 'vX.Y.Z',
      },
      {
        id: 'f-51',
        refLabel: 'F-51',
        name: 'Vault Audit and Deduplication: Scheduled Quality Pass',
        positioning:
          "Runs a scheduled audit pass over the vault to detect duplicate notes, score the vault's overall knowledge quality, and produce a conflict report.",
        howItWorks: [
          'Job::Audit(AuditMode) supports three modes: Detect (identifies duplicates and near-duplicates by semantic similarity), Deduplicate (merges or flags them), and Both (full pass).',
          'The audit produces a per-locus vault score reflecting coverage, freshness, and uniqueness — visible in the jobs introspection API.',
          'Conflict reports list notes with contradictory claims so operators or distillation jobs can resolve them explicitly rather than leaving ambiguity in the search index.',
          'Runs on a schedule in production today, regenerating a fresh audit report against the live vault.',
        ],
        whoItsFor:
          'Operators maintaining long-lived vaults where notes accumulate from multiple agents or ingestion pipelines, and who need a systematic quality baseline rather than ad-hoc manual review.',
        status: 'released',
        version: 'v1.0.0',
      },
      {
        id: 'f-02',
        refLabel: 'F-02',
        name: 'Gateway: Local LLM Proxy for Chat, Embeddings, and Reranking',
        positioning:
          'Provides a single local HTTP gateway in front of the LLM and embedding backends, so gradatum components talk to one stable endpoint instead of many provider-specific ones.',
        howItWorks: [
          'The gradatum-gateway crate exposes OpenAI-compatible routes — chat completions, embeddings, reranking, and model listing — over a local HTTP port.',
          'Requests are routed to the configured local backends, decoupling gradatum from any specific inference server and keeping all traffic on the host.',
        ],
        whoItsFor:
          'Operators running gradatum fully locally who want a single, stable inference endpoint that other components and tools can target without per-backend wiring.',
        status: 'released',
        version: 'v0.4.0',
      },
      {
        id: 'f-15',
        refLabel: 'F-15',
        name: 'Dead Letter Queue and Job Resilience',
        positioning:
          'Captures jobs that exhaust their retries into a Dead Letter Queue instead of losing them, so failed background work is auditable and replayable.',
        howItWorks: [
          'Each job carries a retry budget; once exhausted, it is moved to a Dead Letter Queue (DLQ) rather than silently dropped.',
          'Multiple workers coordinate through the shared queue with at-most-once execution per job, and a graceful 30-second drain on shutdown lets in-flight jobs finish before the process exits.',
          'DLQ entries retain their failure context so operators can inspect the cause and requeue once the underlying issue is fixed.',
        ],
        whoItsFor:
          'Operators running gradatum with background ingestion or distillation jobs who need guarantees that transient failures never result in silently lost work.',
        status: 'released',
        version: 'v0.2.0',
      },
      {
        id: 'f-16',
        refLabel: 'F-16',
        name: 'Jobs Introspection API: Observable Background Work',
        positioning:
          'Exposes the async job queue over HTTP so callers can submit, track, and stream the progress of background work in real time.',
        howItWorks: [
          'Five HTTP endpoints cover the job lifecycle — submit, list, fetch a single job, stream progress, and inspect queue state.',
          'Server-Sent Events (SSE) push live progress updates to clients without polling, and an Idempotency-Key header makes job submission safe to retry.',
          'Queue depth and per-status counters are exported in Prometheus format for dashboards and alerting.',
        ],
        whoItsFor:
          'Integrators who drive ingestion or maintenance jobs programmatically and need to observe their progress and outcome rather than firing blind.',
        status: 'released',
        version: 'v0.2.0',
      },
      {
        id: 'f-08',
        refLabel: 'F-08',
        name: 'Cross-Encoder Reranking for Precise Retrieval',
        positioning:
          'Re-scores candidate search results with a cross-encoder model so the most relevant notes rise to the top, beyond first-pass keyword and vector ranking.',
        howItWorks: [
          'After the initial retrieval, the gradatum-gateway /v1/rerank endpoint scores each query-document pair with a BGE-reranker-v2-m3 cross-encoder running locally on ONNX Runtime.',
          'The reranked order replaces the fused first-pass ranking, improving precision on the top results returned to the caller.',
        ],
        whoItsFor:
          'Developers whose retrieval quality depends on surfacing the single best note for a query, where first-pass ranking alone is not precise enough.',
        status: 'released',
        version: 'v0.3.0',
      },
      {
        id: 'f-13',
        refLabel: 'F-13',
        name: 'Secrets Dependency Injection: Provider-Backed Credentials',
        positioning:
          'Decouples gradatum from any single secret source through a SecretsProvider trait, so credentials can come from the environment, a file, or a future vault backend without code changes.',
        howItWorks: [
          'A SecretsProvider trait abstracts secret resolution, with EnvSecretsProvider and FileSecretsProvider implementations shipped by default.',
          'Resolved secrets are wrapped in a SecretBytes type that zeroizes on drop and masks its Debug output, so credentials never leak into logs or memory dumps.',
        ],
        whoItsFor:
          'Operators with strict credential-handling requirements who need secret sourcing to be configurable and auditable rather than hardcoded.',
        status: 'released',
        version: 'v0.3.0',
      },
      {
        id: 'f-42',
        refLabel: 'F-42',
        name: 'Curator Confidence Ladder: Graded Note Admission',
        positioning:
          'Routes incoming notes through a confidence ladder so high-confidence content is admitted directly while uncertain content is held for review instead of polluting the index.',
        howItWorks: [
          'The curator classifies each note and assigns a confidence band; low-confidence notes are routed to a PendingReview state rather than going live immediately.',
          'A dedicated curation kind (c_kind) column, added in migration 0008, records the classification decision so admission outcomes are queryable and auditable.',
        ],
        whoItsFor:
          'Vault maintainers ingesting content from heterogeneous or noisy sources who want automatic triage to protect overall index quality.',
        status: 'released',
        version: 'v0.3.0',
      },
      {
        id: 'f-29',
        refLabel: 'F-29',
        name: 'Reference-Language Memory: Pass-by-Reference Context',
        positioning:
          'Lets agents pass note references instead of full note bodies into the LLM context, keeping prompts compact while preserving the ability to resolve content on demand.',
        howItWorks: [
          'Context assembly passes stable note references rather than inlined bodies, and the referenced content is resolved only when the model actually needs it.',
          'This reduces token pressure on long agent sessions while keeping every reference traceable back to its canonical note.',
        ],
        whoItsFor:
          'Integrators building long-running agents that hit context-window limits and need to keep prompts lean without losing access to source notes.',
        status: 'released',
        version: 'v0.7.2',
      },
      {
        id: 'f-66',
        refLabel: 'F-66',
        name: 'Curator Threshold Tuning — continuation of F-42',
        positioning:
          'Completes the curator confidence ladder by finalizing the admission and review thresholds left open after the initial F-42 delivery.',
        howItWorks: [
          'Builds on the released curator ladder (F-42) to settle the remaining confidence cut-offs that govern direct admission versus held-for-review routing.',
          'The candidate threshold values are still under architectural review, so this continuation tracks the tuning work separately from the shipped baseline.',
        ],
        whoItsFor:
          'Vault maintainers who need the curator admission policy tuned to their own quality and noise profile rather than relying on the initial defaults.',
        status: 'released',
        version: 'v1.0.0',
      },
      {
        id: 'f-67',
        refLabel: 'F-67',
        name: 'Event-Log Cost Breakdown Query API — suite F-19',
        positioning:
          'Completes event-log cost attribution by adding a query API that surfaces cost breakdowns per feature, per model, and per time window.',
        howItWorks: [
          'Builds on the released F-19 event log infrastructure (QaEvent struct, append-only storage, 90-day retention) to expose a dedicated cost-breakdown endpoint.',
          'Queries span multiple dimensions: cost_per_feature (rolls up all LLM calls tagged with a feature_id), cost_per_model (aggregates by model identifier), and cost_per_day (trends over time).',
          'Results include estimated cost, token usage, and call frequency, enabling operators to identify cost-optimization opportunities and track spend trends over weeks.',
        ],
        whoItsFor:
          'Operators and cost analysts who need granular visibility into where vault LLM spend is going, and developers building cost-attribution dashboards.',
        status: 'planned',
        version: 'vX.Y.Z',
      },
      {
        id: 'f-68',
        refLabel: 'F-68',
        name: 'Lessons Recall Pre-Action Hook — suite F-60',
        positioning:
          'Completes lessons recall by adding an automatic pre-action hook that fires before the agent starts a new task, injecting relevant prior lessons into the context.',
        howItWorks: [
          'Builds on the released F-60 endpoint and MCP tool to add the remaining pre-action hook surface.',
          'When the agent is about to start a new task, the hook automatically queries the lessons-learned corpus with semantic search, retrieves the top-3 matching lessons, and injects them into Zone A of the context before the first response.',
          'Configuration allows operators to tune the hook sensitivity, lesson count, and filters (by domain, role, or tag) so lessons are contextually relevant and not overwhelming.',
        ],
        whoItsFor:
          'Developers building agents where automatic access to prior lessons before acting is critical — reducing repeated mistakes and accelerating decision quality.',
        status: 'released',
        version: 'v0.7.1',
      },
      {
        id: 'f-69',
        refLabel: 'F-69',
        name: 'Distill Learn/Peer/Rationale Modes — suite F-22',
        positioning:
          'Completes the distillation pipeline by shipping the Learn, Peer, and Rationale modes deferred from the F-22 Semantic-only release.',
        howItWorks: [
          'Builds on the released F-22 Semantic distillation mode to add three additional modes: Learn (extracts cost and quality patterns from QaEvents), Peer (builds user behavior profiles from session interactions), and Rationale (preserves the reasoning chain behind distilled decisions).',
          'Each mode runs as a background Job::Distill variant with its own criteria, frequency, and output format.',
          'All modes integrate with F-17 (trust scoring) and F-55 (temporal index) so distilled notes inherit verifiable lineage and can be queried by time.',
        ],
        whoItsFor:
          'Operators running multi-session vaults where automatic extraction of learning patterns and behavior profiles becomes valuable as the vault matures.',
        status: 'planned',
        version: 'vX.Y.Z',
      },
      {
        id: 'f-70',
        refLabel: 'F-70',
        name: 'Code-Map Qualified Method-Call Resolution — suite F-62',
        positioning:
          'Completes the code index by adding qualified method-call resolution, so "Type::method()" is correctly resolved to the specific implementation without ambiguity.',
        howItWorks: [
          'Builds on the released F-62 code-map reverse-dependency graph to handle the partial case: self.method() calls and qualified calls like Type::method() that require type inference.',
          'Language-specific type resolution is added per language (Rust trait resolution, TypeScript class hierarchies, Python method resolution order).',
          'Results include the resolved target implementation, qualified with its module and defining type, so call chains are fully traceable.',
        ],
        whoItsFor:
          'Code maintainers and refactoring tools where knowing the exact implementation that a method call targets is critical to safety and correctness.',
        status: 'released',
        version: 'v1.0.0',
      },
      {
        id: 'f-71',
        refLabel: 'F-71',
        name: 'Queue DAG: Job Dependency Chains',
        positioning:
          'Lets background jobs depend on each other — a job can declare that it waits for one or more prior jobs, and the queue ensures the dependency chain is respected.',
        howItWorks: [
          'Each job carries an optional await_jobs list of ULID references to prior jobs that must complete before this one can run.',
          'QueueStore::find_awaiting(job_id) queries for predecessors using LIKE-based locus prefix matching to avoid collision; QueueStore::set_pending(job_id) idempotently promotes a job from Waiting to Pending once all its dependencies are satisfied.',
          'When a job completes, the queue runs a cascade promotion sweep to identify newly unblocked dependents; if promotion fails, a recovery sweep runs on the next worker cycle.',
        ],
        whoItsFor:
          'Operators running complex background pipelines where one job must wait for another to finish — ingestion triggering distillation, or distillation triggering validation.',
        status: 'released',
        version: 'v0.6.4',
      },
      {
        id: 'f-72',
        refLabel: 'F-72',
        name: 'Agent Action Tracing',
        positioning:
          'Records every agent action — what ran, when, what it touched, and why — in an append-only log queryable for 90 days without external storage.',
        howItWorks: [
          'POST /api/v1/session-log/trace accepts agent action events (fire-and-forget, no update or delete) with fields: agent_id (stable server identifier from JWT sub), session_id, tenant_id, ts_ms (millisecond timestamp), action_type (enum), target (resource affected), intent (what the agent was trying to do), outcome (success/failure), marker (link to decision), and ref (pointer to related note).',
          'Storage is append-only; retention is configurable via [session_trace] retention_days (default 90).',
          'Queries via vault_timeline can reconstruct what an agent did in a session without storing personally identifiable data.',
        ],
        whoItsFor:
          'Operators who need an audit trail of agent activity without relying on external logging infrastructure, and teams building compliance or security workflows.',
        status: 'released',
        version: 'v0.5.2',
      },
      {
        id: 'f-73',
        refLabel: 'F-73',
        name: 'Proof-of-Absence Search Signal',
        positioning:
          'Adds a signal to search results that distinguishes "the topic is truly absent from the vault" from "the topic is present but not ranked high enough".',
        howItWorks: [
          'vault_search now accepts an optional include_corpus_count parameter (opt-in, zero overhead by default).',
          'When enabled, results include corpus_count: the total number of notes in the vault that matched the query at any score level (even below the ranking threshold).',
          'A corpus_count of 0 proves the topic is absent; a corpus_count > len(results) proves the topic exists but was filtered or re-ranked below the top-K.',
        ],
        whoItsFor:
          'Developers building workflows where it is critical to know whether information is truly missing versus just not highly ranked.',
        status: 'released',
        version: 'v0.5.2',
      },
      {
        id: 'f-74',
        refLabel: 'F-74',
        name: 'Native TLS Termination',
        positioning:
          'Adds native TLS 1.2+/1.3 support to the gradatum server, eliminating the need for a reverse proxy just to enable encryption.',
        howItWorks: [
          'The gradatum-server binary accepts [tls] configuration: cert_path (PKCS#8 certificate), key_path (private key), and optional min_tls_version (default 1.2).',
          'TLS termination happens at the socket layer; the HTTP API and MCP surface both run over the same encrypted connection.',
          'No external proxy, no sidecar — encryption is built in.',
        ],
        whoItsFor:
          'Operators deploying gradatum on private networks who need encryption without adding a reverse proxy or external gateway.',
        status: 'released',
        version: 'v0.5.2',
      },
      {
        id: 'f-81',
        refLabel: 'F-81',
        name: 'HippoRAG-2 Associative Recall: PPR over Wikilink Graph',
        positioning:
          'Associative recall that follows the wikilink graph — surfacing notes connected to your query, not just lexically or semantically similar ones.',
        howItWorks: [
          'Seeds Personalized PageRank (PPR) from the notes that match a query, then propagates over the note wikilink graph.',
          'Implements the HippoRAG-2 associative-memory approach: graph propagation surfaces indirectly-linked but relevant notes.',
          'Complements lexical and semantic search with structural, relationship-aware recall.',
        ],
        whoItsFor:
          'Users with densely interlinked vaults who want recall to follow connections that a keyword or embedding match alone would miss.',
        status: 'planned',
        version: 'vX.Y.Z',
      },
      {
        id: 'f-82',
        refLabel: 'F-82',
        name: 'Arbor HTR: Research Spike',
        positioning:
          'An exploratory research track evaluating Arbor for handwritten-text recognition (HTR) as a possible future ingest path — framed as a spike, not a commitment.',
        howItWorks: [
          'A time-boxed research spike, not a planned deliverable: evaluates the Arbor approach to handwritten / document-image text recognition.',
          'Probes the feasibility of turning handwritten or structured documents into vault-ingestible notes.',
          'The outcome decides whether this graduates into a committed feature or is shelved.',
        ],
        whoItsFor:
          'Forward-looking users curious about gradatum ingesting handwritten or document-image sources; explicitly exploratory.',
        status: 'planned',
        version: 'v2.2.0',
      },
      {
        id: 'f-05',
        refLabel: 'F-05',
        name: 'Router Dispatch: SmartRouter Capacity',
        positioning:
          'Routes incoming requests to the appropriate local backend based on task type and available inference capacity.',
        howItWorks: [
          'SmartRouter evaluates the request type and current backend load, then forwards the request to the best-available local model or API endpoint.',
          'Routing decisions are transparent to callers: the same endpoint handles all request types, and selection logic is configurable without application changes.',
        ],
        whoItsFor:
          'Backend operators running multiple local backends who need transparent routing without client-side dispatch logic.',
        status: 'released',
        version: 'v0.4.0',
      },
      {
        id: 'f-07',
        refLabel: 'F-07',
        name: 'Engine HTTP Supervisor: llama-server Lifecycle Manager',
        positioning:
          'Manages the llama-server process lifecycle, exposing stable model inference over a local HTTP endpoint.',
        howItWorks: [
          'A supervisor process starts, monitors, and restarts llama-server on failure, presenting a stable HTTP endpoint regardless of engine restarts.',
          'Health probes detect stalls and trigger a clean restart without dropping the listening socket from the caller\'s perspective.',
        ],
        whoItsFor:
          'Local deployments where stable inference availability across process restarts and crashes is required.',
        status: 'released',
        version: 'v0.3.0',
      },
      {
        id: 'f-14',
        refLabel: 'F-14',
        name: 'Job Enum and JobRecord: Five-Block Apalis Worker',
        positioning:
          'Defines the structured job taxonomy and typed execution blocks for the Apalis background worker.',
        howItWorks: [
          'Five typed job blocks (Ingest, Distill, Validate, Embed, Expire) map to Apalis job workers, each with its own error handling and retry policy.',
          'JobRecord persists job identity, status, and failure context so the queue is introspectable without external logging.',
        ],
        whoItsFor:
          'Backend operators who need to inspect, extend, or audit the background job processing pipeline.',
        status: 'released',
        version: 'v0.3.0',
      },
      {
        id: 'f-83',
        refLabel: 'F-83',
        name: 'Doc-Map: Reference Documentation Index',
        positioning:
          'Maintains a queryable index of reference documentation to reduce token cost and prevent stale content from degrading recall.',
        howItWorks: [
          'A scheduled job walks configured documentation sources, extracts structural headings, and persists a lightweight doc-map note per source.',
          'Queries against the map surface the canonical section rather than re-ingesting entire documents, keeping token overhead low.',
        ],
        whoItsFor:
          'Teams importing large reference materials who want fast targeted retrieval without redundant full-text overhead.',
        status: 'planned',
        version: 'vX.Y.Z',
      },
      {
        id: 'f-84',
        refLabel: 'F-84',
        name: 'OKF Interop: Open Knowledge Format Export',
        positioning:
          'Exports the vault as an Open Knowledge Format bundle for interop with external knowledge management tools.',
        howItWorks: [
          'An export command serialises vault notes, wikilinks, and metadata into a standards-compliant OKF bundle.',
          'The bundle can be imported into compatible tools or archived as a portable, documented knowledge backup.',
        ],
        whoItsFor:
          'Users who want to migrate their vault, share it with collaborators on other tools, or archive it in a portable format.',
        status: 'planned',
        version: 'vX.Y.Z',
      },
      {
        id: 'f-100',
        refLabel: 'F-100',
        name: 'On-Demand Delete: Reversible Archival with Retention GC',
        positioning:
          'Removes a note from the live vault by moving it to an archive tree instead of erasing it — recoverable until a configurable retention deadline, after which it is physically destroyed.',
        howItWorks: [
          'A delete moves the note\'s Markdown file and its .history/ directory under .archive/ in mirror layout and records a row in the registry-driven archive_index table; a durable JSONL audit tombstone is written before the cascade.',
          'A boot-and-interval GC selects archives past their 60-day (configurable) retention deadline from the registry — never a filesystem scan — and destroys them physically; destroyed and restored rows survive as history traces.',
          'Restoring re-indexes the note as pending-review so it re-enters the curator pipeline rather than returning straight to live, with a 409 on ULID collision.',
          'The gradatum-admin CLI drives delete, archive listing, purge, and restore (single ULID or a from/to range) dry-run by default over a loopback admin namespace; MCP exposes vault_archives_list read-only, so agents can see archives but never mutate them.',
        ],
        whoItsFor:
          'Operators who need to take notes out of the live vault without an irreversible step, and who want a review window plus an audit trail before anything is physically destroyed.',
        status: 'released',
        version: 'v1.0.0',
      },
      {
        id: 'f-101',
        refLabel: 'F-101',
        name: 'Memory Self-Healing: LLM Drift Validation (F-43 child)',
        positioning:
          'Extends the deterministic quality gate with an LLM-powered healing phase that rewrites low-quality summaries.',
        howItWorks: [
          'Notes tagged quality-low by the deterministic gate (F-43) are queued for a healing job that rewrites the summary against the source body using an LLM.',
          'The healed note is re-scored; if the new score clears the threshold it is promoted to live status. Healing runs asynchronously and is fully auditable.',
        ],
        whoItsFor:
          'Vaults where automated ingestion produces many low-quality summaries and manual curation is not practical at scale.',
        status: 'planned',
        version: 'vX.Y.Z',
      },
      {
        id: 'f-143',
        refLabel: 'F-143',
        name: 'Arrow Interchange Layer: Columnar Boundary for External Analytics',
        positioning:
          'Adds an Apache Arrow export layer on top of existing storage traits, so the corpus can be read by analytical tools without depending on the shape of any specific storage engine.',
        howItWorks: [
          "A columnar export layer sits above the existing storage traits — the storage engine itself is unchanged; only calls that already return batches convert their output to Arrow's in-memory format.",
          'Decouples the interchange boundary from any single database implementation, keeping the door open to a future storage engine change without touching business logic.',
        ],
        whoItsFor:
          'Developers and analysts who want to query the memory corpus with standard analytical tooling — bulk reads, not the point lookups the day-to-day API is built for.',
        status: 'planned',
        version: 'v2.1.0',
      },
      {
        id: 'f-146',
        refLabel: 'F-146',
        name: 'Parquet Corpus Export: Analytics Without Touching the Live Database',
        positioning:
          'Exports the memory corpus as Parquet files on object storage, so an external query engine or notebook can analyze it without ever touching the production database.',
        howItWorks: [
          'Converts the corpus through the Arrow interchange layer into Parquet, the columnar file format standard for analytical tooling, written to the existing object-storage backend.',
          'Runs on demand or on a schedule; an explicit exclusion rule decides what never leaves the vault before any file is written, since an export widens the read surface by design.',
        ],
        whoItsFor:
          'Operators and analysts who want to study how the memory corpus evolves over time — which sections stay active, which go stale — without duplicating or exposing the live database.',
        status: 'planned',
        version: 'v2.1.0',
      },
      {
        id: 'f-184',
        refLabel: 'F-184',
        name: 'Versions as Cards: The Project Map Drops Its Release Axis',
        positioning:
          'Turns each version into a card of its own, so a work item states which version carries it instead of restating that version’s delivery status on every single card.',
        howItWorks: [
          'A version becomes a ROADMAP card holding the version number and whether that version is internal or public; one BACKLOG card per project holds whatever is not yet scheduled. Every work card carries exactly one link to one of them, and no longer carries a version or a release field of its own.',
          'Delivery status is derived from that link and the target card’s status, which makes contradictory states unwritable rather than merely forbidden — a card can no longer announce itself as released while the version carrying it has not shipped. The public version a card ships under is frozen once, when that version ships, so a published changelog never rewrites itself afterwards.',
          'This is a breaking change for existing project-map cards: the card kinds gain two values, and the validator stops requiring the version and release roles it enforces today. A staged migration keeps both forms readable until every consumer has moved.',
        ],
        whoItsFor:
          'Vault maintainers who track work in the project-map section and want the state of a release to be a fact they can query, rather than a pair of fields to keep in sync by hand on every card.',
        status: 'planned',
        version: 'v2.1.0',
      },
      {
        id: 'f-149',
        refLabel: 'F-149',
        name: 'Remote Index Mode: Query the Index Database Over the Network',
        positioning:
          'Lets the index database live on a remote server reached over its native network protocol, instead of only ever opening a local file.',
        howItWorks: [
          'A pure remote mode sends every index query over the network rather than opening a local database file — the local mode remains the unchanged default.',
          'Vector-search acceleration is not available in remote mode since a standard remote database server does not load local extensions; the existing fallback path covers semantic search instead, at a cost that grows with corpus size.',
        ],
        whoItsFor:
          'Operators who want the index database to run on its own server — for centralization or easier operations — and who can accept that semantic search falls back to a slower path in that mode.',
        status: 'planned',
        version: 'v2.1.0',
      },
      {
        id: 'f-152',
        refLabel: 'F-152',
        name: 'Per-User Isolation Boundary: Distinct From Multi-Tenant Scoping',
        positioning:
          'A planned isolation boundary between individual users sharing one tenant — distinct from the tenant-level scoping already enforced in production.',
        howItWorks: [
          'Tenant-level isolation is already live and enforced; this closes the remaining gap where multiple users inside the same tenant are not yet separated from each other.',
          'Still at the scoping stage — what counts as a user relative to a tenant, and what isolation covers (read, write, search, proactive recall) are open questions to resolve before implementation.',
        ],
        whoItsFor:
          "Teams and households sharing a single gradatum deployment across several people, who need each person's private memory kept separate from the others, not just from other tenants.",
        status: 'planned',
        version: 'vX.Y.Z',
      },
      {
        id: 'f-160',
        refLabel: 'F-160',
        name: 'Privacy Filter: On-Device Redaction of Personal Data',
        positioning:
          'Redacts personal data from a note before it reaches the index — using an on-device recognition model, with no external API call or network dependency.',
        howItWorks: [
          'Runs before a note reaches the index, so redaction happens at write time rather than being bolted on afterward.',
          'Uses an on-device recognition model covering common categories of personal data, with no data ever leaving the host.',
        ],
        whoItsFor:
          'Teams ingesting documents that may carry personal data — emails, transcripts, exported records — who need a compliance-friendly path with no third-party data processing.',
        status: 'planned',
        version: 'v2.2.0',
      },
    ],
  },
  {
    grade: 'Gold',
    versionPrefix: 'v0.6.x–v1.0.x',
    description:
      'Adds the context-assembly and autonomous agent layer, then freezes the public API contracts at a production-certified, semver-stable baseline.',
    features: [
      {
        id: 'f-35',
        refLabel: 'F-35',
        name: 'Context Assembly Library',
        positioning:
          'A Rust library that assembles the context injected into an LLM agent — identity, capabilities, sliding window, and proactive recalls — from vault content.',
        howItWorks: [
          'A ContextBuilder composes four injection zones: identity and capabilities (Zone A), sliding-window memory (Zone B), pinned high-priority notes (Zone C), and proactive recalls triggered by relevance (Zone D).',
          'The library is consumed by gradatum-server, gradatum-worker, and the agent runtime — not a standalone service, no port, no network dependency.',
          'The capabilities zone injects the JSON Schema of available vault tools so the agent can discover and call them without hardcoded tool lists.',
        ],
        whoItsFor:
          'Developers building agent runtimes or custom tool integrations who need programmatic control over what vault content enters the LLM context and in what order.',
        status: 'released',
        version: 'v0.7.0',
      },
      {
        id: 'f-30',
        refLabel: 'F-30',
        name: 'Context Sliding Window: Session Continuity Without Overflow',
        positioning:
          'Keeps agent memory continuous across long sessions by offloading the oldest context to the vault before the context window saturates — invisibly, without losing continuity.',
        howItWorks: [
          'When the context window approaches its limit, Job::Summarize compresses the oldest segments into a vault note stored under the session locus.',
          'On the next session or context reset, the sliding window is restored from the vault — the agent continues with compressed but coherent history rather than a blank slate.',
          'A companion SKILL.md documents the sliding-window discipline so agents know when and how to trigger the compaction themselves.',
        ],
        whoItsFor:
          'Developers running long coding sessions, extended research tasks, or multi-turn agent workflows where context overflow today means losing the earlier part of the conversation.',
        status: 'released',
        version: 'v0.7.2',
      },
      {
        id: 'f-46',
        refLabel: 'F-46',
        name: 'Proactive Memory Surface: Unprompted Recall',
        positioning:
          'Surfaces vault notes that are relevant to the current context without the agent having to ask — injecting them into Zone D before the LLM responds.',
        howItWorks: [
          'After each response, ProactiveRecall runs a vault_search against the current context; notes whose cosine similarity exceeds the configured threshold are injected into Zone D of the next context window.',
          'Zone D recall is passive by default — the agent is notified that related notes exist; active retrieval still requires an explicit vault_search call.',
          'ContextBuilder::with_proactive_recall() toggles and configures the feature; the threshold and maximum injected notes are operator-tunable.',
        ],
        whoItsFor:
          'Developers building agents that should surface past decisions or prior solutions automatically — without the user having to remember to ask and without scanning the full vault on every turn.',
        status: 'released',
        version: 'v0.7.1',
      },
      {
        id: 'f-50',
        refLabel: 'F-50',
        name: 'User Profile: Declarative Identity Document',
        positioning:
          'A planned operator-authored profile note that would describe the human working with an agent — what it contains and how it is written are not yet decided.',
        howItWorks: [
          'Still at the scoping stage: the shape of the profile document, who authors it, and how it relates to credential-derived agent identity are open questions.',
          'No target version is committed — earlier internal milestones once assigned to this feature were never published as releases.',
        ],
        whoItsFor:
          'Individuals and teams who want every agent to have a reliable, human-authored picture of who they are working with, once the design is settled.',
        status: 'planned',
        version: 'vX.Y.Z',
      },
      {
        id: 'f-58',
        refLabel: 'F-58',
        name: 'Skill Selection: Targeted Injection Before Context Assembly',
        positioning:
          'Selects only the skills relevant to the current role and task before injecting them into Zone A — avoiding the overhead of loading every skill in the library on every turn.',
        howItWorks: [
          'Each skill carries metadata: applies_to roles, trigger keywords, and tags; skill_select(role, task) runs a role/keyword match to return only the relevant subset.',
          'Selection is not semantic search — it is deterministic metadata matching, which makes the result predictable and auditable without an embedding lookup.',
          'The selected skills are injected into Zone A by ContextBuilder; unselected skills remain in the library and are not loaded into the context window.',
        ],
        whoItsFor:
          'Developers managing large skill libraries who want agents to receive only the skills they need for the current task — reducing context noise and enabling community-contributed skill catalogs.',
        status: 'released',
        version: 'v0.7.0',
      },
      {
        id: 'f-75',
        refLabel: 'F-75',
        name: 'Gateway: Anthropic Messages API for Local-LLM Agents',
        positioning:
          'Adds native Anthropic Messages API support to the gateway, enabling Claude Code and any Anthropic-API client to run 100% locally without cloud dependencies.',
        howItWorks: [
          'The gateway adds native support for the Anthropic Messages API alongside the existing OpenAI routes (/v1/chat/completions, /v1/embeddings, /v1/rerank).',
          'Incoming Messages API calls are translated to the configured local LLM backend, preserving full API semantics (system prompts, tools, streaming, response formats).',
          'Clients like Claude Code and custom Anthropic-native tools can now target a local gateway endpoint instead of api.anthropic.com, keeping all inference on-machine.',
        ],
        whoItsFor:
          'Developers using Claude Code, custom agents, or tools that natively speak the Anthropic Messages API who want to run entirely on local hardware without cloud LLM dependencies.',
        status: 'released',
        version: 'v0.6.8',
      },
      {
        id: 'f-76',
        refLabel: 'F-76',
        name: 'gradatum-code: Terminal Agent Core',
        positioning:
          'Terminal agent that reasons over code using vault memory — finds symbols, understands diffs, recalls decisions, and executes tasks end-to-end, entirely local.',
        howItWorks: [
          'gradatum-code is an agent runtime built on top of the context assembly layer (F-35), the code index (F-62), vault storage, and decision recall from accumulated project history.',
          'It uses the vault as durable memory across sessions so it recalls what it did yesterday, what decisions were made, and what patterns worked or failed before.',
          'Execution is fully deterministic and auditable: every action is logged, every decision is traceable back to the vault.',
        ],
        whoItsFor:
          'Developers who want a terminal agent that understands their codebase deeply, remembers project history, and executes tasks end-to-end — not just suggest changes — entirely on their own machine.',
        status: 'planned',
        version: 'v3.0.0',
      },
      {
        id: 'f-77',
        refLabel: 'F-77',
        name: 'Diff-Aware Code Reasoning',
        positioning:
          'Understands code changes via diffs and code index, letting the agent reason about changes before acting.',
        howItWorks: [
          'The agent receives a diff and queries the code index (F-62) to understand the symbol context before and after the change.',
          'Side-by-side reasoning resolves what was modified, deleted, or added — feeding into decision logic for the next action.',
          'Integration with the vault surfaces prior decisions that touched the same symbols, allowing the agent to learn from past handling of similar code.',
        ],
        whoItsFor:
          'Developers working on large refactorings or incremental changes where understanding the exact code delta is critical to making the right next decision.',
        status: 'planned',
        version: 'v3.0.0',
      },
      {
        id: 'f-78',
        refLabel: 'F-78',
        name: 'Vault-Backed Decision Recall',
        positioning:
          'Recalls past decisions and project history from vault before executing tasks, ensuring reasoning is grounded in prior work.',
        howItWorks: [
          'Before acting on a new request, the agent queries the vault with the task description and retrieves the top-K decisions, past attempts, and lessons learned on similar work.',
          'The recalled context is injected into the agent context (via the context assembly layer) so decision-making is informed by project history, not just the current task.',
          'If a similar task succeeded or failed before, that knowledge is available to the agent without it having to rediscover it.',
        ],
        whoItsFor:
          'Teams and individuals who want their agent to build on prior work rather than starting from scratch, reducing repeated mistakes and accelerating task execution.',
        status: 'planned',
        version: 'vX.Y.Z',
      },
      {
        id: 'f-79',
        refLabel: 'F-79',
        name: 'End-to-End Local Task Execution',
        positioning:
          'Executes complete tasks on local hardware — not suggestions, but finished work with commits and full auditability.',
        howItWorks: [
          'The agent is given permission to execute file operations, run builds, commit changes, and push to a configured local or remote repo, all under auditable logging.',
          'Execution is bounded: the agent defines a task scope, estimates effort, and reports both success and failure with full context so humans can audit decisions.',
          'All actions are reversible: commits are traced, branches can be reset, and every change is logged in the vault for post-mortem analysis if needed.',
        ],
        whoItsFor:
          'Developers who want their agent to go beyond analysis and actually complete work end-to-end, with full auditability and control.',
        status: 'planned',
        version: 'v3.0.0',
      },
      {
        id: 'f-85',
        refLabel: 'F-85',
        name: 'Studio Observability: Task Health, Metrics, and Activity Trace',
        positioning:
          'Surfaces real-time background task health, operational metrics, and session activity in the admin studio.',
        howItWorks: [
          'Three panels expose: scheduled-job health with per-task status and last-run timing; curated metrics charts (request rates, latencies) rendered via uPlot; and a session activity trace browser showing per-session MCP call sequences.',
          'All data is served from existing gradatum endpoints — no external monitoring infrastructure is required.',
        ],
        whoItsFor:
          'Operators who need to understand what gradatum is doing in real time without leaving the admin studio.',
        status: 'released',
        version: 'v0.7.5',
      },
      {
        id: 'f-18',
        refLabel: 'F-18',
        name: 'Multi-Vault Init: Coordinated Vault Bootstrap',
        positioning:
          'Initialises and coordinates multiple isolated vault instances under a single gradatum deployment.',
        howItWorks: [
          'A bootstrap command provisions each named vault with its own SQLite database, schema, and configuration namespace.',
          'Routing between vaults is transparent to callers via VaultScope — no per-call routing logic is required in client code.',
        ],
        whoItsFor:
          'Teams running multiple isolated knowledge bases — one per project, team, or security boundary — on a single gradatum instance.',
        status: 'released',
        version: 'v1.0.0',
      },
      {
        id: 'f-86',
        refLabel: 'F-86',
        name: 'Cloud Storage Backends: S3 via OpenDAL',
        positioning:
          'Adds an S3-compatible object storage backend as an alternative to the local filesystem, using the OpenDAL abstraction layer.',
        howItWorks: [
          'A [storage] configuration section chooses between the local filesystem (default, byte-identical to prior behaviour) and any S3-compatible provider (AWS, OVH, MinIO, Ceph, Scaleway…) reached through a configurable endpoint.',
          'Credentials are read from the process environment, never from configuration. No application code changes are required — the swap is a configuration-level choice.',
          'GCS and Azure are exposed by the same OpenDAL abstraction but have no backend wired up yet — only the S3-compatible path is implemented.',
        ],
        whoItsFor:
          'Teams that need off-node durability or cross-machine vault access without migrating to a fully hosted product.',
        status: 'released',
        version: 'v2.0.0',
      },
      {
        id: 'f-131',
        refLabel: 'F-131',
        name: 'Embed Studio Bundle for crates.io Publication',
        positioning:
          'Embeds the gradatum-studio bundle inside the published crate, so the web UI ships together with the server instead of requiring a separate build step.',
        howItWorks: [
          'The studio frontend is compiled and embedded into the crate artifacts published on crates.io.',
          'Shipment is one-way: the studio is distributed as an integrated asset of the release rather than a standalone download.',
        ],
        whoItsFor:
          'Operators and OSS users who want to run the full gradatum stack — server plus studio UI — from the published crates without assembling assets manually.',
        status: 'released',
        version: 'v1.0.0',
      },
      {
        id: 'f-105',
        refLabel: 'F-105',
        name: 'Context Optimization for Local Claude Bench: Prefix Cache + Expand Tool',
        positioning:
          'Reduces context cost and latency for the local Claude benchmark path via prefix caching and an expanded tool surface — tracked as backlog.',
        howItWorks: [
          'Prefix-cache reuse keeps repeated prompt prefixes out of the per-call context budget for the local bench.',
          'An expand_tool surface exposes additional tool definitions without ballooning the base prompt.',
          'Scoped as backlog: no target version committed yet.',
        ],
        whoItsFor:
          'Operators running the local Claude bench who want lower token spend and faster turnarounds on repeated context workloads.',
        status: 'planned',
        version: 'vX.Y.Z',
      },
      {
        id: 'f-110',
        refLabel: 'F-110',
        name: 'C6 Salience: Per-Note Usage Signal',
        positioning:
          'Tracks a salience signal per note from read, search, and recall activity plus F-46 feedback, so retrieval can reflect real usage rather than static recency.',
        howItWorks: [
          'Each note accumulates a usage signal from read/search/recall events and F-46 feedback.',
          'The signal feeds ranking so frequently-used notes surface above merely-recent ones.',
        ],
        whoItsFor:
          'Operators of long-lived vaults who want recall quality to track what actually gets used, not just what was written recently.',
        status: 'released',
        version: 'v1.0.0',
      },
      {
        id: 'f-111',
        refLabel: 'F-111',
        name: 'C5 Graduated Forgetting: Relevance-Driven Auto-Downgrade',
        positioning:
          'Adds an automatic downgrade policy driven by relevance — shipped disabled by default, running in dry-run until an operator turns it on.',
        howItWorks: [
          'A relevance-based policy evaluates notes over time and would auto-downgrade those that stop earning attention — gradual demotion, never deletion.',
          'Ships with the executor off (dry-run only); enabling it in production is a deliberate operator action, not the default behavior.',
        ],
        whoItsFor:
          'Vault maintainers who want a downgrade policy ready to enable once they have reviewed its dry-run reports, without it reshaping the vault the moment they upgrade.',
        status: 'released',
        version: 'v1.0.0',
      },
      {
        id: 'f-125',
        refLabel: 'F-125',
        name: 'Dual Agent|User Identity: Operator Peer Card + Hybrid Injection',
        positioning:
          'Introduces a dual identity model where operations carry an agent or user identity, with an operator peer card keyed by user-id and hybrid identity injection into context.',
        howItWorks: [
          'Identity is carried per-operation as agent|user rather than a single fixed principal.',
          'An operator peer card is keyed by user-id; identity injection into the context is hybrid — combining agent and user signals.',
        ],
        whoItsFor:
          'Deployments with multiple human operators and agent processes sharing one vault, where attribution and scoping must distinguish who or what performed each action.',
        status: 'planned',
        version: 'v2.1.0',
      },
      {
        id: 'f-126',
        refLabel: 'F-126',
        name: 'Git-Version the Internal Vault Markdown (one-way observability)',
        positioning:
          'Versions the vault Markdown inside git for modification-cycle observability — a one-way mirror so history is tracked without coupling vault writes to git.',
        howItWorks: [
          'The internal vault Markdown is committed into git to make every modification cycle observable.',
          'The flow is one-way: git records the history, it does not drive vault mutations.',
        ],
        whoItsFor:
          'Operators who want an auditable modification trail of the vault content for review, backups, or diffing across time.',
        status: 'planned',
        version: 'vX.Y.Z',
      },
      {
        id: 'f-127',
        refLabel: 'F-127',
        name: 'Unify the Three Rights Stores with Referential Integrity (lot B6)',
        positioning:
          'Consolidates the three separate rights storage supports into a single database-backed store with referential integrity, removing drift between them.',
        howItWorks: [
          'The three current rights supports are merged into one store backed by the database.',
          'Referential integrity is enforced at the schema level so a rights entry cannot reference a missing principal or resource.',
        ],
        whoItsFor:
          'Operators and auditors who need a single authoritative rights store instead of reconciling three parallel sources of truth.',
        status: 'planned',
        version: 'vX.Y.Z',
      },
      {
        id: 'f-112',
        refLabel: 'F-112',
        name: 'Conditional Distill Cron: Pressure-Gated Scheduling',
        positioning:
          'Runs the distillation pipeline on a schedule, but only when a locus shows enough accumulated pressure — avoiding useless passes on quiet vaults.',
        howItWorks: [
          'A cron (default: Sunday 04:00) measures per-locus pressure (count of live, non-processed notes) and enqueues a distill job only for loci above the configured threshold.',
          'A dedup guard skips loci that already have an in-flight distill job.',
        ],
        whoItsFor:
          'Operators running long-lived vaults who want distillation to run automatically without burning passes on idle sections.',
        status: 'released',
        version: 'v1.0.0',
      },
      {
        id: 'f-138',
        refLabel: 'F-138',
        name: 'Credential-Derived Identity: No Default, No Client-Declared Author',
        positioning:
          "Ties every write's author strictly to the calling credential — never declared by the client, never inferred from a header, never defaulted — closing the identity-spoofing gap by construction.",
        howItWorks: [
          "Every write's author is resolved from the caller's credential on both the HTTP and MCP paths; a client-supplied author field is rejected outright.",
          'Each identity holds exactly one active key; an unresolved call is rejected rather than falling back to a default identity.',
          'A dedicated bootstrap key is required at install time, and identity write privileges run through a scope separate from administration.',
        ],
        whoItsFor:
          "Operators who need every note's authorship to be cryptographically trustworthy — no spoofed identities, no silent defaults, no ambiguity about who wrote what.",
        status: 'released',
        version: 'v2.0.0',
      },
      {
        id: 'f-139',
        refLabel: 'F-139',
        name: 'Durable Author Backfill: Offline Re-Attribution Tool',
        positioning:
          'An administrative command that assigns an author to pre-existing authorless notes directly on disk — without routing each one through the write API.',
        howItWorks: [
          'Selects candidate notes from the index, rewrites the Markdown file and its index row together, and recomputes the content hash that ties the two.',
          "Runs independently of the server version, is idempotent and resumable, and keeps the index author column and the file's frontmatter author in permanent agreement.",
        ],
        whoItsFor:
          'Operators migrating a vault to credential-derived identity who need every pre-existing note backfilled with a real author, without rewriting history by hand.',
        status: 'released',
        version: 'v2.0.0',
      },
      {
        id: 'f-144',
        refLabel: 'F-144',
        name: 'Cross-Agent Messaging and Proactive Push (Early Concept)',
        positioning:
          'A single delivery mechanism for anything an agent receives without asking — a message from another agent, or a memory the vault decides is worth surfacing on its own.',
        howItWorks: [
          'Two use cases are unified under one transport: agent-to-agent messages (sender, recipient, acknowledgment) and proactive push of memory the system judges relevant.',
          'The delivery mechanism itself — polling, a protocol-level push, or a separate channel — is still an open design question, and adoption of the feature as a whole has not been formally committed.',
        ],
        whoItsFor:
          'Agent builders who want agents to receive relevant input without polling for it — the concrete mechanism is still being designed.',
        status: 'planned',
        version: 'v2.2.0',
      },
      {
        id: 'f-150',
        refLabel: 'F-150',
        name: 'Engine Config Enforcement: warm_up and max_tokens Wired to Runtime',
        positioning:
          'Makes two previously cosmetic engine settings actually take effect at runtime instead of being parsed and silently ignored.',
        howItWorks: [
          'Decides and implements a real enforced ceiling for max_tokens, reconciled with the existing hard-coded cap so the two settings never silently conflict.',
          'Implements the warm_up lazy strategy that the setting already documented, or removes the field if that strategy turns out not to make sense.',
        ],
        whoItsFor:
          'Operators who configure engine behavior through the config file and expect every documented setting to actually change runtime behavior, not just be accepted and dropped.',
        status: 'planned',
        version: 'v2.1.0',
      },
      {
        id: 'f-154',
        refLabel: 'F-154',
        name: 'Capability-Aware Health Check: Beyond Queue Plumbing',
        positioning:
          'Extends the health check to measure the capabilities that actually make the product useful — embedding and curation — instead of only internal queue plumbing.',
        howItWorks: [
          'Adds measured status for each core capability: whether the worker is reachable and actually consuming jobs, whether an embedding endpoint responds, whether the review/curation endpoint responds, and whether the web interface bundle is present.',
          'Treats an unavailable embedder or curation endpoint as a hard failure rather than a healthy status, since those two capabilities are what makes an install actually useful rather than just running.',
        ],
        whoItsFor:
          'Operators and installers who need the health endpoint to catch a broken deployment at setup time — instead of it reporting healthy while the product silently cannot do its job.',
        status: 'planned',
        version: 'v2.1.0',
      },
      {
        id: 'f-156',
        refLabel: 'F-156',
        name: 'Service Registry: Registration, Heartbeat, and Build Identity',
        positioning:
          'Lets every component register itself, send a periodic heartbeat, and expose its build version and commit — so a single query tells you what is running, everywhere.',
        howItWorks: [
          'Each component registers with a name, address, and expiry on startup; heartbeat pings keep it listed, and a component that stops responding drops out automatically once its expiry passes.',
          'Every component also declares its build identity — version and commit — so establishing what a whole fleet is running no longer requires shell access to each machine.',
        ],
        whoItsFor:
          "Operators running several gradatum components across machines who need to answer 'what is running, and which build' with one query instead of connecting to each host.",
        status: 'planned',
        version: 'v2.1.0',
      },
      {
        id: 'f-157',
        refLabel: 'F-157',
        name: 'Central Configuration Authority: Server as Source of Truth',
        positioning:
          "Moves fleet configuration authority to the server, so components take their settings from it instead of each reading its own local file with no way to tell which one actually applies.",
        howItWorks: [
          'The server becomes the point where a fleet-wide setting is defined once and takes effect on the intended component, verifiable without shell access to any machine.',
          "The scope of this authority — which settings it covers, how it interacts with each component's local bootstrap configuration, and what happens if the server is unreachable at startup — is still being defined before implementation begins.",
        ],
        whoItsFor:
          'Operators running multiple components who currently have no way to tell whether a setting drifted between machines without connecting to each one individually.',
        status: 'planned',
        version: 'v2.1.0',
      },
    ],
  },
  {
    grade: 'Platinum',
    versionPrefix: 'v3.0.x',
    description:
      'Extends the platform to multimodal inputs, bring-your-own-compute infrastructure, desktop automation, and long-horizon memory consolidation.',
    features: [
      {
        id: 'f-49',
        refLabel: 'F-49',
        name: 'Memory Consolidation: Long-Horizon Mental Models',
        positioning:
          'Periodically distills the full knowledge store into thematic mental models — structured summaries of how the operator reasons, not just what they know.',
        howItWorks: [
          'A consolidation job runs monthly or quarterly (configurable); it requires a corpus of at least 90 days of matured notes before it produces meaningful output.',
          'Output is written to knowledge/consolidated/ as named mental-model notes that describe recurring reasoning patterns, not just topic summaries.',
          'Consolidated models are injected at a high-priority slot in the agent context, allowing the agent to reason from first principles rather than scanning hundreds of individual notes.',
        ],
        whoItsFor:
          'Long-term gradatum users — six months or more of active knowledge accumulation — who want their agent to reason from a compressed model of their thinking rather than raw notes.',
        status: 'planned',
        version: 'vX.Y.Z',
      },
      {
        id: 'f-03',
        refLabel: 'F-03',
        name: 'Multimodal Chat: Image and Vision Support (BREAKING)',
        positioning:
          'Extends the chat API to accept image inputs alongside text — enabling vision-capable workflows while introducing a breaking change to the ChatMessage type.',
        howItWorks: [
          'ChatContent becomes a union type (Text | Image); ChatMessage::User accepts Vec<ChatContent> instead of a single string — this is a semver-breaking change.',
          'The multimodal input path touches gateway, curator, worker, engine, and agent crates; all must be updated together in a coordinated release.',
          'Image content is processed by a vision-capable model routed through the gateway; the existing text path is unchanged for text-only clients.',
        ],
        whoItsFor:
          'Developers building agents that analyze screenshots, diagrams, or document scans — and integrators prepared to migrate from the v1.x text-only ChatMessage API.',
        status: 'planned',
        version: 'v3.0.0',
      },
      {
        id: 'f-10',
        refLabel: 'F-10',
        name: 'Agent Desktop Feature: Screen Capture and Vision Automation',
        positioning:
          'Adds a desktop feature flag to the agent that enables screen capture, UI analysis, and vision-driven automation — building on the multimodal chat foundation.',
        howItWorks: [
          'A desktop Cargo feature flag activates the screen-capture pipeline in gradatum-agent; it is disabled by default and has no runtime cost when not enabled.',
          'Captured screenshots are passed to the multimodal chat API (F-03) for analysis; the agent can then act on the visual content using the standard tool-calling interface.',
          'The desktop feature depends on F-03 being available; it is not usable on text-only deployments.',
        ],
        whoItsFor:
          'Developers building automation agents that interact with desktop applications, analyze UI states, or need to reason about visual content without a separate vision pipeline.',
        status: 'planned',
        version: 'v3.0.0',
      },
      {
        id: 'f-27',
        refLabel: 'F-27',
        name: 'Bring Your Own Compute (BYOC) — L4 Cloud Scale',
        positioning:
          'Extends gradatum to a full L4 bring-your-own-compute (BYOC) deployment model — multi-region inference, cloud-managed load balancing, and enterprise-scale multi-tenancy.',
        howItWorks: [
          'L4 BYOC builds on the existing deployment levels (L0 local through L3 managed); at L4, the user provides their own cloud compute (VMs, containers, or serverless) and storage.',
          'Cloud provider load balancing (ALB, CloudFront, or equivalent) replaces the built-in reverse proxy; mTLS is recommended for inter-service communication at this scale.',
          'Deploy tooling and multi-tenant authentication are shipped alongside the crate changes so operators can provision L4 environments without building custom orchestration.',
        ],
        whoItsFor:
          'Enterprise teams and cloud operators who need gradatum running at scale across multiple regions, with their own compute infrastructure, while retaining full data sovereignty.',
        status: 'planned',
        version: 'v3.0.0',
      },
      {
        id: 'f-21',
        refLabel: 'F-21',
        name: 'NATS HubMQ Bridge: Vault Event Streaming',
        positioning:
          'Publishes vault events to a NATS JetStream subject, enabling reactive pipelines and multi-service subscriptions without polling.',
        howItWorks: [
          'A bridge crate subscribes to vault write events and publishes structured payloads to a configurable NATS subject on each note addition, update, or deletion.',
          'Subscribers receive events without polling the vault HTTP API, enabling event-driven automation and cross-service coordination.',
        ],
        whoItsFor:
          'Homelab deployments with services that need to react to vault changes for automation triggers or notification flows.',
        status: 'planned',
        version: 'v3.0.0',
      },
      {
        id: 'f-52',
        refLabel: 'F-52',
        name: 'Pipeline Orchestration: Dynamic Job DAG',
        positioning:
          'Composes background jobs into directed acyclic graphs, enabling multi-step memory pipelines without coupling individual workers.',
        howItWorks: [
          'A DAG runtime dispatches jobs in dependency order: an ingest job can automatically trigger embedding, then distillation, then validation — each in its own Apalis worker with full retry semantics.',
          'Dependencies are declared per-job rather than hardcoded in worker logic, making pipeline topology configurable without code changes.',
        ],
        whoItsFor:
          'Advanced deployments where note lifecycle spans multiple processing stages and job sequencing must be explicit and auditable.',
        status: 'planned',
        version: 'v3.0.0',
      },
      {
        id: 'f-108',
        refLabel: 'F-108',
        name: 'Gateway Tools: Anthropic Server-Tool Loop + Pluggable Web Search',
        positioning:
          'Extends the gateway with an Anthropic-compatible server-tool loop and a pluggable web_search tool — the missing tooling bridge for agent-driven gateway workflows.',
        howItWorks: [
          'A server-tool loop lets the gateway serve tool calls to Anthropic clients, and a pluggable web_search tool adds live web retrieval as a callable tool.',
          'Tracked as planned for v2.0.0; the exact tool contract and provider adapters are still under specification.',
        ],
        whoItsFor:
          'Gateway operators and agent builders who want Anthropic-native tool-call round-trips and web-search capabilities without a separate proxy layer.',
        status: 'planned',
        version: 'v3.0.0',
      },
    ],
  },
];

export const featureGroups = featureGroupArraySchema.parse(groups);
