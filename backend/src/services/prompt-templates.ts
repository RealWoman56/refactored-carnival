/**
 * TikTok Script Prompt Templates
 *
 * These templates are placeholders that will be refined by the researcher
 * with niche-specific strategies, hooks, and viral patterns.
 *
 * TODO: Replace with researcher-curated prompt strategies per niche.
 */

export interface PromptTemplate {
  systemPrompt: string;
  userPromptTemplate: string;
}

const DEFAULT_SYSTEM_PROMPT = `You are a professional TikTok scriptwriter specializing in viral "faceless" content. 
Write engaging scripts optimized for the TikTok Creator Rewards Program (videos over 1 minute).

Each script must follow this structure:
1. **HOOK** (first 3 seconds) — A strong attention-grabber that stops the scroll
2. **BODY** — The main content delivered in a fast-paced, engaging style with pattern interrupts
3. **CALL TO ACTION** — Clear instruction to like, comment, follow, or save

Rules:
- Use conversational, energetic language
- Write for voiceover narration (no on-screen speaker)
- Include visual cues in [brackets] for the video editor
- Keep sentences short and punchy
- Total script: 60-90 seconds of spoken content`;

const DEFAULT_USER_TEMPLATE = `Write a viral TikTok script about "{topic}" in the "{niche}" niche.
The video should be 60-90 seconds long, optimized for the TikTok Creator Rewards Program.
Include [visual cues] for each section.`;

/**
 * Returns the prompt template for a given niche.
 * Falls back to the default template if no niche-specific template exists.
 */
export function getPromptTemplate(niche: string, topic: string): { systemPrompt: string; userPrompt: string } {
  // TODO: Researcher will replace this with niche-specific strategies
  // e.g., for "finance" niche use a different hook style than "fitness"

  const systemPrompt = DEFAULT_SYSTEM_PROMPT;
  const userPrompt = DEFAULT_USER_TEMPLATE
    .replace('{niche}', niche)
    .replace('{topic}', topic);

  return { systemPrompt, userPrompt };
}

/**
 * List of supported niches (to be expanded by researcher)
 */
export const SUPPORTED_NICHES = [
  'finance',
  'fitness',
  'tech',
  'history',
  'productivity',
  'psychology',
  'business',
  'self-improvement',
];