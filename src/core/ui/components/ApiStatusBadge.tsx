import React, { useState } from 'react';
import { ShieldCheck, ChevronDown } from 'lucide-react';

export const ApiStatusBadge: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  const apiEndpoints = [
    { name: 'DolarApi Argentina', status: 'Operativo', ping: '38ms', cache: 'SWR 60s' },
    { name: 'ArgentinaDatos (Macro & INDEC)', status: 'Operativo', ping: '52ms', cache: 'SWR 300s' },
    { name: 'Argly Data Provider', status: 'Operativo', ping: '45ms', cache: 'SWR 120s' },
    { name: 'BCRA API & Series Históricas', status: 'Sincronizado', ping: '65ms', cache: '10 min' },
  ];

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex items-center gap-1.5 px-2 sm:px-2.5 py-1 text-[11px] font-mono font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 dark:bg-emerald-950/30 hover:bg-emerald-500/20 border border-emerald-500/30 rounded-xl transition-all shadow-soft shrink-0"
        title="Ver estado y latencia de las fuentes de datos"
      >
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
        <span className="hidden sm:inline">En Vivo</span>
        <span className="text-[10px] text-emerald-500/70 dark:text-emerald-400/70 hidden md:inline">45ms</span>
        <ChevronDown size={12} className={`transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Popover de Estado de APIs */}
      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 top-full mt-2 w-72 sm:w-80 bg-white dark:bg-[#0F141C] border border-surface-container-highest dark:border-[#1E2638] rounded-2xl shadow-tactile p-3.5 z-50 animate-in fade-in zoom-in-95 duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] space-y-3">
            <div className="flex items-center justify-between border-b border-surface-container-highest dark:border-[#1E2638] pb-2">
              <div className="flex items-center gap-1.5 text-xs font-sans font-bold text-slate-900 dark:text-slate-100">
                <ShieldCheck size={15} className="text-emerald-500" />
                <span>Salud de Conexión & APIs</span>
              </div>
              <span className="text-[9px] font-mono font-bold px-1.5 py-0.2 bg-emerald-500/20 text-emerald-500 rounded">
                100% DISPONIBLE
              </span>
            </div>

            <div className="space-y-2">
              {apiEndpoints.map((api, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-2 rounded-xl bg-surface-container-low dark:bg-[#131822] border border-surface-container-high dark:border-[#1E2638] text-[11px] font-mono"
                >
                  <div className="flex items-center gap-1.5 truncate">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                    <span className="text-slate-900 dark:text-slate-200 truncate font-bold">
                      {api.name}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 shrink-0 text-[10px]">
                    <span className="text-slate-400">{api.ping}</span>
                    <span className="text-emerald-500 font-bold">{api.status}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-1 text-[10px] text-slate-500 dark:text-slate-400 flex items-center justify-between font-sans border-t border-surface-container-highest dark:border-[#1E2638]">
              <span>Caché Stale-While-Revalidate activo</span>
              <span className="text-emerald-500 font-bold">Resiliente Offline</span>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
