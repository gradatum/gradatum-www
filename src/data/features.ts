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
        name: 'SKILL.md Mode 2: Session Discipline for LLM Agents',
        positioning:
          'Provides a set of documented conventions (delivered as a SKILL.md file) that help an LLM agent maintain consistent working discipline across long sessions.',
        howItWorks: [
          'Four mechanisms are covered — trace-session (structured log of decisions made during the session), vault-discipline (write rules for the vault to prevent duplicate entries), context-sliding-window (context compaction protocol before the context window saturates), skill-crystallization (process for promoting an ad-hoc pattern into a reusable, named skill).',
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
          'Integrators deploying agents with fixed roles — assistant, auditor, archivist — who need stable baseline behavior across restarts and context resets.',
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
];

export const featureGroups = featureGroupArraySchema.parse(groups);
