/**
 * Hook Library Service
 *
 * Integrates the Viral Hook & CTA Library from /home/team/shared/hook_library.md
 * into the video assembly pipeline.
 *
 * Provides hook selection, visual style mapping, and CTA pairing
 * for automated TikTok video generation.
 */

// --- Types ---

export interface HookEntry {
  category: string;
  emotionCode: string;
  format: string;
  example: string;
  visualStyle: string;
  niche: string;
}

export interface CTAEntry {
  text: string;
  category: string;
  niches: string[];
  visualStyle: string;
}

export interface HookSelection {
  hook: HookEntry;
  cta: CTAEntry;
}

// --- Hook Library (curated from /home/team/shared/hook_library.md) ---

const HOOK_LIBRARY: Record<string, HookEntry[]> = {
  psychology: [
    {
      category: 'Curiosity',
      emotionCode: 'CUR',
      format: 'Pattern Interrupt',
      example: "Most people don't realize their brain is working against them right now.",
      visualStyle: 'Dark gradient background (deep purple → navy). Slow zoom. Bold white Montserrat text, centered, glow effect.',
      niche: 'psychology',
    },
    {
      category: 'Curiosity',
      emotionCode: 'CUR',
      format: 'List Preview',
      example: '5 psychological tricks that work instantly — and number 3 is illegal in some countries.',
      visualStyle: 'Dark gradient background. Number counter animation. Typewriter text reveal. Red accent for "illegal".',
      niche: 'psychology',
    },
    {
      category: 'Curiosity',
      emotionCode: 'CUR',
      format: 'Revelation',
      example: "There's a word for what they're doing to you — and once you know it, you'll see it everywhere.",
      visualStyle: 'Mirror reflection visual. Dark vignette overlay. All-caps condensed font, blur-to-sharp transition.',
      niche: 'psychology',
    },
    {
      category: 'Curiosity',
      emotionCode: 'CUR',
      format: 'Myth Bust',
      example: "Everything you've been told about confidence is backwards — here's what science actually says.",
      visualStyle: 'Split screen — red X vs green checkmark. Text wipes across center. High contrast black background.',
      niche: 'psychology',
    },
    {
      category: 'Surprise/Shock',
      emotionCode: 'SHOCK',
      format: 'Stat Bomb',
      example: "95% of people can't recognize when they're being gaslit — here's what to look for.",
      visualStyle: 'Bold numeral dominating screen. Red/black scheme. Count-up animation on percentage.',
      niche: 'psychology',
    },
    {
      category: 'Authority',
      emotionCode: 'AUTH',
      format: 'Expert Positioning',
      example: "In 15 years of studying human behavior, I've found one pattern that predicts everything.",
      visualStyle: 'Library or academic setting. Warm lighting. Underline animation. Serif font on dark brown.',
      niche: 'psychology',
    },
    {
      category: 'Empowerment',
      emotionCode: 'EMP',
      format: 'You Can Do This',
      example: "You have more control over your emotions than you think — here's how to take it back.",
      visualStyle: 'Nature setting, wide shot. Bright yellow/green text. Gentle upward pan.',
      niche: 'psychology',
    },
    {
      category: 'Contemplation',
      emotionCode: 'CON',
      format: 'Deep Question',
      example: "What if your personality isn't who you are — but who you learned to survive as?",
      visualStyle: 'Abstract Rorschach inkblot. Deep thinking aesthetic. Soft gray text, word by word fade.',
      niche: 'psychology',
    },
  ],
  finance: [
    {
      category: 'Curiosity',
      emotionCode: 'CUR',
      format: 'Secret Revealed',
      example: "The wealthy use a completely different set of rules — here's rule number one.",
      visualStyle: 'Vault door or bank entrance. Gold and black scheme. Text swipes in from right.',
      niche: 'finance',
    },
    {
      category: 'Curiosity',
      emotionCode: 'CUR',
      format: 'Gap Opener',
      example: "There's a $1 million difference between what most people do with their money and what the top 1% does.",
      visualStyle: 'Side-by-side comparison. Left gray/desaturated, right vibrant green. Text bridges the gap.',
      niche: 'finance',
    },
    {
      category: 'Urgency',
      emotionCode: 'URG',
      format: 'Time Bomb',
      example: 'Every year you wait to invest, you\'re losing $100,000+ in future wealth. Here\'s the math.',
      visualStyle: 'Countdown timer. Dollar amount decreasing. Red urgency colors. Fast-paced cuts.',
      niche: 'finance',
    },
    {
      category: 'Surprise/Shock',
      emotionCode: 'SHOCK',
      format: 'Stat Bomb',
      example: 'The average millionaire has 7 streams of income. The average person has 1. That\'s the gap.',
      visualStyle: 'Seven streams of light vs one thin line. Gold particles. Text highlights "7" and "1".',
      niche: 'finance',
    },
    {
      category: 'Authority',
      emotionCode: 'AUTH',
      format: 'Proven System',
      example: 'This 3-step system has helped thousands of ordinary people become millionaires. It\'s not complicated.',
      visualStyle: 'Three numbered steps. Whiteboard animation style. Clean sans-serif. Educational feel.',
      niche: 'finance',
    },
    {
      category: 'Empowerment',
      emotionCode: 'EMP',
      format: 'Actionable First Step',
      example: "You can start building wealth today with whatever you have in your pocket right now. Here's how.",
      visualStyle: 'Hand holding coins transforming into seedlings. Warm hopeful lighting. Green and gold palette.',
      niche: 'finance',
    },
    {
      category: 'Relatability',
      emotionCode: 'REL',
      format: 'Shared Struggle',
      example: "If you've ever felt like everyone else has their finances figured out except you — you're not alone.",
      visualStyle: 'Confused person with messy spreadsheet. Relatable, warm lighting. Friendly font.',
      niche: 'finance',
    },
    {
      category: 'FOMO',
      emotionCode: 'FOMO',
      format: 'Opportunity Cost',
      example: 'Your morning coffee costs you more in lost investment growth than you think — let me show you.',
      visualStyle: 'Coffee cup transforming into investment chart. Visual metaphor animation.',
      niche: 'finance',
    },
  ],
  mystery: [
    {
      category: 'Curiosity',
      emotionCode: 'CUR',
      format: 'Open Loop',
      example: 'The last time anyone saw her, she was walking home in the rain. What happened next remains a mystery.',
      visualStyle: 'Dark cinematic scene. Slow pan. Serif font in light gray. Typewriter-style reveal.',
      niche: 'mystery',
    },
    {
      category: 'Curiosity',
      emotionCode: 'CUR',
      format: 'Hidden Truth',
      example: "The evidence nobody's talking about — and why the timeline doesn't add up.",
      visualStyle: 'Police evidence board with red string. Slow zoom. Text appears with pencil sketch effect.',
      niche: 'mystery',
    },
    {
      category: 'Surprise/Shock',
      emotionCode: 'SHOCK',
      format: 'Revelation',
      example: '3 chilling 911 calls that investigators still can\'t explain — this one will keep you up at night.',
      visualStyle: 'Dark screen with audio waveform visualization. Text pulses with sound effects implied.',
      niche: 'mystery',
    },
    {
      category: 'Contemplation',
      emotionCode: 'CON',
      format: 'Deep Question',
      example: 'What do YOU think happened that night? The theories don\'t explain all the evidence.',
      visualStyle: 'Question mark pulsing on dark background. Slow zoom. Text fades in cryptically.',
      niche: 'mystery',
    },
    {
      category: 'Authority',
      emotionCode: 'AUTH',
      format: 'Data-Backed',
      example: 'Detectives have three theories, but none of them explain all the evidence. Here\'s why.',
      visualStyle: 'Case file aesthetic. Document overlays. Clinical typography. Evidence photo split screens.',
      niche: 'mystery',
    },
    {
      category: 'Empowerment',
      emotionCode: 'EMP',
      format: 'Hidden Knowledge',
      example: 'What they don\'t want you to know about this case — and why it matters for all of us.',
      visualStyle: 'Classified document aesthetic. Redacted text effect. Information reveals sequentially.',
      niche: 'mystery',
    },
  ],
};

