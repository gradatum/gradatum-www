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
          'The gradatum-eval crate exposes three coverage levels — smoke (a small set of fast sanity queries), full LongMemEval (deterministic, anchored on a public dataset), and governance-bench (write / forget / consolidate cycles targeting axes not covered by standard benchmarks).',
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
          "DocumentStore (note read/write), IndexStore (full-text search index using FTS5 — SQLite's built-in full-text engine), VectorStore (embeddings and Approximate Nearest Neighbor search), QueueStore (async job queue).",
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
        name: 'Install Wizard, One-liner, and Doctor',
        positioning:
          'Reduces gradatum setup and diagnostics to two commands, including on a fresh system.',
        howItWorks: [
          'gradatum-admin install walks through interactive initialization (directories, permissions, base configuration).',
          'A downloadable one-liner script covers the bootstrapping case where no binary is pre-installed.',
          'gradatum-admin doctor inspects the installation state — dependencies, permissions, connectivity — and reports deviations with corrective suggestions.',
        ],
        whoItsFor:
          'Anyone installing gradatum for the first time, or an operator diagnosing an existing deployment environment.',
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
        name: 'Agent Identity Persistence (Phase A)',
        positioning:
          'Gives an LLM agent a persistent, immutable identity across sessions, stored in a dedicated, access-controlled section of the vault.',
        howItWorks: [
          'A dedicated identity/ locus in the vault holds four sections for each agent: rules, capabilities, constitution, and identity.',
          'This locus is read-only for the agent itself; writes require administrative credentials.',
          "The identity bundle is injected into the agent's context at the start of every session via the rendering pipeline (Phase A covers static injection). Phases B through D will add dynamic rendering and identity distillation.",
        ],
        whoItsFor:
          'Integrators deploying agents with fixed roles — assistant, reviewer, summarizer — who need stable baseline behavior across restarts and context resets.',
        status: 'released',
        version: 'v0.1.0',
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
      'Completes the durable memory layer, exposes the vault as a queryable MCP-native backend, and adds multi-user isolation with OAuth-based remote access.',
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
        version: 'v0.4.0',
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
        status: 'planned',
        version: 'v0.4.1',
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
        status: 'planned',
        version: 'v0.4.1',
      },
      {
        id: 'f-09',
        refLabel: 'F-09',
        name: 'Privacy Filter: Automatic PII Redaction on Write',
        positioning:
          'Intercepts every note before it is stored and redacts personally identifiable information (PII) — without an external API call or network dependency.',
        howItWorks: [
          'The PrivacyFilter is registered as a WriteHook on DocumentStore; it runs synchronously on every vault_write before the note reaches the index.',
          'The initial textual pass uses heuristic pattern matching. A later ONNX (portable neural network runtime) Named Entity Recognition model runs fully on-device with no data leaving the host.',
          'Filtered fields are marked in the note frontmatter so downstream processes know redaction has occurred.',
        ],
        whoItsFor:
          'Developers ingesting documents that may contain personal data — emails, transcripts, HR notes — and operators who need a compliance-friendly vault with no third-party data processing.',
        status: 'planned',
        version: 'v0.4.1',
      },
      {
        id: 'f-36',
        refLabel: 'F-36',
        name: 'Drift Detection: Identity Write Hook',
        positioning:
          "Detects unauthorized or unexpected changes to an agent's identity notes and flags them before they silently alter agent behavior.",
        howItWorks: [
          'A DriftDetector is registered as a WriteHook on DocumentStore at startup; it monitors writes to the identity/ locus without a direct vault dependency.',
          'On each write, the detector computes a semantic distance between the new content and the last validated version; divergence above threshold triggers a drift_detected event.',
          'The drift event is surfaced via the jobs SSE (Server-Sent Events) stream, allowing operators or higher-level workflows to review the change before it takes effect.',
        ],
        whoItsFor:
          'Operators running persistent agents whose identity notes must not change without explicit authorization — detecting accidental overwrites and adversarial prompt-injection attempts.',
        status: 'planned',
        version: 'v0.4.1',
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
        status: 'planned',
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
        status: 'planned',
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
        status: 'planned',
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
        status: 'planned',
        version: 'v0.4.3',
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
        status: 'planned',
        version: 'v0.4.3',
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
        status: 'planned',
        version: 'v0.4.3',
      },
      {
        id: 'f-25',
        refLabel: 'F-25',
        name: 'libsql Remote: Replicated SQLite Backend',
        positioning:
          'Adds an opt-in remote SQLite backend powered by libsql, enabling vault replication and read replicas without changing the DocumentStore interface.',
        howItWorks: [
          'The gradatum-db-sqlite crate exposes a libsql feature flag; enabling it replaces the local SQLite connection with a remote libsql endpoint.',
          'The DocumentStore, IndexStore, and QueueStore traits remain unchanged — the swap is purely a configuration-level choice with no application code changes.',
          'An internal poll loop on the libsql queue backend (500 ms interval) bridges the remote queue to the existing channel-based worker dispatch.',
        ],
        whoItsFor:
          'Operators who need vault data replicated across machines or want read replicas for high-read workloads, without migrating to a heavier database engine.',
        status: 'planned',
        version: 'v0.4.4',
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
        version: 'v0.4.4',
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
        status: 'planned',
        version: 'v0.5.0',
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
        status: 'planned',
        version: 'v0.5.0',
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
        status: 'planned',
        version: 'v0.5.0',
      },
      {
        id: 'f-45',
        refLabel: 'F-45',
        name: 'Multi-User Support: Per-User Vault Isolation',
        positioning:
          'Enables multiple users to share a single gradatum deployment with configurable isolation — private identity, shared or private knowledge, role-based access.',
        howItWorks: [
          'Each user is represented by a UserRecord with a Bearer JWT; an admin invitation flow provisions new users without exposing the root credential.',
          'Isolation is per-locus type: identity/ and peers/ are always private; knowledge/ and skills/ are configurable as shared or private per deployment.',
          'ACL policies in gradatum-acl-policy enforce locus-level access at the storage layer, so isolation is structural rather than enforced only at the API boundary.',
        ],
        whoItsFor:
          'Teams and households who want to run one gradatum instance shared across multiple people or agents, each with their own private memory and optionally contributing to shared knowledge.',
        status: 'planned',
        version: 'v0.5.1',
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
        version: 'v0.5.1',
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
        ],
        whoItsFor:
          'Operators maintaining long-lived vaults where notes accumulate from multiple agents or ingestion pipelines, and who need a systematic quality baseline rather than ad-hoc manual review.',
        status: 'planned',
        version: 'v0.5.1',
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
        status: 'planned',
        version: 'v0.6.0',
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
        status: 'planned',
        version: 'v0.6.0',
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
        status: 'planned',
        version: 'v0.6.0',
      },
      {
        id: 'f-50',
        refLabel: 'F-50',
        name: 'User Profile: Declarative Identity Document',
        positioning:
          "Gives the vault a single, operator-editable profile note that describes the user to every agent — taking priority over inferred peer profiles when the two conflict.",
        howItWorks: [
          'vault://main/me.md is a Markdown note in the vault storing explicit preferences, context, and constraints; it is injected into Zone A of the context on every session.',
          'The profile complements the automatically inferred peers/ locus (built by the Peer distillation job) — explicit declarations in me.md override inferred values.',
          'Operators edit me.md directly with any Markdown editor; changes take effect on the next context assembly without requiring a restart or re-distillation.',
        ],
        whoItsFor:
          'Individuals and teams who want to give every agent a reliable baseline understanding of who they are and how they work — without relying entirely on inferred behavior profiles.',
        status: 'planned',
        version: 'v0.6.0',
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
        status: 'planned',
        version: 'v0.6.0',
      },
    ],
  },
  {
    grade: 'Platinum',
    versionPrefix: 'v2.0.x',
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
        version: 'v2.0.0',
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
        version: 'v2.0.0',
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
        version: 'v2.0.0',
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
        version: 'v2.0.0',
      },
    ],
  },
];

export const featureGroups = featureGroupArraySchema.parse(groups);
