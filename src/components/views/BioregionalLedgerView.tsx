import React, { useState, useMemo, useEffect } from 'react';
import { 
  TreePine, 
  Droplets, 
  Layers, 
  Activity, 
  ShieldCheck, 
  Database, 
  Globe2, 
  RefreshCw, 
  ArrowRight, 
  CheckCircle2, 
  Clock, 
  Sliders, 
  Zap, 
  TrendingUp, 
  Info, 
  Sparkles, 
  HeartHandshake, 
  Lock, 
  Filter, 
  Share2, 
  Download,
  AlertCircle,
  Cpu,
  Play,
  Pause,
  RotateCcw,
  FileText,
  Calendar,
  History,
  Check,
  AlertTriangle,
  BellRing,
  ShieldAlert,
  Columns2,
  Users
} from 'lucide-react';
import { DataProvenance, PageView } from '../../types';
import { 
  BIOREGIONAL_LEDGER_REGIONS, 
  EcologicalMetricItem, 
  BioregionalResourceFlowItem, 
  BioregionalLedgerData,
  HISTORICAL_TIMELINE_EPOCHS,
  HistoricalTimelineEpoch
} from '../../data/bioregionalLedgerData';
import { MissionImpactMap } from '../analytics/MissionImpactMap';
import { BioregionalSankeyFlows } from '../bioregional/BioregionalSankeyFlows';
import { BioregionalForecastingOverlay } from '../bioregional/BioregionalForecastingOverlay';
import { BioregionalTrendAnalysisOverlay } from '../bioregional/BioregionalTrendAnalysisOverlay';
import { EpistemicSyncModal, EpistemicSnapshotRecord } from '../bioregional/EpistemicSyncModal';
import { BioregionalComparisonView } from '../bioregional/BioregionalComparisonView';
import { BioregionalExportControllerModal } from '../bioregional/BioregionalExportControllerModal';
import { EcologicalHotspotsCanvas } from '../bioregional/EcologicalHotspotsCanvas';
import { ResourceAllocationPlanner } from '../bioregional/ResourceAllocationPlanner';
import { RegenerativePeerComparison } from '../bioregional/RegenerativePeerComparison';
import { generateBioregionalPDFReport } from '../../lib/generateBioregionalReport';
import { useVerificationToast } from '../../context/VerificationToastContext';
import { audioFeedback } from '../../lib/audioFeedback';

interface BioregionalLedgerViewProps {
  onInspectProvenance: (prov: DataProvenance) => void;
  onSelectTab?: (tab: PageView) => void;
}

