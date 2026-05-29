/**
 * TikAuto API Service
 * Typed client for all backend API calls.
 */

const API_BASE = '/api';

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
  estimatedDuration: string;
  model: string;
}

export interface VoiceConfig {
  id: string;
  name: string;
  elevenLabsVoiceId: string;
  elevenLabsModel: string;
}

export interface VoiceoverResult {
  niche: string;
  voiceId: string;
  voiceName: string;
  audioFilePath: string;
  audioUrl: string;
  duration: number;
  model: string;
}

export interface HistoryItem {
  id: string;
  niche: string;
  topic: string;
  created_at: string;
  hasScript: number;
  hasAudio: number;
  hasVideo: number;
}

export interface HistoryResponse {
  items: HistoryItem[];
  total: number;
  limit: number;
  offset: number;
}

// --- API Client ---

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({ error: 'Unknown error' }));
    throw new Error(error.details || error.error || `HTTP ${res.status}`);
  }

  return res.json();
}

/**
 * Generate a TikTok script for a given niche and topic.
 */
export async function generateScript(
  niche: string,
  topic: string
): Promise<GeneratedScript> {
  return request<GeneratedScript>('/generate-script', {
    method: 'POST',
    body: JSON.stringify({ niche, topic }),
  });
}

/**
 * Generate a voiceover for the given text using the niche's voice.
 * Optionally pass a generationId to link the audio to an existing record.
 */
export async function generateVoiceover(
  text: string,
  niche: string,
  generationId?: string
): Promise<VoiceoverResult> {
  return request<VoiceoverResult>('/generate-voiceover', {
    method: 'POST',
    body: JSON.stringify({ text, niche, generationId }),
  });
}

/**
 * Get content generation history from the backend.
 */
export async function getHistory(limit?: number, offset?: number): Promise<HistoryResponse> {
  const params = new URLSearchParams();
  if (limit) params.set('limit', String(limit));
  if (offset) params.set('offset', String(offset));
  const qs = params.toString();
  return request<HistoryResponse>(`/history${qs ? '?' + qs : ''}`);
}

/**
 * Get all available voice configurations.
 */
export async function getVoices(): Promise<Record<string, VoiceConfig>> {
  return request<Record<string, VoiceConfig>>('/voices');
}

/**
 * Get server health status.
 */
export async function getHealth(): Promise<{ status: string; service: string; version: string }> {
  return request('/health');
}

/**
 * Niches with display information.
 */
export const NICHE_OPTIONS = [
  {
    id: 'psychology',
    label: '🧠 Psychology & Human Behavior Hacks',
    description: 'Body language, persuasion, dark psychology',
  },
  {
    id: 'finance',
    label: '💰 Wealth & Financial Literacy',
    description: 'Saving, investing, money mindset',
  },
  {
    id: 'relationships',
    label: '💞 Relationships & Social Dynamics',
    description: 'Love, communication, attachment theory',
  },
];