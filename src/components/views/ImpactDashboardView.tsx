import React, { useState, useEffect } from 'react';
import { 
  BarChart3, 
  Layers, 
  ShieldCheck, 
  CheckCircle2, 
  TrendingUp, 
  Eye, 
  FileText, 
  Sparkles, 
  Info, 
  Calendar, 
  Lock, 
  GitBranch, 
  BookOpen, 
  Globe2, 
  AlertTriangle, 
  Radio, 
  LineChart as LineChartIcon,
  MessageSquareShare,
  Users,
  Scale,
  RefreshCw,
  Download,
  Brain,
  Flame,
  Columns,
  Sliders,
  Camera,
  Plus,
  Star,
  Search,
  Bell,
  GitCompare,
  X,
  SlidersHorizontal
} from 'lucide-react';
import { alchemicalAudio } from '../../lib/alchemicalAudio';
import { INTELLIGENCE_LAYERS, CIVILIZATION_METRICS, SAMPLE_PROVENANCE } from '../../data/mockCivilizationData';
import { CivilizationMetric } from '../../types';
import { CausalImpactD3Graph } from '../CausalImpactD3Graph';
import { EightFormsCapitalTreemap } from '../analytics/EightFormsCapitalTreemap';
import { HumanFlourishingTimelineChart } from '../analytics/HumanFlourishingTimelineChart';
import { ProjectFlourishingD3Network } from '../analytics/ProjectFlourishingD3Network';
import { RegenerativeProgressD3Chart } from '../analytics/RegenerativeProgressD3Chart';
import { HistoricalRegenerativeTrendChart } from '../analytics/HistoricalRegenerativeTrendChart';
import { FlourishingVsStabilityD3Chart, MonthlyTrendDataPoint } from '../analytics/FlourishingVsStabilityD3Chart';
import { KnowledgeGraphStudio } from '../intelligence/KnowledgeGraphStudio';
import { BioregionalHazardMonitor } from '../bioregional/BioregionalHazardMonitor';
import { BioregionalImpactD3Map, HeatmapMode } from '../bioregional/BioregionalImpactD3Map';
import { CommunityImpactFeed } from '../bioregional/CommunityImpactFeed';
import { CollaborativeStewardshipTeams } from '../profile/CollaborativeStewardshipTeams';
import { ImpactStoryGenerator } from '../profile/ImpactStoryGenerator';
import { DataQualityBadge } from '../analytics/DataQualityBadge';
import { BioregionalSplitPaneView } from '../analytics/BioregionalSplitPaneView';
import { PredictiveForecastingSection } from '../analytics/PredictiveForecastingSection';
import { BioregionalComparatorModal } from '../analytics/BioregionalComparatorModal';
import { PlanetaryPulseVisualizer } from '../analytics/PlanetaryPulseVisualizer';
import { EvidenceExportModal } from '../analytics/EvidenceExportModal';
import { ThresholdAlertModal, AlertThresholdConfig } from '../analytics/ThresholdAlertModal';
import { ThresholdAlertBanner } from '../analytics/ThresholdAlertBanner';
import { EpistemicObservationModal } from '../analytics/EpistemicObservationModal';
import { audioAlchemist } from '../../lib/audioAlchemist';
import { generateImpactArchivalPDF } from '../../lib/generateImpactArchivalPDF';
import { generateEnvironmentalSnapshotPDF } from '../../lib/generateEnvironmentalSnapshotPDF';
import { audioFeedback } from '../../lib/audioFeedback';
import { TimeRangeOption, exportVisualizedTrendCSV, exportBatchAllBioregionsCSV } from '../analytics/trendExportUtils';
import { TimeRangeSelector } from '../analytics/TimeRangeSelector';
import { TWELVE_MONTH_INTERVAL_DATA } from '../analytics/FlourishingVsStabilityD3Chart';
import { COMPARATIVE_BIOREGIONS, getBioregionHistoricalData } from '../analytics/flourishingAnalyticsData';
import { ImpactOnboardingBanner } from '../analytics/ImpactOnboardingBanner';
import { TemporalSlider, TEMPORAL_EPOCH_DATA, TemporalEpochPoint } from '../analytics/TemporalSlider';
import { RegenerativeDriftMonitor } from '../analytics/RegenerativeDriftMonitor';
import { SpatialDensityHeatmapLayer, EcologicalIndicatorType, SPATIAL_DENSITY_HOTSPOTS } from '../analytics/SpatialDensityHeatmapLayer';
import { CustomizableDashboardGrid } from '../analytics/CustomizableDashboardGrid';
import { QuickSnapshotExporter, SnapshotDashboardContext } from '../analytics/QuickSnapshotExporter';
import { WeeklyBioregionalSynthesisPanel } from '../analytics/WeeklyBioregionalSynthesisPanel';
import { ThresholdConfigurationPanel } from '../analytics/ThresholdConfigurationPanel';
import { BioregionalCompareModeOverlay } from '../analytics/BioregionalCompareModeOverlay';

const IMPACT_DASHBOARD_CACHE_KEY = 'atlas_sanctum_impact_dashboard_cache_v2';

export type ImpactDashboardTab = 
  | 'eight-forms-capital' 
  | 'historical-trend'
  | 'community-feed' 
  | 'flourishing-vs-stability' 
  | 'weekly-synthesis' 
  | 'regenerative-progress' 
  | 'flourishing-timeline' 
  | 'restoration-mesh' 
  | 'knowledge-studio' 
  | 'causal-graph' 
  | 'telemetry-grid' 
  | 'bioregional-map' 
  | 'hazard-monitor' 
  | 'collaborative-teams' 
  | 'impact-story' 
  | 'split-pane-compare' 
  | 'predictive-forecasting' 
  | 'spatial-density-heatmap' 
  | 'regenerative-drift' 
  | 'custom-grid';

interface ImpactDashboardCachedState {
  timeRange?: TimeRangeOption;
  isNormalized?: boolean;
  selectedBioregions?: string[];
  activeTab?: ImpactDashboardTab;
  selectedLayerId?: string;
  isPredictiveForecastingEnabled?: boolean;
  heatmapMode?: HeatmapMode;
  showHistoricalComparison?: boolean;
  alertThreshold?: AlertThresholdConfig;
}

interface ImpactDashboardViewProps {
  onInspectProvenance: (prov: any) => void;
  onOpenMoralSimulator: () => void;
  onSelectTab?: (tabId: string) => void;
}

