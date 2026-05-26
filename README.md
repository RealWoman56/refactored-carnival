# TikAuto 🚀

**Automated TikTok Monetization**

TikAuto simplifies making money on TikTok by automating the creation and management of "faceless" niche accounts. Our platform uses AI to generate viral scripts, high-quality voiceovers, and curated visuals — allowing users to scale multiple accounts and maximize earnings from the TikTok Creator Rewards Program.

## Project Structure

```
tikauto/
├── frontend/         # Vite + React (UI dashboard)
├── backend/          # Express + TypeScript (API server)
├── package.json      # Root workspace config
├── .env.example      # Environment variables template
└── README.md
```

## Getting Started

```bash
# Install dependencies
npm install
cd frontend && npm install
cd ../backend && npm install
cd ..

# Run both frontend and backend in development mode
npm run dev

# Or run individually:
npm run dev:frontend  # Vite dev server (port 5173)
npm run dev:backend   # Express server (port 3001)
```

## Features (planned)

- 🎬 AI-powered script generation for viral TikTok content
- 🎙️ High-quality AI voiceovers
- 🖼️ Automatic visual curation and video assembly
- 📊 Multi-account management dashboard
- 📈 Analytics and performance tracking
- 🤖 Auto-posting and scheduling

## Tech Stack

- **Frontend**: React + Vite + TypeScript
- **Backend**: Express + TypeScript
- **AI**: Gemini API / OpenAI API integration
- **Database**: SQLite (dev) / PostgreSQL (prod)