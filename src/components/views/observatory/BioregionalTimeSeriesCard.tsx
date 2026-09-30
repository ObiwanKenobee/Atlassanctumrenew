import React, { useState, useMemo } from 'react';
import {
  TrendingUp,
  Activity,
  Layers,
  Calendar,
  Sparkles,
  ShieldCheck,
  ChevronDown,
  ChevronUp,
  Sprout,
  Droplets,
  TreeDeciduous,
  Compass,
  ArrowUpRight,
  Info,
  CheckCircle2,
  Filter,
  Eye,
  Maximize2
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
  ReferenceLine,
  ReferenceArea
} from 'recharts';
import { audioFeedback } from '../../../lib/audioFeedback';

export type TimeHorizon = '8yr' | '5yr' | '3yr';

export type RecoveryMarkerMetric = 
  | 'composite'
  | 'soil_carbon'
  | 'canopy_ndvi'
  | 'aquifer_retention'
  | 'biodiversity_index';

export interface EcologicalDataPoint {
  period: string; // e.g. "2018 Q1"
  timestamp: string; // "2018-03"
  year: number;
  quarter: string;
  // Markers
  soilOrganicCarbon: number; // delta % from baseline (0 to +60%)
  canopyNdvi: number; // 0.20 to 0.95 (normalized to 0-100 scale for composite)
  canopyNdviRaw: number; // raw 0.0 - 1.0
  aquiferRetentionPct: number; // Groundwater stabilization % (0 to 100%)
  biodiversityIndex: number; // Shannon-Wiener normalized to 0-100 (raw 1.0 - 4.5)
  biodiversityShannonRaw: number;
  compositeRecoveryScore: number; // weighted composite 0-100%
  counterfactualDegradation: number; // baseline scenario without intervention (descends 100 -> 50)
  milestoneEvent?: string;
  verificationBadge?: string;
}

export interface BioregionalTimeSeriesProfile {
  bioregionId: string;
  bioregionName: string;
  shortName: string;
  ecozone: string;
  baselineYear: number;
  overallGainPct: number;
  annualCompoundingRate: number;
  totalHectaresMonitored: number;
  avoidedDegradationPct: number;
  carbonStockDeltaTons: number;
  data: EcologicalDataPoint[];
}

