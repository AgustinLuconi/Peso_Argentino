import React, { useEffect, useState } from 'react';
import { X, Sparkles, TrendingUp, TrendingDown, Activity, ShieldAlert, Award, Compass } from 'lucide-react';
import { Button } from '@core/ui/components/Button';
import { Badge } from '@core/ui/components/Badge';
import { useApp } from '@app/providers/AppContext';
import { BackendMarketRepository } from '../infrastructure/BackendMarketRepository';

export interface AssetAnalysisModalProps {
  ticker: string | null;
  onClose: () => void;
}

export const AssetAnalysisModal: React.FC<AssetAnalysisModalProps> = ({ ticker, onClose }) => {
  const [data, setData] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const { setIsAiModalOpen } = useApp();

  useEffect(() => {
    if (!ticker) return;
    setLoading(true);
    const repo = new BackendMarketRepository();
    repo.getAssetAnalysis(ticker).then((res) => {
      setData(res);
      setLoading(false);
    });
  }, [ticker]);

  if (!ticker) return null;

  const handleAskAi = () => {
    onClose();
    setIsAiModalOpen(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-primary/70 backdrop-blur-md animate-fade-in">
      <div className="bg-white dark:bg-[#070e20] border border-surface-container-highest dark:border-white/10 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden animate-scale-up">
        {/* Modal Header */}
        <div className="p-4 sm:p-6 border-b border-surface-container-highest dark:border-white/10 flex items-start justify-between gap-4 bg-surface-container-low/50 dark:bg-white/5">
          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-mono text-lg sm:text-xl font-extrabold text-primary dark:text-white">
                {ticker}
              </span>
              {data?.sector && (
                <Badge variant="neutral" size="sm">
                  {data.sector}
                </Badge>
              )}
              {data?.trend === 'bullish' && (
                <Badge variant="bullish" size="sm">
                  TENDENCIA ALCISTA
                </Badge>
              )}
              {data?.trend === 'bearish' && (
                <Badge variant="bearish" size="sm">
                  TENDENCIA BAJISTA
                </Badge>
              )}
            </div>
            <h3 className="font-sans font-bold text-sm sm:text-base text-on-surface dark:text-gray-200">
              {data?.name || 'Cargando activo...'}
            </h3>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-on-surface-variant hover:text-primary hover:bg-surface-container transition-colors"
            aria-label="Cerrar análisis"
          >
            <X size={20} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-6">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-12 gap-3">
              <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
              <span className="font-eyebrow text-xs">Calculando indicadores técnicos & fundamentales...</span>
            </div>
          ) : !data ? (
            <div className="text-center py-8 text-on-surface-variant">
              No se pudo cargar el análisis para este activo.
            </div>
          ) : (
            <>
              {/* Price & Primary Stats Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="bg-surface-container-low dark:bg-white/5 p-3 rounded-xl border border-surface-container-highest dark:border-white/5">
                  <span className="font-eyebrow text-[10px] block">Precio Spot</span>
                  <span className="font-mono text-base sm:text-lg font-bold text-primary dark:text-white">
                    {data.currency === 'USD' ? 'US$ ' : '$ '}
                    {data.price?.toLocaleString('es-AR', { minimumFractionDigits: 2 })}
                  </span>
                </div>

                <div className="bg-surface-container-low dark:bg-white/5 p-3 rounded-xl border border-surface-container-highest dark:border-white/5">
                  <span className="font-eyebrow text-[10px] block">Variación 24h</span>
                  <span
                    className={`font-mono text-base sm:text-lg font-bold flex items-center gap-1 ${
                      data.variation24h >= 0 ? 'text-bullish-green' : 'text-bearish-red'
                    }`}
                  >
                    {data.variation24h >= 0 ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
                    {data.variation24h > 0 ? `+${data.variation24h}%` : `${data.variation24h}%`}
                  </span>
                </div>

                <div className="bg-surface-container-low dark:bg-white/5 p-3 rounded-xl border border-surface-container-highest dark:border-white/5">
                  <span className="font-eyebrow text-[10px] block">RSI (14 Ruedas)</span>
                  <span
                    className={`font-mono text-base sm:text-lg font-bold ${
                      data.rsi14 >= 70
                        ? 'text-bearish-red'
                        : data.rsi14 <= 30
                        ? 'text-bullish-green'
                        : 'text-primary dark:text-white'
                    }`}
                  >
                    {data.rsi14}
                    <span className="text-[10px] font-sans font-normal ml-1 text-on-surface-variant">
                      {data.rsi14 >= 70 ? 'Sobrecompra' : data.rsi14 <= 30 ? 'Sobrevendido' : 'Neutro'}
                    </span>
                  </span>
                </div>

                <div className="bg-surface-container-low dark:bg-white/5 p-3 rounded-xl border border-surface-container-highest dark:border-white/5">
                  <span className="font-eyebrow text-[10px] block">Beta / Volatilidad</span>
                  <span className="font-mono text-base sm:text-lg font-bold text-primary dark:text-white">
                    {data.beta || 1.15}
                    <span className="text-[10px] font-sans font-normal ml-1 text-on-surface-variant">vs Merval</span>
                  </span>
                </div>
              </div>

              {/* 52-Week Range Bar (si aplica) */}
              {data.fiftyTwoWeekHigh && data.fiftyTwoWeekLow && (
                <div className="bg-surface-container-low dark:bg-white/5 p-4 rounded-xl border border-surface-container-highest dark:border-white/5 space-y-2">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-eyebrow text-[11px] flex items-center gap-1.5">
                      <Activity size={13} className="text-gold" />
                      Rango de 52 Semanas (Mínimo / Máximo Anual)
                    </span>
                    {data.distanceTo52wHighPercent !== undefined && (
                      <span className="font-mono text-[11px] text-on-surface-variant">
                        {data.distanceTo52wHighPercent >= 0
                          ? `En Máximos`
                          : `${data.distanceTo52wHighPercent}% del Máximo`}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="font-mono text-xs text-on-surface-variant shrink-0">
                      ${data.fiftyTwoWeekLow?.toLocaleString('es-AR')}
                    </span>
                    <div className="w-full bg-surface-container-highest dark:bg-white/10 h-2 rounded-full relative overflow-hidden">
                      <div
                        className="bg-gold h-full rounded-full"
                        style={{
                          width: `${Math.min(
                            100,
                            Math.max(
                              10,
                              ((data.price - data.fiftyTwoWeekLow) /
                                (data.fiftyTwoWeekHigh - data.fiftyTwoWeekLow)) *
                                100
                            )
                          )}%`,
                        }}
                      />
                    </div>
                    <span className="font-mono text-xs text-on-surface-variant shrink-0">
                      ${data.fiftyTwoWeekHigh?.toLocaleString('es-AR')}
                    </span>
                  </div>
                </div>
              )}

              {/* Fundamental Multipliers & Valuation */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {data.peRatio && (
                  <div className="p-3 bg-white dark:bg-white/5 border border-surface-container-highest dark:border-white/10 rounded-xl">
                    <span className="font-eyebrow text-[10px] block">Ratio Precio / Ganancias (P/E)</span>
                    <span className="font-mono font-bold text-sm text-primary dark:text-white">
                      {data.peRatio}x
                    </span>
                  </div>
                )}
                {data.dividendYieldPercent && (
                  <div className="p-3 bg-white dark:bg-white/5 border border-surface-container-highest dark:border-white/10 rounded-xl">
                    <span className="font-eyebrow text-[10px] block">Rendimiento por Dividendo</span>
                    <span className="font-mono font-bold text-sm text-bullish-green">
                      {data.dividendYieldPercent}% anual
                    </span>
                  </div>
                )}
                {data.potentialUpsidePercent && (
                  <div className="p-3 bg-white dark:bg-white/5 border border-surface-container-highest dark:border-white/10 rounded-xl">
                    <span className="font-eyebrow text-[10px] block">Potencial Objetivo Consenso</span>
                    <span className="font-mono font-bold text-sm text-gold">
                      +{data.potentialUpsidePercent}%
                    </span>
                  </div>
                )}
              </div>

              {/* Investment Thesis */}
              {data.investmentThesis && (
                <div className="space-y-1.5">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-primary dark:text-white uppercase tracking-wider">
                    <Compass size={14} className="text-gold" />
                    Tesis Fundamental de Inversión
                  </div>
                  <p className="text-xs sm:text-sm text-on-surface-variant leading-relaxed bg-surface-container-low dark:bg-white/5 p-3.5 rounded-xl border border-surface-container-high dark:border-white/5">
                    {data.investmentThesis}
                  </p>
                </div>
              )}

              {/* Catalysts */}
              {data.catalysts && data.catalysts.length > 0 && (
                <div className="space-y-2">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-primary dark:text-white uppercase tracking-wider">
                    <Award size={14} className="text-bullish-green" />
                    Catalizadores Clave de Valor
                  </div>
                  <ul className="space-y-1.5">
                    {data.catalysts.map((cat: string, idx: number) => (
                      <li
                        key={idx}
                        className="text-xs text-on-surface flex items-start gap-2 bg-surface-container-low/60 dark:bg-white/5 p-2 rounded-lg"
                      >
                        <span className="text-gold font-bold">•</span>
                        <span>{cat}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Risk Factors */}
              {data.riskFactors && data.riskFactors.length > 0 && (
                <div className="space-y-1.5">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-bearish-red uppercase tracking-wider">
                    <ShieldAlert size={14} />
                    Factores de Riesgo Monitoreados
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {data.riskFactors.map((risk: string, idx: number) => (
                      <span
                        key={idx}
                        className="text-[11px] font-sans px-2.5 py-1 bg-bearish-red/10 text-bearish-red border border-bearish-red/20 rounded-lg"
                      >
                        {risk}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Modal Footer with Copilot IA Trigger */}
        <div className="p-4 border-t border-surface-container-highest dark:border-white/10 bg-surface-container-low dark:bg-white/5 flex items-center justify-between gap-3">
          <Button variant="ghost" size="sm" onClick={onClose}>
            Cerrar
          </Button>

          <Button
            variant="primary"
            size="sm"
            onClick={handleAskAi}
            icon={<Sparkles size={14} className="text-gold animate-pulse" />}
            className="border border-gold/40 shadow-soft"
          >
            Preguntar al Copiloto IA sobre {ticker}
          </Button>
        </div>
      </div>
    </div>
  );
};
