/**
 * gradatum-www — Use cases data (8 scenarios Without/With)
 *
 * Validated at import time via Zod. Build fails on schema violation.
 */
import type { UseCase } from '../content/config';
import { useCaseArraySchema } from '../content/config';

const cases: UseCase[] = [
  {
    id: 'uc-01',
    title: 'Context that survives session boundaries',
    withoutGradatum:
      'Every new session starts from zero. The agent has no memory of prior decisions, ongoing projects, or established working agreements.',
    withGradatum:
      'Decisions, learned patterns, and project state persist in the vault and are surfaced automatically at the start of each relevant session.',
    featureRef: 'F-34',
    sinceVersion: 'v0.1.0',
    grade: 'Bronze',
    isPlanned: false,
  },
  {
    id: 'uc-02',
    title: 'Workflows that improve without manual tuning',
    withoutGradatum:
      'Operator-level preferences and validated sequences stay implicit — repeated verbally, forgotten on model switch, never formalized.',
    withGradatum:
      'Recurring patterns (dry-run before spec, validate before implementing) are distilled into SKILL.md entries and applied automatically.',
    featureRef: 'F-29',
    sinceVersion: 'v0.5.0',
    grade: 'Silver',
    isPlanned: true,
  },
  {
    id: 'uc-03',
    title: 'Consistent agent identity across model switches',
    withoutGradatum:
      "Each LLM backend reads a different config file. A gateway fallback silently changes the agent's tone, rules, or working style.",
    withGradatum:
      "A single vault source of truth is served to every model. The agent's identity, charter, and hard limits are model-agnostic.",
    featureRef: 'F-34 · D-14',
    sinceVersion: 'v0.1.0',
    grade: 'Bronze',
    isPlanned: false,
  },
  {
    id: 'uc-04',
    title: 'Shared rules that apply to operator and agent alike',
    withoutGradatum:
      'Constraints live in prompts — overridden by context, silently dropped on reformat, inconsistently applied across sessions.',
    withGradatum:
      'A structured constitution (atomic blocks selected at install) defines shared principles for operator, agent, and sub-agents. Only the operator can amend it. Only relevant blocks are injected per turn.',
    featureRef: 'F-34',
    sinceVersion: 'v0.1.0',
    grade: 'Bronze',
    isPlanned: false,
  },
  {
    id: 'uc-05',
    title: 'Your decisions outrank generic web content',
    withoutGradatum:
      'A scraped article and an explicit architectural decision surface with equal weight. Generic content contradicts your own choices.',
    withGradatum:
      'Explicit decisions carry trust 0.95, decay slowly (~2 years). Scraped content carries trust 0.35, near-invisible after 2 weeks. At equal semantic similarity, your decision always wins.',
    featureRef: 'F-14',
    sinceVersion: 'v0.1.0',
    grade: 'Bronze',
    isPlanned: false,
  },
  {
    id: 'uc-06',
    title: 'Confident-sounding wrong answers caught before you see them',
    withoutGradatum:
      'A single aggregate score passes a threshold even when attribution is weak and specificity is high — a confident hallucination.',
    withGradatum:
      'Attribution and specificity are scored independently. High specificity + low attribution triggers automatic REJECT + grounding retry. Scorer disagreement triggers review queue.',
    featureRef: 'F-07',
    sinceVersion: 'v0.5.0',
    grade: 'Silver',
    isPlanned: true,
  },
  {
    id: 'uc-07',
    title: 'Relevant past decisions surfaced without asking',
    withoutGradatum:
      'Operator re-decides what was already decided. Contradictory choices accumulate silently across sessions and projects.',
    withGradatum:
      'When working on a problem, gradatum surfaces prior vault entries matching the current context. Contextual retrieval today; proactive push without explicit query planned for a later release.',
    featureRef: 'F-34',
    sinceVersion: 'v0.1.0',
    grade: 'Bronze',
    isPlanned: false,
  },
  {
    id: 'uc-08',
    title: 'Search that understands where a note lives, not just what it says',
    withoutGradatum:
      'Standard vector RAG returns decontextualized chunks. A note about "write hooks" in an architecture section ranks equally with one in a debug log.',
    withGradatum:
      'Each note is embedded with its structural path (e.g., "knowledge > architecture > writehook"). Section-aware retrieval surfaces notes from the right locus first.',
    featureRef: 'F-05',
    sinceVersion: 'v0.1.0',
    grade: 'Bronze',
    isPlanned: false,
  },
];

export const useCases = useCaseArraySchema.parse(cases);
