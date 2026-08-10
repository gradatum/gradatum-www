/**
 * gradatum-www — Install modes data (7 profiles)
 *
 * Validated at import time via Zod. Build fails on schema violation.
 */
import type { InstallMode } from '../content/config';
import { installModeArraySchema } from '../content/config';

const modes: InstallMode[] = [
  {
    id: 'nano',
    name: 'Nano',
    level: 'L0',
    tagline: 'Store and retrieve knowledge without an LLM dependency.',
    useCase:
      'Developer adding persistent RAG memory to an existing CI pipeline or script-driven workflow, without spinning up an LLM service.',
    command: 'sudo bash scripts/install-gradatum-services.sh --build',
    services: ['gradatum-server', 'gradatum-worker'],
    llm: 'None (heuristic curator — rule-based, no inference)',
    mcpAccess: 'stub',
    status: 'available',
  },
  {
    id: 'solo',
    name: 'Solo',
    level: 'L1',
    isDefault: true,
    tagline: 'Full memory-and-gateway stack up and running in one command.',
    useCase:
      'Developer running gradatum on a personal machine, NAS, or single-board computer for daily agent interactions.',
    command: 'sudo bash scripts/install-gradatum-services.sh --build --with-gateway',
    services: ['gradatum-server', 'gradatum-worker', 'gradatum-gateway'],
    llm: 'Local (Ollama / llama.cpp) or cloud (OpenRouter · Anthropic · OpenAI)',
    mcpAccess: 'stub',
    status: 'available',
  },
  {
    id: 'full',
    name: 'Full',
    level: 'L1+',
    tagline: 'All optional services enabled — engine, messaging, and vault in one stack.',
    useCase:
      'Operator running gradatum as a hub for multiple agents with event-driven triggers and local inference via a GGUF model.',
    command: 'sudo bash scripts/install-gradatum-services.sh --build --with-engine --with-gateway',
    services: [
      'gradatum-server',
      'gradatum-worker',
      'gradatum-gateway',
      'gradatum-engine',
      'NATS (optional job-completion notifications — external broker, not installed by this script)',
    ],
    llm: 'Local or cloud; gradatum-engine handles local GGUF inference if provided',
    mcpAccess: 'stub',
    status: 'available',
  },
  {
    id: 'gold',
    name: 'Gold',
    level: 'L2',
    tagline: 'Sovereign remote access — connect from any client without a local stub.',
    useCase:
      'Operator managing a multi-user deployment where mobile and desktop clients reach the vault over HTTPS, with authentication fronted by a reverse proxy and an external identity provider.',
    command:
      '# the building blocks below are real; the per-user isolation this profile depends on has not shipped\nsudo bash scripts/install-gradatum-services.sh --build --with-engine --with-gateway\n# + your own reverse proxy / external identity provider in front (not installed by gradatum)',
    services: [
      'gradatum-server (+ /mcp StreamableHTTP)',
      'gradatum-worker',
      'gradatum-gateway',
      'gradatum-engine',
      'NATS (optional, external)',
      'Reverse proxy + external identity provider (e.g. Traefik + Authentik) — bring your own',
    ],
    llm: 'Local or cloud',
    mcpAccess: 'both',
    status: 'planned',
  },
  {
    id: 'remote',
    name: 'Remote',
    level: 'L3',
    tagline: 'Connect gradatum-admin to an existing server running on a separate machine.',
    useCase:
      'Infrastructure operator managing gradatum on a dedicated node or VM, configuring it remotely from a workstation without a local install.',
    command:
      '# no verified mechanism for this in the published source — gradatum-admin has no general\n# "point at a remote server" mode; conf.d/ only covers per-engine-instance config files.\n# Not available as described.',
    services: ['No verified topology — see command note'],
    llm: 'Unverified',
    mcpAccess: 'stub',
    status: 'planned',
  },
  {
    id: 'custom',
    name: 'Custom',
    level: 'L1',
    tagline: 'Compose exactly the services you need from two independent flags.',
    useCase:
      'Operator who needs granular control over installed services, for resource-constrained environments or non-standard deployments.',
    command: 'sudo bash scripts/install-gradatum-services.sh --build [--with-engine] [--with-gateway]',
    services: ['gradatum-server + gradatum-worker always; --with-engine and --with-gateway each opt in independently'],
    llm: 'Depends on flags chosen — none, local (via --with-engine), or routed (via --with-gateway)',
    mcpAccess: 'stub',
    status: 'available',
  },
  {
    id: 'docker',
    name: 'Docker',
    level: 'L1',
    tagline: 'Run the full stack in containers with the repo-provided Compose file.',
    useCase:
      'Developer or operator preferring containerized deployments for isolation, portability, or use in an existing container infrastructure.',
    command: 'git clone https://github.com/gradatum/gradatum.git\ncd gradatum && docker compose up -d --build',
    services: [
      'gradatum-server',
      'gradatum-worker',
      'gradatum-init',
      'gradatum-gateway',
      'gradatum-engine',
      'llama-chat + llama-embed (external llama.cpp containers)',
    ],
    llm: 'Bundled llama.cpp containers (chat + embed) — override via environment for another provider',
    mcpAccess: 'stub',
    status: 'available',
  },
];

export const installModes = installModeArraySchema.parse(modes);
