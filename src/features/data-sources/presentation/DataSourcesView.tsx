import React, { useState } from 'react';
import { Card } from '@core/ui/components/Card';
import { Badge } from '@core/ui/components/Badge';
import { Button } from '@core/ui/components/Button';
import { PageHeader } from '@core/ui/components/PageHeader';
import { smartCache, CACHE_TTL } from '@core/infrastructure/SmartCacheAdapter';
import {
  Database,
  Trash2,
  CheckCircle2,
  Server,
  Zap,
  ShieldCheck,
  Activity,
  Layers,
} from 'lucide-react';

import { API_CONFIG } from '@core/config/api.config';

interface DataSourceItem {
  id: string;
  name: string;
  provider: string;
  type: string;
  endpoint: string;
  updateFrequency: string;
  cacheTtlFormatted: string;
  ttlMs: number;
  status: 'online' | 'degraded' | 'cached';
  latency: string;
  description: string;
}

export const DataSourcesView: React.FC = () => {
  const [cacheStats, setCacheStats] = useState(smartCache.getStats());
  const [clearing, setClearing] = useState(false);
  const [testingApi, setTestingApi] = useState(false);
  const [testResult, setTestResult] = useState<string | null>(null);

  const sources: DataSourceItem[] = [
    {
      id: 'dolarapi',
      name: 'Mercado Cambiario Spot & Dólar',
      provider: 'DolarApi.com / BNA / Ámbito',
      type: 'REST JSON / SSL',
      endpoint: 'https://dolarapi.com/v1/dolares',
      updateFrequency: 'Tiempo Real (Continuo)',
      cacheTtlFormatted: '30 Segundos',
      ttlMs: CACHE_TTL.DOLLAR_SPOT,
      status: 'online',
      latency: '120 ms',
      description:
        'Cotizaciones oficiales, blue, MEP, CCL, Tarjeta, Mayorista y Dólar Cripto USDT/ARS con spread calculado automáticamente.',
    },
    {
      id: 'argentinadatos',
      name: 'Riesgo País & Tasas de 32 Entidades Bancarias',
      provider: 'ArgentinaDatos API Pública',
      type: 'REST JSON / SSL',
      endpoint: 'https://api.argentinadatos.com/v1/finanzas/tasas/plazoFijo',
      updateFrequency: 'Diario / Horario Bancario',
      cacheTtlFormatted: '1 Hora',
      ttlMs: CACHE_TTL.BCRA_RATES,
      status: 'online',
      latency: '140 ms',
      description:
        'Riesgo país JP Morgan EMBI+, tasas de plazo fijo de 32 bancos comerciales de la República Argentina y billeteras virtuales.',
    },
    {
      id: 'argly-api',
      name: 'Indicadores Macro, Contratos & Inflación',
      provider: 'Argly API Pública',
      type: 'REST JSON / SSL',
      endpoint: 'https://api.argly.com.ar/v1/indices/ipc',
      updateFrequency: 'Mensual / Publicación INDEC',
      cacheTtlFormatted: '1 Hora',
      ttlMs: CACHE_TTL.MACRO_SERIES,
      status: 'online',
      latency: '160 ms',
      description:
        'Índice de Precios al Consumidor (IPC), coeficientes UVA, ICL (alquileres), CER, SMVM y 257 diputados nacionales.',
    },
    {
      id: 'byma-nyse',
      name: 'Bolsas y Mercados Argentinos & Wall Street ADRs',
      provider: 'BYMA / Bolsar / NYSE / NASDAQ',
      type: 'Feed de Precios Financieros',
      endpoint: 'https://data.byma.com.ar / Markets Engine',
      updateFrequency: 'Horario bursátil 11:00 a 17:00 hs',
      cacheTtlFormatted: '1 Minuto',
      ttlMs: CACHE_TTL.MARKET_ASSETS,
      status: 'online',
      latency: '95 ms',
      description:
        'Acciones del Panel Líder Merval, ADRs en Nueva York (GGAL, YPF, BMA), Bonos soberanos en dólares (AL30, GD30) y curva de Letras del Tesoro (Lecaps).',
    },
    {
      id: 'bora-rigi',
      name: 'Boletín Oficial & Registro RIGI',
      provider: 'Secretaría Legal y Técnica (P.E.N.) & Min. Economía',
      type: 'Repositorio Normativo Oficial',
      endpoint: 'https://www.boletinoficial.gob.ar / Digesto',
      updateFrequency: 'Publicaciones extraordinarias / Diarias',
      cacheTtlFormatted: '12 Horas',
      ttlMs: CACHE_TTL.POLITICAL_LAWS,
      status: 'online',
      latency: '310 ms',
      description:
        'Leyes promulgadas por el Congreso (Ley Bases 27.742, Paquete Fiscal 27.743), DNU 70/2023 y proyectos de gran envergadura acogidos al RIGI.',
    },
    {
      id: 'news-intelligence',
      name: 'Intelligence Feed & Cables Financieros',
      provider: 'Google Gemini Flash Free + Financial NLP Engine',
      type: 'Inferencia IA 100% Gratuita',
      endpoint: API_CONFIG.getEndpoint('/api/v1/llm/classify'),
      updateFrequency: 'Tiempo real ante eventos clave',
      cacheTtlFormatted: '1 Hora',
      ttlMs: CACHE_TTL.NEWS_INTELLIGENCE,
      status: 'online',
      latency: '0 ms (Local)',
      description:
        'Cables de impacto crítico y alto, síntesis ejecutiva generada con IA, matriz de activos sensibles y análisis de mecanismos de transmisión monetaria.',
    },
  ];

  const handleClearCache = () => {
    setClearing(true);
    smartCache.clear();
    setTimeout(() => {
      setCacheStats(smartCache.getStats());
      setClearing(false);
    }, 400);
  };

  const handleTestConnectivity = async () => {
    setTestingApi(true);
    setTestResult(null);
    try {
      const startTime = performance.now();
      const res = await fetch(API_CONFIG.getEndpoint('/api/v1/health'));
      const latencyMs = Math.round(performance.now() - startTime);
      if (res.ok) {
        setTestResult(`Conexión exitosa a Backend Core API (${latencyMs}ms). Módulos sincronizados.`);
      } else {
        setTestResult(`Respuesta con código HTTP ${res.status}. Usando fallback en caché.`);
      }
    } catch {
      setTestResult('Sin conexión externa directa (Modo Offline Seguro con Caché Local activo).');
    } finally {
      setTestingApi(false);
    }
  };

  return (
    <div className="space-y-6 animate-page-enter">
      {/* Top Banner */}
      <PageHeader
        title="Arquitectura de Datos, Fuentes & Caché Estratificado"
        subtitle="Catálogo oficial de APIs de ingesta públicas y gratuitas, políticas de almacenamiento en memoria con TTL diferencial y resiliencia offline."
        icon={<Database size={22} className="text-emerald-500" />}
        actions={
          <>
            <Button
              variant="outline"
              size="sm"
              onClick={handleTestConnectivity}
              icon={<Zap size={14} className={testingApi ? 'animate-spin text-emerald-500' : ''} />}
            >
              {testingApi ? 'Verificando...' : 'Probar Conectividad'}
            </Button>
            <Button
              variant="danger"
              size="sm"
              onClick={handleClearCache}
              icon={<Trash2 size={14} />}
            >
              {clearing ? 'Purgando...' : 'Vaciar Caché'}
            </Button>
          </>
        }
      />

      {testResult && (
        <div className="p-3 bg-emerald-500/10 dark:bg-[#101e3d] border border-emerald-500/30 rounded-xl text-xs font-sans flex items-center gap-2 text-emerald-600 dark:text-emerald-400 animate-in fade-in">
          <CheckCircle2 size={16} className="text-emerald-500 shrink-0" />
          <span>{testResult}</span>
        </div>
      )}

      {/* Cache Metrics KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 bg-white dark:bg-[#081124] rounded-2xl border border-surface-container-highest dark:border-[#1a2744] shadow-soft flex items-center gap-3">
          <div className="p-3 bg-teal-50 dark:bg-teal-950/50 text-bullish-green rounded-xl">
            <Zap size={20} />
          </div>
          <div>
            <span className="font-eyebrow block">Tasa de Aciertos (Hit Ratio)</span>
            <span className="font-mono-tabular text-xl text-bullish-green font-bold">
              {cacheStats.hitRatio.toFixed(1)}%
            </span>
            <span className="text-[10px] text-outline block">Ahorro de consultas API</span>
          </div>
        </div>

        <div className="p-4 bg-white dark:bg-[#081124] rounded-2xl border border-surface-container-highest dark:border-[#1a2744] shadow-soft flex items-center gap-3">
          <div className="p-3 bg-primary text-gold rounded-xl">
            <Layers size={20} />
          </div>
          <div>
            <span className="font-eyebrow block">Peticiones Cacheadas</span>
            <span className="font-mono-tabular text-xl text-primary font-bold">
              {cacheStats.hits} hits
            </span>
            <span className="text-[10px] text-outline block">{cacheStats.misses} misses directos</span>
          </div>
        </div>

        <div className="p-4 bg-white dark:bg-[#081124] rounded-2xl border border-surface-container-highest dark:border-[#1a2744] shadow-soft flex items-center gap-3">
          <div className="p-3 bg-surface-container text-primary rounded-xl">
            <Server size={20} />
          </div>
          <div>
            <span className="font-eyebrow block">Entradas en Memoria</span>
            <span className="font-mono-tabular text-xl text-primary font-bold">
              {cacheStats.totalEntries} llaves
            </span>
            <span className="text-[10px] text-outline block">Sincronizadas en LocalStorage</span>
          </div>
        </div>

        <div className="p-4 bg-white dark:bg-[#081124] rounded-2xl border border-surface-container-highest dark:border-[#1a2744] shadow-soft flex items-center gap-3">
          <div className="p-3 bg-champagne-light dark:bg-[#101e3d] text-secondary rounded-xl">
            <ShieldCheck size={20} />
          </div>
          <div>
            <span className="font-eyebrow block">Resiliencia & Fallback</span>
            <span className="font-mono-tabular text-base text-secondary font-bold">
              Offline-First
            </span>
            <span className="text-[10px] text-outline block">Tolerancia a fallos de red</span>
          </div>
        </div>
      </div>

      {/* Strategy Explanation Card */}
      <Card variant="default" accent="gold" className="space-y-3">
        <div className="flex items-center gap-2 border-b border-surface-container-highest pb-2.5">
          <Activity size={18} className="text-gold" />
          <h2 className="font-h2 text-base sm:text-lg">
            Estrategia de Caché Estratificado por Volatilidad
          </h2>
        </div>
        <p className="font-subtitle text-xs leading-relaxed">
          Para evitar sobrecargar los servidores y bases de datos con llamadas redundantes, la aplicación aplica un sistema de <strong>Time-To-Live (TTL) diferencial</strong>. Los datos volátiles como el dólar spot se actualizan cada 30 segundos, mientras que las series históricas o las normativas legales se conservan en caché durante horas.
        </p>
      </Card>

      {/* Sources Grid */}
      <div className="space-y-3">
        <h2 className="font-h2 text-base">
          Catálogo Detallado de Fuentes & Endpoints
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {sources.map((source) => (
            <div
              key={source.id}
              className="p-5 bg-white dark:bg-[#081124] border border-surface-container-highest dark:border-[#1a2744] rounded-2xl shadow-soft hover:border-gold/60 transition-all duration-200 flex flex-col justify-between space-y-4 group"
            >
              <div className="space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <span className="font-sans font-bold text-sm text-primary group-hover:text-gold transition-colors">
                    {source.name}
                  </span>
                  <Badge variant="bullish" size="sm">
                    {source.status.toUpperCase()}
                  </Badge>
                </div>

                <span className="font-eyebrow text-outline block">
                  Proveedor: {source.provider}
                </span>

                <p className="text-xs font-sans text-on-surface-variant leading-relaxed">
                  {source.description}
                </p>
              </div>

              {/* Technical specs box */}
              <div className="p-3 bg-surface-container-low dark:bg-[#0c1730] rounded-xl border border-surface-container-high dark:border-[#1a2744] space-y-1.5 text-[11px] font-sans">
                <div className="flex justify-between items-center">
                  <span className="text-outline">Frecuencia:</span>
                  <span className="font-semibold text-primary">{source.updateFrequency}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-outline">TTL Caché:</span>
                  <span className="font-mono-tabular font-bold text-secondary">{source.cacheTtlFormatted}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-outline">Latencia Media:</span>
                  <span className="font-mono-tabular text-bullish-green">{source.latency}</span>
                </div>
                <div className="pt-1 border-t border-surface-container-high dark:border-[#1a2744] truncate font-mono text-[10px] text-outline">
                  {source.endpoint}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
