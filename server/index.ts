import fs from 'fs';
import path from 'path';
import express from 'express';
import cors from 'cors';
import { v1Router } from './src/routes';
import { SyncWorker } from './src/jobs/SyncWorker';
import { DatabaseMigrations } from './src/core/database/DatabaseMigrations';
import { DatabaseConnection } from './src/core/database/DatabaseConnection';

// Load .env file into process.env if present
try {
  const envPath = path.resolve(process.cwd(), '.env');
  if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf-8');
    envContent.split('\n').forEach((line) => {
      const trimmed = line.trim();
      if (trimmed && !trimmed.startsWith('#')) {
        const [key, ...rest] = trimmed.split('=');
        if (key && rest.length > 0) {
          const val = rest.join('=').trim();
          process.env[key.trim()] = val;
        }
      }
    });
  }
} catch {
  // Ignored in environments where process.env is preloaded
}

// 1. Initialize SQLite Database & Run Migrations
DatabaseMigrations.runMigrations();

const app = express();
const PORT = process.env.PORT || 3001;

// CORS & Body parser
app.use(
  cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  })
);
app.use(express.json());

// Request logging middleware
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(`[${req.method}] ${req.originalUrl} -> ${res.statusCode} (${duration}ms)`);
  });
  next();
});

// API Routes
app.use('/api/v1', v1Router);
app.use('/api', v1Router); // Alias for convenience

// 404 handler
app.use((req, res) => {
  res.status(404).json({ success: false, error: 'Endpoint no encontrado en Peso Argentino API' });
});

const server = app.listen(PORT, () => {
  console.log(`\n================================================================`);
  console.log(`🚀 Peso Argentino Backend API activo en: http://localhost:${PORT}`);
  console.log(`📡 Ingesta Pública: DolarApi + ArgentinaDatos + Argly`);
  console.log(`🗄️ Base de Datos: SQLite (WAL Mode) en ${DatabaseConnection.getDbPath()}`);
  console.log(`⚡ Caché en memoria de alta velocidad & Background Sync Worker`);
  console.log(`🤖 Motor IA: ${process.env.GEMINI_API_KEY ? 'Google Gemini Flash Lite Free' : 'Local Financial NLP Engine'}`);
  console.log(`================================================================\n`);

  // Start background periodic sync worker
  SyncWorker.start();
});

// Graceful shutdown
const shutdown = () => {
  SyncWorker.stop();
  DatabaseConnection.close();
  server.close(() => {
    console.log('Servidor backend y base de datos detenidos correctamente.');
    process.exit(0);
  });
};

process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);