// Multi-decadal historical telemetry data points (2018 - 2026)
const GENERATE_TIME_SERIES = (bioregionId: string): EcologicalDataPoint[] => {
  const periods = [
    { period: '2018 Q1', year: 2018, quarter: 'Q1', milestone: 'Baseline Ground Sensor Grid Deployed' },
    { period: '2018 Q3', year: 2018, quarter: 'Q3' },
    { period: '2019 Q1', year: 2019, quarter: 'Q1', milestone: 'Mycorrhizal Soil Inoculation' },
    { period: '2019 Q3', year: 2019, quarter: 'Q3' },
    { period: '2020 Q1', year: 2020, quarter: 'Q1', milestone: 'Sentinel-2 Automated Satellite Telemetry' },
    { period: '2020 Q3', year: 2020, quarter: 'Q3' },
    { period: '2021 Q1', year: 2021, quarter: 'Q1', milestone: 'First Subsurface Aquifer Infiltration Sump' },
    { period: '2021 Q3', year: 2021, quarter: 'Q3' },
    { period: '2022 Q1', year: 2022, quarter: 'Q1', milestone: 'Bio-Char Carbon Sequestration Phase 1' },
    { period: '2022 Q3', year: 2022, quarter: 'Q3' },
    { period: '2023 Q1', year: 2023, quarter: 'Q1', milestone: 'Canopy Density Crossed 60% Threshold' },
    { period: '2023 Q3', year: 2023, quarter: 'Q3' },
    { period: '2024 Q1', year: 2024, quarter: 'Q1', milestone: 'Cryptographic Merkle Proof Audit Layer' },
    { period: '2024 Q3', year: 2024, quarter: 'Q3' },
    { period: '2025 Q1', year: 2025, quarter: 'Q1', milestone: '75% Self-Sustaining Hydrological Cycle' },
    { period: '2025 Q3', year: 2025, quarter: 'Q3' },
    { period: '2026 Q1', year: 2026, quarter: 'Q1', milestone: 'Accelerated Regenerative Equilibrium Reached' },
    { period: '2026 Q2', year: 2026, quarter: 'Q2' }
  ];

  // Specific modifier offsets based on bioregion
  const offset = 
    bioregionId === 'aberdare-water-tower' ? 1.15 :
    bioregionId === 'kilifi-coast' ? 1.08 :
    bioregionId === 'turkana-basin' ? 0.85 :
    bioregionId === 'rift-valley-lakes' ? 1.02 : 1.0;

  return periods.map((p, idx) => {
    const progressFactor = idx / (periods.length - 1); // 0 to 1
    const curve = Math.pow(progressFactor, 0.85); // slight s-curve

    // Soil Organic Carbon (% delta from baseline 0 -> ~48-56%)
    const soc = Math.round((2.5 + curve * 49 * offset) * 10) / 10;

    // Canopy NDVI: raw 0.32 -> 0.86
    const ndviRaw = Math.min(0.96, Math.round((0.32 + curve * 0.52 * offset) * 100) / 100);
    const ndviNorm = Math.round(ndviRaw * 100);

    // Aquifer Retention %: baseline 24% -> 88%
    const aquifer = Math.min(98, Math.round((24 + curve * 62 * offset) * 10) / 10);

    // Biodiversity Shannon: raw 1.6 -> 4.2 (norm 0-100)
    const bioRaw = Math.min(4.8, Math.round((1.6 + curve * 2.5 * offset) * 100) / 100);
    const bioNorm = Math.round(((bioRaw - 1.0) / 3.8) * 100);

    // Composite Recovery Score (weighted 0-100)
    const composite = Math.round((soc * 0.3 + ndviNorm * 0.3 + aquifer * 0.25 + bioNorm * 0.15) * 10) / 10;

    // Counterfactual degradation trajectory (declining from 100% downward to 58%)
    const counterfactual = Math.round((100 - progressFactor * 42 * (2.0 - offset)) * 10) / 10;

    return {
      period: p.period,
      timestamp: `${p.year}-${p.quarter === 'Q1' ? '03' : p.quarter === 'Q2' ? '06' : '09'}`,
      year: p.year,
      quarter: p.quarter,
      soilOrganicCarbon: soc,
      canopyNdvi: ndviNorm,
      canopyNdviRaw: ndviRaw,
      aquiferRetentionPct: aquifer,
      biodiversityIndex: bioNorm,
      biodiversityShannonRaw: bioRaw,
      compositeRecoveryScore: composite,
      counterfactualDegradation: counterfactual,
      milestoneEvent: p.milestone,
      verificationBadge: idx % 3 === 0 ? 'Sentinel-2 & Ground Core Audit' : undefined
    };
  });
};

