/**
 * AI Service — TikTok Script Generation
 *
 * Supports Google Gemini and OpenAI.
 * Falls back to a mock generator when no API key is configured (dev mode).
 */

import { getPromptTemplate } from './prompt-templates';

// --- Types ---

export interface ScriptSection {
  type: 'hook' | 'body' | 'call_to_action';
  content: string;
  visualCue?: string;
}

export interface GeneratedScript {
  niche: string;
  topic: string;
  sections: ScriptSection[];
  fullScript: string;
  estimatedDuration: string; // e.g., "60-90 seconds"
  model: string;
}

// --- Configuration ---

function getGeminiKey(): string | null {
  return process.env.GEMINI_API_KEY || null;
}

function getOpenAIKey(): string | null {
  return process.env.OPENAI_API_KEY || null;
}

// --- Mock Generator (for development without API keys) ---

function generateMockScript(niche: string, topic: string): GeneratedScript {
  const sections: ScriptSection[] = [
    {
      type: 'hook',
      content: `Most people don't know this about ${topic}. But what if I told you it could change everything?`,
      visualCue: 'Quick flash of surprising statistic, then zoom in on related imagery',
    },
    {
      type: 'body',
      content: `Here's the thing about ${topic} in the ${niche} world. It's not what you think. Studies show that 87% of people overlook this simple fact. But the top 1%? They use it every single day.

Let me break it down for you in three simple steps.

Step one: Understand the core principle. It's simpler than you imagine.

Step two: Apply it consistently. This is where most people fail — they give up too early.

Step three: Scale and optimize. Once you've got the basics down, the results compound.`,
      visualCue: 'Text overlays appearing one by one with kinetic typography. Stock footage of people working/exercising/studying',
    },
    {
      type: 'call_to_action',
      content: `If this helped, follow for more ${niche} insights. Drop a comment with your biggest takeaway — I read every single one. And save this video so you can come back to it later.`,
      visualCue: 'Arrow pointing to follow button. Text: "Save for later" with bookmark icon',
    },
  ];

  const fullScript = sections.map(s =>
    `[${s.type.toUpperCase()}] ${s.visualCue ? `(${s.visualCue}) ` : ''}${s.content}`
  ).join('\n\n');

  return {
    niche,
    topic,
    sections,
    fullScript,
    estimatedDuration: '60-90 seconds',
    model: 'mock-generator',
  };
}

// --- Google Gemini Generator ---

async function generateWithGemini(niche: string, topic: string): Promise<GeneratedScript> {
  const { GoogleGenerativeAI } = await import('@google/generative-ai');
  const { systemPrompt, userPrompt } = getPromptTemplate(niche, topic);

  const genAI = new GoogleGenerativeAI(getGeminiKey()!);
  const model = genAI.getGenerativeModel({
    model: 'gemini-2.0-flash',
    systemInstruction: systemPrompt,
  });

  const result = await model.generateContent(userPrompt);
  const response = result.response;
  const text = response.text();

  return parseLLMResponse(text, niche, topic, 'gemini-2.0-flash');
}

// --- OpenAI Generator ---

async function generateWithOpenAI(niche: string, topic: string): Promise<GeneratedScript> {
  const OpenAI = (await import('openai')).default;
  const { systemPrompt, userPrompt } = getPromptTemplate(niche, topic);

  const openai = new OpenAI({ apiKey: getOpenAIKey()! });
  const response = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt },
    ],
    temperature: 0.8,
    max_tokens: 1000,
  });

  const text = response.choices[0]?.message?.content || '';
  return parseLLMResponse(text, niche, topic, 'gpt-4o-mini');
}

// --- Response Parser ---

function parseLLMResponse(
  text: string,
  niche: string,
  topic: string,
  model: string
): GeneratedScript {
  // Split by sections using markers
  const sections: ScriptSection[] = [];
  const lines = text.split('\n');
  let currentSection: Partial<ScriptSection> = {};
  let fullScript = text;

  // Try to identify sections by common markers
  const hookMatch = text.match(/\[HOOK\]([\s\S]*?)(?=\[BODY\]|$)/i);
  const bodyMatch = text.match(/\[BODY\]([\s\S]*?)(?=\[CALL TO ACTION\]|\[CTA\]|$)/i);
  const ctaMatch = text.match(/(?:\[CALL TO ACTION\]|\[CTA\])([\s\S]*?)$/i);

  if (hookMatch) {
    const content = hookMatch[1].trim();
    const visualCueMatch = content.match(/\(([^)]+)\)/);
    sections.push({
      type: 'hook',
      content: visualCueMatch ? content.replace(/\([^)]+\)/, '').trim() : content,
      visualCue: visualCueMatch?.[1],
    });
  }

  if (bodyMatch) {
    const content = bodyMatch[1].trim();
    const visualCueMatch = content.match(/\(([^)]+)\)/);
    sections.push({
      type: 'body',
      content: visualCueMatch ? content.replace(/\([^)]+\)/, '').trim() : content,
      visualCue: visualCueMatch?.[1],
    });
  }

  if (ctaMatch) {
    const content = ctaMatch[1].trim();
    const visualCueMatch = content.match(/\(([^)]+)\)/);
    sections.push({
      type: 'call_to_action',
      content: visualCueMatch ? content.replace(/\([^)]+\)/, '').trim() : content,
      visualCue: visualCueMatch?.[1],
    });
  }

  // If parsing failed, treat entire response as body content
  if (sections.length === 0) {
    sections.push({ type: 'hook', content: text.substring(0, Math.min(100, text.length)) });
    sections.push({ type: 'body', content: text });
    sections.push({ type: 'call_to_action', content: 'Follow for more content like this!' });
  }

  return {
    niche,
    topic,
    sections,
    fullScript,
    estimatedDuration: '60-90 seconds',
    model,
  };
}

// --- Public API ---

/**
 * Generate a TikTok script for the given niche and topic.
 *
 * Uses Gemini if `GEMINI_API_KEY` is set, OpenAI if `OPENAI_API_KEY` is set,
 * otherwise falls back to a mock generator for development.
 *
 * @param niche - Content niche (e.g., "finance", "fitness")
 * @param topic - Specific topic for the script
 * @returns A GeneratedScript with sections, full text, and metadata
 */
export async function generateScript(niche: string, topic: string): Promise<GeneratedScript> {
  const geminiKey = getGeminiKey();
  const openaiKey = getOpenAIKey();

  if (geminiKey) {
    try {
      return await generateWithGemini(niche, topic);
    } catch (error) {
      console.error('Gemini generation failed:', error);
      // Fall through to next provider
    }
  }

  if (openaiKey) {
    try {
      return await generateWithOpenAI(niche, topic);
    } catch (error) {
      console.error('OpenAI generation failed:', error);
      // Fall through to mock
    }
  }

  // No API keys configured — use mock generator for dev
  console.log('⚠️  No AI API keys found. Using mock script generator.');
  return generateMockScript(niche, topic);
}