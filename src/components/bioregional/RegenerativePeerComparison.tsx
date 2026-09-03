import React, { useState, useMemo } from 'react';
import {
  Users,
  TrendingUp,
  BarChart3,
  ShieldCheck,
  Award,
  Globe2,
  Sparkles,
  Droplets,
  TreePine,
  Layers,
  ArrowUpRight,
  Info,
  CheckCircle2,
  Lock,
  ChevronRight,
  Activity,
  Sliders
} from 'lucide-react';
import { BioregionalLedgerData } from '../../data/bioregionalLedgerData';
import { audioFeedback } from '../../lib/audioFeedback';

export interface RegionalArchetype {
  id: string;
  name: string;
  description: string;
  peerCount: number;
  totalHectaresTracked: number;
  benchmarks: {
    waterRetentionM3PerHa: { min: number; q1: number; median: number; q3: number; top10: number; unit: string };
    soilCarbonRateTCO2ePerHa: { min: number; q1: number; median: number; q3: number; top10: number; unit: string };
    circularityPct: { min: number; q1: number; median: number; q3: number; top10: number; unit: string };
    unmeteredLeakagePct: { min: number; q1: number; median: number; q3: number; top10: number; unit: string };
    reqIndex: { min: number; q1: number; median: number; q3: number; top10: number; unit: string };
    stewardAssembliesPer10kHa: { min: number; q1: number; median: number; q3: number; top10: number; unit: string };
  };
  topPractices: string[];
}

