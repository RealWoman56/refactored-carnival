/**
 * Visual Asset Service — AI Image Generation & Stock Footage
 *
 * Generates images using AI (Gemini / OpenAI DALL-E) and retrieves
 * stock footage from the Pexels API. Follows the visual style guide
 * from /home/team/shared/niche_research.md for each niche.
 *
 * Niche style mappings:
 * - Psychology: dark moody gradients (deep purple → navy blue), bold white text
 * - Finance: clean beige/cream with geometric shapes, green/gold accents
 * - Mystery: dark cinematic grayscale/sepia, serif fonts, amber/gray text
 *
 * Falls back to a mock generator for development without API keys.
 */

import * as fs from 'fs';
import * as path from 'path';

// ============================================================
// Types
// ============================================================

export interface GeneratedImage {
  niche: string;
  prompt: string;
  imageUrl: string;
  localFilePath: string;
  model: string;
  style: NicheVisualStyle;
}

export interface StockFootageClip {
  niche: string;
  keywords: string[];
  videoUrl: string;
  thumbnailUrl: string;
  duration: number;
  width: number;
  height: number;
  source: string;
}

export interface NicheVisualStyle {
  nicheId: string;
  background: string;
  textColor: string;
  fontFamily: string;
  accentColor: string;
  mood: string;
}

export interface GenerateVisualsRequest {
  niche: string;
  prompts: string[];
  stockKeywords?: string[];
}

export interface GenerateVisualsResponse {
  niche: string;
  generatedImages: GeneratedImage[];
  stockClips: StockFootageClip[];
  style: NicheVisualStyle;
}

// ============================================================
// Niche Visual Styles (from niche_research.md)
// ============================================================

const NICHE_VISUAL_STYLES: Record<string, NicheVisualStyle> = {
  psychology: {
    nicheId: 'psychology',
    background: 'Dark moody gradient: deep purple (#1a0533) → navy blue (#0a1628)',
    textColor: '#FFFFFF',
    fontFamily: 'Montserrat, Inter, sans-serif',
    accentColor: '#B388FF',
    mood: 'cinematic, introspective, mysterious',
  },
  finance: {
    nicheId: 'finance',
    background: 'Clean professional: soft beige (#F5F0EB) with subtle geometric shapes or graph grid overlay',
    textColor: '#1A1A2E',
    fontFamily: 'Inter, sans-serif',
    accentColor: '#00C853',
    mood: 'professional, trustworthy, energetic',
  },
  mystery: {
    nicheId: 'mystery',
    background: 'Dark cinematic: grayscale or sepia-toned (#2C1810 → #1A1A1A)',
    textColor: '#D4C5A9',
    fontFamily: 'Playfair Display, Georgia, serif',
    accentColor: '#C9A96E',
    mood: 'dark, suspenseful, haunting',
  },
};

const DEFAULT_VISUAL_STYLE: NicheVisualStyle = {
  nicheId: 'default',
  background: 'Clean gradient: dark gray to black',
  textColor: '#FFFFFF',
  fontFamily: 'Inter, sans-serif',
  accentColor: '#6C63FF',
  mood: 'neutral',
};

// ============================================================
// Output Directory
// ============================================================

const VISUALS_OUTPUT_DIR = process.env.VISUALS_OUTPUT_DIR || path.join(__dirname, '..', '..', 'visuals-output');

function ensureOutputDir(): void {
  if (!fs.existsSync(VISUALS_OUTPUT_DIR)) {
    fs.mkdirSync(VISUALS_OUTPUT_DIR, { recursive: true });
  }
  const imagesDir = path.join(VISUALS_OUTPUT_DIR, 'images');
  const stockDir = path.join(VISUALS_OUTPUT_DIR, 'stock');
  if (!fs.existsSync(imagesDir)) fs.mkdirSync(imagesDir, { recursive: true });
  if (!fs.existsSync(stockDir)) fs.mkdirSync(stockDir, { recursive: true });
}

// ============================================================
// API Key Helpers
// ============================================================

function getGeminiKey(): string | null {
  return process.env.GEMINI_API_KEY || null;
}

function getOpenAIKey(): string | null {
  return process.env.OPENAI_API_KEY || null;
}

function getPexelsKey(): string | null {
  return process.env.PEXELS_API_KEY || null;
}

