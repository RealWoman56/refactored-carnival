/**
 * Database Service — SQLite Persistence Layer
 *
 * Manages a local tikauto.db SQLite database for persisting
 * content generation history (scripts, voiceovers, visuals, videos).
 */

import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';

// --- Database Initialization ---

const DB_DIR = process.env.DB_DIR || path.join(__dirname, '..', '..');
const DB_PATH = path.join(DB_DIR, 'tikauto.db');

let db: Database.Database;

function getDb(): Database.Database {
  if (!db) {
    // Ensure the directory exists
    const dir = path.dirname(DB_PATH);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    db = new Database(DB_PATH);
    db.pragma('journal_mode = WAL'); // Better concurrent performance
    db.pragma('foreign_keys = ON');
    initializeSchema();
  }
  return db;
}

function initializeSchema(): void {
  db.exec(`
    CREATE TABLE IF NOT EXISTS generations (
      id TEXT PRIMARY KEY,
      niche TEXT NOT NULL,
      topic TEXT NOT NULL,
      script_data TEXT,          -- JSON: GeneratedScript
      audio_url TEXT,            -- Path to generated audio file
      audio_metadata TEXT,       -- JSON: VoiceoverResult metadata
      visual_data TEXT,          -- JSON: Visual assets (future)
      video_url TEXT,            -- Path to final video (future)
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );
  `);

  // Create index for faster history queries
  db.exec(`
    CREATE INDEX IF NOT EXISTS idx_generations_created_at
    ON generations(created_at DESC);
  `);
}

// --- Types ---

export interface GenerationRecord {
  id: string;
  niche: string;
  topic: string;
  script_data: string | null;
  audio_url: string | null;
  audio_metadata: string | null;
  visual_data: string | null;
  video_url: string | null;
  created_at: string;
}

export interface GenerationSummary {
  id: string;
  niche: string;
  topic: string;
  created_at: string;
  hasScript: boolean;
  hasAudio: boolean;
  hasVideo: boolean;
}

// --- CRUD Operations ---

/**
 * Create a new generation record and return its ID.
 */
export function createGeneration(
  niche: string,
  topic: string
): string {
  const database = getDb();
  const { v4: uuidv4 } = require('uuid');
  const id = uuidv4();

  const stmt = database.prepare(`
    INSERT INTO generations (id, niche, topic)
    VALUES (?, ?, ?)
  `);
  stmt.run(id, niche, topic);

  console.log(`📦 Database: Created generation record ${id} (${niche}: ${topic})`);
  return id;
}

/**
 * Save script data to an existing generation record.
 */
export function saveScriptData(
  id: string,
  scriptData: object
): void {
  const database = getDb();
  const stmt = database.prepare(`
    UPDATE generations SET script_data = ? WHERE id = ?
  `);
  stmt.run(JSON.stringify(scriptData), id);
  console.log(`📦 Database: Saved script data for generation ${id}`);
}

/**
 * Save audio data to an existing generation record.
 */
export function saveAudioData(
  id: string,
  audioUrl: string,
  audioMetadata: object
): void {
  const database = getDb();
  const stmt = database.prepare(`
    UPDATE generations SET audio_url = ?, audio_metadata = ? WHERE id = ?
  `);
  stmt.run(audioUrl, JSON.stringify(audioMetadata), id);
  console.log(`📦 Database: Saved audio data for generation ${id}`);
}

/**
 * Save visual data to an existing generation record (for future use).
 */
export function saveVisualData(
  id: string,
  visualData: object
): void {
  const database = getDb();
  const stmt = database.prepare(`
    UPDATE generations SET visual_data = ? WHERE id = ?
  `);
  stmt.run(JSON.stringify(visualData), id);
  console.log(`📦 Database: Saved visual data for generation ${id}`);
}

/**
 * Save video URL to an existing generation record (for future use).
 */
export function saveVideoUrl(
  id: string,
  videoUrl: string
): void {
  const database = getDb();
  const stmt = database.prepare(`
    UPDATE generations SET video_url = ? WHERE id = ?
  `);
  stmt.run(videoUrl, id);
  console.log(`📦 Database: Saved video URL for generation ${id}`);
}

/**
 * Get all generation records, ordered by most recent first.
 */
export function getHistory(limit: number = 50, offset: number = 0): GenerationSummary[] {
  const database = getDb();
  const stmt = database.prepare(`
    SELECT
      id,
      niche,
      topic,
      created_at,
      CASE WHEN script_data IS NOT NULL THEN 1 ELSE 0 END as hasScript,
      CASE WHEN audio_url IS NOT NULL THEN 1 ELSE 0 END as hasAudio,
      CASE WHEN video_url IS NOT NULL THEN 1 ELSE 0 END as hasVideo
    FROM generations
    ORDER BY created_at DESC
    LIMIT ? OFFSET ?
  `);
  return stmt.all(limit, offset) as GenerationSummary[];
}

/**
 * Get a single generation record by ID with full data.
 */
export function getGenerationById(id: string): GenerationRecord | undefined {
  const database = getDb();
  const stmt = database.prepare(`
    SELECT * FROM generations WHERE id = ?
  `);
  return stmt.get(id) as GenerationRecord | undefined;
}

/**
 * Get total count of generations.
 */
export function getGenerationCount(): number {
  const database = getDb();
  const row = database.prepare('SELECT COUNT(*) as count FROM generations').get() as { count: number };
  return row.count;
}

/**
 * Close the database connection (for graceful shutdown).
 */
export function closeDatabase(): void {
  if (db) {
    db.close();
    console.log('📦 Database: Connection closed');
  }
}