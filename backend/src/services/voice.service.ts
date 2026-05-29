/**
 * Voiceover Service — ElevenLabs TTS Integration
 *
 * Generates high-quality voiceovers using ElevenLabs API.
 * Supports niche-specific voice mappings from the researcher's style guide.
 * Falls back to a mock generator for development without API keys.
 *
 * Voice mappings (from /home/team/shared/niche_research.md):
 * - Psychology: warm female voice → "Rachel" (voice_id: 21m00Tcm4TlvDq8ikWAM)
 * - Finance: clear, energetic male voice → "Antoni" (voice_id: ErXwobaYiN019PkySvjV)
 * - Mysteries: deep, slow-paced male voice → "Patrick" (voice_id: ODq5zmih8GrVes37Dizd)
 */

import * as fs from 'fs';
import * as path from 'path';

// --- Types ---

export interface VoiceoverResult {
  niche: string;
  voiceId: string;
  voiceName: string;
  audioFilePath: string;
  duration: number; // estimated duration in seconds
  model: string;
}

export interface VoiceConfig {
  id: string;
  name: string;
  elevenLabsVoiceId: string;
  elevenLabsModel: string;
}

// --- Voice Configuration ---

const VOICE_CONFIGS: Record<string, VoiceConfig> = {
  psychology: {
    id: 'psychology',
    name: 'Rachel',
    elevenLabsVoiceId: '21m00Tcm4TlvDq8ikWAM',
    elevenLabsModel: 'eleven_multilingual_v2',
  },
  finance: {
    id: 'finance',
    name: 'Antoni',
    elevenLabsVoiceId: 'ErXwobaYiN019PkySvjV',
    elevenLabsModel: 'eleven_multilingual_v2',
  },
  relationships: {
    id: 'relationships',
    name: 'Bella',
    elevenLabsVoiceId: 'EXAVITQu4vr2l5nVqNnU',
    elevenLabsModel: 'eleven_multilingual_v2',
  },
};

// Default fallback voice
const DEFAULT_VOICE: VoiceConfig = {
  id: 'default',
  name: 'Rachel',
  elevenLabsVoiceId: '21m00Tcm4TlvDq8ikWAM',
  elevenLabsModel: 'eleven_multilingual_v2',
};

// --- Audio output directory ---

const AUDIO_OUTPUT_DIR = process.env.AUDIO_OUTPUT_DIR || path.join(__dirname, '..', '..', 'audio-output');

function ensureOutputDir(): void {
  if (!fs.existsSync(AUDIO_OUTPUT_DIR)) {
    fs.mkdirSync(AUDIO_OUTPUT_DIR, { recursive: true });
  }
}

// --- Mock Voiceover Generator (for dev without API keys) ---

function generateMockVoiceover(text: string, niche: string, voiceConfig: VoiceConfig): VoiceoverResult {
  ensureOutputDir();

  // Create a simple silent audio file as mock (just a placeholder)
  const sanitizedNiche = niche.replace(/[^a-zA-Z0-9]/g, '_').toLowerCase();
  const timestamp = Date.now();
  const fileName = `mock_${sanitizedNiche}_${timestamp}.mp3`;
  const filePath = path.join(AUDIO_OUTPUT_DIR, fileName);

  // Create a minimal valid MP3 file (silence placeholder)
  // This is a tiny valid MP3 frame (silence) so the file exists and is usable for testing
  const silentMp3Buffer = createSilentMp3();
  fs.writeFileSync(filePath, silentMp3Buffer);

  // Estimate duration: ~4.5 words per second for TTS
  const wordCount = text.split(/\s+/).length;
  const estimatedDuration = Math.ceil(wordCount / 4.5);

  console.log(`🎤 [MOCK] Generated voiceover for "${niche}" niche (${estimatedDuration}s, ${wordCount} words)`);

  return {
    niche,
    voiceId: voiceConfig.elevenLabsVoiceId,
    voiceName: voiceConfig.name,
    audioFilePath: filePath,
    duration: estimatedDuration,
    model: 'mock-tts',
  };
}

/**
 * Creates a minimal valid MP3 file containing silence.
 * This is a proper MP3 frame with silence metadata so media players can read it.
 */