export const ARCHETYPE_DATABASE: Record<string, RegionalArchetype> = {
  savanna_silvopasture: {
    id: 'savanna_silvopasture',
    name: 'Savanna Grassland & Silvopastoral Basin',
    description: 'Semi-arid tropical grasslands, seasonal monsoonal pulses, communal pastoral conservancies, and wildlife migratory corridors.',
    peerCount: 58,
    totalHectaresTracked: 14200000,
    benchmarks: {
      waterRetentionM3PerHa: { min: 420, q1: 680, median: 890, q3: 1140, top10: 1380, unit: 'm³/ha/yr' },
      soilCarbonRateTCO2ePerHa: { min: 1.2, q1: 2.1, median: 3.4, q3: 4.6, top10: 5.6, unit: 'tCO2e/ha/yr' },
      circularityPct: { min: 62, q1: 74, median: 83, q3: 91, top10: 96, unit: '%' },
      unmeteredLeakagePct: { min: 4, q1: 9, median: 17, q3: 26, top10: 38, unit: '%' },
      reqIndex: { min: 48, q1: 64, median: 76, q3: 87, top10: 94, unit: 'REQ Index' },
      stewardAssembliesPer10kHa: { min: 1.2, q1: 2.4, median: 3.8, q3: 5.2, top10: 7.1, unit: 'councils/10k ha' }
    },
    topPractices: [
      'Holistic Planned Rotational Bunched-Grazing with solar mobile kraals',
      'Sand dam subsurface water retention with solar piezometric sensors',
      'Indigenous Commiphora live fencing to halt seasonal sheet erosion'
    ]
  },
  montane_cloud_forest: {
    id: 'montane_cloud_forest',
    name: 'Montane Cloud Forest & High Water Tower',
    description: 'High-altitude equatorial rain catchments, persistent orographic fog, endemic Podocarpus canopies, and deep volcanic soil humic sponges.',
    peerCount: 42,
    totalHectaresTracked: 4800000,
    benchmarks: {
      waterRetentionM3PerHa: { min: 890, q1: 1450, median: 1980, q3: 2450, top10: 2920, unit: 'm³/ha/yr' },
      soilCarbonRateTCO2ePerHa: { min: 2.4, q1: 3.8, median: 5.2, q3: 6.4, top10: 7.5, unit: 'tCO2e/ha/yr' },
      circularityPct: { min: 70, q1: 82, median: 89, q3: 94, top10: 98, unit: '%' },
      unmeteredLeakagePct: { min: 2, q1: 6, median: 11, q3: 18, top10: 30, unit: '%' },
      reqIndex: { min: 56, q1: 72, median: 84, q3: 92, top10: 97, unit: 'REQ Index' },
      stewardAssembliesPer10kHa: { min: 2.0, q1: 3.5, median: 4.8, q3: 6.5, top10: 8.4, unit: 'councils/10k ha' }
    },
    topPractices: [
      'Mountain Bamboo (Yushania alpina) riparian migratory bio-corridors',
      'High-altitude cloud moisture harvesting via multi-layered forest canopies',
      'Mycorrhizal inoculants combined with biochar compost bio-swales'
    ]
  },
  rift_lacustrine: {
    id: 'rift_lacustrine',
    name: 'Rift Valley Lacustrine & Endorheic Wetland',
    description: 'Closed-basin tectonic lakes, volcanic geothermal thermal gradients, fragile riparian acacia fringing, and intense agricultural interfaces.',
    peerCount: 31,
    totalHectaresTracked: 3100000,
    benchmarks: {
      waterRetentionM3PerHa: { min: 510, q1: 790, median: 1080, q3: 1420, top10: 1750, unit: 'm³/ha/yr' },
      soilCarbonRateTCO2ePerHa: { min: 1.5, q1: 2.6, median: 3.8, q3: 4.9, top10: 5.9, unit: 'tCO2e/ha/yr' },
      circularityPct: { min: 58, q1: 70, median: 80, q3: 88, top10: 94, unit: '%' },
      unmeteredLeakagePct: { min: 6, q1: 12, median: 20, q3: 30, top10: 42, unit: '%' },
      reqIndex: { min: 42, q1: 58, median: 72, q3: 83, top10: 91, unit: 'REQ Index' },
      stewardAssembliesPer10kHa: { min: 1.0, q1: 2.1, median: 3.2, q3: 4.6, top10: 6.0, unit: 'councils/10k ha' }
    },
    topPractices: [
      'Constructed wetland papyrus silt-traps fronting flower farm outfalls',
      'Geothermal condensate recovery into communal aquifer recharge pits',
      'Aquifer recharge piezometer mesh with automated abstraction quotas'
    ]
  },
  dryland_agropastoral: {
    id: 'dryland_agropastoral',
    name: 'Dryland Agro-Pastoral & Acacia Shrubland',
    description: 'Arid scrubland, erratic biphasic precipitation, deep alluvial sand luggas, and hardy drought-tolerant sorghum-millet agroecology.',
    peerCount: 49,
    totalHectaresTracked: 18500000,
    benchmarks: {
      waterRetentionM3PerHa: { min: 210, q1: 380, median: 540, q3: 740, top10: 980, unit: 'm³/ha/yr' },
      soilCarbonRateTCO2ePerHa: { min: 0.6, q1: 1.2, median: 2.0, q3: 2.9, top10: 3.8, unit: 'tCO2e/ha/yr' },
      circularityPct: { min: 50, q1: 64, median: 76, q3: 85, top10: 92, unit: '%' },
      unmeteredLeakagePct: { min: 8, q1: 15, median: 24, q3: 36, top10: 50, unit: '%' },
      reqIndex: { min: 38, q1: 52, median: 66, q3: 78, top10: 88, unit: 'REQ Index' },
      stewardAssembliesPer10kHa: { min: 0.8, q1: 1.6, median: 2.6, q3: 3.8, top10: 5.2, unit: 'councils/10k ha' }
    },
    topPractices: [
      'Deep zai pit water harvesting with organic manure inoculants',
      'Farmer-Managed Natural Regeneration (FMNR) of indigenous Acacia senegal',
      'Solar borehole smart water dispensing tokens for camel & cattle herds'
    ]
  }
};

export interface RegenerativePeerComparisonProps {
  region: BioregionalLedgerData;
  flourishingScore: number;
  waterYieldM3: number;
  carbonRateTonnes: number;
}

