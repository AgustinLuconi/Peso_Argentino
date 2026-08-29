import React, { useEffect, useState } from 'react';
import {
  X,
  Calendar,
  DollarSign,
  TrendingUp,
  Globe,
  LineChart,
  Clock,
  Building,
  User,
} from 'lucide-react';
import { NewsletterPreviewData } from '@features/newsletter/domain/NewsletterTypes';
import { NewsletterApiClient } from '@features/newsletter/infrastructure/NewsletterApiClient';

interface NewsletterPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubscribeClick?: () => void;
}

export const NewsletterPreviewModal: React.FC<NewsletterPreviewModalProps> = ({
  isOpen,
  onClose,
  onSubscribeClick,
}) => {
  const [preview, setPreview] = useState<NewsletterPreviewData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (isOpen) {
      setLoading(true);
      NewsletterApiClient.getSamplePreview().then((data) => {
        setPreview(data);
        setLoading(false);
      });
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl max-h-[92vh] flex flex-col bg-slate-900 border border-gold/40 rounded-2xl shadow-2xl overflow-hidden font-sans">
        
        {/* Top Email Client Header Bar */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-white/10 bg-slate-950">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-rose-500/80 inline-block" />
            <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block" />
            <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block" />
            <span className="text-xs font-mono text-slate-400 ml-2">
              Bandeja de Entrada · Vista Previa de Correo
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
            title="Cerrar vista previa"
          >
            <X size={18} />
          </button>
        </div>

        {/* Email Metadata Simulation Header */}
        <div className="bg-slate-950/90 px-6 py-4 border-b border-white/10 space-y-2 text-xs text-slate-300">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 pb-2 border-b border-white/5">
            <div className="flex items-center gap-2">
              <span className="font-mono text-slate-500 uppercase tracking-wider">De:</span>
              <span className="font-bold text-white flex items-center gap-1.5">
                <Building size={13} className="text-gold" />
                {preview?.metadata.from || 'Peso Argentino Intelligence <newsletter@pesoargentino.com.ar>'}
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-slate-400 font-mono text-[11px]">
              <Calendar size={12} className="text-slate-500" />
              <span>{preview?.metadata.date || 'Sábado, 29 de Agosto de 2026, 17:45 hs'}</span>
            </div>
          </div>

          <div className="flex items-center gap-2 pb-2 border-b border-white/5">
            <span className="font-mono text-slate-500 uppercase tracking-wider">Para:</span>
            <span className="text-slate-300 flex items-center gap-1.5">
              <User size={13} className="text-sky-400" />
              {preview?.metadata.to || 'analista@institucional.com.ar'}
            </span>
          </div>

          <div className="flex items-start gap-2 pt-0.5">
            <span className="font-mono text-slate-500 uppercase tracking-wider shrink-0 mt-0.5">Asunto:</span>
            <span className="font-bold text-gold text-xs sm:text-sm leading-snug">
              {preview?.metadata.subject || 'Briefing Financiero #148 | Cierre de Mercados'}
            </span>
          </div>
        </div>

        {/* Email Body Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 bg-slate-900 text-slate-200">
          {loading ? (
            <div className="py-20 text-center space-y-3">
              <div className="w-8 h-8 border-2 border-gold/30 border-t-gold rounded-full animate-spin mx-auto" />
              <p className="text-xs text-slate-400 font-mono">Renderizando formato de correo...</p>
            </div>
          ) : preview ? (
            <div className="max-w-3xl mx-auto space-y-6">

              {/* 1. Header Banner / Brand */}
              <div className="rounded-xl bg-gradient-to-r from-primary-container via-slate-900 to-primary-container p-5 border border-gold/30 text-center space-y-1.5 shadow-lg">
                <div className="flex items-center justify-center gap-2">
                  <span className="text-xs font-mono font-bold tracking-widest text-gold uppercase px-2 py-0.5 rounded bg-gold/10 border border-gold/20">
                    EDICIÓN DIARIA AL CIERRE · {preview.metadata.editionNumber}
                  </span>
                </div>
                <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                  PESO ARGENTINO
                </h1>
                <p className="text-xs font-mono text-slate-300 uppercase tracking-wider">
                  Briefing Institucional de Mercados & Panorama Macroeconómico
                </p>
              </div>

              {/* 2. Executive Summary & Takeaways */}
              <div className="p-5 rounded-xl bg-slate-950 border border-white/10 space-y-4">
                <div className="border-b border-white/10 pb-2.5 flex items-center justify-between">
                  <h2 className="text-sm font-bold text-gold uppercase tracking-wider flex items-center gap-2">
                    <TrendingUp size={16} /> Resumen Ejecutivo de la Jornada
                  </h2>
                  <span className="text-[11px] font-mono text-slate-400">17:30 hs</span>
                </div>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed bg-white/5 p-3.5 rounded-lg border border-white/5">
                  {preview.executiveSummary}
                </p>

                {/* Key Bullet Highlights */}
                <div className="space-y-2 pt-1">
                  <span className="text-xs font-bold text-white block">Puntos Clave del Día:</span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {preview.keyHighlights.map((hl, idx) => (
                      <div
                        key={idx}
                        className="p-2.5 rounded-lg bg-slate-900/80 border border-white/5 text-xs text-slate-300 flex items-start gap-2"
                      >
                        <span className="font-mono text-gold font-bold shrink-0">{idx + 1}.</span>
                        <span className="leading-snug">{hl}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* 3. Section: Monitor Cambiario & Dólar */}
              <div className="p-5 rounded-xl bg-slate-950 border border-white/10 space-y-3">
                <div className="flex items-center justify-between border-b border-white/10 pb-2">
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <DollarSign size={16} className="text-emerald-400" /> Monitor Cambiario & Brecha
                  </h3>
                  <span className="text-[11px] font-mono text-slate-400">Cotizaciones al Cierre</span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left border-collapse">
                    <thead>
                      <tr className="border-b border-white/10 text-slate-400 font-mono text-[11px]">
                        <th className="py-2 px-2 font-medium">Cotización</th>
                        <th className="py-2 px-2 font-medium text-right">Compra</th>
                        <th className="py-2 px-2 font-medium text-right">Venta</th>
                        <th className="py-2 px-2 font-medium text-right">Spread</th>
                        <th className="py-2 px-2 font-medium text-right">Brecha s/May.</th>
                        <th className="py-2 px-2 font-medium text-right">Var. 24h</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5 font-sans">
                      {preview.quotes.map((q) => (
                        <tr key={q.code} className="hover:bg-white/5 transition-colors">
                          <td className="py-2.5 px-2 font-bold text-white flex items-center gap-1.5">
                            <span>{q.name}</span>
                          </td>
                          <td className="py-2.5 px-2 text-right font-mono text-slate-300">{q.buy}</td>
                          <td className="py-2.5 px-2 text-right font-mono font-bold text-white">{q.sell}</td>
                          <td className="py-2.5 px-2 text-right font-mono text-slate-400">{q.spread}</td>
                          <td className="py-2.5 px-2 text-right font-mono text-gold font-semibold">{q.breach}</td>
                          <td className="py-2.5 px-2 text-right font-mono">
                            <span
                              className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                                q.isPositive
                                  ? 'bg-emerald-500/10 text-emerald-400'
                                  : 'bg-rose-500/10 text-rose-400'
                              }`}
                            >
                              {q.variation}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* 4. Section: Macroeconomía, BCRA & Tasas */}
              <div className="p-5 rounded-xl bg-slate-950 border border-white/10 space-y-3">
                <div className="flex items-center justify-between border-b border-white/10 pb-2">
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <TrendingUp size={16} className="text-amber-400" /> Macroeconomía, BCRA & Tasas
                  </h3>
                  <span className="text-[11px] font-mono text-slate-400">Variables Oficiales</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  {preview.macroIndicators.map((item, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-lg bg-slate-900 border border-white/5 space-y-1 hover:border-gold/30 transition-colors"
                    >
                      <span className="text-[11px] font-mono text-slate-400 block">{item.label}</span>
                      <div className="flex items-baseline justify-between">
                        <span className="text-base font-extrabold text-white font-mono">{item.value}</span>
                        <span className="text-[10px] font-mono text-slate-400">{item.source}</span>
                      </div>
                      <span className="text-[11px] text-emerald-400 block font-sans">{item.trend}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* 5. Section: Renta Fija & Bonos Soberanos */}
              <div className="p-5 rounded-xl bg-slate-950 border border-white/10 space-y-3">
                <div className="flex items-center justify-between border-b border-white/10 pb-2">
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <LineChart size={16} className="text-sky-400" /> Renta Fija Soberana & Lecaps
                  </h3>
                  <span className="text-[11px] font-mono text-slate-400">BYMA / MAE</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {preview.sovereignBonds.map((b) => (
                    <div
                      key={b.ticker}
                      className="p-3 rounded-lg bg-slate-900 border border-white/5 space-y-1.5"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-extrabold text-gold font-mono">{b.ticker}</span>
                        <span className="text-[10px] font-bold text-emerald-400 font-mono">
                          {b.variation24h}
                        </span>
                      </div>
                      <span className="text-[11px] text-slate-300 block truncate">{b.name}</span>
                      <div className="pt-1 border-t border-white/5 flex items-center justify-between text-xs font-mono">
                        <span className="text-white font-bold">{b.priceUsd}</span>
                        <span className="text-slate-400">TIR: <strong className="text-white">{b.tirPercent}</strong></span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 6. Section: Mercados Internacionales & Commodities */}
              <div className="p-5 rounded-xl bg-slate-950 border border-white/10 space-y-3">
                <div className="flex items-center justify-between border-b border-white/10 pb-2">
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <Globe size={16} className="text-indigo-400" /> Mercados Globales & Commodities
                  </h3>
                  <span className="text-[11px] font-mono text-slate-400">Wall Street / Chicago</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {preview.globalMarkets.map((g, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-lg bg-slate-900 border border-white/5 space-y-1"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-white">{g.asset}</span>
                        <div className="flex items-center gap-1.5 font-mono text-xs">
                          <span className="text-white font-semibold">{g.value}</span>
                          <span className="text-emerald-400 text-[10px] font-bold">
                            {g.variation}
                          </span>
                        </div>
                      </div>
                      <p className="text-[11px] text-slate-400 leading-snug">{g.takeaway}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* 7. Section: Agenda Financiera */}
              <div className="p-5 rounded-xl bg-slate-950 border border-white/10 space-y-3">
                <div className="flex items-center justify-between border-b border-white/10 pb-2">
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <Clock size={16} className="text-amber-400" /> Agenda Financiera & Próximos Eventos
                  </h3>
                  <span className="text-[11px] font-mono text-slate-400">Calendario Oficial</span>
                </div>

                <div className="space-y-2">
                  {preview.upcomingAgenda.map((ag, idx) => (
                    <div
                      key={idx}
                      className="p-2.5 rounded-lg bg-slate-900 border border-white/5 flex items-start justify-between gap-3 text-xs"
                    >
                      <div className="space-y-0.5">
                        <span className="font-mono text-gold text-[11px] font-bold block">
                          {ag.dateOrTime}
                        </span>
                        <span className="text-slate-300">{ag.event}</span>
                      </div>
                      <span
                        className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded shrink-0 ${
                          ag.impactLevel === 'high'
                            ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                            : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                        }`}
                      >
                        {ag.impactLevel === 'high' ? 'Impacto Alto' : 'Impacto Medio'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* 8. Institutional Email Footer */}
              <div className="p-5 rounded-xl bg-slate-950/60 border border-white/5 text-center space-y-2 text-xs text-slate-400">
                <p className="text-[11px] leading-relaxed">
                  Este informe es elaborado por el equipo de Research & Intelligence de <strong>Peso Argentino</strong> con fuentes oficiales de BNA, BCRA, INDEC, BYMA y Reserva Federal.
                </p>
                <div className="pt-2 border-t border-white/5 flex flex-wrap items-center justify-center gap-3 text-[11px] text-slate-500 font-sans">
                  <span className="hover:text-gold cursor-pointer transition-colors">Administrar preferencias</span>
                  <span>·</span>
                  <span className="hover:text-gold cursor-pointer transition-colors">Ver en versión web</span>
                  <span>·</span>
                  <span className="hover:text-rose-400 cursor-pointer transition-colors">Desuscribirme</span>
                </div>
              </div>
            </div>
          ) : (
            <p className="text-center text-xs text-slate-400 py-12">No se pudo cargar el ejemplar.</p>
          )}
        </div>

        {/* Modal Bottom Action Bar */}
        <div className="px-6 py-3.5 border-t border-white/10 bg-slate-950 flex items-center justify-between">
          <span className="text-xs text-slate-400 hidden sm:inline font-sans">
            📬 Este formato se adapta automáticamente a tu cliente de correo (Gmail, Outlook, Apple Mail).
          </span>
          <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-sans text-slate-300 hover:text-white transition-colors"
            >
              Cerrar
            </button>
            {onSubscribeClick && (
              <button
                onClick={() => {
                  onClose();
                  onSubscribeClick();
                }}
                className="px-5 py-2 text-xs font-sans font-extrabold bg-gold hover:bg-gold-light text-slate-950 rounded-xl shadow-lg transition-all transform active:scale-95"
              >
                Suscribirme a este Informe
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
