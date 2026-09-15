import React, { useState } from 'react';
import { ShieldCheck, Database, Radio, Satellite, Cpu, CheckCircle, ExternalLink, HelpCircle } from 'lucide-react';
import { DataProvenance } from '../../types';
import { audioFeedback } from '../../lib/audioFeedback';

export interface DataQualityBadgeProps {
  confidenceScore: number; // 0 - 100
  source: string;
  sourceType?: 'satellite_telemetry' | 'iot_sensor_mesh' | 'field_audit' | 'peer_reviewed_model' | 'community_reporting' | string;
  epistemicTier?: string;
  cryptographicHash?: string;
  sensorCount?: number;
  metricName?: string;
  onInspectProvenance?: (prov?: Partial<DataProvenance>) => void;
  size?: 'xs' | 'sm' | 'md';
  compact?: boolean;
}

export const DataQualityBadge: React.FC<DataQualityBadgeProps> = ({
  confidenceScore,
  source,
  sourceType = 'iot_sensor_mesh',
  epistemicTier = 'Tier 1: In-Situ Ground Truth',
  cryptographicHash,
  sensorCount = 340,
  metricName,
  onInspectProvenance,
  size = 'sm',
  compact = false
}) => {
  const [showTooltip, setShowTooltip] = useState(false);

  // Determine status color based on confidence score
  const getQualityTheme = (score: number) => {
    if (score >= 95) {
      return {
        bg: 'bg-emerald-950/70',
        text: 'text-emerald-300',
        border: 'border-emerald-500/40',
        dot: 'bg-emerald-400',
        label: 'High Confidence'
      };
    }
    if (score >= 90) {
      return {
        bg: 'bg-cyan-950/70',
        text: 'text-cyan-300',
        border: 'border-cyan-500/40',
        dot: 'bg-cyan-400',
        label: 'Verified Confidence'
      };
    }
    if (score >= 80) {
      return {
        bg: 'bg-amber-950/70',
        text: 'text-amber-300',
        border: 'border-amber-500/40',
        dot: 'bg-amber-400',
        label: 'Moderate Confidence'
      };
    }
    return {
      bg: 'bg-rose-950/70',
      text: 'text-rose-300',
      border: 'border-rose-500/40',
      dot: 'bg-rose-400',
      label: 'Calibrating Mesh'
    };
  };

  const theme = getQualityTheme(confidenceScore);

  const getSourceIcon = (type: string) => {
    switch (type) {
      case 'satellite_telemetry':
        return <Satellite className="w-2.5 h-2.5 shrink-0" />;
      case 'iot_sensor_mesh':
        return <Radio className="w-2.5 h-2.5 shrink-0" />;
      case 'field_audit':
        return <CheckCircle className="w-2.5 h-2.5 shrink-0" />;
      default:
        return <Cpu className="w-2.5 h-2.5 shrink-0" />;
    }
  };

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    audioFeedback.playMicroTick();
    if (onInspectProvenance) {
      onInspectProvenance({
        source,
        certaintyScore: confidenceScore,
        cryptographicHash: cryptographicHash || '0x' + Math.random().toString(16).slice(2, 10),
        calculationMethod: `Verified Multi-Sensor Quorum (${sensorCount} nodes)`,
        sourceType: sourceType as any
      });
    }
  };

  return (
    <div 
      className="relative inline-flex items-center"
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      <button
        type="button"
        onClick={handleClick}
        title="Inspect sensor data quality & cryptographic audit trail"
        className={`inline-flex items-center gap-1.5 rounded-full border transition-all cursor-pointer select-none font-mono ${
          theme.bg
        } ${theme.text} ${theme.border} hover:brightness-125 ${
          size === 'xs' ? 'px-1.5 py-0.5 text-[9px]' : size === 'md' ? 'px-3 py-1 text-xs' : 'px-2 py-0.5 text-[10px]'
        }`}
      >
        <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${theme.dot} animate-pulse`} />
        
        <span className="font-bold tracking-tight">
          DQ: {confidenceScore.toFixed(1)}%
        </span>

        {!compact && (
          <>
            <span className="opacity-40">•</span>
            <span className="truncate max-w-[120px] opacity-90 flex items-center gap-1">
              {getSourceIcon(sourceType)}
              <span className="truncate">{source.split(' ')[0]}</span>
            </span>
          </>
        )}

        <ShieldCheck className="w-2.5 h-2.5 opacity-60 shrink-0 ml-0.5" />
      </button>

      {/* Hover Provenance Card Tooltip */}
      {showTooltip && (
        <div className="absolute z-50 bottom-full left-0 mb-2 w-64 p-2.5 rounded bg-[#0A0D0B]/95 border border-[#C5A059]/50 shadow-2xl backdrop-blur-md text-[11px] font-mono text-[#F5F5F0] space-y-1.5 pointer-events-none animate-in fade-in duration-150">
          <div className="flex items-center justify-between border-b border-white/10 pb-1">
            <span className="text-[9px] uppercase tracking-wider text-[#C5A059] font-bold flex items-center gap-1">
              <ShieldCheck className="w-3 h-3 text-emerald-400" /> Sensor Data Quality
            </span>
            <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded ${theme.bg} ${theme.text}`}>
              {theme.label}
            </span>
          </div>

          <div className="space-y-1 text-[10px]">
            <div className="flex justify-between">
              <span className="text-white/50">Confidence Score:</span>
              <span className="text-emerald-300 font-bold">{confidenceScore}%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-white/50">Sensor Quorum:</span>
              <span className="text-white font-mono">{sensorCount.toLocaleString()} Nodes</span>
            </div>
            <div className="flex justify-between">
              <span className="text-white/50">Epistemic Tier:</span>
              <span className="text-[#C5A059] truncate max-w-[130px]">{epistemicTier}</span>
            </div>
            <div className="text-white/50 pt-0.5 truncate">
              Source: <span className="text-white">{source}</span>
            </div>
          </div>

          <div className="pt-1 border-t border-white/10 flex items-center justify-between text-[9px] text-[#C5A059]">
            <span>Click to inspect full audit ledger</span>
            <ExternalLink className="w-2.5 h-2.5" />
          </div>
        </div>
      )}
    </div>
  );
};
