import React, { useState } from 'react';
import {
  Mail,
  Send,
  CheckCircle2,
  Eye,
  AlertCircle,
  Clock,
  Check,
  Zap,
} from 'lucide-react';
import {
  NewsletterFrequency,
  LOCAL_TOPICS,
  INTERNATIONAL_TOPICS,
  ALL_NEWSLETTER_TOPICS,
} from '@features/newsletter/domain/NewsletterTypes';
import { NewsletterApiClient } from '@features/newsletter/infrastructure/NewsletterApiClient';
import { NewsletterPreviewModal } from './NewsletterPreviewModal';

interface NewsletterSubscriptionCardProps {
  readonly className?: string;
  readonly defaultFrequency?: NewsletterFrequency;
}

export const NewsletterSubscriptionCard: React.FC<NewsletterSubscriptionCardProps> = ({
  className = '',
  defaultFrequency = 'daily',
}) => {
  const [email, setEmail] = useState('');
  const [frequency, setFrequency] = useState<NewsletterFrequency>(defaultFrequency);
  const [includeBreakingAlerts, setIncludeBreakingAlerts] = useState<boolean>(true);
  const [selectedTopics, setSelectedTopics] = useState<string[]>(
    ALL_NEWSLETTER_TOPICS.map((t) => t.id)
  );

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  const toggleTopic = (id: string) => {
    if (selectedTopics.includes(id)) {
      if (selectedTopics.length > 1) {
        setSelectedTopics(selectedTopics.filter((t) => t !== id));
      }
    } else {
      setSelectedTopics([...selectedTopics, id]);
    }
  };

  const isAllSelected = selectedTopics.length === ALL_NEWSLETTER_TOPICS.length;
  const isOnlyLocalSelected =
    selectedTopics.length === LOCAL_TOPICS.length &&
    LOCAL_TOPICS.every((t) => selectedTopics.includes(t.id));
  const isOnlyInternationalSelected =
    selectedTopics.length === INTERNATIONAL_TOPICS.length &&
    INTERNATIONAL_TOPICS.every((t) => selectedTopics.includes(t.id));

  const handleSelectAll = () => {
    setSelectedTopics(ALL_NEWSLETTER_TOPICS.map((t) => t.id));
  };

  const handleSelectOnlyLocal = () => {
    setSelectedTopics(LOCAL_TOPICS.map((t) => t.id));
  };

  const handleSelectOnlyInternational = () => {
    setSelectedTopics(INTERNATIONAL_TOPICS.map((t) => t.id));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const cleanEmail = email.trim();
    if (!cleanEmail || !cleanEmail.includes('@') || !cleanEmail.includes('.')) {
      setErrorMessage('Por favor, ingresá un correo electrónico válido.');
      return;
    }

    setLoading(true);

    const result = await NewsletterApiClient.subscribe({
      email: cleanEmail,
      frequency,
      includeBreakingAlerts,
      topics: selectedTopics,
      source: 'web_portal_footer',
    });

    setLoading(false);

    if (result.success) {
      setIsSuccess(true);
    } else {
      setErrorMessage(result.message);
    }
  };

  return (
    <div
      className={`relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-primary-container/80 to-slate-950 border border-gold/30 p-6 sm:p-8 shadow-2xl text-white font-sans ${className}`}
    >
      {/* Decorative Background Glows */}
      <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-gold/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-64 h-64 bg-primary/20 rounded-full blur-3xl pointer-events-none" />

      {/* Main Container */}
      <div className="relative z-10 max-w-5xl mx-auto space-y-6">
        {/* Header & Social Proof */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-gold/15 text-gold border border-gold/30">
                BRIEFING FINANCIERO · PESO ARGENTINO
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-white/10 text-slate-300 border border-white/10">
                GRATUITO
              </span>
            </div>
            <h3 className="text-lg sm:text-2xl font-extrabold text-white tracking-tight">
              Suscribite al Informe Financiero & Panorama Económico
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
              Recibí directamente en tu correo el análisis institucional de cotizaciones del dólar, brecha
              cambiaria, curva de bonos, balance del BCRA y mercados internacionales.
            </p>
          </div>

          {/* Sample Preview Button & Subscriber Count */}
          <div className="flex flex-row md:flex-col items-start md:items-end justify-between gap-2 shrink-0">
            <div className="flex items-center gap-1.5 text-xs text-gold font-mono font-bold bg-black/40 px-3 py-1.5 rounded-lg border border-gold/20">
              <CheckCircle2 size={14} />
              <span>+1.420 analistas y operadores</span>
            </div>
            <button
              type="button"
              onClick={() => setIsPreviewOpen(true)}
              className="text-xs font-sans font-semibold text-gold hover:text-white flex items-center gap-1.5 transition-colors bg-gold/10 hover:bg-gold/20 px-3 py-1.5 rounded-lg border border-gold/30"
            >
              <Eye size={14} className="text-gold" /> Ver ejemplar de muestra
            </button>
          </div>
        </div>

        {/* Subscription Form / Success State */}
        {isSuccess ? (
          <div className="p-6 rounded-xl bg-emerald-950/40 border border-emerald-500/30 text-emerald-200 space-y-3 animate-in fade-in zoom-in-95 duration-300">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                <CheckCircle2 size={24} />
              </div>
              <div>
                <h4 className="text-base font-bold text-white">¡Suscripción confirmada con éxito!</h4>
                <p className="text-xs text-emerald-300">
                  Enviamos una confirmación a <strong className="text-white">{email}</strong>. Recibirás tu
                  primer informe según la frecuencia y temas seleccionados.
                </p>
              </div>
            </div>
            <div className="pt-3 border-t border-emerald-500/20 flex flex-wrap items-center gap-2 text-[11px] font-mono text-emerald-300/80">
              <span>Frecuencia: <strong className="text-white uppercase">{frequency}</strong></span>
              <span>·</span>
              <span>Temas: <strong className="text-white">{selectedTopics.length} seleccionados</strong></span>
              <span>·</span>
              <span>Alertas: <strong className="text-white">{includeBreakingAlerts ? 'Activadas' : 'Desactivadas'}</strong></span>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* 1. Seleccionar Frecuencia (Selección Única) & Checkbox Alertas */}
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-gold uppercase tracking-wider flex items-center gap-1.5">
                  <Clock size={13} /> 1. Frecuencia de Envío (Selecciona una opción):
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                {/* Diario */}
                <button
                  type="button"
                  onClick={() => setFrequency('daily')}
                  className={`p-3.5 rounded-xl text-left border transition-all flex flex-col justify-between ${
                    frequency === 'daily'
                      ? 'bg-gold/15 border-gold text-white shadow-lg shadow-gold/5 ring-1 ring-gold/40'
                      : 'bg-slate-950/60 border-white/10 text-slate-300 hover:border-white/20'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white tracking-wide">
                      Diario al Cierre
                    </span>
                    {frequency === 'daily' && <Check size={14} className="text-gold" />}
                  </div>
                  <span className="text-[11px] text-slate-400 mt-1">Lunes a Viernes (17:30 hs)</span>
                </button>

                {/* Semanal */}
                <button
                  type="button"
                  onClick={() => setFrequency('weekly')}
                  className={`p-3.5 rounded-xl text-left border transition-all flex flex-col justify-between ${
                    frequency === 'weekly'
                      ? 'bg-gold/15 border-gold text-white shadow-lg shadow-gold/5 ring-1 ring-gold/40'
                      : 'bg-slate-950/60 border-white/10 text-slate-300 hover:border-white/20'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white tracking-wide">
                      Semanal
                    </span>
                    {frequency === 'weekly' && <Check size={14} className="text-gold" />}
                  </div>
                  <span className="text-[11px] text-slate-400 mt-1">Resumen & Agenda financiera</span>
                </button>

                {/* Mensual */}
                <button
                  type="button"
                  onClick={() => setFrequency('monthly')}
                  className={`p-3.5 rounded-xl text-left border transition-all flex flex-col justify-between ${
                    frequency === 'monthly'
                      ? 'bg-gold/15 border-gold text-white shadow-lg shadow-gold/5 ring-1 ring-gold/40'
                      : 'bg-slate-950/60 border-white/10 text-slate-300 hover:border-white/20'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white tracking-wide">
                      Cierre Mensual
                    </span>
                    {frequency === 'monthly' && <Check size={14} className="text-gold" />}
                  </div>
                  <span className="text-[11px] text-slate-400 mt-1">Balance integral de fin de mes</span>
                </button>
              </div>

              {/* Opción Adicional: Alertas Flash */}
              <label className="flex items-center gap-2.5 p-3 rounded-xl bg-black/40 border border-white/10 cursor-pointer hover:border-gold/30 transition-colors w-full">
                <input
                  type="checkbox"
                  checked={includeBreakingAlerts}
                  onChange={(e) => setIncludeBreakingAlerts(e.target.checked)}
                  className="rounded border-slate-700 bg-slate-800 text-gold focus:ring-gold focus:ring-offset-slate-900 w-4 h-4 cursor-pointer"
                />
                <span className="text-xs text-slate-300 flex items-center gap-1.5 font-medium">
                  <Zap size={14} className="text-amber-400 shrink-0" />
                  <span>
                    <strong className="text-white">Alertas Flash & Medidas Urgentes</strong> (Publicación de IPC INDEC en vivo y anuncios oficiales del BCRA/MECON)
                  </span>
                </span>
              </label>
            </div>

            {/* 2. Catálogo de Temas de Interés (Selección Múltiple con Botones Notables) */}
            <div className="space-y-4 pt-3 border-t border-white/10">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-950/80 p-3 rounded-xl border border-white/10">
                <div>
                  <span className="text-xs font-mono font-bold text-gold uppercase tracking-wider block">
                    2. Temas de Interés (Podes seleccionar locales e internacionales)
                  </span>
                  <span className="text-[11px] text-slate-400">
                    {selectedTopics.length} de {ALL_NEWSLETTER_TOPICS.length} temas seleccionados
                  </span>
                </div>

                {/* Botones Selectores con Alto Contraste y Visibilidad */}
                <div className="flex items-center gap-2 flex-wrap">
                  <button
                    type="button"
                    onClick={handleSelectAll}
                    className={`px-3 py-1.5 text-xs font-sans font-bold rounded-lg transition-all border ${
                      isAllSelected
                        ? 'bg-gold text-slate-950 border-gold shadow-md font-extrabold'
                        : 'bg-white/5 text-slate-300 hover:text-white hover:bg-white/10 border-white/15'
                    }`}
                  >
                    Seleccionar Todos (10)
                  </button>
                  <button
                    type="button"
                    onClick={handleSelectOnlyLocal}
                    className={`px-3 py-1.5 text-xs font-sans font-bold rounded-lg transition-all border ${
                      isOnlyLocalSelected
                        ? 'bg-gold text-slate-950 border-gold shadow-md font-extrabold'
                        : 'bg-white/5 text-slate-300 hover:text-white hover:bg-white/10 border-white/15'
                    }`}
                  >
                    Solo Locales (6)
                  </button>
                  <button
                    type="button"
                    onClick={handleSelectOnlyInternational}
                    className={`px-3 py-1.5 text-xs font-sans font-bold rounded-lg transition-all border ${
                      isOnlyInternationalSelected
                        ? 'bg-gold text-slate-950 border-gold shadow-md font-extrabold'
                        : 'bg-white/5 text-slate-300 hover:text-white hover:bg-white/10 border-white/15'
                    }`}
                  >
                    Solo Globales (4)
                  </button>
                </div>
              </div>

              {/* Categoría A: Mercado Local */}
              <div className="space-y-2">
                <span className="text-[11px] font-mono font-semibold text-slate-300 tracking-wider block">
                  MERCADO LOCAL & ARGENTINA
                </span>
                <div className="flex flex-wrap gap-2">
                  {LOCAL_TOPICS.map((topic) => {
                    const isSelected = selectedTopics.includes(topic.id);
                    return (
                      <button
                        key={topic.id}
                        type="button"
                        onClick={() => toggleTopic(topic.id)}
                        className={`px-3.5 py-2 rounded-xl text-xs font-sans transition-all flex items-center gap-2 border ${
                          isSelected
                            ? 'bg-primary border-gold text-gold font-bold shadow-sm shadow-gold/10'
                            : 'bg-slate-950/60 border-white/10 text-slate-400 hover:text-slate-200 hover:border-white/20'
                        }`}
                        title={topic.description}
                      >
                        <span>{topic.badge}</span>
                        {isSelected && <Check size={13} className="text-gold" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Categoría B: Mercado Internacional */}
              <div className="space-y-2 pt-1">
                <span className="text-[11px] font-mono font-semibold text-slate-300 tracking-wider block">
                  MERCADO INTERNACIONAL & GLOBAL
                </span>
                <div className="flex flex-wrap gap-2">
                  {INTERNATIONAL_TOPICS.map((topic) => {
                    const isSelected = selectedTopics.includes(topic.id);
                    return (
                      <button
                        key={topic.id}
                        type="button"
                        onClick={() => toggleTopic(topic.id)}
                        className={`px-3.5 py-2 rounded-xl text-xs font-sans transition-all flex items-center gap-2 border ${
                          isSelected
                            ? 'bg-primary border-gold text-gold font-bold shadow-sm shadow-gold/10'
                            : 'bg-slate-950/60 border-white/10 text-slate-400 hover:text-slate-200 hover:border-white/20'
                        }`}
                        title={topic.description}
                      >
                        <span>{topic.badge}</span>
                        {isSelected && <Check size={13} className="text-gold" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* 3. Input de Email y Botón de Suscripción */}
            <div className="pt-3 border-t border-white/10 space-y-3">
              <div className="flex flex-col sm:flex-row items-center gap-3">
                <div className="relative flex-1 w-full">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Mail size={16} />
                  </div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Ingresá tu correo electrónico corporativo o personal (ej. analista@empresa.com)"
                    required
                    disabled={loading}
                    className="w-full pl-10 pr-4 py-3 bg-slate-950 border border-white/20 rounded-xl text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold transition-all"
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full sm:w-auto px-7 py-3 bg-gold hover:bg-gold-light text-slate-950 font-sans font-extrabold text-xs sm:text-sm rounded-xl shadow-lg shadow-gold/20 flex items-center justify-center gap-2 transition-all transform active:scale-95 shrink-0 disabled:opacity-50"
                >
                  {loading ? (
                    <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <Send size={15} />
                      <span>Suscribirme Gratis</span>
                    </>
                  )}
                </button>
              </div>

              {/* Error Message */}
              {errorMessage && (
                <div className="flex items-center gap-2 text-xs text-rose-400 bg-rose-950/30 p-2.5 rounded-lg border border-rose-800/40 animate-in fade-in">
                  <AlertCircle size={14} className="shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* Privacy Disclaimer */}
              <div className="text-[11px] text-slate-400 font-sans">
                🔒 Cero spam. Podés desuscribirte o modificar tus temas de interés en cualquier momento con un solo clic.
              </div>
            </div>
          </form>
        )}
      </div>

      {/* Preview Modal */}
      <NewsletterPreviewModal
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
        onSubscribeClick={() => {
          const inputEl = document.querySelector('input[type="email"]') as HTMLInputElement;
          inputEl?.focus();
        }}
      />
    </div>
  );
};