// --- CTA Library (cross-niche) ---

const CTA_LIBRARY: CTAEntry[] = [
  { text: 'Follow for your daily dose of psychology.', category: 'Follow', niches: ['psychology'], visualStyle: 'Dark gradient, brain icon pulse animation' },
  { text: 'Follow for financial freedom.', category: 'Follow', niches: ['finance'], visualStyle: 'Green arrow upward, minimalist dark background' },
  { text: 'Follow for mind-bending mysteries.', category: 'Follow', niches: ['mystery'], visualStyle: 'Question mark fading in, dark cinematic background' },
  { text: 'Follow — your future self will thank you.', category: 'Follow', niches: ['all'], visualStyle: 'Calendar flipping to future date, warm gold' },
  { text: 'Which one surprised you most? Drop a number in the comments.', category: 'Comment', niches: ['all'], visualStyle: 'Speech bubble with ellipsis, pulsing animation' },
  { text: 'Comment TRUTH if you\'ve experienced this.', category: 'Comment', niches: ['psychology'], visualStyle: 'Heart with checkmark, soft animation' },
  { text: 'Drop your theory in the comments.', category: 'Comment', niches: ['mystery'], visualStyle: 'Magnifying glass over text, suspenseful reveal' },
  { text: 'Save this for later — you\'ll need it.', category: 'Save', niches: ['all'], visualStyle: 'Bookmark icon sliding in, number highlight' },
  { text: 'Save this — your future self will thank you.', category: 'Save', niches: ['finance'], visualStyle: 'Envelope with thank you inside, animated opening' },
  { text: 'Share this with someone who needs to hear it.', category: 'Share', niches: ['all'], visualStyle: 'Two silhouettes passing light to each other' },
  { text: 'Send this to your money buddy.', category: 'Share', niches: ['finance'], visualStyle: 'High-five with dollar signs' },
  { text: 'Part 2 coming tomorrow. Turn on notifications.', category: 'Series', niches: ['all'], visualStyle: 'Bell icon with badge, notification animation' },
  { text: 'This is part 1 of 3. The next one changes everything.', category: 'Series', niches: ['all'], visualStyle: '1/3 badge, linear progress dots' },
  { text: 'Think smarter. Live better.', category: 'Branding', niches: ['psychology'], visualStyle: 'Gentle fade out, serene nature background' },
  { text: 'Stay curious.', category: 'Branding', niches: ['all'], visualStyle: 'Minimalist, just two words fading in and out' },
];