export const RegenerativePeerComparison: React.FC<RegenerativePeerComparisonProps> = ({
  region,
  flourishingScore,
  waterYieldM3,
  carbonRateTonnes
}) => {
  // Determine default archetype based on regionId
  const defaultArchetypeKey = useMemo(() => {
    if (region.regionId.includes('aberdare')) return 'montane_cloud_forest';
    if (region.regionId.includes('naivasha')) return 'rift_lacustrine';
    return 'savanna_silvopasture';
  }, [region.regionId]);

  const [selectedArchetypeKey, setSelectedArchetypeKey] = useState<string>(defaultArchetypeKey);
  const [benchmarkMode, setBenchmarkMode] = useState<'archetype' | 'global'>('archetype');

  const activeArchetype = ARCHETYPE_DATABASE[selectedArchetypeKey] || ARCHETYPE_DATABASE.savanna_silvopasture;

  // Normalized Current Bioregion Per-Hectare Metrics
  const currentMetrics = useMemo(() => {
    const ha = region.totalAreaHectares || 120000;
    const waterPerHa = +(waterYieldM3 / ha).toFixed(0);
    const carbonPerHa = +(carbonRateTonnes / ha).toFixed(1);
    const avgCircularity = +(
      region.resourceFlows.reduce((acc, f) => acc + f.circularityPct, 0) / region.resourceFlows.length
    ).toFixed(1);
    const unmeteredLoss = +(100 - avgCircularity).toFixed(1);
    const req = +(flourishingScore * 1.05).toFixed(1);
    const councilsDensity = +((region.activeStewardAssembliesCount / ha) * 10000).toFixed(1);

    return {
      waterRetentionM3PerHa: waterPerHa,
      soilCarbonRateTCO2ePerHa: carbonPerHa,
      circularityPct: avgCircularity,
      unmeteredLeakagePct: unmeteredLoss,
      reqIndex: req,
      stewardAssembliesPer10kHa: councilsDensity
    };
  }, [region, waterYieldM3, carbonRateTonnes, flourishingScore]);

  // Compute percentile ranking helper
  const computePercentile = (val: number, b: { min: number; q1: number; median: number; q3: number; top10: number }, lowerIsBetter = false) => {
    if (lowerIsBetter) {
      if (val <= b.min) return 99;
      if (val <= b.q1) return 85;
      if (val <= b.median) return 60;
      if (val <= b.q3) return 35;
      return 15;
    }
    if (val >= b.top10) return 94;
    if (val >= b.q3) return 82;
    if (val >= b.median) return 58;
    if (val >= b.q1) return 32;
    return 14;
  };

  // Metric Comparison Cards List
  const metricCards = useMemo(() => {
    const b = activeArchetype.benchmarks;
    return [
      {
        id: 'water',
        name: 'Water Retention Efficiency',
        icon: <Droplets className="w-4 h-4 text-cyan-400" />,
        unit: b.waterRetentionM3PerHa.unit,
        currentValue: currentMetrics.waterRetentionM3PerHa,
        benchmarks: b.waterRetentionM3PerHa,
        lowerIsBetter: false,
        deltaVsMedian: +(((currentMetrics.waterRetentionM3PerHa - b.waterRetentionM3PerHa.median) / b.waterRetentionM3PerHa.median) * 100).toFixed(0),
        percentile: computePercentile(currentMetrics.waterRetentionM3PerHa, b.waterRetentionM3PerHa)
      },
      {
        id: 'carbon',
        name: 'Soil Carbon Sequestration Density',
        icon: <TreePine className="w-4 h-4 text-emerald-400" />,
        unit: b.soilCarbonRateTCO2ePerHa.unit,
        currentValue: currentMetrics.soilCarbonRateTCO2ePerHa,
        benchmarks: b.soilCarbonRateTCO2ePerHa,
        lowerIsBetter: false,
        deltaVsMedian: +(((currentMetrics.soilCarbonRateTCO2ePerHa - b.soilCarbonRateTCO2ePerHa.median) / b.soilCarbonRateTCO2ePerHa.median) * 100).toFixed(0),
        percentile: computePercentile(currentMetrics.soilCarbonRateTCO2ePerHa, b.soilCarbonRateTCO2ePerHa)
      },
      {
        id: 'circularity',
        name: 'Closed-Loop Circularity Quotient',
        icon: <Activity className="w-4 h-4 text-purple-400" />,
        unit: b.circularityPct.unit,
        currentValue: currentMetrics.circularityPct,
        benchmarks: b.circularityPct,
        lowerIsBetter: false,
        deltaVsMedian: +(((currentMetrics.circularityPct - b.circularityPct.median) / b.circularityPct.median) * 100).toFixed(0),
        percentile: computePercentile(currentMetrics.circularityPct, b.circularityPct)
      },
      {
        id: 'leakage',
        name: 'Unmetered Resource Dissipation',
        icon: <Layers className="w-4 h-4 text-amber-400" />,
        unit: b.unmeteredLeakagePct.unit,
        currentValue: currentMetrics.unmeteredLeakagePct,
        benchmarks: b.unmeteredLeakagePct,
        lowerIsBetter: true,
        deltaVsMedian: +(((currentMetrics.unmeteredLeakagePct - b.unmeteredLeakagePct.median) / b.unmeteredLeakagePct.median) * 100).toFixed(0),
        percentile: computePercentile(currentMetrics.unmeteredLeakagePct, b.unmeteredLeakagePct, true)
      },
      {
        id: 'req',
        name: 'Regenerative Efficacy Quotient (REQ)',
        icon: <Award className="w-4 h-4 text-[#C5A059]" />,
        unit: b.reqIndex.unit,
        currentValue: currentMetrics.reqIndex,
        benchmarks: b.reqIndex,
        lowerIsBetter: false,
        deltaVsMedian: +(((currentMetrics.reqIndex - b.reqIndex.median) / b.reqIndex.median) * 100).toFixed(0),
        percentile: computePercentile(currentMetrics.reqIndex, b.reqIndex)
      },
      {
        id: 'councils',
        name: 'Steward Governance Density',
        icon: <Users className="w-4 h-4 text-rose-400" />,
        unit: b.stewardAssembliesPer10kHa.unit,
        currentValue: currentMetrics.stewardAssembliesPer10kHa,
        benchmarks: b.stewardAssembliesPer10kHa,
        lowerIsBetter: false,
        deltaVsMedian: +(((currentMetrics.stewardAssembliesPer10kHa - b.stewardAssembliesPer10kHa.median) / b.stewardAssembliesPer10kHa.median) * 100).toFixed(0),
        percentile: computePercentile(currentMetrics.stewardAssembliesPer10kHa, b.stewardAssembliesPer10kHa)
      }
    ];
  }, [activeArchetype, currentMetrics]);

  return (
    <div className="p-4 sm:p-5 rounded-2xl bg-[#090D0A] border border-[#C5A059]/40 shadow-2xl space-y-6 font-mono text-xs text-[#F5F5F0]">
      {/* Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-[#F5F5F0]/15 pb-4">
        <div className="flex items-center gap-3">
          <span className="p-2.5 rounded-xl bg-[#C5A059]/20 text-[#C5A059] border border-[#C5A059]/40">
            <BarChart3 className="w-5 h-5" />
          </span>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="font-serif font-bold text-white text-base sm:text-lg tracking-wide">
                Regenerative Peer Comparison & Archetype Benchmarking
              </h3>
              <span className="px-2 py-0.5 rounded text-[9px] font-bold uppercase bg-[#C5A059]/20 text-[#C5A059] border border-[#C5A059]/40">
                Anonymous Section 30 zk-Aggregate
              </span>
            </div>
            <p className="text-xs text-[#F5F5F0]/70 font-sans mt-0.5">
              Anonymously benchmark resource efficiency and biophysical performance against verified regional archetypes with identical geomorphic baselines.
            </p>
          </div>
        </div>

        {/* Peer Benchmark Toggle Mode */}
        <div className="flex items-center gap-1.5 self-start md:self-auto bg-[#121914] p-1 rounded-lg border border-[#F5F5F0]/10">
          <button
            onClick={() => {
              setBenchmarkMode('archetype');
              audioFeedback.playMicroTick();
            }}
            className={`px-3 py-1 rounded text-[10px] font-bold transition-all cursor-pointer ${
              benchmarkMode === 'archetype'
                ? 'bg-[#C5A059] text-black shadow font-extrabold'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            Archetype Cohort ({activeArchetype.peerCount} Peers)
          </button>
          <button
            onClick={() => {
              setBenchmarkMode('global');
              audioFeedback.playMicroTick();
            }}
            className={`px-3 py-1 rounded text-[10px] font-bold transition-all cursor-pointer ${
              benchmarkMode === 'global'
                ? 'bg-[#C5A059] text-black shadow font-extrabold'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            Global Network (216 Bioregions)
          </button>
        </div>
      </div>

      {/* Archetype Selector Bar */}
      <div className="p-3.5 rounded-xl bg-[#0D120E] border border-[#F5F5F0]/10 space-y-2">
        <div className="flex items-center justify-between text-[11px]">
          <span className="text-neutral-400 uppercase font-bold flex items-center gap-1.5">
            <Globe2 className="w-3.5 h-3.5 text-[#C5A059]" />
            Select Comparative Ecological Archetype:
          </span>
          <span className="text-[10px] text-emerald-400 font-bold">
            Auto-matched to {region.regionName}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 pt-1">
          {Object.values(ARCHETYPE_DATABASE).map((arch) => {
            const isSelected = selectedArchetypeKey === arch.id;
            return (
              <button
                key={arch.id}
                onClick={() => {
                  setSelectedArchetypeKey(arch.id);
                  audioFeedback.playSubtleClick();
                }}
                className={`p-2.5 rounded-lg border text-left transition-all cursor-pointer flex flex-col justify-between gap-1.5 ${
                  isSelected
                    ? 'bg-[#18201A] border-[#C5A059] text-white shadow'
                    : 'bg-[#101411] border-[#F5F5F0]/10 text-neutral-400 hover:text-neutral-200'
                }`}
              >
                <div>
                  <div className="font-serif font-bold text-xs truncate">
                    {arch.name}
                  </div>
                  <div className="text-[9px] text-neutral-400 font-sans mt-0.5 line-clamp-1">
                    {arch.peerCount} Bioregions • {(arch.totalHectaresTracked / 1000000).toFixed(1)}M ha
                  </div>
                </div>

                <div className="flex items-center justify-between text-[8px] text-[#C5A059]">
                  <span>{isSelected ? 'Current Archetype' : 'Switch Archetype'}</span>
                  <ChevronRight className="w-3 h-3" />
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Benchmark Distribution Matrix */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-[11px]">
          <span className="text-[#C5A059] font-bold uppercase flex items-center gap-1.5">
            <Activity className="w-3.5 h-3.5" />
            Biophysical Efficiency Benchmark Matrix ({activeArchetype.name})
          </span>
          <span className="text-neutral-400 text-[10px]">
            Quartiles: [Q1 (25%) • Median (50%) • Q3 (75%) • Top Decile (90%)]
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {metricCards.map((card) => {
            const isAboveMedian = card.lowerIsBetter ? card.deltaVsMedian <= 0 : card.deltaVsMedian >= 0;
            const b = card.benchmarks;
            const range = b.top10 - b.min;
            const markerPos = Math.max(5, Math.min(95, ((card.currentValue - b.min) / (range || 1)) * 100));

            return (
              <div
                key={card.id}
                className="p-4 rounded-xl bg-[#101511] border border-[#F5F5F0]/10 hover:border-[#C5A059]/40 transition-all space-y-3"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="p-1.5 rounded-lg bg-black/40 border border-white/10 shrink-0">
                      {card.icon}
                    </span>
                    <div>
                      <h4 className="font-serif font-bold text-white text-xs">
                        {card.name}
                      </h4>
                      <span className="text-[9px] text-neutral-400">
                        Normalized per hectare
                      </span>
                    </div>
                  </div>

                  {/* Percentile Rank Pill */}
                  <div className="text-right shrink-0">
                    <span className="px-2 py-0.5 rounded text-[9px] font-bold uppercase bg-emerald-950 text-emerald-300 border border-emerald-500/40">
                      {card.percentile}th %tile
                    </span>
                  </div>
                </div>

                {/* Main Values: Regional vs Peer Median */}
                <div className="flex items-baseline justify-between border-t border-b border-white/5 py-2">
                  <div>
                    <div className="text-[9px] text-neutral-400 uppercase">Your Bioregion:</div>
                    <div className="text-lg font-bold text-white mt-0.5">
                      {card.currentValue}{' '}
                      <span className="text-xs text-neutral-400 font-normal">{card.unit}</span>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-[9px] text-neutral-400 uppercase">Cohort Median:</div>
                    <div className="text-sm font-bold text-neutral-300 mt-0.5">
                      {b.median} {card.unit}
                    </div>
                    <div className={`text-[9px] font-bold ${isAboveMedian ? 'text-emerald-400' : 'text-rose-400'}`}>
                      {card.deltaVsMedian >= 0 ? `+${card.deltaVsMedian}%` : `${card.deltaVsMedian}%`} vs median
                    </div>
                  </div>
                </div>

                {/* Visual Distribution Range Bar */}
                <div className="space-y-1 text-[9px] text-neutral-400">
                  <div className="flex justify-between text-[8px]">
                    <span>Min: {b.min}</span>
                    <span>Q2 (Med): {b.median}</span>
                    <span>Top 10%: {b.top10}</span>
                  </div>

                  <div className="relative w-full h-3 bg-[#070A08] rounded-full border border-white/10 overflow-hidden">
                    {/* Quartile bands */}
                    <div className="absolute left-[25%] right-[25%] top-0 bottom-0 bg-[#C5A059]/15 border-x border-[#C5A059]/40"></div>
                    <div className="absolute left-[50%] top-0 bottom-0 w-0.5 bg-[#C5A059]"></div>

                    {/* User Marker Dot */}
                    <div
                      className="absolute top-0 bottom-0 w-2.5 bg-emerald-400 rounded-full shadow-[0_0_8px_rgba(52,211,153,0.8)] -ml-1.5"
                      style={{ left: `${markerPos}%` }}
                      title={`Your value: ${card.currentValue} ${card.unit}`}
                    />
                  </div>

                  <div className="text-center text-[8px] text-emerald-400 font-bold pt-0.5">
                    {card.percentile >= 90 ? '★ Top Decile Archetype Performer' : card.percentile >= 75 ? 'Upper Quartile Efficiency (Q3)' : 'Cohort Median Equilibrium'}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Transferable Insights from Top-Performing Peers */}
      <div className="p-4 rounded-xl bg-[#0E1410] border border-emerald-500/30 space-y-2">
        <div className="flex items-center gap-2 text-emerald-400 font-bold uppercase text-[11px]">
          <Sparkles className="w-4 h-4 text-emerald-400" />
          Transferable Practices Deployed by Top-Decile Peers ({activeArchetype.name}):
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5 pt-1 text-[11px] font-sans text-neutral-300">
          {activeArchetype.topPractices.map((practice, idx) => (
            <div key={idx} className="p-2.5 rounded-lg bg-[#141E17] border border-emerald-500/20 flex items-start gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
              <span>{practice}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Privacy Guarantee Note */}
      <div className="p-2.5 rounded-lg bg-[#070A08] border border-white/5 flex items-center justify-between text-[10px] text-neutral-400">
        <div className="flex items-center gap-2">
          <Lock className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
          <span>Section 30 Zero-Knowledge Peer Aggregation: Landholder data is cryptographically blinded and aggregated anonymously.</span>
        </div>
        <span className="text-[#C5A059] font-bold shrink-0">v2.4 Audit Verified</span>
      </div>
    </div>
  );
};
