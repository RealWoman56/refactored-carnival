import express from 'express';
import cors from 'cors';
import path from 'path';
import { generateScript } from './services/ai.service';
import { generateVoiceover, getVoiceConfig, getAllVoiceConfigs } from './services/voice.service';
import {
  generateAllVisuals,
  getAllVisualStyles,
  GenerateVisualsRequest,
} from './services/visual.service';
import {
  createGeneration,
  saveScriptData,
  saveAudioData,
  saveMetadata,
  getHistory,
  getGenerationById,
  getGenerationCount,
} from './services/database.service';

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Serve generated audio files statically
const audioOutputDir = process.env.AUDIO_OUTPUT_DIR || path.join(__dirname, '..', 'audio-output');
app.use('/api/audio', express.static(audioOutputDir));

// Serve generated visual assets statically
const visualsOutputDir = process.env.VISUALS_OUTPUT_DIR || path.join(__dirname, '..', 'visuals-output');
app.use('/api/visuals', express.static(visualsOutputDir));

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
 * Generate a TikTok script using AI and persist to database.
 *
 * Body: { niche: string, topic: string }
 */
app.post('/api/generate-script', async (req, res) => {
  try {
    const { niche, topic } = req.body;

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

    const trimmedNiche = niche.trim();
    const trimmedTopic = topic.trim();

    console.log(`📝 Generating script for niche="${trimmedNiche}", topic="${trimmedTopic}"`);
    const script = await generateScript(trimmedNiche, trimmedTopic);

    // Persist to database
    const generationId = createGeneration({
      niche: trimmedNiche,
      topic: trimmedTopic,
      caption: req.body.caption || null,
      hashtags: req.body.hashtags || null,
      description: req.body.description || null,
      scheduled_at: req.body.scheduled_at || null,
    });
    saveScriptData(generationId, script);

    res.json({
      ...script,
      generationId,
    });
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
 * Generate a voiceover and persist to database.
 *
 * Body: { text: string, niche: string, generationId?: string }
 */
app.post('/api/generate-voiceover', async (req, res) => {
  try {
    const { text, niche, generationId } = req.body;

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

    const audioUrl = `/api/audio/${path.basename(result.audioFilePath)}`;

    // Persist to database if generationId is provided
    if (generationId) {
      saveAudioData(generationId, audioUrl, result);
    }

    res.json({
      ...result,
      audioUrl,
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

/**
 * GET /api/visual-styles
 *
 * List all available niche visual styles with color palettes and font info.
 */
app.get('/api/visual-styles', (_req, res) => {
  res.json(getAllVisualStyles());
});

/**
 * POST /api/generate-visuals
 *
 * Generate visual assets (AI images + stock footage) for a script.
 */
app.post('/api/generate-visuals', async (req, res) => {
  try {
    const { niche, prompts, stockKeywords } = req.body;

    if (!niche || !prompts) {
      res.status(400).json({
        error: 'Missing required fields',
        details: 'Both "niche" and "prompts" are required.',
      });
      return;
    }

    if (typeof niche !== 'string') {
      res.status(400).json({
        error: 'Invalid input types',
        details: '"niche" must be a string.',
      });
      return;
    }

    if (!Array.isArray(prompts) || prompts.length === 0) {
      res.status(400).json({
        error: 'Invalid prompts',
        details: '"prompts" must be a non-empty array of strings.',
      });
      return;
    }

    for (const p of prompts) {
      if (typeof p !== 'string') {
        res.status(400).json({
          error: 'Invalid prompt type',
          details: 'Each prompt must be a string.',
        });
        return;
      }
    }

    if (stockKeywords !== undefined) {
      if (!Array.isArray(stockKeywords)) {
        res.status(400).json({
          error: 'Invalid stockKeywords',
          details: '"stockKeywords" must be an array of strings if provided.',
        });
        return;
      }
      for (const kw of stockKeywords) {
        if (typeof kw !== 'string') {
          res.status(400).json({
            error: 'Invalid keyword type',
            details: 'Each stock keyword must be a string.',
          });
          return;
        }
      }
    }

    console.log(`🎨 Generating visuals for niche="${niche}", ${prompts.length} prompt(s)`);

    const request: GenerateVisualsRequest = {
      niche: niche.trim(),
      prompts,
      stockKeywords,
    };

    const result = await generateAllVisuals(request);
    res.json(result);
  } catch (error) {
    console.error('❌ Visual generation error:', error);
    res.status(500).json({
      error: 'Visual generation failed',
      details: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

/**
 * GET /api/history
 *
 * Get the list of past content generations, ordered by most recent first.
 *
 * Query params:
 * - limit (number, default 50): Max records to return
 * - offset (number, default 0): Pagination offset
 */
app.get('/api/history', (req, res) => {
  try {
    const limit = Math.min(parseInt(req.query.limit as string) || 50, 100);
    const offset = parseInt(req.query.offset as string) || 0;

    const history = getHistory(limit, offset);
    const total = getGenerationCount();

    res.json({
      items: history,
      total,
      limit,
      offset,
    });
  } catch (error) {
    console.error('❌ History fetch error:', error);
    res.status(500).json({
      error: 'Failed to fetch history',
      details: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

/**
 * GET /api/history/:id
 *
 * Get a single generation record by ID with full data.
 */
app.get('/api/history/:id', (req, res) => {
  try {
    const record = getGenerationById(req.params.id);
    if (!record) {
      res.status(404).json({ error: 'Generation not found' });
      return;
    }

    res.json({
      ...record,
      script_data: record.script_data ? JSON.parse(record.script_data) : null,
      audio_metadata: record.audio_metadata ? JSON.parse(record.audio_metadata) : null,
      visual_data: record.visual_data ? JSON.parse(record.visual_data) : null,
    });
  } catch (error) {
    console.error('❌ History fetch error:', error);
    res.status(500).json({
      error: 'Failed to fetch generation',
      details: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

/**
 * PUT /api/history/:id/metadata
 *
 * Update the metadata fields (caption, hashtags, description, scheduled_at)
 * for an existing generation record.
 */
app.put('/api/history/:id/metadata', (req, res) => {
  try {
    const { caption, hashtags, description, scheduled_at } = req.body;

    // Validate at least one field is provided
    if (!caption && !hashtags && !description && !scheduled_at) {
      res.status(400).json({
        error: 'No fields to update',
        details: 'Provide at least one of: caption, hashtags, description, scheduled_at.',
      });
      return;
    }

    // Validate caption length
    if (caption && typeof caption === 'string' && caption.length > 220) {
      res.status(400).json({
        error: 'Caption too long',
        details: '"caption" max 220 characters.',
      });
      return;
    }

    saveMetadata(req.params.id, {
      caption: caption || undefined,
      hashtags: hashtags || undefined,
      description: description || undefined,
      scheduled_at: scheduled_at || undefined,
    });

    res.json({ success: true, id: req.params.id });
  } catch (error) {
    console.error('❌ Metadata update error:', error);
    res.status(500).json({
      error: 'Failed to update metadata',
      details: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 TikAuto backend running on http://0.0.0.0:${PORT}`);
  console.log(`   Health: http://0.0.0.0:${PORT}/api/health`);
  console.log(`   Generate Script: POST http://0.0.0.0:${PORT}/api/generate-script`);
  console.log(`   Generate Voiceover: POST http://0.0.0.0:${PORT}/api/generate-voiceover`);
  console.log(`   Generate Visuals: POST http://0.0.0.0:${PORT}/api/generate-visuals`);
  console.log(`   List Voices: GET http://0.0.0.0:${PORT}/api/voices`);
  console.log(`   Visual Styles: GET http://0.0.0.0:${PORT}/api/visual-styles`);
  console.log(`   History: GET http://0.0.0.0:${PORT}/api/history`);
  console.log(`   History Detail: GET http://0.0.0.0:${PORT}/api/history/:id`);
  console.log(`   Update Metadata: PUT http://0.0.0.0:${PORT}/api/history/:id/metadata`);
  console.log(`   Audio files: http://0.0.0.0:${PORT}/api/audio/`);
  console.log(`   Visual assets: http://0.0.0.0:${PORT}/api/visuals/`);
});
