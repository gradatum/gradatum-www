/**
 * gradatum-www — Roadmap data (8 linear versions, Bronze→Platinum)
 *
 * GOVERNANCE RULES (Council Art.19 Round 1 acted):
 *   MAJ status/date d'un milestone existant = pas council Art.19.
 *   Ajout/suppression d'une VersionPhase = council Art.19 obligatoire
 *     (impacte structure OSS publique).
 *   Modification thème/description/grade = council Art.19
 *     (signal structurel).
 */
import type { VersionPhase } from '../content/config';
import { versionPhaseArraySchema } from '../content/config';

const versions: VersionPhase[] = [
  {
    version: 'v0.1.0',
    grade: 'Bronze',
    status: 'in-progress',
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
        title: 'Double run + decommission predecessor',
        version: 'memory backend migrated',
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
        status: 'next',
        title: 'Stabilisation — alpha series wrap-up, OSS feedback integration',
        version: 'v0.1.x closing',
      },
    ],
  },
  {
    version: 'v0.2.0',
    grade: 'Bronze',
    status: 'in-progress',
    theme: 'Job Infrastructure + Observability',
    description:
      "Lays the foundation for gradatum's background job system and makes it fully observable. This release introduces the job queue layer built on Apalis (https://github.com/geofmureithi/apalis) — a type-safe, SQLite-backed Rust job framework — including the Job enum, JobRecord lifecycle tracking, and per-class worker configuration. On top of that foundation, it ships a Dead-Letter Queue (DLQ) for failed background jobs with configurable retry policies, timeout enforcement, and panic isolation, so jobs that fail definitively are captured rather than silently dropped. A /api/v1/jobs introspection endpoint surfaces job state over HTTP, with a Server-Sent Events (SSE) stream for real-time push updates and Prometheus metrics per job kind, giving operators full visibility into what the system is running and why without polling.",
    scopeTeaserItems: ['Apalis job foundation', 'Dead-letter queue', 'Jobs introspection API + SSE'],
    featureRefs: ['F-15', 'F-16'],
    showFeaturesLink: true,
    milestones: [
      {
        status: 'done',
        title: 'F-14 partial: Apalis foundation + types v81 forward-compat',
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
        status: 'next',
        title: 'Tag v0.2.0 — Bronze 2nd milestone OSS public',
        version: 'v0.2.0',
      },
    ],
  },
  {
    version: 'v0.3.0',
    status: 'planned',
    theme: 'Gateway + Curator confidence',
    description:
      'Introduces an integrated LLM gateway for local and remote model routing, a first-generation reranker for search relevance, multi-vault support, and a Curator Confidence Ladder so the system can score, route, and store notes with traceable quality signals.',
    scopeTeaserItems: ['LLM gateway', 'Reranker v1', 'Multi-vault', 'Curator Confidence Ladder'],
    featureRefs: ['F-02', 'F-08', 'F-13', 'F-14', 'F-18', 'F-19', 'F-42'],
  },
  {
    version: 'v0.4.0',
    status: 'planned',
    theme: 'Search Phase B + Ingest',
    description:
      'Deepens the knowledge pipeline — structured ingest, temporal decay scoring, wikilink graph traversal, note history and optimistic locking for safe concurrent writes, and provenance trust metadata so retrieved content carries verifiable lineage.',
    scopeTeaserItems: ['Structured ingest', 'Temporal decay', 'Wikilinks', 'Note history', 'Provenance'],
    featureRefs: ['F-06', 'F-17', 'F-35', 'F-39', 'F-40', 'F-41', 'F-47'],
  },
  {
    version: 'v0.5.0',
    grade: 'Silver',
    status: 'planned',
    theme: 'Agent ReAct + Cognitive layer',
    description:
      'Ships a full ReAct agent runtime with a LLM router, distillation, and memory management — rolling window context, vault-scoped retrieval, and adaptive learning loops — enabling the system to reason across sessions rather than treating every query as stateless.',
    scopeTeaserItems: ['ReAct agent', 'LLM router', 'Distill', 'Rolling window', 'VaultScope', 'Iterative memory'],
    featureRefs: ['F-04', 'F-05', 'F-09', 'F-11', 'F-12', 'F-22', 'F-29', 'F-30', 'F-31', 'F-32', 'F-36', 'F-37', 'F-44', 'F-46', 'F-50', 'F-52', 'F-54'],
  },
  {
    version: 'v0.6.0',
    status: 'planned',
    theme: 'Messaging + Temporal + Distill mature',
    description:
      'Matures the distillation layer with peer learning, rationale capture, and a stable public crate API; adds NATS-backed event collection and a v2 skill runtime, turning gradatum into a composable substrate other tools can build on reliably.',
    scopeTeaserItems: ['NATS collector', 'Peer learning', 'Rationale', 'Distill crate API', 'Skill v2'],
    featureRefs: ['F-20', 'F-21', 'F-22', 'F-52', 'F-55', 'F-58'],
  },
  {
    version: 'v1.0.0',
    grade: 'Gold',
    status: 'planned',
    theme: 'Production Release',
    description:
      'Delivers the first production-ready release — native MCP protocol support, a bundled llama.cpp inference engine, full multi-user isolation with OAuth, pluggable storage backends, and self-healing vault operations so teams can deploy gradatum as a shared, long-running service.',
    scopeTeaserItems: ['MCP native', 'llama.cpp engine', 'Multi-user', 'OAuth', 'Pluggable backends', 'Self-healing'],
    featureRefs: ['F-07', 'F-08', 'F-09', 'F-25', 'F-26', 'F-37', 'F-38', 'F-43', 'F-45', 'F-51', 'F-55', 'F-56', 'F-57', 'F-58'],
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
  },
];

export const versionPhases = versionPhaseArraySchema.parse(versions);
