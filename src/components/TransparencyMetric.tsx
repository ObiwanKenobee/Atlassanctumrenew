import React, { useState } from 'react';
import { 
  CheckCircle2, 
  FileText, 
  Radio, 
  AlertCircle, 
  Copy, 
  Check, 
  ExternalLink, 
  ShieldCheck, 
  Info,
  Calendar,
  Layers,
  Sparkles,
  AlertTriangle
} from 'lucide-react';
import { audioFeedback } from '../lib/audioFeedback';
import { useUncertaintyOverlay } from '../context/UncertaintyOverlayContext';

export type ProvenanceLabel = 'Verified' | 'Documented' | 'Reported' | 'Modeled' | 'Estimated';

export interface TransparencyMetricProps {
  label: string;
  value: string | number;
  unit?: string;
  provenance: ProvenanceLabel;
  source: string;
  date: string;
  certaintyScore?: number; // 0 - 100
  uncertaintyMargin?: string; // e.g. "± 1.5%"
  verifier?: string;
  cryptographicHash?: string;
  description?: string;
  compact?: boolean;
  onInspectProvenance?: (metricData: any) => void;
  className?: string;
}

export const TransparencyMetric: React.FC<TransparencyMetricProps> = ({
  label,
  value,
  unit,
  provenance,
  source,
  date,
  certaintyScore = 95,
  uncertaintyMargin,
  verifier,
  cryptographicHash,
  description,
  compact = false,
  onInspectProvenance,
  className = ''
}) => {
  const [copied, setCopied] = useState(false);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const { isOverlayActive, classifyMetric } = useUncertaintyOverlay();

  const uncertainty = classifyMetric(certaintyScore, provenance, source);

  const getProvenanceBadgeStyle = (type: ProvenanceLabel) => {
    switch (type) {
      case 'Verified':
        return {
          bg: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400',
          dot: 'bg-emerald-400',
          icon: ShieldCheck,
          meaning: 'Independently audited by in-situ sensors or accredited third-party field verifiers.'
        };
      case 'Documented':
        return {
          bg: 'bg-cyan-500/10 border-cyan-500/30 text-cyan-400',
          dot: 'bg-cyan-400',
          icon: FileText,
          meaning: 'Backed by primary source documentation, signed receipts, or photographic logs.'
        };
      case 'Reported':
        return {
          bg: 'bg-amber-500/10 border-amber-500/30 text-amber-400',
          dot: 'bg-amber-400',
          icon: Radio,
          meaning: 'Self-reported by community project leads; awaiting scheduled verification audit.'
        };
      case 'Modeled':
        return {
          bg: 'bg-purple-500/10 border-purple-500/30 text-purple-400',
          dot: 'bg-purple-400',
          icon: Layers,
          meaning: 'Derived through algorithmic or counterfactual biophysical simulation models.'
        };
      case 'Estimated':
      default:
        return {
          bg: 'bg-[#F5F5F0]/10 border-[#F5F5F0]/20 text-[#F5F5F0]/60',
          dot: 'bg-[#F5F5F0]/40',
          icon: Info,
          meaning: 'Initial heuristic estimation prior to formal baseline measurement.'
        };
    }
  };

  const badgeConfig = getProvenanceBadgeStyle(provenance);
  const BadgeIcon = badgeConfig.icon;

  const handleCopyHash = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (cryptographicHash) {
      navigator.clipboard.writeText(cryptographicHash);
      setCopied(true);
      audioFeedback.playSubtleClick();
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleInspect = (e: React.MouseEvent) => {
    e.stopPropagation();
    audioFeedback.playSubtleClick();
    if (onInspectProvenance) {
      onInspectProvenance({
        label,
        value: `${value}${unit ? ' ' + unit : ''}`,
        provenance,
        source,
        date,
        certaintyScore,
        uncertaintyMargin,
        verifier,
        cryptographicHash,
        description
      });
    } else {
      setDetailsOpen(!detailsOpen);
    }
  };

  if (compact) {
    return (
      <div 
        onClick={handleInspect}
        className={`group relative inline-flex items-center gap-2 px-2.5 py-1 rounded-sm bg-[#141414] border transition-all cursor-pointer ${
          isOverlayActive ? `${uncertainty.borderColor} ${uncertainty.overlayGlow}` : 'border-[#F5F5F0]/10 hover:border-[#F5F5F0]/30'
        } ${className}`}
        title={`Provenance: ${provenance} • ${source} (${date}) • Certainty: ${certaintyScore}%`}
      >
        <span className="text-[11px] font-mono text-[#F5F5F0]/70">{label}:</span>
        <span className="text-xs font-mono font-bold text-[#F5F5F0]">
          {value}{unit && <span className="text-[10px] text-[#F5F5F0]/50 ml-0.5">{unit}</span>}
        </span>
        <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[9px] font-mono uppercase font-bold border ${badgeConfig.bg}`}>
          <span className={`w-1.5 h-1.5 rounded-full ${badgeConfig.dot}`} />
          {provenance}
        </span>
        {isOverlayActive && (
          <span className={`text-[8px] font-mono px-1 py-0.2 rounded uppercase font-bold ${uncertainty.badgeBg} ${uncertainty.badgeText}`}>
            {uncertainty.level}
          </span>
        )}
      </div>
    );
  }

  return (
    <div className={`p-4 bg-[#0A0A0A] border rounded-sm transition-all space-y-3 relative group ${
      isOverlayActive ? `${uncertainty.borderColor} ${uncertainty.overlayGlow}` : 'border-[#F5F5F0]/10 hover:border-[#F5F5F0]/20'
    } ${className}`}>
      
      {/* Uncertainty Overlay Active Top Banner */}
      {isOverlayActive && (
        <div className={`-mt-1 -mx-1 px-2.5 py-1 rounded-t-xs flex items-center justify-between text-[9px] font-mono uppercase font-bold border-b ${uncertainty.badgeBg} ${uncertainty.badgeText}`}>
          <div className="flex items-center gap-1.5">
            <AlertTriangle className="w-3 h-3 shrink-0" />
            <span>{uncertainty.label}</span>
          </div>
          <span className="font-bold">{uncertainty.margin}</span>
        </div>
      )}

      {/* Header with Title & Provenance Badge */}
      <div className="flex items-start justify-between gap-2">
        <div>
          <span className="text-[11px] font-mono text-[#F5F5F0]/50 uppercase tracking-wider block">{label}</span>
          <div className="flex items-baseline gap-1 mt-0.5">
            <span className="text-2xl font-mono font-bold text-[#F5F5F0] tracking-tight">{value}</span>
            {unit && <span className="text-xs font-mono text-[#F5F5F0]/60">{unit}</span>}
          </div>
        </div>

        <button 
          onClick={handleInspect}
          className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-mono uppercase tracking-wider font-semibold border transition-all ${badgeConfig.bg} hover:brightness-110`}
        >
          <BadgeIcon className="w-3 h-3" />
          <span>{provenance}</span>
        </button>
      </div>

      {description && (
        <p className="text-xs text-[#F5F5F0]/70 font-sans leading-relaxed">
          {description}
        </p>
      )}

      {/* Epistemic Humility Notice when Overlay Active */}
      {isOverlayActive && (
        <div className="p-2 rounded bg-[#141414] border border-[#F5F5F0]/10 text-[10px] font-sans text-[#F5F5F0]/75 flex items-start gap-1.5">
          <Info className="w-3 h-3 text-[#C5A059] shrink-0 mt-0.5" />
          <span>{uncertainty.humilityNotice}</span>
        </div>
      )}

      {/* Provenance Metadata Strip */}
      <div className="pt-2 border-t border-[#F5F5F0]/10 flex flex-wrap items-center justify-between gap-y-1 text-[10px] font-mono text-[#F5F5F0]/60">
        <div className="flex items-center gap-1.5 truncate max-w-[70%]">
          <span className="text-[#F5F5F0]/40">Source:</span>
          <span className="text-[#F5F5F0]/80 truncate" title={source}>{source}</span>
        </div>

        <div className="flex items-center gap-1 text-[#F5F5F0]/50">
          <Calendar className="w-3 h-3" />
          <span>{date}</span>
        </div>
      </div>

      {/* Extra Detail Row with Certainty & Hash */}
      <div className="flex items-center justify-between pt-1 text-[10px] font-mono text-[#F5F5F0]/50">
        <div className="flex items-center gap-2">
          <span>Confidence: <strong className="text-emerald-400">{certaintyScore}%</strong></span>
          {uncertaintyMargin && <span className="text-[#F5F5F0]/40">({uncertaintyMargin})</span>}
        </div>

        {cryptographicHash ? (
          <button 
            onClick={handleCopyHash}
            className="flex items-center gap-1 text-[9px] text-[#F5F5F0]/40 hover:text-[#C5A059] transition-colors"
            title="Copy cryptographic proof hash"
          >
            {copied ? (
              <>
                <Check className="w-2.5 h-2.5 text-emerald-400" />
                <span className="text-emerald-400">Copied</span>
              </>
            ) : (
              <>
                <Copy className="w-2.5 h-2.5" />
                <span>{cryptographicHash.slice(0, 8)}...</span>
              </>
            )}
          </button>
        ) : (
          verifier && <span className="truncate max-w-[120px] text-[#F5F5F0]/40">Auditor: {verifier}</span>
        )}
      </div>

      {/* Expandable inline modal view if triggered locally */}
      {detailsOpen && (
        <div className="mt-3 p-3 bg-[#141414] border border-[#F5F5F0]/20 rounded-sm text-xs space-y-2 animate-fadeIn">
          <div className="flex items-center justify-between pb-1 border-b border-[#F5F5F0]/10">
            <span className="font-mono text-[10px] text-[#C5A059] uppercase font-bold">Evidence Ledger Provenance</span>
            <button 
              onClick={() => setDetailsOpen(false)}
              className="text-[#F5F5F0]/40 hover:text-[#F5F5F0] text-[10px]"
            >
              ✕
            </button>
          </div>
          <p className="text-[11px] text-[#F5F5F0]/80">{badgeConfig.meaning}</p>
          <div className="space-y-1 text-[10px] font-mono text-[#F5F5F0]/60">
            <div><strong>Verification Authority:</strong> {verifier || 'Independent Bioregional Verifier Mesh'}</div>
            <div><strong>Collected / Audited:</strong> {date}</div>
            <div><strong>Primary Sensor/Method:</strong> {source}</div>
            {cryptographicHash && (
              <div className="break-all"><strong>Proof Hash:</strong> {cryptographicHash}</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