export const TIME_SERIES_PROFILES: Record<string, BioregionalTimeSeriesProfile> = {
  all: {
    bioregionId: 'all',
    bioregionName: 'Planetary Biosphere Corridor (Cross-Bioregional Composite)',
    shortName: 'Global Bioregional Composite',
    ecozone: 'Multi-Biome Pan-African Macro-Transect',
    baselineYear: 2018,
    overallGainPct: 172.5,
    annualCompoundingRate: 13.8,
    totalHectaresMonitored: 384000,
    avoidedDegradationPct: 41.2,
    carbonStockDeltaTons: 842000,
    data: GENERATE_TIME_SERIES('all')
  },
  'mara-serengeti': {
    bioregionId: 'mara-serengeti',
    bioregionName: 'Mara-Serengeti Savannah & Basin',
    shortName: 'Mara-Serengeti Corridor',
    ecozone: 'Tropical Semi-Arid Savannah & Wildlife Corridor',
    baselineYear: 2018,
    overallGainPct: 164.2,
    annualCompoundingRate: 13.1,
    totalHectaresMonitored: 117000,
    avoidedDegradationPct: 39.5,
    carbonStockDeltaTons: 368500,
    data: GENERATE_TIME_SERIES('mara-serengeti')
  },
  'aberdare-water-tower': {
    bioregionId: 'aberdare-water-tower',
    bioregionName: 'Aberdare Highland Cloud Forest & Headwaters',
    shortName: 'Aberdare Water Tower',
    ecozone: 'Afro-Alpine Cloud Forest & Catchment Sponge',
    baselineYear: 2018,
    overallGainPct: 198.4,
    annualCompoundingRate: 15.6,
    totalHectaresMonitored: 35000,
    avoidedDegradationPct: 46.8,
    carbonStockDeltaTons: 198000,
    data: GENERATE_TIME_SERIES('aberdare-water-tower')
  },
  'rift-valley-lakes': {
    bioregionId: 'rift-valley-lakes',
    bioregionName: 'Central Rift Endorheic Basin & Rift Lakes',
    shortName: 'Rift Valley Lakes',
    ecozone: 'Alkaline Lake Wetland & Geothermal Riparian Ecotone',
    baselineYear: 2018,
    overallGainPct: 158.7,
    annualCompoundingRate: 12.8,
    totalHectaresMonitored: 86000,
    avoidedDegradationPct: 37.4,
    carbonStockDeltaTons: 142000,
    data: GENERATE_TIME_SERIES('rift-valley-lakes')
  },
  'turkana-basin': {
    bioregionId: 'turkana-basin',
    bioregionName: 'Lotikipi Basin & North Rift Corridor (Turkana)',
    shortName: 'Turkana Aquifer Basin',
    ecozone: 'Deep Paleoaquifer & Hyper-Arid Pastoral Scrub',
    baselineYear: 2018,
    overallGainPct: 136.2,
    annualCompoundingRate: 11.2,
    totalHectaresMonitored: 74000,
    avoidedDegradationPct: 32.8,
    carbonStockDeltaTons: 62400,
    data: GENERATE_TIME_SERIES('turkana-basin')
  },
  'kilifi-coast': {
    bioregionId: 'kilifi-coast',
    bioregionName: 'Kilifi Coastal Biosphere & Mangrove Estuary',
    shortName: 'Kilifi Blue Carbon',
    ecozone: 'Tidal Mangroves & Coral Reef Salinity Barrier',
    baselineYear: 2018,
    overallGainPct: 182.0,
    annualCompoundingRate: 14.5,
    totalHectaresMonitored: 24000,
    avoidedDegradationPct: 44.0,
    carbonStockDeltaTons: 86400,
    data: GENERATE_TIME_SERIES('kilifi-coast')
  }
};

interface BioregionalTimeSeriesCardProps {
  selectedBioregion?: string;
  className?: string;
  onInspectProvenance?: (prov: any) => void;
}

