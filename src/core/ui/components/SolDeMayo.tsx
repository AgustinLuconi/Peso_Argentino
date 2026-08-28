import React from 'react';

export interface SolDeMayoProps {
  size?: number;
  className?: string;
}

/**
 * Emblema Histórico y Patrio: Sol de Mayo (Sol Incaico de la Primera Moneda Patria de 1813).
 * Renderizado en SVG de alta precisión con 32 rayos radiantes y detalles dorados / esmeralda neón.
 */
export const SolDeMayo: React.FC<SolDeMayoProps> = ({ size = 26, className = '' }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`shrink-0 transition-transform duration-300 hover:rotate-45 ${className}`}
      aria-label="Sol de Mayo Patrio Argentino"
    >
      <defs>
        {/* Gradiente Solar Dorado Luminoso */}
        <radialGradient id="sunGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#FFF176" />
          <stop offset="60%" stopColor="#FBC02D" />
          <stop offset="100%" stopColor="#F57F17" />
        </radialGradient>
        {/* Sombra sutil para profundidad */}
        <filter id="sunDrop" x="-10%" y="-10%" width="120%" height="120%">
          <feDropShadow dx="0" dy="1" stdDeviation="1.5" floodColor="#B45309" floodOpacity="0.4" />
        </filter>
      </defs>

      {/* Rayos del Sol de Mayo (16 Rectos y 16 Flamígeros Ondulados) */}
      <g filter="url(#sunDrop)">
        {/* Rayos Rectos Principales (0°, 45°, 90°, 135°, 180°, 225°, 270°, 315°) y Secundarios */}
        {[0, 22.5, 45, 67.5, 90, 112.5, 135, 157.5, 180, 202.5, 225, 247.5, 270, 292.5, 315, 337.5].map((angle, i) => (
          <g key={`straight-${i}`} transform={`rotate(${angle} 50 50)`}>
            <polygon points="50,4 47,30 53,30" fill="url(#sunGlow)" />
          </g>
        ))}

        {/* Rayos Flamígeros / Ondulados Alternados */}
        {[11.25, 33.75, 56.25, 78.75, 101.25, 123.75, 146.25, 168.75, 191.25, 213.75, 236.25, 258.75, 281.25, 303.75, 326.25, 348.75].map((angle, i) => (
          <g key={`flame-${i}`} transform={`rotate(${angle} 50 50)`}>
            <path
              d="M 50,7 Q 45,18 51,25 Q 54,28 50,32 L 48,32 Q 44,26 47,19 Z"
              fill="#F59E0B"
            />
          </g>
        ))}
      </g>

      {/* Disco Central Solar */}
      <circle cx="50" cy="50" r="21" fill="url(#sunGlow)" stroke="#D97706" strokeWidth="1.5" />

      {/* Rasgos Faciales del Sol Incaico (Ojos, Nariz, Boca y Pómulos) */}
      {/* Cejas */}
      <path d="M 40,43 Q 44,41 48,43" stroke="#B45309" strokeWidth="1.2" strokeLinecap="round" fill="none" />
      <path d="M 52,43 Q 56,41 60,43" stroke="#B45309" strokeWidth="1.2" strokeLinecap="round" fill="none" />

      {/* Ojos */}
      <ellipse cx="44" cy="46" rx="2.5" ry="1.6" fill="#78350F" />
      <ellipse cx="56" cy="46" rx="2.5" ry="1.6" fill="#78350F" />
      <circle cx="44.8" cy="45.5" r="0.8" fill="#FFFFFF" />
      <circle cx="56.8" cy="45.5" r="0.8" fill="#FFFFFF" />

      {/* Nariz */}
      <path d="M 50,46 L 48.5,53 L 51.5,53 Z" fill="#D97706" />

      {/* Boca Serena / Pacífica */}
      <path d="M 44,57 Q 50,61 56,57" stroke="#78350F" strokeWidth="1.4" strokeLinecap="round" fill="none" />
      <path d="M 47,60 Q 50,62 53,60" stroke="#B45309" strokeWidth="0.8" strokeLinecap="round" fill="none" />

      {/* Pómulos radiantes */}
      <circle cx="39" cy="52" r="2.2" fill="#F87171" fillOpacity="0.35" />
      <circle cx="61" cy="52" r="2.2" fill="#F87171" fillOpacity="0.35" />
    </svg>
  );
};
