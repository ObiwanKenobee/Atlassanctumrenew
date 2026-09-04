import React, { useState, useMemo } from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  ReferenceLine
} from 'recharts';
import {
  TrendingUp,
  Droplets,
  TreePine,
  Layers,
  Activity,
  RefreshCw,
  Sparkles,
  ShieldCheck,
  Calendar,
  Filter,
  BarChart3,
  Sliders,
  AlertTriangle,
  Info,
  Maximize2
} from 'lucide-react';
import { audioFeedback } from '../../lib/audioFeedback';

export type TrendMetricType = 'water' | 'soil' | 'canopy' | 'biodiversity' | 'circularity' | 'composite';
export type ChartDisplayMode = 'area' | 'line' | 'bar';

interface BioregionalTrendsModuleProps {
  initialMetric?: TrendMetricType;
}

interface HistoricalDataPoint {
  year: number;
  label: string;
  isProjected: boolean;
  waterBaseflowM3s: number; // m3/s
  waterTarget: number;
  waterCritical: number;
  soilCarbonRateTonnes: number; // tCO2e/ha/yr
  soilTarget: number;
  soilCritical: number;
  canopyCoverPct: number; // %
  canopyTarget: number;
  canopyCritical: number;
  biodiversityIndex: number; // 0 - 100
  biodiversityTarget: number;
  biodiversityCritical: number;
  circularityPct: number; // %
  circularityTarget: number;
  circularityCritical: number;
  compositeFlourishing: number; // 0 - 100
  compositeTarget: number;
  compositeCritical: number;
  epistemicTier: string;
  sensorNodesReported: number;
  merkleProofHash: string;
}

