import express from 'express';
import cors from 'cors';

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

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 TikAuto backend running on http://0.0.0.0:${PORT}`);
  console.log(`   Health: http://0.0.0.0:${PORT}/api/health`);
});