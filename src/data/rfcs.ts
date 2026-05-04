/**
 * RFC data derived from ../gradatum/docs/RFC/RFC-*.md
 * Validated at build time by Zod schema (see src/content/config.ts).
 * Frontmatter added to RFC files in docs/content-schemas-for-www branch (PR-1).
 */
import { rfcSchema, type RfcEntry } from '@/content/config';

const rawRfcs = [
  {
    rfc_number: '0001',
    title: 'Trait stability tiers and versioning for gradatum-core',
    status: 'accepted',
    started: '2026-05-03',
    resolved: '2026-05-03',
    affected_crates: [
      'gradatum-core',
      'gradatum-chat',
      'gradatum-embed',
      'gradatum-acl-policy',
      'gradatum-auth',
    ],
    summary:
      'Defines three trait stability tiers (stable / unstable / experimental) for gradatum-core public traits, with SemVer enforcement rules per tier.',
    url: 'https://github.com/mymomot/gradatum/blob/main/docs/RFC/RFC-0001-versioning-gradatum-core.md',
  },
  {
    rfc_number: '0002',
    title: 'Cross-platform support: Linux primary + Windows secondary',
    status: 'accepted',
    started: '2026-05-04',
    resolved: '2026-05-04',
    affected_crates: ['gradatum-storage', 'gradatum-chat', 'gradatum-embed'],
    summary:
      'B-light tiered model: Linux x86_64 primary (full CI + runtime), Windows x86_64 secondary (mingw-w64 cross-compile, manual pre-release validation). 13 portability rules R1–R13.',
    url: 'https://github.com/mymomot/gradatum/blob/main/docs/RFC/RFC-0002-cross-platform-support.md',
  },
  {
    rfc_number: '0003',
    title: 'HTTP API surface and MCP integration topology',
    status: 'accepted',
    started: '2026-05-04',
    resolved: '2026-05-04',
    affected_crates: ['gradatum-server', 'gradatum-mcp-stub'],
    summary:
      'Single-port :19090 path-prefix routing (/api/v1 /mcp /sse /health /admin). gradatum-mcp-stub as stdio → HTTP bridge for Claude Code, Claude Desktop, ZeroClaw.',
    url: 'https://github.com/mymomot/gradatum/blob/main/docs/RFC/RFC-0003-http-api-surface-and-mcp-integration.md',
  },
] as const;

// Extended type with summary and url fields (used by RfcCards component)
export type RfcDisplay = RfcEntry & { summary: string; url: string };

// Validate Zod schema fields at build time
export const rfcs: RfcDisplay[] = rawRfcs.map((r) => ({
  ...rfcSchema.parse(r),
  summary: r.summary,
  url: r.url,
}));
