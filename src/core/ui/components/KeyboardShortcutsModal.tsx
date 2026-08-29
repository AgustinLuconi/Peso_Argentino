import React from 'react';
import { X, Keyboard } from 'lucide-react';
import { Badge } from './Badge';

export interface KeyboardShortcutsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const KeyboardShortcutsModal: React.FC<KeyboardShortcutsModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  const shortcutGroups = [
    {
      title: 'Navegación & Búsqueda',
      shortcuts: [
        { keys: ['⌘', 'K'], desc: 'Abrir Command Palette & Calculadora Rápida' },
        { keys: ['⌘', 'J'], desc: 'Abrir Copiloto Financiero con IA' },
        { keys: ['⌘', 'U'], desc: 'Alternar moneda global (ARS / USD)' },
        { keys: ['?'], desc: 'Ver esta guía de atajos de teclado' },
        { keys: ['Esc'], desc: 'Cerrar cualquier ventana o modal activo' },
      ],
    },
    {
      title: 'Salto Directo a Módulos',
      shortcuts: [
        { keys: ['1'], desc: 'Dashboard Principal (Dólar, Brecha & Macro)' },
        { keys: ['2'], desc: 'Mercados & Renta Fija (BYMA, Bonos, CEDEARs)' },
        { keys: ['3'], desc: 'Curva de Lecaps & Boncaps' },
        { keys: ['4'], desc: 'Calculadora y Flujo Bono AL30' },
        { keys: ['5'], desc: 'Estadísticas BCRA & Simulador de Carry Trade' },
        { keys: ['6'], desc: 'Análisis Político, RIGI & Leyes' },
        { keys: ['7'], desc: 'Intelligence Feed de Noticias en Tiempo Real' },
      ],
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-white dark:bg-[#0F141C] border border-surface-container-highest dark:border-[#1E2638] rounded-3xl max-w-lg w-full shadow-tactile overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-surface-container-highest dark:border-[#1E2638]">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 rounded-2xl">
              <Keyboard size={20} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-h3 text-base text-slate-900 dark:text-slate-100 font-bold">
                  Atajos de Teclado de la Terminal
                </h3>
                <Badge variant="emerald" size="sm">
                  PRO
                </Badge>
              </div>
              <p className="font-subtitle text-xs text-slate-500 dark:text-slate-400">
                Navega y opera con máxima velocidad sin tocar el ratón
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-surface-container dark:hover:bg-[#131822] transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Shortcuts List */}
        <div className="p-5 space-y-5 max-h-[70vh] overflow-y-auto">
          {shortcutGroups.map((group, gIdx) => (
            <div key={gIdx} className="space-y-2.5">
              <h4 className="font-eyebrow text-xs text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider">
                {group.title}
              </h4>

              <div className="space-y-1.5">
                {group.shortcuts.map((item, sIdx) => (
                  <div
                    key={sIdx}
                    className="flex items-center justify-between p-2.5 rounded-xl bg-surface-container-low dark:bg-[#131822] border border-surface-container-high dark:border-[#1E2638] text-xs"
                  >
                    <span className="text-slate-700 dark:text-slate-300 font-sans">
                      {item.desc}
                    </span>

                    <div className="flex items-center gap-1">
                      {item.keys.map((k, kIdx) => (
                        <kbd
                          key={kIdx}
                          className="px-2 py-1 font-mono text-[11px] font-bold bg-white dark:bg-[#0F141C] text-slate-900 dark:text-emerald-400 border border-slate-200 dark:border-[#1E2638] rounded-lg shadow-xs"
                        >
                          {k}
                        </kbd>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="p-4 bg-surface-container-low dark:bg-[#131822] border-t border-surface-container-highest dark:border-[#1E2638] text-center text-[11px] font-mono text-slate-500 dark:text-slate-400">
          Tip: Puedes presionar <kbd className="px-1.5 py-0.5 bg-white dark:bg-[#0F141C] rounded border border-slate-300 dark:border-[#1E2638] text-slate-900 dark:text-slate-200">?</kbd> en cualquier momento para ver esta ventana.
        </div>
      </div>
    </div>
  );
};
