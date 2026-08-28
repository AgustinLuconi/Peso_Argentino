import React, { useState } from 'react';
import { IntelligenceNews } from '../domain/IntelligenceNews';
import { Card } from '@core/ui/components/Card';
import { Badge } from '@core/ui/components/Badge';
import { Clock, TrendingUp, TrendingDown, Sparkles, ChevronDown, BookOpen, Cpu, RefreshCw, CheckCircle2 } from 'lucide-react';
import { LlmApiClient, LlmClassificationDto } from '../infrastructure/LlmApiClient';

export const NewsCard: React.FC<{
  news: IntelligenceNews;
  onSelect?: () => void;
}> = ({ news }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isClassifying, setIsClassifying] = useState(false);
  const [aiClassification, setAiClassification] = useState<LlmClassificationDto | null>(null);

  const impactConfig = {
    critico: { label: 'IMPACTO CRÍTICO', variant: 'navy' as const },
    alto: { label: 'ALTO IMPACTO', variant: 'gold' as const },
    moderado: { label: 'MODERADO', variant: 'neutral' as const },
  };

  const currentImpact = impactConfig[news.impactLevel];

  const handleClassifyWithAi = async () => {
    if (isClassifying) return;
    setIsClassifying(true);
    try {
      const result = await LlmApiClient.classifyNews(news.title, news.summary, news.source);
      if (result) {
        setAiClassification(result);
        setIsExpanded(true);
      }
    } finally {
      setIsClassifying(false);
    }
  };

  const getExtendedEditorialAnalysis = (id: string) => {
    switch (id) {
      case 'news-1':
        return {
          leadAnalysis: 'La eliminación de los pasivos remunerados y la absorción de liquidez a través de LEFIs ha neutralizado la emisión endógena del Banco Central, estabilizando la base monetaria amplia en términos reales.',
          transmissionChannel: 'Canal de transmisión: Tasa de interés de política monetaria en 32% TNA impacta directamente en las tasas pasivas de plazos fijos y en el costo de fondeo interbancario.',
          marketConsensus: 'Consenso de mercado: Las mesas de dinero proyectan continuidad en la compresión del spread soberano y estabilidad cambiaria mientras el ancla fiscal sostenga el superávit financiero.',
        };
      case 'news-2':
        return {
          leadAnalysis: 'El flujo de ingreso de divisas por exportaciones del complejo sojero y energético, combinado con las compras diarias del BCRA en el MULC, fortalece las reservas netas.',
          transmissionChannel: 'Canal de transmisión: Incremento de reservas brutas hacia la meta acordada con organismos multilaterales reduce la prima de riesgo de los bonos Globales (GD30/AL30).',
          marketConsensus: 'Consenso de mercado: Probabilidad de reingreso al mercado voluntario de crédito en 2025/2026 supeditado al levantamiento gradual de restricciones cambiarias.',
        };
      default:
        return {
          leadAnalysis: 'El monitoreo de variables de alta frecuencia confirma la correlación entre la disciplina fiscal y la reducción de las expectativas inflacionarias del Relevamiento de Expectativas de Mercado (REM).',
          transmissionChannel: 'Canal de transmisión: Ancla cambiaria mediante crawling peg al 2% mensual combinada con superávit primario.',
          marketConsensus: 'Consenso de mercado: Rebalanceo favorable de carteras hacia instrumentos en pesos a tasa fija (Lecaps) y títulos soberanos en moneda dura.',
        };
    }
  };

  const extended = getExtendedEditorialAnalysis(news.id);

  const activeSentiment = aiClassification ? aiClassification.sentiment : news.marketSentiment;

  return (
    <Card
      variant="default"
      accent={news.impactLevel === 'critico' ? 'gold' : 'none'}
      className={`space-y-3.5 transition-all duration-300 ${
        isExpanded ? 'border-gold shadow-lg' : 'hover:border-gold/60'
      }`}
    >
      {/* Top Metadata */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-surface-container-highest dark:border-[#1a2744] pb-2.5">
        <div className="flex items-center gap-1.5 flex-wrap">
          <Badge variant={currentImpact.variant} size="sm">
            {currentImpact.label}
          </Badge>
          {news.scope === 'internacional' ? (
            <span className="px-2 py-0.5 text-[10px] font-sans font-bold bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 rounded-full flex items-center gap-1">
              🌐 Wall Street
            </span>
          ) : (
            <span className="px-2 py-0.5 text-[10px] font-sans font-bold bg-gold/10 text-gold-dark dark:text-gold border border-gold/20 rounded-full flex items-center gap-1">
              🇦🇷 Local
            </span>
          )}
          <span className="font-eyebrow text-outline dark:text-slate-300 font-semibold">
            {news.source}
          </span>
          {aiClassification && (
            <span className="px-2 py-0.5 text-[10px] font-mono font-bold bg-gold/15 text-gold border border-gold/30 rounded-full flex items-center gap-1">
              <Sparkles size={11} /> IA 100% GRATIS
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 text-[11px] font-sans text-on-surface-variant">
            <Clock size={12} className="text-outline" />
            <span>{news.publishedAt}</span>
          </div>

          <button
            onClick={handleClassifyWithAi}
            disabled={isClassifying}
            className="px-2.5 py-1 text-[10px] font-sans font-bold text-primary bg-surface-container-low hover:bg-gold/10 hover:text-gold border border-surface-container-high hover:border-gold/40 rounded-lg flex items-center gap-1.5 transition-all shadow-soft"
            title="Clasificar con motor de Inteligencia Artificial gratuito"
          >
            {isClassifying ? (
              <>
                <RefreshCw size={11} className="animate-spin text-gold" />
                <span>Analizando...</span>
              </>
            ) : (
              <>
                <Cpu size={11} className="text-gold" />
                <span>Clasificar IA</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Title & Summary */}
      <div>
        <h3 className="font-sans font-bold text-base sm:text-lg text-primary group-hover:text-gold transition-colors leading-snug">
          {news.title}
        </h3>
        <p className="font-subtitle text-xs mt-1.5 leading-relaxed">
          {news.summary}
        </p>
      </div>

      {/* AI Key Takeaways Bullet Points */}
      <div className="p-3.5 bg-surface-container-low rounded-2xl border border-surface-container-high space-y-1.5 shadow-soft">
        <div className="flex items-center gap-1.5 font-eyebrow text-primary">
          <Sparkles size={13} className="text-gold" />
          <span>Puntos Clave Macroeconómicos:</span>
        </div>
        <ul className="text-xs font-sans text-on-surface space-y-1 pl-3.5 list-disc marker:text-gold">
          {news.keyTakeaways.map((point, idx) => (
            <li key={idx} className="leading-snug">
              {point}
            </li>
          ))}
        </ul>
      </div>

      {/* Expand / Collapse Button for Editorial Deep Dive */}
      <button
        onClick={() => setIsExpanded((prev) => !prev)}
        className="w-full px-3 py-2 bg-surface-container-low hover:bg-surface-container border border-surface-container-high rounded-xl text-xs font-sans font-bold text-primary flex items-center justify-between transition-colors select-none"
      >
        <div className="flex items-center gap-2">
          <BookOpen size={14} className="text-gold" />
          <span>{isExpanded ? 'Ocultar Análisis Extendido' : 'Leer Análisis & Contexto Regulatorio'}</span>
        </div>
        <ChevronDown
          size={14}
          className={`text-gold transition-transform duration-300 ${
            isExpanded ? 'rotate-180' : ''
          }`}
        />
      </button>

      {/* Expandable Editorial Deep-Dive Drawer */}
      {isExpanded && (
        <div className="p-4 bg-champagne-light/30 dark:bg-surface-container rounded-2xl border border-gold/40 text-xs font-sans space-y-2.5 animate-in fade-in slide-in-from-top-2 duration-200 shadow-soft">
          {aiClassification ? (
            <div className="space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-gold/20">
                <span className="font-eyebrow text-gold font-bold flex items-center gap-1.5">
                  <CheckCircle2 size={14} className="text-bullish-green" />
                  Clasificación IA: {aiClassification.provider}
                </span>
                <span className="font-mono text-[10px] text-outline">
                  Confianza: {(aiClassification.confidenceScore * 100).toFixed(0)}%
                </span>
              </div>
              <div className="space-y-1">
                <span className="font-eyebrow text-primary block">Resumen Ejecutivo IA:</span>
                <p className="text-on-surface leading-relaxed text-xs">{aiClassification.executiveSummary}</p>
              </div>
              <div className="space-y-1 pt-1.5 border-t border-gold/20">
                <span className="font-eyebrow text-primary block">Canal de Transmisión:</span>
                <p className="text-on-surface-variant leading-relaxed text-xs">{aiClassification.transmissionChannel}</p>
              </div>
              <div className="space-y-1 pt-1.5 border-t border-gold/20">
                <span className="font-eyebrow text-primary block">Consenso de Mercado:</span>
                <p className="text-on-surface-variant leading-relaxed text-xs">{aiClassification.marketConsensus}</p>
              </div>
            </div>
          ) : (
            <>
              <div className="space-y-1">
                <span className="font-eyebrow text-secondary font-bold block">
                  Marco de Política Económica:
                </span>
                <p className="text-on-surface leading-relaxed text-xs">
                  {extended.leadAnalysis}
                </p>
              </div>

              <div className="space-y-1 pt-1.5 border-t border-gold/20">
                <span className="font-eyebrow text-primary block">
                  Mecanismo de Transmisión Financiera:
                </span>
                <p className="text-on-surface-variant leading-relaxed text-xs">
                  {extended.transmissionChannel}
                </p>
              </div>

              <div className="space-y-1 pt-1.5 border-t border-gold/20">
                <span className="font-eyebrow text-primary block">
                  Visión de Mesas de Dinero (Consenso):
                </span>
                <p className="text-on-surface-variant leading-relaxed text-xs">
                  {extended.marketConsensus}
                </p>
              </div>
            </>
          )}
        </div>
      )}

      {/* Footer: Affected Assets & Sentiment */}
      <div className="pt-2 flex flex-wrap items-center justify-between gap-2 text-xs font-sans">
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="font-eyebrow text-[10px]">Activos con impacto:</span>
          {(aiClassification ? aiClassification.affectedAssets : news.affectedAssets).map((asset) => (
            <span
              key={asset}
              className="px-2.5 py-0.5 font-mono-tabular text-[10px] font-bold bg-surface-container text-primary rounded-full border border-surface-container-highest"
            >
              {asset}
            </span>
          ))}
        </div>

        <span className={`text-[11px] font-sans font-semibold flex items-center gap-1 ${
          activeSentiment === 'bullish'
            ? 'text-bullish-green'
            : activeSentiment === 'bearish'
            ? 'text-bearish-red'
            : 'text-outline'
        }`}>
          {activeSentiment === 'bullish' ? (
            <>
              <TrendingUp size={13} />
              Sesgo Alcista
            </>
          ) : (
            <>
              <TrendingDown size={13} />
              Sesgo Bajista / Neutro
            </>
          )}
        </span>
      </div>
    </Card>
  );
};
