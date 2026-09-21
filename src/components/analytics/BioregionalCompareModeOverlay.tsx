import React, { useState, useEffect } from 'react';
import { 
  GitCompare, 
  ArrowRightLeft, 
  TrendingUp, 
  Calendar, 
  Layers, 
  X, 
  Check, 
  ChevronDown, 
  Activity, 
  ShieldCheck, 
  Sparkles,
  Leaf,
  Scale
} from 'lucide-react';
import { COMPARATIVE_BIOREGIONS, BioregionOption, getBioregionHistoricalData } from './flourishingAnalyticsData';
import { audioFeedback } from '../../lib/audioFeedback';

export type CompareModeType = 'bioregions' | 'historical_periods';

interface BioregionalCompareModeOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  selectedBioregionIds: string[];
  onSelectBioregions: (ids: string[]) => void;
  isHistoricalCompareActive: boolean;
  onToggleHistoricalCompare: (active: boolean) => void;
}

export const BioregionalCompareModeOverlay: React.FC<BioregionalCompareModeOverlayProps> = ({
  isOpen,
  onClose,
  selectedBioregionIds,
  onSelectBioregions,
  isHistoricalCompareActive,
  onToggleHistoricalCompare
}) => {
  const [compareMode, setCompareMode] = useState<CompareModeType>(
    isHistoricalCompareActive ? 'historical_periods' : 'bioregions'
  );

  const [bioregionAId, setBioregionAId] = useState<string>(selectedBioregionIds[0] || 'pan-african');
  const [bioregionBId, setBioregionBId] = useState<string>(
    selectedBioregionIds[1] || (selectedBioregionIds[0] === 'congo-basin' ? 'great-rift-valley' : 'congo-basin')
  );

  const [historicalPeriodA, setHistoricalPeriodA] = useState<string>('Current Epoch (2025–2026)');
  const [historicalPeriodB, setHistoricalPeriodB] = useState<string>('Prior Cycle (2024–2025)');

  // Sync with parent when bioregion comparison is chosen ONLY when overlay is open
  useEffect(() => {
    if (!isOpen) return;

    if (compareMode === 'bioregions') {
      onSelectBioregions([bioregionAId, bioregionBId]);
      if (isHistoricalCompareActive) {
        onToggleHistoricalCompare(false);
      }
    } else {
      if (!isHistoricalCompareActive) {
        onToggleHistoricalCompare(true);
      }
    }
  }, [isOpen, compareMode, bioregionAId, bioregionBId]);

  if (!isOpen) return null;

  const handleCloseCompareMode = () => {
    audioFeedback.playSubtleClick();
    // Revert to single primary bioregion so platform view is not left in a split state
    if (selectedBioregionIds.length > 1) {
      onSelectBioregions([bioregionAId]);
    }
    if (isHistoricalCompareActive) {
      onToggleHistoricalCompare(false);
    }
    onClose();
  };

  const regionA = COMPARATIVE_BIOREGIONS.find(b => b.id === bioregionAId) || COMPARATIVE_BIOREGIONS[0];
  const regionB = COMPARATIVE_BIOREGIONS.find(b => b.id === bioregionBId) || COMPARATIVE_BIOREGIONS[1];

  const handleSwapBioregions = () => {
    audioFeedback.playMicroTick();
    const temp = bioregionAId;
    setBioregionAId(bioregionBId);
    setBioregionBId(temp);
  };

  // Comparative metrics for dual bioregions
  const latestPtA = regionA.monthlyData[regionA.monthlyData.length - 1] || { ecologicalFlourishing: 92.4, economicStability: 89.2, decouplingMargin: 53.4 };
  const latestPtB = regionB.monthlyData[regionB.monthlyData.length - 1] || { ecologicalFlourishing: 85.0, economicStability: 82.0, decouplingMargin: 46.0 };

  const ecoA = latestPtA.ecologicalFlourishing;
  const ecoB = latestPtB.ecologicalFlourishing;
  const ecoDelta = (ecoA - ecoB).toFixed(1);

  const econA = latestPtA.economicStability;
  const econB = latestPtB.economicStability;
  const econDelta = (econA - econB).toFixed(1);

  const decoupleA = Math.round(latestPtA.decouplingMargin ?? (ecoA - (100 - econA)));
  const decoupleB = Math.round(latestPtB.decouplingMargin ?? (ecoB - (100 - econB)));
  const decoupleDelta = (decoupleA - decoupleB).toFixed(1);

  return (
    <div 
      id="bioregional-compare-mode-overlay" 
      className="bg-gradient-to-r from-[#0F1813] via-[#151E18] to-[#0F1813] border-2 border-cyan-500/60 rounded-lg p-4 shadow-2xl space-y-4 animate-in fade-in"
    >
      {/* Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-cyan-500/30">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded bg-cyan-500/20 border border-cyan-400 flex items-center justify-center text-cyan-300">
            <GitCompare className="w-4 h-4 text-cyan-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono tracking-widest uppercase text-cyan-400 font-bold">
                SIDE-BY-SIDE ANALYTICAL OVERLAY
              </span>
              <span className="text-[9px] font-mono bg-cyan-950 text-cyan-300 border border-cyan-500/40 px-2 py-0.5 rounded-full font-bold">
                COMPARE MODE ACTIVE
              </span>
            </div>
            <h3 className="text-base font-serif text-[#F5F5F0]">
              Overlay Comparative Analysis Across Bioregions &amp; Historical Epochs
            </h3>
          </div>
        </div>

        {/* Mode Selector & Close Button */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex rounded border border-cyan-500/40 overflow-hidden bg-black/40">
            <button
              type="button"
              id="compare-mode-toggle-bioregions"
              onClick={() => {
                setCompareMode('bioregions');
                audioFeedback.playMicroTick();
              }}
              className={`px-3 py-1.5 text-xs font-mono font-bold transition-colors cursor-pointer flex items-center gap-1.5 ${
                compareMode === 'bioregions'
                  ? 'bg-cyan-500 text-black shadow'
                  : 'text-[#F5F5F0]/70 hover:text-white'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Dual Bioregions</span>
            </button>
            <button
              type="button"
              id="compare-mode-toggle-historical"
              onClick={() => {
                setCompareMode('historical_periods');
                audioFeedback.playMicroTick();
              }}
              className={`px-3 py-1.5 text-xs font-mono font-bold transition-colors cursor-pointer flex items-center gap-1.5 ${
                compareMode === 'historical_periods'
                  ? 'bg-cyan-500 text-black shadow'
                  : 'text-[#F5F5F0]/70 hover:text-white'
              }`}
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Historical Periods</span>
            </button>
          </div>

          <button
            type="button"
            id="btn-close-compare-mode"
            onClick={handleCloseCompareMode}
            className="p-1.5 rounded hover:bg-white/10 text-[#F5F5F0]/60 hover:text-white transition-colors cursor-pointer"
            title="Exit Compare Mode"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Mode 1: Dual Bioregions Overlay */}
      {compareMode === 'bioregions' && (
        <div className="space-y-4">
          {/* Selectors Bar */}
          <div className="grid grid-cols-1 md:grid-cols-11 gap-3 items-center">
            {/* Bioregion A */}
            <div className="md:col-span-5 bg-[#121A15] border border-emerald-500/40 p-3 rounded">
              <label className="text-[10px] font-mono text-emerald-400 font-bold uppercase block mb-1">
                Primary Bioregion (A)
              </label>
              <select
                id="select-compare-bioregion-a"
                value={bioregionAId}
                onChange={(e) => {
                  setBioregionAId(e.target.value);
                  audioFeedback.playMicroTick();
                }}
                className="w-full bg-[#0B100D] border border-emerald-500/40 text-emerald-200 text-xs font-mono p-2 rounded outline-hidden cursor-pointer"
              >
                {COMPARATIVE_BIOREGIONS.map(b => (
                  <option key={b.id} value={b.id} disabled={b.id === bioregionBId}>
                    {b.name} ({b.biome})
                  </option>
                ))}
              </select>
              <div className="flex items-center gap-2 mt-2 text-[11px] font-mono text-[#8E9490]">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: regionA.color }} />
                <span>Ecosystem: {regionA.biome}</span>
                <span>• Current: {ecoA}%</span>
              </div>
            </div>

            {/* Swap Button */}
            <div className="md:col-span-1 flex justify-center">
              <button
                type="button"
                id="btn-swap-compare-bioregions"
                onClick={handleSwapBioregions}
                className="p-2.5 rounded-full bg-[#18251D] hover:bg-[#233529] border border-cyan-500/50 text-cyan-300 hover:text-white transition-all cursor-pointer shadow"
                title="Swap Bioregion A and Bioregion B"
              >
                <ArrowRightLeft className="w-4 h-4" />
              </button>
            </div>

            {/* Bioregion B */}
            <div className="md:col-span-5 bg-[#141820] border border-cyan-500/40 p-3 rounded">
              <label className="text-[10px] font-mono text-cyan-400 font-bold uppercase block mb-1">
                Comparative Overlay Bioregion (B)
              </label>
              <select
                id="select-compare-bioregion-b"
                value={bioregionBId}
                onChange={(e) => {
                  setBioregionBId(e.target.value);
                  audioFeedback.playMicroTick();
                }}
                className="w-full bg-[#0C0F14] border border-cyan-500/40 text-cyan-200 text-xs font-mono p-2 rounded outline-hidden cursor-pointer"
              >
                {COMPARATIVE_BIOREGIONS.map(b => (
                  <option key={b.id} value={b.id} disabled={b.id === bioregionAId}>
                    {b.name} ({b.biome})
                  </option>
                ))}
              </select>
              <div className="flex items-center gap-2 mt-2 text-[11px] font-mono text-[#8E9490]">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: regionB.color }} />
                <span>Ecosystem: {regionB.biome}</span>
                <span>• Current: {ecoB}%</span>
              </div>
            </div>
          </div>

          {/* Side-by-Side Comparison Metric Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="bg-[#101713] border border-[#233529] p-3 rounded">
              <div className="text-[10px] font-mono text-[#8E9490] uppercase mb-1 flex items-center justify-between">
                <span>Ecological Flourishing</span>
                <span className={`font-bold ${parseFloat(ecoDelta) >= 0 ? 'text-emerald-400' : 'text-cyan-400'}`}>
                  Δ {parseFloat(ecoDelta) >= 0 ? `+${ecoDelta}` : ecoDelta}%
                </span>
              </div>
              <div className="flex items-baseline justify-between font-mono">
                <div>
                  <span className="text-xs text-emerald-400 font-bold">A: </span>
                  <span className="text-base text-[#F5F5F0] font-bold">{ecoA}%</span>
                </div>
                <div className="text-[#8E9490] text-xs font-sans">vs</div>
                <div>
                  <span className="text-xs text-cyan-400 font-bold">B: </span>
                  <span className="text-base text-[#F5F5F0] font-bold">{ecoB}%</span>
                </div>
              </div>
              <div className="w-full bg-black/40 h-1.5 rounded-full mt-2 overflow-hidden flex">
                <div className="bg-emerald-500 h-full" style={{ width: `${ecoA}%` }} />
              </div>
            </div>

            <div className="bg-[#101713] border border-[#233529] p-3 rounded">
              <div className="text-[10px] font-mono text-[#8E9490] uppercase mb-1 flex items-center justify-between">
                <span>Economic Stability</span>
                <span className={`font-bold ${parseFloat(econDelta) >= 0 ? 'text-emerald-400' : 'text-cyan-400'}`}>
                  Δ {parseFloat(econDelta) >= 0 ? `+${econDelta}` : econDelta}%
                </span>
              </div>
              <div className="flex items-baseline justify-between font-mono">
                <div>
                  <span className="text-xs text-emerald-400 font-bold">A: </span>
                  <span className="text-base text-[#F5F5F0] font-bold">{econA}%</span>
                </div>
                <div className="text-[#8E9490] text-xs font-sans">vs</div>
                <div>
                  <span className="text-xs text-cyan-400 font-bold">B: </span>
                  <span className="text-base text-[#F5F5F0] font-bold">{econB}%</span>
                </div>
              </div>
              <div className="w-full bg-black/40 h-1.5 rounded-full mt-2 overflow-hidden flex">
                <div className="bg-cyan-500 h-full" style={{ width: `${econA}%` }} />
              </div>
            </div>

            <div className="bg-[#101713] border border-[#233529] p-3 rounded">
              <div className="text-[10px] font-mono text-[#8E9490] uppercase mb-1 flex items-center justify-between">
                <span>Decoupling Margin</span>
                <span className="font-bold text-[#C5A059]">
                  Δ {parseFloat(decoupleDelta) >= 0 ? `+${decoupleDelta}` : decoupleDelta} pts
                </span>
              </div>
              <div className="flex items-baseline justify-between font-mono">
                <div>
                  <span className="text-xs text-emerald-400 font-bold">A: </span>
                  <span className="text-base text-[#C5A059] font-bold">+{decoupleA}</span>
                </div>
                <div className="text-[#8E9490] text-xs font-sans">vs</div>
                <div>
                  <span className="text-xs text-cyan-400 font-bold">B: </span>
                  <span className="text-base text-[#C5A059] font-bold">+{decoupleB}</span>
                </div>
              </div>
              <div className="text-[10px] font-mono text-[#8E9490] mt-1.5">
                Both bioregions exhibit positive non-extractive divergence.
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Mode 2: Historical Periods Overlay */}
      {compareMode === 'historical_periods' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {/* Period A */}
            <div className="bg-[#121A15] border border-emerald-500/40 p-3 rounded">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] font-mono text-emerald-400 font-bold uppercase">
                  Current Reporting Epoch (A)
                </span>
                <span className="text-[9px] font-mono bg-emerald-950 text-emerald-300 px-1.5 py-0.2 rounded border border-emerald-500/30">
                  ACTIVE TELEMETRY
                </span>
              </div>
              <div className="text-sm font-mono text-[#F5F5F0] font-bold">
                Cycle 2025–2026 (12-Month In-Situ Mesh)
              </div>
              <p className="text-xs text-[#8E9490] font-sans mt-1">
                Full quorum dual-sensor validation with zero systemic ecological drift.
              </p>
            </div>

            {/* Period B */}
            <div className="bg-[#0F1726] border border-blue-500/40 p-3 rounded">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] font-mono text-blue-400 font-bold uppercase">
                  Historical Baseline Epoch (B)
                </span>
                <span className="text-[9px] font-mono bg-blue-950 text-blue-300 px-1.5 py-0.2 rounded border border-blue-500/30">
                  ARCHIVAL LEDGER
                </span>
              </div>
              <div className="text-sm font-mono text-[#F5F5F0] font-bold">
                Prior Year 2024–2025 (Pre-Covenant Baseline)
              </div>
              <p className="text-xs text-[#8E9490] font-sans mt-1">
                Archival baseline showing historical extractive equilibrium before regenerative scaling.
              </p>
            </div>
          </div>

          {/* Historical Side-by-Side Deltas */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="bg-[#101713] border border-[#233529] p-3 rounded">
              <div className="text-[10px] font-mono text-[#8E9490] uppercase mb-1">
                Flourishing YoY Gain
              </div>
              <div className="text-xl font-mono text-emerald-400 font-bold">
                +30.4 pts <span className="text-xs text-[#8E9490] font-normal">(92.4% vs 62.0%)</span>
              </div>
              <div className="text-[10px] font-mono text-emerald-300 mt-1">
                +49.0% biophysical expansion
              </div>
            </div>

            <div className="bg-[#101713] border border-[#233529] p-3 rounded">
              <div className="text-[10px] font-mono text-[#8E9490] uppercase mb-1">
                Decoupling Acceleration
              </div>
              <div className="text-xl font-mono text-[#C5A059] font-bold">
                +32.7 pts <span className="text-xs text-[#8E9490] font-normal">(+51.2 vs +18.5)</span>
              </div>
              <div className="text-[10px] font-mono text-[#C5A059] mt-1">
                Zero biophysical degradation
              </div>
            </div>

            <div className="bg-[#101713] border border-[#233529] p-3 rounded">
              <div className="text-[10px] font-mono text-[#8E9490] uppercase mb-1">
                Stewardship Quorum Growth
              </div>
              <div className="text-xl font-mono text-cyan-400 font-bold">
                +281% <span className="text-xs text-[#8E9490] font-normal">(458 vs 120 pods)</span>
              </div>
              <div className="text-[10px] font-mono text-cyan-300 mt-1">
                Tier-1 multi-biome consensus
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
