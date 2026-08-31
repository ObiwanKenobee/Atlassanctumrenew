import React from 'react';
import {
  TrendingUp,
  Activity,
  Layers,
  Sparkles,
  ShieldCheck,
  Calendar,
  Zap,
  Info
} from 'lucide-react';
import { KnowledgeNode } from './BioregionalKnowledgeGraph';

interface NodeQuickLookPopoverProps {
  node: KnowledgeNode | null;
  position: { x: number; y: number } | null;
}

export const NodeQuickLookPopover: React.FC<NodeQuickLookPopoverProps> = ({
  node,
  position
}) => {
  if (!node || !position) return null;

  // Generate synthetic historic trend points based on node metric & confidence
  const historicalTrend = React.useMemo(() => {
    const baseVal = node.confidenceScore || 85;
    return [
      { year: '2016', value: Math.max(45, Math.round(baseVal * 0.72)) },
      { year: '2019', value: Math.max(52, Math.round(baseVal * 0.79)) },
      { year: '2022', value: Math.max(65, Math.round(baseVal * 0.88)) },
      { year: '2024', value: Math.max(74, Math.round(baseVal * 0.94)) },
      { year: '2026', value: baseVal }
    ];
  }, [node]);

  const minVal = Math.min(...historicalTrend.map(t => t.value));
  const maxVal = Math.max(...historicalTrend.map(t => t.value));
  const range = maxVal - minVal || 1;

  // SVG Sparkline coordinates
  const sparkWidth = 140;
  const sparkHeight = 36;
  const points = historicalTrend.map((d, i) => {
    const x = (i / (historicalTrend.length - 1)) * sparkWidth;
    const y = sparkHeight - ((d.value - minVal) / range) * (sparkHeight - 8) - 4;
    return `${x},${y}`;
  }).join(' ');

  // Compute position relative to viewport / container
  const popoverStyle: React.CSSProperties = {
    position: 'absolute',
    left: `${Math.min(window.innerWidth - 260, Math.max(20, position.x + 18))}px`,
    top: `${Math.max(20, position.y - 40)}px`,
    pointerEvents: 'none',
    zIndex: 40
  };

  return (
    <div
      style={popoverStyle}
      className="bg-[#121212]/95 backdrop-blur-md border border-[#C5A059]/40 rounded p-3 shadow-2xl w-60 text-[#F5F5F0] animate-in fade-in zoom-in-95 duration-150"
    >
      {/* Top Header */}
      <div className="flex items-center justify-between gap-2 mb-1.5">
        <span
          className="text-[9px] font-mono px-1.5 py-0.2 rounded uppercase font-bold border"
          style={{
            backgroundColor: `${node.color}20`,
            color: node.color,
            borderColor: `${node.color}40`
          }}
        >
          {node.categoryName}
        </span>
        <span className="text-[9px] font-mono text-[#F5F5F0]/50">
          Era: {node.era}
        </span>
      </div>

      {/* Node Name */}
      <div className="text-xs font-serif font-bold text-[#F5F5F0] truncate mb-0.5">
        {node.label}
      </div>

      {/* Layer Tag */}
      <div className="text-[10px] font-mono text-[#C5A059] mb-2 flex items-center gap-1">
        <Layers className="w-2.5 h-2.5" />
        <span className="truncate">{node.ecologicalLayer}</span>
      </div>

      {/* Metric Highlight */}
      <div className="p-2 bg-[#1A1A1A] border border-[#F5F5F0]/10 rounded flex items-center justify-between mb-2">
        <div>
          <div className="text-[8px] font-mono uppercase text-[#F5F5F0]/40">Active Metric</div>
          <div className="text-xs font-mono font-bold text-[#34D399]">{node.metric || 'Ground-Truthed'}</div>
        </div>
        <div className="text-right">
          <div className="text-[8px] font-mono uppercase text-[#F5F5F0]/40">Confidence</div>
          <div className="text-xs font-mono font-bold text-[#C5A059]">{node.confidenceScore || 90}%</div>
        </div>
      </div>

      {/* Sparkline Trend */}
      <div className="space-y-1">
        <div className="flex items-center justify-between text-[8px] font-mono text-[#F5F5F0]/40 uppercase">
          <span className="flex items-center gap-0.5">
            <TrendingUp className="w-2.5 h-2.5 text-emerald-400" /> Decadal Integrity Trend
          </span>
          <span>+28% Net</span>
        </div>

        {/* SVG Sparkline */}
        <div className="bg-[#0A0A0A] rounded p-1 border border-[#F5F5F0]/5 flex items-center justify-center">
          <svg width={sparkWidth} height={sparkHeight} className="overflow-visible">
            <defs>
              <linearGradient id={`grad-${node.id}`} x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor={node.color} stopOpacity="0.4" />
                <stop offset="100%" stopColor={node.color} stopOpacity="0.0" />
              </linearGradient>
            </defs>
            <polyline
              fill="none"
              stroke={node.color}
              strokeWidth="2"
              points={points}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            {/* End Point Dot */}
            {historicalTrend.length > 0 && (
              <circle
                cx={sparkWidth}
                cy={sparkHeight - ((historicalTrend[historicalTrend.length - 1].value - minVal) / range) * (sparkHeight - 8) - 4}
                r="3"
                fill={node.color}
              />
            )}
          </svg>
        </div>
        <div className="flex justify-between text-[8px] font-mono text-[#F5F5F0]/30 px-0.5">
          <span>2016</span>
          <span>2021</span>
          <span>2026 (Live)</span>
        </div>
      </div>
    </div>
  );
};