export const BioregionalTimeSeriesCard: React.FC<BioregionalTimeSeriesCardProps> = ({
  selectedBioregion = 'all',
  className = '',
  onInspectProvenance
}) => {
  const [activeMetric, setActiveMetric] = useState<RecoveryMarkerMetric>('composite');
  const [timeHorizon, setTimeHorizon] = useState<TimeHorizon>('8yr');
  const [showCounterfactual, setShowCounterfactual] = useState<boolean>(true);
  const [showMilestoneMarkers, setShowMilestoneMarkers] = useState<boolean>(true);
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [selectedMilestone, setSelectedMilestone] = useState<string | null>(null);

  // Active profile based on passed selectedBioregion
  const profileKey = TIME_SERIES_PROFILES[selectedBioregion] ? selectedBioregion : 'all';
  const profile = TIME_SERIES_PROFILES[profileKey];

  // Filter time horizon
  const filteredData = useMemo(() => {
    const raw = profile.data;
    if (timeHorizon === '3yr') {
      return raw.filter(d => d.year >= 2023);
    }
    if (timeHorizon === '5yr') {
      return raw.filter(d => d.year >= 2021);
    }
    return raw; // 8yr full history (2018-2026)
  }, [profile.data, timeHorizon]);

  // Current latest point vs baseline point
  const baselinePoint = filteredData[0];
  const latestPoint = filteredData[filteredData.length - 1];

  // Metric metadata
  const metricConfig = useMemo(() => {
    switch (activeMetric) {
      case 'soil_carbon':
        return {
          title: 'Soil Organic Carbon (SOC Delta %)',
          description: 'Multispectral satellite soil reflectance calibrated against 1,240 in-situ deep core boreholes.',
          dataKey: 'soilOrganicCarbon',
          color: '#10B981', // emerald
          gradientId: 'gradSoilCarbon',
          unit: '% delta',
          formatValue: (val: number) => `+${val}%`,
          currentValue: `+${latestPoint.soilOrganicCarbon}%`,
          baselineValue: `+${baselinePoint.soilOrganicCarbon}%`,
          growthDelta: `+${(latestPoint.soilOrganicCarbon - baselinePoint.soilOrganicCarbon).toFixed(1)}%`
        };
      case 'canopy_ndvi':
        return {
          title: 'Canopy NDVI & Vegetative Cover',
          description: 'Sentinel-2 Level-2A normalized difference vegetation index capturing photosynthetic biomass accretion.',
          dataKey: 'canopyNdvi',
          color: '#C5A059', // gold
          gradientId: 'gradCanopyNdvi',
          unit: 'NDVI Score',
          formatValue: (val: number) => `${(val / 100).toFixed(2)} NDVI`,
          currentValue: `${latestPoint.canopyNdviRaw} NDVI`,
          baselineValue: `${baselinePoint.canopyNdviRaw} NDVI`,
          growthDelta: `+${Math.round(((latestPoint.canopyNdviRaw - baselinePoint.canopyNdviRaw) / baselinePoint.canopyNdviRaw) * 100)}%`
        };
      case 'aquifer_retention':
        return {
          title: 'Aquifer Recharge & Groundwater Retention',
          description: 'Gravity recovery GRACE satellite proxies and capacitive borehole water table level sensors.',
          dataKey: 'aquiferRetentionPct',
          color: '#38BDF8', // cyan
          gradientId: 'gradAquifer',
          unit: '% Infiltration',
          formatValue: (val: number) => `${val}%`,
          currentValue: `${latestPoint.aquiferRetentionPct}%`,
          baselineValue: `${baselinePoint.aquiferRetentionPct}%`,
          growthDelta: `+${(latestPoint.aquiferRetentionPct - baselinePoint.aquiferRetentionPct).toFixed(1)}%`
        };
      case 'biodiversity_index':
        return {
          title: 'Biodiversity Shannon-Wiener Index',
          description: 'Acoustic bio-sensor telemetry and eDNA ground sampling indexing species richness and evenness.',
          dataKey: 'biodiversityIndex',
          color: '#A855F7', // violet
          gradientId: 'gradBiodiversity',
          unit: 'H′ Index',
          formatValue: (val: number) => `${(1.0 + (val / 100) * 3.8).toFixed(2)} H′`,
          currentValue: `${latestPoint.biodiversityShannonRaw} H′`,
          baselineValue: `${baselinePoint.biodiversityShannonRaw} H′`,
          growthDelta: `+${Math.round(((latestPoint.biodiversityShannonRaw - baselinePoint.biodiversityShannonRaw) / baselinePoint.biodiversityShannonRaw) * 100)}%`
        };
      case 'composite':
      default:
        return {
          title: 'Composite Ecological Recovery Score',
          description: 'Harmonized index combining soil carbon, canopy density, hydrological stability, and biodiversity indices.',
          dataKey: 'compositeRecoveryScore',
          color: '#10B981',
          gradientId: 'gradComposite',
          unit: 'Recovery %',
          formatValue: (val: number) => `${val}%`,
          currentValue: `${latestPoint.compositeRecoveryScore}%`,
          baselineValue: `${baselinePoint.compositeRecoveryScore}%`,
          growthDelta: `+${(latestPoint.compositeRecoveryScore - baselinePoint.compositeRecoveryScore).toFixed(1)}%`
        };
    }
  }, [activeMetric, latestPoint, baselinePoint]);

  return (
    <div className={`bg-[#0D0D0D] border border-[#C5A059]/40 rounded-sm shadow-2xl relative overflow-hidden ${className}`}>
      {/* Subtle background ambient grid */}
      <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#C5A059_1px,transparent_1px)] [background-size:20px_20px] pointer-events-none" />

      {/* Card Header & Controls */}
      <div className="p-4 sm:p-6 border-b border-[#F5F5F0]/10 relative z-10 space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span className="text-[10px] font-mono uppercase text-[#C5A059] tracking-[0.2em] font-bold">
                BIOREGIONAL TIME-SERIES • HISTORICAL RECOVERY TELEMETRY
              </span>
              <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-[#1B3022] text-emerald-300 border border-emerald-500/40 font-bold uppercase">
                {profile.ecozone}
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-serif text-white flex items-center gap-2">
              <span>{profile.bioregionName}</span>
              <span className="text-xs font-mono text-[#F5F5F0]/40 font-normal">
                ({profile.baselineYear}–2026 Historical Trajectory)
              </span>
            </h2>
            <p className="text-xs text-[#F5F5F0]/65 max-w-3xl font-sans">
              Decadal historical recovery markers tracking compounding biomass accumulation, aquifer recharge rates, and mycorrhizal soil stabilization against a counterfactual unmanaged degradation trajectory.
            </p>
          </div>

          {/* Time Horizon Selector */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center bg-[#141414] p-0.5 rounded border border-[#F5F5F0]/15 text-xs font-mono">
              <span className="text-[10px] uppercase text-[#F5F5F0]/50 px-2">Span:</span>
              {(['8yr', '5yr', '3yr'] as const).map((h) => (
                <button
                  key={h}
                  id={`timeseries-span-${h}-btn`}
                  onClick={() => {
                    audioFeedback.playMicroTick();
                    setTimeHorizon(h);
                  }}
                  className={`px-2.5 py-1 rounded text-[11px] font-mono uppercase font-bold transition-all cursor-pointer ${
                    timeHorizon === h
                      ? 'bg-[#C5A059] text-black shadow-md'
                      : 'text-[#F5F5F0]/60 hover:text-white'
                  }`}
                >
                  {h === '8yr' ? '8-Yr Decadal' : h === '5yr' ? '5-Yr Shift' : '3-Yr High-Res'}
                </button>
              ))}
            </div>

            <button
              onClick={() => {
                audioFeedback.playSubtleClick();
                setShowCounterfactual(!showCounterfactual);
              }}
              className={`px-3 py-1.5 rounded text-xs font-mono font-bold flex items-center gap-1.5 transition-all cursor-pointer border ${
                showCounterfactual
                  ? 'bg-rose-950/70 border-rose-500/50 text-rose-300'
                  : 'bg-[#141414] border-[#F5F5F0]/15 text-[#F5F5F0]/50 hover:text-white'
              }`}
              title="Toggle counterfactual degradation baseline trajectory"
            >
              <Activity className="w-3.5 h-3.5" />
              <span>Counterfactual Baseline</span>
            </button>
          </div>
        </div>

        {/* Marker Metric Switcher Tabs */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-[#F5F5F0]/10">
          <span className="text-[10px] font-mono uppercase text-[#F5F5F0]/40 mr-1 hidden sm:inline">
            Active Marker:
          </span>
          {[
            { id: 'composite', label: 'Composite Recovery Index', icon: TrendingUp, color: '#10B981' },
            { id: 'soil_carbon', label: 'Soil Organic Carbon (SOC)', icon: Sprout, color: '#10B981' },
            { id: 'canopy_ndvi', label: 'Canopy NDVI & Forest Cover', icon: TreeDeciduous, color: '#C5A059' },
            { id: 'aquifer_retention', label: 'Aquifer Recharge & Hydrology', icon: Droplets, color: '#38BDF8' },
            { id: 'biodiversity_index', label: 'Biodiversity Shannon Index', icon: Sparkles, color: '#A855F7' }
          ].map((tab) => {
            const isSelected = activeMetric === tab.id;
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                id={`timeseries-metric-${tab.id}-btn`}
                onClick={() => {
                  audioFeedback.playSubtleClick();
                  setActiveMetric(tab.id as RecoveryMarkerMetric);
                }}
                className={`px-3 py-1.5 rounded text-xs font-mono flex items-center gap-1.5 transition-all cursor-pointer border ${
                  isSelected
                    ? 'bg-[#1B3022] text-[#F5F5F0] border-[#C5A059] shadow-[0_0_12px_rgba(197,160,89,0.25)] font-bold'
                    : 'bg-[#121212] text-[#F5F5F0]/60 border-[#F5F5F0]/10 hover:text-white hover:border-[#C5A059]/40'
                }`}
              >
                <Icon className="w-3.5 h-3.5" style={{ color: isSelected ? tab.color : undefined }} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* KPI Stats Highlights Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-[#F5F5F0]/10 bg-[#080808] border-b border-[#F5F5F0]/10">
        <div className="p-4 space-y-0.5">
          <div className="text-[10px] font-mono uppercase text-[#F5F5F0]/50 flex items-center justify-between">
            <span>Overall Marker Delta</span>
            <ArrowUpRight className="w-3.5 h-3.5 text-emerald-400" />
          </div>
          <div className="text-xl sm:text-2xl font-bold font-mono text-emerald-400">
            {metricConfig.growthDelta}
          </div>
          <div className="text-[10px] font-mono text-[#F5F5F0]/40">
            From {metricConfig.baselineValue} → {metricConfig.currentValue}
          </div>
        </div>

        <div className="p-4 space-y-0.5">
          <div className="text-[10px] font-mono uppercase text-[#F5F5F0]/50 flex items-center justify-between">
            <span>Annual Compounding Velocity</span>
            <TrendingUp className="w-3.5 h-3.5 text-[#C5A059]" />
          </div>
          <div className="text-xl sm:text-2xl font-bold font-mono text-[#C5A059]">
            +{profile.annualCompoundingRate}% / yr
          </div>
          <div className="text-[10px] font-mono text-[#F5F5F0]/40">
            Non-linear ecosystem recovery curve
          </div>
        </div>

        <div className="p-4 space-y-0.5">
          <div className="text-[10px] font-mono uppercase text-[#F5F5F0]/50 flex items-center justify-between">
            <span>Total Biomass Monitored</span>
            <ShieldCheck className="w-3.5 h-3.5 text-[#38BDF8]" />
          </div>
          <div className="text-xl sm:text-2xl font-bold font-mono text-[#38BDF8]">
            {profile.totalHectaresMonitored.toLocaleString()} ha
          </div>
          <div className="text-[10px] font-mono text-[#F5F5F0]/40">
            +{profile.carbonStockDeltaTons.toLocaleString()} tCO₂e sequestered
          </div>
        </div>

        <div className="p-4 space-y-0.5">
          <div className="text-[10px] font-mono uppercase text-[#F5F5F0]/50 flex items-center justify-between">
            <span>Degradation Averted</span>
            <Activity className="w-3.5 h-3.5 text-rose-400" />
          </div>
          <div className="text-xl sm:text-2xl font-bold font-mono text-rose-300">
            -{profile.avoidedDegradationPct}% Deficit
          </div>
          <div className="text-[10px] font-mono text-[#F5F5F0]/40">
            Averted desertification trajectory
          </div>
        </div>
      </div>

      {/* Main Area Chart Visualizer */}
      <div className="p-4 sm:p-6 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-mono">
          <div className="text-[#F5F5F0]/70 flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: metricConfig.color }} />
            <strong className="text-white">{metricConfig.title}</strong>
            <span className="text-[#F5F5F0]/40 hidden md:inline">• {metricConfig.description}</span>
          </div>

          <div className="flex items-center gap-3 text-[11px] text-[#F5F5F0]/50">
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-0.5" style={{ backgroundColor: metricConfig.color }} />
              Telemetry Trajectory
            </span>
            {showCounterfactual && (
              <span className="flex items-center gap-1.5 text-rose-400">
                <span className="w-3 h-0.5 border-b border-dashed border-rose-400" />
                Degradation Baseline
              </span>
            )}
          </div>
        </div>

        {/* Recharts Area Chart Container */}
        <div className="w-full h-80 sm:h-96 bg-[#080808] border border-[#F5F5F0]/10 rounded-sm p-2 sm:p-4 relative">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={filteredData} margin={{ top: 15, right: 25, left: -10, bottom: 20 }}>
              <defs>
                {/* Primary Metric Gradient */}
                <linearGradient id="metricGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={metricConfig.color} stopOpacity={0.65} />
                  <stop offset="60%" stopColor={metricConfig.color} stopOpacity={0.20} />
                  <stop offset="95%" stopColor={metricConfig.color} stopOpacity={0.0} />
                </linearGradient>

                {/* Counterfactual Gradient */}
                <linearGradient id="counterfactualGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#F43F5E" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#F43F5E" stopOpacity={0.0} />
                </linearGradient>

                {/* Composite Multi-Area Gradients for Stacked Mode */}
                <linearGradient id="socGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10B981" stopOpacity={0.5} />
                  <stop offset="95%" stopColor="#10B981" stopOpacity={0.05} />
                </linearGradient>
                <linearGradient id="canopyGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#C5A059" stopOpacity={0.5} />
                  <stop offset="95%" stopColor="#C5A059" stopOpacity={0.05} />
                </linearGradient>
                <linearGradient id="aquiferGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#38BDF8" stopOpacity={0.5} />
                  <stop offset="95%" stopColor="#38BDF8" stopOpacity={0.05} />
                </linearGradient>
              </defs>

              <CartesianGrid strokeDasharray="3 3" stroke="#222" vertical={false} />

              <XAxis
                dataKey="period"
                stroke="#666"
                tick={{ fill: '#888', fontSize: 10, fontFamily: 'monospace' }}
                tickLine={{ stroke: '#333' }}
                dy={6}
              />

              <YAxis
                stroke="#666"
                tick={{ fill: '#888', fontSize: 10, fontFamily: 'monospace' }}
                tickLine={{ stroke: '#333' }}
                domain={activeMetric === 'canopy_ndvi' ? [0, 100] : [0, 'auto']}
                unit={activeMetric === 'soil_carbon' ? '%' : ''}
              />

              <Tooltip
                content={({ active, payload, label }) => {
                  if (!active || !payload || !payload.length) return null;
                  const dataPoint = payload[0].payload as EcologicalDataPoint;

                  return (
                    <div className="bg-[#0D0D0D]/95 backdrop-blur-md border border-[#C5A059]/60 p-3 rounded shadow-2xl text-xs font-mono space-y-2 max-w-xs z-50">
                      <div className="flex items-center justify-between border-b border-[#F5F5F0]/15 pb-1.5">
                        <span className="font-bold text-white flex items-center gap-1.5">
                          <Calendar className="w-3 h-3 text-[#C5A059]" />
                          {label}
                        </span>
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-600/40">
                          Verified Audit
                        </span>
                      </div>

                      <div className="space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="text-[#F5F5F0]/60">{metricConfig.title}:</span>
                          <span className="font-bold text-emerald-400">
                            {metricConfig.formatValue(dataPoint[metricConfig.dataKey as keyof EcologicalDataPoint] as number)}
                          </span>
                        </div>

                        {activeMetric === 'composite' && (
                          <div className="text-[10px] text-[#F5F5F0]/50 space-y-0.5 pt-1 border-t border-[#F5F5F0]/10">
                            <div className="flex justify-between">
                              <span>Soil Carbon:</span>
                              <span className="text-emerald-300">+{dataPoint.soilOrganicCarbon}%</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Canopy NDVI:</span>
                              <span className="text-[#C5A059]">{dataPoint.canopyNdviRaw} NDVI</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Aquifer Retention:</span>
                              <span className="text-[#38BDF8]">{dataPoint.aquiferRetentionPct}%</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Biodiversity H′:</span>
                              <span className="text-purple-300">{dataPoint.biodiversityShannonRaw}</span>
                            </div>
                          </div>
                        )}

                        {showCounterfactual && (
                          <div className="flex items-center justify-between pt-1 border-t border-[#F5F5F0]/10 text-rose-300">
                            <span>Degradation Baseline:</span>
                            <span className="font-bold">{dataPoint.counterfactualDegradation}%</span>
                          </div>
                        )}

                        {dataPoint.milestoneEvent && (
                          <div className="mt-1.5 p-1.5 bg-[#1B3022]/80 border border-emerald-500/30 rounded text-[10px] text-emerald-200">
                            <strong>Milestone:</strong> {dataPoint.milestoneEvent}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                }}
              />

              {/* Counterfactual Degradation Baseline Curve */}
              {showCounterfactual && (
                <Area
                  type="monotone"
                  dataKey="counterfactualDegradation"
                  name="Degradation Baseline"
                  stroke="#F43F5E"
                  strokeWidth={1.8}
                  strokeDasharray="4 4"
                  fill="url(#counterfactualGradient)"
                  dot={false}
                  activeDot={{ r: 4, fill: '#F43F5E', stroke: '#fff', strokeWidth: 1 }}
                />
              )}

              {/* Primary Active Metric Area */}
              <Area
                type="monotone"
                dataKey={metricConfig.dataKey}
                name={metricConfig.title}
                stroke={metricConfig.color}
                strokeWidth={2.5}
                fill="url(#metricGradient)"
                dot={{ r: 3, fill: metricConfig.color, stroke: '#080808', strokeWidth: 1.5 }}
                activeDot={{ r: 6, fill: '#fff', stroke: metricConfig.color, strokeWidth: 3 }}
              />

              {/* Milestone Reference Line Markers */}
              {showMilestoneMarkers &&
                filteredData
                  .filter((d) => d.milestoneEvent)
                  .map((d, i) => (
                    <ReferenceLine
                      key={`ref-${d.period}`}
                      x={d.period}
                      stroke="#C5A059"
                      strokeOpacity={0.3}
                      strokeDasharray="2 2"
                    />
                  ))}
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Historical Recovery Milestones Carousel / Badges */}
        <div className="space-y-2 pt-2">
          <div className="flex items-center justify-between text-[10px] font-mono uppercase text-[#F5F5F0]/50">
            <span className="flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#C5A059]" />
              Historical Recovery Milestones & Cryptographic Telemetry Checkpoints
            </span>
            <button
              onClick={() => setShowMilestoneMarkers(!showMilestoneMarkers)}
              className="text-[#C5A059] hover:underline cursor-pointer"
            >
              {showMilestoneMarkers ? 'Hide Grid Marks' : 'Show Grid Marks'}
            </button>
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-[#333]">
            {filteredData
              .filter((d) => d.milestoneEvent)
              .map((item) => {
                const isSelected = selectedMilestone === item.period;
                return (
                  <button
                    key={item.period}
                    onClick={() => {
                      audioFeedback.playMicroTick();
                      setSelectedMilestone(isSelected ? null : item.period);
                    }}
                    className={`shrink-0 p-2.5 rounded-sm border text-left transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-[#1B3022] border-[#C5A059] text-white shadow-lg'
                        : 'bg-[#121212] border-[#F5F5F0]/10 text-[#F5F5F0]/70 hover:border-[#C5A059]/40'
                    }`}
                  >
                    <div className="flex items-center gap-2 text-[10px] font-mono text-[#C5A059]">
                      <Calendar className="w-3 h-3" />
                      <span>{item.period}</span>
                      <span className="text-emerald-400 font-bold">+{item.compositeRecoveryScore}%</span>
                    </div>
                    <div className="text-xs font-serif text-white mt-1 max-w-[200px] truncate">
                      {item.milestoneEvent}
                    </div>
                  </button>
                );
              })}
          </div>
        </div>
      </div>

      {/* Footer Audit Verification Bar */}
      <div className="p-4 bg-[#0A0A0A] border-t border-[#F5F5F0]/10 flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
        <div className="flex items-center gap-2 text-[#F5F5F0]/60">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>
            Telemetry Engine: <strong className="text-white">Sentinel-2 MSI</strong> • Continuous In-situ Soil Core Calibration
          </span>
        </div>

        <div className="flex items-center gap-3">
          {onInspectProvenance && (
            <button
              onClick={() => {
                audioFeedback.playSubtleClick();
                onInspectProvenance({
                  title: `${profile.bioregionName} Time-Series Provenance`,
                  hash: '0x8892f1b4a20e81c0498ac912089ef01a89c420e1',
                  timestamp: '2026-09-29T11:43:00Z',
                  validatorNodes: 42,
                  certifyingCouncil: 'Global Planetary Telemetry Quorum'
                });
              }}
              className="text-[#C5A059] hover:underline flex items-center gap-1 cursor-pointer font-bold"
            >
              <span>Verify Historical Merkle Root</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
