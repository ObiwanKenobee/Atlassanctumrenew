import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Scale, 
  Sparkles, 
  Lock, 
  Unlock, 
  ArrowRight, 
  TrendingUp, 
  Activity,
  Heart,
  Cpu,
  EyeOff
} from 'lucide-react';
import { LiberationIndexScore, PageView } from '../../types';

interface LiberationIndexWidgetProps {
  onSelectTab?: (tab: PageView) => void;
}

export const LiberationIndexWidget: React.FC<LiberationIndexWidgetProps> = ({ onSelectTab }) => {
  const [selectedIntervention, setSelectedIntervention] = useState<'mathare' | 'turkana' | 'conventional_aid'>('mathare');

  const SCORES: Record<string, LiberationIndexScore> = {
    mathare: {
      overallScore: 92.4,
      agencyGained: {
        incomeOpportunity: 94,
        knowledgeAccess: 91,
        healthcareAutonomy: 88,
        decisionMakingPower: 96,
        productiveCapacity: 92,
        dependencyReduction: 93
      },
      harmMitigation: {
        surveillanceResistance: 95,
        antiManipulationSafeguard: 98,
        lockInPrevention: 97,
        decentralizedPowerDistribution: 94
      },
      philosophicalVerdict: 'VERIFIED LIBERATING: High local sovereign equity (+60%), open hardware blueprints, zero land alienation, and independent community-controlled power grid.'
    },
    turkana: {
      overallScore: 94.8,
      agencyGained: {
        incomeOpportunity: 96,
        knowledgeAccess: 90,
        healthcareAutonomy: 94,
        decisionMakingPower: 98,
        productiveCapacity: 95,
        dependencyReduction: 96
      },
      harmMitigation: {
        surveillanceResistance: 96,
        antiManipulationSafeguard: 99,
        lockInPrevention: 98,
        decentralizedPowerDistribution: 97
      },
      philosophicalVerdict: 'VERIFIED LIBERATING: Replaces $2.40/L recurring diesel aid dependency with 100% sovereign solar desalination and elder-governed water tariffs.'
    },
    conventional_aid: {
      overallScore: 38.2,
      agencyGained: {
        incomeOpportunity: 32,
        knowledgeAccess: 40,
        healthcareAutonomy: 45,
        decisionMakingPower: 22,
        productiveCapacity: 28,
        dependencyReduction: 18
      },
      harmMitigation: {
        surveillanceResistance: 42,
        antiManipulationSafeguard: 35,
        lockInPrevention: 20,
        decentralizedPowerDistribution: 24
      },
      philosophicalVerdict: 'EXTRACTIVE / DEPENDENCY RISK: Relies on proprietary foreign parts, ongoing fuel subsidies, donor reporting control, and zero local asset equity.'
    }
  };

  const active = SCORES[selectedIntervention];

  return (
    <div className="w-full bg-[#0D0D0D] border border-[#C5A059]/30 rounded-sm p-6 sm:p-8 space-y-6 shadow-2xl relative overflow-hidden">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-[#F5F5F0]/10 pb-5">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Unlock className="w-4 h-4 text-emerald-400" />
            <span className="text-[10px] uppercase tracking-[0.25em] font-mono text-[#C5A059] font-bold">
              Agency & Anti-Capture Metric
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#F5F5F0]">
            THE LIBERATION INDEX
          </h2>
          <p className="text-xs text-[#F5F5F0]/70 max-w-2xl font-sans">
            "Technology must liberate human beings, not capture them in extractive dependency, surveillance loops, or predatory debt. The Liberation Index measures true sovereignty."
          </p>
        </div>

        {/* Model Switcher */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-[10px] font-mono uppercase text-[#F5F5F0]/50">Compare System:</span>
          {(['mathare', 'turkana', 'conventional_aid'] as const).map((key) => (
            <button
              key={key}
              onClick={() => setSelectedIntervention(key)}
              className={`px-3 py-1.5 text-xs font-mono rounded-xs transition-all cursor-pointer ${
                selectedIntervention === key
                  ? key === 'conventional_aid'
                    ? 'bg-rose-950/80 border border-rose-500 text-rose-300 font-bold'
                    : 'bg-[#1B3022] border border-[#C5A059] text-[#C5A059] font-bold'
                  : 'bg-[#141414] border border-[#F5F5F0]/10 text-[#F5F5F0]/60 hover:text-[#F5F5F0]'
              }`}
            >
              {key === 'mathare' ? 'Atlas Mathare' : key === 'turkana' ? 'Atlas Turkana' : 'Conventional Aid Model'}
            </button>
          ))}
        </div>
      </div>

      {/* Main Score & Verdict */}
      <div className="p-5 bg-[#121212] border border-[#C5A059]/40 rounded-sm space-y-4 shadow-inner">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#F5F5F0]/10 pb-4">
          <div className="space-y-1">
            <div className="text-[10px] font-mono uppercase tracking-wider text-[#C5A059]">
              Overall Civilizational Liberation Score
            </div>
            <div className="flex items-baseline gap-2">
              <span className={`text-3xl sm:text-4xl font-serif font-bold ${
                active.overallScore > 80 ? 'text-emerald-400' : 'text-rose-400'
              }`}>
                {active.overallScore}
              </span>
              <span className="text-xs font-mono text-[#F5F5F0]/60">/ 100</span>
            </div>
          </div>

          <div className="p-3 bg-[#080808] border border-[#F5F5F0]/10 rounded-sm max-w-lg text-xs">
            <span className="text-[9px] font-mono uppercase text-[#C5A059] font-bold">
              Philosophical & Moral Assessment:
            </span>
            <p className="text-[#F5F5F0]/80 mt-1 font-serif italic">{active.philosophicalVerdict}</p>
          </div>
        </div>

        {/* 2 Dimensions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Dimension 1: Agency Gained */}
          <div className="p-4 bg-[#0A0A0A] border border-emerald-500/30 rounded-sm space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-emerald-400 uppercase flex items-center gap-1.5">
                <Heart className="w-3.5 h-3.5" />
                Agency & Autonomy Expansion
              </span>
              <span className="text-xs font-mono text-emerald-300">
                Avg {Math.round(Object.values(active.agencyGained).reduce((a, b) => a + b, 0) / 6)}%
              </span>
            </div>

            <div className="space-y-2 text-xs font-mono">
              {Object.entries(active.agencyGained).map(([k, v]) => (
                <div key={k} className="space-y-0.5">
                  <div className="flex items-center justify-between text-[#F5F5F0]/80 text-[11px]">
                    <span className="capitalize">{k.replace(/([A-Z])/g, ' $1')}</span>
                    <span className="text-emerald-400 font-bold">{v}%</span>
                  </div>
                  <div className="w-full bg-[#1A1A1A] h-1.5 rounded-full overflow-hidden">
                    <div
                      className="bg-emerald-500 h-full rounded-full transition-all duration-500"
                      style={{ width: `${v}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Dimension 2: Harm Mitigation */}
          <div className="p-4 bg-[#0A0A0A] border border-blue-500/30 rounded-sm space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-blue-400 uppercase flex items-center gap-1.5">
                <EyeOff className="w-3.5 h-3.5" />
                Anti-Capture & Lock-In Resistance
              </span>
              <span className="text-xs font-mono text-blue-300">
                Avg {Math.round(Object.values(active.harmMitigation).reduce((a, b) => a + b, 0) / 4)}%
              </span>
            </div>

            <div className="space-y-2 text-xs font-mono">
              {Object.entries(active.harmMitigation).map(([k, v]) => (
                <div key={k} className="space-y-0.5">
                  <div className="flex items-center justify-between text-[#F5F5F0]/80 text-[11px]">
                    <span className="capitalize">{k.replace(/([A-Z])/g, ' $1')}</span>
                    <span className="text-blue-400 font-bold">{v}%</span>
                  </div>
                  <div className="w-full bg-[#1A1A1A] h-1.5 rounded-full overflow-hidden">
                    <div
                      className="bg-blue-500 h-full rounded-full transition-all duration-500"
                      style={{ width: `${v}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-2">
          <span className="text-[11px] font-mono text-[#F5F5F0]/50">
            Covenant Principle 02 (LIBERATION) Audit Compliance
          </span>
          <button
            onClick={() => onSelectTab && onSelectTab('flourishing-index')}
            className="px-4 py-2 bg-[#1B3022] hover:bg-[#254530] border border-[#C5A059]/40 text-[#C5A059] text-xs font-mono font-bold uppercase rounded-xs transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <span>View Flourishing Index</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