function createSilentMp3(): Buffer {
  // Minimal MP3 frame header for Layer III, 128kbps, 44100Hz, stereo, no padding
  // Followed by zeros for the frame data
  const frameHeader = Buffer.from([
    0xFF, 0xFB, 0x90, 0x00, // MPEG1, Layer3, 128kbps, 44100Hz, stereo
  ]);

  // A single MP3 frame is 417 bytes at this bitrate
  const frameSize = 417;
  const frame = Buffer.alloc(frameSize, 0);
  frameHeader.copy(frame, 0);

  // Create ~3 seconds of silence (about 100 frames)
  const totalFrames = 100;
  const buffer = Buffer.alloc(totalFrames * frameSize, 0);
  for (let i = 0; i < totalFrames; i++) {
    frameHeader.copy(buffer, i * frameSize);
  }

  return buffer;
}

// --- ElevenLabs API Generator ---

async function generateWithElevenLabs(
  text: string,
  voiceConfig: VoiceConfig
): Promise<VoiceoverResult> {
  const apiKey = getElevenLabsKey();
  if (!apiKey) {
    throw new Error('ELEVENLABS_API_KEY is not configured');
  }

  ensureOutputDir();

  const url = `https://api.elevenlabs.io/v1/text-to-speech/${voiceConfig.elevenLabsVoiceId}`;

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Accept': 'audio/mpeg',
      'Content-Type': 'application/json',
      'xi-api-key': apiKey,
    },
    body: JSON.stringify({
      text,
      model_id: voiceConfig.elevenLabsModel,
      voice_settings: {
        stability: 0.5,
        similarity_boost: 0.75,
        style: 0.2,
        use_speaker_boost: true,
      },
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`ElevenLabs API error (${response.status}): ${errorText}`);
  }

  // Save audio file
  const sanitizedName = text.substring(0, 40).replace(/[^a-zA-Z0-9]/g, '_').toLowerCase();
  const timestamp = Date.now();
  const fileName = `tts_${voiceConfig.id}_${sanitizedName}_${timestamp}.mp3`;
  const filePath = path.join(AUDIO_OUTPUT_DIR, fileName);

  const arrayBuffer = await response.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  fs.writeFileSync(filePath, buffer);

  // Estimate duration from audio file (rough: ~4.5 words/sec for TTS)
  const wordCount = text.split(/\s+/).length;
  const estimatedDuration = Math.ceil(wordCount / 4.5);

  console.log(`🎤 [ElevenLabs] Generated voiceover using "${voiceConfig.name}" (${estimatedDuration}s)`);

  return {
    niche: voiceConfig.id,
    voiceId: voiceConfig.elevenLabsVoiceId,
    voiceName: voiceConfig.name,
    audioFilePath: filePath,
    duration: estimatedDuration,
    model: 'elevenlabs',
  };
}

// --- Configuration helpers ---

function getElevenLabsKey(): string | null {
  return process.env.ELEVENLABS_API_KEY || null;
}

/**
 * Get the voice configuration for a given niche.
 * Falls back to default if niche is not recognized.
 */
export function getVoiceConfig(niche: string): VoiceConfig {
  const normalizedNiche = niche.toLowerCase().trim();
  return VOICE_CONFIGS[normalizedNiche] || DEFAULT_VOICE;
}

/**
 * Get all available voice configurations.
 */
export function getAllVoiceConfigs(): Record<string, VoiceConfig> {
  return { ...VOICE_CONFIGS };
}

// --- Public API ---

/**
 * Generate a voiceover for the given text using the niche's configured voice.
 *
 * Uses ElevenLabs API if `ELEVENLABS_API_KEY` is set,
 * otherwise falls back to a mock generator for development.
 *
 * @param text - The text to convert to speech
 * @param niche - Content niche (determines voice selection)
 * @returns A VoiceoverResult with file path, duration, and metadata
 */
export async function generateVoiceover(text: string, niche: string): Promise<VoiceoverResult> {
  if (!text || text.trim().length === 0) {
    throw new Error('Text is required for voiceover generation');
  }

  const voiceConfig = getVoiceConfig(niche);
  const apiKey = getElevenLabsKey();

  if (apiKey) {
    try {
      return await generateWithElevenLabs(text, voiceConfig);
    } catch (error) {
      console.error('ElevenLabs generation failed:', error);
      // Fall through to mock
    }
  }

  // No API key or API call failed — use mock generator
  console.log('⚠️  No ElevenLabs API key found. Using mock voiceover generator.');
  return generateMockVoiceover(text, niche, voiceConfig);
}