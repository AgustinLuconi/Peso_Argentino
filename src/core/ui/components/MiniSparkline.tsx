import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export interface MiniSparklineProps {
  data: number[];
  color?: 'bullish' | 'bearish' | 'gold' | 'navy' | 'auto';
  height?: number;
  width?: number | string;
  fill?: boolean;
  strokeWidth?: number;
  className?: string;
}

export const MiniSparkline: React.FC<MiniSparklineProps> = ({
  data,
  color = 'auto',
  height = 36,
  width = '100%',
  fill = true,
  strokeWidth = 2,
  className,
}) => {
  if (!data || data.length < 2) {
    return <div className="h-8 flex items-center text-xs text-outline">-</div>;
  }

  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min === 0 ? 1 : max - min;
  const padding = 2;

  const resolvedColor =
    color === 'auto'
      ? data[data.length - 1] >= data[0]
        ? 'bullish'
        : 'bearish'
      : color;

  const colorMap = {
    bullish: {
      stroke: '#115E59',
      fillStart: 'rgba(17, 94, 89, 0.25)',
      fillEnd: 'rgba(17, 94, 89, 0.0)',
    },
    bearish: {
      stroke: '#991B1B',
      fillStart: 'rgba(153, 27, 27, 0.25)',
      fillEnd: 'rgba(153, 27, 27, 0.0)',
    },
    gold: {
      stroke: '#C5A059',
      fillStart: 'rgba(197, 160, 89, 0.3)',
      fillEnd: 'rgba(197, 160, 89, 0.02)',
    },
    navy: {
      stroke: '#002347',
      fillStart: 'rgba(0, 35, 71, 0.25)',
      fillEnd: 'rgba(0, 35, 71, 0.01)',
    },
  };

  const currentTheme = colorMap[resolvedColor];
  const gradientId = React.useId();

  // Generate SVG coordinates
  const svgWidth = 120;
  const svgHeight = height;

  const points = data.map((val, idx) => {
    const x = (idx / (data.length - 1)) * (svgWidth - padding * 2) + padding;
    const y =
      svgHeight -
      ((val - min) / range) * (svgHeight - padding * 2) -
      padding;
    return { x, y };
  });

  const pathD = points.reduce((acc, curr, i) => {
    if (i === 0) return `M ${curr.x} ${curr.y}`;
    // Simple smooth bezier
    const prev = points[i - 1];
    const cpX1 = prev.x + (curr.x - prev.x) / 2;
    const cpY1 = prev.y;
    const cpX2 = prev.x + (curr.x - prev.x) / 2;
    const cpY2 = curr.y;
    return `${acc} C ${cpX1} ${cpY1}, ${cpX2} ${cpY2}, ${curr.x} ${curr.y}`;
  }, '');

  const areaD = `${pathD} L ${points[points.length - 1].x} ${svgHeight} L ${points[0].x} ${svgHeight} Z`;

  return (
    <div className={twMerge(clsx('inline-block overflow-hidden', className))} style={{ width }}>
      <svg
        viewBox={`0 0 ${svgWidth} ${svgHeight}`}
        className="w-full h-full overflow-visible"
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={currentTheme.fillStart} />
            <stop offset="100%" stopColor={currentTheme.fillEnd} />
          </linearGradient>
        </defs>

        {fill && <path d={areaD} fill={`url(#${gradientId})`} />}
        <path
          d={pathD}
          fill="none"
          stroke={currentTheme.stroke}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Latest point dot */}
        <circle
          cx={points[points.length - 1].x}
          cy={points[points.length - 1].y}
          r={strokeWidth * 1.3}
          fill={currentTheme.stroke}
        />
      </svg>
    </div>
  );
};
