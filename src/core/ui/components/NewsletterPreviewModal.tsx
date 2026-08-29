import React, { useEffect, useState } from 'react';
import { X, Mail, Sparkles, TrendingUp, DollarSign, Globe, CheckCircle2, Shield, Calendar } from 'lucide-react';
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl max-h-[90vh] flex flex-col bg-slate-900 border border-gold/30 rounded-2xl shadow-2xl overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-slate-950/80">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-gold/10 border border-gold/20 text-gold">
              <Mail size={18} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono font-bold tracking-wider uppercase px-2 py-0.5 rounded bg-gold/10 text-gold border border-gold/20">
                  EJEMPLAR DE MUESTRA
                </span>
                <span className="text-xs text-slate-400 font-mono">
                  {preview?.date || 'Edición de Mercado'}
                </span>
              </div>
              <h3 className="text-sm sm:text-base font-bold text-white tracking-tight mt-0.5">
                Briefing Financiero · Peso Argentino
              </h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
            title="Cerrar vista previa"
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Body / Newsletter Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 text-slate-200 font-sans">
          {loading ? (
            <div className="py-16 text-center space-y-3">
              <div className="w-8 h-8 border-2 border-gold/30 border-t-gold rounded-full animate-spin mx-auto" />
              <p className="text-xs text-slate-400">Cargando ejemplar de muestra...</p>
            </div>
          ) : preview ? (
            <>
              {/* Newsletter Title & Subtitle Banner */}
              <div className="p-5 rounded-xl bg-gradient-to-br from-primary-container/60 via-slate-900 to-slate-950 border border-gold/20 relative overflow-hidden">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-mono text-gold flex items-center gap-1.5 font-bold">
                    <Sparkles size={13} /> {preview.edition}
                  </span>
                  <span className="text-[11px] text-slate-400 flex items-center gap-1">
                    <Calendar size={12} /> {preview.date}
                  </span>
                </div>
                <h4 className="text-base sm:text-lg font-extrabold text-white leading-snug">
                  Cierre de Jornada Cambiaria, Inflación INDEC & Panorama de Bonos
                </h4>
                <p className="text-xs sm:text-sm text-slate-300 mt-2 leading-relaxed bg-black/20 p-3 rounded-lg border border-white/5">
                  {preview.executiveSummary}
                </p>
              </div>

              {/* Sections Grid */}
              <div className="space-y-4">
                {preview.sections.map((section, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-xl bg-slate-950/60 border border-white/10 hover:border-gold/30 transition-colors"
                  >
                    <div className="flex items-center justify-between mb-2.5 pb-2 border-b border-white/5">
                      <h5 className="text-sm font-bold text-white flex items-center gap-2">
                        {idx === 0 && <DollarSign size={15} className="text-emerald-400" />}
                        {idx === 1 && <TrendingUp size={15} className="text-amber-400" />}
                        {idx === 2 && <Globe size={15} className="text-sky-400" />}
                        {section.title}
                      </h5>
                      <span className="text-[10px] font-mono font-medium px-2 py-0.5 rounded bg-white/5 text-slate-300 border border-white/10">
                        {section.highlight}
                      </span>
                    </div>
                    <ul className="space-y-1.5 text-xs text-slate-300">
                      {section.bullets.map((bullet, bIdx) => (
                        <li key={bIdx} className="flex items-start gap-2">
                          <CheckCircle2 size={13} className="text-gold shrink-0 mt-0.5" />
                          <span>{bullet}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>

              {/* Institutional Note */}
              <div className="p-4 rounded-xl bg-slate-950/40 border border-white/5 flex items-center justify-between text-xs text-slate-400">
                <div className="flex items-center gap-2">
                  <Shield size={14} className="text-gold" />
                  <span>Elaborado con datos de BNA, INDEC, BCRA, BYMA & Reserva Federal.</span>
                </div>
                <span className="text-[10px] font-mono text-slate-500">100% GRATUITO</span>
              </div>
            </>
          ) : (
            <p className="text-center text-xs text-slate-400 py-10">No se pudo cargar la vista previa.</p>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3.5 border-t border-white/10 bg-slate-950 flex items-center justify-between">
          <span className="text-xs text-slate-400 font-sans hidden sm:inline">
            📬 Podés personalizar tus temas de interés y frecuencia antes de suscribirte.
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
                className="px-4 py-2 text-xs font-sans font-bold bg-gold hover:bg-gold-light text-slate-950 rounded-lg shadow transition-all transform active:scale-95"
              >
                Suscribirme Ahora
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
