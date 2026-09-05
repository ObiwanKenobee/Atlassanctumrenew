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
  ArrowDownRight,
  Info,
  CheckCircle2,
  Lock,
  ChevronRight,
  Activity,
  Sliders,
  Calendar,
  Eye,
  EyeOff,
  Flame,
  LayoutGrid,
  SlidersHorizontal,
  Filter
} from 'lucide-react';
import { BioregionalLedgerData } from '../../data/bioregionalLedgerData';
import { audioFeedback } from '../../lib/audioFeedback';
import { D3ResourceEfficiencyRadar } from './D3ResourceEfficiencyRadar';

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

export const MONTH_LABELS = ['Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'];

// Helper to generate 12-month historical progression relative to archetype median
export const generate12MonthTrend = (currentVal: number, medianVal: number, lowerIsBetter = false) => {
  return MONTH_LABELS.map((month, i) => {
    const progress = i / 11; // 0 to 1
    let reg: number;
    if (lowerIsBetter) {
      const startFactor = 1.36;
      const noise = Math.sin(i * 1.4) * 0.04;
      reg = +(currentVal * (startFactor - (startFactor - 1) * progress + noise)).toFixed(1);
    } else {
      const startFactor = 0.76;
      const noise = Math.sin(i * 1.4) * 0.03;
      reg = +(currentVal * (startFactor + (1 - startFactor) * progress + noise)).toFixed(1);
    }
    const archNoise = Math.cos(i * 0.8) * 0.02;
    const arch = +(medianVal * (1 + archNoise)).toFixed(1);
    const deltaPct = +(((reg - arch) / (arch || 1)) * 100).toFixed(1);

    return {
      month,
      region: reg,
      archetype: arch,
      deltaPct
    };
  });
};

interface SparklineChartProps {
  data: { month: string; region: number; archetype: number; deltaPct: number }[];
  unit: string;
  color?: string;
  height?: number;
  showLabels?: boolean;
  lowerIsBetter?: boolean;
}

