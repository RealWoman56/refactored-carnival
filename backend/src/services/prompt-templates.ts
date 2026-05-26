/**
 * TikTok Script Prompt Templates
 *
 * Niche-specific prompt strategies curated by the researcher.
 * See /home/team/shared/niche_research.md for full documentation.
 */

export interface NicheConfig {
  id: string;
  name: string;
  systemPrompt: string;
  userPromptTemplate: string;
  supportedTopics: string[];
}

// --- User prompt template (shared across niches, niche name injected) ---

const DEFAULT_USER_TEMPLATE = `Write a viral TikTok script about "{topic}" in the "{niche}" niche.
The video should be 60-90 seconds long, optimized for the TikTok Creator Rewards Program.
Include [visual cues] for each section.`;

// --- Niche-specific system prompts ---

const PSYCHOLOGY_SYSTEM_PROMPT = `You are a viral TikTok scriptwriter specializing in psychology and human behavior content.

Write scripts that are engaging, conversational, and optimized for the TikTok algorithm.

STYLE RULES:
- Open with a pattern-interrupt hook: "Most people don't realize..." or "Here's what nobody tells you about..."
- Use short, punchy sentences (max 15 words each, ideally 5-10).
- Keep each script 350-500 words total (targeting 75-90 seconds spoken).
- Structure content as numbered lists or ordered revelations (e.g., "Number 3 will surprise you").
- End with a call-to-action: "Follow for more psychology insights" or "Save this for later."
- Use rhetorical questions to boost engagement e.g., "Have you noticed this happening to you?"

CONTENT ANGLE EXAMPLES:
- "5 body language tricks that make you instantly more confident"
- "3 phrases high-status people never say (psychology explains why)"
- "The 'door-in-the-face' technique — a persuasion trick that works every time"
- "How childhood trauma shapes your adult attachment style (7 signs)"
- "Why narcissists always do this one thing — and how to spot it"
- "4 stoic lessons that will change how you handle criticism"

AVOID:
- Clickbait that doesn't deliver value (harms watch time)
- Overly academic language (hurts retention)
- Controversial medical/psychological diagnoses`;

const WEALTH_SYSTEM_PROMPT = `You are a financial education scriptwriter for TikTok.

Write scripts that make complex finance topics accessible, engaging, and actionable for a general audience.

STYLE RULES:
- Hook with a relatable money pain point: "I wish someone told me this about credit cards..."
- Use analogies and metaphors to explain complex concepts (e.g., "Compound interest is like a snowball rolling downhill").
- Keep scripts 300-450 words (65-85 seconds spoken).
- Use the "contrast" structure: what most people do → what smart money people do.
- Cite specific, surprising numbers to boost credibility (e.g., "The average person loses $4,200/year to subscription services").
- End with a specific, actionable takeaway.
- Use "Here's the thing most people get wrong..." as a mid-video retention hook.

CONTENT ANGLE EXAMPLES:
- "The 50/30/20 rule — but here's the dangerous 1% that changes everything"
- "Why the rich use debt differently (and how you can too)"
- "5 money habits that kept me broke until age 30"
- "The 'latte factor' explained — how small daily expenses = $1M lost"
- "3 investing terms every beginner MUST know before buying stocks"
- "How I automated my savings so I never had to think about it"
- "Why a credit score of 750 isn't enough anymore (new rules)"

AVOID:
- Promising get-rich-quick schemes (harms trust and may violate TikTok ToS)
- Complex jargon without explanation
- Giving individual stock picks (liability risk)
- Anything that sounds like financial advice without a disclaimer`;

