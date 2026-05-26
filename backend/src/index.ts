import express from 'express';
import cors from 'cors';
import { generateScript } from './services/ai.service';

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

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
 * - niche: Content category (e.g., "finance", "fitness", "tech")
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

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 TikAuto backend running on http://0.0.0.0:${PORT}`);
  console.log(`   Health: http://0.0.0.0:${PORT}/api/health`);
  console.log(`   Generate Script: POST http://0.0.0.0:${PORT}/api/generate-script`);
});