export const BioregionalLedgerView: React.FC<BioregionalLedgerViewProps> = ({
  onInspectProvenance,
  onSelectTab
}) => {
  const { notifyVerified, notifyEcologicalAlert } = useVerificationToast();

  const [selectedRegionId, setSelectedRegionId] = useState<string>('mara-serengeti');
  const [activeTab, setActiveTab] = useState<'metrics' | 'flows' | 'impact_map' | 'simulator' | 'planner' | 'peer_benchmark'>('metrics');
  const [metricFilter, setMetricFilter] = useState<'all' | 'water' | 'soil' | 'canopy' | 'biodiversity'>('all');
  const [verifyingId, setVerifyingId] = useState<string | null>(null);

  // Bioregional Export Controller modal state
  const [showExportController, setShowExportController] = useState<boolean>(false);

  // Map sub-view: Hotspot Scarcity Canvas vs Causal Impact Network
  const [mapSubView, setMapSubView] = useState<'hotspots' | 'causal' | 'both'>('hotspots');

  // Time-slider & historical baseline states
  const [selectedYear, setSelectedYear] = useState<number>(2026);
  const [isPlayingTimeline, setIsPlayingTimeline] = useState<boolean>(false);

  // Forecasting overlay state
  const [showForecastingOverlay, setShowForecastingOverlay] = useState<boolean>(false);
  const [projectedDataState, setProjectedDataState] = useState<{
    year: number;
    score: number;
    waterMult: number;
    carbonMult: number;
  } | null>(null);

  // Trend Analysis overlay state
  const [showTrendAnalysis, setShowTrendAnalysis] = useState<boolean>(false);

  // Epistemic Ledger Sync state & session history
  const [showEpistemicSyncModal, setShowEpistemicSyncModal] = useState<boolean>(false);
  const [syncedSnapshots, setSyncedSnapshots] = useState<EpistemicSnapshotRecord[]>([]);

  // Side-by-Side Comparison mode state
  const [isComparisonMode, setIsComparisonMode] = useState<boolean>(false);

  // Sentinel active alerts tracking
  const [dismissedSentinelBreach, setDismissedSentinelBreach] = useState<boolean>(false);

  // PDF report generation state
  const [isGeneratingReport, setIsGeneratingReport] = useState<boolean>(false);

  // Flow view mode toggle: D3 Sankey vs Cards vs Both
  const [flowViewMode, setFlowViewMode] = useState<'sankey' | 'cards' | 'both'>('both');

  // Simulation parameters
  const [simRainfallDelta, setSimRainfallDelta] = useState<number>(0); // -40% to +40%
  const [simReforestation, setSimReforestation] = useState<number>(15); // 0% to +50%
  const [simBiocharRate, setSimBiocharRate] = useState<number>(8); // 0 to 20 t/ha

  const activeRegion: BioregionalLedgerData = useMemo(() => {
    return BIOREGIONAL_LEDGER_REGIONS[selectedRegionId] || BIOREGIONAL_LEDGER_REGIONS['mara-serengeti'];
  }, [selectedRegionId]);

  // Current Epoch resolution
  const currentEpoch: HistoricalTimelineEpoch = useMemo(() => {
    const exact = HISTORICAL_TIMELINE_EPOCHS.find(e => e.year === selectedYear);
    if (exact) return exact;
    return HISTORICAL_TIMELINE_EPOCHS.reduce((prev, curr) => 
      Math.abs(curr.year - selectedYear) < Math.abs(prev.year - selectedYear) ? curr : prev
    );
  }, [selectedYear]);

  // Timeline autoplay interval
  useEffect(() => {
    if (!isPlayingTimeline) return;
    const epochYears = [2018, 2020, 2022, 2024, 2026];
    const timer = setInterval(() => {
      setSelectedYear((prev) => {
        const currentIndex = epochYears.indexOf(prev);
        const nextIndex = (currentIndex + 1) % epochYears.length;
        audioFeedback.playSubtleClick();
        return epochYears[nextIndex];
      });
    }, 2400);
    return () => clearInterval(timer);
  }, [isPlayingTimeline]);

  // Temporal progress ratio (0 = 2018 baseline, 1 = 2026 live)
  const temporalProgress = useMemo(() => {
    return Math.max(0, Math.min(1, (selectedYear - 2018) / (2026 - 2018)));
  }, [selectedYear]);

  // Compute simulated & epoch-adjusted dynamic metrics
  const simulatedMetrics = useMemo(() => {
    const isProjected = selectedYear > 2026 && projectedDataState;
    const pWaterMult = isProjected ? projectedDataState.waterMult : 1.0;
    const pCarbonMult = isProjected ? projectedDataState.carbonMult : 1.0;

    return activeRegion.metrics.map((metric) => {
      const baselineVal = metric.baselineValue;
      const liveVal = metric.currentValue;

      // 1. Interpolate between baseline and current based on year slider
      let val: number;
      if (isProjected) {
        if (metric.category === 'water') {
          val = +(liveVal * pWaterMult).toFixed(1);
        } else if (metric.category === 'atmospheric' || metric.category === 'canopy') {
          val = +(liveVal * pCarbonMult).toFixed(1);
        } else if (metric.category === 'soil') {
          val = +(liveVal + (pCarbonMult - 1.0) * 1.6).toFixed(2);
        } else {
          const boost = (projectedDataState.score - activeRegion.compositeFlourishingScore) / 100;
          val = +(liveVal * (1 + boost * 0.5)).toFixed(1);
        }
      } else {
        val = +(baselineVal + (liveVal - baselineVal) * temporalProgress).toFixed(1);
      }

      // 2. Counterfactual simulator adjustments
      if (metric.category === 'water') {
        val = +(val * (1 + (simRainfallDelta * 0.6) / 100 + (simReforestation * 0.3) / 100)).toFixed(1);
      } else if (metric.category === 'soil') {
        val = +(val + (simBiocharRate * 0.08) + (simReforestation * 0.02)).toFixed(2);
      } else if (metric.category === 'canopy') {
        val = +(val + (simReforestation * 0.25)).toFixed(1);
      }

      const calculatedDelta = +(((val - metric.baselineValue) / (metric.baselineValue || 1)) * 100).toFixed(1);

      let computedStatus = metric.status;
      if (selectedYear === 2018) {
        computedStatus = 'critical';
      } else if (selectedYear <= 2022) {
        computedStatus = 'recovering';
      } else if (isProjected) {
        computedStatus = val >= liveVal ? 'optimal' : 'recovering';
      }

      return {
        ...metric,
        currentValue: val,
        deltaPct: calculatedDelta,
        status: computedStatus
      };
    });
  }, [
    activeRegion, 
    selectedYear, 
    temporalProgress, 
    projectedDataState, 
    simRainfallDelta, 
    simReforestation, 
    simBiocharRate
  ]);

  const filteredMetrics = useMemo(() => {
    if (metricFilter === 'all') return simulatedMetrics;
    return simulatedMetrics.filter((m) => m.category === metricFilter);
  }, [simulatedMetrics, metricFilter]);

  // Handle on-chain epistemic verification action
  const handleVerifyMetric = (metric: EcologicalMetricItem) => {
    audioFeedback.playSubtleClick();
    setVerifyingId(metric.id);

    setTimeout(() => {
      notifyVerified({
        title: `${metric.name} Anchored in Epistemic Ledger`,
        claim: `Telemetry verified at ${metric.currentValue} ${metric.unit} with ${metric.confidenceScore}% certainty score.`,
        hash: metric.provenance.cryptographicHash,
        verifier: metric.provenance.verifier,
        certaintyScore: metric.confidenceScore,
        telemetrySource: metric.provenance.source,
        epistemicTier: 'In-Situ Ground Truth'
      });
      setVerifyingId(null);
    }, 600);
  };

  const handleVerifyFlow = (flow: BioregionalResourceFlowItem) => {
    audioFeedback.playSubtleClick();
    setVerifyingId(flow.id);

    setTimeout(() => {
      notifyVerified({
        title: `${flow.title} Flow Ledger Confirmed`,
        claim: `Resource throughput confirmed at ${flow.flowRate} ${flow.flowUnit} with ${flow.circularityPct}% circularity.`,
        hash: flow.provenance.cryptographicHash,
        verifier: flow.provenance.verifier,
        certaintyScore: flow.provenance.certaintyScore,
        telemetrySource: flow.provenance.source,
        epistemicTier: 'Cryptographic Merkle Leaf',
        blockHeight: flow.lastProofBlock
      });
      setVerifyingId(null);
    }, 600);
  };

  // Download Verified PDF Report
  const handleDownloadReport = async () => {
    audioFeedback.playSubtleClick();
    setIsGeneratingReport(true);
    try {
      await generateBioregionalPDFReport({
        region: activeRegion,
        metrics: filteredMetrics,
        selectedYear,
        epoch: currentEpoch,
        userRole: 'Bioregional Epistemic Auditor'
      });

      notifyVerified({
        title: 'Verified Ecological Report Downloaded',
        claim: `Signed cryptographic PDF generated for ${activeRegion.regionName} (Epoch: ${currentEpoch.label} ${selectedYear}).`,
        hash: '0x4f128e99bcde710294821a8374829103fc8912',
        verifier: 'Mara Transboundary Commission & Savory Hub Africa',
        certaintyScore: 99.4,
        telemetrySource: 'Distributed In-Situ Sensor Mesh & Lidar Transects',
        epistemicTier: 'Multi-Party Consensus'
      });
    } catch (err) {
      console.error('Failed to generate PDF report:', err);
    } finally {
      setIsGeneratingReport(false);
    }
  };

  // Scaled vital stats based on historical epoch or forecast projection
  const baseFlourishingScore = projectedDataState && selectedYear > 2026
    ? projectedDataState.score
    : (activeRegion.compositeFlourishingScore * (currentEpoch.compositeFlourishingScore / 91.4));

  const displayFlourishingScore = Number(baseFlourishingScore).toFixed(1);

  const waterMultiplier = projectedDataState && selectedYear > 2026
    ? projectedDataState.waterMult
    : currentEpoch.waterYieldMultiplier;

  const carbonMultiplier = projectedDataState && selectedYear > 2026
    ? projectedDataState.carbonMult
    : currentEpoch.carbonRateMultiplier;

  const displayWaterYield = ((activeRegion.waterYieldAnnualM3 * waterMultiplier) / 1000000).toFixed(0);
  const displayCarbonRate = ((activeRegion.carbonSequestrationRateAnnualTonnes * carbonMultiplier) / 1000).toFixed(0);

  // Ecological Alert System Triggers
  const handleTriggerWaterScarcityAlert = () => {
    audioFeedback.playSubtleClick();
    notifyEcologicalAlert({
      title: 'Water Scarcity Critical Threshold Breach',
      claim: 'Riparian baseflow dropped below 4.50 m³/s safe ecological threshold in Talek tributary.',
      metricCategory: 'water',
      metricName: 'Talek Tributary Riparian Baseflow',
      thresholdValue: '4.50',
      actualValue: '3.82',
      unit: 'm³/s',
      severity: 'critical',
      hash: '0xwater_scarcity_breach_8fa93c21d9',
      verifier: 'Mau-Mara Basin Hydrostatic Commission & WMO Global Hub',
      certaintyScore: 99.2
    });
  };

  const handleTriggerSoilDepletionAlert = () => {
    audioFeedback.playSubtleClick();
    notifyEcologicalAlert({
      title: 'Soil Nutrient Depletion Threshold Warning',
      claim: 'Soil Organic Carbon (SOC) falling below restorative threshold in Mara North communal pastures.',
      metricCategory: 'soil',
      metricName: 'Communal Rangeland Soil Organic Carbon (SOC)',
      thresholdValue: '2.10',
      actualValue: '1.82',
      unit: '%',
      severity: 'warning',
      hash: '0xsoil_depletion_warning_93fa88bc01',
      verifier: 'Savory Institute & Earth Observation Hyperspectral Satellite Array',
      certaintyScore: 98.6
    });
  };

  // Auto-alert check when user navigates to an ecological vulnerability state
  useEffect(() => {
    if (selectedYear === 2018 && !dismissedSentinelBreach) {
      notifyEcologicalAlert({
        title: 'Historical Baseline Critical Water Scarcity Detected',
        claim: '2018 Pre-Restoration Baseline data indicates sub-critical baseflow & severe aquifer depletion.',
        metricCategory: 'water',
        metricName: 'Sub-Basin Hydraulic Baseflow',
        thresholdValue: '4.50',
        actualValue: '3.40',
        unit: 'm³/s',
        severity: 'critical',
        hash: '0xbase2018_water_breach_historical',
        verifier: 'Historical Mara Watershed Baseline Commission',
        certaintyScore: 97.4
      });
    }
  }, [selectedYear, dismissedSentinelBreach]);

  return (
    <div className="min-h-screen bg-[#070A08] text-[#F5F5F0] p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Top Breadcrumb & Actions Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#C5A059]/30 pb-4">
        <div>
          <div className="flex items-center gap-2 text-[11px] font-mono text-[#C5A059] uppercase tracking-wider">
            <Globe2 className="w-3.5 h-3.5" />
            <span>Bioregional Operating System</span>
            <span className="text-[#F5F5F0]/30">/</span>
            <span className="text-emerald-400 font-bold">Real-time Ecological Ledger</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-white tracking-wide mt-1">
            Bioregional Ecological Ledger & Resource Flows
          </h1>
          <p className="text-xs sm:text-sm text-[#F5F5F0]/70 font-sans mt-0.5 max-w-3xl">
            Live metabolic telemetry, biophysical KPI grounding, and cryptographic data provenance for autonomous watershed stewardship.
          </p>
        </div>

        {/* Action Bar: Compare, Trend Analysis, Epistemic Sync, Forecasting, Report, Bioregion Selector */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Side-by-Side Comparison Mode Button */}
          <button
            onClick={() => {
              audioFeedback.playSubtleClick();
              setIsComparisonMode(!isComparisonMode);
            }}
            className={`px-3 py-2 rounded-lg font-mono font-bold text-xs flex items-center gap-1.5 transition-all shadow-md cursor-pointer border ${
              isComparisonMode
                ? 'bg-purple-600 text-white border-purple-300 shadow-[0_0_15px_rgba(168,85,247,0.4)]'
                : 'bg-[#101914] hover:bg-[#19241e] text-purple-300 border-purple-500/40'
            }`}
            title="Compare resource flow Sankey diagrams from two geographical regions side-by-side"
          >
            <Columns2 className="w-3.5 h-3.5 shrink-0" />
            <span>Compare Bioregions</span>
            <span className="text-[9px] bg-purple-950 text-purple-300 px-1.5 py-0.5 rounded font-mono uppercase font-bold border border-purple-500/30">
              Dual View
            </span>
          </button>

          {/* Trend Analysis (30d MA) Toggle Button */}
          <button
            onClick={() => {
              audioFeedback.playSubtleClick();
              setShowTrendAnalysis(!showTrendAnalysis);
            }}
            className={`px-3 py-2 rounded-lg font-mono font-bold text-xs flex items-center gap-1.5 transition-all shadow-md cursor-pointer border ${
              showTrendAnalysis
                ? 'bg-amber-500 text-black border-amber-300 shadow-[0_0_15px_rgba(245,158,11,0.4)]'
                : 'bg-[#101914] hover:bg-[#19241e] text-amber-300 border-amber-500/40'
            }`}
            title="Open 30-day moving average trend analysis and fluctuation early warning signals"
          >
            <Activity className="w-3.5 h-3.5 shrink-0" />
            <span>Trend Analysis</span>
            <span className="text-[9px] bg-amber-950 text-amber-300 px-1.5 py-0.5 rounded font-mono uppercase font-bold border border-amber-500/30">
              30d MA
            </span>
          </button>

          {/* Sync to Epistemic Ledger Button */}
          <button
            onClick={() => {
              audioFeedback.playSubtleClick();
              setShowEpistemicSyncModal(true);
            }}
            className="px-3 py-2 rounded-lg bg-emerald-950/90 hover:bg-emerald-900 text-emerald-300 border border-emerald-500/50 font-mono font-bold text-xs flex items-center gap-1.5 transition-all shadow-md cursor-pointer hover:shadow-[0_0_15px_rgba(16,185,129,0.35)]"
            title="Initiate blockchain transaction to cryptographically sign and store a snapshot of current resource flow state"
          >
            <Database className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span>Sync to Epistemic Ledger</span>
            <span className="text-[9px] bg-emerald-900/80 text-emerald-200 px-1.5 py-0.5 rounded font-mono uppercase font-bold border border-emerald-500/30">
              zk-Sign
            </span>
          </button>

          {/* Forecasting Overlay Toggle Button */}
          <button
            onClick={() => {
              audioFeedback.playSubtleClick();
              setShowForecastingOverlay(!showForecastingOverlay);
            }}
            className={`px-3 py-2 rounded-lg font-mono font-bold text-xs flex items-center gap-1.5 transition-all shadow-md cursor-pointer border ${
              showForecastingOverlay
                ? 'bg-cyan-500 text-black border-cyan-300 shadow-[0_0_15px_rgba(6,182,212,0.4)]'
                : 'bg-[#101914] hover:bg-[#19241e] text-cyan-300 border-cyan-500/40'
            }`}
            title="Toggle lightweight predictive forecasting overlay using historical trends"
          >
            <TrendingUp className="w-3.5 h-3.5 shrink-0" />
            <span>Forecasting Overlay</span>
            <span className="text-[9px] bg-cyan-950 text-cyan-300 px-1.5 py-0.5 rounded font-mono uppercase font-bold border border-cyan-500/30">
              2026-35
            </span>
          </button>

          {/* Bioregional Export Controller Button */}
          <button
            onClick={() => {
              audioFeedback.playSubtleClick();
              setShowExportController(true);
            }}
            className="px-3 py-2 rounded-lg bg-[#141E18] hover:bg-[#1E2B23] text-emerald-300 border border-emerald-500/50 font-mono font-bold text-xs flex items-center gap-1.5 transition-all shadow-md cursor-pointer hover:shadow-[0_0_15px_rgba(16,185,129,0.3)]"
            title="Export raw, cleaned, or aggregated bioregional data in CSV, JSON, or GeoJSON with cryptographic provenance"
          >
            <Download className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span>Export Controller</span>
            <span className="text-[9px] bg-emerald-950 text-emerald-300 px-1.5 py-0.5 rounded font-mono uppercase font-bold border border-emerald-500/30">
              CSV/JSON/Geo
            </span>
          </button>

          {/* Download Verified Report Button */}
          <button
            onClick={handleDownloadReport}
            disabled={isGeneratingReport}
            className="px-3 py-2 rounded-lg bg-[#C5A059] hover:bg-[#D4AF37] text-black font-mono font-bold text-xs flex items-center gap-1.5 transition-all shadow-md cursor-pointer disabled:opacity-50 hover:shadow-[0_0_15px_rgba(197,160,89,0.35)]"
            title="Generate signed cryptographic PDF summary of current ecological health metrics"
          >
            <Download className="w-3.5 h-3.5 shrink-0" />
            <span>{isGeneratingReport ? 'Compiling PDF...' : 'Download Verified Report'}</span>
            <span className="text-[9px] bg-black/20 text-black px-1.5 py-0.5 rounded font-mono uppercase font-bold">
              Signed PDF
            </span>
          </button>

          {/* Region Switcher */}
          <div className="flex items-center gap-2 bg-[#101511] border border-[#C5A059]/50 rounded-lg px-2.5 py-1.5">
            <label htmlFor="bioregion-select" className="text-xs font-mono text-[#F5F5F0]/60 shrink-0">
              Bioregion:
            </label>
            <select
              id="bioregion-select"
              value={selectedRegionId}
              onChange={(e) => {
                audioFeedback.playSubtleClick();
                setSelectedRegionId(e.target.value);
              }}
              className="bg-transparent text-xs font-mono text-[#C5A059] focus:outline-none cursor-pointer"
            >
              {Object.values(BIOREGIONAL_LEDGER_REGIONS).map((reg) => (
                <option key={reg.regionId} value={reg.regionId} className="bg-[#0A0D0B] text-white">
                  {reg.regionName}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Regional Vital Statistics Bar with Dynamic Temporal Values */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 font-mono">
        <div className="p-3 rounded-xl bg-[#0D120E] border border-emerald-500/30">
          <div className="text-[10px] uppercase text-emerald-400 font-bold flex items-center gap-1.5">
            <ShieldCheck className="w-3 h-3" />
            Flourishing Score
          </div>
          <div className="text-xl sm:text-2xl font-bold text-white mt-1 flex items-baseline gap-1.5">
            <span>{displayFlourishingScore}</span>
            <span className="text-xs font-normal text-emerald-400">/100</span>
            {selectedYear !== 2018 && (
              <span className="text-[10px] text-emerald-400 font-bold">
                +{(((Number(displayFlourishingScore) - 64.2) / 64.2) * 100).toFixed(0)}%
              </span>
            )}
          </div>
          <div className="text-[9px] text-[#F5F5F0]/50 mt-0.5">
            {selectedYear === 2026 ? 'Live Vitality Index' : `${selectedYear} Epoch Value`}
          </div>
        </div>

        <div className="p-3 rounded-xl bg-[#0D120E] border border-cyan-500/30">
          <div className="text-[10px] uppercase text-cyan-400 font-bold flex items-center gap-1.5">
            <Droplets className="w-3 h-3" />
            Water Yield
          </div>
          <div className="text-xl sm:text-2xl font-bold text-white mt-1">
            {displayWaterYield}M
            <span className="text-xs font-normal text-cyan-400"> m³/yr</span>
          </div>
          <div className="text-[9px] text-[#F5F5F0]/50 mt-0.5">Baseflow & Aquifer Recharge</div>
        </div>

        <div className="p-3 rounded-xl bg-[#0D120E] border border-amber-500/30">
          <div className="text-[10px] uppercase text-amber-400 font-bold flex items-center gap-1.5">
            <Layers className="w-3 h-3" />
            Carbon Sinks
          </div>
          <div className="text-xl sm:text-2xl font-bold text-white mt-1">
            {displayCarbonRate}k
            <span className="text-xs font-normal text-amber-400"> tCO2e/yr</span>
          </div>
          <div className="text-[9px] text-[#F5F5F0]/50 mt-0.5">Living Humus & Biomass Sink</div>
        </div>

        <div className="p-3 rounded-xl bg-[#0D120E] border border-purple-500/30">
          <div className="text-[10px] uppercase text-purple-400 font-bold flex items-center gap-1.5">
            <HeartHandshake className="w-3 h-3" />
            Steward Councils
          </div>
          <div className="text-xl sm:text-2xl font-bold text-white mt-1">
            {activeRegion.activeStewardAssembliesCount}
            <span className="text-xs font-normal text-purple-400"> Active</span>
          </div>
          <div className="text-[9px] text-[#F5F5F0]/50 mt-0.5">Community Assemblies</div>
        </div>

        <div className="p-3 rounded-xl bg-[#0D120E] border border-[#C5A059]/40 col-span-2 sm:col-span-1">
          <div className="text-[10px] uppercase text-[#C5A059] font-bold flex items-center gap-1.5">
            <TreePine className="w-3 h-3" />
            Custodial Territory
          </div>
          <div className="text-xl sm:text-2xl font-bold text-white mt-1">
            {(activeRegion.totalAreaHectares / 1000).toFixed(0)}k
            <span className="text-xs font-normal text-[#C5A059]"> ha</span>
          </div>
          <div className="text-[9px] text-[#F5F5F0]/50 mt-0.5 truncate">{activeRegion.biomeType}</div>
        </div>
      </div>

      {/* SIDE-BY-SIDE CROSS-REGIONAL COMPARISON VIEW */}
      {isComparisonMode && (
        <BioregionalComparisonView
          initialRegionIdA={selectedRegionId}
          initialRegionIdB={selectedRegionId === 'aberdare-cloud-forest' ? 'mara-serengeti' : 'aberdare-cloud-forest'}
          onInspectProvenance={onInspectProvenance}
          onClose={() => setIsComparisonMode(false)}
        />
      )}

      {/* 30-DAY MOVING AVERAGE TREND ANALYSIS OVERLAY */}
      {showTrendAnalysis && (
        <BioregionalTrendAnalysisOverlay
          region={activeRegion}
          onClose={() => setShowTrendAnalysis(false)}
          onTriggerEcologicalAlert={notifyEcologicalAlert}
        />
      )}

      {/* EPISTEMIC LEDGER CRYPTOGRAPHIC SNAPSHOT MODAL */}
      {showEpistemicSyncModal && (
        <EpistemicSyncModal
          region={activeRegion}
          epochYear={selectedYear}
          flourishingScore={+displayFlourishingScore}
          waterYieldM3={+displayWaterYield * 1000000}
          carbonRateTonnes={+displayCarbonRate * 1000}
          onClose={() => setShowEpistemicSyncModal(false)}
          onSnapshotCreated={(snap) => {
            setSyncedSnapshots((prev) => [snap, ...prev]);
            notifyVerified({
              title: 'Epistemic Ledger Synced',
              claim: `Resource flow snapshot signed and stored in Block #${snap.blockNumber}.`,
              hash: snap.txHash,
              verifier: 'Section 30 Epistemic Consensus Layer',
              certaintyScore: 99.9,
              telemetrySource: 'Multi-sig Oracle Attestation (Mara Basin Commission, Savory Inst, WMO)'
            });
          }}
          syncedHistory={syncedSnapshots}
        />
      )}

      {/* PREDICTIVE FORECASTING OVERLAY */}
      {showForecastingOverlay && (
        <BioregionalForecastingOverlay
          region={activeRegion}
          onClose={() => setShowForecastingOverlay(false)}
          onApplyProjectedEpoch={(year, simulatedScore, waterMult, carbonMult) => {
            setProjectedDataState({ year, score: simulatedScore, waterMult, carbonMult });
            setSelectedYear(year);
            notifyVerified({
              title: `Projected Epoch ${year} Applied`,
              claim: `Ledger dynamically calibrated to projected ${simulatedScore}/100 flourishing state.`,
              hash: `0xproj_${year}_${Math.random().toString(16).substring(2, 10)}`,
              verifier: 'Bioregional Autoregressive Forecasting System',
              certaintyScore: +(100 - (year - 2026) * 1.8).toFixed(1),
              telemetrySource: 'Multi-decadal trend extrapolation + real-time metabolic dynamics'
            });
          }}
        />
      )}

      {/* BIOREGIONAL EXPORT CONTROLLER MODAL */}
      {showExportController && (
        <BioregionalExportControllerModal
          region={activeRegion}
          epochYear={selectedYear}
          flourishingScore={+displayFlourishingScore}
          waterYieldM3={+displayWaterYield * 1000000}
          carbonRateTonnes={+displayCarbonRate * 1000}
          onClose={() => setShowExportController(false)}
        />
      )}

      {/* REAL-TIME ECOLOGICAL ALERT SENTINEL & THRESHOLD WATCH */}
      <div className="p-3.5 sm:p-4 rounded-xl bg-[#0B0F0C] border border-amber-500/30 flex flex-col md:flex-row md:items-center justify-between gap-3 font-mono text-xs">
        <div className="flex items-center gap-2.5">
          <span className="p-2 rounded-lg bg-amber-950/60 text-amber-400 border border-amber-500/40 shrink-0">
            <BellRing className="w-4 h-4 animate-pulse" />
          </span>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-serif font-bold text-white tracking-wide">
                Ecological Sentinel & Critical Threshold Watch
              </span>
              <span className="px-2 py-0.5 rounded text-[9px] font-bold uppercase bg-emerald-950 text-emerald-400 border border-emerald-500/40">
                Active In-Situ Mesh
              </span>
              <span className="text-[10px] text-neutral-400">
                • 5 Monitored Biophysical Boundaries
              </span>
            </div>
            <div className="text-[11px] text-[#F5F5F0]/70 font-sans mt-0.5 flex flex-wrap items-center gap-3">
              <span>Water Baseflow: <strong className="text-cyan-400 font-mono">Nominal ({'>'}4.5 m³/s)</strong></span>
              <span>Soil Organic Carbon: <strong className="text-emerald-400 font-mono">Nominal ({'>'}2.10%)</strong></span>
              <span>Aquifer Head: <strong className="text-[#C5A059] font-mono">Restoring (+3.8m)</strong></span>
            </div>
          </div>
        </div>

        {/* Sentinel Test Triggers */}
        <div className="flex items-center gap-2 self-start md:self-auto shrink-0 flex-wrap">
          <span className="text-[10px] text-neutral-400 font-bold uppercase hidden lg:inline">
            Simulate Alert:
          </span>
          <button
            onClick={handleTriggerWaterScarcityAlert}
            className="px-2.5 py-1.5 rounded-lg bg-rose-950/80 hover:bg-rose-900 text-rose-300 border border-rose-500/40 text-[11px] font-bold flex items-center gap-1.5 cursor-pointer transition-all shadow"
            title="Simulate critical water scarcity threshold breach toast alert"
          >
            <AlertTriangle className="w-3 h-3 text-rose-400" />
            <span>Water Scarcity Alert</span>
          </button>

          <button
            onClick={handleTriggerSoilDepletionAlert}
            className="px-2.5 py-1.5 rounded-lg bg-amber-950/80 hover:bg-amber-900 text-amber-300 border border-amber-500/40 text-[11px] font-bold flex items-center gap-1.5 cursor-pointer transition-all shadow"
            title="Simulate soil nutrient depletion threshold warning toast alert"
          >
            <ShieldAlert className="w-3 h-3 text-amber-400" />
            <span>Soil Depletion Warning</span>
          </button>
        </div>
      </div>

      {/* TIME-SLIDER CONTROL: Historical Baseline to Live Telemetry */}
      <div className="p-4 sm:p-5 rounded-2xl bg-[#0B0F0C] border border-[#C5A059]/30 shadow-xl space-y-3 font-mono">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <span className="p-1.5 rounded-lg bg-[#C5A059]/15 text-[#C5A059] border border-[#C5A059]/30">
              <History className="w-4 h-4" />
            </span>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs sm:text-sm font-serif font-bold text-white tracking-wide">
                  Regeneration Baseline Time-Slider
                </span>
                {selectedYear === 2026 ? (
                  <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-950/80 text-emerald-300 border border-emerald-500/40 text-[10px] font-bold">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
                    Live Telemetry (2026)
                  </span>
                ) : selectedYear === 2018 ? (
                  <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-950/80 text-amber-300 border border-amber-500/40 text-[10px] font-bold">
                    <AlertCircle className="w-3 h-3" />
                    2018 Pre-Restoration Baseline
                  </span>
                ) : (
                  <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-cyan-950/80 text-cyan-300 border border-cyan-500/40 text-[10px] font-bold">
                    <Calendar className="w-3 h-3" />
                    Historical Epoch: {currentEpoch.label} ({selectedYear})
                  </span>
                )}
              </div>
              <p className="text-[11px] text-[#F5F5F0]/65 font-sans mt-0.5">
                Scrub temporal timeline to observe multi-year ecological restoration and verify baseline recovery deltas.
              </p>
            </div>
          </div>

          {/* Autoplay & Quick Jump Controls */}
          <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
            <button
              onClick={() => {
                audioFeedback.playSubtleClick();
                setIsPlayingTimeline(!isPlayingTimeline);
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 border ${
                isPlayingTimeline
                  ? 'bg-purple-600 text-white border-purple-400 shadow-[0_0_10px_rgba(168,85,247,0.4)]'
                  : 'bg-[#161D18] hover:bg-[#202922] text-[#F5F5F0] border-[#F5F5F0]/20'
              }`}
              title="Automate timeline progression through historical restoration milestones"
            >
              {isPlayingTimeline ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
              <span>{isPlayingTimeline ? 'Pause Time-Lapse' : 'Play Time-Lapse'}</span>
            </button>

            {selectedYear !== 2026 && (
              <button
                onClick={() => {
                  audioFeedback.playSubtleClick();
                  setIsPlayingTimeline(false);
                  setSelectedYear(2026);
                }}
                className="px-2.5 py-1.5 rounded-lg bg-emerald-950 hover:bg-emerald-900 text-emerald-300 border border-emerald-500/40 text-xs font-bold flex items-center gap-1 cursor-pointer transition-all"
                title="Return to real-time live telemetry"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Return to Live</span>
              </button>
            )}
          </div>
        </div>

        {/* Time Slider Range Input */}
        <div className="space-y-2 pt-1">
          <div className="relative flex items-center">
            <input
              type="range"
              min="2018"
              max="2026"
              step="1"
              value={selectedYear}
              onChange={(e) => {
                setIsPlayingTimeline(false);
                setSelectedYear(Number(e.target.value));
              }}
              className="w-full h-2.5 bg-[#162019] rounded-lg appearance-none cursor-pointer accent-[#C5A059] focus:outline-none"
            />
          </div>

          {/* Epoch Landmark Pills */}
          <div className="grid grid-cols-5 gap-1 pt-1">
            {HISTORICAL_TIMELINE_EPOCHS.map((epoch) => {
              const isSelected = selectedYear === epoch.year;
              return (
                <button
                  key={epoch.year}
                  onClick={() => {
                    audioFeedback.playSubtleClick();
                    setIsPlayingTimeline(false);
                    setSelectedYear(epoch.year);
                  }}
                  className={`py-1.5 px-1 rounded-lg text-center transition-all cursor-pointer border ${
                    isSelected
                      ? epoch.year === 2026
                        ? 'bg-emerald-950 text-emerald-300 border-emerald-500/80 shadow-md font-bold'
                        : epoch.year === 2018
                        ? 'bg-amber-950 text-amber-300 border-amber-500/80 shadow-md font-bold'
                        : 'bg-cyan-950 text-cyan-300 border-cyan-500/80 shadow-md font-bold'
                      : 'bg-[#101612] hover:bg-[#18201b] text-[#F5F5F0]/60 border-[#F5F5F0]/10'
                  }`}
                >
                  <div className="text-[11px] sm:text-xs font-bold">{epoch.year}</div>
                  <div className="text-[8px] sm:text-[9px] uppercase tracking-tighter truncate">
                    {epoch.year === 2018 ? 'Baseline' : epoch.year === 2026 ? 'Live Now' : epoch.label.split(' ')[0]}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Active Epoch Narrative Card */}
        <div className="p-3 rounded-xl bg-[#070A08] border border-[#F5F5F0]/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-[10px] uppercase font-bold text-[#C5A059]">
                {currentEpoch.label} ({selectedYear})
              </span>
              <span className="text-[9px] text-[#F5F5F0]/40">•</span>
              <span className="text-[10px] text-[#F5F5F0]/70 font-sans">
                {currentEpoch.description}
              </span>
            </div>

            {/* Key Milestone & Audit Standard Badges */}
            <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
              <span className="px-2 py-0.5 rounded bg-[#121914] text-[9px] text-white border border-[#F5F5F0]/15 flex items-center gap-1 font-mono font-bold">
                <Check className="w-2.5 h-2.5 text-emerald-400" />
                {currentEpoch.title}
              </span>
              <span className="px-2 py-0.5 rounded bg-emerald-950/60 text-[9px] text-emerald-300 border border-emerald-500/30 flex items-center gap-1 font-mono">
                <ShieldCheck className="w-2.5 h-2.5 text-emerald-400" />
                Standard: {currentEpoch.auditStandard}
              </span>
            </div>
          </div>

          <div className="shrink-0 font-mono text-right text-[11px]">
            <div className="text-[#C5A059] font-bold">
              Index: {currentEpoch.compositeFlourishingScore} / 100
            </div>
            <div className="text-[9px] text-[#F5F5F0]/50">
              Water Factor: {(currentEpoch.waterYieldMultiplier * 100).toFixed(0)}%
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center justify-between border-b border-[#F5F5F0]/15 pb-2 overflow-x-auto gap-2">
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              audioFeedback.playSubtleClick();
              setActiveTab('metrics');
            }}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-mono font-bold uppercase transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'metrics'
                ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/50 shadow'
                : 'text-[#F5F5F0]/60 hover:text-white'
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            <span>Ecological Health Metrics ({activeRegion.metrics.length})</span>
          </button>

          <button
            onClick={() => {
              audioFeedback.playSubtleClick();
              setActiveTab('flows');
            }}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-mono font-bold uppercase transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'flows'
                ? 'bg-cyan-950 text-cyan-300 border border-cyan-500/50 shadow'
                : 'text-[#F5F5F0]/60 hover:text-white'
            }`}
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Resource Flows & Metabolic Cycles ({activeRegion.resourceFlows.length})</span>
          </button>

          <button
            onClick={() => {
              audioFeedback.playSubtleClick();
              setActiveTab('impact_map');
            }}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-mono font-bold uppercase transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'impact_map'
                ? 'bg-[#C5A059]/20 text-[#C5A059] border border-[#C5A059]/50 shadow'
                : 'text-[#F5F5F0]/60 hover:text-white'
            }`}
          >
            <Globe2 className="w-3.5 h-3.5" />
            <span>Spatial Reach & Causal Map</span>
          </button>

          <button
            onClick={() => {
              audioFeedback.playSubtleClick();
              setActiveTab('planner');
            }}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-mono font-bold uppercase transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'planner'
                ? 'bg-cyan-950 text-cyan-300 border border-cyan-500/50 shadow'
                : 'text-[#F5F5F0]/60 hover:text-white'
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>Allocation Planner</span>
          </button>

          <button
            onClick={() => {
              audioFeedback.playSubtleClick();
              setActiveTab('peer_benchmark');
            }}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-mono font-bold uppercase transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'peer_benchmark'
                ? 'bg-[#C5A059]/20 text-[#C5A059] border border-[#C5A059]/50 shadow'
                : 'text-[#F5F5F0]/60 hover:text-white'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Peer Comparison</span>
          </button>

          <button
            onClick={() => {
              audioFeedback.playSubtleClick();
              setActiveTab('simulator');
            }}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-mono font-bold uppercase transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'simulator'
                ? 'bg-purple-950 text-purple-300 border border-purple-500/50 shadow'
                : 'text-[#F5F5F0]/60 hover:text-white'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Stress Simulator</span>
          </button>
        </div>

        {/* Data Provenance Badge */}
        <div className="hidden sm:flex items-center gap-1.5 text-[10px] font-mono text-[#C5A059]">
          <Database className="w-3 h-3" />
          <span>Section 30 Epistemic Standard Active</span>
        </div>
      </div>

      {/* TAB 1: ECOLOGICAL HEALTH METRICS */}
      {activeTab === 'metrics' && (
        <div className="space-y-4">
          {/* Filter Bar */}
          <div className="flex items-center justify-between gap-2 flex-wrap text-xs font-mono">
            <div className="flex items-center gap-1 bg-[#0D120E] p-1 rounded-lg border border-[#F5F5F0]/10">
              {(['all', 'water', 'soil', 'canopy', 'biodiversity'] as const).map((cat) => (
                <button
                  key={cat}
                  onClick={() => {
                    audioFeedback.playSubtleClick();
                    setMetricFilter(cat);
                  }}
                  className={`px-2.5 py-1 rounded text-[10px] uppercase font-bold transition-all cursor-pointer ${
                    metricFilter === cat
                      ? 'bg-emerald-500 text-black font-bold shadow'
                      : 'text-[#F5F5F0]/60 hover:text-white'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className="text-[10px] font-mono text-[#F5F5F0]/60">
              Showing {filteredMetrics.length} real-time verified parameters
            </div>
          </div>

          {/* Metric Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredMetrics.map((metric) => (
              <div
                key={metric.id}
                className="bg-[#0A0D0B] border border-emerald-500/30 hover:border-emerald-400/60 rounded-xl p-4 transition-all shadow-lg flex flex-col justify-between space-y-3"
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-[9px] font-mono uppercase px-1.5 py-0.2 rounded bg-emerald-950 text-emerald-300 border border-emerald-500/40 font-bold">
                          {metric.category}
                        </span>
                        <span className="text-[9px] font-mono text-[#C5A059] font-bold">
                          {metric.confidenceScore}% Certainty
                        </span>
                      </div>
                      <h3 className="text-base font-serif font-bold text-white mt-1">
                        {metric.name}
                      </h3>
                    </div>

                    <div className="text-right font-mono">
                      <div className="text-xl font-bold text-emerald-400">
                        {metric.currentValue}{' '}
                        <span className="text-xs text-[#F5F5F0]/60 font-normal">{metric.unit}</span>
                      </div>
                      <div className="text-[9px] text-emerald-500 flex items-center justify-end gap-0.5">
                        <TrendingUp className="w-2.5 h-2.5" />
                        <span>+{metric.deltaPct}% vs Baseline</span>
                      </div>
                    </div>
                  </div>

                  {/* Progress vs Target */}
                  <div className="mt-3 space-y-1 font-mono text-[10px]">
                    <div className="flex justify-between text-[#F5F5F0]/60">
                      <span>Baseline: {metric.baselineValue} {metric.unit}</span>
                      <span>Target: {metric.targetValue} {metric.unit}</span>
                    </div>
                    <div className="w-full bg-[#131A14] h-2 rounded-full overflow-hidden border border-[#F5F5F0]/10">
                      <div
                        className="bg-gradient-to-r from-emerald-600 via-emerald-400 to-[#C5A059] h-full rounded-full transition-all duration-500"
                        style={{
                          width: `${Math.min(100, Math.max(10, (metric.currentValue / metric.targetValue) * 100))}%`
                        }}
                      />
                    </div>
                  </div>

                  {/* Telemetry Sensor Metadata */}
                  <div className="mt-3 pt-2.5 border-t border-[#F5F5F0]/10 flex items-center justify-between text-[10px] font-mono text-[#F5F5F0]/60">
                    <div className="flex items-center gap-1.5">
                      <Cpu className="w-3 h-3 text-emerald-400" />
                      <span>{metric.sensorMeshNodesCount} In-situ Sensor Nodes</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-2.5 h-2.5" />
                      <span>Updated {metric.lastUpdatedMinutesAgo}m ago</span>
                    </div>
                  </div>
                </div>

                {/* Provenance & Verification Actions */}
                <div className="pt-2 border-t border-[#F5F5F0]/10 flex items-center justify-between gap-2">
                  <div className="text-[9px] font-mono text-neutral-400 truncate max-w-[200px]">
                    Hash: {metric.provenance.cryptographicHash.slice(0, 10)}...
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      onClick={() => handleVerifyMetric(metric)}
                      disabled={verifyingId === metric.id}
                      className="px-2 py-1 rounded bg-emerald-950 hover:bg-emerald-900 text-emerald-300 border border-emerald-500/40 text-[10px] font-mono font-bold flex items-center gap-1 transition-all cursor-pointer disabled:opacity-50"
                      title="Verify signature against blockchain ledger"
                    >
                      <ShieldCheck className={`w-3 h-3 ${verifyingId === metric.id ? 'animate-spin' : ''}`} />
                      <span>{verifyingId === metric.id ? 'Verifying...' : 'Verify'}</span>
                    </button>

                    <button
                      onClick={() => {
                        audioFeedback.playSubtleClick();
                        onInspectProvenance(metric.provenance);
                      }}
                      className="px-2 py-1 rounded bg-[#1C1F1D] hover:bg-[#2A2E2B] text-[#C5A059] border border-[#C5A059]/40 text-[10px] font-mono font-bold flex items-center gap-1 transition-all cursor-pointer"
                      title="Inspect complete epistemic data lineage"
                    >
                      <Database className="w-3 h-3" />
                      <span>Lineage</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: RESOURCE FLOWS & METABOLIC CYCLES */}
      {activeTab === 'flows' && (
        <div className="space-y-6">
          {/* Sub-Header & Layout Mode Toggle */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-xl bg-[#0D120E] border border-cyan-500/30 text-xs font-sans text-[#F5F5F0]/80">
            <div>
              <h3 className="font-serif font-bold text-white text-base mb-1 flex items-center gap-2">
                <RefreshCw className="w-4 h-4 text-cyan-400" />
                Bioregional Metabolic Circulation & Sankey Flow Mesh
              </h3>
              <p className="text-xs text-[#F5F5F0]/70 font-sans">
                Real-time tracking of biophysical throughput across freshwater conduits, microgrid renewable kilowatt-hours, and living soil carbon sinks.
              </p>
            </div>

            {/* View Mode Toggle */}
            <div className="flex items-center gap-1 bg-[#162019] p-1 rounded-lg border border-cyan-500/20 shrink-0 self-start sm:self-auto font-mono text-xs">
              <button
                onClick={() => {
                  audioFeedback.playSubtleClick();
                  setFlowViewMode('both');
                }}
                className={`px-3 py-1 rounded text-[11px] font-bold transition-all cursor-pointer ${
                  flowViewMode === 'both'
                    ? 'bg-cyan-500 text-black shadow'
                    : 'text-[#F5F5F0]/60 hover:text-white'
                }`}
              >
                Unified View
              </button>
              <button
                onClick={() => {
                  audioFeedback.playSubtleClick();
                  setFlowViewMode('sankey');
                }}
                className={`px-3 py-1 rounded text-[11px] font-bold transition-all cursor-pointer ${
                  flowViewMode === 'sankey'
                    ? 'bg-cyan-500 text-black shadow'
                    : 'text-[#F5F5F0]/60 hover:text-white'
                }`}
              >
                D3 Sankey
              </button>
              <button
                onClick={() => {
                  audioFeedback.playSubtleClick();
                  setFlowViewMode('cards');
                }}
                className={`px-3 py-1 rounded text-[11px] font-bold transition-all cursor-pointer ${
                  flowViewMode === 'cards'
                    ? 'bg-cyan-500 text-black shadow'
                    : 'text-[#F5F5F0]/60 hover:text-white'
                }`}
              >
                Ledger Cards
              </button>
            </div>
          </div>

          {/* D3-BASED SANKEY DIAGRAM COMPONENT */}
          {flowViewMode !== 'cards' && (
            <BioregionalSankeyFlows
              region={activeRegion}
              selectedYear={selectedYear}
              onInspectProvenance={onInspectProvenance}
            />
          )}

          {/* CRYPTOGRAPHIC FLOW LEDGER CARDS */}
          {flowViewMode !== 'sankey' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs font-mono text-[#F5F5F0]/70 px-1">
                <span className="uppercase font-bold text-cyan-400">
                  Individual Flow Provenance Records ({activeRegion.resourceFlows.length})
                </span>
                <span>Calibrated vs {selectedYear} Timeline Epoch</span>
              </div>

              {activeRegion.resourceFlows.map((flow) => {
                const scaledFlowRate = +(flow.flowRate * temporalProgress).toFixed(1);
                return (
                  <div
                    key={flow.id}
                    className="bg-[#0A0D0B] border border-cyan-500/30 hover:border-cyan-400/60 rounded-xl p-4 transition-all shadow-md space-y-3"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-[9px] font-mono uppercase px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-500/40 font-bold">
                            {flow.category} Circulation
                          </span>
                          <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-500/40 font-bold">
                            {flow.circularityPct}% Circular
                          </span>
                          <span className="text-[9px] font-mono text-[#F5F5F0]/50">
                            Block #{flow.lastProofBlock}
                          </span>
                        </div>
                        <h4 className="text-base font-serif font-bold text-white mt-1">
                          {flow.title}
                        </h4>
                      </div>

                      <div className="text-right font-mono shrink-0">
                        <div className="text-lg font-bold text-cyan-300">
                          {scaledFlowRate} {flow.flowUnit}
                        </div>
                        <div className="text-[9px] text-emerald-400 uppercase font-bold">
                          Velocity: {flow.flowVelocity}
                        </div>
                      </div>
                    </div>

                    {/* Metabolic Node Flow Diagram */}
                    <div className="p-3 rounded-lg bg-[#0F1410] border border-[#F5F5F0]/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-mono">
                      <div className="p-2 rounded bg-[#090C0A] border border-cyan-500/20 w-full sm:w-5/12 text-center sm:text-left">
                        <div className="text-[8px] text-[#F5F5F0]/50 uppercase">Origin Source Node</div>
                        <div className="font-bold text-white mt-0.5 truncate">{flow.sourceNode}</div>
                      </div>

                      <div className="flex items-center justify-center gap-1.5 text-cyan-400 shrink-0">
                        <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping"></span>
                        <ArrowRight className="w-4 h-4" />
                        <span className="text-[10px] font-bold">{flow.circularityPct}%</span>
                      </div>

                      <div className="p-2 rounded bg-[#090C0A] border border-emerald-500/20 w-full sm:w-5/12 text-center sm:text-right">
                        <div className="text-[8px] text-[#F5F5F0]/50 uppercase">Terminal Sink / Return</div>
                        <div className="font-bold text-white mt-0.5 truncate">{flow.targetNode}</div>
                      </div>
                    </div>

                    <p className="text-xs text-[#F5F5F0]/70 font-sans leading-relaxed">
                      {flow.description}
                    </p>

                    {/* Verification & Lineage Bar */}
                    <div className="pt-2 border-t border-[#F5F5F0]/10 flex items-center justify-between gap-2 text-xs font-mono">
                      <span className="text-[10px] text-neutral-400 truncate">
                        Proof: {flow.provenance.cryptographicHash}
                      </span>

                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          onClick={() => handleVerifyFlow(flow)}
                          disabled={verifyingId === flow.id}
                          className="px-2.5 py-1 rounded bg-cyan-950 hover:bg-cyan-900 text-cyan-300 border border-cyan-500/40 text-[10px] font-bold flex items-center gap-1 cursor-pointer transition-all disabled:opacity-50"
                        >
                          <ShieldCheck className="w-3 h-3" />
                          <span>{verifyingId === flow.id ? 'Anchoring...' : 'Verify Proof'}</span>
                        </button>

                        <button
                          onClick={() => {
                            audioFeedback.playSubtleClick();
                            onInspectProvenance(flow.provenance);
                          }}
                          className="px-2.5 py-1 rounded bg-[#1C1F1D] hover:bg-[#2A2E2B] text-[#C5A059] border border-[#C5A059]/40 text-[10px] font-bold flex items-center gap-1 cursor-pointer transition-all"
                        >
                          <Database className="w-3 h-3" />
                          <span>Lineage</span>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* TAB 3: SPATIAL REACH & ECOLOGICAL HOTSPOTS MAP */}
      {activeTab === 'impact_map' && (
        <div className="space-y-4 font-mono">
          {/* Spatial Layer Switcher */}
          <div className="p-3 rounded-xl bg-[#0B100C] border border-[#F5F5F0]/15 flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-rose-950/80 text-rose-400 border border-rose-500/40 shrink-0">
                <ShieldAlert className="w-4 h-4" />
              </span>
              <div>
                <span className="font-serif font-bold text-white text-sm">
                  Geospatial Intelligence & Scarcity Diagnostics
                </span>
                <span className="text-[10px] text-neutral-400 block font-sans">
                  Switch between 60fps canvas-rendered biophysical scarcity zones and multi-node causal reach networks.
                </span>
              </div>
            </div>

            {/* Sub-view switcher */}
            <div className="flex items-center gap-1.5 bg-[#121914] p-1 rounded-lg border border-[#F5F5F0]/10">
              <button
                onClick={() => {
                  audioFeedback.playSubtleClick();
                  setMapSubView('hotspots');
                }}
                className={`px-3 py-1 rounded text-[10px] font-bold transition-all cursor-pointer ${
                  mapSubView === 'hotspots'
                    ? 'bg-rose-500 text-black shadow font-extrabold'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                Ecological Hotspots (Canvas Layer)
              </button>

              <button
                onClick={() => {
                  audioFeedback.playSubtleClick();
                  setMapSubView('causal');
                }}
                className={`px-3 py-1 rounded text-[10px] font-bold transition-all cursor-pointer ${
                  mapSubView === 'causal'
                    ? 'bg-[#C5A059] text-black shadow font-extrabold'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                Causal Impact Network Map
              </button>

              <button
                onClick={() => {
                  audioFeedback.playSubtleClick();
                  setMapSubView('both');
                }}
                className={`px-3 py-1 rounded text-[10px] font-bold transition-all cursor-pointer ${
                  mapSubView === 'both'
                    ? 'bg-purple-600 text-white shadow font-extrabold'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                Dual Spatial View
              </button>
            </div>
          </div>

          {/* Render Views based on mapSubView */}
          {(mapSubView === 'hotspots' || mapSubView === 'both') && (
            <div className="space-y-2">
              {mapSubView === 'both' && (
                <div className="text-[11px] font-bold text-rose-400 uppercase flex items-center gap-1.5">
                  <ShieldAlert className="w-3.5 h-3.5" />
                  Layer A: Real-Time Scarcity Zones (Canvas Overlay)
                </div>
              )}
              <EcologicalHotspotsCanvas />
            </div>
          )}

          {(mapSubView === 'causal' || mapSubView === 'both') && (
            <div className="space-y-2">
              {mapSubView === 'both' && (
                <div className="text-[11px] font-bold text-[#C5A059] uppercase flex items-center gap-1.5 pt-2">
                  <Globe2 className="w-3.5 h-3.5" />
                  Layer B: Causal Bioregional Node Network
                </div>
              )}
              <MissionImpactMap onInspectProvenance={onInspectProvenance} />
            </div>
          )}
        </div>
      )}

      {/* TAB 4: RESOURCE ALLOCATION PLANNER & WHAT-IF SIMULATOR */}
      {activeTab === 'planner' && (
        <ResourceAllocationPlanner
          region={activeRegion}
          onApplyScenario={(projectedScore, waterMult, carbonMult, summaryTitle) => {
            setProjectedDataState({
              year: 2030,
              score: projectedScore,
              waterMult,
              carbonMult
            });
            notifyVerified({
              title: `Scenario Applied: ${summaryTitle}`,
              claim: `Reallocation model projected flourishing to ${projectedScore}/100 with ${(waterMult * 100).toFixed(0)}% water flow and ${(carbonMult * 100).toFixed(0)}% carbon sink.`,
              hash: `0xplan_${Math.random().toString(16).substring(2, 12)}`,
              verifier: 'Bioregional Allocation Optimization Engine',
              certaintyScore: 98.4,
              telemetrySource: 'Closed-loop thermodynamic mass-balance validation'
            });
          }}
        />
      )}

      {/* TAB 5: REGENERATIVE PEER COMPARISON BENCHMARK */}
      {activeTab === 'peer_benchmark' && (
        <RegenerativePeerComparison
          region={activeRegion}
          flourishingScore={+displayFlourishingScore}
          waterYieldM3={+displayWaterYield * 1000000}
          carbonRateTonnes={+displayCarbonRate * 1000}
        />
      )}

      {/* TAB 6: REGENERATIVE STRESS SIMULATOR */}
      {activeTab === 'simulator' && (
        <div className="space-y-6">
          <div className="p-4 rounded-xl bg-[#140F1E] border border-purple-500/40 space-y-2">
            <h3 className="font-serif font-bold text-white text-base flex items-center gap-2">
              <Sliders className="w-4 h-4 text-purple-400" />
              Bioregional Stress & Regeneration Counterfactual Engine
            </h3>
            <p className="text-xs text-[#F5F5F0]/80 font-sans">
              Adjust macro-climatic conditions and restorative land management practices to inspect real-time ecological health impacts across the basin.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* Slider 1: Monsoonal Rainfall Anomaly */}
            <div className="p-4 rounded-xl bg-[#0A0D0B] border border-cyan-500/30 space-y-3 font-mono">
              <div className="flex justify-between items-center text-xs">
                <span className="text-cyan-400 font-bold flex items-center gap-1.5">
                  <Droplets className="w-3.5 h-3.5" />
                  Precipitation & Monsoon Anomaly
                </span>
                <span className="font-bold text-white">{simRainfallDelta > 0 ? `+${simRainfallDelta}%` : `${simRainfallDelta}%`}</span>
              </div>
              <input
                type="range"
                min="-40"
                max="40"
                step="5"
                value={simRainfallDelta}
                onChange={(e) => setSimRainfallDelta(Number(e.target.value))}
                className="w-full accent-cyan-400 cursor-pointer"
              />
              <div className="flex justify-between text-[9px] text-[#F5F5F0]/50">
                <span>Severe Drought (-40%)</span>
                <span>Baseline (0%)</span>
                <span>El Niño Surge (+40%)</span>
              </div>
            </div>

            {/* Slider 2: Reforestation & Multi-Strata Canopy */}
            <div className="p-4 rounded-xl bg-[#0A0D0B] border border-emerald-500/30 space-y-3 font-mono">
              <div className="flex justify-between items-center text-xs">
                <span className="text-emerald-400 font-bold flex items-center gap-1.5">
                  <TreePine className="w-3.5 h-3.5" />
                  Reforestation & Canopy Coverage
                </span>
                <span className="font-bold text-white">+{simReforestation}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="50"
                step="5"
                value={simReforestation}
                onChange={(e) => setSimReforestation(Number(e.target.value))}
                className="w-full accent-emerald-400 cursor-pointer"
              />
              <div className="flex justify-between text-[9px] text-[#F5F5F0]/50">
                <span>Current Baseline (0%)</span>
                <span>Aggressive Cloud Reforestation (+50%)</span>
              </div>
            </div>

            {/* Slider 3: Soil Biochar Inoculation */}
            <div className="p-4 rounded-xl bg-[#0A0D0B] border border-amber-500/30 space-y-3 font-mono">
              <div className="flex justify-between items-center text-xs">
                <span className="text-amber-400 font-bold flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5" />
                  Soil Biochar & Compost Dosing
                </span>
                <span className="font-bold text-white">{simBiocharRate} t/ha</span>
              </div>
              <input
                type="range"
                min="0"
                max="20"
                step="2"
                value={simBiocharRate}
                onChange={(e) => setSimBiocharRate(Number(e.target.value))}
                className="w-full accent-amber-400 cursor-pointer"
              />
              <div className="flex justify-between text-[9px] text-[#F5F5F0]/50">
                <span>Zero Inoculation (0)</span>
                <span>Maximum Mineral Sponge (20 t/ha)</span>
              </div>
            </div>
          </div>

          {/* Reset button */}
          <div className="flex justify-end">
            <button
              onClick={() => {
                audioFeedback.playSubtleClick();
                setSimRainfallDelta(0);
                setSimReforestation(15);
                setSimBiocharRate(8);
              }}
              className="px-3 py-1.5 rounded bg-[#181C19] hover:bg-[#242A25] text-[#C5A059] border border-[#C5A059]/40 text-xs font-mono flex items-center gap-1.5 cursor-pointer"
            >
              <RefreshCw className="w-3 h-3" />
              <span>Reset Simulator Baseline</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