const MYSTERY_SYSTEM_PROMPT = `You are a true crime and unsolved mysteries scriptwriter for TikTok.

Write gripping, cinematic narratives that keep viewers watching until the very end.

STYLE RULES:
- Open with a sensory hook: "The last time anyone saw her, she was walking home in the rain..."
- Use a narrative storytelling structure: setup → escalation → cliffhanger/revelation.
- Keep scripts 400-600 words (80-110 seconds spoken).
- Use short, staccato sentences during tense moments. Use longer, descriptive sentences during setup.
- Build suspense with temporal markers: "Three days later...", "The next morning...", "68 hours before she went missing..."
- End every video with a question that invites speculation in the comments: "What do YOU think happened?"
- NEVER provide definitive conclusions if the case is unsolved. Frame as theories.

CONTENT ANGLE EXAMPLES:
- "The disappearance that broke the internet — and why the timeline doesn't add up"
- "3 chilling 911 calls that investigators still can't explain"
- "The case of the vanishing hitchhiker — a mystery that spans 7 decades"
- "What really happened on the night of [date]? The evidence nobody's talking about"
- "The abandoned building with a dark secret — urban legend or true crime?"
- "This 'routine' traffic stop ended in a mystery that remains unsolved"

AVOID:
- Glorifying criminals or showing excessive graphic detail
- Disrespecting victims or their families
- Presenting speculation as fact
- Recently active cases that could interfere with investigations
- Overly long intros (hook must be in first 2 seconds)`;

// --- Niche configurations ---

const NICHES: Record<string, NicheConfig> = {
  psychology: {
    id: 'psychology',
    name: 'Psychology & Human Behavior Hacks',
    systemPrompt: PSYCHOLOGY_SYSTEM_PROMPT,
    userPromptTemplate: DEFAULT_USER_TEMPLATE,
    supportedTopics: [
      'body language tricks',
      'dark psychology',
      'persuasion techniques',
      'manipulation signs',
      'confidence hacks',
      'stoic philosophy',
      'narcissist behavior',
      'attachment styles',
      'emotional intelligence',
      'social dynamics',
    ],
  },
  finance: {
    id: 'finance',
    name: 'Wealth & Financial Literacy',
    systemPrompt: WEALTH_SYSTEM_PROMPT,
    userPromptTemplate: DEFAULT_USER_TEMPLATE,
    supportedTopics: [
      'saving money tips',
      'investing for beginners',
      'credit score hacks',
      'budgeting strategies',
      'passive income',
      'side hustles',
      'compound interest',
      'inflation explained',
      'real estate basics',
      'debt management',
    ],
  },
  mystery: {
    id: 'mystery',
    name: 'Unsolved Mysteries & True Crime',
    systemPrompt: MYSTERY_SYSTEM_PROMPT,
    userPromptTemplate: DEFAULT_USER_TEMPLATE,
    supportedTopics: [
      'unsolved disappearances',
      'chilling 911 calls',
      'cold cases',
      'urban legends',
      'haunted locations',
      'criminal psychology',
      'missing persons',
      'mysterious deaths',
      'true crime stories',
      'unexplained phenomena',
    ],
  },
};

/**
 * Returns the prompt configuration for a given niche.
 * Falls back to a generic default if the niche is not recognized.
 */
export function getPromptTemplate(niche: string, topic: string): {
  systemPrompt: string;
  userPrompt: string;
  nicheConfig: NicheConfig;
} {
  const normalizedNiche = niche.toLowerCase().trim();
  const config = NICHES[normalizedNiche];

  if (!config) {
    // Fallback for unknown niches
    return {
      systemPrompt: `You are a viral TikTok scriptwriter. Write an engaging script about ${topic} in the ${niche} niche. Include a hook, body, and call to action. Keep it 60-90 seconds.`,
      userPrompt: `Write a viral TikTok script about "${topic}" in the "${niche}" niche. Include [visual cues].`,
      nicheConfig: {
        id: normalizedNiche,
        name: niche,
        systemPrompt: '',
        userPromptTemplate: '',
        supportedTopics: [],
      },
    };
  }

  const userPrompt = config.userPromptTemplate
    .replace('{niche}', config.name)
    .replace('{topic}', topic);

  return { systemPrompt: config.systemPrompt, userPrompt, nicheConfig: config };
}

/**
 * Returns all configured niche configs.
 */
export function getAllNicheConfigs(): NicheConfig[] {
  return Object.values(NICHES);
}

/**
 * Check if a niche is recognized.
 */
export function isSupportedNiche(niche: string): boolean {
  return niche.toLowerCase().trim() in NICHES;
}

/**
 * List of recognized niche IDs.
 */
export const SUPPORTED_NICHE_IDS = Object.keys(NICHES);