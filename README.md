# TikAuto 🚀

**Automated TikTok Monetization Platform**

TikAuto simplifies making money on TikTok by automating the creation and management of "faceless" niche accounts. Our platform uses AI to generate viral scripts, high-quality voiceovers, and curated visuals — allowing users to scale multiple accounts and maximize earnings from the TikTok Creator Rewards Program.

## Project Structure

```
tikauto/
├── frontend/                    # Vite + React (UI dashboard)
│   ├── src/
│   │   ├── pages/
│   │   │   └── Dashboard.tsx    # Main content management dashboard
│   │   ├── components/
│   │   │   ├── NicheSelector.tsx      # Niche picker (Psych/Finance/Relationships)
│   │   │   ├── GenerationForm.tsx     # Topic input & generation trigger
│   │   │   ├── ScriptPreview.tsx      # Script preview with sections
│   │   │   ├── AudioPlayer.tsx        # Voiceover audio player
│   │   │   └── ContentHistory.tsx     # Generation history table
│   │   ├── services/
│   │   │   └── api.ts            # Typed API client
│   │   ├── App.tsx
│   │   └── index.css
│   ├── package.json
│   └── vite.config.ts
│
├── backend/                     # Express + TypeScript (API server)
│   ├── src/
│   │   ├── index.ts             # Express server entry point (port 3001)
│   │   └── services/
│   │       ├── ai.service.ts           # AI script generation (Gemini → OpenAI → Mock)
│   │       ├── prompt-templates.ts     # Niche-specific system prompts
│   │       ├── voice.service.ts        # ElevenLabs TTS voiceover
│   │       ├── visual.service.ts       # Image/visual asset generation
│   │       ├── video.service.ts        # FFmpeg video assembly with text overlays
│   │       ├── hook-library.service.ts # Viral hooks & CTAs with rotation
│   │       └── database.service.ts     # SQLite persistence (WAL mode)
│   ├── package.json
│   └── tsconfig.json
│
├── docs/                        # Research & strategy documentation
│   ├── niche_research.md        # In-depth niche analysis
│   ├── topic_bank.md            # 150+ topics across niches
│   ├── hook_library.md          # 67 hooks & 35 CTAs
│   └── metadata_strategy.md     # Virality metadata strategy
│
├── package.json                 # Root workspace scripts
├── .env.example                 # Environment variables template
├── .gitignore                   # Generated assets & node_modules
└── README.md
```

## Target Niches

| Niche | Voice | Style | Topics |
|-------|-------|-------|--------|
| 🧠 **Psychology & Human Behavior** | Rachel (warm female) | Dark teal, neon cyan, clean sans | Cognitive biases, dark psychology, body language |
| 💰 **Wealth & Financial Literacy** | Antoni (energetic male) | Dark gold, amber, bold sans | Money mindset, investing, side hustles |
| ❤️ **Relationships & Social Dynamics** | Bella (clear female) | Deep mauve, warm white, serif | Attachment theory, communication, dating |

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/generate-script` | Generate AI script (niche + topic) |
| `POST` | `/api/generate-voiceover` | Generate TTS voiceover from script |
| `POST` | `/api/generate-visuals` | Generate visual assets for a video |
| `POST` | `/api/generate-video` | Full pipeline: script + voiceover + visuals |
| `POST` | `/api/assemble-video` | Assemble video with hook + CTA integration |
| `GET` | `/api/hooks?niche=` | List viral hooks for a niche |
| `GET` | `/api/ctas?niche=` | List CTAs for a niche |
| `GET` | `/api/hooks/select?niche=` | Auto-select hook + CTA with rotation |
| `GET` | `/api/voices` | List available voices per niche |
| `GET` | `/api/video-styles` | List niche video styling configs |
| `GET` | `/api/visual-styles` | List niche visual asset styling |
| `GET` | `/api/history` | Get generation history |
| `GET` | `/api/history/:id` | Get single generation details |
| `PUT` | `/api/history/:id/metadata` | Update caption, hashtags, description |
| `GET` | `/api/audio/:filename` | Serve generated audio files |
| `GET` | `/api/visuals/:filename` | Serve generated visual assets |
| `GET` | `/api/video/:filename` | Serve generated video files |

## Getting Started

```bash
# 1. Clone the repository
git clone https://github.com/RealWoman56/refactored-carnival.git
cd refactored-carnival

# 2. Install dependencies
npm install
cd frontend && npm install
cd ../backend && npm install
cd ..

# 3. Configure environment variables
cp .env.example .env
# Edit .env with your API keys:
#   GEMINI_API_KEY=your_key     # For AI script generation
#   ELEVENLABS_API_KEY=your_key # For voiceover generation
#   PEXELS_API_KEY=your_key     # For stock footage

# 4. Run both frontend and backend in development mode
npm run dev

# Or run individually:
npm run dev:frontend   # Vite dev server (port 5173)
npm run dev:backend    # Express server (port 3001)
```

## Features

- ✅ **AI Script Generation** — Viral scripts with hook-body-CTA structure
- ✅ **Voiceover Synthesis** — ElevenLabs TTS with niche-specific voices
- ✅ **Visual Asset Curation** — AI-generated imagery per niche style
- ✅ **Video Assembly** — FFmpeg-powered 9:16 portrait videos with text overlays
- ✅ **Viral Hook Library** — 67 hooks, 35 CTAs with intelligent rotation
- ✅ **Content Dashboard** — Manage all generations from one interface
- ✅ **History Persistence** — SQLite database tracking every generated asset
- ✅ **3 Production Niches** — Psychology, Finance, Relationships
- 🔄 **Multi-Account Management** — (Coming soon)
- 🔄 **Auto-Posting & Scheduling** — (Coming soon)

## Tech Stack

- **Frontend**: React 19 + Vite + TypeScript
- **Backend**: Express + TypeScript (tsx)
- **AI Providers**: Gemini API / OpenAI API (with mock fallback)
- **Voice**: ElevenLabs TTS API
- **Video**: FFmpeg (drawtext filter for overlays)
- **Database**: SQLite (better-sqlite3, WAL mode)
- **Conventions**: ESModules, async/await, clean separation of concerns

## Revenue Model

| Plan | Price | Videos/Month | Accounts |
|------|-------|-------------|----------|
| Starter | $29/mo | 15 | 1 |
| Pro | $59/mo | 60 | 5 |
| Enterprise | $149/mo | Unlimited | 20+ |

---

Built by team **TikAuto** 🚀
