import express from 'express';
import cors from 'cors';
import path from 'path';
import { generateScript } from './services/ai.service';
import { generateVoiceover, getVoiceConfig, getAllVoiceConfigs } from './services/voice.service';

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Serve generated audio files statically
const audioOutputDir = process.env.AUDIO_OUTPUT_DIR || path.join(__dirname, '..', 'audio-output');
app.use('/api/audio', express.static(audioOutputDir));

// Health check
app.get('/api/health', (_req, res) => {
  res.json({
    status: 'ok',
    service: 'tikauto-backend',
    version: '0.1.0',
    timestamp: new Date().toISOString(),
  });
});

// Status endpoint
app.get('/api/status', (_req, res) => {
  res.json({
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    node: process.version,
  });
});

/**
 * POST /api/generate-script
 *
 * Generate a TikTok script using AI.
 *
 * Body: { niche: string, topic: string }
 * - niche: Content category (e.g., "psychology", "finance", "mystery")
 * - topic: Specific topic for the script
 *
 * Uses Gemini if GEMINI_API_KEY is set, OpenAI if OPENAI_API_KEY is set,
 * otherwise returns a mock response for development.
 */
app.post('/api/generate-script', async (req, res) => {
  try {
    const { niche, topic } = req.body;

    // Validate input
    if (!niche || !topic) {
      res.status(400).json({
        error: 'Missing required fields',
        details: 'Both "niche" and "topic" are required.',
      });
      return;
    }

    if (typeof niche !== 'string' || typeof topic !== 'string') {
      res.status(400).json({
        error: 'Invalid input types',
        details: '"niche" and "topic" must be strings.',
      });
      return;
    }

    if (niche.length > 100 || topic.length > 500) {
      res.status(400).json({
        error: 'Input too long',
        details: '"niche" max 100 chars, "topic" max 500 chars.',
      });
      return;
    }

    console.log(`📝 Generating script for niche="${niche}", topic="${topic}"`);
    const script = await generateScript(niche.trim(), topic.trim());

    res.json(script);
  } catch (error) {
    console.error('❌ Script generation error:', error);
    res.status(500).json({
      error: 'Script generation failed',
      details: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

/**
 * POST /api/generate-voiceover
 *
 * Generate a voiceover for the given text using the niche's configured voice.
 *
 * Body: { text: string, niche: string }
 * - text: The script text to convert to speech
 * - niche: Content niche (determines voice selection: psychology→Rachel, finance→Antoni, mystery→Patrick)
 *
 * Uses ElevenLabs API if ELEVENLABS_API_KEY is set,
 * otherwise returns a mock audio file for development.
 */
app.post('/api/generate-voiceover', async (req, res) => {
  try {
    const { text, niche } = req.body;

    // Validate input
    if (!text || !niche) {
      res.status(400).json({
        error: 'Missing required fields',
        details: 'Both "text" and "niche" are required.',
      });
      return;
    }

    if (typeof text !== 'string' || typeof niche !== 'string') {
      res.status(400).json({
        error: 'Invalid input types',
        details: '"text" and "niche" must be strings.',
      });
      return;
    }

    if (text.length > 10000) {
      res.status(400).json({
        error: 'Text too long',
        details: '"text" max 10,000 characters.',
      });
      return;
    }

    const voiceConfig = getVoiceConfig(niche.trim());
    console.log(`🎤 Generating voiceover for niche="${niche}" using voice="${voiceConfig.name}"`);

    const result = await generateVoiceover(text.trim(), niche.trim());

    // Return the result with a URL to access the audio file
    res.json({
      ...result,
      audioUrl: `/api/audio/${path.basename(result.audioFilePath)}`,
    });
  } catch (error) {
    console.error('❌ Voiceover generation error:', error);
    res.status(500).json({
      error: 'Voiceover generation failed',
      details: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

/**
 * GET /api/voices
 *
 * List all available voice configurations by niche.
 */
app.get('/api/voices', (_req, res) => {
  res.json(getAllVoiceConfigs());
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 TikAuto backend running on http://0.0.0.0:${PORT}`);
  console.log(`   Health: http://0.0.0.0:${PORT}/api/health`);
  console.log(`   Generate Script: POST http://0.0.0.0:${PORT}/api/generate-script`);
  console.log(`   Generate Voiceover: POST http://0.0.0.0:${PORT}/api/generate-voiceover`);
  console.log(`   List Voices: GET http://0.0.0.0:${PORT}/api/voices`);
  console.log(`   Audio files: http://0.0.0.0:${PORT}/api/audio/`);
});