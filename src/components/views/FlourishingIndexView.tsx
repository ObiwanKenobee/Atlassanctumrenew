import React, { useState } from 'react';
import {
  Heart,
  Scale,
  TrendingUp,
  ShieldCheck,
  Sparkles,
  Sliders,
  HelpCircle,
  ArrowRight,
  Filter,
  CheckCircle2,
  AlertCircle,
  Eye,
  Download,
  Layers,
  Leaf,
  Users,
  Building,
  Clock,
  Compass
} from 'lucide-react';
import { FlourishingDimension, FlourishingIndicator } from '../../types';
import { FLOURISHING_DIMENSIONS } from '../../data/prompt2CivilizationData';
import { BioregionalTrendsModule } from '../flourishing/BioregionalTrendsModule';

interface FlourishingIndexViewProps {
  onSelectTab: (tab: any) => void;
}

export const FlourishingIndexView: React.FC<FlourishingIndexViewProps> = ({ onSelectTab }) => {
  const [dimensions, setDimensions] = useState<FlourishingDimension[]>(FLOURISHING_DIMENSIONS);
  const [selectedDimensionId, setSelectedDimensionId] = useState<string>('human');
  const [selectedEpistemicFilter, setSelectedEpistemicFilter] = useState<string>('all');
  const [customWeights, setCustomWeights] = useState<Record<string, number>>({
    human: 1.0,
    economic: 1.0,
    social: 1.0,
    ecological: 1.0,
    institutional: 1.0,
    generational: 1.0
  });

  const selectedDimension = dimensions.find(d => d.id === selectedDimensionId) || dimensions[0];

  // Calculate Weighted Composite Score
  const totalWeight: number = dimensions.reduce((acc: number, dim) => acc + (Number(customWeights[dim.id]) || 1.0), 0);
  const weightedSum: number = dimensions.reduce((acc: number, dim) => acc + (dim.score * (Number(customWeights[dim.id]) || 1.0)), 0);
  const weightedCompositeScore = Math.round(weightedSum / (totalWeight > 0 ? totalWeight : 1));

  const getDimensionIcon = (id: string) => {
    switch (id) {
      case 'human': return <Heart className="w-5 h-5 text-[#E57373]" />;
      case 'economic': return <TrendingUp className="w-5 h-5 text-[#81C784]" />;
      case 'social': return <Users className="w-5 h-5 text-[#BA68C8]" />;
      case 'ecological': return <Leaf className="w-5 h-5 text-[#4DB6AC]" />;
      case 'institutional': return <Building className="w-5 h-5 text-[#FFB74D]" />;
      case 'generational': return <Clock className="w-5 h-5 text-[#4FC3F7]" />;
      default: return <Sparkles className="w-5 h-5 text-[#C5A059]" />;
    }
  };

  const getEpistemicBadgeColor = (status: string) => {
    switch (status) {
      case 'Observed': return 'bg-emerald-950/70 text-emerald-300 border-emerald-500/40';
      case 'Verified': return 'bg-blue-950/70 text-blue-300 border-blue-500/40';
      case 'Reported': return 'bg-purple-950/70 text-purple-300 border-purple-500/40';
      case 'Modeled': return 'bg-amber-950/70 text-amber-300 border-amber-500/40';
      case 'Estimated': return 'bg-neutral-900 text-neutral-300 border-neutral-600';
      default: return 'bg-neutral-950 text-neutral-400 border-neutral-800';
    }
  };

  return (
    <div className="w-full bg-[#0A0A0A] text-[#F5F5F0] min-h-screen py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-6 border-b border-[#F5F5F0]/10">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono uppercase text-[#C5A059] tracking-[0.2em] font-bold">
              THE FLOURISHING INDEX • 6-DIMENSIONAL CIVILIZATION AUDIT
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-serif text-[#F5F5F0]">The Flourishing Index</h1>
          <p className="text-xs sm:text-sm text-[#F5F5F0]/60 max-w-2xl font-sans">
            Moving beyond narrow GDP metrics to a comprehensive, verifiable evaluation of human dignity, ecological vitality, covenantal trust, and multi-generational opportunity.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => onSelectTab('evidence-ledger')}
            className="px-4 py-2.5 bg-[#1B3022] hover:bg-[#254530] border border-[#C5A059]/40 text-[#F5F5F0] text-xs font-mono rounded-sm flex items-center gap-1.5 transition-all shadow"
          >
            <ShieldCheck className="w-4 h-4 text-[#C5A059]" />
            <span>Verify Evidence Ledger</span>
          </button>
        </div>
      </div>

      {/* Composite Score Card & 6-Dimension Overview */}
      <div className="p-8 bg-[#0D0D0D] border border-[#C5A059]/30 rounded-sm space-y-6">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
          {/* Main Composite Score Display */}
          <div className="flex items-center gap-6">
            <div className="relative w-28 h-28 rounded-full border-4 border-[#C5A059] bg-[#141414] flex flex-col items-center justify-center shadow-lg">
              <span className="text-3xl font-bold font-mono text-[#F5F5F0]">{weightedCompositeScore}</span>
              <span className="text-[10px] text-[#C5A059] font-mono uppercase tracking-widest">/ 100</span>
            </div>

            <div className="space-y-1 max-w-md">
              <div className="text-xs font-mono uppercase text-[#C5A059] font-bold tracking-widest">
                AGGREGATE FLOURISHING QUOTIENT
              </div>
              <h2 className="text-xl font-serif font-bold text-[#F5F5F0]">
                Regenerative Momentum: Strong Positive (+7.8% YoY)
              </h2>
              <p className="text-xs text-[#F5F5F0]/60 font-sans leading-relaxed">
                Aggregated across 18 regional pilot bioregions with cryptographically anchored sensor telemetry and independent community audits.
              </p>
            </div>
          </div>

          {/* Quick Epistemic Trust Breakdown */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center font-mono text-xs w-full lg:w-auto">
            <div className="p-3 bg-[#121212] border border-[#F5F5F0]/5 rounded-xs">
              <div className="text-[9px] text-[#F5F5F0]/40 uppercase">Observed Sensors</div>
              <div className="text-sm font-bold text-emerald-400">4,820 Nodes</div>
            </div>
            <div className="p-3 bg-[#121212] border border-[#F5F5F0]/5 rounded-xs">
              <div className="text-[9px] text-[#F5F5F0]/40 uppercase">Epistemic Certainty</div>
              <div className="text-sm font-bold text-[#8FB8DE]">94.8% Average</div>
            </div>
            <div className="p-3 bg-[#121212] border border-[#F5F5F0]/5 rounded-xs">
              <div className="text-[9px] text-[#F5F5F0]/40 uppercase">Community Audits</div>
              <div className="text-sm font-bold text-[#C5A059]">100% Ratified</div>
            </div>
            <div className="p-3 bg-[#121212] border border-[#F5F5F0]/5 rounded-xs">
              <div className="text-[9px] text-[#F5F5F0]/40 uppercase">Non-Extractive</div>
              <div className="text-sm font-bold text-purple-400">100% Compliant</div>
            </div>
          </div>
        </div>

        {/* 6 Dimension Selector Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 pt-4 border-t border-[#F5F5F0]/10">
          {dimensions.map((dim) => {
            const isSelected = dim.id === selectedDimensionId;
            return (
              <div
                key={dim.id}
                onClick={() => setSelectedDimensionId(dim.id)}
                className={`p-4 rounded-sm border cursor-pointer transition-all space-y-2 text-left ${
                  isSelected
                    ? 'bg-[#181818] border-[#C5A059] shadow-md scale-[1.02]'
                    : 'bg-[#111111] border-[#F5F5F0]/10 hover:border-[#F5F5F0]/30'
                }`}
              >
                <div className="flex items-center justify-between">
                  {getDimensionIcon(dim.id)}
                  <span className="text-xs font-mono font-bold text-[#F5F5F0]">{dim.score}/100</span>
                </div>
                <div className="text-xs font-serif font-bold text-[#F5F5F0] leading-snug">{dim.name}</div>
                <div className="text-[10px] font-mono text-emerald-400">+{dim.trend}% YoY</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* BIOREGIONAL HISTORICAL TRENDS & REGENERATIVE METRICS (RECHARTS) */}
      <BioregionalTrendsModule />

      {/* Main Breakdown: Dimension Deep-Dive & Community Weight Calibration */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Col (8 cols): Indicators & Verified Metrics */}
        <div className="lg:col-span-8 space-y-6">
          <div className="p-6 bg-[#0D0D0D] border border-[#F5F5F0]/10 rounded-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#F5F5F0]/10 pb-4">
              <div className="flex items-center gap-3">
                {getDimensionIcon(selectedDimension.id)}
                <div>
                  <h3 className="text-xl font-serif font-bold text-[#F5F5F0]">{selectedDimension.name}</h3>
                  <p className="text-xs text-[#F5F5F0]/60 font-sans">{selectedDimension.description}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 self-start sm:self-center font-mono text-xs">
                <span className="px-3 py-1 bg-[#151515] border border-[#C5A059]/40 text-[#C5A059] rounded-xs font-bold">
                  Score: {selectedDimension.score}/100
                </span>
              </div>
            </div>

            {/* Filter by Epistemic Status */}
            <div className="flex items-center gap-2 overflow-x-auto text-[11px] font-mono pb-1">
              <span className="text-[#F5F5F0]/40 uppercase flex items-center gap-1">
                <Filter className="w-3 h-3" /> Epistemic Filter:
              </span>
              {['all', 'Observed', 'Verified', 'Reported', 'Modeled'].map(status => (
                <button
                  key={status}
                  onClick={() => setSelectedEpistemicFilter(status)}
                  className={`px-2.5 py-1 rounded-xs border transition-all ${
                    selectedEpistemicFilter === status
                      ? 'bg-[#F5F5F0] text-black border-[#F5F5F0] font-bold'
                      : 'bg-[#141414] text-[#F5F5F0]/60 border-[#F5F5F0]/10 hover:border-[#F5F5F0]/30'
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>

            {/* Indicator Cards */}
            <div className="space-y-4">
              {selectedDimension.indicators
                .filter(ind => selectedEpistemicFilter === 'all' || ind.epistemicStatus === selectedEpistemicFilter)
                .map((ind) => (
                  <div
                    key={ind.id}
                    className="p-5 bg-[#121212] border border-[#F5F5F0]/10 rounded-sm space-y-3"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-bold text-[#F5F5F0]">{ind.name}</span>
                          <span className={`px-2 py-0.5 text-[9px] font-mono uppercase font-bold rounded border ${getEpistemicBadgeColor(ind.epistemicStatus)}`}>
                            {ind.epistemicStatus}
                          </span>
                        </div>
                        <p className="text-xs text-[#F5F5F0]/70 font-sans leading-relaxed">{ind.description}</p>
                      </div>

                      <div className="text-right shrink-0">
                        <div className="text-lg font-mono font-bold text-[#C5A059]">{ind.currentValue}</div>
                        <div className="text-[10px] text-[#F5F5F0]/40 font-mono">Benchmark: {ind.benchmarkValue}</div>
                      </div>
                    </div>

                    {/* Meta Bar */}
                    <div className="pt-3 border-t border-[#F5F5F0]/5 grid grid-cols-1 sm:grid-cols-3 gap-2 text-[10px] font-mono text-[#F5F5F0]/60">
                      <div>Source: <span className="text-[#F5F5F0]/80 font-sans">{ind.source}</span></div>
                      <div>Epistemic Certainty: <span className="text-emerald-400 font-bold">{ind.certaintyScore}%</span></div>
                      <div>Annual Delta: <span className="text-emerald-300 font-bold">+{ind.trend}%</span></div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>

        {/* Right Col (4 cols): Community Weight Simulator */}
        <div className="lg:col-span-4 space-y-6">
          <div className="p-6 bg-[#0D0D0D] border border-[#C5A059]/30 rounded-sm space-y-5">
            <div className="flex items-center gap-2 pb-3 border-b border-[#F5F5F0]/10">
              <Sliders className="w-4 h-4 text-[#C5A059]" />
              <h3 className="text-xs font-bold uppercase tracking-widest text-[#F5F5F0]">
                Local Priority Weight Calibration
              </h3>
            </div>

            <p className="text-xs text-[#F5F5F0]/60 font-sans leading-relaxed">
              Communities calibrate dimension weights based on local biophysical and cultural priorities rather than accepting universal centralized mandates.
            </p>

            <div className="space-y-4">
              {dimensions.map((dim) => (
                <div key={dim.id} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="text-[#F5F5F0]/80">{dim.name}</span>
                    <span className="text-[#C5A059] font-bold">{(customWeights[dim.id] || 1.0).toFixed(1)}x</span>
                  </div>
                  <input
                    type="range"
                    min="0.2"
                    max="2.5"
                    step="0.1"
                    value={customWeights[dim.id] || 1.0}
                    onChange={(e) => setCustomWeights({ ...customWeights, [dim.id]: parseFloat(e.target.value) })}
                    className="w-full accent-[#C5A059] bg-[#1A1A1A] h-1.5 rounded-lg appearance-none cursor-pointer"
                  />
                </div>
              ))}
            </div>

            <button
              onClick={() => setCustomWeights({ human: 1.0, economic: 1.0, social: 1.0, ecological: 1.0, institutional: 1.0, generational: 1.0 })}
              className="w-full py-2 bg-[#181818] hover:bg-[#222222] border border-[#F5F5F0]/10 text-xs font-mono text-[#F5F5F0]/60 hover:text-[#F5F5F0] rounded-xs transition-all"
            >
              Reset to Neutral Parity (1.0x)
            </button>
          </div>

          {/* Moral Safeguards Info Box */}
          <div className="p-5 bg-[#1B3022]/40 border border-emerald-500/30 rounded-sm space-y-2 text-xs">
            <div className="flex items-center gap-2 text-emerald-400 font-mono font-bold uppercase tracking-wider text-[10px]">
              <ShieldCheck className="w-4 h-4" />
              <span>Anti-Gaming Constraint</span>
            </div>
            <p className="text-[#F5F5F0]/80 font-sans leading-relaxed text-[11px]">
              No dimension may drop below a critical threshold of 60/100 without triggering a formal Systemic Red Alert, preventing projects from sacrificing human dignity for ecological scores or vice versa.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
