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
      'Before you can build a useful memory layer, you need a store that actually works. v0.1.0 ships a functioning knowledge base — write, read, search — accessible over HTTP and MCP from day one. It lays the structural foundations that every later version builds on: pluggable storage interfaces, note integrity guarantees, and enough test coverage to deploy with confidence.',
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
      'Gradatum processes notes asynchronously — curation, embedding, distillation all run in the background. Without a reliable job engine, these tasks would silently fail and leave the vault in an inconsistent state. v0.2.0 ships that engine: background jobs survive restarts, failures are captured and retried rather than dropped, and every running task is visible in real time. This infrastructure is what makes every subsequent feature safe to ship.',
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
        title: 'Tagged — Bronze milestone, public OSS release',
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
      'A knowledge store that is locked to a single database is a dead end. v0.3.0 separates the document layer, the search index, and the vector store into independent, swappable components — you can replace any one of them without rewriting the rest. It also fixes a critical bug where every server restart would invalidate all live sessions, and introduces a built-in model proxy so LLM calls are routed, reranked, and fully cost-attributed without a separate service.',
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
        title: 'Tagged — 28 crates, 1088 tests PASS, Bronze 3rd milestone',
        version: 'v0.3.0',
        date: '2026-06-02',
      },
      {
        status: 'done',
        title: 'Parallel workers no longer deadlock under concurrent job load',
        version: 'v0.3.3',
        date: '2026-06-02',
      },
      {
        status: 'done',
        title: 'Search results always show their title — no more blank note titles in results',
        version: 'v0.3.4',
        date: '2026-06-03',
      },
      {
        status: 'done',
        title: 'Semantic search results enriched with title and excerpt — easier to scan at a glance',
        version: 'v0.3.5',
        date: '2026-06-03',
      },
      {
        status: 'done',
        title: 'First public OSS release: source on GitHub, 28 crates published on crates.io (Apache-2.0)',
        version: 'v0.3.6',
        date: '2026-06-05',
      },
      {
        status: 'done',
        title: 'Read and write reliability fixed: search titles persist, notes retrievable by ID, internal links reconcile correctly',
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
      'A store that only appends is not enough — you need to know what you can trust, recover from mistakes, and keep the vault from growing unbounded. v0.4.0 completes the memory layer: every note carries a trust score, a full edit history, and stable internal links that survive renames. Notes can be intentionally forgotten with progressive decay, and concurrent writes are always safe. This is the version that turns a write-only store into a durable, queryable memory.',
    scopeTeaserItems: ['Stable internal links — rename a note without breaking references', 'Full version history — every edit preserved', 'Safe concurrent writes — no lost updates', 'Sources carry verifiable lineage', 'Notes can be intentionally forgotten', 'Chronological memory queries'],
    featureRefs: ['F-39', 'F-40', 'F-41', 'F-47'],
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
        title: 'Tagged — 28 crates, 1178 tests PASS, durable write milestone',
        version: 'v0.4.0',
        date: '2026-06-06',
      },
      {
        status: 'done',
        title: 'API never panics on bad input, all public docs written, SECURITY.md published, first crates.io + GitHub release',
        version: 'v0.4.1',
        date: '2026-06-06',
      },
      {
        status: 'done',
        title: 'Write response now returns the note ID, demote-note returns a clear 404 when the note does not exist',
        version: 'v0.4.2',
        date: '2026-06-07',
      },
      {
        status: 'done',
        title: 'Notes can be intentionally forgotten (with a dry-run preview), history pruning is configurable, multimodal input supported in the gateway',
        version: 'v0.4.3',
        date: '2026-06-10',
      },
    ],
  },
  {
    version: 'v0.4.3',
    grade: 'Silver',
    status: 'done',
    theme: 'Addressing & Query Scoping — Multi-Vault Foundation',
    description:
      'Multi-vault deployments need a unified way to address data across vaults and agents without per-job coordination. v0.4.3 ships that abstraction: VaultScope gives every background job a composable, deterministic address; Semantic Forget completes the data lifecycle with intentional deletion and decay; and Temporal Index adds chronological querying so agents can reason about when events happened and in what order.',
    scopeTeaserItems: ['VaultScope: address any locus across vaults and agents', 'Semantic Forget with mandatory dry-run and progressive decay', 'Temporal Index with before/after/around queries'],
    featureRefs: ['F-31', 'F-32', 'F-44', 'F-55', 'F-61'],
    showFeaturesLink: true,
  },
  {
    version: 'v0.5.2',
    grade: 'Silver',
    status: 'done',
    theme: 'Static Code Index + Temporal Queries + Observability',
    description:
      'Memory without code awareness is half the picture. v0.5.2 adds a code index built directly from source — no LLM, no hallucination — so gradatum can answer "where is this function?" as reliably as "what was decided last week?". The index updates in milliseconds when files change, and stays in a separate store so it never pollutes the knowledge vault. A temporal index foundation enables time-aware queries: agents can reconstruct decision timelines and detect sequencing contradictions without external tools. This version also ships encrypted connections natively and makes it possible to know for certain that a topic is absent, not just unranked.',
    scopeTeaserItems: [
      'Code index built from source — no LLM needed, zero hallucination',
      'Search your codebase by symbol, keyword, or file path',
      'Index stays in sync automatically — only changed files are reprocessed',
      'Browse notes chronologically, filter by date range',
      'Temporal queries: before/after/around/upcoming dates without a calendar database',
      'Agent action tracing — what ran, when, and why',
      'Know for certain if a topic exists in the vault, not just "nothing found"',
      'Encrypted connections out of the box (TLS 1.2+/1.3)',
      'Edit notes safely under concurrent load — conflicts detected, never silently overwritten',
    ],
    featureRefs: ['F-22', 'F-37', 'F-60', 'F-72', 'F-73', 'F-74'],
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
        title: 'Tagged — 31 crates, 1925 tests PASS, source on GitHub (Apache-2.0)',
        version: 'v0.5.2',
        date: '2026-06-15',
      },
    ],
  },
  {
    version: 'v0.5.5',
    grade: 'Silver',
    status: 'done',
    theme: 'Foundation Polish',
    description:
      'Before opening gradatum to external clients via MCP, the foundation needs to be verifiably clean. v0.5.5 closes that window: the health endpoint now reports the exact running version and real queue state so there is no ambiguity about what is deployed. No new user-facing features — the goal is a baseline you can audit and depend on before the next chapter begins.',
    scopeTeaserItems: ['Real-time health endpoint — queue depth + version proof', 'Codebase modernized to Rust 2024 edition', 'API surface cleaned and hardened before the MCP pivot'],
    featureRefs: [],
    showFeaturesLink: false,
  },
  {
    version: 'v0.6.0',
    grade: 'Silver',
    status: 'done',
    theme: 'Queryable Memory Store — MCP-Native Backend',
    description:
      'Until now, gradatum was only usable through its own agent. v0.6.0 opens the vault to any MCP-compatible client — Claude Code, IDEs, custom agents — over a standard HTTP connection, with no sidecar process or protocol shim. The deliberate choice here: make the store useful to others first, then build gradatum\'s own context layer (v0.7.0) on top of the same interface everyone else uses.',
    scopeTeaserItems: ['Connect Claude Code, IDEs, or any agent directly via MCP', 'Standard HTTP transport — no sidecar, no stdio pipe'],
    featureRefs: ['F-38', 'F-56'],
    showFeaturesLink: true,
  },
  {
    version: 'v0.6.4',
    grade: 'Silver',
    status: 'done',
    theme: 'Studio Hardening + Security Baseline',
    description:
      'Before a first public release, you owe it to users to be honest about what you are shipping. v0.6.4 is that honesty pass: a deep correctness audit surfaced twelve real bugs — including a regression that made some notes undeletable — and a security review tightened the admin UI to short-lived sessions, a strict content policy, and proper request size limits. The code index now covers five languages. This is the version that earns the right to be called stable.',
    scopeTeaserItems: [
      'Admin UI sessions expire in 1 hour — shorter window if credentials are ever compromised',
      'Strict browser security policy (CSP) — no external scripts can run in the UI',
      'Clickjacking protection added for older browsers',
      'Request size capped at 512 KB — protection against oversized payloads',
      'Code index now understands Rust, Bash, TypeScript, React (TSX), and Python',
      '12 correctness bugs fixed (note deletion, embedding index validation, internal API encapsulation)',
      '2337 tests pass',
    ],
    featureRefs: ['F-62', 'F-71'],
    showFeaturesLink: false,
  },
  {
    version: 'v0.6.5',
    grade: 'Silver',
    status: 'done',
    theme: 'Project-Map Management Stabilization',
    description:
      'The project-map feature (structured feature lifecycle tracking with typed wikilinks as a canonical vault section) is now stabilized. v0.6.5 ships the complete feature cycle — release axis (roadmap / planned / released), deterministic duplicate detection, and a fail-closed CI gate. The public roadmap is reconciled to code ground-truth: CHANGELOG and git tags are now the authority, not separate documents. No new user-facing features — hardening and tooling before the context layer arrives in v0.7.0.',
    scopeTeaserItems: [
      'Feature lifecycle tracking — release axis (roadmap / planned / released)',
      'Public roadmap reconciled to code ground-truth',
      'Project-map validator + fail-closed CI gate',
      'Deterministic card detection — no duplicate drift',
    ],
    featureRefs: [],
    showFeaturesLink: false,
  },
  {
    version: 'v0.6.6',
    grade: 'Silver',
    status: 'planned',
    theme: 'Anthropic-Compatible Local Endpoint',
    description:
      'Claude Code and other Anthropic-API agents expect a /v1/messages endpoint. v0.6.6 ships exactly that — a local gateway that speaks the Anthropic Messages API and routes every call to a model running on your own hardware. The point is concrete: point Claude Code at gradatum and it runs end-to-end locally, with no request ever leaving your machine.',
    scopeTeaserItems: ['Serves the Anthropic /v1/messages API locally', 'Routes Claude Code (and any Anthropic-API agent) to a local model on your hardware', 'No request ever leaves your machine'],
    featureRefs: ['F-75'],
    showFeaturesLink: false,
  },
  {
    version: 'v0.7.0',
    status: 'done',
    theme: 'Memory Layer + Context Assembly',
    description:
      'A store that answers queries on demand is still passive. The real value is a system that knows what is relevant before you ask — one that remembers what you worked on yesterday, surfaces the decision you forgot last month, and assembles exactly the right context before sending anything to a model. v0.7.0 is that layer: gradatum stops treating each session as stateless and starts reasoning over everything it has accumulated, on your hardware, across time.',
    scopeTeaserItems: ['Assembles relevant context before each query — not raw retrieval', 'Memory window slides with the conversation — no context cliff', 'Proactively surfaces what you forgot you knew', 'Declarative user profile — gradatum knows who it is talking to', 'Picks only the skills relevant to the current task'],
    featureRefs: ['F-35', 'F-30', 'F-46', 'F-50', 'F-58', 'F-29', 'F-17', 'F-65', 'F-68', 'F-36'],
    showFeaturesLink: false,
  },
  {
    version: 'v0.7.1',
    status: 'done',
    theme: 'Active Recall',
    description:
      'Memory is only useful if you can retrieve it. v0.7.1 adds proactive retrieval: gradatum autonomously surfaces relevant notes before you ask, recording which surfaced notes are actually used and bringing those decisions into context automatically.',
    scopeTeaserItems: ['Proactive note suggestions based on workflow', 'Surface forgotten decisions in real time'],
    featureRefs: [],
    showFeaturesLink: false,
  },
  {
    version: 'v0.7.2',
    status: 'done',
    theme: 'Context Efficiency',
    description:
      'More context is not always better. v0.7.2 optimizes what gets included in each decision: only the most relevant notes are assembled, irrelevant context is pruned, and the quality of assembled memory improves measurably. This is where the vault stops being verbose and starts being precise.',
    scopeTeaserItems: ['Intelligent context pruning', 'Relevance-scored memory assembly', 'Reduced token usage without losing accuracy'],
    featureRefs: [],
    showFeaturesLink: false,
  },
  {
    version: 'v0.7.3',
    status: 'done',
    theme: 'Identity — Soul Notes & ACL',
    description:
      'Each agent has its own identity: a soul note that captures its invariants, operational gates, and personality. v0.7.3 ships this as a protected vault section. Every agent can store and retrieve its own identity; enumeration is hidden from unprivileged callers; reads and writes are guarded by per-agent JWT binding. This is the foundation for multi-agent reasoning.',
    scopeTeaserItems: ['Soul notes for agent identity', 'Per-agent identity sections protected by ACL', 'MCP server injects agent identity at initialize time', 'Identity enumeration hidden from unprivileged access'],
    featureRefs: ['F-34', 'F-36'],
    showFeaturesLink: false,
  },
  {
    version: 'v0.7.4',
    status: 'done',
    theme: 'Temporal Search & Decay',
    description:
      'Memory fades over time — and sometimes intentionally. v0.7.4 adds temporal search with from/to filters so agents can reason about what happened before or after a specific date. Recency decay down-weights stale notes in relevance scoring, keeping the vault focused on what still matters.',
    scopeTeaserItems: ['Temporal filters: search between two dates', 'Recency decay in relevance scoring', 'Chronological queries without external calendars'],
    featureRefs: ['F-65', 'F-17'],
    showFeaturesLink: false,
  },
  {
    version: 'v0.7.5',
    status: 'done',
    theme: 'Studio Observability',
    description:
      'You cannot improve what you cannot see. v0.7.5 ships three observability features: real-time background task health, operational metrics charts, and a session activity trace browser — all in the admin studio. Operations are now transparent.',
    scopeTeaserItems: ['Real-time background job health', 'Operational metrics graphs in admin studio', 'Session activity trace browser'],
    featureRefs: ['F-85'],
    showFeaturesLink: false,
  },
  {
    version: 'v0.7.6',
    status: 'done',
    theme: 'Memory Validation — Deterministic Quality Gates',
    description:
      'Good memory requires good judgment. v0.7.6 ships a deterministic distillation quality gate: every note summary is scored on grounding (cosine similarity to source), importance factors, and penalty functions. Low-quality summaries are tagged and degraded, never silently dropped. Identity ACL is hardened with privilege checks on every read and write.',
    scopeTeaserItems: ['Deterministic distill quality scoring (0.0–1.0)', 'Grounding-based penalty for poor summaries', 'Quality tagging for low-score notes', 'Hardened identity ACL enforcement'],
    featureRefs: ['F-43'],
    showFeaturesLink: false,
  },
  {
    version: 'v0.8.0',
    status: 'in-progress',
    theme: 'Vault Stability — Reversible Deletion & Hygiene',
    description:
      'Deleting a note used to mean losing it. v0.8.0 turns on-demand delete into an archival operation: the note\'s Markdown and its history move under an archive tree, a durable JSONL tombstone is written before the cascade, and the note stays recoverable until a configurable 60-day retention deadline, after which a registry-driven GC destroys it. Restoring re-indexes the note as pending-review, so it re-enters the curator instead of going straight back to live. The whole archive lifecycle sits behind an operator-only CLI on a loopback admin namespace — agents can list archives over MCP but never delete, restore, or purge. The same train is set to add an opt-in vault audit and deduplication job, curator threshold tuning, and qualified method-call resolution in the code index — still planned within the v0.8.0 line.',
    scopeTeaserItems: ['On-demand delete archives the note instead of destroying it — recoverable for the retention window', 'A durable JSONL audit tombstone is written before any cascade', 'Registry-driven GC destroys archives past their 60-day, configurable deadline', 'Restore re-enters the curator as pending-review, never straight back to live', 'Archive lifecycle is operator-only — MCP can list archives, never mutate them', 'Opt-in vault audit and deduplication job, curator tuning, and code-map resolution still planned'],
    featureRefs: ['F-70', 'F-51', 'F-66', 'F-100'],
    showFeaturesLink: false,
  },
  {
    version: 'v1.0.0',
    grade: 'Gold',
    status: 'done',
    theme: 'Production Baseline',
    description:
      'API stability is a promise, not a feature. v1.0.0 is the version where gradatum makes that promise: the public contracts freeze, semver guarantees kick in, and anything built on top will not break without explicit notice. The Agent Layer reaches production form: gradatum-engine is a formalised install component (--with-engine / --with-gateway), the gateway routes all inference behind one alias, and the full six-binary stack deploys through Docker with network isolation. Multi-tenant isolation is hardened on the production queue path — stale-lease recovery, JWT iss/sub validation, tenant-scoped revocation — proven over 30 days of continuous operation with per-identity access scopes.',
    scopeTeaserItems: ['API contracts frozen — safe to build on without breaking changes', '30 days of continuous production operation proven', 'Long-term memory benchmark reproduced and published', 'Multi-user access with per-identity scopes', 'Engine formalised as an install component (--with-engine / --with-gateway)', 'Multi-tenant isolation hardened on the production queue path', 'Full stack via Docker — six binaries, network isolation'],
    featureRefs: ['F-18', 'F-45', 'F-131'],
    showFeaturesLink: false,
  },
  {
    version: 'v2.0.0',
    status: 'done',
    theme: 'Identity Hardening & Object Storage',
    description:
      "v2.0.0 closes the 1.x line: identity is now strictly credential-derived — no default identity, no client-declared author, no silent fallback. Vault storage gains an S3-compatible object backend as an alternative to the local filesystem, and the startup restriction that refused to run on a network filesystem is removed — that trade-off is now the deploying operator's decision. Link-edge reconciliation repairs notes whose recorded links drifted from their current body. This release breaks public Rust API contracts (trait signatures, an error variant removed, a new required field), which is why it ships as a SemVer major rather than a minor.",
    scopeTeaserItems: [
      'Identity strictly credential-derived — no default identity, no silent fallback',
      'Vault storage on an S3-compatible object backend (local filesystem stays default)',
      'Network-filesystem startup restriction removed — operator decision now',
      'Link-edge reconciliation for drifted note links (gradatum-admin repair-note-links)',
      'Full stack via Docker, one active key per identity, workspace dependency refresh',
    ],
    featureRefs: ['F-86'],
    showFeaturesLink: false,
  },
  {
    version: 'v3.0.0',
    grade: 'Platinum',
    status: 'planned',
    theme: 'Multimodal, Consolidation & Sovereign Agent Runtime',
    description:
      "Text was always just the starting point. v3.0.0 extends gradatum to images, audio, and documents — and introduces long-horizon memory consolidation, where the system compresses and learns from its own history over time. This version also ships gradatum-code: a terminal agent that reasons over your codebase using vault memory, recalls past decisions, and executes tasks end-to-end on local hardware — nothing leaves your machine. This is a breaking change by design: the chat API is rebuilt to handle multimodal input natively, completing gradatum's arc from a local knowledge store to a full cognitive infrastructure.",
    scopeTeaserItems: ['Images, audio, and documents understood alongside text', 'Long-horizon memory consolidation — the system learns from its own history', 'Sovereign terminal agent — reasons over your codebase and executes tasks end-to-end', 'Runs entirely on local hardware — nothing leaves your machine'],
    featureRefs: ['F-49', 'F-69', 'F-76', 'F-77', 'F-79'],
    showFeaturesLink: false,
  },
];

export const versionPhases = versionPhaseArraySchema.parse(versions);
