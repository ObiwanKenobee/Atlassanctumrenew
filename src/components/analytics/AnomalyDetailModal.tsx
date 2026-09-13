import React from 'react';
import { 
  AlertTriangle, 
  X, 
  Activity, 
  ShieldAlert, 
  TrendingDown, 
  Calendar, 
  ShieldCheck, 
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { HistoricalAnomalyEvent } from './flourishingAnalyticsData';
import { audioFeedback } from '../../lib/audioFeedback';

interface AnomalyDetailModalProps {
  anomaly: HistoricalAnomalyEvent | null;
  isOpen: boolean;
  onClose: () => void;
  onOpenMoralSimulator?: () => void;
}

export const AnomalyDetailModal: React.FC<AnomalyDetailModalProps> = ({
  anomaly,
  isOpen,
  onClose,
  onOpenMoralSimulator
}) => {
  if (!isOpen || !anomaly) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div 
        className="bg-[#0F0D0D] border border-rose-500/40 rounded-md w-full max-w-xl max-h-[90vh] overflow-y-auto shadow-2xl space-y-5 p-6 text-[#F5F5F0] font-sans"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-4 pb-4 border-b border-rose-500/20">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-rose-950 text-rose-300 border border-rose-500/40 flex items-center gap-1 uppercase">
                <AlertTriangle className="w-3 h-3 text-rose-400" />
                SYSTEM STRESS ANOMALY
              </span>
              <span className="text-[10px] font-mono text-rose-400 font-bold bg-rose-950/60 px-1.5 py-0.2 rounded border border-rose-500/20">
                {anomaly.deviationScore}σ Deviation
              </span>
              <span className="text-[10px] font-mono text-[#F5F5F0]/50">
                {anomaly.shortMonth} ({anomaly.calendarMonth})
              </span>
            </div>

            <h2 className="text-xl font-serif text-[#F5F5F0] pt-1">
              {anomaly.title}
            </h2>
            <div className="text-xs font-mono text-rose-300/80">
              {anomaly.stressType}
            </div>
          </div>

          <button
            onClick={() => {
              audioFeedback.playMicroTick();
              onClose();
            }}
            className="p-1.5 rounded bg-[#1C1616] hover:bg-[#2A1F1F] text-[#F5F5F0]/60 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Statistical Moving Average Comparison */}
        <div className="grid grid-cols-3 gap-2 font-mono text-xs">
          <div className="p-3 bg-[#140F0F] rounded border border-rose-500/20 space-y-1">
            <div className="text-[10px] text-neutral-400 uppercase">Observed Value</div>
            <div className="text-lg font-bold text-white">{anomaly.actualValue}%</div>
            <div className="text-[9px] text-neutral-500">Real-time sensor reading</div>
          </div>

          <div className="p-3 bg-[#140F0F] rounded border border-rose-500/20 space-y-1">
            <div className="text-[10px] text-neutral-400 uppercase">3-Mo Moving Avg</div>
            <div className="text-lg font-bold text-cyan-300">{anomaly.movingAverage}%</div>
            <div className="text-[9px] text-neutral-500">Expected trend baseline</div>
          </div>

          <div className="p-3 bg-[#140F0F] rounded border border-rose-500/20 space-y-1">
            <div className="text-[10px] text-neutral-400 uppercase">Variance Delta</div>
            <div className={`text-lg font-bold ${anomaly.movingAvgDelta < 0 ? 'text-rose-400' : 'text-emerald-400'}`}>
              {anomaly.movingAvgDelta > 0 ? `+${anomaly.movingAvgDelta}` : anomaly.movingAvgDelta}%
            </div>
            <div className="text-[9px] text-neutral-500">Z-Score: {anomaly.deviationScore}σ</div>
          </div>
        </div>

        {/* Biophysical Root Cause Breakdown */}
        <div className="space-y-2">
          <div className="text-xs font-mono uppercase tracking-wider text-[#C5A059] font-bold">
            Biophysical Root Cause Analysis
          </div>
          <div className="p-3 bg-[#140E0E] rounded border border-rose-500/30 text-xs text-[#F5F5F0]/90 leading-relaxed font-mono">
            {anomaly.biophysicalDriver}
          </div>
        </div>

        {/* Automated System Safeguards Triggered */}
        <div className="space-y-2">
          <div className="text-xs font-mono uppercase tracking-wider text-emerald-400 font-bold flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            Active Ecosystem Buffer Safeguards
          </div>
          <div className="p-3 bg-[#0C120E] rounded border border-emerald-500/30 text-xs text-emerald-200/90 leading-relaxed font-mono">
            {anomaly.safeguardTriggered}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="pt-4 border-t border-[#F5F5F0]/10 flex items-center justify-between gap-3 font-mono">
          <div className="text-[10px] text-[#F5F5F0]/50">
            Automated outlier classification via rolling 90-day moving window.
          </div>

          <div className="flex items-center gap-2">
            {onOpenMoralSimulator && (
              <button
                onClick={() => {
                  audioFeedback.playCovenantResonance();
                  onOpenMoralSimulator();
                  onClose();
                }}
                className="py-2 px-3 rounded bg-[#C5A059] hover:bg-[#D4AF37] text-black text-xs font-bold transition-all flex items-center gap-1.5"
              >
                <span>Stress Test in Simulator</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
            <button
              onClick={onClose}
              className="py-2 px-4 rounded bg-[#181818] hover:bg-[#222222] text-[#F5F5F0]/70 hover:text-white border border-[#F5F5F0]/15 text-xs font-bold transition-colors"
            >
              Dismiss
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