export const ImpactDashboardView: React.FC<ImpactDashboardViewProps> = ({
  onInspectProvenance,
  onOpenMoralSimulator,
  onSelectTab
}) => {
  // Load cached settings from localStorage
  const [cachedState] = useState<ImpactDashboardCachedState | null>(() => {
    try {
      const raw = localStorage.getItem(IMPACT_DASHBOARD_CACHE_KEY);
      if (raw) return JSON.parse(raw);
    } catch (e) {
      console.warn('Failed to parse impact dashboard cache:', e);
    }
    return null;
  });

  const [selectedLayerId, setSelectedLayerId] = useState<string>(() => cachedState?.selectedLayerId ?? 'flourishing-os');
  const [selectedMetric, setSelectedMetric] = useState<CivilizationMetric>(CIVILIZATION_METRICS[0]);
  const [activeTab, setActiveTab] = useState<ImpactDashboardTab>(() => cachedState?.activeTab ?? 'eight-forms-capital');
  const [regenerativeViewStyle, setRegenerativeViewStyle] = useState<'recharts_trend' | 'd3_detail'>('recharts_trend');
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [pdfGenerationSuccess, setPdfGenerationSuccess] = useState(false);
  const [csvExportSuccess, setCsvExportSuccess] = useState<string | null>(null);

  // Compare Mode & Notification Thresholds Configuration Modals/Panels
  const [isCompareModeOpen, setIsCompareModeOpen] = useState<boolean>(false);
  const [isThresholdConfigOpen, setIsThresholdConfigOpen] = useState<boolean>(false);

  // Onboarding Banner State
  const [showOnboardingBanner, setShowOnboardingBanner] = useState<boolean>(() => {
    return localStorage.getItem('atlas_impact_onboarding_dismissed') !== 'true';
  });

  // 24-Month Temporal Epoch Scrubber State (0-23; month 11 = Current Cycle)
  const [temporalEpochIndex, setTemporalEpochIndex] = useState<number>(11);
  const currentEpoch = TEMPORAL_EPOCH_DATA[temporalEpochIndex] || TEMPORAL_EPOCH_DATA[11];

  // Spatial Density Heatmap State
  const [spatialDensityIndicator, setSpatialDensityIndicator] = useState<EcologicalIndicatorType>('canopy_ndvi');
  const [selectedSpatialHotspot, setSelectedSpatialHotspot] = useState<any>(null);

  // Workspace Layout Mode: Standard Fixed vs Drag-and-Drop Grid
  const [workspaceLayoutMode, setWorkspaceLayoutMode] = useState<'standard' | 'custom_grid'>('standard');

  // Snapshot PDF & Comparator Modal States
  const [isGeneratingSnapshot, setIsGeneratingSnapshot] = useState<boolean>(false);
  const [snapshotSuccess, setSnapshotSuccess] = useState<string | null>(null);
  const [isComparatorModalOpen, setIsComparatorModalOpen] = useState<boolean>(false);
  const [isConfidenceIntervalActive, setIsConfidenceIntervalActive] = useState<boolean>(false);

  // Predictive Forecasting & Heatmap Layer States
  const [isPredictiveForecastingEnabled, setIsPredictiveForecastingEnabled] = useState<boolean>(() => cachedState?.isPredictiveForecastingEnabled ?? false);
  const [heatmapMode, setHeatmapMode] = useState<HeatmapMode>(() => cachedState?.heatmapMode ?? 'ecological');

  // Trend Chart State Managed at Dashboard Level
  const [timeRange, setTimeRange] = useState<TimeRangeOption>(() => cachedState?.timeRange ?? 'year');
  const [isNormalized, setIsNormalized] = useState<boolean>(() => cachedState?.isNormalized ?? false);
  const [selectedBioregions, setSelectedBioregions] = useState<string[]>(() => {
    if (cachedState?.selectedBioregions && cachedState.selectedBioregions.length > 0) {
      // Default to single primary bioregion to avoid unintentional split-pane on boot
      return [cachedState.selectedBioregions[0]];
    }
    return ['pan-african'];
  });
  const [triggerInsightsCounter, setTriggerInsightsCounter] = useState<number>(0);

  // Celestial Alignment & Ritual Cleanse States
  const [isCelestialAlignment, setIsCelestialAlignment] = useState<boolean>(false);
  const [isDataPurified, setIsDataPurified] = useState<boolean>(false);
  const [isRitualCleansing, setIsRitualCleansing] = useState<boolean>(false);
  const [ritualCleanseSuccess, setRitualCleanseSuccess] = useState<string | null>(null);

  // Evidence Export & Audio Alchemist States
  const [isEvidenceExportModalOpen, setIsEvidenceExportModalOpen] = useState<boolean>(false);
  const [isAudioAlchemistActive, setIsAudioAlchemistActive] = useState<boolean>(false);
  const [audioAlchemistVolume, setAudioAlchemistVolume] = useState<number>(0.6);

  // Historical Longitudinal Comparison State (Overlay Prior Year vs Current Year)
  const [isCompareHistorical, setIsCompareHistorical] = useState<boolean>(() => cachedState?.showHistoricalComparison ?? false);

  // Threshold Alerts Configuration & Warning States
  const [alertThreshold, setAlertThreshold] = useState<AlertThresholdConfig>(() => {
    if (cachedState?.alertThreshold) return cachedState.alertThreshold;
    try {
      const saved = localStorage.getItem('atlas_impact_custom_threshold_alerts');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Could not read saved alert threshold', e);
    }
    return {
      enabled: true,
      metric: 'ecological',
      condition: 'below',
      value: 75
    };
  });
  const [isThresholdModalOpen, setIsThresholdModalOpen] = useState<boolean>(false);
  const [isAlertDismissed, setIsAlertDismissed] = useState<boolean>(false);

  const handleSaveAlertConfig = (newConfig: AlertThresholdConfig) => {
    setAlertThreshold(newConfig);
    setIsAlertDismissed(false);
    audioFeedback.playSuccessChime();
    try {
      localStorage.setItem('atlas_impact_custom_threshold_alerts', JSON.stringify(newConfig));
    } catch (e) {
      console.warn('Failed to save alert threshold to localStorage', e);
    }
  };

  // Search Bar State for filtering bioregional metrics by name or ecological zone
  const [metricSearchQuery, setMetricSearchQuery] = useState<string>('');
  const [selectedEcologicalZone, setSelectedEcologicalZone] = useState<string>('all');

  // Epistemic Observation Modal State (Recording manual field notes to Evidence Ledger)
  const [isEpistemicObservationModalOpen, setIsEpistemicObservationModalOpen] = useState<boolean>(false);
  const [epistemicObservationTargetPoint, setEpistemicObservationTargetPoint] = useState<MonthlyTrendDataPoint | null>(null);

  const handleOpenEpistemicObservation = (pt?: MonthlyTrendDataPoint) => {
    audioFeedback.playMicroTick();
    setEpistemicObservationTargetPoint(pt || TWELVE_MONTH_INTERVAL_DATA[TWELVE_MONTH_INTERVAL_DATA.length - 1]);
    setIsEpistemicObservationModalOpen(true);
  };

  // Active bioregion and latest telemetry for threshold evaluation
  const activeBioregionObj = COMPARATIVE_BIOREGIONS.find(b => selectedBioregions.includes(b.id)) || COMPARATIVE_BIOREGIONS[0];
  const activeDataset = activeBioregionObj.monthlyData;
  const latestDataPoint = activeDataset[activeDataset.length - 1] || TWELVE_MONTH_INTERVAL_DATA[TWELVE_MONTH_INTERVAL_DATA.length - 1];

  const currentMetricValue = alertThreshold.metric === 'ecological'
    ? latestDataPoint.ecologicalFlourishing
    : alertThreshold.metric === 'economic'
      ? latestDataPoint.economicStability
      : latestDataPoint.decouplingMargin;

  const isThresholdBreached = alertThreshold.enabled && !isAlertDismissed && (
    alertThreshold.condition === 'below'
      ? currentMetricValue < alertThreshold.value
      : currentMetricValue > alertThreshold.value
  );

  const handleToggleAudioAlchemist = () => {
    audioFeedback.playMicroTick();
    if (isAudioAlchemistActive) {
      audioAlchemist.stopSoundscape();
      setIsAudioAlchemistActive(false);
    } else {
      audioAlchemist.startSoundscape();
      setIsAudioAlchemistActive(true);
      const latestPoint = TWELVE_MONTH_INTERVAL_DATA[TWELVE_MONTH_INTERVAL_DATA.length - 1];
      const prevPoint = TWELVE_MONTH_INTERVAL_DATA[TWELVE_MONTH_INTERVAL_DATA.length - 2];
      const variance = Math.abs(latestPoint.ecologicalFlourishing - prevPoint.ecologicalFlourishing) / 100;
      audioAlchemist.updateMetrics(latestPoint.ecologicalFlourishing, latestPoint.economicStability, variance);
    }
  };

  useEffect(() => {
    if (isAudioAlchemistActive) {
      const latestPoint = TWELVE_MONTH_INTERVAL_DATA[TWELVE_MONTH_INTERVAL_DATA.length - 1];
      const prevPoint = TWELVE_MONTH_INTERVAL_DATA[TWELVE_MONTH_INTERVAL_DATA.length - 2];
      const variance = Math.abs(latestPoint.ecologicalFlourishing - prevPoint.ecologicalFlourishing) / 100;
      audioAlchemist.updateMetrics(latestPoint.ecologicalFlourishing, latestPoint.economicStability, variance);
    }
  }, [isAudioAlchemistActive, selectedBioregions, timeRange]);

  useEffect(() => {
    return () => {
      audioAlchemist.stopSoundscape();
    };
  }, []);

  const handleTriggerRitualCleanse = () => {
    if (isRitualCleansing) return;
    setIsRitualCleansing(true);
    audioFeedback.playCovenantResonance();
    alchemicalAudio.playSingingBowl(528, 3.5);

    setTimeout(() => {
      setIsRitualCleansing(false);
      setIsDataPurified(true);
      alchemicalAudio.playTransmutationPulse('albedo');
      audioFeedback.playSuccessChime();
      setRitualCleanseSuccess('Ablutio Complete: Noise filtered from longitudinal stream via stardust purification.');
      setTimeout(() => setRitualCleanseSuccess(null), 6000);
    }, 2800);
  };

  // Save filter settings, selected bioregions and view states to localStorage
  useEffect(() => {
    try {
      const stateToCache: ImpactDashboardCachedState = {
        timeRange,
        isNormalized,
        selectedBioregions,
        activeTab,
        selectedLayerId,
        isPredictiveForecastingEnabled,
        heatmapMode,
        showHistoricalComparison: isCompareHistorical,
        alertThreshold
      };
      localStorage.setItem(IMPACT_DASHBOARD_CACHE_KEY, JSON.stringify(stateToCache));
    } catch (e) {
      console.warn('Failed to cache impact dashboard state to localStorage:', e);
    }
  }, [timeRange, isNormalized, selectedBioregions, activeTab, selectedLayerId, isPredictiveForecastingEnabled, heatmapMode, isCompareHistorical, alertThreshold]);

  const handleExportTrendCSV = () => {
    audioFeedback.playSubtleClick();
    const result = exportVisualizedTrendCSV({
      primaryDataset: TWELVE_MONTH_INTERVAL_DATA,
      selectedBioregions: COMPARATIVE_BIOREGIONS.filter(b => selectedBioregions.includes(b.id)),
      isNormalized,
      timeRange
    });
    audioFeedback.playSuccessChime();
    setCsvExportSuccess(`Exported ${result.rowCount} trend telemetry records to ${result.fileName}`);
    setTimeout(() => setCsvExportSuccess(null), 5000);
  };

  const handleBatchExportCSV = () => {
    audioFeedback.playSubtleClick();
    const result = exportBatchAllBioregionsCSV({
      timeRange,
      isNormalized
    });
    audioFeedback.playSuccessChime();
    setCsvExportSuccess(`Batch export downloaded: ${result.rowCount} aggregated records across all ${result.bioregionCount} bioregions (${result.fileName})`);
    setTimeout(() => setCsvExportSuccess(null), 6000);
  };

  const handleTakeSnapshotPDF = async () => {
    try {
      setIsGeneratingSnapshot(true);
      audioFeedback.playSubtleClick();
      // Look for the primary D3 chart card or the main dashboard container
      const chartElement = document.getElementById('flourishing-vs-stability-d3-chart-card') || 
                           document.getElementById('impact-dashboard-root-view') || 
                           document.body;

      const activeBioregionObjs = COMPARATIVE_BIOREGIONS.filter(b => selectedBioregions.includes(b.id));

      const result = await generateEnvironmentalSnapshotPDF({
        chartElement,
        selectedBioregions: activeBioregionObjs.length > 0 ? activeBioregionObjs : [COMPARATIVE_BIOREGIONS[0]],
        timeRange,
        isNormalized,
        isConfidenceIntervalActive,
        isPredictiveForecastingEnabled
      });

      setSnapshotSuccess(result.fileName);
      audioFeedback.playSuccessChime();
      setTimeout(() => setSnapshotSuccess(null), 6000);
    } catch (err) {
      console.error('Failed to generate high-resolution snapshot PDF:', err);
    } finally {
      setIsGeneratingSnapshot(false);
    }
  };

  const handleGeneratePDF = async () => {
    try {
      setIsGeneratingPdf(true);
      audioFeedback.playSubtleClick();
      await generateImpactArchivalPDF({
        includeBadges: true,
        includeTwelveMonthTrajectory: true
      });
      setPdfGenerationSuccess(true);
      audioFeedback.playSuccessChime();
      setTimeout(() => setPdfGenerationSuccess(false), 5000);
    } catch (err) {
      console.error('Failed to generate archival PDF summary:', err);
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  const activeLayer = INTELLIGENCE_LAYERS.find(l => l.id === selectedLayerId) || INTELLIGENCE_LAYERS[0];
  const layerMetrics = CIVILIZATION_METRICS;

  // Search filter matching for bioregions and ecological metrics
  const filteredBioregions = COMPARATIVE_BIOREGIONS.filter(bioregion => {
    const query = metricSearchQuery.toLowerCase().trim();
    const matchesSearch = query === '' || 
      bioregion.name.toLowerCase().includes(query) ||
      bioregion.biome.toLowerCase().includes(query) ||
      bioregion.location.toLowerCase().includes(query) ||
      bioregion.code.toLowerCase().includes(query);

    const matchesZone = selectedEcologicalZone === 'all' || 
      bioregion.biome.toLowerCase().includes(selectedEcologicalZone.toLowerCase()) ||
      (selectedEcologicalZone === 'savanna' && bioregion.biome.toLowerCase().includes('savanna')) ||
      (selectedEcologicalZone === 'montane' && bioregion.biome.toLowerCase().includes('montane')) ||
      (selectedEcologicalZone === 'lakes' && bioregion.biome.toLowerCase().includes('lake')) ||
      (selectedEcologicalZone === 'arid' && bioregion.biome.toLowerCase().includes('arid')) ||
      (selectedEcologicalZone === 'rainforest' && bioregion.biome.toLowerCase().includes('rainforest')) ||
      (selectedEcologicalZone === 'mangrove' && bioregion.biome.toLowerCase().includes('mangrove'));

    return matchesSearch && matchesZone;
  });

  const filteredCivilizationMetrics = CIVILIZATION_METRICS.filter(metric => {
    const query = metricSearchQuery.toLowerCase().trim();
    const matchesSearch = query === '' || 
      metric.name.toLowerCase().includes(query) ||
      metric.category.toLowerCase().includes(query) ||
      metric.description.toLowerCase().includes(query);

    const matchesZone = selectedEcologicalZone === 'all' ||
      metric.category.toLowerCase().includes(selectedEcologicalZone.toLowerCase()) ||
      metric.name.toLowerCase().includes(selectedEcologicalZone.toLowerCase());

    return matchesSearch && matchesZone;
  });

  const renderCustomGridWidget = (widgetId: string) => {
    switch (widgetId) {
      case 'temporal_slider':
        return (
          <TemporalSlider
            activeEpochIndex={temporalEpochIndex + 1}
            onEpochChange={(pt) => {
              setTemporalEpochIndex(pt.monthIndex - 1);
              audioFeedback.playMicroTick();
            }}
            onInspectPoint={onInspectProvenance}
          />
        );
      case 'longitudinal_chart':
        return (
          <FlourishingVsStabilityD3Chart
            timeRange={timeRange}
            onTimeRangeChange={setTimeRange}
            isNormalized={isNormalized}
            onNormalizeChange={setIsNormalized}
            selectedBioregions={selectedBioregions}
            onBioregionsChange={setSelectedBioregions}
            isConfidenceIntervalActive={isConfidenceIntervalActive}
            onConfidenceIntervalToggle={setIsConfidenceIntervalActive}
            onAddBioregionClick={() => setIsComparatorModalOpen(true)}
            triggerInsightsCounter={triggerInsightsCounter}
            isCelestialAlignment={isCelestialAlignment}
            onToggleCelestialAlignment={setIsCelestialAlignment}
            isDataPurified={isDataPurified}
            onPurifiedChange={setIsDataPurified}
            isRitualCleansing={isRitualCleansing}
            onTriggerRitualCleanse={handleTriggerRitualCleanse}
            showPredictiveForecast={isPredictiveForecastingEnabled}
            onPredictiveForecastChange={setIsPredictiveForecastingEnabled}
            showHistoricalComparison={isCompareHistorical}
            onHistoricalComparisonChange={setIsCompareHistorical}
            alertThreshold={alertThreshold}
            onAlertThresholdChange={handleSaveAlertConfig}
            onOpenEpistemicObservation={handleOpenEpistemicObservation}
            onSelectTab={onSelectTab}
            onInspectPoint={(pt) => {
              onInspectProvenance({
                ...SAMPLE_PROVENANCE,
                metricName: `12-Month Trajectory: ${pt.monthLabel}`,
                verificationHash: pt.cryptographicHash,
                rawSensorReading: `Ecological: ${pt.ecologicalFlourishing}% • Economic: ${pt.economicStability}% (Decoupling: +${pt.decouplingMargin}%)`,
                confidenceInterval: `±0.8% across ${pt.verifiedSensorCount} cryptographic sensor nodes`,
                epistemicTier: 'Zero-Knowledge Multi-Spectral Mesh'
              });
            }}
            onInspectProvenance={onInspectProvenance}
            onOpenMoralSimulator={onOpenMoralSimulator}
          />
        );
      case 'drift_monitor':
        return (
          <RegenerativeDriftMonitor
            onSelectBioregion={(id) => {
              setSelectedBioregions([id]);
              audioFeedback.playMicroTick();
            }}
            onInspectProvenance={onInspectProvenance}
          />
        );
      case 'spatial_heatmap':
        return (
          <SpatialDensityHeatmapLayer
            activeIndicator={spatialDensityIndicator}
            onSelectIndicator={setSpatialDensityIndicator}
            onSelectHotspot={setSelectedSpatialHotspot}
          />
        );
      case 'bioregional_map':
        return (
          <BioregionalImpactD3Map
            heatmapMode={heatmapMode}
            onHeatmapModeChange={setHeatmapMode}
            onInspectProvenance={onInspectProvenance}
          />
        );
      case 'epistemic_matrix':
        return (
          <div className="p-4 bg-[#0E1310] border border-[#C5A059]/30 rounded-md space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono uppercase text-[#C5A059] font-bold">
                5-Layer Epistemic Ground Truth Matrix
              </span>
              <span className="text-[10px] font-mono text-emerald-400">
                100% Cryptographic Ingestion
              </span>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-2 text-xs font-mono">
              {INTELLIGENCE_LAYERS.map(l => (
                <div key={l.id} className="p-2.5 bg-[#141B16] rounded border border-[#F5F5F0]/10 space-y-1">
                  <div className="font-bold text-white text-[11px] truncate">{l.name}</div>
                  <div className="text-[10px] text-[#C5A059]">{l.activeNodes.toLocaleString()} Active Nodes</div>
                  <div className="text-[9px] text-emerald-400 font-bold">{l.flourishingIndexDelta}</div>
                </div>
              ))}
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="w-full bg-[#0A0A0A] text-[#F5F5F0] min-h-screen py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-10">
      {/* Onboarding Tour Banner */}
      {showOnboardingBanner && (
        <ImpactOnboardingBanner
          onDismiss={() => setShowOnboardingBanner(false)}
          onExploreFeature={(tab) => {
            setActiveTab(tab as any);
            audioFeedback.playSubtleClick();
          }}
          forceShow={showOnboardingBanner}
        />
      )}

      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-6 border-b border-[#F5F5F0]/10">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono uppercase text-[#C5A059] tracking-[0.2em] font-bold">
              CIVILIZATIONAL FLOURISHING OS • 5-LAYER INTELLIGENCE MATRIX
            </span>
            <span className="text-[9px] font-mono bg-emerald-950/80 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded-full">
              Commandment IX: Evidence Constitution
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-serif text-[#F5F5F0]">Impact & Epistemic Telemetry</h1>
          <p className="text-xs sm:text-sm text-[#F5F5F0]/60 max-w-2xl font-sans">
            Every metric is auditable down to its sensor origin, mathematical model, and cryptographic verification hash. We never confuse model with reality.
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          {/* Restore Onboarding Banner Button if dismissed */}
          {!showOnboardingBanner && (
            <button
              id="header-restore-onboarding-banner-btn"
              type="button"
              onClick={() => {
                setShowOnboardingBanner(true);
                localStorage.removeItem('atlas_impact_onboarding_dismissed');
                audioFeedback.playMicroTick();
              }}
              className="px-3.5 py-2 bg-[#141C16] hover:bg-[#1E2B22] border border-[#C5A059]/50 text-[#C5A059] rounded-sm text-xs font-mono font-bold flex items-center gap-1.5 transition-all uppercase tracking-wider shadow cursor-pointer ring-1 ring-[#C5A059]/30"
              title="Restore the Epistemic Impact Onboarding Tour Guide"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#C5A059]" />
              <span>Tour Guide</span>
            </button>
          )}

          {/* Workspace Layout Grid Toggle */}
          <button
            id="header-workspace-grid-toggle-btn"
            type="button"
            onClick={() => {
              const next = workspaceLayoutMode === 'standard' ? 'custom_grid' : 'standard';
              setWorkspaceLayoutMode(next);
              audioFeedback.playCovenantResonance();
            }}
            className={`px-3.5 py-2 border rounded-sm text-xs font-mono font-bold flex items-center gap-1.5 transition-all uppercase tracking-wider shadow cursor-pointer ${
              workspaceLayoutMode === 'custom_grid'
                ? 'bg-gradient-to-r from-[#C5A059] to-[#E0C070] text-black border-[#C5A059] font-bold shadow-lg ring-1 ring-[#C5A059]/50'
                : 'bg-[#141414] hover:bg-[#1f1f1f] text-[#C5A059] border-[#C5A059]/40'
            }`}
            title="Toggle Customizable Drag-and-Drop Workspace Grid"
          >
            <Columns className="w-3.5 h-3.5" />
            <span>Workspace Grid: {workspaceLayoutMode === 'custom_grid' ? 'CUSTOM [ON]' : 'OFF'}</span>
          </button>

          {/* Audio Alchemist Ambient Soundscape Toggle */}
          <button
            id="header-audio-alchemist-btn"
            onClick={handleToggleAudioAlchemist}
            className={`px-3.5 py-2 border rounded-sm text-xs font-mono font-bold flex items-center gap-1.5 transition-all uppercase tracking-wider shadow cursor-pointer ${
              isAudioAlchemistActive
                ? 'bg-gradient-to-r from-amber-600 via-yellow-600 to-[#C5A059] text-black border-[#C5A059] font-bold shadow-lg ring-1 ring-[#C5A059]/50 animate-pulse'
                : 'bg-[#141414] hover:bg-[#1f1f1f] text-[#C5A059] border-[#C5A059]/40 hover:border-[#C5A059]'
            }`}
            title="Toggle Audio Alchemist: Generative ambient soundscape mapping data variance to subtle musical harmonies"
          >
            <Radio className={`w-3.5 h-3.5 ${isAudioAlchemistActive ? 'text-black animate-spin' : 'text-[#C5A059]'}`} />
            <span>Audio Alchemist: {isAudioAlchemistActive ? '108Hz [ON]' : 'OFF'}</span>
          </button>

          {/* Epistemic Forecast Toggle Button (Gemini-Powered) */}
          <button
            id="header-epistemic-forecast-toggle-btn"
            onClick={() => {
              setIsPredictiveForecastingEnabled(prev => !prev);
              audioFeedback.playMicroTick();
            }}
            className={`px-3.5 py-2 border rounded-sm text-xs font-mono font-bold flex items-center gap-1.5 transition-all uppercase tracking-wider shadow cursor-pointer ${
              isPredictiveForecastingEnabled
                ? 'bg-gradient-to-r from-cyan-600 via-teal-600 to-emerald-600 text-black border-cyan-400 font-bold shadow-lg ring-1 ring-cyan-400/50'
                : 'bg-[#141414] hover:bg-[#1f1f1f] text-cyan-400 border-cyan-500/40 hover:border-cyan-400'
            }`}
            title="Toggle Gemini-powered Epistemic Forecast model visualizing future trajectories for bioregional metrics"
          >
            <Sparkles className={`w-3.5 h-3.5 ${isPredictiveForecastingEnabled ? 'animate-spin text-black' : 'text-cyan-400'}`} />
            <span>Epistemic Forecast: {isPredictiveForecastingEnabled ? 'GEMINI 6-MO [ON]' : 'OFF'}</span>
          </button>

          {/* Evidence Export Button */}
          <button
            id="header-evidence-export-btn"
            onClick={() => {
              setIsEvidenceExportModalOpen(true);
              audioFeedback.playSubtleClick();
            }}
            className="px-3.5 py-2 bg-gradient-to-r from-[#C5A059] to-[#E0C070] hover:from-[#d4b068] hover:to-[#ebcc7f] text-black border border-[#C5A059] rounded-sm text-xs font-mono font-bold flex items-center gap-1.5 transition-all uppercase tracking-wider shadow cursor-pointer ring-1 ring-[#C5A059]/40"
            title="Generate a cryptographic summary of current session impact metrics and anchor to the Evidence Ledger"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-black" />
            <span>Evidence Export</span>
          </button>

          {/* Historical Longitudinal Comparison Toggle Button */}
          <button
            id="header-historical-compare-toggle-btn"
            onClick={() => {
              setIsCompareHistorical(prev => !prev);
              audioFeedback.playMicroTick();
            }}
            className={`px-3.5 py-2 border rounded-sm text-xs font-mono font-bold flex items-center gap-1.5 transition-all uppercase tracking-wider shadow cursor-pointer ${
              isCompareHistorical
                ? 'bg-gradient-to-r from-blue-700 via-indigo-700 to-blue-900 text-white border-blue-400 font-bold shadow-lg ring-1 ring-blue-400/50'
                : 'bg-[#141414] hover:bg-[#1f1f1f] text-blue-400 border-blue-500/40 hover:border-blue-400'
            }`}
            title="Toggle Compare: Overlay historical prior year baseline ranges (2024-25) onto current metric charts for longitudinal analysis"
          >
            <GitCompare className={`w-3.5 h-3.5 ${isCompareHistorical ? 'text-white' : 'text-blue-400'}`} />
            <span>Compare: {isCompareHistorical ? 'Prior Year [ON]' : 'OFF'}</span>
          </button>

          {/* Custom Threshold Alerts Configuration Button */}
          <button
            id="header-threshold-alerts-btn"
            onClick={() => {
              setIsThresholdModalOpen(true);
              audioFeedback.playSubtleClick();
            }}
            className={`px-3.5 py-2 border rounded-sm text-xs font-mono font-bold flex items-center gap-1.5 transition-all uppercase tracking-wider shadow cursor-pointer ${
              isThresholdBreached
                ? 'bg-rose-950/90 text-rose-200 border-rose-500 font-bold animate-pulse shadow-rose-900/50 shadow-md ring-1 ring-rose-500/50'
                : alertThreshold.enabled
                  ? 'bg-[#181310] hover:bg-[#241c17] text-amber-300 border-amber-500/40 hover:border-amber-400'
                  : 'bg-[#141414] text-[#F5F5F0]/50 border-[#F5F5F0]/20'
            }`}
            title="Configure custom threshold alerts for ecological metrics to trigger visual warnings"
          >
            <Bell className={`w-3.5 h-3.5 ${isThresholdBreached ? 'text-rose-400 animate-bounce' : 'text-amber-400'}`} />
            <span>Alerts: {alertThreshold.enabled ? `${alertThreshold.metric.toUpperCase().slice(0,3)} ${alertThreshold.condition === 'below' ? '<' : '>'}${alertThreshold.value}%` : 'OFF'}</span>
            {isThresholdBreached && (
              <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
            )}
          </button>

          {/* Quick Epistemic Observation Button (Manual Notes to Ledger) */}
          <button
            id="header-add-epistemic-observation-btn"
            onClick={() => handleOpenEpistemicObservation()}
            className="px-3.5 py-2 bg-[#221A0F] hover:bg-[#302515] border border-amber-500/60 text-amber-300 hover:text-white rounded-sm text-xs font-mono font-bold flex items-center gap-1.5 transition-all uppercase tracking-wider shadow cursor-pointer ring-1 ring-amber-500/30"
            title="Record an Epistemic Observation or manual empirical note to the project's evidence ledger"
          >
            <FileText className="w-3.5 h-3.5 text-amber-400" />
            <span>+ Epistemic Note</span>
          </button>

          {/* Quick-Set Time Range Selector for Trend Analytics */}
          <div className="flex items-center">
            <TimeRangeSelector
              value={timeRange}
              onChange={(newRange) => {
                setTimeRange(newRange);
                audioFeedback.playMicroTick();
              }}
            />
          </div>

          {/* Bioregional Comparator: Persistent Add Bioregion Button */}
          <button
            id="header-bioregional-comparator-btn"
            onClick={() => {
              setActiveTab('flourishing-vs-stability');
              setIsComparatorModalOpen(true);
              audioFeedback.playMicroTick();
            }}
            className="px-3.5 py-2 bg-[#142319] hover:bg-[#1E3325] border border-emerald-500/70 text-emerald-300 hover:text-white rounded-sm text-xs font-mono font-bold flex items-center gap-1.5 transition-all uppercase tracking-wider shadow cursor-pointer ring-1 ring-emerald-500/30"
            title="Open Bioregional Comparator to overlay additional bioregions onto the trend chart for direct comparison"
          >
            <Plus className="w-3.5 h-3.5 text-emerald-400" />
            <span>+ Add Bioregion ({selectedBioregions.length})</span>
          </button>

          {/* Generate AI Insights Button */}
          <button
            id="header-generate-ai-insights-btn"
            onClick={() => {
              setActiveTab('flourishing-vs-stability');
              setTriggerInsightsCounter(prev => prev + 1);
              audioFeedback.playCovenantResonance();
            }}
            className="px-3.5 py-2 bg-gradient-to-r from-purple-950/80 to-[#1A1625] hover:from-purple-900/90 hover:to-[#262035] border border-purple-500/50 text-purple-200 rounded-sm text-xs font-mono font-bold flex items-center gap-1.5 transition-all uppercase tracking-wider shadow cursor-pointer"
            title="Use Gemini AI to analyze current longitudinal trend chart and summarize key ecological and economic correlations"
          >
            <Brain className="w-3.5 h-3.5 text-purple-400" />
            <span>AI Insights</span>
          </button>

          {/* Celestial Alignment Toggle */}
          <button
            id="header-celestial-alignment-toggle-btn"
            onClick={() => {
              setActiveTab('flourishing-vs-stability');
              setIsCelestialAlignment(prev => !prev);
              audioFeedback.playCovenantResonance();
            }}
            className={`px-3.5 py-2 border rounded-sm text-xs font-mono font-bold flex items-center gap-1.5 transition-all uppercase tracking-wider shadow cursor-pointer ${
              isCelestialAlignment
                ? 'bg-gradient-to-r from-amber-950 via-sky-950 to-purple-950 text-amber-200 border-[#C5A059] ring-1 ring-[#C5A059]/60 shadow-lg'
                : 'bg-[#141414] hover:bg-[#1f1f1f] text-[#C5A059] border-[#C5A059]/40 hover:border-[#C5A059]'
            }`}
            title="Map historical milestone data points onto the Star Map coordinate system, visually connecting impactful events across different bioregions as a celestial constellation"
          >
            <Star className={`w-3.5 h-3.5 ${isCelestialAlignment ? 'text-[#C5A059] fill-[#C5A059] animate-pulse' : 'text-[#C5A059]'}`} />
            <span>Celestial: {isCelestialAlignment ? 'ALIGNED [ON]' : 'OFF'}</span>
          </button>

          {/* Ritual Cleanse Button */}
          <button
            id="header-ritual-cleanse-btn"
            onClick={() => {
              setActiveTab('flourishing-vs-stability');
              handleTriggerRitualCleanse();
            }}
            disabled={isRitualCleansing}
            className={`px-3.5 py-2 border rounded-sm text-xs font-mono font-bold flex items-center gap-1.5 transition-all uppercase tracking-wider shadow cursor-pointer ${
              isDataPurified
                ? 'bg-[#0E2016] border-emerald-500/70 text-emerald-300 ring-1 ring-emerald-500/40'
                : 'bg-gradient-to-r from-[#1c180f] to-[#252014] hover:from-[#2a2417] hover:to-[#332b1a] border-[#C5A059] text-[#F5F5F0]'
            }`}
            title="Filter out chart noise via a stardust transition effect, symbolizing the purification of data for insight clarity"
          >
            <Sparkles className={`w-3.5 h-3.5 text-[#C5A059] ${isRitualCleansing ? 'animate-spin' : ''}`} />
            <span>{isRitualCleansing ? 'Cleansing Noise...' : isDataPurified ? 'Ritual Purified' : 'Ritual Cleanse'}</span>
          </button>

          {/* Export Data Button */}
          <button
            id="header-export-data-btn"
            data-testid="export-data-csv-btn"
            onClick={handleExportTrendCSV}
            className="px-3.5 py-2 bg-[#171612] hover:bg-[#26241b] border border-[#C5A059] text-[#C5A059] hover:text-white rounded-sm text-xs font-mono font-bold flex items-center gap-1.5 transition-all uppercase tracking-wider shadow cursor-pointer"
            title="Download current dashboard aggregated metric data in CSV format for external analysis"
          >
            <Download className="w-3.5 h-3.5 text-[#C5A059]" />
            <span>Export Data</span>
          </button>

          {/* Compare Mode Toggle Button */}
          <button
            id="impact-dashboard-compare-mode-toggle"
            type="button"
            onClick={() => {
              if (activeTab === 'split-pane-compare') {
                setActiveTab('flourishing-vs-stability');
                setIsCompareModeOpen(false);
              } else {
                setIsCompareModeOpen(prev => !prev);
              }
              audioFeedback.playMicroTick();
            }}
            className={`px-3.5 py-2 border rounded-sm text-xs font-mono font-bold flex items-center gap-1.5 transition-all uppercase tracking-wider shadow cursor-pointer ${
              isCompareModeOpen || activeTab === 'split-pane-compare'
                ? 'bg-cyan-950 border-cyan-400 text-cyan-200 ring-1 ring-cyan-400/50'
                : 'bg-[#171612] hover:bg-[#26241b] border-cyan-500/50 text-cyan-400 hover:text-cyan-200'
            }`}
            title="Toggle Compare Mode to overlay metrics from two different bioregions or historical periods"
          >
            <GitCompare className="w-3.5 h-3.5 text-cyan-400" />
            <span>Compare Mode: {isCompareModeOpen || activeTab === 'split-pane-compare' ? 'ON' : 'OFF'}</span>
          </button>

          {/* Thresholds Configuration Toggle Button */}
          <button
            id="impact-dashboard-thresholds-config-toggle"
            type="button"
            onClick={() => {
              setIsThresholdConfigOpen(prev => !prev);
              audioFeedback.playMicroTick();
            }}
            className={`px-3.5 py-2 border rounded-sm text-xs font-mono font-bold flex items-center gap-1.5 transition-all uppercase tracking-wider shadow cursor-pointer ${
              isThresholdConfigOpen
                ? 'bg-amber-950 border-amber-400 text-amber-200 ring-1 ring-amber-400/50'
                : 'bg-[#171612] hover:bg-[#26241b] border-amber-500/50 text-amber-400 hover:text-amber-200'
            }`}
            title="Configure custom notification thresholds for specific indicators"
          >
            <SlidersHorizontal className="w-3.5 h-3.5 text-amber-400" />
            <span>Set Thresholds</span>
          </button>

          {/* Batch Export Option for All Bioregions */}
          <button
            id="batch-export-all-bioregions-csv-btn"
            onClick={handleBatchExportCSV}
            className="px-3.5 py-2 bg-[#201D14] hover:bg-[#2F2A1C] border border-[#C5A059]/80 text-[#C5A059] hover:text-white rounded-sm text-xs font-mono font-bold flex items-center gap-1.5 transition-all uppercase tracking-wider shadow cursor-pointer"
            title="Download aggregated multi-biome dataset for all currently monitored bioregions at once into a unified CSV"
          >
            <Download className="w-3.5 h-3.5 text-emerald-400" />
            <span>Batch Export ({COMPARATIVE_BIOREGIONS.length})</span>
          </button>

          {/* Quick Snapshot (High-Res PNG Card) Button */}
          <QuickSnapshotExporter
            context={{
              activeBioregionName: activeBioregionObj?.name || 'Pan-African Biome',
              selectedBioregionsCount: selectedBioregions.length,
              timeRange: timeRange,
              normalizationMode: isNormalized ? 'Normalized 0-100%' : 'Absolute Raw Indices',
              celestialAlignment: isCelestialAlignment,
              purifiedState: isDataPurified,
              flourishingScore: currentEpoch?.ecologicalFlourishing ?? latestDataPoint.ecologicalFlourishing,
              stabilityScore: currentEpoch?.economicStability ?? latestDataPoint.economicStability,
              decouplingMargin: currentEpoch?.decouplingMargin ?? latestDataPoint.decouplingMargin,
              verifiedSensors: currentEpoch?.verifiedSensors ?? 1450,
              merkleHash: currentEpoch?.cryptographicHash ?? '0x7c9f81a2e4b6d08311',
              driftStatus: isThresholdBreached ? 'Threshold Warning' : 'Nominal Consensus',
              epochMonth: currentEpoch?.calendarDate ?? 'Current Cycle'
            }}
          />

          {/* Snapshot Button: High-Resolution Screenshot & PDF Report */}
          <button
            id="snapshot-chart-pdf-btn"
            onClick={handleTakeSnapshotPDF}
            disabled={isGeneratingSnapshot}
            className="px-3.5 py-2 bg-[#0E1B1B] hover:bg-[#162A2A] border border-cyan-500/60 text-cyan-300 hover:text-white rounded-sm text-xs font-mono font-bold flex items-center gap-1.5 transition-all uppercase tracking-wider shadow cursor-pointer disabled:opacity-50"
            title="Capture a high-resolution screenshot of the current chart layout (including annotations and selected filters) and generate a downloadable PDF report summarizing current environmental performance"
          >
            {isGeneratingSnapshot ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 text-cyan-400 animate-spin" />
                <span>Capturing Snapshot...</span>
              </>
            ) : (
              <>
                <Camera className="w-3.5 h-3.5 text-cyan-400" />
                <span>Snapshot (PDF)</span>
              </>
            )}
          </button>

          {/* Generate Verified Archival PDF Summary Button */}
          <button
            id="generate-archival-pdf-summary-btn"
            onClick={handleGeneratePDF}
            disabled={isGeneratingPdf}
            className="px-4 py-2 bg-[#0D0D0D] hover:bg-[#1A1A1A] border border-[#C5A059] text-[#C5A059] hover:text-white rounded-sm text-xs font-mono font-bold flex items-center gap-1.5 transition-all uppercase tracking-wider shadow cursor-pointer disabled:opacity-50"
            title="Compile current longitudinal metrics & stewardship badges into a verified PDF report"
          >
            {isGeneratingPdf ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 text-[#C5A059] animate-spin" />
                <span>Compiling Archival PDF...</span>
              </>
            ) : (
              <>
                <FileText className="w-3.5 h-3.5 text-[#C5A059]" />
                <span>Full Ledger PDF</span>
              </>
            )}
          </button>

          <button
            onClick={() => {
              onInspectProvenance(SAMPLE_PROVENANCE);
              audioFeedback.playCovenantResonance();
            }}
            className="px-4 py-2 bg-[#1B3022] hover:bg-[#254530] border border-[#C5A059]/40 text-[#F5F5F0] rounded-sm text-xs font-mono font-bold flex items-center gap-1.5 transition-colors uppercase tracking-wider shadow"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            How Do We Know? (Audit Trail)
          </button>
        </div>
      </div>

      {/* CSV Export Confirmation Banner */}
      {csvExportSuccess && (
        <div className="p-3.5 bg-emerald-950/90 border border-emerald-500/50 rounded flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs font-mono text-emerald-300 shadow-xl animate-in fade-in duration-200">
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>
              <strong>Trend Data CSV Exported:</strong> {csvExportSuccess}
            </span>
          </div>
          <span className="text-[10px] text-emerald-400/80 bg-black/40 px-2 py-0.5 rounded border border-emerald-500/30 uppercase font-bold tracking-wider shrink-0">
            CSV AUDITED
          </span>
        </div>
      )}

      {/* PDF Archival Generation Confirmation Banner */}
      {pdfGenerationSuccess && (
        <div className="p-3.5 bg-emerald-950/90 border border-emerald-500/50 rounded flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs font-mono text-emerald-300 shadow-xl animate-in fade-in duration-200">
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>
              <strong>Verified Archival Report Generated:</strong> Longitudinal flourishing metrics, 12-month trajectory, and ratified stewardship badges compiled with QR consensus proof. Download initiated.
            </span>
          </div>
          <span className="text-[10px] text-emerald-400/80 bg-black/40 px-2 py-0.5 rounded border border-emerald-500/30 uppercase font-bold tracking-wider shrink-0">
            PDF/A ARCHIVED
          </span>
        </div>
      )}

      {/* Snapshot PDF Generation Confirmation Banner */}
      {snapshotSuccess && (
        <div className="p-3.5 bg-cyan-950/90 border border-cyan-500/50 rounded flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs font-mono text-cyan-300 shadow-xl animate-in fade-in duration-200">
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
            <span>
              <strong>Chart Snapshot PDF Generated:</strong> High-resolution render (2.0x retina) and active filters exported to {snapshotSuccess}
            </span>
          </div>
          <span className="text-[10px] text-cyan-300/80 bg-black/40 px-2 py-0.5 rounded border border-cyan-500/30 uppercase font-bold tracking-wider shrink-0">
            HI-RES RENDER
          </span>
        </div>
      )}

      {/* Compare Mode Overlay (Dual Bioregions or Historical Periods Side-by-Side Analysis) */}
      {isCompareModeOpen && activeTab !== 'split-pane-compare' && (
        <BioregionalCompareModeOverlay
          isOpen={isCompareModeOpen}
          onClose={() => {
            setIsCompareModeOpen(false);
            if (selectedBioregions.length > 1) {
              setSelectedBioregions([selectedBioregions[0] || 'pan-african']);
            }
          }}
          selectedBioregionIds={selectedBioregions}
          onSelectBioregions={setSelectedBioregions}
          isHistoricalCompareActive={isCompareHistorical}
          onToggleHistoricalCompare={setIsCompareHistorical}
        />
      )}

      {/* Custom Notification Thresholds Configuration Interface */}
      {isThresholdConfigOpen && (
        <div className="relative mb-3">
          <ThresholdConfigurationPanel
            onClose={() => setIsThresholdConfigOpen(false)}
            onSaveCustomRules={() => {
              audioFeedback.playSuccessChime();
            }}
          />
        </div>
      )}

      {/* Threshold Alert Warning Banner (Breach Notification) */}
      {isThresholdBreached && (
        <ThresholdAlertBanner
          config={alertThreshold}
          currentValue={currentMetricValue}
          onDismiss={() => setIsAlertDismissed(true)}
          onConfigure={() => setIsThresholdModalOpen(true)}
        />
      )}

      {/* Longitudinal Comparison Mode (Prior Year Overlay Active HUD) */}
      {isCompareHistorical && (
        <div 
          id="longitudinal-comparison-hud-banner"
          className="p-3.5 bg-gradient-to-r from-blue-950/80 via-indigo-950/70 to-slate-950/80 border border-blue-400/60 rounded text-xs font-mono shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 animate-in fade-in"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-blue-500/20 border border-blue-400 flex items-center justify-center text-blue-300 shrink-0">
              <GitCompare className="w-4 h-4 text-blue-400" />
            </div>
            <div>
              <div className="text-blue-200 font-bold flex items-center gap-2 flex-wrap">
                <span>LONGITUDINAL COMPARISON ACTIVE:</span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-blue-900/80 text-blue-200 border border-blue-400/40 font-bold">
                  PRIOR YEAR (2024–2025) VS CURRENT CYCLE (2025–2026)
                </span>
              </div>
              <div className="text-[11px] text-blue-100/70 pt-0.5">
                Baseline Trajectory: Prior year ecological floor was <strong>62.0%</strong> • Current cycle achieved <strong>92.4%</strong> (+30.4 pts YoY decoupling expansion). Shaded delta area visualized on chart.
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <span className="px-2.5 py-1 rounded bg-blue-900/60 text-blue-300 border border-blue-400/40 text-[10px] font-bold">
              DELTA: +30.4% GAIN
            </span>
            <button
              type="button"
              onClick={() => {
                setIsCompareHistorical(false);
                audioFeedback.playMicroTick();
              }}
              className="px-2.5 py-1 bg-black/50 hover:bg-black/80 border border-blue-400/40 text-blue-200 hover:text-white rounded text-[10px] font-mono cursor-pointer transition-colors"
            >
              Disable Compare
            </button>
          </div>
        </div>
      )}

      {/* Bioregional Metric Search Bar & Ecological Zone Filter */}
      <div 
        id="bioregional-metric-search-container"
        className="bg-[#111412] border border-[#C5A059]/30 rounded-sm p-4 space-y-3.5 shadow-lg"
      >
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          {/* Search text input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-[#C5A059] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              id="bioregional-metric-search-input"
              type="text"
              value={metricSearchQuery}
              onChange={(e) => setMetricSearchQuery(e.target.value)}
              placeholder="Search bioregional metrics by name or ecological zone (e.g. Mara, Mangrove, Cloud Forest, Carbon, Aquifer)..."
              className="w-full bg-[#0A0D0B] border border-[#F5F5F0]/15 focus:border-[#C5A059] text-xs font-mono text-[#F5F5F0] pl-9 pr-8 py-2.5 rounded-sm outline-hidden transition-all placeholder:text-[#F5F5F0]/30"
            />
            {metricSearchQuery && (
              <button
                type="button"
                onClick={() => setMetricSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#F5F5F0]/40 hover:text-white cursor-pointer"
                title="Clear search"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Quick Clear / Reset if filtering */}
          {(metricSearchQuery || selectedEcologicalZone !== 'all') && (
            <button
              id="reset-search-filters-btn"
              type="button"
              onClick={() => {
                setMetricSearchQuery('');
                setSelectedEcologicalZone('all');
                audioFeedback.playMicroTick();
              }}
              className="px-3 py-2 bg-[#1A1812] hover:bg-[#2A2418] border border-[#C5A059]/40 text-[#C5A059] text-xs font-mono rounded-sm flex items-center gap-1.5 transition-colors cursor-pointer shrink-0"
            >
              <X className="w-3 h-3" />
              <span>Reset Filters ({filteredBioregions.length + filteredCivilizationMetrics.length} matches)</span>
            </button>
          )}
        </div>

        {/* Ecological Zone Chips Filter */}
        <div className="flex items-center gap-2 flex-wrap text-xs font-mono">
          <span className="text-[#F5F5F0]/50 text-[11px] font-bold uppercase tracking-wider shrink-0 flex items-center gap-1">
            <SlidersHorizontal className="w-3 h-3 text-[#C5A059]" />
            <span>Ecological Zones:</span>
          </span>
          {[
            { id: 'all', label: 'All Zones' },
            { id: 'savanna', label: 'Savanna Grasslands' },
            { id: 'montane', label: 'Montane Cloud Forest' },
            { id: 'lakes', label: 'Endorheic Lakes' },
            { id: 'arid', label: 'Arid Sun Belt' },
            { id: 'rainforest', label: 'Tropical Rainforest' },
            { id: 'mangrove', label: 'Tidal Mangrove' }
          ].map(zone => {
            const isSelected = selectedEcologicalZone === zone.id;
            return (
              <button
                key={zone.id}
                type="button"
                onClick={() => {
                  setSelectedEcologicalZone(zone.id);
                  audioFeedback.playMicroTick();
                }}
                className={`px-2.5 py-1 rounded-sm border text-[10px] font-mono transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-[#2A2312] border-[#C5A059] text-[#C5A059] font-bold shadow-xs ring-1 ring-[#C5A059]/40'
                    : 'bg-[#141414] border-[#F5F5F0]/10 text-[#F5F5F0]/60 hover:text-[#F5F5F0] hover:border-[#F5F5F0]/20'
                }`}
              >
                {zone.label}
              </button>
            );
          })}
        </div>

        {/* Dynamic Search Results & Quick Selection Bar */}
        {(metricSearchQuery || selectedEcologicalZone !== 'all') && (
          <div className="pt-3 border-t border-[#F5F5F0]/10 space-y-2.5 animate-in fade-in">
            <div className="flex items-center justify-between text-[11px] font-mono text-[#F5F5F0]/60">
              <span>Matching Bioregions ({filteredBioregions.length}):</span>
              <span className="text-[10px] text-[#C5A059]">Click a bioregion to set as active in chart</span>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              {filteredBioregions.length > 0 ? (
                filteredBioregions.map(b => {
                  const isCurActive = selectedBioregions.includes(b.id);
                  return (
                    <button
                      key={b.id}
                      type="button"
                      onClick={() => {
                        setSelectedBioregions([b.id]);
                        setActiveTab('flourishing-vs-stability');
                        audioFeedback.playMicroTick();
                      }}
                      className={`px-2.5 py-1.5 rounded-sm border text-xs font-mono transition-all flex items-center gap-2 cursor-pointer ${
                        isCurActive
                          ? 'bg-emerald-950/80 border-emerald-400 text-emerald-200 font-bold ring-1 ring-emerald-400/40 shadow-sm'
                          : 'bg-[#141414] border-[#F5F5F0]/15 text-[#F5F5F0]/80 hover:text-white hover:border-[#C5A059]/50'
                      }`}
                    >
                      <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: b.color }} />
                      <span className="font-bold">{b.name}</span>
                      <span className="text-[10px] text-neutral-400 bg-black/40 px-1.5 py-0.2 rounded font-normal">{b.biome}</span>
                    </button>
                  );
                })
              ) : (
                <span className="text-xs font-mono text-neutral-500 italic">No bioregions match "{metricSearchQuery}" in {selectedEcologicalZone} zone.</span>
              )}
            </div>

            {filteredCivilizationMetrics.length > 0 && (
              <div className="pt-2">
                <div className="text-[11px] font-mono text-[#F5F5F0]/60 pb-1.5">
                  Matching Ecological Civilization Metrics ({filteredCivilizationMetrics.length}):
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  {filteredCivilizationMetrics.slice(0, 8).map(metric => (
                    <button
                      key={metric.id}
                      type="button"
                      onClick={() => {
                        setSelectedMetric(metric);
                        onInspectProvenance({
                          ...metric.provenance,
                          metricName: metric.name,
                          rawSensorReading: `${metric.value} ${metric.unit}`,
                          epistemicTier: metric.category.toUpperCase()
                        });
                        audioFeedback.playMicroTick();
                      }}
                      className="px-2 py-1 rounded bg-[#161B18] hover:bg-[#1f2622] border border-[#C5A059]/20 hover:border-[#C5A059] text-[11px] font-mono text-[#F5F5F0] flex items-center gap-1.5 transition-colors cursor-pointer"
                      title={`${metric.name} • ${metric.description} (Click to inspect provenance)`}
                    >
                      <span className="text-emerald-400">●</span>
                      <span>{metric.name}</span>
                      <span className="text-[9px] text-[#C5A059] font-bold">[{metric.category}]</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* View Switcher: Recharts Flourishing Timeline vs Restoration Mesh D3 vs Knowledge Graph Studio vs Interactive Causal D3 Graph vs Telemetry Matrix */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#F5F5F0]/10 pb-3">
        <div className="flex items-center gap-2 flex-wrap">
          {/* 8 Forms of Capital Treemap Tab */}
          <button
            id="tab-eight-forms-capital-btn"
            onClick={() => {
              setActiveTab('eight-forms-capital');
              audioFeedback.playMicroTick();
            }}
            className={`px-3.5 sm:px-4 py-2 rounded-sm text-xs font-mono font-bold flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'eight-forms-capital'
                ? 'bg-gradient-to-r from-emerald-500 via-amber-500 to-[#C5A059] text-black shadow-md'
                : 'bg-[#141414] text-emerald-400 hover:text-white border border-emerald-500/40'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>8 Forms of Capital (D3 Treemap)</span>
            <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-black/40 text-current font-bold uppercase">
              NEW D3
            </span>
          </button>

          {/* Flourishing vs Stability D3 Multi-Line Trend Chart Tab */}
          <button
            id="tab-flourishing-vs-stability-btn"
            onClick={() => {
              setActiveTab('flourishing-vs-stability');
              audioFeedback.playMicroTick();
            }}
            className={`px-3.5 sm:px-4 py-2 rounded-sm text-xs font-mono font-bold flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'flourishing-vs-stability'
                ? 'bg-[#C5A059] text-black shadow-md'
                : 'bg-[#141414] text-[#C5A059] hover:text-white border border-[#C5A059]/40'
            }`}
          >
            <Scale className="w-3.5 h-3.5" />
            <span>Flourishing vs Stability (12-Mo D3)</span>
            <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-black/30 text-current font-bold uppercase">
              Decoupling
            </span>
          </button>

          {/* Weekly Bioregional Synthesis Panel Tab */}
          <button
            id="tab-weekly-synthesis-btn"
            onClick={() => {
              setActiveTab('weekly-synthesis');
              audioFeedback.playMicroTick();
            }}
            className={`px-3.5 sm:px-4 py-2 rounded-sm text-xs font-mono font-bold flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'weekly-synthesis'
                ? 'bg-gradient-to-r from-emerald-500 via-teal-600 to-cyan-500 text-black shadow-md'
                : 'bg-[#141414] text-teal-300 hover:text-teal-200 border border-teal-500/40'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-teal-400" />
            <span>Weekly Synthesis (LLM)</span>
            <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-teal-950/80 text-teal-300 border border-teal-500/40 font-bold uppercase">
              SYNTHESIS
            </span>
          </button>

          {/* Spatial Density Heatmap Layer Tab */}
          <button
            id="tab-spatial-density-heatmap-btn"
            onClick={() => {
              setActiveTab('spatial-density-heatmap');
              audioFeedback.playMicroTick();
            }}
            className={`px-3.5 sm:px-4 py-2 rounded-sm text-xs font-mono font-bold flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'spatial-density-heatmap'
                ? 'bg-gradient-to-r from-emerald-500 via-teal-600 to-cyan-500 text-black shadow-md'
                : 'bg-[#141414] text-emerald-400 hover:text-emerald-300 border border-emerald-500/40'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Spatial Density Heatmap</span>
            <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-emerald-950/80 text-emerald-300 border border-emerald-500/40 font-bold uppercase">
              INDICATORS
            </span>
          </button>

          {/* Regenerative Drift Monitor Tab */}
          <button
            id="tab-regenerative-drift-btn"
            onClick={() => {
              setActiveTab('regenerative-drift');
              audioFeedback.playMicroTick();
            }}
            className={`px-3.5 sm:px-4 py-2 rounded-sm text-xs font-mono font-bold flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'regenerative-drift'
                ? 'bg-gradient-to-r from-amber-500 via-yellow-600 to-[#C5A059] text-black shadow-md'
                : 'bg-[#141414] text-amber-400 hover:text-amber-300 border border-amber-500/40'
            }`}
          >
            <Flame className="w-3.5 h-3.5" />
            <span>Regenerative Drift</span>
            <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-amber-950/80 text-amber-300 border border-amber-500/40 font-bold uppercase">
              WATCHDOG
            </span>
          </button>

          {/* Customizable Workspace Grid Tab */}
          <button
            id="tab-custom-grid-btn"
            onClick={() => {
              setActiveTab('custom-grid');
              setWorkspaceLayoutMode('custom_grid');
              audioFeedback.playMicroTick();
            }}
            className={`px-3.5 sm:px-4 py-2 rounded-sm text-xs font-mono font-bold flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'custom-grid'
                ? 'bg-[#C5A059] text-black shadow-md font-bold'
                : 'bg-[#141414] text-[#C5A059] hover:text-white border border-[#C5A059]/40'
            }`}
          >
            <Columns className="w-3.5 h-3.5" />
            <span>Custom Workspace</span>
            <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-black/40 text-current font-bold uppercase">
              DRAG &amp; DROP
            </span>
          </button>

          <button
            id="tab-community-feed-btn"
            onClick={() => {
              setActiveTab('community-feed');
              audioFeedback.playMicroTick();
            }}
            className={`px-3.5 sm:px-4 py-2 rounded-sm text-xs font-mono font-bold flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'community-feed'
                ? 'bg-gradient-to-r from-emerald-500 to-[#C5A059] text-black shadow-md'
                : 'bg-[#141414] text-emerald-300 hover:text-emerald-200 border border-emerald-500/30'
            }`}
          >
            <MessageSquareShare className="w-3.5 h-3.5" />
            <span>Community Impact (Feed)</span>
            <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-emerald-950/80 text-emerald-300 border border-emerald-500/40 font-bold">
              VERIFIED
            </span>
          </button>

          {/* Recharts Historical Trend Line Chart Tab */}
          <button
            id="tab-historical-trend-btn"
            onClick={() => {
              setActiveTab('historical-trend');
              audioFeedback.playMicroTick();
            }}
            className={`px-3.5 sm:px-4 py-2 rounded-sm text-xs font-mono font-bold flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'historical-trend'
                ? 'bg-gradient-to-r from-[#C5A059] via-amber-400 to-emerald-400 text-black shadow-md font-bold'
                : 'bg-[#141414] text-[#C5A059] hover:text-white border border-[#C5A059]/40'
            }`}
          >
            <LineChartIcon className="w-3.5 h-3.5" />
            <span>Historical Trends (Recharts)</span>
            <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-emerald-950/80 text-emerald-300 border border-emerald-500/40 font-bold uppercase">
              RECHARTS
            </span>
          </button>

          <button
            onClick={() => {
              setActiveTab('regenerative-progress');
              audioFeedback.playMicroTick();
            }}
            className={`px-3.5 sm:px-4 py-2 rounded-sm text-xs font-mono font-bold flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'regenerative-progress'
                ? 'bg-[#C5A059] text-black shadow-md'
                : 'bg-[#141414] text-[#F5F5F0]/70 hover:text-white border border-[#F5F5F0]/10'
            }`}
          >
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Regenerative Progress (D3)</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('restoration-mesh');
              audioFeedback.playMicroTick();
            }}
            className={`px-3.5 sm:px-4 py-2 rounded-sm text-xs font-mono font-bold flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'restoration-mesh'
                ? 'bg-[#C5A059] text-black shadow-md'
                : 'bg-[#141414] text-[#F5F5F0]/70 hover:text-white border border-[#F5F5F0]/10'
            }`}
          >
            <GitBranch className="w-3.5 h-3.5" />
            <span>Restoration Mesh (Project ➔ Index)</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('knowledge-studio');
              audioFeedback.playMicroTick();
            }}
            className={`px-3.5 sm:px-4 py-2 rounded-sm text-xs font-mono font-bold flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'knowledge-studio'
                ? 'bg-[#C5A059] text-black shadow-md'
                : 'bg-[#141414] text-[#F5F5F0]/70 hover:text-white border border-[#F5F5F0]/10'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Knowledge Graph Studio</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('flourishing-timeline');
              audioFeedback.playMicroTick();
            }}
            className={`px-3.5 sm:px-4 py-2 rounded-sm text-xs font-mono font-bold flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'flourishing-timeline'
                ? 'bg-[#C5A059] text-black shadow-md'
                : 'bg-[#141414] text-[#F5F5F0]/70 hover:text-white border border-[#F5F5F0]/10'
            }`}
          >
            <LineChartIcon className="w-3.5 h-3.5" />
            <span>Human Flourishing (Timeline)</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('causal-graph');
              audioFeedback.playMicroTick();
            }}
            className={`px-3.5 sm:px-4 py-2 rounded-sm text-xs font-mono font-bold flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'causal-graph'
                ? 'bg-[#C5A059] text-black shadow-md'
                : 'bg-[#141414] text-[#F5F5F0]/70 hover:text-white border border-[#F5F5F0]/10'
            }`}
          >
            <GitBranch className="w-3.5 h-3.5" />
            <span>5-Level Causal D3</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('bioregional-map');
              audioFeedback.playMicroTick();
            }}
            className={`px-3.5 sm:px-4 py-2 rounded-sm text-xs font-mono font-bold flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'bioregional-map'
                ? 'bg-[#C5A059] text-black shadow-md'
                : 'bg-[#141414] text-[#F5F5F0]/70 hover:text-white border border-[#F5F5F0]/10'
            }`}
          >
            <Globe2 className="w-3.5 h-3.5" />
            <span>Bioregional Impact Map (D3)</span>
          </button>

          {/* Split-Pane Bioregional Comparison Mode Tab */}
          <button
            id="tab-split-pane-compare-btn"
            onClick={() => {
              setIsCompareModeOpen(false);
              setActiveTab('split-pane-compare');
              audioFeedback.playMicroTick();
            }}
            className={`px-3.5 sm:px-4 py-2 rounded-sm text-xs font-mono font-bold flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'split-pane-compare'
                ? 'bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 text-black shadow-md font-bold'
                : 'bg-[#141414] text-cyan-300 hover:text-cyan-200 border border-cyan-500/40'
            }`}
          >
            <Columns className="w-3.5 h-3.5 text-cyan-400" />
            <span>Split-Pane Bioregional Compare</span>
            <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-cyan-950/80 text-cyan-300 border border-cyan-500/40 font-bold uppercase">
              SYNCED SLIDERS
            </span>
          </button>

          {/* Predictive Forecasting Tab */}
          <button
            id="tab-predictive-forecasting-btn"
            onClick={() => {
              setActiveTab('predictive-forecasting');
              setIsPredictiveForecastingEnabled(true);
              audioFeedback.playMicroTick();
            }}
            className={`px-3.5 sm:px-4 py-2 rounded-sm text-xs font-mono font-bold flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'predictive-forecasting'
                ? 'bg-gradient-to-r from-purple-500 via-indigo-500 to-teal-500 text-black shadow-md font-bold'
                : 'bg-[#141414] text-purple-300 hover:text-purple-200 border border-purple-500/40'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-purple-400" />
            <span>Predictive Forecasting (Next Qtr)</span>
            <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-purple-950/80 text-purple-300 border border-purple-500/40 font-bold uppercase">
              OLS REGRESSION
            </span>
          </button>

          <button
            onClick={() => {
              setActiveTab('hazard-monitor');
              audioFeedback.playMicroTick();
            }}
            className={`px-3.5 sm:px-4 py-2 rounded-sm text-xs font-mono font-bold flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'hazard-monitor'
                ? 'bg-[#C5A059] text-black shadow-md'
                : 'bg-[#141414] text-[#F5F5F0]/70 hover:text-white border border-[#F5F5F0]/10'
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
            <span>Hazard Monitor (Satellite)</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('telemetry-grid');
              audioFeedback.playMicroTick();
            }}
            className={`px-3.5 sm:px-4 py-2 rounded-sm text-xs font-mono font-bold flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'telemetry-grid'
                ? 'bg-[#C5A059] text-black shadow-md'
                : 'bg-[#141414] text-[#F5F5F0]/70 hover:text-white border border-[#F5F5F0]/10'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Epistemic Matrix Grid</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('collaborative-teams');
              audioFeedback.playMicroTick();
            }}
            className={`px-3.5 sm:px-4 py-2 rounded-sm text-xs font-mono font-bold flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'collaborative-teams'
                ? 'bg-[#C5A059] text-black shadow-md'
                : 'bg-[#141414] text-[#F5F5F0]/70 hover:text-white border border-[#F5F5F0]/10'
            }`}
          >
            <Users className="w-3.5 h-3.5 text-emerald-400" />
            <span>Collaborative Teams</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('impact-story');
              audioFeedback.playMicroTick();
            }}
            className={`px-3.5 sm:px-4 py-2 rounded-sm text-xs font-mono font-bold flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'impact-story'
                ? 'bg-[#C5A059] text-black shadow-md'
                : 'bg-[#141414] text-[#F5F5F0]/70 hover:text-white border border-[#F5F5F0]/10'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-[#C5A059]" />
            <span>Impact Story Generator</span>
          </button>
        </div>

        <div className="hidden lg:flex items-center gap-2 text-xs font-mono text-[#F5F5F0]/50">
          <span>Epistemic Hierarchy:</span>
          <span className="text-[#C5A059] font-bold">REALITY ➔ DATA ➔ MODEL ➔ DECISION</span>
        </div>
      </div>

      {/* 8 Forms of Capital Interactive D3 Treemap Tab */}
      {activeTab === 'eight-forms-capital' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <EightFormsCapitalTreemap onInspectProvenance={onInspectProvenance} />
        </div>
      )}

      {/* Primary Tab: D3 Multi-Line 12-Month Trend Comparison: Ecological Flourishing vs Economic Stability */}
      {activeTab === 'flourishing-vs-stability' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          {/* Audio Alchemist Soundscape Active HUD */}
          {isAudioAlchemistActive && (
            <div className="p-3 bg-gradient-to-r from-amber-950/80 via-[#18140C] to-emerald-950/80 border border-[#C5A059]/60 rounded text-xs font-mono shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 animate-in fade-in">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-full bg-[#C5A059]/20 border border-[#C5A059] flex items-center justify-center text-[#C5A059]">
                  <Radio className="w-4 h-4 animate-spin text-[#C5A059]" />
                </div>
                <div>
                  <div className="text-[#C5A059] font-bold flex items-center gap-2">
                    <span>AUDIO ALCHEMIST SOUNDSCAPE</span>
                    <span className="text-[9px] px-1.5 py-0.2 rounded bg-amber-900/60 text-amber-200 border border-amber-500/40">
                      LIVE ORGANIC MODULATION
                    </span>
                  </div>
                  <div className="text-[11px] text-[#F5F5F0]/60">
                    Fundamental: <strong>108 Hz</strong> (Earth Subharmonic) • Data Variance Harmonic Tuning
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 flex-wrap">
                {/* Volume slider */}
                <div className="flex items-center gap-1.5 bg-[#0A0D0B] px-2.5 py-1 rounded border border-[#F5F5F0]/10 text-[10px]">
                  <span className="text-[#F5F5F0]/50">VOL:</span>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.05"
                    value={audioAlchemistVolume}
                    onChange={(e) => {
                      const v = parseFloat(e.target.value);
                      setAudioAlchemistVolume(v);
                      audioAlchemist.setVolume(v);
                    }}
                    className="w-16 h-1 accent-[#C5A059] cursor-pointer"
                  />
                  <span className="text-[#C5A059] font-mono">{Math.round(audioAlchemistVolume * 100)}%</span>
                </div>

                {/* Trigger Solfeggio Chime */}
                <button
                  type="button"
                  onClick={() => {
                    audioAlchemist.triggerChime(1.0, true);
                    audioFeedback.playMicroTick();
                  }}
                  className="px-2.5 py-1 bg-[#1F190D] hover:bg-[#2F2514] border border-[#C5A059]/60 text-[#C5A059] hover:text-white rounded text-[10px] font-mono font-bold flex items-center gap-1 cursor-pointer transition-colors"
                  title="Trigger Solfeggio Transmutation Overtones (528 Hz Love/Transformation Harmonic)"
                >
                  <Sparkles className="w-3 h-3 text-[#C5A059]" />
                  <span>528Hz Chime</span>
                </button>

                <button
                  type="button"
                  onClick={handleToggleAudioAlchemist}
                  className="px-2 py-1 bg-[#141414] hover:bg-[#202020] border border-[#F5F5F0]/15 text-[#F5F5F0]/70 hover:text-white rounded text-[10px] font-mono cursor-pointer"
                >
                  Mute
                </button>
              </div>
            </div>
          )}

          {/* Epistemic Forecast Active HUD Banner */}
          {isPredictiveForecastingEnabled && (
            <div className="p-3 bg-gradient-to-r from-cyan-950/70 via-teal-950/60 to-emerald-950/70 border border-cyan-500/50 rounded text-xs font-mono shadow-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 animate-in fade-in">
              <div className="flex items-center gap-2 text-cyan-200">
                <Sparkles className="w-4 h-4 text-cyan-400 animate-spin" />
                <span>
                  <strong className="text-white">EPISTEMIC FORECAST ACTIVE:</strong> Gemini 3.8 Flash multi-horizon reasoning projecting Months 13–18 trajectory based on covenant restoration velocity.
                </span>
              </div>
              <div className="flex items-center gap-2 text-[10px] text-cyan-300 font-bold">
                <span className="px-2 py-0.5 rounded bg-cyan-900/60 border border-cyan-400/40">HORIZON: 6 MONTHS</span>
                <span className="px-2 py-0.5 rounded bg-emerald-900/60 text-emerald-200 border border-emerald-400/40">CI: 95% CONE</span>
              </div>
            </div>
          )}

          {/* Celestial Alignment Active Notice Banner */}
          {isCelestialAlignment && (
            <div className="p-3 bg-gradient-to-r from-amber-950/70 via-sky-950/60 to-purple-950/70 border border-[#C5A059]/60 rounded text-xs font-mono flex items-center justify-between shadow-lg animate-in fade-in">
              <div className="flex items-center gap-2 text-amber-200">
                <Star className="w-4 h-4 text-[#C5A059] animate-pulse fill-[#C5A059]" />
                <span>
                  <strong className="text-white">CELESTIAL ALIGNMENT ACTIVE:</strong> 12 Bioregional Historical Milestones are mapped as the constellation <em>Via Regeneratio</em> across cosmic coordinates.
                </span>
              </div>
              <button
                type="button"
                onClick={() => {
                  window.dispatchEvent(new CustomEvent('open-star-map'));
                  audioFeedback.playCovenantResonance();
                }}
                className="px-2.5 py-1 bg-[#1A1812] hover:bg-[#2A2418] border border-[#C5A059] text-[#C5A059] hover:text-white rounded text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 cursor-pointer transition-colors"
              >
                <span>Launch Star Map</span>
                <span>→</span>
              </button>
            </div>
          )}

          {/* Stardust Ritual Cleanse Success Notice */}
          {ritualCleanseSuccess && (
            <div className="p-2.5 bg-emerald-950/70 border border-emerald-500/60 rounded text-xs font-mono text-emerald-300 flex items-center gap-2 animate-in fade-in">
              <Sparkles className="w-4 h-4 text-emerald-400" />
              <span>{ritualCleanseSuccess}</span>
            </div>
          )}

          {workspaceLayoutMode === 'custom_grid' ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-[#111613] border border-[#C5A059]/40 rounded text-xs font-mono">
                <div className="flex items-center gap-2">
                  <Columns className="w-4 h-4 text-[#C5A059]" />
                  <span className="text-white font-bold">CUSTOMIZABLE DRAG-AND-DROP WORKSPACE ACTIVE</span>
                  <span className="text-[#F5F5F0]/60 hidden sm:inline">• Drag widgets by their handle, resize column spans, and arrange your tailored view</span>
                </div>
                <button
                  type="button"
                  onClick={() => setWorkspaceLayoutMode('standard')}
                  className="px-2.5 py-1 bg-[#1A1A1A] hover:bg-[#252525] border border-[#F5F5F0]/20 text-[#F5F5F0]/80 hover:text-white rounded text-[11px] cursor-pointer"
                >
                  Return to Standard Layout
                </button>
              </div>
              <CustomizableDashboardGrid renderWidget={renderCustomGridWidget} />
            </div>
          ) : (
            <>
              {/* Interactive 24-Month Temporal Slider */}
              <TemporalSlider
                activeEpochIndex={temporalEpochIndex + 1}
                onEpochChange={(pt) => {
                  setTemporalEpochIndex(pt.monthIndex - 1);
                  audioFeedback.playMicroTick();
                }}
                onInspectPoint={(epoch) => {
                  onInspectProvenance({
                    ...SAMPLE_PROVENANCE,
                    metricName: `Temporal Epoch: ${epoch.calendarDate} (${epoch.label})`,
                    verificationHash: epoch.cryptographicHash,
                    rawSensorReading: `Ecological: ${epoch.ecologicalFlourishing}% • Economic: ${epoch.economicStability}% (Decoupling: +${epoch.decouplingMargin}%)`,
                    confidenceInterval: `±0.7% verified across ${epoch.verifiedSensors} IoT sensor pods`,
                    epistemicTier: epoch.isProjected ? 'Gemini 3.8 Multi-Horizon Predictive Cone' : 'Zero-Knowledge Bioregional Consensus'
                  });
                }}
              />

              {/* Planetary Pulse D3 Animated Waveform & Biospheric Vital Signs */}
              <PlanetaryPulseVisualizer 
                ecologicalFlourishing={currentEpoch?.ecologicalFlourishing ?? 92.4}
                economicStability={currentEpoch?.economicStability ?? 89.2}
                bioregionName={COMPARATIVE_BIOREGIONS.find(b => selectedBioregions.includes(b.id))?.name || 'Pan-African Green Corridor'}
                isPurified={isDataPurified}
              />

              <FlourishingVsStabilityD3Chart 
                timeRange={timeRange}
                onTimeRangeChange={setTimeRange}
                isNormalized={isNormalized}
                onNormalizeChange={setIsNormalized}
                selectedBioregions={selectedBioregions}
                onBioregionsChange={setSelectedBioregions}
                isConfidenceIntervalActive={isConfidenceIntervalActive}
                onConfidenceIntervalToggle={setIsConfidenceIntervalActive}
                onAddBioregionClick={() => setIsComparatorModalOpen(true)}
                triggerInsightsCounter={triggerInsightsCounter}
                isCelestialAlignment={isCelestialAlignment}
                onToggleCelestialAlignment={setIsCelestialAlignment}
                isDataPurified={isDataPurified}
                onPurifiedChange={setIsDataPurified}
                isRitualCleansing={isRitualCleansing}
                onTriggerRitualCleanse={handleTriggerRitualCleanse}
                showPredictiveForecast={isPredictiveForecastingEnabled}
                onPredictiveForecastChange={setIsPredictiveForecastingEnabled}
                showHistoricalComparison={isCompareHistorical}
                onHistoricalComparisonChange={setIsCompareHistorical}
                alertThreshold={alertThreshold}
                onAlertThresholdChange={handleSaveAlertConfig}
                onOpenEpistemicObservation={handleOpenEpistemicObservation}
                onSelectTab={onSelectTab}
                onInspectPoint={(pt) => {
                  onInspectProvenance({
                    ...SAMPLE_PROVENANCE,
                    metricName: `12-Month Trajectory: ${pt.monthLabel}`,
                    verificationHash: pt.cryptographicHash,
                    rawSensorReading: `Ecological: ${pt.ecologicalFlourishing}% • Economic: ${pt.economicStability}% (Decoupling: +${pt.decouplingMargin}%)`,
                    confidenceInterval: `±0.8% across ${pt.verifiedSensorCount} cryptographic sensor nodes`,
                    epistemicTier: 'Zero-Knowledge Multi-Spectral Mesh'
                  });
                }}
                onInspectProvenance={onInspectProvenance}
                onOpenMoralSimulator={onOpenMoralSimulator}
              />

              {/* Regenerative Drift Monitor Watchdog */}
              <RegenerativeDriftMonitor
                onSelectBioregion={(id) => {
                  setSelectedBioregions([id]);
                  audioFeedback.playMicroTick();
                }}
                onInspectProvenance={onInspectProvenance}
              />

              {/* Weekly Bioregional Synthesis Panel: LLM Synthesis of Ecological Shifts */}
              <div className="pt-2">
                <WeeklyBioregionalSynthesisPanel
                  activeBioregionId={selectedBioregions[0] || 'pan-african'}
                  activeBioregionName={activeBioregionObj?.name || 'Pan-African Biome'}
                  timeHorizon="Trailing 7-Day & 12-Month Longitudinal Trajectory"
                />
              </div>
            </>
          )}

          {/* Integrated Predictive Trend Forecasting Panel when enabled */}
          {isPredictiveForecastingEnabled && (
            <div className="pt-2">
              <PredictiveForecastingSection
                isEnabled={isPredictiveForecastingEnabled}
                onToggle={setIsPredictiveForecastingEnabled}
                selectedMetric={selectedMetric}
                metricsList={CIVILIZATION_METRICS}
                onSelectMetric={setSelectedMetric}
                onInspectProvenance={onInspectProvenance}
              />
            </div>
          )}
        </div>
      )}

      {/* Primary Tab: Dedicated Weekly Bioregional Synthesis View */}
      {activeTab === 'weekly-synthesis' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <WeeklyBioregionalSynthesisPanel
            activeBioregionId={selectedBioregions[0] || 'pan-african'}
            activeBioregionName={activeBioregionObj?.name || 'Pan-African Biome'}
            timeHorizon="Trailing 7-Day & 12-Month Longitudinal Trajectory"
          />
        </div>
      )}

      {/* Primary Tab: Community Impact Social Feed */}
      {activeTab === 'community-feed' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <CommunityImpactFeed />
        </div>
      )}

      {/* Primary Tab: Recharts Historical Regenerative Progress Trend Line Chart */}
      {activeTab === 'historical-trend' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <HistoricalRegenerativeTrendChart onInspectProvenance={onInspectProvenance} />
        </div>
      )}

      {/* Primary Tab: D3 Longitudinal Regenerative Progress Chart */}
      {activeTab === 'regenerative-progress' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          {/* View switcher between Recharts Historical Trend and D3 Detail */}
          <div className="flex items-center justify-between bg-[#111412] p-3 rounded-sm border border-[#C5A059]/40 flex-wrap gap-2">
            <div className="flex items-center gap-2 text-xs font-mono">
              <span className="text-[#C5A059] font-bold uppercase">Engine:</span>
              <button
                type="button"
                onClick={() => {
                  setRegenerativeViewStyle('recharts_trend');
                  audioFeedback.playMicroTick();
                }}
                className={`px-3 py-1 rounded-xs text-xs font-mono font-bold cursor-pointer transition-colors ${
                  regenerativeViewStyle === 'recharts_trend'
                    ? 'bg-[#C5A059] text-black shadow-sm'
                    : 'bg-[#141414] text-[#F5F5F0]/70 hover:text-white border border-[#F5F5F0]/10'
                }`}
              >
                Recharts Historical Trend Line
              </button>
              <button
                type="button"
                onClick={() => {
                  setRegenerativeViewStyle('d3_detail');
                  audioFeedback.playMicroTick();
                }}
                className={`px-3 py-1 rounded-xs text-xs font-mono font-bold cursor-pointer transition-colors ${
                  regenerativeViewStyle === 'd3_detail'
                    ? 'bg-[#C5A059] text-black shadow-sm'
                    : 'bg-[#141414] text-[#F5F5F0]/70 hover:text-white border border-[#F5F5F0]/10'
                }`}
              >
                D3 Longitudinal Geometry
              </button>
            </div>
            <span className="text-[10px] font-mono text-[#F5F5F0]/50 hidden sm:inline">
              Multi-Metric Longitudinal Tracking (2022–2026)
            </span>
          </div>

          {regenerativeViewStyle === 'recharts_trend' ? (
            <HistoricalRegenerativeTrendChart onInspectProvenance={onInspectProvenance} />
          ) : (
            <RegenerativeProgressD3Chart onInspectPoint={onInspectProvenance} />
          )}
        </div>
      )}

      {/* Primary Tab: D3 Global Restoration Network Graph */}
      {activeTab === 'restoration-mesh' && (
        <div className="space-y-6">
          <ProjectFlourishingD3Network onInspectProvenance={onInspectProvenance} />
        </div>
      )}

      {/* Primary Tab: D3 Knowledge Graph Studio */}
      {activeTab === 'knowledge-studio' && (
        <div className="space-y-6">
          <KnowledgeGraphStudio onInspectProvenance={onInspectProvenance} />
        </div>
      )}

      {/* Primary Tab 1: Recharts Human Flourishing Timeline */}
      {activeTab === 'flourishing-timeline' && (
        <div className="space-y-6">
          <HumanFlourishingTimelineChart onInspectProvenance={onInspectProvenance} />
        </div>
      )}

      {/* Primary Tab: D3 Bioregional Geographic Impact Map */}
      {activeTab === 'bioregional-map' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <BioregionalImpactD3Map 
            heatmapMode={heatmapMode}
            onHeatmapModeChange={setHeatmapMode}
            onInspectProvenance={onInspectProvenance}
          />
        </div>
      )}

      {/* Primary Tab: Split-Pane Bioregional Comparison Mode */}
      {activeTab === 'split-pane-compare' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <BioregionalSplitPaneView onInspectProvenance={onInspectProvenance} />
        </div>
      )}

      {/* Primary Tab: Dedicated Predictive Forecasting Engine */}
      {activeTab === 'predictive-forecasting' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <PredictiveForecastingSection
            isEnabled={isPredictiveForecastingEnabled}
            onToggle={setIsPredictiveForecastingEnabled}
            selectedMetric={selectedMetric}
            metricsList={CIVILIZATION_METRICS}
            onSelectMetric={setSelectedMetric}
            onInspectProvenance={onInspectProvenance}
          />
        </div>
      )}

      {/* Primary Tab: Real-Time Bioregional Hazard Monitor */}
      {activeTab === 'hazard-monitor' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <BioregionalHazardMonitor />
        </div>
      )}

      {/* Primary Tab 2: D3 Causal Impact Graph */}
      {activeTab === 'causal-graph' && (
        <div className="space-y-6">
          <CausalImpactD3Graph />
        </div>
      )}

      {/* Primary Tab 3: The 5 Layer Architecture & Telemetry Grid */}
      {activeTab === 'telemetry-grid' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between pt-4 border-t border-[#F5F5F0]/10">
            <span className="text-xs font-mono uppercase tracking-widest text-[#C5A059] font-bold">
              Civilizational Telemetry Nodes (By Intelligence Layer)
            </span>
            <span className="text-xs font-mono text-[#F5F5F0]/50">
              Click layer to filter telemetry
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {INTELLIGENCE_LAYERS.map((layer) => {
              const isSelected = layer.id === selectedLayerId;
              return (
                <button
                  key={layer.id}
                  onClick={() => {
                    setSelectedLayerId(layer.id);
                    if (CIVILIZATION_METRICS.length > 0) setSelectedMetric(CIVILIZATION_METRICS[0]);
                    audioFeedback.playMicroTick();
                  }}
                  className={`p-4 rounded-sm border text-left transition-all space-y-2 ${
                    isSelected
                      ? 'bg-[#0D0D0D] border-[#C5A059] text-[#F5F5F0] shadow-md ring-1 ring-[#C5A059]/40'
                      : 'bg-[#080808] border-[#F5F5F0]/10 text-[#F5F5F0]/60 hover:border-[#C5A059]/40'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[9px] font-mono uppercase text-[#8FB8DE] font-bold">{layer.code}</span>
                    <span className="text-[10px] font-mono text-emerald-400">{layer.activeNodes.toLocaleString()} Nodes</span>
                  </div>
                  <div className="text-xs font-serif font-bold text-[#F5F5F0]">{layer.name}</div>
                  <p className="text-[11px] text-[#F5F5F0]/50 line-clamp-2 font-sans">{layer.descriptor}</p>
                </button>
              );
            })}
          </div>

          {/* Main Metrics Dashboard + Provenance Inspector Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Metrics Grid for Selected Layer (2 Cols) */}
            <div className="lg:col-span-2 space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-[#F5F5F0]/10">
                <div className="space-y-0.5">
                  <span className="text-[10px] font-mono uppercase text-[#C5A059] font-bold tracking-[0.2em]">{activeLayer.name}</span>
                  <h2 className="text-lg font-serif text-[#F5F5F0]">Telemetry Readings & Verified Targets</h2>
                </div>
                <span className="text-xs font-mono text-[#F5F5F0]/40">Updated continuously via edge mesh</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {layerMetrics.map((metric) => {
                  const isSelected = selectedMetric.id === metric.id;
                  const numericVal = typeof metric.value === 'number' ? metric.value : parseFloat(String(metric.value).replace(/[^0-9.]/g, '')) || 85;
                  const progressPct = Math.min(100, Math.round(numericVal));

                  return (
                    <div
                      key={metric.id}
                      onClick={() => {
                        setSelectedMetric(metric);
                        audioFeedback.playMicroTick();
                      }}
                      className={`p-5 rounded-sm border cursor-pointer transition-all space-y-3 ${
                        isSelected
                          ? 'bg-[#0D0D0D] border-[#C5A059] shadow-lg ring-1 ring-[#C5A059]/40'
                          : 'bg-[#080808] border-[#F5F5F0]/10 hover:border-[#C5A059]/40'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className={`text-[9px] uppercase font-mono px-2 py-0.5 rounded-sm font-bold ${
                          metric.status === 'verified' ? 'bg-[#1B3022] text-emerald-400 border border-emerald-500/30' :
                          metric.status === 'observed' ? 'bg-[#8FB8DE]/15 text-[#8FB8DE] border border-[#8FB8DE]/30' :
                          'bg-[#C5A059]/15 text-[#C5A059] border border-[#C5A059]/30'
                        }`}>
                          {metric.status}
                        </span>
                        <span className="text-xs font-mono text-[#F5F5F0]/50">Trend: +{metric.trend}%</span>
                      </div>

                      <div className="space-y-1">
                        <h3 className="text-sm font-serif text-[#F5F5F0]">{metric.name}</h3>
                        <div className="flex items-baseline gap-2">
                          <span className="text-2xl font-bold font-mono text-emerald-400">{metric.value}</span>
                          <span className="text-xs font-mono text-[#F5F5F0]/50">{metric.unit}</span>
                        </div>
                      </div>

                      <div className="space-y-1">
                        <div className="w-full h-1 bg-[#0A0A0A] rounded-full overflow-hidden">
                          <div className="h-full bg-emerald-400" style={{ width: `${progressPct}%` }} />
                        </div>
                        <div className="flex justify-between text-[10px] font-mono text-[#F5F5F0]/40">
                          <span>Category: {metric.category}</span>
                          <span className="text-emerald-400">{metric.provenance.certaintyScore}% Confirmed</span>
                        </div>
                      </div>

                      {/* Small Data Quality & Sensor Provenance Badge */}
                      <div className="pt-2 border-t border-white/5 flex items-center justify-between" onClick={(e) => e.stopPropagation()}>
                        <DataQualityBadge
                          confidenceScore={metric.provenance.certaintyScore}
                          source={metric.provenance.source}
                          cryptographicHash={metric.provenance.cryptographicHash}
                          metricName={metric.name}
                          size="xs"
                          onInspectProvenance={() => onInspectProvenance(metric.provenance)}
                        />
                        <span className="text-[10px] font-mono text-white/40">
                          Provenance Verified
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Selected Metric Provenance Inspector (1 Col) */}
            <div className="p-6 rounded-sm bg-[#0D0D0D] border border-[#F5F5F0]/10 flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-[#F5F5F0]/10">
                  <span className="text-[10px] font-mono uppercase text-[#C5A059] font-bold tracking-[0.2em] flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                    Epistemic Data Audit Trail
                  </span>
                  <span className="text-[9px] font-mono px-2 py-0.5 bg-[#1B3022] text-emerald-400 rounded-sm border border-emerald-500/30 font-bold">
                    100% Audited
                  </span>
                </div>

                <div className="space-y-1">
                  <div className="text-[10px] uppercase font-mono text-[#F5F5F0]/40">Auditing Metric</div>
                  <h3 className="text-sm font-serif text-[#F5F5F0]">{selectedMetric.name}</h3>
                  <p className="text-xs text-[#F5F5F0]/60 mt-1 font-sans">{selectedMetric.description}</p>
                </div>

                {/* Data Quality & Provenance Rating Card */}
                <div className="p-3 bg-[#0A110D] border border-emerald-500/30 rounded-sm space-y-2">
                  <div className="text-[10px] uppercase font-mono text-emerald-300 font-bold flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                      Sensor Data Quality Rating
                    </span>
                    <span className="text-[9px] font-mono text-emerald-400/80">
                      {selectedMetric.provenance.certaintyScore}% Confirmed
                    </span>
                  </div>
                  <DataQualityBadge
                    confidenceScore={selectedMetric.provenance.certaintyScore}
                    source={selectedMetric.provenance.source}
                    cryptographicHash={selectedMetric.provenance.cryptographicHash}
                    metricName={selectedMetric.name}
                    size="md"
                    onInspectProvenance={() => onInspectProvenance(selectedMetric.provenance)}
                  />
                </div>

                <div className="space-y-3 pt-2 font-mono text-xs">
                  <div className="p-3 bg-[#080808] border border-[#F5F5F0]/10 rounded-sm space-y-1">
                    <div className="text-[10px] text-[#F5F5F0]/40 uppercase">Sensor Ingestion Source</div>
                    <div className="text-xs text-[#F5F5F0]">{selectedMetric.provenance.source}</div>
                  </div>

                  <div className="p-3 bg-[#080808] border border-[#F5F5F0]/10 rounded-sm space-y-1">
                    <div className="text-[10px] text-[#F5F5F0]/40 uppercase">Independent Verifier</div>
                    <div className="text-xs text-emerald-400 font-bold">{selectedMetric.provenance.verifier}</div>
                    <div className="text-[10px] text-[#F5F5F0]/50">{selectedMetric.provenance.verifierRole}</div>
                  </div>

                  <div className="p-3 bg-[#080808] border border-[#F5F5F0]/10 rounded-sm space-y-1">
                    <div className="text-[10px] text-[#F5F5F0]/40 uppercase">Mathematical Calculation Method</div>
                    <div className="text-[11px] text-[#F5F5F0]/70 font-sans leading-relaxed">{selectedMetric.provenance.calculationMethod}</div>
                  </div>
                </div>
              </div>

              <div className="space-y-2 pt-4 border-t border-[#F5F5F0]/10">
                <button
                  onClick={() => {
                    onInspectProvenance(selectedMetric.provenance);
                    audioFeedback.playCovenantResonance();
                  }}
                  className="w-full py-2.5 bg-[#1B3022] hover:bg-[#254530] border border-[#C5A059]/40 text-[#F5F5F0] rounded-sm text-xs font-mono font-bold flex items-center justify-center gap-1.5 transition-colors uppercase tracking-wider cursor-pointer"
                >
                  <FileText className="w-3.5 h-3.5 text-emerald-400" />
                  Inspect Complete Cryptographic Record
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Primary Tab: Collaborative Stewardship Teams & Shared Badges */}
      {activeTab === 'collaborative-teams' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <CollaborativeStewardshipTeams />
        </div>
      )}

      {/* Primary Tab: Automated Impact Story Generator */}
      {activeTab === 'impact-story' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <ImpactStoryGenerator 
            stewardName="Amani Kiprono"
            reputationPoints={18450}
            verifiedAuditsSigned={34}
            earnedBadgeCount={8}
            hectaresRestored={420}
            litersProtectedMillions={18.4}
            carbonSequesteredTons={620}
            streakDays={14}
          />
        </div>
      )}

      {/* Dedicated Tab: Spatial Density Heatmap Layer */}
      {activeTab === 'spatial-density-heatmap' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <SpatialDensityHeatmapLayer
            activeIndicator={spatialDensityIndicator}
            onSelectIndicator={(indicator) => {
              setSpatialDensityIndicator(indicator);
              audioFeedback.playMicroTick();
            }}
            onSelectHotspot={(hotspot) => {
              setSelectedSpatialHotspot(hotspot);
              onInspectProvenance({
                ...SAMPLE_PROVENANCE,
                metricName: `Spatial Density Hotspot: ${hotspot.name} (${hotspot.bioregionName})`,
                verificationHash: hotspot.cryptographicHash || `0x${hotspot.id.replace(/-/g, '').slice(0, 16)}`,
                rawSensorReading: `Intensity: ${hotspot.intensity}% • Indicator: ${hotspot.indicator.toUpperCase()} • Stewards: ${hotspot.activeGuardians} active guardians`,
                confidenceInterval: `±0.5% spatial mesh resolution across ${hotspot.radiusKm}km perimeter`,
                epistemicTier: 'Multi-Spectral Geospatial Grid'
              });
            }}
          />
        </div>
      )}

      {/* Dedicated Tab: Regenerative Drift Monitor Watchdog */}
      {activeTab === 'regenerative-drift' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <RegenerativeDriftMonitor
            onSelectBioregion={(id) => {
              setSelectedBioregions([id]);
              setActiveTab('flourishing-vs-stability');
              audioFeedback.playMicroTick();
            }}
            onInspectProvenance={onInspectProvenance}
          />
        </div>
      )}

      {/* Dedicated Tab: Customizable Workspace Grid */}
      {activeTab === 'custom-grid' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-4 bg-[#111613] border border-[#C5A059]/40 rounded text-xs font-mono">
            <div className="flex items-center gap-2.5">
              <Columns className="w-5 h-5 text-[#C5A059]" />
              <div>
                <div className="text-white font-bold text-sm">PERSONALIZED DRAG-AND-DROP WORKSPACE</div>
                <div className="text-[#F5F5F0]/60 text-[11px]">
                  Arrange your metric cards, toggle widget sizes, and customize your analytical view. Changes are automatically saved to local storage.
                </div>
              </div>
            </div>
            <button
              type="button"
              onClick={() => {
                setActiveTab('flourishing-vs-stability');
                setWorkspaceLayoutMode('standard');
                audioFeedback.playMicroTick();
              }}
              className="px-3 py-1.5 bg-[#1C1C1C] hover:bg-[#2A2A2A] border border-[#F5F5F0]/20 text-[#F5F5F0] rounded text-xs font-mono font-bold cursor-pointer"
            >
              Standard 12-Mo View →
            </button>
          </div>
          <CustomizableDashboardGrid renderWidget={renderCustomGridWidget} />
        </div>
      )}

      {/* Bioregional Comparator Multi-Selection Modal */}
      <BioregionalComparatorModal
        isOpen={isComparatorModalOpen}
        onClose={() => setIsComparatorModalOpen(false)}
        selectedBioregionIds={selectedBioregions}
        onToggleBioregion={(id) => {
          if (selectedBioregions.includes(id)) {
            if (selectedBioregions.length > 1) {
              setSelectedBioregions(selectedBioregions.filter(b => b !== id));
            }
          } else {
            setSelectedBioregions([...selectedBioregions, id]);
          }
        }}
        onSelectAll={() => {
          setSelectedBioregions(COMPARATIVE_BIOREGIONS.map(b => b.id));
        }}
        onResetBaseline={() => {
          setSelectedBioregions(['pan-african']);
        }}
      />

      {/* Cryptographic Evidence Export Modal */}
      <EvidenceExportModal
        isOpen={isEvidenceExportModalOpen}
        onClose={() => setIsEvidenceExportModalOpen(false)}
        sessionMetrics={{
          bioregionName: activeBioregionObj.name,
          ecologicalFlourishing: latestDataPoint.ecologicalFlourishing,
          economicStability: latestDataPoint.economicStability,
          decouplingMargin: latestDataPoint.decouplingMargin,
          timeRange,
          sensorCount: 1248,
          isPurified: isDataPurified,
          isCelestialAlignment
        }}
        onNavigateToLedger={() => {
          if (onSelectTab) {
            onSelectTab('evidence-ledger');
          }
        }}
      />

      {/* Threshold Alert Configuration Modal */}
      <ThresholdAlertModal
        isOpen={isThresholdModalOpen}
        onClose={() => setIsThresholdModalOpen(false)}
        config={alertThreshold}
        onSaveConfig={handleSaveAlertConfig}
        currentMetrics={{
          latestEco: latestDataPoint.ecologicalFlourishing,
          latestEcon: latestDataPoint.economicStability,
          decouplingMargin: latestDataPoint.decouplingMargin
        }}
      />

      {/* Epistemic Observation Modal (Manual Notes to Evidence Ledger) */}
      <EpistemicObservationModal
        isOpen={isEpistemicObservationModalOpen}
        onClose={() => setIsEpistemicObservationModalOpen(false)}
        point={epistemicObservationTargetPoint}
        bioregionName={activeBioregionObj.name}
        bioregionId={activeBioregionObj.id}
        onNavigateToLedger={() => {
          if (onSelectTab) {
            onSelectTab('evidence-ledger');
          }
        }}
      />
    </div>
  );
};
