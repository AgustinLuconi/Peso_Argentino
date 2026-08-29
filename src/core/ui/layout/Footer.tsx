import React from 'react';
import { Shield } from 'lucide-react';
import { NewsletterSubscriptionCard } from '../components/NewsletterSubscriptionCard';

export const Footer: React.FC = () => {
  return (
    <footer className="mt-12 sm:mt-16 bg-primary text-white border-t-2 border-gold/40">
      <div className="w-full max-w-[2400px] mx-auto px-4 sm:px-6 lg:px-8 2xl:px-10 3xl:px-12 py-8 sm:py-10 space-y-10">
        {/* Newsletter Section */}
        <div id="newsletter-section">
          <NewsletterSubscriptionCard />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 sm:gap-8 pt-6 border-t border-white/10">
          {/* Brand Col */}
          <div className="md:col-span-2 space-y-3">
            <button
              type="button"
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="flex items-center gap-2.5 text-left group cursor-pointer"
              title="Volver al inicio"
            >
              <span className="font-sans font-extrabold text-lg sm:text-xl text-white tracking-tight group-hover:text-gold transition-colors">
                PESO ARGENTINO
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 bg-primary-container text-gold border border-gold/30 rounded-full">
                PORTAL INSTITUCIONAL
              </span>
            </button>
            <p className="text-xs font-sans text-slate-300 max-w-xl leading-relaxed">
              Plataforma integral de monitoreo financiero, seguimiento de activos bursátiles, balance del Banco Central de la República Argentina y radar de análisis macroeconómico y regulatorio.
            </p>
          </div>

          {/* Data Sources Col */}
          <div className="space-y-2">
            <span className="font-eyebrow text-gold">
              Fuentes Oficiales & Gratuitas
            </span>
            <ul className="text-xs font-sans text-slate-300 space-y-1.5">
              <li>DolarApi (Cotizaciones Cambiarias)</li>
              <li>ArgentinaDatos (Riesgo País & Tasas de 32 Bancos)</li>
              <li>Argly (IPC INDEC, UVA, ICL, CER, SMVM, Diputados)</li>
              <li>BCRA & INDEC (Estadísticas Oficiales)</li>
              <li>BYMA & NYSE (Mercado de Capitales)</li>
            </ul>
          </div>

          {/* Legal / Institutional Col */}
          <div className="space-y-2">
            <span className="font-eyebrow text-gold">
              Aviso Institucional
            </span>
            <p className="text-[11px] font-sans text-slate-400 leading-normal">
              Información provista con fines analíticos y de transparencia informativa de variables económicas de la República Argentina.
            </p>
          </div>
        </div>

        <div className="pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-sans text-slate-400">
          <div className="flex items-center gap-2">
            <Shield size={14} className="text-gold" />
            <span>© {new Date().getFullYear()} Peso Argentino · Monitor Económico y Financiero</span>
          </div>
          <div className="font-mono text-[11px] text-slate-400">
            TOTAL TYPESCRIPT · ARQ. HEXAGONAL · RESPONSIVE ULTRA-WIDE
          </div>
        </div>
      </div>
    </footer>
  );
};
