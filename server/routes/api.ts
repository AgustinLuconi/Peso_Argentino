import { Router } from 'express';
import { DolarService } from '../services/DolarService';
import { MacroService } from '../services/MacroService';
import { RatesService } from '../services/RatesService';
import { PoliticalService } from '../services/PoliticalService';

export const apiRouter = Router();

// Health Check
apiRouter.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'Peso Argentino Backend API',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
});

// 1. Dólar & Cotizaciones Spot
apiRouter.get('/dolar/quotes', async (req, res) => {
  try {
    const quotes = await DolarService.getQuotes();
    res.json({ success: true, count: quotes.length, data: quotes });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// 2. Macro (Riesgo País, IPC, Índices de Contratos UVA/ICL/CER)
apiRouter.get('/macro/riesgo-pais', async (req, res) => {
  try {
    const data = await MacroService.getRiesgoPais();
    res.json({ success: true, data });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

apiRouter.get('/macro/ipc', async (req, res) => {
  try {
    const data = await MacroService.getIpc();
    res.json({ success: true, data });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

apiRouter.get('/macro/contracts', async (req, res) => {
  try {
    const data = await MacroService.getContractIndicators();
    res.json({ success: true, data });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// 3. Tasas de Interés (Plazo Fijo Bancos & Billeteras Virtuales)
apiRouter.get('/rates/plazos-fijos', async (req, res) => {
  try {
    const data = await RatesService.getPlazosFijos();
    res.json({ success: true, count: data.length, data });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

apiRouter.get('/rates/wallets', async (req, res) => {
  try {
    const data = await RatesService.getWalletYields();
    res.json({ success: true, count: data.length, data });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// 4. Político & Diputados
apiRouter.get('/political/diputados', async (req, res) => {
  try {
    const data = await PoliticalService.getDeputies();
    res.json({ success: true, count: data.length, data });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});