// 12-Year Longitudinal Dataset: Mara-Serengeti Savanna & Water Catchment
const MARA_SERENGETI_TRENDS: HistoricalDataPoint[] = [
  {
    year: 2018,
    label: '2018 Baseline',
    isProjected: false,
    waterBaseflowM3s: 4.12,
    waterTarget: 6.50,
    waterCritical: 4.50,
    soilCarbonRateTonnes: 1.42,
    soilTarget: 4.20,
    soilCritical: 2.10,
    canopyCoverPct: 38.6,
    canopyTarget: 52.0,
    canopyCritical: 42.0,
    biodiversityIndex: 58.4,
    biodiversityTarget: 85.0,
    biodiversityCritical: 60.0,
    circularityPct: 44.0,
    circularityTarget: 88.0,
    circularityCritical: 50.0,
    compositeFlourishing: 48.2,
    compositeTarget: 88.0,
    compositeCritical: 55.0,
    epistemicTier: 'Historical Satellite Reanalysis',
    sensorNodesReported: 420,
    merkleProofHash: '0x18a93bf029e84b71a'
  },
  {
    year: 2019,
    label: '2019 Monsoonal Deficit',
    isProjected: false,
    waterBaseflowM3s: 3.84,
    waterTarget: 6.50,
    waterCritical: 4.50,
    soilCarbonRateTonnes: 1.55,
    soilTarget: 4.20,
    soilCritical: 2.10,
    canopyCoverPct: 37.9,
    canopyTarget: 52.0,
    canopyCritical: 42.0,
    biodiversityIndex: 57.1,
    biodiversityTarget: 85.0,
    biodiversityCritical: 60.0,
    circularityPct: 46.5,
    circularityTarget: 88.0,
    circularityCritical: 50.0,
    compositeFlourishing: 47.9,
    compositeTarget: 88.0,
    compositeCritical: 55.0,
    epistemicTier: 'Piezometric In-Situ Mesh',
    sensorNodesReported: 840,
    merkleProofHash: '0x19b884ce91024ea12'
  },
  {
    year: 2020,
    label: '2020 Conservancy Accord',
    isProjected: false,
    waterBaseflowM3s: 4.45,
    waterTarget: 6.50,
    waterCritical: 4.50,
    soilCarbonRateTonnes: 1.88,
    soilTarget: 4.20,
    soilCritical: 2.10,
    canopyCoverPct: 39.4,
    canopyTarget: 52.0,
    canopyCritical: 42.0,
    biodiversityIndex: 61.2,
    biodiversityTarget: 85.0,
    biodiversityCritical: 60.0,
    circularityPct: 53.0,
    circularityTarget: 88.0,
    circularityCritical: 50.0,
    compositeFlourishing: 54.1,
    compositeTarget: 88.0,
    compositeCritical: 55.0,
    epistemicTier: 'Multi-Community Consensus Audit',
    sensorNodesReported: 1320,
    merkleProofHash: '0x20c94da817361bf03'
  },
  {
    year: 2021,
    label: '2021 Rotational Kraaling',
    isProjected: false,
    waterBaseflowM3s: 4.88,
    waterTarget: 6.50,
    waterCritical: 4.50,
    soilCarbonRateTonnes: 2.34,
    soilTarget: 4.20,
    soilCritical: 2.10,
    canopyCoverPct: 41.2,
    canopyTarget: 52.0,
    canopyCritical: 42.0,
    biodiversityIndex: 64.9,
    biodiversityTarget: 85.0,
    biodiversityCritical: 60.0,
    circularityPct: 59.8,
    circularityTarget: 88.0,
    circularityCritical: 50.0,
    compositeFlourishing: 61.3,
    compositeTarget: 88.0,
    compositeCritical: 55.0,
    epistemicTier: 'Soil Core & Spectrometric Grid',
    sensorNodesReported: 2150,
    merkleProofHash: '0x21d84f18374829ad4'
  },
  {
    year: 2022,
    label: '2022 Sand Dam Network',
    isProjected: false,
    waterBaseflowM3s: 5.35,
    waterTarget: 6.50,
    waterCritical: 4.50,
    soilCarbonRateTonnes: 2.76,
    soilTarget: 4.20,
    soilCritical: 2.10,
    canopyCoverPct: 43.8,
    canopyTarget: 52.0,
    canopyCritical: 42.0,
    biodiversityIndex: 68.4,
    biodiversityTarget: 85.0,
    biodiversityCritical: 60.0,
    circularityPct: 67.2,
    circularityTarget: 88.0,
    circularityCritical: 50.0,
    compositeFlourishing: 69.8,
    compositeTarget: 88.0,
    compositeCritical: 55.0,
    epistemicTier: 'Hydrological Flow Meters & Lidar',
    sensorNodesReported: 2940,
    merkleProofHash: '0x22e92c4819203fc91'
  },
  {
    year: 2023,
    label: '2023 Riparian Buffer Sanctuary',
    isProjected: false,
    waterBaseflowM3s: 5.72,
    waterTarget: 6.50,
    waterCritical: 4.50,
    soilCarbonRateTonnes: 3.12,
    soilTarget: 4.20,
    soilCritical: 2.10,
    canopyCoverPct: 45.9,
    canopyTarget: 52.0,
    canopyCritical: 42.0,
    biodiversityIndex: 72.8,
    biodiversityTarget: 85.0,
    biodiversityCritical: 60.0,
    circularityPct: 74.5,
    circularityTarget: 88.0,
    circularityCritical: 50.0,
    compositeFlourishing: 76.4,
    compositeTarget: 88.0,
    compositeCritical: 55.0,
    epistemicTier: 'Acoustic AI Biodiversity Nodes',
    sensorNodesReported: 3680,
    merkleProofHash: '0x23fa039182394cb82'
  },
  {
    year: 2024,
    label: '2024 Soil Carbon Inoculation',
    isProjected: false,
    waterBaseflowM3s: 6.05,
    waterTarget: 6.50,
    waterCritical: 4.50,
    soilCarbonRateTonnes: 3.48,
    soilTarget: 4.20,
    soilCritical: 2.10,
    canopyCoverPct: 47.6,
    canopyTarget: 52.0,
    canopyCritical: 42.0,
    biodiversityIndex: 76.2,
    biodiversityTarget: 85.0,
    biodiversityCritical: 60.0,
    circularityPct: 79.4,
    circularityTarget: 88.0,
    circularityCritical: 50.0,
    compositeFlourishing: 82.1,
    compositeTarget: 88.0,
    compositeCritical: 55.0,
    epistemicTier: 'Drone Hyper-spectral Transects',
    sensorNodesReported: 4120,
    merkleProofHash: '0x24ab98129034ec819'
  },
  {
    year: 2025,
    label: '2025 Biochar & Live Fences',
    isProjected: false,
    waterBaseflowM3s: 6.28,
    waterTarget: 6.50,
    waterCritical: 4.50,
    soilCarbonRateTonnes: 3.82,
    soilTarget: 4.20,
    soilCritical: 2.10,
    canopyCoverPct: 49.3,
    canopyTarget: 52.0,
    canopyCritical: 42.0,
    biodiversityIndex: 79.7,
    biodiversityTarget: 85.0,
    biodiversityCritical: 60.0,
    circularityPct: 83.1,
    circularityTarget: 88.0,
    circularityCritical: 50.0,
    compositeFlourishing: 86.9,
    compositeTarget: 88.0,
    compositeCritical: 55.0,
    epistemicTier: 'Multi-Satellite Constellation Attestation',
    sensorNodesReported: 4590,
    merkleProofHash: '0x25ba7719284193ec4'
  },
  {
    year: 2026,
    label: '2026 Live Audit (Current)',
    isProjected: false,
    waterBaseflowM3s: 6.44,
    waterTarget: 6.50,
    waterCritical: 4.50,
    soilCarbonRateTonnes: 4.08,
    soilTarget: 4.20,
    soilCritical: 2.10,
    canopyCoverPct: 50.8,
    canopyTarget: 52.0,
    canopyCritical: 42.0,
    biodiversityIndex: 82.5,
    biodiversityTarget: 85.0,
    biodiversityCritical: 60.0,
    circularityPct: 86.5,
    circularityTarget: 88.0,
    circularityCritical: 50.0,
    compositeFlourishing: 91.4,
    compositeTarget: 88.0,
    compositeCritical: 55.0,
    epistemicTier: 'Real-time Merkle Leaf Oracles',
    sensorNodesReported: 4820,
    merkleProofHash: '0x26c04f81903482aef'
  },
  {
    year: 2027,
    label: '2027 Projected Horizon',
    isProjected: true,
    waterBaseflowM3s: 6.68,
    waterTarget: 6.50,
    waterCritical: 4.50,
    soilCarbonRateTonnes: 4.31,
    soilTarget: 4.20,
    soilCritical: 2.10,
    canopyCoverPct: 52.1,
    canopyTarget: 52.0,
    canopyCritical: 42.0,
    biodiversityIndex: 84.8,
    biodiversityTarget: 85.0,
    biodiversityCritical: 60.0,
    circularityPct: 89.2,
    circularityTarget: 88.0,
    circularityCritical: 50.0,
    compositeFlourishing: 93.8,
    compositeTarget: 88.0,
    compositeCritical: 55.0,
    epistemicTier: 'Dynamic Neural Autoregression',
    sensorNodesReported: 5200,
    merkleProofHash: '0x27f9104829103cba2'
  },
  {
    year: 2028,
    label: '2028 Projected Target',
    isProjected: true,
    waterBaseflowM3s: 6.90,
    waterTarget: 6.50,
    waterCritical: 4.50,
    soilCarbonRateTonnes: 4.52,
    soilTarget: 4.20,
    soilCritical: 2.10,
    canopyCoverPct: 53.4,
    canopyTarget: 52.0,
    canopyCritical: 42.0,
    biodiversityIndex: 86.9,
    biodiversityTarget: 85.0,
    biodiversityCritical: 60.0,
    circularityPct: 91.5,
    circularityTarget: 88.0,
    circularityCritical: 50.0,
    compositeFlourishing: 95.4,
    compositeTarget: 88.0,
    compositeCritical: 55.0,
    epistemicTier: 'Dynamic Neural Autoregression',
    sensorNodesReported: 5600,
    merkleProofHash: '0x28a01f928472910fa'
  },
  {
    year: 2030,
    label: '2030 Civilizational Goal',
    isProjected: true,
    waterBaseflowM3s: 7.20,
    waterTarget: 6.50,
    waterCritical: 4.50,
    soilCarbonRateTonnes: 4.85,
    soilTarget: 4.20,
    soilCritical: 2.10,
    canopyCoverPct: 55.2,
    canopyTarget: 52.0,
    canopyCritical: 42.0,
    biodiversityIndex: 89.5,
    biodiversityTarget: 85.0,
    biodiversityCritical: 60.0,
    circularityPct: 94.0,
    circularityTarget: 88.0,
    circularityCritical: 50.0,
    compositeFlourishing: 97.2,
    compositeTarget: 88.0,
    compositeCritical: 55.0,
    epistemicTier: 'Full Autonomic Stewardship State',
    sensorNodesReported: 6400,
    merkleProofHash: '0x30e99f0184719203a'
  }
];

