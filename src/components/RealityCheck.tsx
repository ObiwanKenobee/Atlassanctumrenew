import React, { useState } from 'react';
import { 
  ShieldCheck, 
  AlertTriangle, 
  HelpCircle, 
  ExternalLink, 
  Lock, 
  Activity, 
  CheckCircle2, 
  Database,
  Info,
  ChevronDown,
  ChevronUp,
  Cpu
} from 'lucide-react';
import { RealityCheckData, EpistemicStatus } from '../types';
import { audioFeedback } from '../lib/audioFeedback';

interface RealityCheckProps {
  data: RealityCheckData;
  compact?: boolean;
  className?: string;
  onOpenAuditTrail?: () => void;
}

export const RealityCheck: React.FC<RealityCheckProps> = ({
  data,
  compact = false,
  className = '',
  onOpenAuditTrail
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const getStatusBadge = (status: EpistemicStatus) => {
    switch (status) {
      case 'observed':
        return {
          label: 'Observed (Ground Sensor)',
          bg: 'bg-emerald-950/80 text-emerald-300 border-emerald-500/40',
          icon: Activity
        };
      case 'verified':
        return {
          label: 'Cryptographically Verified',
          bg: 'bg-sky-950/80 text-sky-300 border-sky-500/40',
          icon: ShieldCheck
        };
      case 'modeled':
        return {
          label: 'Causal Simulation Model',
          bg: 'bg-amber-950/80 text-amber-300 border-amber-500/40',
          icon: Cpu
        };
      case 'reported':
        return {
          label: 'Community Reported',
          bg: 'bg-purple-950/80 text-purple-300 border-purple-500/40',
          icon: Database
        };
      case 'estimated':
      default:
        return {
          label: 'Estimated / Derivative',
          bg: 'bg-zinc-800 text-zinc-300 border-zinc-600/40',
          icon: AlertTriangle
        };
    }
  };

  const badge = getStatusBadge(data.status);
  const Icon = badge.icon;

  if (compact) {
    return (
      <div className={`relative inline-block ${className}`}>
        <button
          onClick={() => {
            setIsExpanded(!isExpanded);
            audioFeedback.playMicroTick();
          }}
          className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-sm text-[10px] font-mono border transition-all cursor-pointer ${badge.bg} hover:brightness-110`}
          title="Click to inspect Reality Check epistemic provenance"
        >
          <Icon className="w-3 h-3" />
          <span className="font-semibold uppercase tracking-wider">{data.status}</span>
          <span className="text-[9px] opacity-75">({data.confidenceScore}%)</span>
        </button>

        {isExpanded && (
          <div className="absolute left-0 top-full mt-1 z-50 w-72 sm:w-80 p-3.5 bg-[#0D0D0D] border border-[#C5A059]/40 rounded-sm shadow-2xl text-left font-sans text-xs space-y-2.5 backdrop-blur-md">
            <div className="flex items-center justify-between border-b border-[#F5F5F0]/10 pb-2">
              <div className="flex items-center gap-1.5 font-mono text-[10px] text-[#C5A059] uppercase tracking-wider font-bold">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Epistemic Reality Check</span>
              </div>
              <button 
                onClick={() => setIsExpanded(false)}
                className="text-[#F5F5F0]/50 hover:text-white text-[10px]"
              >
                ✕
              </button>
            </div>

            <div className="space-y-1 text-[#F5F5F0]/80">
              <div className="flex justify-between text-[11px] font-mono">
                <span className="text-[#F5F5F0]/50">Epistemic Tier:</span>
                <span className="text-white font-semibold">{data.epistemicTier}</span>
              </div>
              <div className="flex justify-between text-[11px] font-mono">
                <span className="text-[#F5F5F0]/50">Uncertainty Bound:</span>
                <span className="text-amber-400 font-semibold">{data.uncertaintyMargin}</span>
              </div>
              <div className="flex justify-between text-[11px] font-mono">
                <span className="text-[#F5F5F0]/50">Confidence Score:</span>
                <span className="text-emerald-400 font-semibold">{data.confidenceScore}%</span>
              </div>
              {data.sensorHealth !== undefined && (
                <div className="flex justify-between text-[11px] font-mono">
                  <span className="text-[#F5F5F0]/50">Sensor Mesh Health:</span>
                  <span className="text-sky-400 font-semibold">{data.sensorHealth}%</span>
                </div>
              )}
            </div>

            {/* Reality vs Model Notice */}
            <div className="p-2 bg-amber-950/40 border border-amber-500/20 rounded-xs text-[10px] text-amber-200/90 font-mono flex items-start gap-1.5">
              <Info className="w-3.5 h-3.5 shrink-0 text-amber-400 mt-0.5" />
              <span>
                {data.realityVsModelWarning || 
                  'Commandment II: We never confuse mathematical simulation with ground-truth biophysical reality.'}
              </span>
            </div>

            <div className="pt-1.5 border-t border-[#F5F5F0]/10 flex items-center justify-between text-[9px] font-mono text-[#F5F5F0]/50">
              <span className="truncate max-w-[150px]">Hash: {data.cryptographicHash.slice(0, 14)}...</span>
              {onOpenAuditTrail && (
                <button
                  onClick={() => {
                    setIsExpanded(false);
                    onOpenAuditTrail();
                    audioFeedback.playCovenantResonance();
                  }}
                  className="text-[#C5A059] hover:underline flex items-center gap-1 font-semibold"
                >
                  <span>Full Audit</span>
                  <ExternalLink className="w-2.5 h-2.5" />
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    );
  }

  // Full Card Mode
  return (
    <div className={`p-4 bg-[#0A0A0A] border border-[#F5F5F0]/15 rounded-sm space-y-3 ${className}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-sm text-xs font-mono border ${badge.bg}`}>
            <Icon className="w-3.5 h-3.5" />
            <span className="font-bold uppercase tracking-wider">{badge.label}</span>
          </span>
          <span className="text-xs font-mono text-[#F5F5F0]/50">
            Confidence: <span className="text-emerald-400 font-bold">{data.confidenceScore}%</span>
          </span>
        </div>

        <button
          onClick={() => {
            setIsExpanded(!isExpanded);
            audioFeedback.playMicroTick();
          }}
          className="text-xs font-mono text-[#C5A059] hover:underline flex items-center gap-1 cursor-pointer"
        >
          <span>{isExpanded ? 'Hide Epistemic Trace' : 'Inspect Reality Check'}</span>
          {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-mono bg-[#141414] p-3 rounded-sm border border-[#F5F5F0]/5">
        <div>
          <span className="text-[10px] text-[#F5F5F0]/40 uppercase block">Data Origin</span>
          <span className="text-[#F5F5F0] font-semibold truncate block">{data.dataOrigin}</span>
        </div>
        <div>
          <span className="text-[10px] text-[#F5F5F0]/40 uppercase block">Uncertainty</span>
          <span className="text-amber-400 font-semibold">{data.uncertaintyMargin}</span>
        </div>
        <div>
          <span className="text-[10px] text-[#F5F5F0]/40 uppercase block">Verified By</span>
          <span className="text-[#8FB8DE] font-semibold truncate block">{data.verifiedBy}</span>
        </div>
        <div>
          <span className="text-[10px] text-[#F5F5F0]/40 uppercase block">Last Sync</span>
          <span className="text-emerald-400 font-semibold">{data.lastVerified}</span>
        </div>
      </div>

      {isExpanded && (
        <div className="space-y-3 pt-2 border-t border-[#F5F5F0]/10 text-xs font-sans text-[#F5F5F0]/80">
          <div className="p-3 bg-amber-950/30 border border-amber-500/25 rounded-sm space-y-1">
            <div className="text-[11px] font-mono font-bold text-amber-300 uppercase tracking-wider flex items-center gap-1.5">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
              <span>Epistemic Boundary & Reality-Model Separation</span>
            </div>
            <p className="text-xs text-amber-100/80 leading-relaxed font-serif">
              {data.realityVsModelWarning || 
                'In accordance with Commandment II (Reality Above Model), all mathematical derivatives and AI inferences are explicitly demoted relative to empirical sensor ground truth.'}
            </p>
          </div>

          {data.assumptions && data.assumptions.length > 0 && (
            <div className="space-y-1 font-mono text-[11px]">
              <span className="text-[#C5A059] font-bold uppercase tracking-wider text-[10px] block">
                Model Assumptions & Epistemic Boundaries:
              </span>
              <ul className="list-disc pl-4 space-y-0.5 text-[#F5F5F0]/70">
                {data.assumptions.map((assump, idx) => (
                  <li key={idx}>{assump}</li>
                ))}
              </ul>
            </div>
          )}

          <div className="flex items-center justify-between text-[10px] font-mono text-[#F5F5F0]/50 pt-2 border-t border-[#F5F5F0]/5">
            <div className="flex items-center gap-1.5">
              <Lock className="w-3 h-3 text-[#C5A059]" />
              <span className="font-mono">Audit Hash: {data.cryptographicHash}</span>
            </div>
            {onOpenAuditTrail && (
              <button
                onClick={onOpenAuditTrail}
                className="px-2.5 py-1 bg-[#1B3022] hover:bg-[#254530] border border-[#C5A059]/40 text-[#F5F5F0] rounded-xs text-[10px] font-mono font-bold uppercase tracking-wider transition-colors flex items-center gap-1"
              >
                <ShieldCheck className="w-3 h-3 text-emerald-400" />
                <span>Open Full Ledger Trace</span>
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