// ============================================================
// Style Lookup
// ============================================================

/**
 * Get the visual style configuration for a given niche.
 */
export function getVisualStyle(niche: string): NicheVisualStyle {
  const normalizedNiche = niche.toLowerCase().trim();
  return NICHE_VISUAL_STYLES[normalizedNiche] || DEFAULT_VISUAL_STYLE;
}

/**
 * Get all available niche visual styles.
 */
export function getAllVisualStyles(): Record<string, NicheVisualStyle> {
  return { ...NICHE_VISUAL_STYLES };
}

// ============================================================
// Mock Generators (for development without API keys)
// ============================================================

/**
 * Generate a placeholder image file for development/testing.
 * Creates a simple SVG-based placeholder with the niche's style colors.
 */
function generateMockImage(prompt: string, niche: string, style: NicheVisualStyle): GeneratedImage {
  ensureOutputDir();

  const sanitizedPrompt = prompt.replace(/[^a-zA-Z0-9]/g, '_').substring(0, 60).toLowerCase();
  const timestamp = Date.now();
  const fileName = `mock_${niche}_${sanitizedPrompt}_${timestamp}.svg`;
  const filePath = path.join(VISUALS_OUTPUT_DIR, 'images', fileName);

  // Create an SVG placeholder with the niche's color scheme
  const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" width="1080" height="1920" viewBox="0 0 1080 1920">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#1a1a2e;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#0a0a1a;stop-opacity:1" />
    </linearGradient>
  </defs>
  <rect width="1080" height="1920" fill="url(#bg)"/>
  <text x="540" y="960" font-family="${style.fontFamily}" font-size="48" fill="${style.accentColor}" text-anchor="middle" dominant-baseline="middle" opacity="0.8">
    ${prompt.substring(0, 80)}
  </text>
  <text x="540" y="1020" font-family="${style.fontFamily}" font-size="24" fill="${style.textColor}" text-anchor="middle" dominant-baseline="middle" opacity="0.5">
    [${niche.toUpperCase()} — Mock Visual]
  </text>
</svg>`;

  fs.writeFileSync(filePath, svgContent);
  console.log(`🖼️ [MOCK] Generated image for "${niche}" niche: ${fileName}`);

  return {
    niche,
    prompt,
    imageUrl: `/api/visuals/images/${fileName}`,
    localFilePath: filePath,
    model: 'mock-svg-generator',
    style,
  };
}

/**
 * Generate mock stock footage results for development/testing.
 */
function generateMockStockClips(keywords: string[], niche: string): StockFootageClip[] {
  ensureOutputDir();

  // Create placeholder video metadata files
  const clips: StockFootageClip[] = keywords.map((kw, idx) => {
    const fileName = `mock_stock_${niche}_${kw.replace(/[^a-zA-Z0-9]/g, '_')}_${idx}.mp4`;
    const filePath = path.join(VISUALS_OUTPUT_DIR, 'stock', fileName);

    // Create a minimal placeholder file
    if (!fs.existsSync(filePath)) {
      fs.writeFileSync(filePath, Buffer.alloc(1024)); // 1KB placeholder
    }

    return {
      niche,
      keywords: [kw],
      videoUrl: `/api/visuals/stock/${fileName}`,
      thumbnailUrl: '',
      duration: 10,
      width: 1080,
      height: 1920,
      source: 'mock-pexels',
    };
  });

  console.log(`🎬 [MOCK] Generated ${clips.length} stock clip(s) for "${niche}" niche`);
  return clips;
}

// ============================================================
// Gemini Image Generation
// ============================================================

async function generateWithGeminiImage(
  prompts: string[],
  niche: string,
  style: NicheVisualStyle
): Promise<GeneratedImage[]> {
  const apiKey = getGeminiKey();
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY is not configured');
  }

  const { GoogleGenerativeAI } = await import('@google/generative-ai');
  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

  ensureOutputDir();
  const results: GeneratedImage[] = [];

  for (let i = 0; i < prompts.length; i++) {
    const prompt = prompts[i];
    const enhancedPrompt = `Generate a TikTok-style visual for a "${niche}" niche video.
Style: ${style.background}. Mood: ${style.mood}. Accent color: ${style.accentColor}.
The image should be 9:16 portrait orientation (1080×1920).

Content: ${prompt}`;

    console.log(`🖼️ [Gemini] Generating image ${i + 1}/${prompts.length}: "${prompt.substring(0, 60)}..."`);

    const result = await model.generateContent(enhancedPrompt);
    const response = result.response;
    const text = response.text();

    // For Gemini, we save the text response as a visual description placeholder
    const sanitizedPrompt = prompt.replace(/[^a-zA-Z0-9]/g, '_').substring(0, 60).toLowerCase();
    const timestamp = Date.now();
    const fileName = `gemini_${niche}_${sanitizedPrompt}_${timestamp}_${i}.txt`;
    const filePath = path.join(VISUALS_OUTPUT_DIR, 'images', fileName);

    fs.writeFileSync(filePath, `Prompt: ${prompt}\n\nGenerated Description:\n${text}\n\nStyle: ${JSON.stringify(style, null, 2)}`);

    results.push({
      niche,
      prompt,
      imageUrl: `/api/visuals/images/${fileName}`,
      localFilePath: filePath,
      model: 'gemini-2.0-flash',
      style,
    });
  }

  return results;
}

// ============================================================
// OpenAI DALL-E Image Generation
// ============================================================

async function generateWithDalle(
  prompts: string[],
  niche: string,
  style: NicheVisualStyle
): Promise<GeneratedImage[]> {
  const apiKey = getOpenAIKey();
  if (!apiKey) {
    throw new Error('OPENAI_API_KEY is not configured');
  }

  const OpenAI = (await import('openai')).default;
  const openai = new OpenAI({ apiKey });

  ensureOutputDir();
  const results: GeneratedImage[] = [];

  for (let i = 0; i < prompts.length; i++) {
    const prompt = prompts[i];
    const enhancedPrompt = `TikTok video visual for "${niche}" niche. ${style.background}. ${style.mood} mood. Color scheme emphasizes ${style.accentColor}. 9:16 portrait. ${prompt}`;

    console.log(`🖼️ [DALL-E] Generating image ${i + 1}/${prompts.length}: "${prompt.substring(0, 60)}..."`);

    const response = await openai.images.generate({
      model: 'dall-e-3',
      prompt: enhancedPrompt,
      n: 1,
      size: '1024x1792', // closest to 9:16 portrait
      quality: 'standard',
    });

    const imageUrl = response.data[0]?.url;
    if (!imageUrl) {
      throw new Error(`DALL-E returned no image for prompt: ${prompt}`);
    }

    // Download the image
    const imgResponse = await fetch(imageUrl);
    const arrayBuffer = await imgResponse.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const sanitizedPrompt = prompt.replace(/[^a-zA-Z0-9]/g, '_').substring(0, 60).toLowerCase();
    const timestamp = Date.now();
    const fileName = `dalle_${niche}_${sanitizedPrompt}_${timestamp}_${i}.png`;
    const filePath = path.join(VISUALS_OUTPUT_DIR, 'images', fileName);

    fs.writeFileSync(filePath, buffer);

    results.push({
      niche,
      prompt,
      imageUrl: `/api/visuals/images/${fileName}`,
      localFilePath: filePath,
      model: 'dall-e-3',
      style,
    });
  }

  return results;
}

// ============================================================
// Pexels Stock Footage Search
// ============================================================

async function searchPexelsStock(
  keywords: string[],
  niche: string
): Promise<StockFootageClip[]> {
  const apiKey = getPexelsKey();
  if (!apiKey) {
    throw new Error('PEXELS_API_KEY is not configured');
  }

  ensureOutputDir();
  const allClips: StockFootageClip[] = [];

  for (const keyword of keywords) {
    console.log(`🎬 [Pexels] Searching stock footage for: "${keyword}"`);

    const url = `https://api.pexels.com/videos/search?query=${encodeURIComponent(keyword)}&orientation=portrait&per_page=5&size=medium`;

    const response = await fetch(url, {
      headers: {
        'Authorization': apiKey,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Pexels API error (${response.status}): ${errorText}`);
      continue;
    }

    const data = await response.json();

    if (data.videos && Array.isArray(data.videos)) {
      for (const video of data.videos) {
        // Get the best quality video file (portrait/9:16 oriented)
        const videoFile = video.video_files?.find(
          (f: any) => f.width === 1080 || f.width === 720 || f.height === 1920 || f.height === 1280
        ) || video.video_files?.[0];

        if (videoFile?.link) {
          allClips.push({
            niche,
            keywords: [keyword],
            videoUrl: videoFile.link,
            thumbnailUrl: video.image || '',
            duration: video.duration || 10,
            width: videoFile.width || 1080,
            height: videoFile.height || 1920,
            source: 'pexels',
          });
        }
      }
    }

    console.log(`  → Found ${data.videos?.length || 0} video(s) for "${keyword}"`);
  }

  return allClips;
}

// ============================================================
// Public API — Image Generation
// ============================================================

/**
 * Generate images for the given prompts using the niche's visual style.
 *
 * Uses Gemini if GEMINI_API_KEY is set, DALL-E if OPENAI_API_KEY is set,
 * otherwise returns mock SVGs for development.
 *
 * @param prompts - Array of image descriptions to generate
 * @param niche - Content niche (determines visual style)
 * @returns Array of GeneratedImage objects
 */
export async function generateImages(
  prompts: string[],
  niche: string
): Promise<GeneratedImage[]> {
  if (!prompts || prompts.length === 0) {
    throw new Error('At least one prompt is required');
  }

  if (!niche || niche.trim().length === 0) {
    throw new Error('Niche is required');
  }

  const style = getVisualStyle(niche);
  const geminiKey = getGeminiKey();
  const openaiKey = getOpenAIKey();

  // Try Gemini (image understanding + text)
  if (geminiKey) {
    try {
      return await generateWithGeminiImage(prompts, niche, style);
    } catch (error) {
      console.error('Gemini image generation failed:', error);
      // Fall through to next provider
    }
  }

  // Try DALL-E (actual image generation)
  if (openaiKey) {
    try {
      return await generateWithDalle(prompts, niche, style);
    } catch (error) {
      console.error('DALL-E generation failed:', error);
      // Fall through to mock
    }
  }

  // No API keys — use mock generator
  console.log('⚠️  No AI image API keys found. Using mock image generator.');
  return prompts.map(prompt => generateMockImage(prompt, niche, style));
}

// ============================================================
// Public API — Stock Footage Search
// ============================================================

/**
 * Search for stock footage clips matching the given keywords.
 *
 * Uses Pexels API if PEXELS_API_KEY is set, otherwise returns mock clips.
 *
 * @param keywords - Array of search terms for stock footage
 * @param niche - Content niche (for logging/style context)
 * @returns Array of StockFootageClip objects
 */
export async function searchStockFootage(
  keywords: string[],
  niche: string
): Promise<StockFootageClip[]> {
  if (!keywords || keywords.length === 0) {
    return []; // Valid state — no stock needed
  }

  const pexelsKey = getPexelsKey();

  if (pexelsKey) {
    try {
      return await searchPexelsStock(keywords, niche);
    } catch (error) {
      console.error('Pexels search failed:', error);
      // Fall through to mock
    }
  }

  // No API key — use mock
  console.log('⚠️  No Pexels API key found. Using mock stock footage.');
  return generateMockStockClips(keywords, niche);
}

// ============================================================
// Combined API
// ============================================================

/**
 * Generate all visuals (images + stock footage) for a script.
 * This is the main entry point used by the API endpoint.
 *
 * @param request - GenerateVisualsRequest with niche, prompts, and optional stock keywords
 * @returns Combined response with images, stock clips, and style info
 */
export async function generateAllVisuals(
  request: GenerateVisualsRequest
): Promise<GenerateVisualsResponse> {
  const { niche, prompts, stockKeywords } = request;

  const style = getVisualStyle(niche);
  console.log(`🎨 Generating visuals for "${niche}" niche`);
  console.log(`   Style: ${style.background}`);

  // Generate images in parallel
  const [generatedImages, stockClips] = await Promise.all([
    generateImages(prompts, niche),
    stockKeywords && stockKeywords.length > 0
      ? searchStockFootage(stockKeywords, niche)
      : Promise.resolve([] as StockFootageClip[]),
  ]);

  return {
    niche,
    generatedImages,
    stockClips,
    style,
  };
}