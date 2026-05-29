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
  relationships: [
    {
      category: 'Curiosity',
      emotionCode: 'CUR',
      format: 'Pattern Reveal',
      example: "The reason you keep attracting the same type of person has nothing to do with luck.",
      visualStyle: 'Revolving door visual. Subtle loop. Soft pink and warm tones. Gentle animation.',
      niche: 'relationships',
    },
    {
      category: 'Curiosity',
      emotionCode: 'CUR',
      format: 'Question',
      example: "What if the thing that keeps ending your relationships is something you learned before age 5?",
      visualStyle: 'Childhood photo fading into adult scene. Soft focus transition. Warm sepia tones.',
      niche: 'relationships',
    },
    {
      category: 'Curiosity',
      emotionCode: 'CUR',
      format: 'Hidden Truth',
      example: "There's a word for what's happening in your relationship — and once you learn it, you can't unsee it.",
      visualStyle: 'Two puzzle pieces that dont quite align. Slow camera push-in. Minimalist elegant design.',
      niche: 'relationships',
    },
    {
      category: 'Relatability',
      emotionCode: 'REL',
      format: 'Shared Experience',
      example: "If you've ever felt like you're giving more than you're getting in a relationship, this one's for you.",
      visualStyle: 'One person giving gifts/efforts, other receiving passively. Imbalance becomes visible. Empathy lighting.',
      niche: 'relationships',
    },
    {
      category: 'Contemplation',
      emotionCode: 'CON',
      format: 'Deep Question',
      example: "Are you in love with them — or are you in love with who they could become?",
      visualStyle: 'Two versions of a person — one clear and one blurry/imaginary. Deep blue palette.',
      niche: 'relationships',
    },
    {
      category: 'Surprise/Shock',
      emotionCode: 'SHOCK',
      format: 'Stat Bomb',
      example: "65% of couples break up due to poor communication — but it's not about what you think.",
      visualStyle: 'Two people talking with speech bubbles missing each other. Graphic illustration style.',
      niche: 'relationships',
    },
    {
      category: 'Authority',
      emotionCode: 'AUTH',
      format: 'Research-Backed',
      example: "Dr. John Gottman studied 3,000+ couples. He can predict divorce with 91% accuracy using this one sign.",
      visualStyle: 'Scientific/research aesthetic. Graph paper background. Relationship tracking chart.',
      niche: 'relationships',
    },
    {
      category: 'Empowerment',
      emotionCode: 'EMP',
      format: 'Boundary Setting',
      example: "You are allowed to have boundaries. In fact, your relationships depend on them.",
      visualStyle: 'Fence transforming into garden gate. Transformation animation. Warm hopeful lighting.',
      niche: 'relationships',
    },
  ],
};

// --- CTA Library (cross-niche) ---

const CTA_LIBRARY: CTAEntry[] = [
  { text: 'Follow for your daily dose of psychology.', category: 'Follow', niches: ['psychology'], visualStyle: 'Dark gradient, brain icon pulse animation' },
  { text: 'Follow for financial freedom.', category: 'Follow', niches: ['finance'], visualStyle: 'Green arrow upward, minimalist dark background' },
  { text: 'Follow for relationship breakthroughs.', category: 'Follow', niches: ['relationships'], visualStyle: 'Two dots connecting with a line, soft warm colors' },
  { text: 'Follow — your future self will thank you.', category: 'Follow', niches: ['all'], visualStyle: 'Calendar flipping to future date, warm gold' },
  { text: 'Which one surprised you most? Drop a number in the comments.', category: 'Comment', niches: ['all'], visualStyle: 'Speech bubble with ellipsis, pulsing animation' },
  { text: 'Comment TRUTH if you\'ve experienced this.', category: 'Comment', niches: ['psychology', 'relationships'], visualStyle: 'Heart with checkmark, soft animation' },
  { text: 'Tag someone who needs to hear this.', category: 'Comment', niches: ['relationships', 'all'], visualStyle: 'Tag icon with +1 animation' },
  { text: 'Save this for later — you\'ll need it.', category: 'Save', niches: ['all'], visualStyle: 'Bookmark icon sliding in, number highlight' },
  { text: 'Save this — your future self will thank you.', category: 'Save', niches: ['finance'], visualStyle: 'Envelope with thank you inside, animated opening' },
  { text: 'Save this for the next time you feel stuck.', category: 'Save', niches: ['psychology', 'relationships'], visualStyle: 'Lifeline animation, reaching hand visual' },
  { text: 'Share this with someone who needs to hear it.', category: 'Share', niches: ['all'], visualStyle: 'Two silhouettes passing light to each other' },
  { text: 'Forward this to your partner.', category: 'Share', niches: ['relationships'], visualStyle: 'Double heart icon with forward arrow' },
  { text: 'Send this to your money buddy.', category: 'Share', niches: ['finance'], visualStyle: 'High-five with dollar signs' },
  { text: 'Part 2 coming tomorrow. Turn on notifications.', category: 'Series', niches: ['all'], visualStyle: 'Bell icon with badge, notification animation' },
  { text: 'This is part 1 of 3. The next one changes everything.', category: 'Series', niches: ['all'], visualStyle: '1/3 badge, linear progress dots' },
  { text: 'Think smarter. Live better.', category: 'Branding', niches: ['psychology'], visualStyle: 'Gentle fade out, serene nature background' },
  { text: 'Love smarter. Live happier.', category: 'Branding', niches: ['relationships'], visualStyle: 'Heart and smile combination, warm fade' },
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