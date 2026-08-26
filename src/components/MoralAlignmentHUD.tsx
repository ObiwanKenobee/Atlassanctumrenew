import React, { useState, useMemo } from 'react';
import { 
  ShieldCheck, 
  Sparkles, 
  ChevronDown, 
  Scale, 
  Leaf, 
  Brain, 
  CheckCircle2, 
  Layers, 
  ExternalLink,
  Lock,
  Compass,
  Zap
} from 'lucide-react';
import { ATLAS_FIELD_LABS, EVIDENCE_LEDGER_ENTRIES } from '../data/prompt2CivilizationData';
import { audioFeedback } from '../lib/audioFeedback';

interface MoralAlignmentHUDProps {
  className?: string;
  onOpenMoralSimulator?: () => void;
  onOpenEvidenceLedger?: () => void;
}

export const MoralAlignmentHUD: React.FC<MoralAlignmentHUDProps> = ({
  className = '',
  onOpenMoralSimulator,
  onOpenEvidenceLedger
}) => {
  const [isOpen, setIsOpen] = useState(false);

  // Compute live Moral Alignment based on active missions and evidence ledger
  const { 
    overallScore, 
    ecologicalScore, 
    stewardshipScore, 
    epistemicScore, 
    generationalScore,
    activeMissionsCount,
    verifiedLedgerCount,
    totalLedgerCount
  } = useMemo(() => {
    // 1. Mission factors
    const missions = ATLAS_FIELD_LABS || [];
    const activeCount = missions.length;

    // 2. Evidence ledger factors
    const ledger = EVIDENCE_LEDGER_ENTRIES || [];
    const totalLedger = ledger.length;
    const verified = ledger.filter(l => l.epistemicStatus === 'Verified' || l.confidenceScore >= 95);
    const verificationRatio = totalLedger > 0 ? (verified.length / totalLedger) * 100 : 96;

    // 3. Sub-pillar weighted computations
    const eco = Math.min(99.4, 94.5 + (verificationRatio * 0.05));
    const steward = 96.5;
    const epistemic = Math.min(99.8, 92 + (verified.length * 1.2));
    const generational = 95.2;

    const composite = (eco * 0.35) + (steward * 0.25) + (epistemic * 0.25) + (generational * 0.15);

    return {
      overallScore: Number(composite.toFixed(1)),
      ecologicalScore: Number(eco.toFixed(1)),
      stewardshipScore: Number(steward.toFixed(1)),
      epistemicScore: Number(epistemic.toFixed(1)),
      generationalScore: Number(generational.toFixed(1)),
      activeMissionsCount: activeCount,
      verifiedLedgerCount: verified.length,
      totalLedgerCount: totalLedger
    };
  }, []);

  const handleToggle = () => {
    audioFeedback.playMicroTick();
    setIsOpen(!isOpen);
  };

  // Radial calculation
  const radius = 13;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (overallScore / 100) * circumference;

  return (
    <div className={`relative inline-block ${className}`}>
      {/* Top-Right Pill Trigger */}
      <button
        id="moral-alignment-hud-trigger"
        onClick={handleToggle}
        className={`group flex items-center gap-2 px-2.5 sm:px-3 py-1.5 min-h-[36px] sm:min-h-[38px] rounded-full border transition-all duration-200 cursor-pointer ${
          isOpen
            ? 'bg-[#1C1C1C] border-[#C5A059] shadow-[0_0_15px_rgba(197,160,89,0.25)] text-[#F5F5F0]'
            : 'bg-[#101010] hover:bg-[#181818] border-[#C5A059]/40 hover:border-[#C5A059] text-[#F5F5F0]/90'
        }`}
        aria-label="View Moral Alignment Score Telemetry"
      >
        {/* Radial Arc Gauge */}
        <div className="relative w-6 h-6 flex items-center justify-center shrink-0">
          <svg className="w-6 h-6 transform -rotate-90">
            {/* Background circle */}
            <circle
              cx="12"
              cy="12"
              r={radius}
              stroke="rgba(245, 245, 240, 0.15)"
              strokeWidth="2.5"
              fill="transparent"
            />
            {/* Progress Arc */}
            <circle
              cx="12"
              cy="12"
              r={radius}
              stroke="#C5A059"
              strokeWidth="2.5"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              fill="transparent"
              className="transition-all duration-700 ease-out"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <Sparkles className="w-2.5 h-2.5 text-[#C5A059] animate-pulse" />
          </div>
        </div>

        {/* Score & Tier Label */}
        <div className="flex flex-col text-left">
          <div className="flex items-center gap-1">
            <span className="font-mono text-xs font-bold text-[#F5F5F0] tracking-tight">
              {overallScore}%
            </span>
            <span className="text-[9px] font-mono uppercase text-[#C5A059] font-bold tracking-wider hidden sm:inline">
              MORAL ALIGNMENT
            </span>
          </div>
          <span className="text-[8px] font-mono text-emerald-400 tracking-wider font-semibold uppercase leading-none hidden md:inline">
            COVENANT TIER IV
          </span>
        </div>

        <ChevronDown className={`w-3 h-3 text-[#F5F5F0]/50 group-hover:text-white transition-transform duration-200 ${isOpen ? 'rotate-180 text-[#C5A059]' : ''}`} />
      </button>

      {/* Popover Breakdown Dialog */}
      {isOpen && (
        <div className="absolute top-full right-0 mt-2 w-80 sm:w-96 p-4 bg-[#0A0A0A] border border-[#C5A059]/50 rounded-sm shadow-2xl z-50 text-left font-sans space-y-4">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-[#F5F5F0]/10 pb-2.5">
            <div className="flex items-center gap-2">
              <Scale className="w-4 h-4 text-[#C5A059]" />
              <div>
                <span className="text-[9px] font-mono uppercase tracking-widest text-[#C5A059] font-bold block">
                  REAL-TIME ETHICAL TELEMETRY
                </span>
                <h4 className="text-sm font-serif text-[#F5F5F0] font-bold">
                  Civilizational Moral Alignment
                </h4>
              </div>
            </div>
            <div className="text-right">
              <span className="text-lg font-mono font-bold text-[#C5A059]">{overallScore}%</span>
              <span className="block text-[8px] font-mono text-emerald-400">PLANETARY HARMONY</span>
            </div>
          </div>

          {/* Sub-Pillar Breakdown Bars */}
          <div className="space-y-2.5 text-xs font-mono">
            {/* Ecological */}
            <div className="space-y-1">
              <div className="flex items-center justify-between text-[11px]">
                <span className="flex items-center gap-1.5 text-[#F5F5F0]/80">
                  <Leaf className="w-3 h-3 text-emerald-400" />
                  Ecological Reintegration
                </span>
                <span className="text-emerald-400 font-bold">{ecologicalScore}%</span>
              </div>
              <div className="w-full h-1.5 bg-[#1C1C1C] rounded-full overflow-hidden">
                <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${ecologicalScore}%` }} />
              </div>
            </div>

            {/* Non-Extractive */}
            <div className="space-y-1">
              <div className="flex items-center justify-between text-[11px]">
                <span className="flex items-center gap-1.5 text-[#F5F5F0]/80">
                  <ShieldCheck className="w-3 h-3 text-amber-400" />
                  Non-Extractive Capital Floor
                </span>
                <span className="text-amber-400 font-bold">{stewardshipScore}%</span>
              </div>
              <div className="w-full h-1.5 bg-[#1C1C1C] rounded-full overflow-hidden">
                <div className="h-full bg-amber-500 rounded-full" style={{ width: `${stewardshipScore}%` }} />
              </div>
            </div>

            {/* Epistemic Truth */}
            <div className="space-y-1">
              <div className="flex items-center justify-between text-[11px]">
                <span className="flex items-center gap-1.5 text-[#F5F5F0]/80">
                  <Brain className="w-3 h-3 text-blue-400" />
                  Epistemic Lineage & Ledger Truth
                </span>
                <span className="text-blue-400 font-bold">{epistemicScore}%</span>
              </div>
              <div className="w-full h-1.5 bg-[#1C1C1C] rounded-full overflow-hidden">
                <div className="h-full bg-blue-500 rounded-full" style={{ width: `${epistemicScore}%` }} />
              </div>
            </div>

            {/* Intergenerational */}
            <div className="space-y-1">
              <div className="flex items-center justify-between text-[11px]">
                <span className="flex items-center gap-1.5 text-[#F5F5F0]/80">
                  <Compass className="w-3 h-3 text-purple-400" />
                  7th-Generation Horizon Equity
                </span>
                <span className="text-purple-400 font-bold">{generationalScore}%</span>
              </div>
              <div className="w-full h-1.5 bg-[#1C1C1C] rounded-full overflow-hidden">
                <div className="h-full bg-purple-500 rounded-full" style={{ width: `${generationalScore}%` }} />
              </div>
            </div>
          </div>

          {/* Contributing Active Metrics Box */}
          <div className="p-2.5 bg-[#141414] border border-[#F5F5F0]/10 rounded-sm space-y-1.5 text-[11px] font-sans text-[#F5F5F0]/70">
            <div className="flex items-center justify-between font-mono text-[10px] text-[#C5A059] uppercase">
              <span>Active Missions Evaluated:</span>
              <strong className="text-white">{activeMissionsCount} Bioregional Hubs</strong>
            </div>
            <div className="flex items-center justify-between font-mono text-[10px] text-[#C5A059] uppercase">
              <span>Verified Evidence Lineage:</span>
              <strong className="text-white">{verifiedLedgerCount} / {totalLedgerCount} Proofs Sealed</strong>
            </div>
          </div>

          {/* Quick Action Buttons */}
          <div className="grid grid-cols-2 gap-2 pt-1 border-t border-[#F5F5F0]/10 font-mono text-[10px]">
            {onOpenMoralSimulator && (
              <button
                onClick={() => {
                  setIsOpen(false);
                  audioFeedback.playMicroTick();
                  onOpenMoralSimulator();
                }}
                className="p-2 rounded bg-[#1A1A1A] hover:bg-[#222] border border-[#F5F5F0]/15 text-[#F5F5F0] flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <Zap className="w-3 h-3 text-[#C5A059]" />
                <span>Simulate Tradeoffs</span>
              </button>
            )}

            {onOpenEvidenceLedger && (
              <button
                onClick={() => {
                  setIsOpen(false);
                  audioFeedback.playMicroTick();
                  onOpenEvidenceLedger();
                }}
                className="p-2 rounded bg-[#1B3022] hover:bg-[#254530] border border-emerald-500/40 text-emerald-300 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <Lock className="w-3 h-3 text-emerald-400" />
                <span>Inspect Proofs</span>
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
