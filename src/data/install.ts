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
    command: 'gradatum-admin install --level nano',
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
    command: 'gradatum-admin install',
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
    command: 'gradatum-admin install --level full',
    services: [
      'gradatum-server',
      'gradatum-worker',
      'gradatum-gateway',
      'gradatum-engine',
      'NATS (if credentials configured)',
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
      'Operator managing a multi-user deployment where mobile and desktop clients connect directly via OAuth, without installing a local binary.',
    command: 'gradatum-admin install --level gold',
    services: [
      'gradatum-server (+ /mcp StreamableHTTP)',
      'gradatum-worker',
      'gradatum-gateway',
      'gradatum-engine',
      'NATS',
      'Identity Provider',
    ],
    llm: 'Local or cloud',
    mcpAccess: 'both',
    status: 'planned-v1.0',
  },
  {
    id: 'remote',
    name: 'Remote',
    level: 'L3',
    tagline: 'Connect gradatum-admin to an existing server running on a separate machine.',
    useCase:
      'Infrastructure operator managing gradatum on a dedicated node or VM, configuring it remotely from a workstation without a local install.',
    command: 'gradatum-admin install --level remote',
    services: ['Remote server via conf.d/ · .env (no local services installed)'],
    llm: "Via /api/v1/config (delegated to the remote server's provider)",
    mcpAccess: 'stub',
    status: 'available',
  },
  {
    id: 'custom',
    name: 'Custom',
    level: 'L1',
    tagline: 'Pick exactly which components to install — nothing more.',
    useCase:
      'Operator who needs granular control over installed services, for resource-constrained environments or non-standard deployments.',
    command: 'gradatum-admin install --level custom',
    services: ['Selected interactively (yes/no per component)'],
    llm: 'Chosen per wizard step',
    mcpAccess: 'stub',
    status: 'available',
  },
  {
    id: 'docker',
    name: 'Docker',
    level: 'L1',
    tagline: 'Run the full stack in containers with a generated Compose file.',
    useCase:
      'Developer or operator preferring containerized deployments for isolation, portability, or use in an existing container infrastructure.',
    command:
      'gradatum-admin install --docker --level solo --provider ollama\ndocker compose up -d',
    services: [
      'server',
      'worker',
      'gateway (Compose-managed; additional services added based on --level flag)',
    ],
    llm: 'Any supported provider, configured via generated .env',
    mcpAccess: 'stub',
    status: 'available',
  },
];

export const installModes = installModeArraySchema.parse(modes);
