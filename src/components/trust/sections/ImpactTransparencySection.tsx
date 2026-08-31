import React, { useState } from 'react';
import { 
  BarChart3, 
  TreePine, 
  Droplets, 
  DollarSign, 
  Sparkles, 
  ShieldCheck, 
  CheckCircle2, 
  Activity, 
  ArrowUpRight, 
  Hash, 
  Layers,
  Filter
} from 'lucide-react';
import { REGENERATIVE_IMPACT_METRICS } from '../../../data/trustData';
import { MetricCalculationType } from '../../../types/trust';
import { audioFeedback } from '../../../lib/audioFeedback';
import { VerificationStatusBadge } from '../VerificationStatusBadge';

export const ImpactTransparencySection: React.FC = () => {
  const [selectedTypeFilter, setSelectedTypeFilter] = useState<'all' | MetricCalculationType>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const filteredMetrics = REGENERATIVE_IMPACT_METRICS.filter(m => {
    if (selectedTypeFilter !== 'all' && m.type !== selectedTypeFilter) return false;
    if (selectedCategory !== 'all' && m.category !== selectedCategory) return false;
    return true;
  });

  const getTypeBadgeStyle = (type: MetricCalculationType) => {
    switch (type) {
      case 'actual':
        return 'bg-emerald-950/80 text-emerald-300 border-emerald-500/50';
      case 'estimated':
        return 'bg-cyan-950/80 text-cyan-300 border-cyan-500/50';
      case 'target':
        return 'bg-amber-950/80 text-amber-300 border-amber-500/50';
      case 'projected':
        return 'bg-purple-950/80 text-purple-300 border-purple-500/50';
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn text-[#F5F5F0]">
      {/* Header Banner */}
      <div className="p-5 sm:p-6 rounded-sm bg-[#121212] border border-[#F5F5F0]/10 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#1B3022]/30 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 space-y-2">
          <div className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-emerald-400" />
            <span className="text-[10px] font-mono uppercase tracking-widest text-emerald-400 font-bold">Verifiable Regenerative Ledger</span>
          </div>
          <h2 className="text-xl font-medium font-serif text-[#F5F5F0]">
            Platform Performance, Impact & Verification Matrix
          </h2>
          <p className="text-xs text-[#F5F5F0]/70 max-w-2xl leading-relaxed">
            Atlas Sanctum mandates radical honesty in measurement. We rigorously distinguish mathematically verified actuals from sensor-derived estimates, institutional targets, and prospective model projections.
          </p>
        </div>
      </div>

      {/* 5-Step Integrity Pipeline Flow */}
      <div className="p-4 bg-[#141414] border border-[#F5F5F0]/10 rounded-sm">
        <p className="text-[10px] font-mono uppercase text-[#C5A059] font-bold tracking-wider mb-3">
          Regenerative Measurement Pipeline (Proof-of-Restoration)
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-center text-xs font-mono">
          <div className="p-3 bg-[#0E0E0E] rounded border border-[#F5F5F0]/5">
            <span className="text-[#C5A059] block font-bold text-xs mb-0.5">1. Impact Intent</span>
            <span className="text-[10px] text-[#F5F5F0]/60">Ecological Need Identified</span>
          </div>
          <div className="p-3 bg-[#0E0E0E] rounded border border-[#F5F5F0]/5">
            <span className="text-cyan-400 block font-bold text-xs mb-0.5">2. Field Projects</span>
            <span className="text-[10px] text-[#F5F5F0]/60">Local Stewards Engaged</span>
          </div>
          <div className="p-3 bg-[#0E0E0E] rounded border border-[#F5F5F0]/5">
            <span className="text-emerald-400 block font-bold text-xs mb-0.5">3. Escrow Funding</span>
            <span className="text-[10px] text-[#F5F5F0]/60">Non-Extractive Capital</span>
          </div>
          <div className="p-3 bg-[#0E0E0E] rounded border border-[#F5F5F0]/5">
            <span className="text-purple-400 block font-bold text-xs mb-0.5">4. Living Outcomes</span>
            <span className="text-[10px] text-[#F5F5F0]/60">Canopy, Carbon, Water</span>
          </div>
          <div className="p-3 bg-[#1B3022]/60 rounded border border-emerald-500/40 col-span-2 sm:col-span-1">
            <span className="text-emerald-300 block font-bold text-xs mb-0.5 flex items-center justify-center gap-1">
              <CheckCircle2 className="w-3 h-3 text-emerald-400" /> 5. Audit & Proof
            </span>
            <span className="text-[10px] text-emerald-200/80">Satellite + Ground Sensor</span>
          </div>
        </div>
      </div>

      {/* Filter Matrix Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-[#141414] border border-[#F5F5F0]/10 rounded-sm">
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-[10px] font-mono uppercase text-[#F5F5F0]/50 mr-1 flex items-center gap-1">
            <Filter className="w-3 h-3" /> Metric Type:
          </span>
          {(['all', 'actual', 'estimated', 'target', 'projected'] as const).map(type => (
            <button
              key={type}
              onClick={() => {
                setSelectedTypeFilter(type);
                audioFeedback.playMicroTick();
              }}
              className={`px-2.5 py-1 text-xs font-mono rounded capitalize transition-all cursor-pointer ${
                selectedTypeFilter === type
                  ? 'bg-[#C5A059] text-black font-bold'
                  : 'bg-[#1E1E1E] text-[#F5F5F0]/70 hover:bg-[#282828] border border-[#F5F5F0]/10'
              }`}
            >
              {type}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-[10px] font-mono uppercase text-[#F5F5F0]/50 mr-1">Category:</span>
          {(['all', 'Ecological', 'Hydrology', 'Carbon & Soil', 'Economic Sovereignty', 'Human Prosperity'] as const).map(cat => (
            <button
              key={cat}
              onClick={() => {
                setSelectedCategory(cat);
                audioFeedback.playMicroTick();
              }}
              className={`px-2.5 py-1 text-[11px] font-mono rounded transition-all cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-emerald-900/60 text-emerald-300 border border-emerald-500/50 font-bold'
                  : 'bg-[#1E1E1E] text-[#F5F5F0]/60 hover:bg-[#282828] border border-[#F5F5F0]/5'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Metrics Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredMetrics.map(metric => (
          <div key={metric.id} className="p-5 bg-[#141414] border border-[#F5F5F0]/10 rounded-sm space-y-3 hover:border-[#F5F5F0]/25 transition-all flex flex-col justify-between">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono uppercase text-[#C5A059] font-bold">{metric.category}</span>
                <div className="flex items-center gap-1.5">
                  <VerificationStatusBadge 
                    status={metric.type === 'actual' ? 'Audited' : metric.type === 'estimated' ? 'Verified' : 'Unverified'}
                    claimId={metric.id}
                    claimTitle={metric.title}
                    verifier={metric.verificationSource}
                    merkleLeaf={metric.verificationHash}
                    confidenceScore={metric.confidenceScore}
                  />
                  <span className={`px-2 py-0.5 text-[9px] font-mono uppercase rounded border ${getTypeBadgeStyle(metric.type)}`}>
                    {metric.type}
                  </span>
                </div>
              </div>

              <div className="flex items-baseline gap-2">
                <span className="text-2xl sm:text-3xl font-bold font-mono text-[#F5F5F0] tracking-tight">
                  {metric.value}
                </span>
                <span className="text-xs font-mono text-[#F5F5F0]/60">{metric.unit}</span>
              </div>

              <h4 className="text-xs font-bold text-[#F5F5F0] font-mono leading-tight">{metric.title}</h4>
              <p className="text-xs text-[#F5F5F0]/70 leading-relaxed">{metric.description}</p>
            </div>

            <div className="pt-3 border-t border-[#F5F5F0]/10 space-y-2 text-[10px] font-mono">
              <div className="flex items-center justify-between">
                <span className="text-[#F5F5F0]/50">Confidence Score:</span>
                <span className="text-emerald-400 font-bold">{metric.confidenceScore}%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#F5F5F0]/50">Audited Source:</span>
                <span className="text-[#F5F5F0]/80 truncate max-w-[160px]">{metric.verificationSource}</span>
              </div>
              <div className="flex items-center justify-between text-[#C5A059]/90">
                <span className="flex items-center gap-1">
                  <Hash className="w-3 h-3" /> Merkle Hash:
                </span>
                <span className="truncate max-w-[130px]">{metric.verificationHash}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