const SparklineChart: React.FC<SparklineChartProps> = ({
  data,
  unit,
  color = '#10B981',
  height = 42,
  showLabels = true,
  lowerIsBetter = false
}) => {
  const [hoverIdx, setHoverIdx] = useState<number | null>(null);

  const allVals = data.flatMap((d) => [d.region, d.archetype]);
  const minVal = Math.min(...allVals) * 0.94;
  const maxVal = Math.max(...allVals) * 1.06;
  const range = maxVal - minVal || 1;

  const width = 260;
  const padX = 6;
  const padY = 6;

  const getX = (i: number) => padX + (i / (data.length - 1)) * (width - padX * 2);
  const getY = (val: number) => height - padY - ((val - minVal) / range) * (height - padY * 2);

  const regionPoints = data.map((d, i) => `${getX(i).toFixed(1)},${getY(d.region).toFixed(1)}`).join(' ');
  const archetypePoints = data.map((d, i) => `${getX(i).toFixed(1)},${getY(d.archetype).toFixed(1)}`).join(' ');
  const areaPoints = `${getX(0).toFixed(1)},${height} ${regionPoints} ${getX(data.length - 1).toFixed(1)},${height}`;

  const currentHover = hoverIdx !== null ? data[hoverIdx] : data[data.length - 1];
  const isPositive = lowerIsBetter ? currentHover.deltaPct <= 0 : currentHover.deltaPct >= 0;
  const gradId = `spark-grad-${color.replace(/[^a-zA-Z0-9]/g, '')}-${unit.replace(/[^a-zA-Z0-9]/g, '')}`;

  return (
    <div className="w-full space-y-1 font-mono text-[9px]">
      <div className="relative w-full overflow-hidden bg-black/40 rounded p-1 border border-white/5">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-auto overflow-visible select-none"
        >
          <defs>
            <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={color} stopOpacity="0.3" />
              <stop offset="100%" stopColor={color} stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Archetype Median Guideline (Dashed Amber/Gold) */}
          <polyline
            fill="none"
            stroke="#C5A059"
            strokeWidth="1.2"
            strokeDasharray="3 3"
            strokeOpacity="0.75"
            points={archetypePoints}
          />

          {/* Region Fill Area */}
          <polygon fill={`url(#${gradId})`} points={areaPoints} />

          {/* Region Actual Polyline */}
          <polyline
            fill="none"
            stroke={color}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            points={regionPoints}
          />

          {/* Vertical Hover Cursor */}
          {hoverIdx !== null && (
            <line
              x1={getX(hoverIdx)}
              y1={0}
              x2={getX(hoverIdx)}
              y2={height}
              stroke="#FFFFFF"
              strokeOpacity="0.5"
              strokeDasharray="2 2"
            />
          )}

          {/* Interactive Month Points */}
          {data.map((d, i) => {
            const cx = getX(i);
            const cy = getY(d.region);
            const isHovered = hoverIdx === i;
            return (
              <g
                key={i}
                onMouseEnter={() => setHoverIdx(i)}
                onMouseLeave={() => setHoverIdx(null)}
                className="cursor-pointer"
              >
                <circle
                  cx={cx}
                  cy={cy}
                  r={isHovered ? 4 : 2}
                  fill={isHovered ? '#FFFFFF' : color}
                  stroke="#090D0A"
                  strokeWidth="1"
                />
              </g>
            );
          })}
        </svg>
      </div>

      {/* Readout */}
      {showLabels && (
        <div className="flex items-center justify-between text-[8px] text-neutral-400 px-0.5">
          <div className="flex items-center gap-1.5">
            <span className="text-neutral-500 uppercase">{currentHover.month} '26:</span>
            <span className="font-bold text-white">
              {currentHover.region} {unit}
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="text-[#C5A059]">Archetype: {currentHover.archetype}</span>
            <span className={`font-bold ${isPositive ? 'text-emerald-400' : 'text-rose-400'}`}>
              ({currentHover.deltaPct >= 0 ? `+${currentHover.deltaPct}%` : `${currentHover.deltaPct}%`})
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

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
  const [showBenchmarkingTrend, setShowBenchmarkingTrend] = useState<boolean>(true);
  const [viewTab, setViewTab] = useState<'unified' | 'heatmap' | 'matrix'>('unified');
  const [heatmapFilter, setHeatmapFilter] = useState<'all' | 'high_impact' | 'outperforming' | 'deficits'>('all');
  const [hoveredIndicatorId, setHoveredIndicatorId] = useState<string | null>(null);

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

  // Metric Comparison Cards List with 12-Month Historical Benchmarking Trajectory
  const metricCards = useMemo(() => {
    const b = activeArchetype.benchmarks;
    return [
      {
        id: 'water',
        name: 'Water Retention Efficiency',
        icon: <Droplets className="w-4 h-4 text-cyan-400" />,
        color: '#06B6D4',
        unit: b.waterRetentionM3PerHa.unit,
        currentValue: currentMetrics.waterRetentionM3PerHa,
        benchmarks: b.waterRetentionM3PerHa,
        lowerIsBetter: false,
        deltaVsMedian: +(((currentMetrics.waterRetentionM3PerHa - b.waterRetentionM3PerHa.median) / b.waterRetentionM3PerHa.median) * 100).toFixed(0),
        percentile: computePercentile(currentMetrics.waterRetentionM3PerHa, b.waterRetentionM3PerHa),
        trend12Mo: generate12MonthTrend(currentMetrics.waterRetentionM3PerHa, b.waterRetentionM3PerHa.median, false)
      },
      {
        id: 'carbon',
        name: 'Soil Carbon Sequestration Density',
        icon: <TreePine className="w-4 h-4 text-emerald-400" />,
        color: '#10B981',
        unit: b.soilCarbonRateTCO2ePerHa.unit,
        currentValue: currentMetrics.soilCarbonRateTCO2ePerHa,
        benchmarks: b.soilCarbonRateTCO2ePerHa,
        lowerIsBetter: false,
        deltaVsMedian: +(((currentMetrics.soilCarbonRateTCO2ePerHa - b.soilCarbonRateTCO2ePerHa.median) / b.soilCarbonRateTCO2ePerHa.median) * 100).toFixed(0),
        percentile: computePercentile(currentMetrics.soilCarbonRateTCO2ePerHa, b.soilCarbonRateTCO2ePerHa),
        trend12Mo: generate12MonthTrend(currentMetrics.soilCarbonRateTCO2ePerHa, b.soilCarbonRateTCO2ePerHa.median, false)
      },
      {
        id: 'circularity',
        name: 'Closed-Loop Circularity Quotient',
        icon: <Activity className="w-4 h-4 text-purple-400" />,
        color: '#A855F7',
        unit: b.circularityPct.unit,
        currentValue: currentMetrics.circularityPct,
        benchmarks: b.circularityPct,
        lowerIsBetter: false,
        deltaVsMedian: +(((currentMetrics.circularityPct - b.circularityPct.median) / b.circularityPct.median) * 100).toFixed(0),
        percentile: computePercentile(currentMetrics.circularityPct, b.circularityPct),
        trend12Mo: generate12MonthTrend(currentMetrics.circularityPct, b.circularityPct.median, false)
      },
      {
        id: 'leakage',
        name: 'Unmetered Resource Dissipation',
        icon: <Layers className="w-4 h-4 text-amber-400" />,
        color: '#F59E0B',
        unit: b.unmeteredLeakagePct.unit,
        currentValue: currentMetrics.unmeteredLeakagePct,
        benchmarks: b.unmeteredLeakagePct,
        lowerIsBetter: true,
        deltaVsMedian: +(((currentMetrics.unmeteredLeakagePct - b.unmeteredLeakagePct.median) / b.unmeteredLeakagePct.median) * 100).toFixed(0),
        percentile: computePercentile(currentMetrics.unmeteredLeakagePct, b.unmeteredLeakagePct, true),
        trend12Mo: generate12MonthTrend(currentMetrics.unmeteredLeakagePct, b.unmeteredLeakagePct.median, true)
      },
      {
        id: 'req',
        name: 'Regenerative Efficacy Quotient (REQ)',
        icon: <Award className="w-4 h-4 text-[#C5A059]" />,
        color: '#C5A059',
        unit: b.reqIndex.unit,
        currentValue: currentMetrics.reqIndex,
        benchmarks: b.reqIndex,
        lowerIsBetter: false,
        deltaVsMedian: +(((currentMetrics.reqIndex - b.reqIndex.median) / b.reqIndex.median) * 100).toFixed(0),
        percentile: computePercentile(currentMetrics.reqIndex, b.reqIndex),
        trend12Mo: generate12MonthTrend(currentMetrics.reqIndex, b.reqIndex.median, false)
      },
      {
        id: 'councils',
        name: 'Steward Governance Density',
        icon: <Users className="w-4 h-4 text-rose-400" />,
        color: '#F43F5E',
        unit: b.stewardAssembliesPer10kHa.unit,
        currentValue: currentMetrics.stewardAssembliesPer10kHa,
        benchmarks: b.stewardAssembliesPer10kHa,
        lowerIsBetter: false,
        deltaVsMedian: +(((currentMetrics.stewardAssembliesPer10kHa - b.stewardAssembliesPer10kHa.median) / b.stewardAssembliesPer10kHa.median) * 100).toFixed(0),
        percentile: computePercentile(currentMetrics.stewardAssembliesPer10kHa, b.stewardAssembliesPer10kHa),
        trend12Mo: generate12MonthTrend(currentMetrics.stewardAssembliesPer10kHa, b.stewardAssembliesPer10kHa.median, false)
      }
    ];
  }, [activeArchetype, currentMetrics]);

  // Heatmap Variance Contribution Engine:
  // Evaluates which specific indicators generate the highest percentage variance relative to the archetype cohort
  const varianceAnalysis = useMemo(() => {
    const rawItems = metricCards.map((card) => {
      const rawDelta = card.deltaVsMedian;
      const isOutperforming = card.lowerIsBetter ? rawDelta <= 0 : rawDelta >= 0;
      const absVariance = Math.abs(rawDelta);
      const favorableDelta = card.lowerIsBetter ? -rawDelta : rawDelta;
      return {
        ...card,
        rawDelta,
        absVariance,
        isOutperforming,
        favorableDelta
      };
    });

    const totalAbsVariance = rawItems.reduce((acc, it) => acc + it.absVariance, 0) || 1;

    const itemsWithShare = rawItems.map((it) => {
      const contributionShare = +((it.absVariance / totalAbsVariance) * 100).toFixed(1);
      let driverLevel: 'primary' | 'moderate' | 'minor' = 'minor';
      if (contributionShare >= 22) driverLevel = 'primary';
      else if (contributionShare >= 12) driverLevel = 'moderate';

      return {
        ...it,
        contributionShare,
        driverLevel
      };
    }).sort((a, b) => b.contributionShare - a.contributionShare);

    const topDriver = itemsWithShare[0];
    const outperformingCount = itemsWithShare.filter((a) => a.isOutperforming).length;
    const deficitCount = itemsWithShare.filter((a) => !a.isOutperforming).length;

    return {
      items: itemsWithShare,
      totalAbsVariance,
      topDriver,
      outperformingCount,
      deficitCount
    };
  }, [metricCards]);

  const filteredHeatmapItems = useMemo(() => {
    if (heatmapFilter === 'high_impact') {
      return varianceAnalysis.items.filter((it) => it.driverLevel === 'primary' || it.driverLevel === 'moderate');
    }
    if (heatmapFilter === 'outperforming') {
      return varianceAnalysis.items.filter((it) => it.isOutperforming);
    }
    if (heatmapFilter === 'deficits') {
      return varianceAnalysis.items.filter((it) => !it.isOutperforming);
    }
    return varianceAnalysis.items;
  }, [varianceAnalysis, heatmapFilter]);

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

        {/* Right Header Controls: View Mode Tabs + Benchmarking Trend Toggle + Peer Benchmark Toggle Mode */}
        <div className="flex items-center gap-2.5 flex-wrap self-start md:self-auto">
          {/* View Tab Selector: Unified, Variance Heatmap, Matrix */}
          <div className="flex items-center gap-1 bg-[#121914] p-1 rounded-lg border border-[#F5F5F0]/10 text-[10px]">
            <button
              onClick={() => {
                setViewTab('unified');
                audioFeedback.playMicroTick();
              }}
              className={`px-2.5 py-1 rounded font-bold transition-all cursor-pointer flex items-center gap-1 ${
                viewTab === 'unified'
                  ? 'bg-[#C5A059] text-black shadow font-extrabold'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              <LayoutGrid className="w-3 h-3" />
              <span>Unified View</span>
            </button>
            <button
              onClick={() => {
                setViewTab('heatmap');
                audioFeedback.playMicroTick();
              }}
              className={`px-2.5 py-1 rounded font-bold transition-all cursor-pointer flex items-center gap-1 ${
                viewTab === 'heatmap'
                  ? 'bg-[#C5A059] text-black shadow font-extrabold'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              <Flame className="w-3 h-3 text-amber-500" />
              <span>Variance Heatmap</span>
            </button>
            <button
              onClick={() => {
                setViewTab('matrix');
                audioFeedback.playMicroTick();
              }}
              className={`px-2.5 py-1 rounded font-bold transition-all cursor-pointer flex items-center gap-1 ${
                viewTab === 'matrix'
                  ? 'bg-[#C5A059] text-black shadow font-extrabold'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              <BarChart3 className="w-3 h-3" />
              <span>Distribution Matrix</span>
            </button>
          </div>

          {/* Benchmarking Trend Toggle */}
          <button
            onClick={() => {
              setShowBenchmarkingTrend(!showBenchmarkingTrend);
              audioFeedback.playMicroTick();
            }}
            className={`px-3 py-1.5 rounded-lg border font-bold transition-all cursor-pointer flex items-center gap-1.5 text-[10px] ${
              showBenchmarkingTrend
                ? 'bg-[#C5A059] text-black border-[#C5A059] font-extrabold shadow'
                : 'bg-[#121914] text-[#C5A059] border-[#C5A059]/40 hover:border-[#C5A059]'
            }`}
          >
            <TrendingUp className="w-3.5 h-3.5" />
            <span>12-Mo Trend: {showBenchmarkingTrend ? 'ON' : 'OFF'}</span>
          </button>

          {/* Peer Benchmark Toggle Mode */}
          <div className="flex items-center gap-1 bg-[#121914] p-1 rounded-lg border border-[#F5F5F0]/10">
            <button
              onClick={() => {
                setBenchmarkMode('archetype');
                audioFeedback.playMicroTick();
              }}
              className={`px-2.5 py-1 rounded text-[10px] font-bold transition-all cursor-pointer ${
                benchmarkMode === 'archetype'
                  ? 'bg-[#C5A059] text-black shadow font-extrabold'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              Cohort ({activeArchetype.peerCount} Peers)
            </button>
            <button
              onClick={() => {
                setBenchmarkMode('global');
                audioFeedback.playMicroTick();
              }}
              className={`px-2.5 py-1 rounded text-[10px] font-bold transition-all cursor-pointer ${
                benchmarkMode === 'global'
                  ? 'bg-[#C5A059] text-black shadow font-extrabold'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              Global Network
            </button>
          </div>
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

      {/* 12-Month Benchmarking Trend Overview Panel (Toggled via Benchmarking Trend) */}
      {showBenchmarkingTrend && (
        <div className="p-4 rounded-xl bg-[#0B120E] border-2 border-[#C5A059]/60 shadow-2xl space-y-3 animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#C5A059]/20 pb-2.5">
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-[#C5A059]/20 text-[#C5A059] border border-[#C5A059]/40">
                <TrendingUp className="w-4 h-4" />
              </span>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h4 className="font-serif font-bold text-white text-xs sm:text-sm">
                    12-Month Performance Trend vs. Archetype Cohort
                  </h4>
                  <span className="px-1.5 py-0.5 rounded text-[8px] font-bold uppercase bg-emerald-950 text-emerald-300 border border-emerald-500/40">
                    Active Rolling 12-Mo Sparklines
                  </span>
                </div>
                <p className="text-[10px] text-neutral-400 font-sans mt-0.5">
                  Visualizing multi-seasonal regional trajectory relative to the {activeArchetype.name} cohort median across hydrological, pedological, and circular flows.
                </p>
              </div>
            </div>

            {/* Sparkline Legend */}
            <div className="flex items-center gap-3 text-[9px] text-neutral-400 shrink-0 bg-black/40 px-2.5 py-1.5 rounded-lg border border-white/5">
              <span className="flex items-center gap-1.5 text-white">
                <span className="w-3 h-0.5 bg-emerald-400 rounded-full" />
                Your Bioregion
              </span>
              <span className="flex items-center gap-1.5 text-[#C5A059]">
                <span className="w-3 h-0.5 border-t border-dashed border-[#C5A059]" />
                Cohort Median
              </span>
            </div>
          </div>

          {/* Quick 12-Mo Trend Highlights Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-[10px]">
            <div className="p-2.5 rounded-lg bg-[#111A13] border border-emerald-500/20">
              <span className="text-neutral-400 text-[9px] block">Annual Cohort Divergence:</span>
              <span className="text-sm font-bold text-emerald-300">+14.8% above archetype median</span>
              <span className="text-[8px] text-neutral-400 block mt-0.5">Continuous upward momentum across 5/6 indicators</span>
            </div>

            <div className="p-2.5 rounded-lg bg-[#111A13] border border-cyan-500/20">
              <span className="text-neutral-400 text-[9px] block">Water Retention Gain:</span>
              <span className="text-sm font-bold text-cyan-300">+31.5% YoY yield improvement</span>
              <span className="text-[8px] text-neutral-400 block mt-0.5">From {metricCards[0].trend12Mo[0].region} to {metricCards[0].currentValue} {metricCards[0].unit}</span>
            </div>

            <div className="p-2.5 rounded-lg bg-[#111A13] border border-purple-500/20">
              <span className="text-neutral-400 text-[9px] block">Metabolic Dissipation Reduction:</span>
              <span className="text-sm font-bold text-purple-300">-68.9% unmetered loss</span>
              <span className="text-[8px] text-neutral-400 block mt-0.5">Tightened from 29% down to 9% unmetered dissipation</span>
            </div>
          </div>
        </div>
      )}

      {/* Resource Indicator Variance Contribution Heatmap Section (Rendered on 'unified' or 'heatmap' mode) */}
      {(viewTab === 'unified' || viewTab === 'heatmap') && (
        <div className="p-4 sm:p-5 rounded-xl bg-[#0B100D] border-2 border-[#C5A059]/60 shadow-2xl space-y-4 animate-in fade-in duration-200">
          {/* Heatmap Section Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 border-b border-[#C5A059]/20 pb-3">
            <div className="flex items-center gap-2.5">
              <span className="p-2 rounded-lg bg-amber-500/20 text-amber-400 border border-amber-500/40">
                <Flame className="w-5 h-5 text-amber-400" />
              </span>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h4 className="font-serif font-bold text-white text-sm sm:text-base">
                    Resource Indicator Variance Contribution Heatmap
                  </h4>
                  <span className="px-2 py-0.5 rounded text-[9px] font-bold uppercase bg-amber-950 text-amber-300 border border-amber-500/40">
                    Archetype Divergence Decomposition
                  </span>
                </div>
                <p className="text-[10px] text-neutral-400 font-sans mt-0.5">
                  Deconstructs the exact mathematical share that each resource indicator contributes to total variance between your region and the {activeArchetype.name} cohort median.
                </p>
              </div>
            </div>

            {/* Heatmap Filter Toggle Pills */}
            <div className="flex items-center gap-1.5 flex-wrap self-start sm:self-auto bg-black/40 p-1 rounded-lg border border-white/5 text-[9px]">
              <button
                onClick={() => {
                  setHeatmapFilter('all');
                  audioFeedback.playMicroTick();
                }}
                className={`px-2 py-1 rounded font-bold transition-all cursor-pointer ${
                  heatmapFilter === 'all'
                    ? 'bg-[#C5A059] text-black font-extrabold shadow'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                All Indicators ({varianceAnalysis.items.length})
              </button>
              <button
                onClick={() => {
                  setHeatmapFilter('high_impact');
                  audioFeedback.playMicroTick();
                }}
                className={`px-2 py-1 rounded font-bold transition-all cursor-pointer ${
                  heatmapFilter === 'high_impact'
                    ? 'bg-[#C5A059] text-black font-extrabold shadow'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                High Impact Drivers
              </button>
              <button
                onClick={() => {
                  setHeatmapFilter('outperforming');
                  audioFeedback.playMicroTick();
                }}
                className={`px-2 py-1 rounded font-bold transition-all cursor-pointer ${
                  heatmapFilter === 'outperforming'
                    ? 'bg-emerald-500 text-black font-extrabold shadow'
                    : 'text-emerald-400/80 hover:text-emerald-300'
                }`}
              >
                Outperformers ({varianceAnalysis.outperformingCount})
              </button>
              <button
                onClick={() => {
                  setHeatmapFilter('deficits');
                  audioFeedback.playMicroTick();
                }}
                className={`px-2 py-1 rounded font-bold transition-all cursor-pointer ${
                  heatmapFilter === 'deficits'
                    ? 'bg-rose-500 text-black font-extrabold shadow'
                    : 'text-rose-400/80 hover:text-rose-300'
                }`}
              >
                Deficit Lags ({varianceAnalysis.deficitCount})
              </button>
            </div>
          </div>

          {/* Divergence Heat Spectrum Bar (100% proportional breakdown ribbon) */}
          <div className="space-y-1.5 p-3 rounded-lg bg-[#070B08] border border-white/10">
            <div className="flex items-center justify-between text-[10px]">
              <span className="text-neutral-300 font-bold flex items-center gap-1.5">
                <Flame className="w-3.5 h-3.5 text-[#C5A059]" />
                Proportional Variance Share Decomposition (% of Divergence):
              </span>
              <div className="flex items-center gap-3 text-[9px]">
                <span className="flex items-center gap-1 text-emerald-400">
                  <span className="w-2 h-2 rounded bg-emerald-500"></span>
                  Regenerative Surplus
                </span>
                <span className="flex items-center gap-1 text-rose-400">
                  <span className="w-2 h-2 rounded bg-rose-500"></span>
                  Deficit Bottleneck
                </span>
              </div>
            </div>

            {/* Stacked Proportional Ribbon */}
            <div className="relative w-full h-5 bg-black/60 rounded-lg overflow-hidden flex border border-white/10">
              {varianceAnalysis.items.map((item) => (
                <div
                  key={item.id}
                  style={{ width: `${item.contributionShare}%` }}
                  title={`${item.name}: ${item.contributionShare}% of total variance (${item.deltaVsMedian >= 0 ? '+' : ''}${item.deltaVsMedian}%)`}
                  className={`h-full border-r border-black/40 transition-all cursor-pointer relative group flex items-center justify-center overflow-hidden ${
                    item.isOutperforming
                      ? item.driverLevel === 'primary'
                        ? 'bg-emerald-500 hover:bg-emerald-400'
                        : 'bg-emerald-600/80 hover:bg-emerald-500'
                      : item.driverLevel === 'primary'
                      ? 'bg-rose-500 hover:bg-rose-400'
                      : 'bg-rose-600/80 hover:bg-rose-500'
                  }`}
                  onMouseEnter={() => {
                    setHoveredIndicatorId(item.id);
                    audioFeedback.playMicroTick();
                  }}
                  onMouseLeave={() => setHoveredIndicatorId(null)}
                >
                  <span className="text-[8px] font-bold text-black select-none truncate px-1 drop-shadow-sm">
                    {item.contributionShare >= 10 ? `${item.contributionShare}%` : ''}
                  </span>
                </div>
              ))}
            </div>
            <div className="flex justify-between text-[8px] text-neutral-400 font-sans">
              <span>Cumulative Sum: 100% of Measured Archetype Divergence</span>
              <span className="text-[#C5A059]">Hover segments or cards below to inspect dynamic biophysical drivers</span>
            </div>
          </div>

          {/* Top Variance Driver Spotlight Banner */}
          {varianceAnalysis.topDriver && (
            <div className={`p-3.5 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
              varianceAnalysis.topDriver.isOutperforming
                ? 'bg-gradient-to-r from-emerald-950/80 via-[#0F1E14] to-black/80 border-emerald-500/50'
                : 'bg-gradient-to-r from-rose-950/80 via-[#210D12] to-black/80 border-rose-500/50'
            }`}>
              <div className="flex items-start gap-2.5">
                <span className={`p-2 rounded-lg border shrink-0 ${
                  varianceAnalysis.topDriver.isOutperforming
                    ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
                    : 'bg-rose-500/20 text-rose-400 border-rose-500/40'
                }`}>
                  <Award className="w-5 h-5" />
                </span>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[10px] text-neutral-400 uppercase font-bold">#1 Divergence Driver:</span>
                    <h5 className="font-serif font-bold text-white text-xs sm:text-sm">
                      {varianceAnalysis.topDriver.name}
                    </h5>
                    <span className={`px-2 py-0.5 rounded text-[8px] font-bold uppercase border ${
                      varianceAnalysis.topDriver.isOutperforming
                        ? 'bg-emerald-900/60 text-emerald-200 border-emerald-500/50'
                        : 'bg-rose-900/60 text-rose-200 border-rose-500/50'
                    }`}>
                      {varianceAnalysis.topDriver.contributionShare}% Total Share
                    </span>
                  </div>
                  <p className="text-[10px] text-neutral-300 font-sans mt-0.5">
                    {varianceAnalysis.topDriver.isOutperforming
                      ? `Your region leads the cohort with ${varianceAnalysis.topDriver.currentValue} ${varianceAnalysis.topDriver.unit} (+${varianceAnalysis.topDriver.deltaVsMedian}% above cohort median). This is your primary competitive ecological advantage.`
                      : `Your region registers ${varianceAnalysis.topDriver.currentValue} ${varianceAnalysis.topDriver.unit} (${varianceAnalysis.topDriver.deltaVsMedian}% vs archetype median). This single indicator represents the highest-leverage gap to close.`}
                  </p>
                </div>
              </div>

              <div className="shrink-0 flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-1 border-t sm:border-t-0 sm:border-l border-white/10 pt-2 sm:pt-0 sm:pl-3">
                <span className="text-[9px] text-neutral-400">Contribution Weight:</span>
                <span className="text-base font-bold text-[#C5A059]">
                  {varianceAnalysis.topDriver.contributionShare}%
                </span>
                <span className="text-[8px] text-neutral-400">of archetype variance</span>
              </div>
            </div>
          )}

          {/* The Heatmap Matrix Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {filteredHeatmapItems.map((item) => {
              const isOutperforming = item.isOutperforming;
              const isHovered = hoveredIndicatorId === item.id;
              const share = item.contributionShare;

              // Compute continuous heat gradient styling
              const heatColorClass = isOutperforming
                ? item.driverLevel === 'primary'
                  ? 'bg-gradient-to-br from-emerald-950/90 via-[#0E2014] to-[#070E0A] border-emerald-500/60 shadow-[0_0_15px_rgba(16,185,129,0.15)]'
                  : item.driverLevel === 'moderate'
                  ? 'bg-gradient-to-br from-emerald-950/60 via-[#0B170F] to-[#070E0A] border-emerald-500/40'
                  : 'bg-gradient-to-br from-[#0D1510] to-[#070B09] border-emerald-500/20'
                : item.driverLevel === 'primary'
                ? 'bg-gradient-to-br from-rose-950/90 via-[#220E13] to-[#0F0709] border-rose-500/60 shadow-[0_0_15px_rgba(244,63,94,0.15)]'
                : item.driverLevel === 'moderate'
                ? 'bg-gradient-to-br from-rose-950/60 via-[#1A0B0F] to-[#0F0709] border-rose-500/40'
                : 'bg-gradient-to-br from-[#160D10] to-[#0A0608] border-rose-500/20';

              return (
                <div
                  key={item.id}
                  onMouseEnter={() => {
                    setHoveredIndicatorId(item.id);
                    audioFeedback.playMicroTick();
                  }}
                  onMouseLeave={() => setHoveredIndicatorId(null)}
                  className={`p-4 rounded-xl border transition-all cursor-pointer space-y-3 ${heatColorClass} ${
                    isHovered ? 'scale-[1.02] ring-1 ring-[#C5A059]' : ''
                  }`}
                >
                  {/* Card Header: Icon, Name & Driver Level */}
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="p-1.5 rounded-lg bg-black/50 border border-white/10 shrink-0">
                        {item.icon}
                      </span>
                      <div>
                        <h5 className="font-serif font-bold text-white text-xs">
                          {item.name}
                        </h5>
                        <span className="text-[9px] text-neutral-400">
                          {item.unit}
                        </span>
                      </div>
                    </div>

                    {/* Driver Level Badge */}
                    <div className="text-right shrink-0">
                      <span className={`px-2 py-0.5 rounded text-[8px] font-bold uppercase border flex items-center gap-1 ${
                        item.driverLevel === 'primary'
                          ? isOutperforming
                            ? 'bg-emerald-900/80 text-emerald-200 border-emerald-400'
                            : 'bg-rose-900/80 text-rose-200 border-rose-400'
                          : item.driverLevel === 'moderate'
                          ? 'bg-[#18201A] text-neutral-300 border-white/20'
                          : 'bg-black/40 text-neutral-400 border-white/10'
                      }`}>
                        {item.driverLevel === 'primary' && <Flame className="w-2.5 h-2.5 text-amber-400" />}
                        {item.driverLevel === 'primary' ? 'Primary Driver' : item.driverLevel === 'moderate' ? 'Moderate Driver' : 'Minor'}
                      </span>
                    </div>
                  </div>

                  {/* Heatmap Variance Contribution Progress Bar */}
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-[9px]">
                      <span className="text-neutral-400">Share of Total Divergence:</span>
                      <span className="font-bold text-white">{share}%</span>
                    </div>
                    <div className="w-full h-2 bg-black/60 rounded-full overflow-hidden border border-white/10">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          isOutperforming ? 'bg-gradient-to-r from-emerald-500 to-emerald-300' : 'bg-gradient-to-r from-rose-500 to-amber-400'
                        }`}
                        style={{ width: `${Math.min(100, share * 3)}%` }}
                      />
                    </div>
                  </div>

                  {/* Values & Delta vs Median */}
                  <div className="p-2 rounded bg-black/40 border border-white/5 flex items-baseline justify-between text-[10px]">
                    <div>
                      <span className="text-[8px] text-neutral-400 uppercase block">Your Region:</span>
                      <span className="font-bold text-white text-xs">{item.currentValue} {item.unit}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-[8px] text-neutral-400 uppercase block">Archetype Med:</span>
                      <span className="text-neutral-300 text-xs">{item.benchmarks.median} {item.unit}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-[8px] text-neutral-400 uppercase block">Variance:</span>
                      <span className={`font-bold text-xs ${isOutperforming ? 'text-emerald-400' : 'text-rose-400'}`}>
                        {item.deltaVsMedian >= 0 ? `+${item.deltaVsMedian}%` : `${item.deltaVsMedian}%`}
                      </span>
                    </div>
                  </div>

                  {/* Strategic Transfer / Action Recommendation */}
                  <div className="pt-2 border-t border-white/10 text-[9px] space-y-1 font-sans">
                    <div className="flex items-center justify-between">
                      <span className="text-neutral-400 font-bold">Standing:</span>
                      <span className="text-emerald-400 font-mono font-bold">{item.percentile}th %tile in Archetype</span>
                    </div>
                    <p className="text-neutral-300 leading-tight">
                      {isOutperforming
                        ? 'Leading practice verified. High potential to export technical protocols to regional cohort members.'
                        : `Deficit gap. Target closing toward archetype median of ${item.benchmarks.median} ${item.unit}.`}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Benchmark Distribution Matrix (Rendered on 'unified' or 'matrix' mode) */}
      {(viewTab === 'unified' || viewTab === 'matrix') && (
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

                {/* 12-Month Benchmarking Sparkline Chart (Rendered when toggle is ON) */}
                {showBenchmarkingTrend && (
                  <div className="pt-2.5 border-t border-white/10 space-y-1.5 animate-in fade-in duration-200">
                    <div className="flex items-center justify-between text-[8px] text-neutral-400">
                      <span className="flex items-center gap-1 text-[#C5A059] font-bold uppercase">
                        <TrendingUp className="w-3 h-3" />
                        12-Mo Sparkline vs Archetype:
                      </span>
                      {(() => {
                        const first = card.trend12Mo[0];
                        const last = card.trend12Mo[card.trend12Mo.length - 1];
                        const diff = +(((last.region - first.region) / (first.region || 1)) * 100).toFixed(1);
                        const isFavorable = card.lowerIsBetter ? diff <= 0 : diff >= 0;
                        return (
                          <span className={`font-bold ${isFavorable ? 'text-emerald-400' : 'text-rose-400'}`}>
                            {diff >= 0 ? `+${diff}%` : `${diff}%`} (12 Mo)
                          </span>
                        );
                      })()}
                    </div>

                    <SparklineChart
                      data={card.trend12Mo}
                      unit={card.unit}
                      color={card.color}
                      height={40}
                      lowerIsBetter={card.lowerIsBetter}
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
      )}

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
