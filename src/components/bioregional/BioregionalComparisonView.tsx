import React, { useState, useMemo } from 'react';
import { 
  Columns2, 
  ArrowLeftRight, 
  X, 
  ShieldCheck, 
  Activity, 
  Droplets, 
  Layers, 
  TrendingUp, 
  Globe2, 
  Compass, 
  Sparkles,
  Award,
  ArrowUpRight,
  ArrowDownRight,
  Info,
  Zap,
  SlidersHorizontal
} from 'lucide-react';
import { DataProvenance } from '../../types';
import { BIOREGIONAL_LEDGER_REGIONS, BioregionalLedgerData } from '../../data/bioregionalLedgerData';
import { BioregionalSankeyFlows } from './BioregionalSankeyFlows';
import { audioFeedback } from '../../lib/audioFeedback';

interface BioregionalComparisonViewProps {
  initialRegionIdA?: string;
  initialRegionIdB?: string;
  onInspectProvenance: (prov: DataProvenance) => void;
  onClose: () => void;
}

export const BioregionalComparisonView: React.FC<BioregionalComparisonViewProps> = ({
  initialRegionIdA = 'mara-serengeti',
  initialRegionIdB = 'aberdare-cloud-forest',
  onInspectProvenance,
  onClose
}) => {
  const [regionIdA, setRegionIdA] = useState<string>(initialRegionIdA);
  const [regionIdB, setRegionIdB] = useState<string>(
    initialRegionIdB === initialRegionIdA ? 'aberdare-cloud-forest' : initialRegionIdB
  );
  const [sharedCategoryFilter, setSharedCategoryFilter] = useState<'all' | 'water' | 'energy' | 'nutrients'>('all');

  const regionA: BioregionalLedgerData = useMemo(() => {
    return BIOREGIONAL_LEDGER_REGIONS[regionIdA] || BIOREGIONAL_LEDGER_REGIONS['mara-serengeti'];
  }, [regionIdA]);

  const regionB: BioregionalLedgerData = useMemo(() => {
    return BIOREGIONAL_LEDGER_REGIONS[regionIdB] || BIOREGIONAL_LEDGER_REGIONS['aberdare-cloud-forest'];
  }, [regionIdB]);

  // Handle swap
  const handleSwapRegions = () => {
    audioFeedback.playSubtleClick();
    const temp = regionIdA;
    setRegionIdA(regionIdB);
    setRegionIdB(temp);
  };

  // Calculate comparative metrics
  const metricsComparison = useMemo(() => {
    const areaA = regionA.totalAreaHectares || 1;
    const areaB = regionB.totalAreaHectares || 1;

    // Water yield per hectare (m³/ha/yr)
    const waterYieldPerHaA = Math.round((regionA.waterYieldAnnualM3 || 0) / areaA);
    const waterYieldPerHaB = Math.round((regionB.waterYieldAnnualM3 || 0) / areaB);

    // Carbon rate per hectare (tCO2e/ha/yr)
    const carbonPerHaA = +((regionA.carbonSequestrationRateAnnualTonnes || 0) / areaA).toFixed(3);
    const carbonPerHaB = +((regionB.carbonSequestrationRateAnnualTonnes || 0) / areaB).toFixed(3);

    // Average circularity % across links
    const linksA = regionA.sankeyNetwork?.links || [];
    const linksB = regionB.sankeyNetwork?.links || [];

    const avgCircA = linksA.length 
      ? +(linksA.reduce((sum, l) => sum + (l.circularityPct || 95), 0) / linksA.length).toFixed(1) 
      : 96.4;

    const avgCircB = linksB.length 
      ? +(linksB.reduce((sum, l) => sum + (l.circularityPct || 95), 0) / linksB.length).toFixed(1) 
      : 98.1;

    // Dissipation/leakage %
    const leakageA = +(100 - avgCircA).toFixed(1);
    const leakageB = +(100 - avgCircB).toFixed(1);

    // Normalized Regenerative Efficacy Quotient (REQ): composite index (0-100)
    const scoreA = regionA.compositeFlourishingScore || 90;
    const scoreB = regionB.compositeFlourishingScore || 90;

    const reqA = +(scoreA * 0.5 + avgCircA * 0.3 + Math.min(100, waterYieldPerHaA * 0.1) * 0.2).toFixed(1);
    const reqB = +(scoreB * 0.5 + avgCircB * 0.3 + Math.min(100, waterYieldPerHaB * 0.1) * 0.2).toFixed(1);

    return {
      waterYieldPerHaA,
      waterYieldPerHaB,
      carbonPerHaA,
      carbonPerHaB,
      avgCircA,
      avgCircB,
      leakageA,
      leakageB,
      reqA,
      reqB,
      scoreA,
      scoreB
    };
  }, [regionA, regionB]);

  return (
    <div className="rounded-2xl bg-[#080C0A] border-2 border-purple-500/50 p-4 sm:p-6 shadow-2xl space-y-6 font-mono animate-in fade-in duration-200">
      {/* Top Header & Close Button */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#F5F5F0]/15 pb-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-purple-500/20 text-purple-300 border border-purple-500/40">
              <Columns2 className="w-4 h-4 animate-pulse" />
            </span>
            <span className="text-xs uppercase tracking-widest text-purple-400 font-bold">
              Multi-Region Comparative Analysis
            </span>
            <span className="text-[10px] bg-purple-950 text-purple-200 border border-purple-500/40 px-2 py-0.5 rounded font-bold">
              Cross-Regional Efficacy
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-serif font-bold text-white tracking-wide">
            Side-by-Side Bioregional Metabolic Comparison
          </h2>
          <p className="text-xs text-[#F5F5F0]/70 font-sans max-w-3xl">
            Simultaneously evaluates mass-balance resource flows, closed-loop circularity, and regenerative output across distinct biomes to isolate transferable ecological interventions.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start md:self-center">
          <button
            onClick={handleSwapRegions}
            className="px-3 py-1.5 rounded-lg bg-[#141C16] hover:bg-[#1E2922] text-purple-300 hover:text-white border border-purple-500/30 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow"
            title="Swap Left and Right Bioregions"
          >
            <ArrowLeftRight className="w-3.5 h-3.5" />
            <span>Swap Regions</span>
          </button>

          <button
            onClick={() => {
              audioFeedback.playSubtleClick();
              onClose();
            }}
            className="p-2 rounded-lg bg-[#141C16] hover:bg-[#1E2922] text-[#F5F5F0]/60 hover:text-white border border-white/10 transition-all cursor-pointer"
            title="Exit Side-by-Side Comparison"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Region Selectors Header Strip */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-[#0B100D] p-3 rounded-xl border border-white/10 text-xs">
        {/* Region A Selector */}
        <div className="flex items-center justify-between gap-2 p-2 rounded-lg bg-[#070A08] border border-cyan-500/30">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400" />
            <span className="text-neutral-400 text-[11px] font-bold">Region A:</span>
          </div>
          <select
            value={regionIdA}
            onChange={(e) => {
              audioFeedback.playSubtleClick();
              setRegionIdA(e.target.value);
            }}
            className="bg-[#121914] text-cyan-300 font-bold px-2.5 py-1 rounded border border-cyan-500/40 text-xs focus:outline-none cursor-pointer"
          >
            {Object.values(BIOREGIONAL_LEDGER_REGIONS).map((reg) => (
              <option key={reg.regionId} value={reg.regionId} className="bg-[#0A0D0B] text-white">
                {reg.regionName}
              </option>
            ))}
          </select>
        </div>

        {/* Region B Selector */}
        <div className="flex items-center justify-between gap-2 p-2 rounded-lg bg-[#070A08] border border-amber-500/30">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
            <span className="text-neutral-400 text-[11px] font-bold">Region B:</span>
          </div>
          <select
            value={regionIdB}
            onChange={(e) => {
              audioFeedback.playSubtleClick();
              setRegionIdB(e.target.value);
            }}
            className="bg-[#121914] text-amber-300 font-bold px-2.5 py-1 rounded border border-amber-500/40 text-xs focus:outline-none cursor-pointer"
          >
            {Object.values(BIOREGIONAL_LEDGER_REGIONS).map((reg) => (
              <option key={reg.regionId} value={reg.regionId} className="bg-[#0A0D0B] text-white">
                {reg.regionName}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* CROSS-REGIONAL REGENERATIVE EFFICACY BENCHMARK MATRIX */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs border-b border-white/10 pb-1">
          <span className="text-purple-300 uppercase font-bold tracking-wider flex items-center gap-1.5">
            <Award className="w-3.5 h-3.5 text-purple-400" />
            Cross-Regional Regenerative Efficacy Benchmark Matrix
          </span>
          <span className="text-[10px] text-neutral-400">Normalized per Hectare & Biome Baseline</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 text-xs">
          {/* Flourishing Score */}
          <div className="p-3 rounded-xl bg-[#0C120F] border border-white/10 space-y-1">
            <span className="text-[9px] text-neutral-400 uppercase font-bold block">Flourishing Score</span>
            <div className="flex items-baseline justify-between">
              <span className="font-bold text-cyan-300">{metricsComparison.scoreA}</span>
              <span className="text-neutral-500 text-[10px]">vs</span>
              <span className="font-bold text-amber-300">{metricsComparison.scoreB}</span>
            </div>
            <div className="text-[9px] text-emerald-400 pt-0.5">
              {metricsComparison.scoreA >= metricsComparison.scoreB ? 'Reg A leads' : 'Reg B leads'} by {Math.abs(metricsComparison.scoreA - metricsComparison.scoreB).toFixed(1)} pts
            </div>
          </div>

          {/* Regenerative Efficacy Quotient */}
          <div className="p-3 rounded-xl bg-[#0C120F] border border-purple-500/30 space-y-1">
            <span className="text-[9px] text-purple-300 uppercase font-bold block">Efficacy Quotient</span>
            <div className="flex items-baseline justify-between">
              <span className="font-bold text-cyan-300">{metricsComparison.reqA}</span>
              <span className="text-neutral-500 text-[10px]">vs</span>
              <span className="font-bold text-amber-300">{metricsComparison.reqB}</span>
            </div>
            <div className="text-[9px] text-purple-400 pt-0.5">REQ Index (0-100)</div>
          </div>

          {/* Water Retention Density */}
          <div className="p-3 rounded-xl bg-[#0C120F] border border-white/10 space-y-1">
            <span className="text-[9px] text-neutral-400 uppercase font-bold block">Water Yield / Ha</span>
            <div className="flex items-baseline justify-between">
              <span className="font-bold text-cyan-300">{metricsComparison.waterYieldPerHaA}</span>
              <span className="text-neutral-500 text-[10px]">vs</span>
              <span className="font-bold text-amber-300">{metricsComparison.waterYieldPerHaB}</span>
            </div>
            <div className="text-[9px] text-cyan-400 pt-0.5">m³ / hectare / yr</div>
          </div>

          {/* Carbon Fixation Density */}
          <div className="p-3 rounded-xl bg-[#0C120F] border border-white/10 space-y-1">
            <span className="text-[9px] text-neutral-400 uppercase font-bold block">Carbon Fixation</span>
            <div className="flex items-baseline justify-between">
              <span className="font-bold text-cyan-300">{metricsComparison.carbonPerHaA}</span>
              <span className="text-neutral-500 text-[10px]">vs</span>
              <span className="font-bold text-amber-300">{metricsComparison.carbonPerHaB}</span>
            </div>
            <div className="text-[9px] text-amber-400 pt-0.5">tCO2e / ha / yr</div>
          </div>

          {/* Resource Circularity % */}
          <div className="p-3 rounded-xl bg-[#0C120F] border border-white/10 space-y-1">
            <span className="text-[9px] text-neutral-400 uppercase font-bold block">Closed Circularity</span>
            <div className="flex items-baseline justify-between">
              <span className="font-bold text-cyan-300">{metricsComparison.avgCircA}%</span>
              <span className="text-neutral-500 text-[10px]">vs</span>
              <span className="font-bold text-amber-300">{metricsComparison.avgCircB}%</span>
            </div>
            <div className="text-[9px] text-emerald-400 pt-0.5">Retained In-Basin</div>
          </div>

          {/* Unmetered Dissipation / Leakage */}
          <div className="p-3 rounded-xl bg-[#0C120F] border border-white/10 space-y-1">
            <span className="text-[9px] text-neutral-400 uppercase font-bold block">Unmetered Leakage</span>
            <div className="flex items-baseline justify-between">
              <span className="font-bold text-cyan-300">{metricsComparison.leakageA}%</span>
              <span className="text-neutral-500 text-[10px]">vs</span>
              <span className="font-bold text-amber-300">{metricsComparison.leakageB}%</span>
            </div>
            <div className="text-[9px] text-red-400 pt-0.5">Systemic Dissipation</div>
          </div>
        </div>
      </div>

      {/* Shared Resource Category Filter */}
      <div className="flex items-center justify-between bg-[#0B100D] p-2.5 rounded-xl border border-white/10 text-xs">
        <span className="text-neutral-400 text-[11px] flex items-center gap-1.5 font-bold">
          <SlidersHorizontal className="w-3.5 h-3.5 text-purple-400" />
          Synchronized Resource Flow Filter:
        </span>
        <div className="flex items-center gap-1">
          {(['all', 'water', 'energy', 'nutrients'] as const).map(cat => (
            <button
              key={cat}
              onClick={() => {
                audioFeedback.playSubtleClick();
                setSharedCategoryFilter(cat);
              }}
              className={`px-3 py-1 rounded text-[10px] font-bold uppercase transition-all cursor-pointer ${
                sharedCategoryFilter === cat
                  ? 'bg-purple-600 text-white shadow-sm'
                  : 'bg-[#141C16] text-neutral-400 hover:text-white border border-white/5'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* DUAL SANKEY DIAGRAMS: REGION A vs REGION B */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Column 1: Region A */}
        <div className="p-4 rounded-2xl bg-[#0A0E0C] border-2 border-cyan-500/40 shadow-xl space-y-3">
          <div className="flex items-center justify-between border-b border-cyan-500/30 pb-2">
            <div>
              <span className="text-[10px] uppercase font-bold text-cyan-400 block">Region A</span>
              <h3 className="text-sm sm:text-base font-bold text-white line-clamp-1">{regionA.regionName}</h3>
            </div>
            <span className="text-xs text-cyan-300 font-bold bg-cyan-950 px-2 py-0.5 rounded border border-cyan-500/40">
              {metricsComparison.scoreA}/100 Flourishing
            </span>
          </div>

          {/* Interactive Sankey A */}
          <BioregionalSankeyFlows
            region={regionA}
            selectedYear={2026}
            onInspectProvenance={onInspectProvenance}
          />
        </div>

        {/* Column 2: Region B */}
        <div className="p-4 rounded-2xl bg-[#0A0E0C] border-2 border-amber-500/40 shadow-xl space-y-3">
          <div className="flex items-center justify-between border-b border-amber-500/30 pb-2">
            <div>
              <span className="text-[10px] uppercase font-bold text-amber-400 block">Region B</span>
              <h3 className="text-sm sm:text-base font-bold text-white line-clamp-1">{regionB.regionName}</h3>
            </div>
            <span className="text-xs text-amber-300 font-bold bg-amber-950 px-2 py-0.5 rounded border border-amber-500/40">
              {metricsComparison.scoreB}/100 Flourishing
            </span>
          </div>

          {/* Interactive Sankey B */}
          <BioregionalSankeyFlows
            region={regionB}
            selectedYear={2026}
            onInspectProvenance={onInspectProvenance}
          />
        </div>
      </div>

      {/* Cross-Regional Comparative Synthesis & Policy Interventions */}
      <div className="p-4 rounded-xl bg-[#0C120F] border border-purple-500/40 space-y-3 text-xs">
        <div className="flex items-center gap-2 text-purple-300 font-bold">
          <Sparkles className="w-4 h-4 text-purple-400" />
          <span>Cross-Regional Regenerative Efficacy Synthesis:</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-neutral-300 font-sans leading-relaxed text-[11px]">
          <div className="space-y-1.5 p-3 rounded-lg bg-black/40 border border-white/5">
            <strong className="text-cyan-300 font-mono block">Biome Specialization Profile (Region A):</strong>
            <p>
              {regionA.regionName} leverages vast grassland ungulate motility and high-turnover C4 perennial grasses, resulting in rapid topsoil organic carbon sequestration. High peak volume water yields buffer dry-season downstream corridors.
            </p>
          </div>

          <div className="space-y-1.5 p-3 rounded-lg bg-black/40 border border-white/5">
            <strong className="text-amber-300 font-mono block">Biome Specialization Profile (Region B):</strong>
            <p>
              {regionB.regionName} exhibits higher per-hectare water capture density and continuous run-of-the-river gravity hydro power, achieving superior closed-loop circularity ({metricsComparison.avgCircB}%) and lower systemic unmetered leakage.
            </p>
          </div>
        </div>

        <div className="p-2.5 rounded-lg bg-purple-950/30 border border-purple-500/30 text-[10px] text-purple-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Info className="w-4 h-4 text-purple-400 shrink-0" />
            <span>
              <strong>Cross-Pollination Recommendation:</strong> Deploying Aberdare's micro-hydro gravity conduits across Mara tributary drops would increase renewable electrification while conserving Mara's exceptional ungulate carbon cycle.
            </span>
          </div>
          <button
            onClick={() => {
              audioFeedback.playSubtleClick();
              onClose();
            }}
            className="px-3 py-1 rounded bg-purple-600 hover:bg-purple-500 text-white font-bold shrink-0 ml-3 cursor-pointer"
          >
            Close Comparison
          </button>
        </div>
      </div>
    </div>
  );
};