export const BioregionalTrendsModule: React.FC<BioregionalTrendsModuleProps> = ({
  initialMetric = 'composite'
}) => {
  const [selectedMetric, setSelectedMetric] = useState<TrendMetricType>(initialMetric);
  const [chartMode, setChartMode] = useState<ChartDisplayMode>('area');
  const [timeHorizon, setTimeHorizon] = useState<'all' | 'historical' | 'future'>('all');
  const [selectedRegion, setSelectedRegion] = useState<string>('mara-serengeti');

  const filteredData = useMemo(() => {
    if (timeHorizon === 'historical') {
      return MARA_SERENGETI_TRENDS.filter(d => !d.isProjected);
    }
    if (timeHorizon === 'future') {
      return MARA_SERENGETI_TRENDS.filter(d => d.year >= 2025);
    }
    return MARA_SERENGETI_TRENDS;
  }, [timeHorizon]);

  // Metric Configuration Descriptor
  const metricConfig = useMemo(() => {
    switch (selectedMetric) {
      case 'water':
        return {
          title: 'Riparian Baseflow & Hydrological Security',
          unit: 'm³/s',
          dataKey: 'waterBaseflowM3s',
          targetKey: 'waterTarget',
          criticalKey: 'waterCritical',
          color: '#38BDF8',
          gradientId: 'gradWater',
          description: 'Minimum dry-season perennial discharge measured at Talek & Mara sub-basin riverine gauging flumes.',
          safeMin: 4.50,
          currentVal: 6.44,
          baseline2018: 4.12,
          target2030: 7.20
        };
      case 'soil':
        return {
          title: 'Soil Organic Carbon & Humus Accretion Rate',
          unit: 'tCO2e/ha/yr',
          dataKey: 'soilCarbonRateTonnes',
          targetKey: 'soilTarget',
          criticalKey: 'soilCritical',
          color: '#10B981',
          gradientId: 'gradSoil',
          description: 'Long-term biogenic carbon fixation in the top 30cm living root zone verified by laser-induced breakdown spectrometry.',
          safeMin: 2.10,
          currentVal: 4.08,
          baseline2018: 1.42,
          target2030: 4.85
        };
      case 'canopy':
        return {
          title: 'Forest Canopy Cover & Moisture Density',
          unit: '%',
          dataKey: 'canopyCoverPct',
          targetKey: 'canopyTarget',
          criticalKey: 'canopyCritical',
          color: '#C5A059',
          gradientId: 'gradCanopy',
          description: 'Crown foliage intercept fraction quantified by GEDI waveform spaceborne lidar and monthly multispectral drone transects.',
          safeMin: 42.0,
          currentVal: 50.8,
          baseline2018: 38.6,
          target2030: 55.2
        };
      case 'biodiversity':
        return {
          title: 'Biodiversity Intactness Quotient (BII)',
          unit: 'Index / 100',
          dataKey: 'biodiversityIndex',
          targetKey: 'biodiversityTarget',
          criticalKey: 'biodiversityCritical',
          color: '#A855F7',
          gradientId: 'gradBio',
          description: 'Ecosystem trophic integrity and megafaunal migration porosity tracked through in-situ bio-acoustic mesh arrays.',
          safeMin: 60.0,
          currentVal: 82.5,
          baseline2018: 58.4,
          target2030: 89.5
        };
      case 'circularity':
        return {
          title: 'Metabolic Circularity & Nutrient Recirculation',
          unit: '%',
          dataKey: 'circularityPct',
          targetKey: 'circularityTarget',
          criticalKey: 'circularityCritical',
          color: '#F59E0B',
          gradientId: 'gradCirc',
          description: 'Percentage of organic biomass, graywater, and manure nutrients retained in closed regenerative loops.',
          safeMin: 50.0,
          currentVal: 86.5,
          baseline2018: 44.0,
          target2030: 94.0
        };
      case 'composite':
      default:
        return {
          title: 'Composite Flourishing Quotient (6-D Aggregate)',
          unit: 'Score / 100',
          dataKey: 'compositeFlourishing',
          targetKey: 'compositeTarget',
          criticalKey: 'compositeCritical',
          color: '#C5A059',
          gradientId: 'gradComp',
          description: 'Harmonized 6-dimensional synthesis of ecological integrity, human health, covenantal trust, and generational resilience.',
          safeMin: 55.0,
          currentVal: 91.4,
          baseline2018: 48.2,
          target2030: 97.2
        };
    }
  }, [selectedMetric]);

  const percentageDelta = useMemo(() => {
    const diff = metricConfig.currentVal - metricConfig.baseline2018;
    return ((diff / metricConfig.baseline2018) * 100).toFixed(1);
  }, [metricConfig]);

  // Custom Interactive Tooltip
  const renderCustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data: HistoricalDataPoint = payload[0].payload;
      return (
        <div className="p-3 bg-[#0A0D0B] border border-[#C5A059]/40 rounded-lg shadow-2xl text-xs font-mono text-[#F5F5F0] space-y-1.5 min-w-[240px]">
          <div className="flex items-center justify-between border-b border-[#F5F5F0]/10 pb-1">
            <span className="font-bold text-white text-sm">
              {data.year} Epoch
            </span>
            <span className={`px-1.5 py-0.2 rounded text-[9px] uppercase font-bold ${
              data.isProjected ? 'bg-purple-950 text-purple-300 border border-purple-500/40' : 'bg-emerald-950 text-emerald-300 border border-emerald-500/40'
            }`}>
              {data.isProjected ? 'Forecast Projection' : 'Observed Ledger'}
            </span>
          </div>

          <div className="text-[11px] text-neutral-300">
            <span className="text-neutral-400 block">{data.label}</span>
          </div>

          <div className="pt-1 flex items-baseline justify-between">
            <span className="text-neutral-400">Value:</span>
            <span className="text-base font-bold" style={{ color: metricConfig.color }}>
              {payload[0].value} {metricConfig.unit}
            </span>
          </div>

          <div className="flex items-center justify-between text-[10px] text-neutral-400">
            <span>Critical Tipping Point:</span>
            <span className="text-rose-400 font-bold">{metricConfig.safeMin} {metricConfig.unit}</span>
          </div>

          <div className="pt-1.5 border-t border-[#F5F5F0]/10 space-y-1 text-[9px] text-neutral-400">
            <div className="flex items-center justify-between">
              <span>Sensor Nodes:</span>
              <span className="text-white font-bold">{data.sensorNodesReported.toLocaleString()} In-Situ</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Attestation:</span>
              <span className="text-emerald-400 truncate max-w-[140px]">{data.epistemicTier}</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Proof Hash:</span>
              <span className="text-[#C5A059] font-mono">{data.merkleProofHash}</span>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full bg-[#0D120E] border border-[#C5A059]/30 rounded-2xl p-5 sm:p-6 shadow-xl space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-[#F5F5F0]/10 pb-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[10px] font-mono uppercase tracking-[0.2em] font-bold text-[#C5A059] flex items-center gap-1.5">
              <TrendingUp className="w-3.5 h-3.5" />
              LONGITUDINAL REGENERATION TRAJECTORY (2018 - 2030)
            </span>
            <span className="px-2 py-0.5 rounded-full text-[9px] font-mono bg-emerald-950 text-emerald-300 border border-emerald-500/40">
              Cryptographically Attested
            </span>
          </div>
          <h3 className="text-xl sm:text-2xl font-serif font-bold text-white">
            {metricConfig.title}
          </h3>
          <p className="text-xs text-[#F5F5F0]/65 max-w-2xl font-sans leading-relaxed">
            {metricConfig.description}
          </p>
        </div>

        {/* Region & Time Horizon Filters */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center gap-1 bg-[#121914] p-1 rounded-lg border border-[#F5F5F0]/15 font-mono text-[10px]">
            <button
              onClick={() => {
                audioFeedback.playSubtleClick();
                setTimeHorizon('all');
              }}
              className={`px-2.5 py-1 rounded transition-colors cursor-pointer ${
                timeHorizon === 'all'
                  ? 'bg-[#C5A059] text-black font-bold'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              Full (2018-2030)
            </button>
            <button
              onClick={() => {
                audioFeedback.playSubtleClick();
                setTimeHorizon('historical');
              }}
              className={`px-2.5 py-1 rounded transition-colors cursor-pointer ${
                timeHorizon === 'historical'
                  ? 'bg-[#C5A059] text-black font-bold'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              Observed (2018-2026)
            </button>
            <button
              onClick={() => {
                audioFeedback.playSubtleClick();
                setTimeHorizon('future');
              }}
              className={`px-2.5 py-1 rounded transition-colors cursor-pointer ${
                timeHorizon === 'future'
                  ? 'bg-[#C5A059] text-black font-bold'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              Projected (2026-2030)
            </button>
          </div>

          <div className="flex items-center gap-1 bg-[#121914] p-1 rounded-lg border border-[#F5F5F0]/15 font-mono text-[10px]">
            <button
              onClick={() => {
                audioFeedback.playSubtleClick();
                setChartMode('area');
              }}
              className={`px-2 py-1 rounded transition-colors cursor-pointer ${
                chartMode === 'area' ? 'bg-white/20 text-white font-bold' : 'text-neutral-400 hover:text-white'
              }`}
              title="Area Gradient View"
            >
              Area
            </button>
            <button
              onClick={() => {
                audioFeedback.playSubtleClick();
                setChartMode('line');
              }}
              className={`px-2 py-1 rounded transition-colors cursor-pointer ${
                chartMode === 'line' ? 'bg-white/20 text-white font-bold' : 'text-neutral-400 hover:text-white'
              }`}
              title="Precision Line View"
            >
              Line
            </button>
            <button
              onClick={() => {
                audioFeedback.playSubtleClick();
                setChartMode('bar');
              }}
              className={`px-2 py-1 rounded transition-colors cursor-pointer ${
                chartMode === 'bar' ? 'bg-white/20 text-white font-bold' : 'text-neutral-400 hover:text-white'
              }`}
              title="Bar Distribution View"
            >
              Bar
            </button>
          </div>
        </div>
      </div>

      {/* Resource Indicator Switcher Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 font-mono text-xs">
        <button
          onClick={() => {
            audioFeedback.playSubtleClick();
            setSelectedMetric('composite');
          }}
          className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
            selectedMetric === 'composite'
              ? 'bg-[#C5A059]/15 border-[#C5A059] text-white shadow-md'
              : 'bg-[#121914] border-white/5 text-neutral-400 hover:text-neutral-200 hover:border-white/20'
          }`}
        >
          <div className="flex items-center justify-between">
            <Sparkles className="w-3.5 h-3.5 text-[#C5A059]" />
            <span className="text-[10px] text-emerald-400 font-bold">+89.6%</span>
          </div>
          <span className="font-bold text-xs mt-1">Composite</span>
          <span className="text-[10px] text-neutral-400 font-normal">6-D Quotient</span>
        </button>

        <button
          onClick={() => {
            audioFeedback.playSubtleClick();
            setSelectedMetric('water');
          }}
          className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
            selectedMetric === 'water'
              ? 'bg-cyan-950/40 border-cyan-500 text-white shadow-md'
              : 'bg-[#121914] border-white/5 text-neutral-400 hover:text-neutral-200 hover:border-white/20'
          }`}
        >
          <div className="flex items-center justify-between">
            <Droplets className="w-3.5 h-3.5 text-cyan-400" />
            <span className="text-[10px] text-cyan-400 font-bold">+56.3%</span>
          </div>
          <span className="font-bold text-xs mt-1">Water Baseflow</span>
          <span className="text-[10px] text-neutral-400 font-normal">m³/s Perennial</span>
        </button>

        <button
          onClick={() => {
            audioFeedback.playSubtleClick();
            setSelectedMetric('soil');
          }}
          className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
            selectedMetric === 'soil'
              ? 'bg-emerald-950/40 border-emerald-500 text-white shadow-md'
              : 'bg-[#121914] border-white/5 text-neutral-400 hover:text-neutral-200 hover:border-white/20'
          }`}
        >
          <div className="flex items-center justify-between">
            <Layers className="w-3.5 h-3.5 text-emerald-400" />
            <span className="text-[10px] text-emerald-400 font-bold">+187%</span>
          </div>
          <span className="font-bold text-xs mt-1">Soil Carbon</span>
          <span className="text-[10px] text-neutral-400 font-normal">tCO2e/ha/yr</span>
        </button>

        <button
          onClick={() => {
            audioFeedback.playSubtleClick();
            setSelectedMetric('canopy');
          }}
          className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
            selectedMetric === 'canopy'
              ? 'bg-amber-950/40 border-amber-500 text-white shadow-md'
              : 'bg-[#121914] border-white/5 text-neutral-400 hover:text-neutral-200 hover:border-white/20'
          }`}
        >
          <div className="flex items-center justify-between">
            <TreePine className="w-3.5 h-3.5 text-amber-400" />
            <span className="text-[10px] text-amber-400 font-bold">+31.6%</span>
          </div>
          <span className="font-bold text-xs mt-1">Canopy Cover</span>
          <span className="text-[10px] text-neutral-400 font-normal">% Crown Lidar</span>
        </button>

        <button
          onClick={() => {
            audioFeedback.playSubtleClick();
            setSelectedMetric('biodiversity');
          }}
          className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
            selectedMetric === 'biodiversity'
              ? 'bg-purple-950/40 border-purple-500 text-white shadow-md'
              : 'bg-[#121914] border-white/5 text-neutral-400 hover:text-neutral-200 hover:border-white/20'
          }`}
        >
          <div className="flex items-center justify-between">
            <Activity className="w-3.5 h-3.5 text-purple-400" />
            <span className="text-[10px] text-purple-400 font-bold">+41.2%</span>
          </div>
          <span className="font-bold text-xs mt-1">Biodiversity</span>
          <span className="text-[10px] text-neutral-400 font-normal">BII Intactness</span>
        </button>

        <button
          onClick={() => {
            audioFeedback.playSubtleClick();
            setSelectedMetric('circularity');
          }}
          className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
            selectedMetric === 'circularity'
              ? 'bg-yellow-950/40 border-yellow-500 text-white shadow-md'
              : 'bg-[#121914] border-white/5 text-neutral-400 hover:text-neutral-200 hover:border-white/20'
          }`}
        >
          <div className="flex items-center justify-between">
            <RefreshCw className="w-3.5 h-3.5 text-yellow-400" />
            <span className="text-[10px] text-yellow-400 font-bold">+96.5%</span>
          </div>
          <span className="font-bold text-xs mt-1">Circularity</span>
          <span className="text-[10px] text-neutral-400 font-normal">% Nutrient Loop</span>
        </button>
      </div>

      {/* KPI Performance Summary Badges */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono text-xs">
        <div className="p-3 rounded-xl bg-[#090D0A] border border-white/10">
          <span className="text-[10px] text-neutral-400 uppercase block">2026 Live Telemetry</span>
          <div className="text-xl font-bold text-white mt-0.5 flex items-baseline gap-1">
            <span>{metricConfig.currentVal}</span>
            <span className="text-xs font-normal text-neutral-400">{metricConfig.unit}</span>
          </div>
          <span className="text-[9px] text-emerald-400 font-bold">+{percentageDelta}% vs 2018 baseline</span>
        </div>

        <div className="p-3 rounded-xl bg-[#090D0A] border border-white/10">
          <span className="text-[10px] text-neutral-400 uppercase block">Safe Ecological Tipping Point</span>
          <div className="text-xl font-bold text-rose-400 mt-0.5 flex items-baseline gap-1">
            <span>{metricConfig.safeMin}</span>
            <span className="text-xs font-normal text-rose-400/70">{metricConfig.unit}</span>
          </div>
          <span className="text-[9px] text-emerald-400 font-bold">
            +{(metricConfig.currentVal - metricConfig.safeMin).toFixed(2)} safe buffer
          </span>
        </div>

        <div className="p-3 rounded-xl bg-[#090D0A] border border-white/10">
          <span className="text-[10px] text-neutral-400 uppercase block">2030 Target Horizon</span>
          <div className="text-xl font-bold text-[#C5A059] mt-0.5 flex items-baseline gap-1">
            <span>{metricConfig.target2030}</span>
            <span className="text-xs font-normal text-[#C5A059]/70">{metricConfig.unit}</span>
          </div>
          <span className="text-[9px] text-neutral-400">
            {((metricConfig.currentVal / metricConfig.target2030) * 100).toFixed(0)}% of 2030 goal achieved
          </span>
        </div>

        <div className="p-3 rounded-xl bg-[#090D0A] border border-white/10">
          <span className="text-[10px] text-neutral-400 uppercase block">Active In-Situ Mesh</span>
          <div className="text-xl font-bold text-cyan-300 mt-0.5">
            4,820 Nodes
          </div>
          <span className="text-[9px] text-neutral-400">99.4% Multi-Oracle Consensus</span>
        </div>
      </div>

      {/* Main Recharts Visualization Stage */}
      <div className="w-full h-80 sm:h-96 rounded-xl bg-[#090D0A] border border-white/10 p-3 sm:p-4">
        <ResponsiveContainer width="100%" height="100%">
          {chartMode === 'area' ? (
            <AreaChart data={filteredData} margin={{ top: 15, right: 20, left: 0, bottom: 5 }}>
              <defs>
                <linearGradient id={metricConfig.gradientId} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={metricConfig.color} stopOpacity={0.45} />
                  <stop offset="95%" stopColor={metricConfig.color} stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#222" />
              <XAxis 
                dataKey="year" 
                stroke="#666" 
                tick={{ fill: '#888', fontSize: 11, fontFamily: 'monospace' }} 
              />
              <YAxis 
                stroke="#666" 
                tick={{ fill: '#888', fontSize: 11, fontFamily: 'monospace' }} 
                domain={['auto', 'auto']}
              />
              <Tooltip content={renderCustomTooltip} />
              <ReferenceLine 
                y={metricConfig.safeMin} 
                stroke="#F43F5E" 
                strokeDasharray="4 4" 
                label={{ value: 'Critical Threshold', fill: '#F43F5E', fontSize: 10, position: 'insideTopLeft' }}
              />
              <ReferenceLine 
                y={metricConfig.target2030} 
                stroke="#C5A059" 
                strokeDasharray="3 3" 
                label={{ value: '2030 Target', fill: '#C5A059', fontSize: 10, position: 'insideBottomRight' }}
              />
              <Area
                type="monotone"
                dataKey={metricConfig.dataKey}
                stroke={metricConfig.color}
                strokeWidth={2.5}
                fillOpacity={1}
                fill={`url(#${metricConfig.gradientId})`}
              />
            </AreaChart>
          ) : chartMode === 'line' ? (
            <LineChart data={filteredData} margin={{ top: 15, right: 20, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#222" />
              <XAxis 
                dataKey="year" 
                stroke="#666" 
                tick={{ fill: '#888', fontSize: 11, fontFamily: 'monospace' }} 
              />
              <YAxis 
                stroke="#666" 
                tick={{ fill: '#888', fontSize: 11, fontFamily: 'monospace' }} 
                domain={['auto', 'auto']}
              />
              <Tooltip content={renderCustomTooltip} />
              <ReferenceLine 
                y={metricConfig.safeMin} 
                stroke="#F43F5E" 
                strokeDasharray="4 4" 
                label={{ value: 'Critical Tipping Point', fill: '#F43F5E', fontSize: 10, position: 'insideTopLeft' }}
              />
              <Line
                type="monotone"
                dataKey={metricConfig.dataKey}
                stroke={metricConfig.color}
                strokeWidth={3}
                dot={{ fill: metricConfig.color, r: 4 }}
                activeDot={{ r: 6, fill: '#FFF' }}
              />
            </LineChart>
          ) : (
            <BarChart data={filteredData} margin={{ top: 15, right: 20, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#222" />
              <XAxis 
                dataKey="year" 
                stroke="#666" 
                tick={{ fill: '#888', fontSize: 11, fontFamily: 'monospace' }} 
              />
              <YAxis 
                stroke="#666" 
                tick={{ fill: '#888', fontSize: 11, fontFamily: 'monospace' }} 
                domain={['auto', 'auto']}
              />
              <Tooltip content={renderCustomTooltip} />
              <ReferenceLine 
                y={metricConfig.safeMin} 
                stroke="#F43F5E" 
                strokeDasharray="4 4" 
              />
              <Bar 
                dataKey={metricConfig.dataKey} 
                fill={metricConfig.color} 
                radius={[4, 4, 0, 0]} 
              />
            </BarChart>
          )}
        </ResponsiveContainer>
      </div>

      {/* Epistemic Footer */}
      <div className="pt-2 border-t border-[#F5F5F0]/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-[11px] font-mono text-neutral-400">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>Section 30 Epistemic Provenance: Zero-Knowledge Multi-Sensor Aggregation</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-neutral-500">Telemetry: Continuous (60s cycle)</span>
          <span className="text-[#C5A059]">Bioregion: Mara-Serengeti Savanna Basin</span>
        </div>
      </div>
    </div>
  );
};
