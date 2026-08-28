import React, { useState, useRef, useEffect } from 'react';
import { Sparkles, Send, X, Bot, User, Cpu, ShieldCheck, ArrowRight, CornerDownLeft, RefreshCw } from 'lucide-react';
import { LlmApiClient } from '@features/news-intelligence/infrastructure/LlmApiClient';
import { Badge } from './Badge';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export const FinancialAiModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
}> = ({ isOpen, onClose }) => {
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: `👋 **¡Hola! Soy tu Copiloto Financiero de Peso Argentino.**
Estoy configurado con un **motor de Inteligencia Artificial 100% gratuito** para analizar la macroeconomía argentina, el mercado de bonos soberanos (AL30/GD30), política monetaria del BCRA (LEFIs) y régimen RIGI.

Puedes hacerme cualquier pregunta o seleccionar uno de los accesos directos abajo:`,
      timestamp: new Date().toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  const [suggestions, setSuggestions] = useState<string[]>([
    '¿Qué diferencia hay entre AL30 y GD30?',
    '¿Conviene hacer carry trade con la tasa actual vs inflación?',
    '¿Cómo impacta la eliminación de pasivos del BCRA en el dólar?',
    '¿Cuáles son las principales inversiones del RIGI?',
  ]);

  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
      chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [messages, isOpen, onClose]);

  if (!isOpen) return null;

  const handleSend = async (userText?: string) => {
    const textToSend = userText || input.trim();
    if (!textToSend || isLoading) return;

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: textToSend,
      timestamp: new Date().toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const history = [...messages, userMessage].map((m) => ({
        role: m.role,
        content: m.content,
      }));

      const res = await LlmApiClient.askAssistant(history);

      if (res && res.reply) {
        const assistantMsg: Message = {
          id: `assistant-${Date.now()}`,
          role: 'assistant',
          content: res.reply,
          timestamp: new Date().toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' }),
        };
        setMessages((prev) => [...prev, assistantMsg]);
        if (res.suggestions && res.suggestions.length > 0) {
          setSuggestions(res.suggestions as string[]);
        }
      } else {
        const fallbackMsg: Message = {
          id: `assistant-${Date.now()}`,
          role: 'assistant',
          content: 'No se pudo conectar con el motor de IA en este momento. Por favor reintenta en unos instantes.',
          timestamp: new Date().toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' }),
        };
        setMessages((prev) => [...prev, fallbackMsg]);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl h-[85vh] max-h-[750px] bg-white dark:bg-[#081124] border border-surface-container-highest dark:border-[#1a2744] rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-primary text-white border-b border-gold/30">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gold/20 text-gold rounded-2xl border border-gold/30">
              <Bot size={22} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-h3 text-base sm:text-lg text-white">
                  Copiloto Financiero IA
                </h3>
                <span className="px-2 py-0.5 text-[10px] font-mono font-bold bg-gold/20 text-gold border border-gold/40 rounded-full">
                  100% GRATIS
                </span>
              </div>
              <p className="font-subtitle text-xs text-slate-300">
                Análisis macroeconómico, bonos soberanos y mercado en tiempo real
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-300 hover:text-white hover:bg-white/10 rounded-full transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Messages Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 bg-surface dark:bg-[#040914]">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {msg.role === 'assistant' && (
                <div className="p-2 bg-gold/15 text-gold rounded-xl h-fit shrink-0 border border-gold/20">
                  <Bot size={16} />
                </div>
              )}

              <div
                className={`max-w-[85%] p-4 rounded-2xl text-xs sm:text-sm leading-relaxed shadow-soft ${
                  msg.role === 'user'
                    ? 'bg-primary text-white rounded-br-none'
                    : 'bg-white dark:bg-[#0c1730] text-on-surface border border-surface-container-highest dark:border-[#1a2744] rounded-bl-none'
                }`}
              >
                <div className="whitespace-pre-wrap space-y-2">
                  {msg.content.split('\n').map((line, i) => {
                    if (line.startsWith('**') && line.endsWith('**')) {
                      return <strong key={i} className="block text-gold text-sm">{line.replace(/\*\*/g, '')}</strong>;
                    }
                    if (line.startsWith('* ') || line.startsWith('- ')) {
                      return <div key={i} className="pl-3 relative before:content-['•'] before:absolute before:left-0 before:text-gold">{line.substring(2)}</div>;
                    }
                    return <p key={i}>{line}</p>;
                  })}
                </div>
                <div
                  className={`text-[10px] mt-2 text-right ${
                    msg.role === 'user' ? 'text-slate-400' : 'text-outline'
                  }`}
                >
                  {msg.timestamp}
                </div>
              </div>

              {msg.role === 'user' && (
                <div className="p-2 bg-primary text-white rounded-xl h-fit shrink-0">
                  <User size={16} />
                </div>
              )}
            </div>
          ))}

          {isLoading && (
            <div className="flex gap-3 justify-start items-center">
              <div className="p-2 bg-gold/15 text-gold rounded-xl h-fit shrink-0 border border-gold/20 animate-pulse">
                <Bot size={16} />
              </div>
              <div className="p-3.5 bg-white dark:bg-[#0c1730] border border-surface-container-highest dark:border-[#1a2744] rounded-2xl text-xs text-on-surface flex items-center gap-2">
                <RefreshCw size={14} className="animate-spin text-gold" />
                <span>Analizando variables y elaborando respuesta institucional...</span>
              </div>
            </div>
          )}

          <div ref={chatEndRef} />
        </div>

        {/* Quick Prompts Suggestions */}
        {suggestions.length > 0 && (
          <div className="px-4 py-2 bg-surface-container-low dark:bg-[#081124] border-t border-surface-container-highest dark:border-[#1a2744] flex items-center gap-2 overflow-x-auto text-xs">
            <span className="font-eyebrow text-outline shrink-0">Sugerencias:</span>
            {suggestions.map((sug, i) => (
              <button
                key={i}
                onClick={() => handleSend(sug)}
                disabled={isLoading}
                className="px-3 py-1.5 bg-white dark:bg-[#101e3d] hover:bg-gold/10 hover:border-gold/50 text-on-surface border border-surface-container-high dark:border-[#1a2744] rounded-xl shrink-0 font-sans text-xs transition-colors shadow-soft"
              >
                {sug}
              </button>
            ))}
          </div>
        )}

        {/* Input Bar */}
        <div className="p-4 bg-white dark:bg-[#081124] border-t border-surface-container-highest dark:border-[#1a2744]">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Pregunta sobre carry trade, AL30/GD30, inflación, dólar MEP o RIGI..."
              disabled={isLoading}
              className="flex-1 px-4 py-3 bg-surface-container-low dark:bg-[#0c1730] text-on-surface placeholder:text-outline border border-surface-container-high dark:border-[#1a2744] rounded-2xl text-xs sm:text-sm focus:outline-none focus:border-gold transition-all"
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="p-3 bg-primary text-gold hover:bg-primary-container disabled:opacity-50 disabled:cursor-not-allowed rounded-2xl transition-all shadow-soft shrink-0"
              title="Enviar consulta"
            >
              <Send size={18} />
            </button>
          </form>
          <div className="flex items-center justify-between mt-2 text-[11px] font-sans text-outline px-1">
            <span>Motor de inferencia gratuito · Sin costo de API</span>
            <span className="font-mono text-[10px]">Cero gasto garantizado</span>
          </div>
        </div>
      </div>
    </div>
  );
};