// Track recently used hooks per niche to avoid repeats
const recentHooks: Record<string, number[]> = {};
const recentCTAs: Record<string, number[]> = {};

const MAX_RECENT = 10;

/**
 * Get a random hook for a given niche, avoiding recently used ones.
 */
export function selectHook(niche: string): HookEntry {
  const hooks = HOOK_LIBRARY[niche] || HOOK_LIBRARY.psychology;
  const used = recentHooks[niche] || [];

  // Filter out recently used hooks
  const available = hooks.filter((_, i) => !used.includes(i));

  // If all hooks have been used, reset
  const pool = available.length > 0 ? available : hooks;
  if (available.length === 0) {
    recentHooks[niche] = [];
  }

  // Pick random hook
  const hookIndex = Math.floor(Math.random() * pool.length);
  const actualIndex = hooks.indexOf(pool[hookIndex]);

  // Track it
  if (!recentHooks[niche]) recentHooks[niche] = [];
  recentHooks[niche].push(actualIndex);
  if (recentHooks[niche].length > MAX_RECENT) {
    recentHooks[niche].shift();
  }

  return pool[hookIndex];
}

/**
 * Get a random CTA suitable for a given niche.
 */
export function selectCTA(niche: string): CTAEntry {
  const suitable = CTA_LIBRARY.filter(c => c.niches.includes(niche) || c.niches.includes('all'));
  const used = recentCTAs[niche] || [];

  const available = suitable.filter((_, i) => !used.includes(i));
  const pool = available.length > 0 ? available : suitable;
  if (available.length === 0) {
    recentCTAs[niche] = [];
  }

  const ctaIndex = Math.floor(Math.random() * pool.length);
  const actualIndex = suitable.indexOf(pool[ctaIndex]);

  if (!recentCTAs[niche]) recentCTAs[niche] = [];
  recentCTAs[niche].push(actualIndex);
  if (recentCTAs[niche].length > MAX_RECENT) {
    recentCTAs[niche].shift();
  }

  return pool[ctaIndex];
}

/**
 * Select both a hook and a CTA for a given niche.
 */
export function selectHookAndCTA(niche: string): HookSelection {
  return {
    hook: selectHook(niche),
    cta: selectCTA(niche),
  };
}

/**
 * Get all hooks for a niche.
 */
export function getHooksForNiche(niche: string): HookEntry[] {
  return HOOK_LIBRARY[niche] || [];
}

/**
 * Get all hooks, grouped by niche.
 */
export function getAllHooks(): Record<string, HookEntry[]> {
  return HOOK_LIBRARY;
}

/**
 * Get all CTAs.
 */
export function getAllCTAs(): CTAEntry[] {
  return CTA_LIBRARY;
}

/**
 * Reset hook tracking (for testing).
 */
export function resetTracking(): void {
  Object.keys(recentHooks).forEach(k => delete recentHooks[k]);
  Object.keys(recentCTAs).forEach(k => delete recentCTAs[k]);
}