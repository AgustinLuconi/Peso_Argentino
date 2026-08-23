import express from 'express';
import cors from 'cors';
import { v1Router } from './src/routes';
import { SyncWorker } from './src/jobs/SyncWorker';

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
  console.log(`⚡ Caché en memoria de alta velocidad & Background Sync Worker`);
  console.log(`================================================================\n`);

  // Start background periodic sync worker
  SyncWorker.start();
});

// Graceful shutdown
process.on('SIGTERM', () => {
  SyncWorker.stop();
  server.close(() => console.log('Servidor backend detenido correctamente'));
});
