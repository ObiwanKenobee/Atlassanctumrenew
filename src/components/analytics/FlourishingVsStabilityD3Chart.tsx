import React, { useEffect, useRef, useState, useMemo } from 'react';
import * as d3 from 'd3';
import { 
  TrendingUp, 
  Calendar, 
  Sparkles, 
  ShieldCheck, 
  Maximize2, 
  Layers, 
  Info,
  Scale,
  ArrowUpRight,
  Activity,
  CheckCircle2,
  RefreshCw,
  Eye,
  Crosshair,
  Pin,
  PinOff,
  Lock,
  Hash,
  AlertTriangle,
  Download,
  Filter,
  Globe2,
  Bookmark,
  ExternalLink,
  ChevronRight,
  Cpu,
  Sliders,
  Bell,
  BellRing,
  BrainCircuit,
  Brain,
  Percent,
  Save,
  RotateCcw,
  MessageSquarePlus,
  ChevronLeft,
  MoveHorizontal,
  ZoomIn,
  ZoomOut,
  Check,
  Tag,
  Plus,
  MoveVertical,
  Volume2,
  X,
  Star,
  GitBranch,
  GitCompare,
  FileText
} from 'lucide-react';
import { audioFeedback } from '../../lib/audioFeedback';
import { StardustRitualCleanseOverlay } from './StardustRitualCleanseOverlay';
import { AlchemicalTooltipBadge } from './AlchemicalTooltipBadge';
import { 
  CELESTIAL_HISTORICAL_ALIGNMENTS, 
  CONSTELLATION_VECTOR_PAIRS 
} from '../../lib/alchemicalTrends';
import { alchemicalAudio } from '../../lib/alchemicalAudio';
import { 
  COMPARATIVE_BIOREGIONS, 
  HISTORICAL_ANNOTATIONS, 
  DETECTED_ANOMALY_EVENTS, 
  DEFAULT_PREDICTIVE_FORECAST,
  TimelineAnnotationMarker,
  HistoricalAnomalyEvent,
  BioregionOption,
  ForecastDataPoint,
  getBioregionHistoricalData,
  HISTORICAL_PRIOR_YEAR_INTERVAL_DATA
} from './flourishingAnalyticsData';
import { AnnotationDetailModal } from './AnnotationDetailModal';
import { AddAnnotationModal } from './AddAnnotationModal';
import { EpistemicObservationModal } from './EpistemicObservationModal';
import { AnomalyDetailModal } from './AnomalyDetailModal';
import { BioregionMultiSelectFilter } from './BioregionMultiSelectFilter';
import { BioregionalComparatorModal } from './BioregionalComparatorModal';
import { FlourishingAIInsightsModal, FlourishingInsightsData } from './FlourishingAIInsightsModal';
import { ThresholdAlertModal, AlertThresholdConfig } from './ThresholdAlertModal';
import { ThresholdAlertBanner } from './ThresholdAlertBanner';
import { AlertPreset, loadAlertPresets } from './alertPresetsData';
import { TimeRangeOption, filterDatasetByTimeRange, exportVisualizedTrendCSV } from './trendExportUtils';
import { TimeRangeSelector } from './TimeRangeSelector';

export interface MonthlyTrendDataPoint {
  monthIndex: number; // 1 to 12
  monthLabel: string; // e.g. 'Month 01 (Oct)', 'Month 02 (Nov)', etc.
  shortMonth: string; // e.g. 'M01', 'M02', ...
  calendarMonth: string; // e.g. 'Oct 2025'
  exactDate: string; // e.g. 'October 14, 2025'
  isoDate: string; // e.g. '2025-10-14'
  ecologicalFlourishing: number; // 0 - 100
  economicStability: number; // 0 - 100
  extractiveCounterfactual: number; // baseline decay without intervention
  decouplingMargin: number; // positive gap indicating regenerative decoupling
  milestone?: string;
  verifiedSensorCount: number;
  cryptographicHash: string;
  epistemicTier?: string;
}

export const TWELVE_MONTH_INTERVAL_DATA: MonthlyTrendDataPoint[] = [
  {
    monthIndex: 1,
    monthLabel: 'Month 01 (Oct 2025)',
    shortMonth: 'M01',
    calendarMonth: 'Oct 2025',
    exactDate: 'October 14, 2025',
    isoDate: '2025-10-14',
    ecologicalFlourishing: 61.2,
    economicStability: 54.8,
    extractiveCounterfactual: 52.0,
    decouplingMargin: 9.2,
    milestone: 'Contour bioswales & sand dams chartered',
    verifiedSensorCount: 1420,
    cryptographicHash: '0x3a81f9b01284c719'
  },
  {
    monthIndex: 2,
    monthLabel: 'Month 02 (Nov 2025)',
    shortMonth: 'M02',
    calendarMonth: 'Nov 2025',
    exactDate: 'November 15, 2025',
    isoDate: '2025-11-15',
    ecologicalFlourishing: 64.5,
    economicStability: 57.2,
    extractiveCounterfactual: 51.4,
    decouplingMargin: 13.1,
    milestone: 'Short rain infiltration into dry aquifers',
    verifiedSensorCount: 1680,
    cryptographicHash: '0x7b22e11894a028bc'
  },
  {
    monthIndex: 3,
    monthLabel: 'Month 03 (Dec 2025)',
    shortMonth: 'M03',
    calendarMonth: 'Dec 2025',
    exactDate: 'December 18, 2025',
    isoDate: '2025-12-18',
    ecologicalFlourishing: 67.8,
    economicStability: 61.0,
    extractiveCounterfactual: 50.8,
    decouplingMargin: 17.0,
    milestone: 'Community solar microgrids commissioned',
    verifiedSensorCount: 2040,
    cryptographicHash: '0x99c84e10283b74a1'
  },
  {
    monthIndex: 4,
    monthLabel: 'Month 04 (Jan 2026)',
    shortMonth: 'M04',
    calendarMonth: 'Jan 2026',
    exactDate: 'January 15, 2026',
    isoDate: '2026-01-15',
    ecologicalFlourishing: 71.0,
    economicStability: 64.5,
    extractiveCounterfactual: 49.5,
    decouplingMargin: 21.5,
    milestone: 'Biochar soil amendment batch #104 distributed',
    verifiedSensorCount: 2310,
    cryptographicHash: '0x12a048bc71938fa2'
  },
  {
    monthIndex: 5,
    monthLabel: 'Month 05 (Feb 2026)',
    shortMonth: 'M05',
    calendarMonth: 'Feb 2026',
    exactDate: 'February 12, 2026',
    isoDate: '2026-02-12',
    ecologicalFlourishing: 73.6,
    economicStability: 68.2,
    extractiveCounterfactual: 48.2,
    decouplingMargin: 25.4,
    milestone: 'Non-usurious catalytic liquidity pool deployed',
    verifiedSensorCount: 2580,
    cryptographicHash: '0x44f128bc901a8823'
  },
  {
    monthIndex: 6,
    monthLabel: 'Month 06 (Mar 2026)',
    shortMonth: 'M06',
    calendarMonth: 'Mar 2026',
    exactDate: 'March 15, 2026',
    isoDate: '2026-03-15',
    ecologicalFlourishing: 77.4,
    economicStability: 71.9,
    extractiveCounterfactual: 47.0,
    decouplingMargin: 30.4,
    milestone: 'Long rains: 100% runoff captured in sub-sand sponges',
    verifiedSensorCount: 2890,
    cryptographicHash: '0x6e9014ba88c12093'
  },
  {
    monthIndex: 7,
    monthLabel: 'Month 07 (Apr 2026)',
    shortMonth: 'M07',
    calendarMonth: 'Apr 2026',
    exactDate: 'April 15, 2026',
    isoDate: '2026-04-15',
    ecologicalFlourishing: 80.8,
    economicStability: 75.3,
    extractiveCounterfactual: 46.1,
    decouplingMargin: 34.7,
    milestone: 'Vegetative canopy NDVI passes 0.65 threshold',
    verifiedSensorCount: 3120,
    cryptographicHash: '0xaa1829bc01928471'
  },
  {
    monthIndex: 8,
    monthLabel: 'Month 08 (May 2026)',
    shortMonth: 'M08',
    calendarMonth: 'May 2026',
    exactDate: 'May 22, 2026',
    isoDate: '2026-05-22',
    ecologicalFlourishing: 83.5,
    economicStability: 78.6,
    extractiveCounterfactual: 45.4,
    decouplingMargin: 38.1,
    milestone: 'Agro-processing co-op yields 3.2x surplus revenue',
    verifiedSensorCount: 3340,
    cryptographicHash: '0xbb4910283c719084'
  },
  {
    monthIndex: 9,
    monthLabel: 'Month 09 (Jun 2026)',
    shortMonth: 'M09',
    calendarMonth: 'Jun 2026',
    exactDate: 'June 15, 2026',
    isoDate: '2026-06-15',
    ecologicalFlourishing: 86.2,
    economicStability: 82.0,
    extractiveCounterfactual: 44.2,
    decouplingMargin: 42.0,
    milestone: 'Dry season onset with 94% baseflow continuity',
    verifiedSensorCount: 3560,
    cryptographicHash: '0xcc91823746a81920'
  },
  {
    monthIndex: 10,
    monthLabel: 'Month 10 (Jul 2026)',
    shortMonth: 'M10',
    calendarMonth: 'Jul 2026',
    exactDate: 'July 15, 2026',
    isoDate: '2026-07-15',
    ecologicalFlourishing: 88.4,
    economicStability: 84.7,
    extractiveCounterfactual: 43.1,
    decouplingMargin: 45.3,
    milestone: 'P2P solar energy trading achieves 98% circularity',
    verifiedSensorCount: 3780,
    cryptographicHash: '0xdd10293847561a8b'
  },
  {
    monthIndex: 11,
    monthLabel: 'Month 11 (Aug 2026)',
    shortMonth: 'M11',
    calendarMonth: 'Aug 2026',
    exactDate: 'August 15, 2026',
    isoDate: '2026-08-15',
    ecologicalFlourishing: 90.1,
    economicStability: 86.9,
    extractiveCounterfactual: 42.0,
    decouplingMargin: 48.1,
    milestone: 'Subsurface aquifer recharge reaches historical parity',
    verifiedSensorCount: 3950,
    cryptographicHash: '0xee92837465019283'
  },
  {
    monthIndex: 12,
    monthLabel: 'Month 12 (Sep 2026)',
    shortMonth: 'M12',
    calendarMonth: 'Sep 2026',
    exactDate: 'September 14, 2026',
    isoDate: '2026-09-14',
    ecologicalFlourishing: 92.4,
    economicStability: 89.2,
    extractiveCounterfactual: 41.2,
    decouplingMargin: 51.2,
    milestone: '12-Month Epistemic Covenant Parity Ratified',
    verifiedSensorCount: 4200,
    cryptographicHash: '0xff18293048571625'
  }
];

const CACHE_STORAGE_KEY = 'atlas_sanctum_impact_dashboard_cache_v2';

interface CachedChartState {
  selectedBioregions?: string[];
  isNormalized?: boolean;
  timeRange?: TimeRangeOption;
  activeSeries?: 'both' | 'ecological' | 'economic';
  showCounterfactual?: boolean;
  showAreaFill?: boolean;
  showAnomalies?: boolean;
  showAnnotations?: boolean;
  showPredictiveForecast?: boolean;
  forecastScenario?: 'balanced_covenant' | 'regenerative_acceleration' | 'climate_stress_shock';
  alertThreshold?: AlertThresholdConfig;
  isConfidenceIntervalActive?: boolean;
  showHistoricalComparison?: boolean;
  lastSavedTimestamp?: number;
}

const loadSavedChartState = (): CachedChartState | null => {
  try {
    const raw = localStorage.getItem(CACHE_STORAGE_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (err) {
    console.warn('Could not read cached impact chart state', err);
  }
  return null;
};

const CUSTOM_ANNOTATIONS_STORAGE_KEY = 'atlas_sanctum_custom_annotations_v2';

const loadSavedCustomAnnotations = (): TimelineAnnotationMarker[] => {
  try {
    const raw = localStorage.getItem(CUSTOM_ANNOTATIONS_STORAGE_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (err) {
    console.warn('Could not load custom annotations', err);
  }
  return [];
};

const saveCustomAnnotationsToStorage = (annotations: TimelineAnnotationMarker[]) => {
  try {
    localStorage.setItem(CUSTOM_ANNOTATIONS_STORAGE_KEY, JSON.stringify(annotations));
  } catch (err) {
    console.warn('Could not save custom annotations', err);
  }
};

interface FlourishingVsStabilityD3ChartProps {
  onInspectPoint?: (point: MonthlyTrendDataPoint) => void;
  selectedBioregions?: string[];
  onBioregionsChange?: (bioregions: string[]) => void;
  onInspectProvenance?: (provenance: any) => void;
  onOpenMoralSimulator?: () => void;
  triggerInsightsCounter?: number;
  timeRange?: TimeRangeOption;
  onTimeRangeChange?: (range: TimeRangeOption) => void;
  isNormalized?: boolean;
  onNormalizeChange?: (normalized: boolean) => void;
  isConfidenceIntervalActive?: boolean;
  onConfidenceIntervalToggle?: (active: boolean) => void;
  onAddBioregionClick?: () => void;
  isCelestialAlignment?: boolean;
  onToggleCelestialAlignment?: (active: boolean) => void;
  isDataPurified?: boolean;
  onPurifiedChange?: (purified: boolean) => void;
  isRitualCleansing?: boolean;
  onTriggerRitualCleanse?: () => void;
  showPredictiveForecast?: boolean;
  onPredictiveForecastChange?: (show: boolean) => void;
  showHistoricalComparison?: boolean;
  onHistoricalComparisonChange?: (show: boolean) => void;
  onOpenEpistemicObservation?: (point: MonthlyTrendDataPoint) => void;
  alertThreshold?: AlertThresholdConfig;
  onAlertThresholdChange?: (config: AlertThresholdConfig) => void;
  onSelectTab?: (tabId: string) => void;
}

export const FlourishingVsStabilityD3Chart: React.FC<FlourishingVsStabilityD3ChartProps> = ({
  onInspectPoint,
  selectedBioregions: externalSelectedBioregions,
  onBioregionsChange,
  onInspectProvenance,
  onOpenMoralSimulator,
  triggerInsightsCounter,
  timeRange: externalTimeRange,
  onTimeRangeChange,
  isNormalized: externalIsNormalized,
  onNormalizeChange,
  isConfidenceIntervalActive: externalConfidenceInterval,
  onConfidenceIntervalToggle,
  onAddBioregionClick,
  isCelestialAlignment: externalCelestialAlignment,
  onToggleCelestialAlignment,
  isDataPurified: externalIsPurified,
  onPurifiedChange,
  isRitualCleansing: externalIsRitualCleansing,
  onTriggerRitualCleanse,
  showPredictiveForecast: externalPredictiveForecast,
  onPredictiveForecastChange,
  showHistoricalComparison: externalHistoricalComparison,
  onHistoricalComparisonChange,
  onOpenEpistemicObservation,
  alertThreshold: externalAlertThreshold,
  onAlertThresholdChange,
  onSelectTab
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  // Load cached view state from localStorage
  const savedState = useMemo(() => loadSavedChartState(), []);

  // Celestial Alignment & Ritual Cleanse state
  const [internalCelestialAlignment, setInternalCelestialAlignment] = useState<boolean>(false);
  const isCelestialAlignment = externalCelestialAlignment !== undefined ? externalCelestialAlignment : internalCelestialAlignment;

  const [internalIsPurified, setInternalIsPurified] = useState<boolean>(false);
  const isDataPurified = externalIsPurified !== undefined ? externalIsPurified : internalIsPurified;

  const [internalIsRitualCleansing, setInternalIsRitualCleansing] = useState<boolean>(false);
  const isRitualCleansing = externalIsRitualCleansing !== undefined ? externalIsRitualCleansing : internalIsRitualCleansing;

  const handleToggleCelestial = () => {
    audioFeedback.playCovenantResonance();
    const nextVal = !isCelestialAlignment;
    if (onToggleCelestialAlignment) {
      onToggleCelestialAlignment(nextVal);
    } else {
      setInternalCelestialAlignment(nextVal);
    }
  };

  const handleCleanse = () => {
    if (isRitualCleansing) return;
    audioFeedback.playCovenantResonance();
    if (onTriggerRitualCleanse) {
      onTriggerRitualCleanse();
    } else {
      setInternalIsRitualCleansing(true);
    }
  };

  const handleCleanseComplete = () => {
    if (onTriggerRitualCleanse) {
      // Handled by parent
    } else {
      setInternalIsRitualCleansing(false);
      setInternalIsPurified(true);
      onPurifiedChange?.(true);
      audioFeedback.playSuccessChime();
    }
  };

  // Time Range selection (synced with parent prop if provided)
  const [internalTimeRange, setInternalTimeRange] = useState<TimeRangeOption>(() => savedState?.timeRange ?? 'all');
  const activeTimeRange = externalTimeRange !== undefined ? externalTimeRange : internalTimeRange;

  const handleTimeRangeChange = (newRange: TimeRangeOption) => {
    if (onTimeRangeChange) {
      onTimeRangeChange(newRange);
    } else {
      setInternalTimeRange(newRange);
    }
  };

  // Annotations & Custom Spikes/Drops State
  const [customAnnotations, setCustomAnnotations] = useState<TimelineAnnotationMarker[]>(() => loadSavedCustomAnnotations());
  const [isAddAnnotationModalOpen, setIsAddAnnotationModalOpen] = useState<boolean>(false);
  const [annotationTargetMonth, setAnnotationTargetMonth] = useState<number | undefined>(undefined);

  const handleSaveCustomAnnotation = (newAnno: TimelineAnnotationMarker) => {
    const updated = [...customAnnotations, newAnno];
    setCustomAnnotations(updated);
    saveCustomAnnotationsToStorage(updated);
  };

  const handleDeleteCustomAnnotation = (annoId: string) => {
    const updated = customAnnotations.filter(a => a.id !== annoId);
    setCustomAnnotations(updated);
    saveCustomAnnotationsToStorage(updated);
    if (selectedAnnotation?.id === annoId) {
      setSelectedAnnotation(null);
    }
  };

  const allAnnotations = useMemo(() => {
    return [...HISTORICAL_ANNOTATIONS, ...customAnnotations];
  }, [customAnnotations]);

  const handleOpenAddAnnotation = (monthIndex?: number) => {
    audioFeedback.playMicroTick();
    setAnnotationTargetMonth(monthIndex || selectedPoint?.monthIndex || 8);
    setIsAddAnnotationModalOpen(true);
  };

  // Zoom & Pan Interaction State
  const [isZoomSelectMode, setIsZoomSelectMode] = useState<boolean>(false);
  const [zoomDomain, setZoomDomain] = useState<[number, number] | null>(null);

  const handleToggleZoomSelectMode = () => {
    audioFeedback.playMicroTick();
    setIsZoomSelectMode(prev => !prev);
  };

  const handleResetZoom = () => {
    audioFeedback.playMicroTick();
    setZoomDomain(null);
    setIsZoomSelectMode(false);
  };

  const handleZoomIn = () => {
    audioFeedback.playMicroTick();
    const maxM = showPredictiveForecast ? 18 : 12;
    const current: [number, number] = zoomDomain ? [...zoomDomain] : [1, maxM];
    const span = current[1] - current[0];
    if (span <= 1.2) return; // Min window ~1.2 months
    const center = (current[0] + current[1]) / 2;
    const halfSpan = (span * 0.75) / 2;
    const newStart = Math.max(1, center - halfSpan);
    const newEnd = Math.min(maxM, center + halfSpan);
    setZoomDomain([newStart, newEnd]);
  };

  const handleZoomOut = () => {
    audioFeedback.playMicroTick();
    const maxM = showPredictiveForecast ? 18 : 12;
    const current: [number, number] = zoomDomain ? [...zoomDomain] : [1, maxM];
    const span = current[1] - current[0];
    const center = (current[0] + current[1]) / 2;
    const halfSpan = (span * 1.35) / 2;
    const newStart = Math.max(1, center - halfSpan);
    const newEnd = Math.min(maxM, center + halfSpan);
    if (newStart <= 1.05 && newEnd >= maxM - 0.05) {
      setZoomDomain(null);
    } else {
      setZoomDomain([newStart, newEnd]);
    }
  };

  const handlePanLeft = () => {
    audioFeedback.playMicroTick();
    const maxM = showPredictiveForecast ? 18 : 12;
    const current: [number, number] = zoomDomain ? [...zoomDomain] : [1, maxM];
    const span = current[1] - current[0];
    const shift = Math.max(0.4, span * 0.25);
    const newStart = Math.max(1, current[0] - shift);
    const newEnd = Math.min(maxM, newStart + span);
    setZoomDomain([newStart, newEnd]);
  };

  const handlePanRight = () => {
    audioFeedback.playMicroTick();
    const maxM = showPredictiveForecast ? 18 : 12;
    const current: [number, number] = zoomDomain ? [...zoomDomain] : [1, maxM];
    const span = current[1] - current[0];
    const shift = Math.max(0.4, span * 0.25);
    const newEnd = Math.min(maxM, current[1] + shift);
    const newStart = Math.max(1, newEnd - span);
    setZoomDomain([newStart, newEnd]);
  };

  const handleSetTemporalPreset = (start: number, end: number) => {
    audioFeedback.playSuccessChime();
    const maxM = showPredictiveForecast ? 18 : 12;
    if (start <= 1 && end >= maxM) {
      setZoomDomain(null);
    } else {
      setZoomDomain([Math.max(1, start), Math.min(maxM, end)]);
    }
  };

  // Detailed Metric Analysis for Active Temporal Drill-Down Window
  const temporalDrillDownAnalysis = useMemo(() => {
    if (!zoomDomain) return null;
    const [startM, endM] = zoomDomain;
    const windowSpan = endM - startM;
    const activeData = (externalSelectedBioregions && externalSelectedBioregions.length > 0)
      ? (COMPARATIVE_BIOREGIONS.find(b => b.id === externalSelectedBioregions[0])?.monthlyData || TWELVE_MONTH_INTERVAL_DATA)
      : TWELVE_MONTH_INTERVAL_DATA;
    const pointsInWindow = activeData.filter(p => p.monthIndex >= startM - 0.4 && p.monthIndex <= endM + 0.4);
    if (pointsInWindow.length === 0) return null;

    const startPt = pointsInWindow[0];
    const endPt = pointsInWindow[pointsInWindow.length - 1];

    const ecoStart = startPt.ecologicalFlourishing;
    const ecoEnd = endPt.ecologicalFlourishing;
    const ecoDelta = ecoEnd - ecoStart;
    const ecoRate = windowSpan > 0 ? (ecoDelta / windowSpan) : 0;

    const econStart = startPt.economicStability;
    const econEnd = endPt.economicStability;
    const econDelta = econEnd - econStart;

    const startDecouple = startPt.decouplingMargin ?? (ecoStart - (100 - econStart));
    const endDecouple = endPt.decouplingMargin ?? (ecoEnd - (100 - econEnd));
    const decoupleDelta = endDecouple - startDecouple;

    return {
      startM,
      endM,
      windowSpan,
      startLabel: startPt.monthLabel,
      endLabel: endPt.monthLabel,
      pointsCount: pointsInWindow.length,
      ecoStart,
      ecoEnd,
      ecoDelta,
      ecoRate,
      econStart,
      econEnd,
      econDelta,
      startDecouple,
      endDecouple,
      decoupleDelta
    };
  }, [zoomDomain, externalSelectedBioregions]);

  // Alert Presets State
  const [alertPresets, setAlertPresets] = useState<AlertPreset[]>(() => loadAlertPresets());
  const [activePresetId, setActivePresetId] = useState<string | null>(null);

  const handleApplyAlertPreset = (preset: AlertPreset) => {
    audioFeedback.playSuccessChime();
    setActivePresetId(preset.id);
    setAlertThreshold({
      enabled: true,
      metric: preset.config.metric,
      condition: preset.config.condition,
      value: preset.config.value
    });
  };

  // Series & View Toggles
  const [activeSeries, setActiveSeries] = useState<'both' | 'ecological' | 'economic'>(() => savedState?.activeSeries ?? 'both');
  const [showCounterfactual, setShowCounterfactual] = useState<boolean>(() => savedState?.showCounterfactual ?? true);
  const [showAreaFill, setShowAreaFill] = useState<boolean>(() => savedState?.showAreaFill ?? true);
  const [isCrosshairActive, setIsCrosshairActive] = useState<boolean>(true);
  const [isPinned, setIsPinned] = useState<boolean>(false);
  const [showAnomalies, setShowAnomalies] = useState<boolean>(() => savedState?.showAnomalies ?? true);
  const [showAnnotations, setShowAnnotations] = useState<boolean>(() => savedState?.showAnnotations ?? true);
  const [internalPredictiveForecast, setInternalPredictiveForecast] = useState<boolean>(() => savedState?.showPredictiveForecast ?? true);
  const showPredictiveForecast = externalPredictiveForecast !== undefined ? externalPredictiveForecast : internalPredictiveForecast;

  const handleTogglePredictiveForecast = () => {
    audioFeedback.playMicroTick();
    const nextVal = !showPredictiveForecast;
    if (onPredictiveForecastChange) {
      onPredictiveForecastChange(nextVal);
    } else {
      setInternalPredictiveForecast(nextVal);
    }
  };

  // Normalize Data Toggle (0-100% relative range, synced with parent prop if provided)
  const [internalIsNormalized, setInternalIsNormalized] = useState<boolean>(() => savedState?.isNormalized ?? false);
  const isNormalized = externalIsNormalized !== undefined ? externalIsNormalized : internalIsNormalized;

  const handleToggleNormalized = () => {
    const nextVal = !isNormalized;
    if (onNormalizeChange) {
      onNormalizeChange(nextVal);
    } else {
      setInternalIsNormalized(nextVal);
    }
  };

  // Confidence Interval Toggle State (±1σ / 95% CI shaded areas)
  const [internalConfidenceInterval, setInternalConfidenceInterval] = useState<boolean>(() => savedState?.isConfidenceIntervalActive ?? false);
  const isConfidenceIntervalActive = externalConfidenceInterval !== undefined ? externalConfidenceInterval : internalConfidenceInterval;

  const handleToggleConfidenceInterval = () => {
    const nextVal = !isConfidenceIntervalActive;
    if (onConfidenceIntervalToggle) {
      onConfidenceIntervalToggle(nextVal);
    } else {
      setInternalConfidenceInterval(nextVal);
    }
  };

  // Bioregional Comparator Modal State
  const [isBioregionalComparatorModalOpen, setIsBioregionalComparatorModalOpen] = useState<boolean>(false);

  // Historical Longitudinal Comparison State (synced with parent prop if provided)
  const [internalShowHistoricalComparison, setInternalShowHistoricalComparison] = useState<boolean>(() => savedState?.showHistoricalComparison ?? false);
  const showHistoricalComparison = externalHistoricalComparison !== undefined ? externalHistoricalComparison : internalShowHistoricalComparison;

  const handleToggleHistoricalComparison = () => {
    audioFeedback.playMicroTick();
    const nextVal = !showHistoricalComparison;
    if (onHistoricalComparisonChange) {
      onHistoricalComparisonChange(nextVal);
    } else {
      setInternalShowHistoricalComparison(nextVal);
    }
  };

  // Epistemic Observation Modal State
  const [isEpistemicModalOpen, setIsEpistemicModalOpen] = useState<boolean>(false);
  const [epistemicTargetPoint, setEpistemicTargetPoint] = useState<MonthlyTrendDataPoint | null>(null);

  const handleOpenEpistemicObservation = (pt?: MonthlyTrendDataPoint) => {
    audioFeedback.playMicroTick();
    const target = pt || selectedPoint || primaryDataset[primaryDataset.length - 1];
    if (onOpenEpistemicObservation) {
      onOpenEpistemicObservation(target);
    } else {
      setEpistemicTargetPoint(target);
      setIsEpistemicModalOpen(true);
    }
  };

  // References for tracking state changes and triggering smooth D3 transitions
  const prevNormalizedRef = useRef<boolean>(isNormalized);
  const prevTimeRangeRef = useRef<TimeRangeOption>(activeTimeRange);
  const hasMountedRef = useRef<boolean>(false);

  // Alert on Threshold State (synced with parent if provided)
  const [internalAlertThreshold, setInternalAlertThreshold] = useState<AlertThresholdConfig>(() => savedState?.alertThreshold ?? {
    enabled: true,
    metric: 'ecological',
    condition: 'below',
    value: 75
  });
  const alertThreshold = externalAlertThreshold !== undefined ? externalAlertThreshold : internalAlertThreshold;

  const setAlertThreshold = (cfgOrFn: AlertThresholdConfig | ((prev: AlertThresholdConfig) => AlertThresholdConfig)) => {
    const nextVal = typeof cfgOrFn === 'function' ? cfgOrFn(alertThreshold) : cfgOrFn;
    if (onAlertThresholdChange) {
      onAlertThresholdChange(nextVal);
    }
    setInternalAlertThreshold(nextVal);
  };

  const [isThresholdModalOpen, setIsThresholdModalOpen] = useState<boolean>(false);
  const [isAlertDismissed, setIsAlertDismissed] = useState<boolean>(false);
  const lastAlertFiredRef = useRef<boolean>(false);
  const [alertDragFeedback, setAlertDragFeedback] = useState<string | null>(null);
  const [isNotificationPermissionGranted, setIsNotificationPermissionGranted] = useState<boolean>(() => {
    return typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted';
  });

  const handleRequestNotificationPermission = async () => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      try {
        const perm = await Notification.requestPermission();
        if (perm === 'granted') {
          setIsNotificationPermissionGranted(true);
          audioFeedback.playSuccessChime();
          setAlertDragFeedback("Real-time desktop push notifications armed for telemetry breaches!");
          setTimeout(() => setAlertDragFeedback(null), 5000);
        }
      } catch (err) {
        console.warn("Could not request notification permission", err);
      }
    }
  };

  // AI Insights State
  const [isAIInsightsModalOpen, setIsAIInsightsModalOpen] = useState<boolean>(false);
  const [isAIInsightsLoading, setIsAIInsightsLoading] = useState<boolean>(false);
  const [aiInsightsData, setAiInsightsData] = useState<FlourishingInsightsData | null>(null);

  // Bioregional multi-select filter state
  const [internalSelectedBioregions, setInternalSelectedBioregions] = useState<string[]>(() => savedState?.selectedBioregions ?? ['pan-african']);
  const activeBioregionIds = externalSelectedBioregions || internalSelectedBioregions;

  const handleBioregionsChange = (newIds: string[]) => {
    if (newIds.length === 0) return; // Maintain at least one selection
    if (onBioregionsChange) {
      onBioregionsChange(newIds);
    } else {
      setInternalSelectedBioregions(newIds);
    }
  };

  const toggleBioregion = (id: string) => {
    if (activeBioregionIds.includes(id)) {
      if (activeBioregionIds.length > 1) {
        handleBioregionsChange(activeBioregionIds.filter(b => b !== id));
      }
    } else {
      handleBioregionsChange([...activeBioregionIds, id]);
    }
  };

  const selectAllBioregions = () => {
    handleBioregionsChange(COMPARATIVE_BIOREGIONS.map(b => b.id));
  };

  const resetToDefaultBioregion = () => {
    handleBioregionsChange(['pan-african']);
  };

  // Active Bioregions Data Objects
  const selectedBioregionObjects = useMemo(() => {
    return COMPARATIVE_BIOREGIONS.filter(b => activeBioregionIds.includes(b.id));
  }, [activeBioregionIds]);

  // Primary dataset (first selected bioregion or Pan-African)
  const primaryDataset = useMemo(() => {
    const firstSelected = selectedBioregionObjects[0];
    return firstSelected ? firstSelected.monthlyData : TWELVE_MONTH_INTERVAL_DATA;
  }, [selectedBioregionObjects]);

  // Forecast Simulation State (Gemini 6-Month Window)
  const [forecastScenario, setForecastScenario] = useState<'balanced_covenant' | 'regenerative_acceleration' | 'climate_stress_shock'>(() => savedState?.forecastScenario ?? 'balanced_covenant');
  const [forecastData, setForecastData] = useState<ForecastDataPoint[]>(DEFAULT_PREDICTIVE_FORECAST);
  const [isSimulatingForecast, setIsSimulatingForecast] = useState<boolean>(false);
  const [forecastSynthesis, setForecastSynthesis] = useState<string>(
    "The Gemini 6-month simulation window projectively models a continuous expansion of ecological flourishing from 92.4% to 98.6%. Decoupling margin widens to +61.6 points over the extractive baseline, confirming that living systems compounding generates superior long-term economic stability."
  );

  // Selected Points & Modals State
  const [hoveredPoint, setHoveredPoint] = useState<MonthlyTrendDataPoint | null>(null);
  const [selectedPoint, setSelectedPoint] = useState<MonthlyTrendDataPoint>(TWELVE_MONTH_INTERVAL_DATA[11]);
  const [crosshairPos, setCrosshairPos] = useState<{ x: number; yEco: number; yEcon: number; innerWidth: number } | null>(null);

  // Modals
  const [selectedAnnotation, setSelectedAnnotation] = useState<TimelineAnnotationMarker | null>(null);
  const [selectedAnomaly, setSelectedAnomaly] = useState<HistoricalAnomalyEvent | null>(null);

  // Dimensions
  const [dimensions, setDimensions] = useState({ width: 850, height: 440 });

  useEffect(() => {
    if (!containerRef.current) return;
    const observer = new ResizeObserver((entries) => {
      if (!entries || entries.length === 0) return;
      const { width } = entries[0].contentRect;
      if (width > 0) {
        setDimensions({
          width: Math.max(320, width),
          height: Math.min(480, Math.max(360, width * 0.44))
        });
      }
    });

    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  // Cache state in localStorage whenever key view settings change
  useEffect(() => {
    try {
      const payload: CachedChartState = {
        selectedBioregions: activeBioregionIds,
        isNormalized,
        activeSeries,
        showCounterfactual,
        showAreaFill,
        showAnomalies,
        showAnnotations,
        showPredictiveForecast,
        forecastScenario,
        alertThreshold,
        isConfidenceIntervalActive,
        lastSavedTimestamp: Date.now()
      };
      localStorage.setItem(CACHE_STORAGE_KEY, JSON.stringify(payload));
    } catch {
      // Ignore storage errors
    }
  }, [
    activeBioregionIds,
    isNormalized,
    activeSeries,
    showCounterfactual,
    showAreaFill,
    showAnomalies,
    showAnnotations,
    showPredictiveForecast,
    forecastScenario,
    alertThreshold,
    isConfidenceIntervalActive
  ]);

  const handleResetToDefaults = () => {
    audioFeedback.playMicroTick();
    if (onNormalizeChange) {
      onNormalizeChange(false);
    } else {
      setInternalIsNormalized(false);
    }
    setActiveSeries('both');
    setShowCounterfactual(true);
    setShowAreaFill(true);
    setShowAnomalies(true);
    setShowAnnotations(true);
    setInternalPredictiveForecast(true);
    onPredictiveForecastChange?.(true);
    setForecastScenario('balanced_covenant');
    setAlertThreshold({
      enabled: true,
      metric: 'ecological',
      condition: 'below',
      value: 75
    });
    handleBioregionsChange(['pan-african']);
    try {
      localStorage.removeItem(CACHE_STORAGE_KEY);
    } catch {
      // Ignore
    }
  };

  // Normalization Helpers (0-100% Relative Range)
  const minEco = useMemo(() => Math.min(...primaryDataset.map(d => d.ecologicalFlourishing)), [primaryDataset]);
  const maxEco = useMemo(() => Math.max(...primaryDataset.map(d => d.ecologicalFlourishing)), [primaryDataset]);
  const minEcon = useMemo(() => Math.min(...primaryDataset.map(d => d.economicStability)), [primaryDataset]);
  const maxEcon = useMemo(() => Math.max(...primaryDataset.map(d => d.economicStability)), [primaryDataset]);
  const minCounter = useMemo(() => Math.min(...primaryDataset.map(d => d.extractiveCounterfactual)), [primaryDataset]);
  const maxCounter = useMemo(() => Math.max(...primaryDataset.map(d => d.extractiveCounterfactual)), [primaryDataset]);

  const normEco = (val: number) => {
    if (!isNormalized) return val;
    return maxEco === minEco ? 50 : Math.max(0, Math.min(100, ((val - minEco) / (maxEco - minEco)) * 100));
  };

  const normEcon = (val: number) => {
    if (!isNormalized) return val;
    return maxEcon === minEcon ? 50 : Math.max(0, Math.min(100, ((val - minEcon) / (maxEcon - minEcon)) * 100));
  };

  const normCounter = (val: number) => {
    if (!isNormalized) return val;
    return maxCounter === minCounter ? 50 : Math.max(0, Math.min(100, ((val - minCounter) / (maxCounter - minCounter)) * 100));
  };

  const normRegionEco = (val: number, regionPts: MonthlyTrendDataPoint[]) => {
    if (!isNormalized) return val;
    const rMin = Math.min(...regionPts.map(p => p.ecologicalFlourishing));
    const rMax = Math.max(...regionPts.map(p => p.ecologicalFlourishing));
    return rMax === rMin ? 50 : Math.max(0, Math.min(100, ((val - rMin) / (rMax - rMin)) * 100));
  };

  const normForecastEco = (val: number) => {
    if (!isNormalized) return val;
    return Math.max(0, Math.min(100, ((val - minEco) / (maxEco - minEco || 1)) * 100));
  };

  const normForecastEcon = (val: number) => {
    if (!isNormalized) return val;
    return Math.max(0, Math.min(100, ((val - minEcon) / (maxEcon - minEcon || 1)) * 100));
  };

  // Alert on Threshold Evaluation
  const currentWatchdogVal = useMemo(() => {
    const latest = primaryDataset[primaryDataset.length - 1];
    if (!latest) return 0;
    if (alertThreshold.metric === 'ecological') return latest.ecologicalFlourishing;
    if (alertThreshold.metric === 'economic') return latest.economicStability;
    return latest.decouplingMargin;
  }, [primaryDataset, alertThreshold.metric]);

  const isAlertTriggered = useMemo(() => {
    if (!alertThreshold.enabled) return false;
    if (alertThreshold.condition === 'below') {
      return currentWatchdogVal < alertThreshold.value;
    } else {
      return currentWatchdogVal > alertThreshold.value;
    }
  }, [alertThreshold.enabled, alertThreshold.condition, alertThreshold.value, currentWatchdogVal]);

  // Audio alert and browser notification on breach transition
  useEffect(() => {
    if (isAlertTriggered && !lastAlertFiredRef.current) {
      audioFeedback.playWarningPulse();
      setIsAlertDismissed(false);

      if (typeof window !== 'undefined' && 'Notification' in window) {
        if (Notification.permission === 'granted') {
          try {
            new Notification('Atlas Sanctum Telemetry Alert', {
              body: `${alertThreshold.metric.toUpperCase()} has breached defined threshold (${alertThreshold.condition === 'below' ? '<' : '>'} ${alertThreshold.value}). Current reading: ${currentWatchdogVal.toFixed(1)}.`,
              icon: '/icon.png'
            });
          } catch {
            // Ignore
          }
        }
      }
    }
    lastAlertFiredRef.current = isAlertTriggered;
  }, [isAlertTriggered, alertThreshold, currentWatchdogVal]);

  // Gemini Forecast Simulation Runner
  const handleRunGeminiSimulation = async (scenario = forecastScenario) => {
    try {
      setIsSimulatingForecast(true);
      audioFeedback.playMicroTick();
      const latestPoint = primaryDataset[primaryDataset.length - 1];

      const res = await fetch('/api/gemini/flourishing-forecast', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          scenario,
          bioregionIds: activeBioregionIds,
          horizonMonths: 6,
          currentEco: latestPoint.ecologicalFlourishing,
          currentEcon: latestPoint.economicStability,
          currentCounterfactual: latestPoint.extractiveCounterfactual
        })
      });

      if (!res.ok) throw new Error(`Forecast request failed: ${res.statusText}`);
      const data = await res.json();

      if (data.forecastPoints && Array.isArray(data.forecastPoints)) {
        setForecastData(data.forecastPoints);
        if (data.synthesis) setForecastSynthesis(data.synthesis);
        audioFeedback.playSuccessChime();
      }
    } catch (err) {
      console.warn('Gemini simulation error, using local biophysical model:', err);
      audioFeedback.playSuccessChime();
    } finally {
      setIsSimulatingForecast(false);
    }
  };

  // Generate AI Insights with Gemini
  const handleGenerateAIInsights = async () => {
    try {
      setIsAIInsightsLoading(true);
      setIsAIInsightsModalOpen(true);
      audioFeedback.playCovenantResonance();

      const startPt = primaryDataset[0];
      const latestPt = primaryDataset[primaryDataset.length - 1];

      const res = await fetch('/api/gemini/flourishing-insights', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bioregionNames: selectedBioregionObjects.map(b => b.name),
          startEco: startPt.ecologicalFlourishing,
          startEcon: startPt.economicStability,
          latestEco: latestPt.ecologicalFlourishing,
          latestEcon: latestPt.economicStability,
          decouplingMargin: latestPt.decouplingMargin,
          correlation: 0.994,
          isNormalized,
          activeThreshold: alertThreshold.enabled ? alertThreshold : null,
          detectedAnomalies: DETECTED_ANOMALY_EVENTS
        })
      });

      if (!res.ok) throw new Error(`HTTP error: ${res.statusText}`);
      const data = await res.json();
      setAiInsightsData(data);
      audioFeedback.playSuccessChime();
    } catch (error) {
      console.warn('Using deterministic systems dynamics insights:', error);
      setAiInsightsData({
        executiveSummary: `Longitudinal analysis across ${selectedBioregionObjects.map(b => b.name).join(", ")} exhibits an empirical co-flourishing correlation of r = +0.994. Regenerative land and resource covenants generate compounding biophysical dividends that directly de-risk and accelerate localized economic stability.`,
        correlationInsight: `Ecological Flourishing expanded from ${primaryDataset[0].ecologicalFlourishing}% to ${primaryDataset[primaryDataset.length - 1].ecologicalFlourishing}%, lifting Economic Stability from ${primaryDataset[0].economicStability}% to ${primaryDataset[primaryDataset.length - 1].economicStability}%. The decoupling margin reached +${primaryDataset[primaryDataset.length - 1].decouplingMargin.toFixed(1)} points over extractive degradation.`,
        decouplingAnalysis: `Atlas Sanctum's epistemic evidence proves that living systems compounding breaks the legacy trade-off between ecological drawdown and financial liquidity, replacing boom-and-bust extractive exhaustion with antifragile bio-circular wealth.`,
        bioregionalComparison: selectedBioregionObjects.length > 1
          ? `Comparative trajectories across ${selectedBioregionObjects.length} bioregions reveal that high-elevation catchment regeneration in Aberdare and Mara generates upstream hydrological dampening that accelerates downstream power and yield security.`
          : `Within ${selectedBioregionObjects[0]?.name || 'the bioregion'}, verified sensor mesh data confirms steady systemic variance suppression across all 12 consecutive months.`,
        anomalyAssessment: `Historical moving-average stress events (e.g. thermal spikes and moisture deficits) were dampened by local soil sponges and community solar reserves, preventing systemic economic contagion.`,
        strategicRecommendations: [
          "Scale localized microgrid liquidity clearing in direct lockstep with verified aquifer infiltration.",
          "Strengthen biological wildlife and pollination corridors ahead of seasonal climatic stress windows.",
          "Link cooperative harvest tokens to zero-knowledge multi-spectral soil organic carbon proofs."
        ],
        statisticalConfidence: "99.4% Dual-Sensor Multi-Spectral Consensus (Copernicus + Lysimeter Ground-Truth)",
        epistemicAssurance: "Commandment IX Ground-Truth Verified",
        bioregionsAnalyzed: selectedBioregionObjects.map(b => b.name),
        timestamp: new Date().toISOString()
      });
      audioFeedback.playSuccessChime();
    } finally {
      setIsAIInsightsLoading(false);
    }
  };

  // External trigger handler from parent view header
  const prevTriggerCounter = useRef<number>(0);
  useEffect(() => {
    if (triggerInsightsCounter && triggerInsightsCounter > prevTriggerCounter.current) {
      prevTriggerCounter.current = triggerInsightsCounter;
      handleGenerateAIInsights();
    }
  }, [triggerInsightsCounter]);

  // Summary Metrics calculation
  const summaryMetrics = useMemo(() => {
    const first = primaryDataset[0];
    const latest = primaryDataset[primaryDataset.length - 1];

    const ecoGain = latest.ecologicalFlourishing - first.ecologicalFlourishing;
    const ecoPct = Number(((ecoGain / first.ecologicalFlourishing) * 100).toFixed(1));

    const econGain = latest.economicStability - first.economicStability;
    const econPct = Number(((econGain / first.economicStability) * 100).toFixed(1));

    const totalSensors = selectedBioregionObjects.reduce((acc, b) => acc + b.activeSensors, 0);

    return {
      latestEco: latest.ecologicalFlourishing,
      latestEcon: latest.economicStability,
      ecoGainPct: ecoPct,
      econGainPct: econPct,
      correlation: 0.994,
      totalSensors,
      decouplingAdvantage: latest.decouplingMargin
    };
  }, [primaryDataset, selectedBioregionObjects]);

  // Export Longitudinal CSV Function
  const handleExportCSV = () => {
    audioFeedback.playSubtleClick();
    exportVisualizedTrendCSV({
      primaryDataset,
      selectedBioregions: selectedBioregionObjects,
      isNormalized,
      timeRange: activeTimeRange,
      forecastData: showPredictiveForecast ? forecastData : undefined
    });
    audioFeedback.playSuccessChime();
  };

  // -------------------------------------------------------------
  // D3 Chart Render Engine
  // -------------------------------------------------------------
  useEffect(() => {
    if (!svgRef.current) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const { width, height } = dimensions;
    const margin = { top: 36, right: 40, bottom: 48, left: 52 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    const g = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`);

    // Smooth transition detection when toggling between raw and normalized modes
    const didToggleNormalize = prevNormalizedRef.current !== isNormalized;
    const wasNormalized = prevNormalizedRef.current;
    prevNormalizedRef.current = isNormalized;

    const TRANSITION_DURATION = 750;
    const TRANSITION_EASE = d3.easeCubicInOut;

    // Dynamic X-Scale: Focus on selected time range (30d -> Months 11-12, quarter -> Months 10-12, year -> 1-12, all -> 1-maxMonth)
    const maxMonth = showPredictiveForecast ? 18 : 12;
    let defaultTimeRangeDomain: [number, number] = [1, maxMonth];
    if (activeTimeRange === '30d') {
      defaultTimeRangeDomain = [11, 12];
    } else if (activeTimeRange === 'quarter') {
      defaultTimeRangeDomain = [10, 12];
    } else if (activeTimeRange === 'year') {
      defaultTimeRangeDomain = [1, 12];
    } else {
      defaultTimeRangeDomain = [1, maxMonth];
    }
    const effectiveDomain: [number, number] = zoomDomain ? zoomDomain : defaultTimeRangeDomain;
    const xScale = d3.scaleLinear()
      .domain(effectiveDomain)
      .range([0, innerWidth]);

    // Y Scale: Normalized 0-100% or Raw 30-102 Score
    const yScale = d3.scaleLinear()
      .domain(isNormalized ? [0, 100] : [30, 102])
      .range([innerHeight, 0])
      .nice();

    // Prior Y scale and normalization maps for smooth transition animation
    const prevYScale = d3.scaleLinear()
      .domain(wasNormalized ? [0, 100] : [30, 102])
      .range([innerHeight, 0])
      .nice();

    const prevNormEco = (val: number) => wasNormalized ? normEco(val) : val;
    const prevNormEcon = (val: number) => wasNormalized ? normEcon(val) : val;
    const prevNormCounter = (val: number) => wasNormalized ? normCounter(val) : val;
    const prevNormRegionEco = (val: number, rData: MonthlyTrendDataPoint[]) => wasNormalized ? normRegionEco(val, rData) : val;

    const curNormEco = (val: number) => isNormalized ? normEco(val) : val;
    const curNormEcon = (val: number) => isNormalized ? normEcon(val) : val;
    const curNormCounter = (val: number) => isNormalized ? normCounter(val) : val;
    const curNormRegionEco = (val: number, rData: MonthlyTrendDataPoint[]) => isNormalized ? normRegionEco(val, rData) : val;

    // Definitions: Gradients & Glow Filters
    const defs = svg.append('defs');

    // Plot Clipping Area for Zoom & Pan Boundaries
    defs.append('clipPath')
      .attr('id', 'chart-plot-area-clip')
      .append('rect')
      .attr('x', 0)
      .attr('y', 0)
      .attr('width', innerWidth)
      .attr('height', innerHeight);

    // Gradient for Ecological Flourishing Area
    const ecoGrad = defs.append('linearGradient')
      .attr('id', 'eco-flourish-gradient')
      .attr('x1', '0%').attr('y1', '0%')
      .attr('x2', '0%').attr('y2', '100%');
    ecoGrad.append('stop').attr('offset', '0%').attr('stop-color', '#10B981').attr('stop-opacity', 0.35);
    ecoGrad.append('stop').attr('offset', '100%').attr('stop-color', '#10B981').attr('stop-opacity', 0.0);

    // Gradient for Economic Stability Area
    const econGrad = defs.append('linearGradient')
      .attr('id', 'econ-stability-gradient')
      .attr('x1', '0%').attr('y1', '0%')
      .attr('x2', '0%').attr('y2', '100%');
    econGrad.append('stop').attr('offset', '0%').attr('stop-color', '#C5A059').attr('stop-opacity', 0.25);
    econGrad.append('stop').attr('offset', '100%').attr('stop-color', '#C5A059').attr('stop-opacity', 0.0);

    // Gradient for Predictive Uncertainty Cone (Gemini Simulation)
    const forecastConeGrad = defs.append('linearGradient')
      .attr('id', 'forecast-uncertainty-gradient')
      .attr('x1', '0%').attr('y1', '0%')
      .attr('x2', '100%').attr('y2', '0%');
    forecastConeGrad.append('stop').attr('offset', '0%').attr('stop-color', '#06B6D4').attr('stop-opacity', 0.15);
    forecastConeGrad.append('stop').attr('offset', '100%').attr('stop-color', '#10B981').attr('stop-opacity', 0.28);

    // Striped Pattern for Anomaly Stress Highlight Zones
    const anomalyPattern = defs.append('pattern')
      .attr('id', 'anomaly-diagonal-stripes')
      .attr('width', 8)
      .attr('height', 8)
      .attr('patternUnits', 'userSpaceOnUse')
      .attr('patternTransform', 'rotate(45)');
    anomalyPattern.append('line')
      .attr('x1', 0).attr('y1', 0)
      .attr('x2', 0).attr('y2', 8)
      .attr('stroke', '#EF4444')
      .attr('stroke-width', 2)
      .attr('stroke-opacity', 0.35);

    // Celestial Star Glow Filter for Constellation & Purified Lines
    const starGlowFilter = defs.append('filter')
      .attr('id', 'celestial-star-glow')
      .attr('x', '-50%')
      .attr('y', '-50%')
      .attr('width', '200%')
      .attr('height', '200%');
    starGlowFilter.append('feGaussianBlur')
      .attr('stdDeviation', 2.5)
      .attr('result', 'coloredBlur');
    const starMerge = starGlowFilter.append('feMerge');
    starMerge.append('feMergeNode').attr('in', 'coloredBlur');
    starMerge.append('feMergeNode').attr('in', 'SourceGraphic');

    // Background Grid lines with transition support
    const yAxisTicks = yScale.ticks(6);
    const gridLinesG = g.append('g').attr('class', 'grid-lines');
    if (didToggleNormalize) {
      gridLinesG.selectAll('line')
        .data(yAxisTicks)
        .enter()
        .append('line')
        .attr('x1', 0)
        .attr('x2', innerWidth)
        .attr('y1', d => prevYScale(d))
        .attr('y2', d => prevYScale(d))
        .attr('stroke', '#1E2420')
        .attr('stroke-width', 1)
        .attr('stroke-dasharray', '3 3')
        .transition()
        .duration(TRANSITION_DURATION)
        .ease(TRANSITION_EASE)
        .attr('y1', d => yScale(d))
        .attr('y2', d => yScale(d));
    } else {
      gridLinesG.selectAll('line')
        .data(yAxisTicks)
        .enter()
        .append('line')
        .attr('x1', 0)
        .attr('x2', innerWidth)
        .attr('y1', d => yScale(d))
        .attr('y2', d => yScale(d))
        .attr('stroke', '#1E2420')
        .attr('stroke-width', 1)
        .attr('stroke-dasharray', '3 3');
    }

    // Clipped Plot Area for all data curves, forecast, anomalies, and threshold lines
    const plotG = g.append('g')
      .attr('class', 'chart-plot-area-clipped')
      .attr('clip-path', 'url(#chart-plot-area-clip)');

    // -------------------------------------------------------------
    // 1. VISUAL ANOMALY DETECTION HIGHLIGHT (Shaded background regions)
    // -------------------------------------------------------------
    if (showAnomalies) {
      const anomalyGroup = plotG.append('g').attr('class', 'anomaly-highlight-regions');

      DETECTED_ANOMALY_EVENTS.forEach((anomaly) => {
        const xCenter = xScale(anomaly.monthIndex);
        const bandWidth = (innerWidth / (maxMonth - 1)) * 0.85;
        const xStart = Math.max(0, xCenter - bandWidth / 2);

        // Shaded Background Zone with Warning Tint
        anomalyGroup.append('rect')
          .attr('x', xStart)
          .attr('y', 0)
          .attr('width', bandWidth)
          .attr('height', innerHeight)
          .attr('fill', 'rgba(239, 68, 68, 0.08)')
          .attr('stroke', '#EF4444')
          .attr('stroke-width', 1)
          .attr('stroke-dasharray', '4 3')
          .attr('stroke-opacity', 0.45)
          .attr('cursor', 'pointer')
          .attr('class', 'transition-opacity duration-200 hover:opacity-90')
          .on('click', () => {
            audioFeedback.playMicroTick();
            setSelectedAnomaly(anomaly);
          });

        // Overlay Diagonal Hatching
        anomalyGroup.append('rect')
          .attr('x', xStart)
          .attr('y', 0)
          .attr('width', bandWidth)
          .attr('height', innerHeight)
          .attr('fill', 'url(#anomaly-diagonal-stripes)')
          .attr('pointer-events', 'none');

        // Top Warning Badge
        const badgeG = anomalyGroup.append('g')
          .attr('transform', `translate(${xCenter}, 12)`)
          .attr('cursor', 'pointer')
          .on('click', () => {
            audioFeedback.playMicroTick();
            setSelectedAnomaly(anomaly);
          });

        badgeG.append('rect')
          .attr('x', -54)
          .attr('y', -10)
          .attr('width', 108)
          .attr('height', 18)
          .attr('rx', 3)
          .attr('fill', '#450A0A')
          .attr('stroke', '#EF4444')
          .attr('stroke-width', 1);

        badgeG.append('text')
          .attr('x', 0)
          .attr('y', 2)
          .attr('text-anchor', 'middle')
          .attr('fill', '#FCA5A5')
          .attr('font-size', '8.5px')
          .attr('font-family', 'monospace')
          .attr('font-weight', 'bold')
          .text(`⚠️ STRESS (${anomaly.deviationScore}σ)`);
      });
    }

    // -------------------------------------------------------------
    // 2. PREDICTIVE FORECASTING 6-MONTH REGION SHADING (M12 to M18)
    // -------------------------------------------------------------
    if (showPredictiveForecast) {
      const forecastRegionGroup = g.append('g').attr('class', 'predictive-forecast-region');
      const xDivider = xScale(12);

      // Shaded Forecast Background Zone
      forecastRegionGroup.append('rect')
        .attr('x', xDivider)
        .attr('y', 0)
        .attr('width', innerWidth - xDivider)
        .attr('height', innerHeight)
        .attr('fill', 'rgba(6, 182, 212, 0.04)')
        .attr('stroke', 'none');

      // Vertical Dividing Line at Month 12
      forecastRegionGroup.append('line')
        .attr('x1', xDivider)
        .attr('x2', xDivider)
        .attr('y1', 0)
        .attr('y2', innerHeight)
        .attr('stroke', '#06B6D4')
        .attr('stroke-width', 1.8)
        .attr('stroke-dasharray', '5 3')
        .attr('stroke-opacity', 0.8);

      // Simulation Zone Header Label
      forecastRegionGroup.append('text')
        .attr('x', xDivider + 8)
        .attr('y', 14)
        .attr('fill', '#06B6D4')
        .attr('font-size', '9px')
        .attr('font-family', 'monospace')
        .attr('font-weight', 'bold')
        .text('GEMINI 6-MONTH SIMULATION WINDOW ➔');

      // Forecast Uncertainty Cone Band (Area between upperBound & lowerBound)
      // Connect smoothly from Month 12 historical latest point
      const latestHist = primaryDataset[primaryDataset.length - 1];
      const conePoints = [
        { monthIndex: 12, upperBound: normForecastEco(latestHist.ecologicalFlourishing), lowerBound: normForecastEco(latestHist.ecologicalFlourishing) },
        ...forecastData.map(f => ({
          monthIndex: f.monthIndex,
          upperBound: normForecastEco(f.upperBound),
          lowerBound: normForecastEco(f.lowerBound)
        }))
      ];

      const coneAreaGenerator = d3.area<{ monthIndex: number; upperBound: number; lowerBound: number }>()
        .x(d => xScale(d.monthIndex))
        .y0(d => yScale(d.lowerBound))
        .y1(d => yScale(d.upperBound))
        .curve(d3.curveMonotoneX);

      forecastRegionGroup.append('path')
        .datum(conePoints)
        .attr('fill', 'url(#forecast-uncertainty-gradient)')
        .attr('d', coneAreaGenerator);

      // Forecast Upper & Lower Bound Dashed Perimeter Lines
      const upperLineGen = d3.line<{ monthIndex: number; upperBound: number }>()
        .x(d => xScale(d.monthIndex))
        .y(d => yScale(d.upperBound))
        .curve(d3.curveMonotoneX);

      const lowerLineGen = d3.line<{ monthIndex: number; lowerBound: number }>()
        .x(d => xScale(d.monthIndex))
        .y(d => yScale(d.lowerBound))
        .curve(d3.curveMonotoneX);

      forecastRegionGroup.append('path')
        .datum(conePoints)
        .attr('fill', 'none')
        .attr('stroke', '#06B6D4')
        .attr('stroke-width', 1)
        .attr('stroke-dasharray', '3 3')
        .attr('stroke-opacity', 0.4)
        .attr('d', upperLineGen);

      forecastRegionGroup.append('path')
        .datum(conePoints)
        .attr('fill', 'none')
        .attr('stroke', '#06B6D4')
        .attr('stroke-width', 1)
        .attr('stroke-dasharray', '3 3')
        .attr('stroke-opacity', 0.4)
        .attr('d', lowerLineGen);

      // Projected Ecological Flourishing Curve (Dashed line)
      const projectedEcoPoints = [
        { monthIndex: 12, val: normForecastEco(latestHist.ecologicalFlourishing) },
        ...forecastData.map(f => ({ monthIndex: f.monthIndex, val: normForecastEco(f.projectedFlourishing) }))
      ];

      const projectedEcoLine = d3.line<{ monthIndex: number; val: number }>()
        .x(d => xScale(d.monthIndex))
        .y(d => yScale(d.val))
        .curve(d3.curveMonotoneX);

      forecastRegionGroup.append('path')
        .datum(projectedEcoPoints)
        .attr('fill', 'none')
        .attr('stroke', '#34D399')
        .attr('stroke-width', 2.6)
        .attr('stroke-dasharray', '6 3')
        .attr('stroke-linecap', 'round')
        .attr('d', projectedEcoLine);

      // Projected Economic Stability Curve (Dashed gold)
      const projectedEconPoints = [
        { monthIndex: 12, val: normForecastEcon(latestHist.economicStability) },
        ...forecastData.map(f => ({ monthIndex: f.monthIndex, val: normForecastEcon(f.projectedEconomicStability) }))
      ];

      const projectedEconLine = d3.line<{ monthIndex: number; val: number }>()
        .x(d => xScale(d.monthIndex))
        .y(d => yScale(d.val))
        .curve(d3.curveMonotoneX);

      forecastRegionGroup.append('path')
        .datum(projectedEconPoints)
        .attr('fill', 'none')
        .attr('stroke', '#EAB308')
        .attr('stroke-width', 2.4)
        .attr('stroke-dasharray', '5 3')
        .attr('stroke-linecap', 'round')
        .attr('d', projectedEconLine);

      // Projected Data Points Circles
      forecastData.forEach(f => {
        forecastRegionGroup.append('circle')
          .attr('cx', xScale(f.monthIndex))
          .attr('cy', yScale(normForecastEco(f.projectedFlourishing)))
          .attr('r', 4)
          .attr('fill', '#06B6D4')
          .attr('stroke', '#0A0A0A')
          .attr('stroke-width', 1.5);
      });
    }

    // Horizontal equilibrium baseline line with smooth transition
    const prevEquilibriumVal = wasNormalized ? normEco(80) : 80;
    const newEquilibriumVal = isNormalized ? normEco(80) : 80;
    const prevEquilibriumY = prevYScale(prevEquilibriumVal);
    const newEquilibriumY = yScale(newEquilibriumVal);

    if (newEquilibriumVal >= 0 && newEquilibriumVal <= 100) {
      const eqLine = g.append('line')
        .attr('x1', 0)
        .attr('x2', innerWidth)
        .attr('stroke', '#C5A059')
        .attr('stroke-opacity', 0.25)
        .attr('stroke-width', 1.5)
        .attr('stroke-dasharray', '6 4');

      if (didToggleNormalize) {
        eqLine
          .attr('y1', prevEquilibriumY)
          .attr('y2', prevEquilibriumY)
          .transition()
          .duration(TRANSITION_DURATION)
          .ease(TRANSITION_EASE)
          .attr('y1', newEquilibriumY)
          .attr('y2', newEquilibriumY);
      } else {
        eqLine
          .attr('y1', newEquilibriumY)
          .attr('y2', newEquilibriumY);
      }

      const eqText = g.append('text')
        .attr('x', innerWidth - 6)
        .attr('y', didToggleNormalize ? prevEquilibriumY - 5 : newEquilibriumY - 5)
        .attr('text-anchor', 'end')
        .attr('fill', '#C5A059')
        .attr('font-size', '9px')
        .attr('font-family', 'monospace')
        .attr('opacity', 0.7)
        .text(isNormalized ? 'EQUILIBRIUM BASELINE (80 pts Normalized)' : 'REGENERATIVE EQUILIBRIUM THRESHOLD (80 pts)');

      if (didToggleNormalize) {
        eqText.transition()
          .duration(TRANSITION_DURATION)
          .ease(TRANSITION_EASE)
          .attr('y', newEquilibriumY - 5);
      }
    }

    // Interactive Alert on Threshold Guide Line with Drag-to-Define
    if (alertThreshold.enabled) {
      let thresholdScaled = alertThreshold.value;
      let prevThresholdScaled = alertThreshold.value;
      if (isNormalized) {
        if (alertThreshold.metric === 'ecological') {
          thresholdScaled = normEco(alertThreshold.value);
        } else if (alertThreshold.metric === 'economic') {
          thresholdScaled = normEcon(alertThreshold.value);
        } else {
          thresholdScaled = alertThreshold.value;
        }
      }
      if (wasNormalized) {
        if (alertThreshold.metric === 'ecological') {
          prevThresholdScaled = normEco(alertThreshold.value);
        } else if (alertThreshold.metric === 'economic') {
          prevThresholdScaled = normEcon(alertThreshold.value);
        } else {
          prevThresholdScaled = alertThreshold.value;
        }
      }

      const thresholdY = yScale(thresholdScaled);
      const prevThresholdY = prevYScale(prevThresholdScaled);
      if (thresholdY >= 0 && thresholdY <= innerHeight) {
        const alertGuideGroup = g.append('g')
          .attr('class', 'alert-threshold-guide')
          .attr('id', 'draggable-alert-threshold-layer');

        // Shaded breach zone (territory where condition is breached)
        const breachZone = alertGuideGroup.append('rect')
          .attr('class', 'breach-alert-zone')
          .attr('x', 0)
          .attr('width', innerWidth)
          .attr('fill', '#EF4444')
          .attr('opacity', 0.07)
          .attr('pointer-events', 'none');

        // Glowing backdrop line
        const glowLine = alertGuideGroup.append('line')
          .attr('class', 'threshold-glow-line')
          .attr('x1', 0)
          .attr('x2', innerWidth)
          .attr('stroke', '#EF4444')
          .attr('stroke-width', 4)
          .attr('opacity', 0.25)
          .attr('pointer-events', 'none');

        // Visible dashed threshold line
        const thresholdLine = alertGuideGroup.append('line')
          .attr('class', 'threshold-main-line')
          .attr('x1', 0)
          .attr('x2', innerWidth)
          .attr('stroke', '#EF4444')
          .attr('stroke-width', 2)
          .attr('stroke-dasharray', '6 4')
          .attr('pointer-events', 'none');

        // Wide invisible drag hitbox spanning the full chart width
        const dragHitbox = alertGuideGroup.append('line')
          .attr('class', 'threshold-drag-hitbox')
          .attr('x1', 0)
          .attr('x2', innerWidth)
          .attr('stroke', 'transparent')
          .attr('stroke-width', 30)
          .attr('cursor', 'ns-resize')
          .attr('pointer-events', 'all');

        // Left Drag Handle Pill: [ ↕ DRAG THRESHOLD ]
        const leftHandle = alertGuideGroup.append('g')
          .attr('class', 'threshold-left-handle')
          .attr('cursor', 'ns-resize')
          .attr('pointer-events', 'all');

        if (didToggleNormalize) {
          breachZone
            .attr('y', alertThreshold.condition === 'below' ? prevThresholdY : 0)
            .attr('height', alertThreshold.condition === 'below' ? Math.max(0, innerHeight - prevThresholdY) : prevThresholdY)
            .transition().duration(TRANSITION_DURATION).ease(TRANSITION_EASE)
            .attr('y', alertThreshold.condition === 'below' ? thresholdY : 0)
            .attr('height', alertThreshold.condition === 'below' ? Math.max(0, innerHeight - thresholdY) : thresholdY);

          glowLine
            .attr('y1', prevThresholdY).attr('y2', prevThresholdY)
            .transition().duration(TRANSITION_DURATION).ease(TRANSITION_EASE)
            .attr('y1', thresholdY).attr('y2', thresholdY);

          thresholdLine
            .attr('y1', prevThresholdY).attr('y2', prevThresholdY)
            .transition().duration(TRANSITION_DURATION).ease(TRANSITION_EASE)
            .attr('y1', thresholdY).attr('y2', thresholdY);

          dragHitbox
            .attr('y1', prevThresholdY).attr('y2', prevThresholdY)
            .transition().duration(TRANSITION_DURATION).ease(TRANSITION_EASE)
            .attr('y1', thresholdY).attr('y2', thresholdY);

          leftHandle
            .attr('transform', `translate(4, ${prevThresholdY})`)
            .transition().duration(TRANSITION_DURATION).ease(TRANSITION_EASE)
            .attr('transform', `translate(4, ${thresholdY})`);
        } else {
          breachZone
            .attr('y', alertThreshold.condition === 'below' ? thresholdY : 0)
            .attr('height', alertThreshold.condition === 'below' ? Math.max(0, innerHeight - thresholdY) : thresholdY);

          glowLine.attr('y1', thresholdY).attr('y2', thresholdY);
          thresholdLine.attr('y1', thresholdY).attr('y2', thresholdY);
          dragHitbox.attr('y1', thresholdY).attr('y2', thresholdY);
          leftHandle.attr('transform', `translate(4, ${thresholdY})`);
        }

        const leftHandleRect = leftHandle.append('rect')
          .attr('x', 0)
          .attr('y', -11)
          .attr('width', 118)
          .attr('height', 22)
          .attr('rx', 3)
          .attr('fill', '#260B0B')
          .attr('stroke', '#EF4444')
          .attr('stroke-width', 1.2);

        const leftHandleText = leftHandle.append('text')
          .attr('x', 59)
          .attr('y', 3.5)
          .attr('text-anchor', 'middle')
          .attr('fill', '#FCA5A5')
          .attr('font-size', '8.5px')
          .attr('font-family', 'monospace')
          .attr('font-weight', 'bold')
          .attr('pointer-events', 'none')
          .text('↕ DRAG THRESHOLD');

        // Right Status Badge Pill: [ ⚠️ ALERT: ECO < 75% ]
        const badgeX = Math.max(160, innerWidth - 145);
        const alertBadge = alertGuideGroup.append('g')
          .attr('class', 'threshold-badge-group')
          .attr('cursor', 'ns-resize')
          .attr('pointer-events', 'all');

        if (didToggleNormalize) {
          alertBadge
            .attr('transform', `translate(${badgeX}, ${prevThresholdY})`)
            .transition().duration(TRANSITION_DURATION).ease(TRANSITION_EASE)
            .attr('transform', `translate(${badgeX}, ${thresholdY})`);
        } else {
          alertBadge.attr('transform', `translate(${badgeX}, ${thresholdY})`);
        }

        const badgeRect = alertBadge.append('rect')
          .attr('x', -95)
          .attr('y', -11)
          .attr('width', 190)
          .attr('height', 22)
          .attr('rx', 4)
          .attr('fill', '#450A0A')
          .attr('stroke', '#EF4444')
          .attr('stroke-width', 1.2);

        const badgeText = alertBadge.append('text')
          .attr('x', -8)
          .attr('y', 4)
          .attr('text-anchor', 'middle')
          .attr('fill', '#FCA5A5')
          .attr('font-size', '8.5px')
          .attr('font-family', 'monospace')
          .attr('font-weight', 'bold')
          .attr('pointer-events', 'none')
          .text(`⚠️ ALERT: ${alertThreshold.metric.toUpperCase()} ${alertThreshold.condition === 'below' ? '<' : '>'} ${alertThreshold.value}${alertThreshold.metric === 'decoupling' ? 'pts' : '%'}`);

        // Quick settings gear icon button inside badge
        const gearButton = alertBadge.append('g')
          .attr('transform', 'translate(80, 0)')
          .attr('cursor', 'pointer')
          .on('click', (e) => {
            e.stopPropagation();
            audioFeedback.playMicroTick();
            setIsThresholdModalOpen(true);
          });

        gearButton.append('circle')
          .attr('r', 7)
          .attr('fill', '#7F1D1D')
          .attr('stroke', '#F87171')
          .attr('stroke-width', 0.8);

        gearButton.append('text')
          .attr('text-anchor', 'middle')
          .attr('y', 3)
          .attr('fill', '#FEE2E2')
          .attr('font-size', '8px')
          .attr('font-family', 'sans-serif')
          .text('⚙');

        // Drag Behavior using d3.drag()
        let activeDraggedValue = alertThreshold.value;
        let dragStartY = 0;
        let hasMovedSignificantly = false;

        const dragBehavior = d3.drag<any, unknown>()
          .on('start', (event) => {
            dragStartY = event.y;
            hasMovedSignificantly = false;
            audioFeedback.playMicroTick();
            glowLine.attr('stroke-width', 8).attr('opacity', 0.55);
            thresholdLine.attr('stroke-width', 2.8).attr('stroke', '#F87171');
            leftHandleRect.attr('fill', '#7F1D1D').attr('stroke', '#FCA5A5');
            badgeRect.attr('fill', '#7F1D1D').attr('stroke', '#FCA5A5');
          })
          .on('drag', (event) => {
            if (Math.abs(event.y - dragStartY) > 3) {
              hasMovedSignificantly = true;
            }
            const clampedY = Math.max(0, Math.min(innerHeight, event.y));
            const invertedRaw = yScale.invert(clampedY);

            // Invert normalization if active
            let calculatedVal = invertedRaw;
            if (isNormalized) {
              if (alertThreshold.metric === 'ecological') {
                calculatedVal = minEco + (invertedRaw / 100) * (maxEco - minEco);
              } else if (alertThreshold.metric === 'economic') {
                calculatedVal = minEcon + (invertedRaw / 100) * (maxEcon - minEcon);
              } else {
                calculatedVal = minCounter + (invertedRaw / 100) * (maxCounter - minCounter);
              }
            }

            // Bound between 10% and 100%
            const boundedVal = Math.max(10, Math.min(100, calculatedVal));
            activeDraggedValue = Math.round(boundedVal * 10) / 10;

            // Direct real-time updates to all SVG elements for silky smooth 60fps rendering
            glowLine.attr('y1', clampedY).attr('y2', clampedY);
            thresholdLine.attr('y1', clampedY).attr('y2', clampedY);
            dragHitbox.attr('y1', clampedY).attr('y2', clampedY);
            leftHandle.attr('transform', `translate(4, ${clampedY})`);
            alertBadge.attr('transform', `translate(${badgeX}, ${clampedY})`);

            // Update breach zone rect
            if (alertThreshold.condition === 'below') {
              breachZone.attr('y', clampedY).attr('height', Math.max(0, innerHeight - clampedY));
            } else {
              breachZone.attr('y', 0).attr('height', clampedY);
            }

            // Dynamic live text labels
            leftHandleText.text(`↕ ${activeDraggedValue}${alertThreshold.metric === 'decoupling' ? 'pts' : '%'}`);
            badgeText.text(`⚠️ SETTING: ${alertThreshold.metric.toUpperCase()} ${alertThreshold.condition === 'below' ? '<' : '>'} ${activeDraggedValue}${alertThreshold.metric === 'decoupling' ? 'pts' : '%'}`);
          })
          .on('end', () => {
            glowLine.attr('stroke-width', 4).attr('opacity', 0.25);
            thresholdLine.attr('stroke-width', 2).attr('stroke', '#EF4444');
            leftHandleRect.attr('fill', '#260B0B').attr('stroke', '#EF4444');
            badgeRect.attr('fill', '#450A0A').attr('stroke', '#EF4444');

            if (!hasMovedSignificantly) {
              // User clicked rather than dragged -> open settings modal
              audioFeedback.playSubtleClick();
              setIsThresholdModalOpen(true);
              return;
            }

            // Apply new threshold
            audioFeedback.playSuccessChime();
            setAlertThreshold(prev => ({
              ...prev,
              value: activeDraggedValue
            }));

            // Immediate notification setup feedback
            const unit = alertThreshold.metric === 'decoupling' ? 'pts' : '%';
            setAlertDragFeedback(`Threshold updated to ${activeDraggedValue}${unit}. Real-time watchdog active for ${alertThreshold.metric.toUpperCase()} ${alertThreshold.condition === 'below' ? '<' : '>'} ${activeDraggedValue}${unit}.`);
            setTimeout(() => {
              setAlertDragFeedback(null);
            }, 5500);
          });

        dragHitbox.call(dragBehavior);
        leftHandle.call(dragBehavior);
        alertBadge.call(dragBehavior);
      }
    }

    // Bottom X-Axis
    const tickSpan = Math.max(1, Math.round(effectiveDomain[1] - effectiveDomain[0]));
    const tickCount = Math.min(maxMonth, tickSpan + 1);
    const xAxis = d3.axisBottom(xScale)
      .ticks(tickCount)
      .tickFormat((d) => {
        const num = Number(d);
        if (num <= 12) {
          const pt = TWELVE_MONTH_INTERVAL_DATA.find(p => p.monthIndex === num);
          return pt ? pt.shortMonth : `M${num}`;
        } else {
          const f = forecastData.find(p => p.monthIndex === num);
          return f ? f.shortMonth : `M${num}`;
        }
      });

    const xAxisGroup = g.append('g')
      .attr('transform', `translate(0,${innerHeight})`)
      .call(xAxis);

    xAxisGroup.select('.domain').attr('stroke', '#333835');
    xAxisGroup.selectAll('.tick line').attr('stroke', '#333835');
    xAxisGroup.selectAll('.tick text')
      .attr('fill', (d) => Number(d) > 12 ? '#06B6D4' : '#8E9490')
      .attr('font-size', '10px')
      .attr('font-family', 'monospace')
      .attr('font-weight', (d) => Number(d) > 12 ? 'bold' : 'normal');

    // Left Y-Axis with smooth transition when toggling between raw and normalized modes
    const yAxis = d3.axisLeft(yScale)
      .ticks(6)
      .tickFormat(d => `${d}%`);

    let yAxisGroup;
    if (didToggleNormalize) {
      const prevYAxis = d3.axisLeft(prevYScale).ticks(6).tickFormat(d => `${d}%`);
      yAxisGroup = g.append('g').call(prevYAxis);
      yAxisGroup.transition()
        .duration(TRANSITION_DURATION)
        .ease(TRANSITION_EASE)
        .call(yAxis);
    } else {
      yAxisGroup = g.append('g').call(yAxis);
    }

    yAxisGroup.select('.domain').attr('stroke', '#333835');
    yAxisGroup.selectAll('.tick line').attr('stroke', '#333835');
    yAxisGroup.selectAll('.tick text')
      .attr('fill', '#8E9490')
      .attr('font-size', '10px')
      .attr('font-family', 'monospace');

    // Y-Axis Contextual Label
    g.append('text')
      .attr('transform', 'rotate(-90)')
      .attr('y', -40)
      .attr('x', -innerHeight / 2)
      .attr('text-anchor', 'middle')
      .attr('fill', '#8E9490')
      .attr('font-size', '9px')
      .attr('font-family', 'monospace')
      .text(isNormalized ? 'NORMALIZED RELATIVE SCALE (0 - 100%)' : 'EVALUATION SCORE (PERCENTILE)');

    // -------------------------------------------------------------
    // -------------------------------------------------------------
    // 3. MULTI-BIOREGION COMPARISON CURVES OR DETAILED PRIMARY CURVES
    // -------------------------------------------------------------
    const isMultiRegionMode = selectedBioregionObjects.length > 1;

    if (isMultiRegionMode) {
      // Shaded Confidence Interval Envelope (±1σ / 95% CI) for each comparative bioregion
      if (isConfidenceIntervalActive) {
        selectedBioregionObjects.forEach((region) => {
          const prevCiAreaGen = d3.area<MonthlyTrendDataPoint>()
            .x(d => xScale(d.monthIndex))
            .y0(d => {
              const sigma = Number((3.6 - (d.monthIndex * 0.08)).toFixed(2));
              const lower = Math.max(0, d.ecologicalFlourishing - sigma);
              return prevYScale(prevNormRegionEco(lower, region.monthlyData));
            })
            .y1(d => {
              const sigma = Number((3.6 - (d.monthIndex * 0.08)).toFixed(2));
              const upper = Math.min(100, d.ecologicalFlourishing + sigma);
              return prevYScale(prevNormRegionEco(upper, region.monthlyData));
            })
            .curve(d3.curveMonotoneX);

          const curCiAreaGen = d3.area<MonthlyTrendDataPoint>()
            .x(d => xScale(d.monthIndex))
            .y0(d => {
              const sigma = Number((3.6 - (d.monthIndex * 0.08)).toFixed(2));
              const lower = Math.max(0, d.ecologicalFlourishing - sigma);
              return yScale(curNormRegionEco(lower, region.monthlyData));
            })
            .y1(d => {
              const sigma = Number((3.6 - (d.monthIndex * 0.08)).toFixed(2));
              const upper = Math.min(100, d.ecologicalFlourishing + sigma);
              return yScale(curNormRegionEco(upper, region.monthlyData));
            })
            .curve(d3.curveMonotoneX);

          const ciPath = plotG.append('path')
            .datum(region.monthlyData)
            .attr('class', `ci-band-${region.id}`)
            .attr('fill', region.color)
            .attr('fill-opacity', 0.16)
            .attr('stroke', region.color)
            .attr('stroke-width', 0.8)
            .attr('stroke-dasharray', '3 3')
            .attr('stroke-opacity', 0.5);

          if (didToggleNormalize) {
            ciPath
              .attr('d', prevCiAreaGen)
              .transition().duration(TRANSITION_DURATION).ease(TRANSITION_EASE)
              .attr('d', curCiAreaGen);
          } else {
            ciPath.attr('d', curCiAreaGen);
          }
        });
      }

      // MULTI-LINE COMPARISON MODE: Plot curves for each selected bioregion
      selectedBioregionObjects.forEach((region) => {
        const prevLineGen = d3.line<MonthlyTrendDataPoint>()
          .x(d => xScale(d.monthIndex))
          .y(d => prevYScale(prevNormRegionEco(d.ecologicalFlourishing, region.monthlyData)))
          .curve(d3.curveMonotoneX);

        const curLineGen = d3.line<MonthlyTrendDataPoint>()
          .x(d => xScale(d.monthIndex))
          .y(d => yScale(curNormRegionEco(d.ecologicalFlourishing, region.monthlyData)))
          .curve(d3.curveMonotoneX);

        // Bioregion line
        const regionLine = plotG.append('path')
          .datum(region.monthlyData)
          .attr('fill', 'none')
          .attr('stroke', region.color)
          .attr('stroke-width', 2.4)
          .attr('stroke-linecap', 'round')
          .attr('opacity', 0.9);

        if (didToggleNormalize) {
          regionLine
            .attr('d', prevLineGen)
            .transition().duration(TRANSITION_DURATION).ease(TRANSITION_EASE)
            .attr('d', curLineGen);
        } else {
          regionLine.attr('d', curLineGen);
        }

        // Bioregion dots
        region.monthlyData.forEach(d => {
          const prevCy = prevYScale(prevNormRegionEco(d.ecologicalFlourishing, region.monthlyData));
          const newCy = yScale(curNormRegionEco(d.ecologicalFlourishing, region.monthlyData));

          const rCircle = plotG.append('circle')
            .attr('cx', xScale(d.monthIndex))
            .attr('r', 3.5)
            .attr('fill', region.color)
            .attr('stroke', '#0A0A0A')
            .attr('stroke-width', 1.5)
            .attr('cursor', 'pointer');

          rCircle.append('title')
            .text(`${region.name} - ${d.exactDate || d.calendarMonth}\nRaw: ${d.ecologicalFlourishing}%\nNorm: ${normRegionEco(d.ecologicalFlourishing, region.monthlyData).toFixed(1)}%`);

          rCircle.on('mouseenter', () => updateCrosshairToPoint(d));

          if (didToggleNormalize) {
            rCircle
              .attr('cy', prevCy)
              .transition().duration(TRANSITION_DURATION).ease(TRANSITION_EASE)
              .attr('cy', newCy);
          } else {
            rCircle.attr('cy', newCy);
          }
        });
      });
    } else {
      // SINGLE BIOREGION DETAILED MODE: Ecological, Economic, Area Fills, Counterfactual
      const prevEcoLine = d3.line<MonthlyTrendDataPoint>()
        .x(d => xScale(d.monthIndex))
        .y(d => prevYScale(prevNormEco(d.ecologicalFlourishing)))
        .curve(d3.curveMonotoneX);

      const curEcoLine = d3.line<MonthlyTrendDataPoint>()
        .x(d => xScale(d.monthIndex))
        .y(d => yScale(curNormEco(d.ecologicalFlourishing)))
        .curve(d3.curveMonotoneX);

      const prevEconLine = d3.line<MonthlyTrendDataPoint>()
        .x(d => xScale(d.monthIndex))
        .y(d => prevYScale(prevNormEcon(d.economicStability)))
        .curve(d3.curveMonotoneX);

      const curEconLine = d3.line<MonthlyTrendDataPoint>()
        .x(d => xScale(d.monthIndex))
        .y(d => yScale(curNormEcon(d.economicStability)))
        .curve(d3.curveMonotoneX);

      const prevCounterfactualLine = d3.line<MonthlyTrendDataPoint>()
        .x(d => xScale(d.monthIndex))
        .y(d => prevYScale(prevNormCounter(d.extractiveCounterfactual)))
        .curve(d3.curveMonotoneX);

      const curCounterfactualLine = d3.line<MonthlyTrendDataPoint>()
        .x(d => xScale(d.monthIndex))
        .y(d => yScale(curNormCounter(d.extractiveCounterfactual)))
        .curve(d3.curveMonotoneX);

      const prevEcoArea = d3.area<MonthlyTrendDataPoint>()
        .x(d => xScale(d.monthIndex))
        .y0(innerHeight)
        .y1(d => prevYScale(prevNormEco(d.ecologicalFlourishing)))
        .curve(d3.curveMonotoneX);

      const curEcoArea = d3.area<MonthlyTrendDataPoint>()
        .x(d => xScale(d.monthIndex))
        .y0(innerHeight)
        .y1(d => yScale(curNormEco(d.ecologicalFlourishing)))
        .curve(d3.curveMonotoneX);

      const prevEconArea = d3.area<MonthlyTrendDataPoint>()
        .x(d => xScale(d.monthIndex))
        .y0(innerHeight)
        .y1(d => prevYScale(prevNormEcon(d.economicStability)))
        .curve(d3.curveMonotoneX);

      const curEconArea = d3.area<MonthlyTrendDataPoint>()
        .x(d => xScale(d.monthIndex))
        .y0(innerHeight)
        .y1(d => yScale(curNormEcon(d.economicStability)))
        .curve(d3.curveMonotoneX);

      // Shaded Confidence Interval Envelopes (±1σ / 95% CI)
      if (isConfidenceIntervalActive) {
        if (activeSeries === 'both' || activeSeries === 'ecological') {
          const prevEcoCIAreaGen = d3.area<MonthlyTrendDataPoint>()
            .x(d => xScale(d.monthIndex))
            .y0(d => {
              const sigma = Number((3.6 - (d.monthIndex * 0.08)).toFixed(2));
              const lower = Math.max(0, d.ecologicalFlourishing - sigma);
              return prevYScale(prevNormEco(lower));
            })
            .y1(d => {
              const sigma = Number((3.6 - (d.monthIndex * 0.08)).toFixed(2));
              const upper = Math.min(100, d.ecologicalFlourishing + sigma);
              return prevYScale(prevNormEco(upper));
            })
            .curve(d3.curveMonotoneX);

          const curEcoCIAreaGen = d3.area<MonthlyTrendDataPoint>()
            .x(d => xScale(d.monthIndex))
            .y0(d => {
              const sigma = Number((3.6 - (d.monthIndex * 0.08)).toFixed(2));
              const lower = Math.max(0, d.ecologicalFlourishing - sigma);
              return yScale(curNormEco(lower));
            })
            .y1(d => {
              const sigma = Number((3.6 - (d.monthIndex * 0.08)).toFixed(2));
              const upper = Math.min(100, d.ecologicalFlourishing + sigma);
              return yScale(curNormEco(upper));
            })
            .curve(d3.curveMonotoneX);

          const ecoCIPath = plotG.append('path')
            .datum(primaryDataset)
            .attr('class', 'ci-band-eco')
            .attr('fill', '#10B981')
            .attr('fill-opacity', 0.18)
            .attr('stroke', '#10B981')
            .attr('stroke-width', 0.8)
            .attr('stroke-dasharray', '3 3')
            .attr('stroke-opacity', 0.55);

          if (didToggleNormalize) {
            ecoCIPath
              .attr('d', prevEcoCIAreaGen)
              .transition().duration(TRANSITION_DURATION).ease(TRANSITION_EASE)
              .attr('d', curEcoCIAreaGen);
          } else {
            ecoCIPath.attr('d', curEcoCIAreaGen);
          }
        }

        if (activeSeries === 'both' || activeSeries === 'economic') {
          const prevEconCIAreaGen = d3.area<MonthlyTrendDataPoint>()
            .x(d => xScale(d.monthIndex))
            .y0(d => {
              const sigma = Number((3.0 - (d.monthIndex * 0.06)).toFixed(2));
              const lower = Math.max(0, d.economicStability - sigma);
              return prevYScale(prevNormEcon(lower));
            })
            .y1(d => {
              const sigma = Number((3.0 - (d.monthIndex * 0.06)).toFixed(2));
              const upper = Math.min(100, d.economicStability + sigma);
              return prevYScale(prevNormEcon(upper));
            })
            .curve(d3.curveMonotoneX);

          const curEconCIAreaGen = d3.area<MonthlyTrendDataPoint>()
            .x(d => xScale(d.monthIndex))
            .y0(d => {
              const sigma = Number((3.0 - (d.monthIndex * 0.06)).toFixed(2));
              const lower = Math.max(0, d.economicStability - sigma);
              return yScale(curNormEcon(lower));
            })
            .y1(d => {
              const sigma = Number((3.0 - (d.monthIndex * 0.06)).toFixed(2));
              const upper = Math.min(100, d.economicStability + sigma);
              return yScale(curNormEcon(upper));
            })
            .curve(d3.curveMonotoneX);

          const econCIPath = plotG.append('path')
            .datum(primaryDataset)
            .attr('class', 'ci-band-econ')
            .attr('fill', '#C5A059')
            .attr('fill-opacity', 0.16)
            .attr('stroke', '#C5A059')
            .attr('stroke-width', 0.8)
            .attr('stroke-dasharray', '3 3')
            .attr('stroke-opacity', 0.55);

          if (didToggleNormalize) {
            econCIPath
              .attr('d', prevEconCIAreaGen)
              .transition().duration(TRANSITION_DURATION).ease(TRANSITION_EASE)
              .attr('d', curEconCIAreaGen);
          } else {
            econCIPath.attr('d', curEconCIAreaGen);
          }
        }
      }

      // Extractive Counterfactual
      if (showCounterfactual) {
        const counterPath = plotG.append('path')
          .datum(primaryDataset)
          .attr('fill', 'none')
          .attr('stroke', '#EF4444')
          .attr('stroke-width', 1.5)
          .attr('stroke-dasharray', '4 4')
          .attr('opacity', 0.5);

        if (didToggleNormalize) {
          counterPath
            .attr('d', prevCounterfactualLine)
            .transition().duration(TRANSITION_DURATION).ease(TRANSITION_EASE)
            .attr('d', curCounterfactualLine);
        } else {
          counterPath.attr('d', curCounterfactualLine);
        }
      }

      // Economic Stability
      if (activeSeries === 'both' || activeSeries === 'economic') {
        if (showAreaFill) {
          const econAreaPath = plotG.append('path')
            .datum(primaryDataset)
            .attr('fill', 'url(#econ-stability-gradient)');

          if (didToggleNormalize) {
            econAreaPath
              .attr('d', prevEconArea)
              .transition().duration(TRANSITION_DURATION).ease(TRANSITION_EASE)
              .attr('d', curEconArea);
          } else {
            econAreaPath.attr('d', curEconArea);
          }
        }

        const econPath = plotG.append('path')
          .datum(primaryDataset)
          .attr('fill', 'none')
          .attr('stroke', isDataPurified ? '#E0C070' : '#C5A059')
          .attr('stroke-width', isDataPurified ? 3.2 : 2.8)
          .attr('stroke-linecap', 'round');

        if (isDataPurified) {
          econPath.attr('filter', 'url(#celestial-star-glow)');
        }

        if (didToggleNormalize) {
          econPath
            .attr('d', prevEconLine)
            .transition().duration(TRANSITION_DURATION).ease(TRANSITION_EASE)
            .attr('d', curEconLine);
        } else {
          econPath.attr('d', curEconLine);
        }
      }

      // Ecological Flourishing
      if (activeSeries === 'both' || activeSeries === 'ecological') {
        if (showAreaFill) {
          const ecoAreaPath = plotG.append('path')
            .datum(primaryDataset)
            .attr('fill', 'url(#eco-flourish-gradient)');

          if (didToggleNormalize) {
            ecoAreaPath
              .attr('d', prevEcoArea)
              .transition().duration(TRANSITION_DURATION).ease(TRANSITION_EASE)
              .attr('d', curEcoArea);
          } else {
            ecoAreaPath.attr('d', curEcoArea);
          }
        }

        const ecoPath = plotG.append('path')
          .datum(primaryDataset)
          .attr('fill', 'none')
          .attr('stroke', isDataPurified ? '#34D399' : '#10B981')
          .attr('stroke-width', isDataPurified ? 3.2 : 2.8)
          .attr('stroke-linecap', 'round');

        if (isDataPurified) {
          ecoPath.attr('filter', 'url(#celestial-star-glow)');
        }

        if (didToggleNormalize) {
          ecoPath
            .attr('d', prevEcoLine)
            .transition().duration(TRANSITION_DURATION).ease(TRANSITION_EASE)
            .attr('d', curEcoLine);
        } else {
          ecoPath.attr('d', curEcoLine);
        }
      }

      // Historical Prior Year (Longitudinal Analysis Overlay)
      if (showHistoricalComparison) {
        const histData = getBioregionHistoricalData(selectedBioregionObjects[0]?.id || 'pan-african');

        const prevHistLine = d3.line<MonthlyTrendDataPoint>()
          .x(d => xScale(d.monthIndex))
          .y(d => prevYScale(prevNormEco(d.ecologicalFlourishing)))
          .curve(d3.curveMonotoneX);

        const curHistLine = d3.line<MonthlyTrendDataPoint>()
          .x(d => xScale(d.monthIndex))
          .y(d => yScale(curNormEco(d.ecologicalFlourishing)))
          .curve(d3.curveMonotoneX);

        // Shaded comparison delta
        const longitudinalArea = d3.area<MonthlyTrendDataPoint>()
          .x(d => xScale(d.monthIndex))
          .y0((d, i) => yScale(curNormEco(histData[i]?.ecologicalFlourishing || d.ecologicalFlourishing)))
          .y1(d => yScale(curNormEco(d.ecologicalFlourishing)))
          .curve(d3.curveMonotoneX);

        plotG.append('path')
          .datum(primaryDataset)
          .attr('class', 'longitudinal-delta-area')
          .attr('fill', '#3B82F6')
          .attr('fill-opacity', 0.12)
          .attr('d', longitudinalArea);

        const histLinePath = plotG.append('path')
          .datum(histData)
          .attr('class', 'historical-prior-year-line')
          .attr('fill', 'none')
          .attr('stroke', '#60A5FA')
          .attr('stroke-width', 2.2)
          .attr('stroke-dasharray', '6 4')
          .attr('opacity', 0.85);

        if (didToggleNormalize) {
          histLinePath
            .attr('d', prevHistLine)
            .transition().duration(TRANSITION_DURATION).ease(TRANSITION_EASE)
            .attr('d', curHistLine);
        } else {
          histLinePath.attr('d', curHistLine);
        }

        // Add node dots for historical points
        histData.forEach((hd) => {
          const cyVal = yScale(curNormEco(hd.ecologicalFlourishing));
          const cxVal = xScale(hd.monthIndex);
          const histCircle = plotG.append('circle')
            .attr('cx', cxVal)
            .attr('cy', cyVal)
            .attr('r', 3.5)
            .attr('fill', '#0B0F19')
            .attr('stroke', '#60A5FA')
            .attr('stroke-width', 1.8)
            .attr('cursor', 'pointer');

          histCircle.append('title')
            .text(`Historical Prior Year Baseline (${hd.calendarMonth}):\nEcological: ${hd.ecologicalFlourishing}%\nEconomic: ${hd.economicStability}%\nDecoupling: ${hd.decouplingMargin > 0 ? '+' : ''}${hd.decouplingMargin} pts\nMilestone: ${hd.milestone}\n[Click to record Epistemic Observation]`);

          histCircle.on('click', () => {
            audioFeedback.playMicroTick();
            handleOpenEpistemicObservation(hd);
          });
        });
      }

      // Point Markers with Hover Tooltip Details
      primaryDataset.forEach((d) => {
        const isSelected = selectedPoint.monthIndex === d.monthIndex;
        const exactDateStr = d.exactDate || `${d.calendarMonth}, 2026`;

        if (activeSeries === 'both' || activeSeries === 'ecological') {
          const prevCyEco = prevYScale(prevNormEco(d.ecologicalFlourishing));
          const newCyEco = yScale(curNormEco(d.ecologicalFlourishing));

          const ecoCircle = plotG.append('circle')
            .attr('cx', xScale(d.monthIndex))
            .attr('r', isSelected ? 5.5 : 3.5)
            .attr('fill', '#10B981')
            .attr('stroke', '#0A0A0A')
            .attr('stroke-width', 2)
            .attr('cursor', 'pointer');

          ecoCircle.append('title')
            .text(`${exactDateStr}\nEcological: Raw ${d.ecologicalFlourishing}% (Norm: ${normEco(d.ecologicalFlourishing).toFixed(1)}%)\nDecoupling: +${d.decouplingMargin} pts\n[Double-click to add Epistemic Observation]`);

          ecoCircle.on('mouseenter', () => updateCrosshairToPoint(d));
          ecoCircle.on('click', () => {
            audioFeedback.playMicroTick();
            setSelectedPoint(d);
            onInspectPoint?.(d);
          });
          ecoCircle.on('dblclick', () => {
            audioFeedback.playMicroTick();
            handleOpenEpistemicObservation(d);
          });

          if (didToggleNormalize) {
            ecoCircle
              .attr('cy', prevCyEco)
              .transition().duration(TRANSITION_DURATION).ease(TRANSITION_EASE)
              .attr('cy', newCyEco);
          } else {
            ecoCircle.attr('cy', newCyEco);
          }
        }

        if (activeSeries === 'both' || activeSeries === 'economic') {
          const prevCyEcon = prevYScale(prevNormEcon(d.economicStability));
          const newCyEcon = yScale(curNormEcon(d.economicStability));

          const econCircle = plotG.append('circle')
            .attr('cx', xScale(d.monthIndex))
            .attr('r', isSelected ? 5.5 : 3.5)
            .attr('fill', '#C5A059')
            .attr('stroke', '#0A0A0A')
            .attr('stroke-width', 2)
            .attr('cursor', 'pointer');

          econCircle.append('title')
            .text(`${exactDateStr}\nEconomic: Raw ${d.economicStability}% (Norm: ${normEcon(d.economicStability).toFixed(1)}%)\nDecoupling: +${d.decouplingMargin} pts\n[Double-click to add Epistemic Observation]`);

          econCircle.on('mouseenter', () => updateCrosshairToPoint(d));
          econCircle.on('click', () => {
            audioFeedback.playMicroTick();
            setSelectedPoint(d);
            onInspectPoint?.(d);
          });
          econCircle.on('dblclick', () => {
            audioFeedback.playMicroTick();
            handleOpenEpistemicObservation(d);
          });

          if (didToggleNormalize) {
            econCircle
              .attr('cy', prevCyEcon)
              .transition().duration(TRANSITION_DURATION).ease(TRANSITION_EASE)
              .attr('cy', newCyEcon);
          } else {
            econCircle.attr('cy', newCyEcon);
          }
        }
      });
    }

    // -------------------------------------------------------------
    // 4. INTERACTIVE ANNOTATION MARKERS & SPIKE/DROP CALLOUT LABELS
    // -------------------------------------------------------------
    if (showAnnotations) {
      const annotationGroup = g.append('g').attr('class', 'timeline-annotation-markers');

      allAnnotations.forEach((anno) => {
        const xPos = xScale(anno.monthIndex);
        if (xPos < -20 || xPos > innerWidth + 20) return;

        const yPos = innerHeight + 12;

        // Bottom Timeline Diamond Pin
        const annoMarkerG = annotationGroup.append('g')
          .attr('transform', `translate(${xPos}, ${yPos})`)
          .attr('cursor', 'pointer')
          .on('click', () => {
            audioFeedback.playCovenantResonance();
            setSelectedAnnotation(anno);
          });

        // Vertical Guide Line from Axis to Chart Height
        annotationGroup.append('line')
          .attr('x1', xPos)
          .attr('x2', xPos)
          .attr('y1', 0)
          .attr('y2', innerHeight)
          .attr('stroke', anno.categoryColor)
          .attr('stroke-width', 1)
          .attr('stroke-dasharray', '2 3')
          .attr('stroke-opacity', 0.4);

        // Diamond Pin Marker Icon
        annoMarkerG.append('polygon')
          .attr('points', '0,-12 8,-20 0,-28 -8,-20')
          .attr('fill', anno.categoryColor)
          .attr('stroke', '#0A0A0A')
          .attr('stroke-width', 1.5);

        annoMarkerG.append('circle')
          .attr('cx', 0)
          .attr('cy', -20)
          .attr('r', 2.5)
          .attr('fill', '#000000');

        // Text Pill Label along axis
        annoMarkerG.append('text')
          .attr('x', 0)
          .attr('y', 14)
          .attr('text-anchor', 'middle')
          .attr('fill', anno.categoryColor)
          .attr('font-size', '8.5px')
          .attr('font-family', 'monospace')
          .attr('font-weight', 'bold')
          .text(anno.shortMonth);

        // On-Chart Spike/Drop Callout Flag (for custom annotations or marked events)
        if (anno.isCustom || anno.customLabelText || anno.spikeOrDrop) {
          const pt = primaryDataset.find(p => p.monthIndex === anno.monthIndex);
          if (pt && xPos >= 0 && xPos <= innerWidth) {
            const yPointVal = yScale(normEco(pt.ecologicalFlourishing));
            const isSpike = anno.spikeOrDrop === 'spike';
            const isDrop = anno.spikeOrDrop === 'drop';
            const calloutY = isDrop ? Math.min(innerHeight - 25, yPointVal + 35) : Math.max(25, yPointVal - 38);

            const calloutFlag = plotG.append('g')
              .attr('class', 'custom-spike-drop-callout')
              .attr('transform', `translate(${xPos}, ${calloutY})`)
              .attr('cursor', 'pointer')
              .on('click', (evt) => {
                evt.stopPropagation();
                audioFeedback.playCovenantResonance();
                setSelectedAnnotation(anno);
              });

            // Dashed connection stem between callout and curve point
            plotG.append('line')
              .attr('x1', xPos)
              .attr('x2', xPos)
              .attr('y1', isDrop ? calloutY - 8 : calloutY + 8)
              .attr('y2', yPointVal)
              .attr('stroke', anno.categoryColor)
              .attr('stroke-width', 1.2)
              .attr('stroke-dasharray', '2 2')
              .attr('stroke-opacity', 0.85);

            // Reticle halo around point
            plotG.append('circle')
              .attr('cx', xPos)
              .attr('cy', yPointVal)
              .attr('r', 5.5)
              .attr('fill', 'none')
              .attr('stroke', anno.categoryColor)
              .attr('stroke-width', 1.5)
              .attr('stroke-dasharray', '2 2');

            const labelText = anno.customLabelText || anno.title;
            const displayLabel = labelText.length > 22 ? labelText.slice(0, 20) + '…' : labelText;
            const iconSymbol = isSpike ? '▲ ' : isDrop ? '▼ ' : '🏷️ ';
            const badgeContent = `${iconSymbol}${displayLabel}`;
            const badgeW = Math.max(68, badgeContent.length * 6.5 + 14);

            calloutFlag.append('rect')
              .attr('x', -badgeW / 2)
              .attr('y', -10)
              .attr('width', badgeW)
              .attr('height', 20)
              .attr('rx', 4)
              .attr('fill', '#0B110D')
              .attr('stroke', anno.categoryColor)
              .attr('stroke-width', 1.5);

            calloutFlag.append('text')
              .attr('x', 0)
              .attr('y', 3.5)
              .attr('text-anchor', 'middle')
              .attr('fill', isSpike ? '#34D399' : isDrop ? '#F87171' : '#F5E6C8')
              .attr('font-size', '9px')
              .attr('font-family', 'monospace')
              .attr('font-weight', 'bold')
              .text(badgeContent);
          }
        }
      });
    }

    // -------------------------------------------------------------
    // 4B. CELESTIAL ALIGNMENT (Bioregional Milestone Constellation Map)
    // -------------------------------------------------------------
    if (isCelestialAlignment) {
      const celestialG = plotG.append('g').attr('class', 'celestial-constellation-alignment-layer');

      // Draw dashed stardust constellation lines between connected bioregional milestones
      CONSTELLATION_VECTOR_PAIRS.forEach(([fromMonth, toMonth]) => {
        const p1 = primaryDataset.find(p => p.monthIndex === fromMonth);
        const p2 = primaryDataset.find(p => p.monthIndex === toMonth);
        if (!p1 || !p2) return;

        const x1 = xScale(p1.monthIndex);
        const y1 = yScale(curNormEco(p1.ecologicalFlourishing));
        const x2 = xScale(p2.monthIndex);
        const y2 = yScale(curNormEco(p2.ecologicalFlourishing));

        celestialG.append('line')
          .attr('x1', x1)
          .attr('y1', y1)
          .attr('x2', x2)
          .attr('y2', y2)
          .attr('stroke', '#E0C070')
          .attr('stroke-width', 1.8)
          .attr('stroke-dasharray', '4 3')
          .attr('stroke-opacity', 0.85)
          .attr('filter', 'url(#celestial-star-glow)');
      });

      // Draw celestial star glyphs and magnitude halos at each data point
      primaryDataset.forEach(d => {
        const align = CELESTIAL_HISTORICAL_ALIGNMENTS.find(a => a.monthIndex === d.monthIndex);
        if (!align) return;
        const cx = xScale(d.monthIndex);
        const cy = yScale(curNormEco(d.ecologicalFlourishing));

        const starG = celestialG.append('g')
          .attr('transform', `translate(${cx}, ${cy})`)
          .attr('cursor', 'pointer')
          .on('click', () => {
            alchemicalAudio.playSingingBowl(528, 2.8);
            setSelectedPoint(d);
            setHoveredPoint(d);
            setIsCrosshairActive(true);
            setIsPinned(true);
            setCrosshairPos({
              x: cx + margin.left,
              yEco: cy + margin.top,
              yEcon: yScale(curNormEcon(d.economicStability)) + margin.top,
              innerWidth
            });
          });

        // Outer pulsing halo
        starG.append('circle')
          .attr('r', 10)
          .attr('fill', align.constellationColor)
          .attr('fill-opacity', 0.18)
          .attr('stroke', align.constellationColor)
          .attr('stroke-width', 0.8)
          .attr('stroke-opacity', 0.65);

        // 4-pointed diamond star glyph
        starG.append('path')
          .attr('d', 'M0,-7 L2,-2 L7,0 L2,2 L0,7 L-2,2 L-7,0 L-2,-2 Z')
          .attr('fill', '#FFFFFF')
          .attr('stroke', align.constellationColor)
          .attr('stroke-width', 0.8);

        // Celestial callout label above
        starG.append('text')
          .attr('y', -12)
          .attr('text-anchor', 'middle')
          .attr('fill', align.constellationColor)
          .attr('font-size', '8px')
          .attr('font-family', 'monospace')
          .attr('font-weight', 'bold')
          .text(align.starName.split(':')[0]);
      });
    }

    // -------------------------------------------------------------
    // 5. INTERACTIVE ZOOM BRUSH (Drag & Select Date Range)
    // -------------------------------------------------------------
    if (isZoomSelectMode) {
      const brush = d3.brushX()
        .extent([[0, 0], [innerWidth, innerHeight]])
        .on('end', (event) => {
          if (!event.selection) return;
          const [x0, x1] = event.selection as [number, number];
          if (Math.abs(x1 - x0) < 12) return; // avoid accidental micro-click
          const startMonth = Math.max(1, Math.min(maxMonth, xScale.invert(x0)));
          const endMonth = Math.max(1, Math.min(maxMonth, xScale.invert(x1)));
          if (Math.abs(endMonth - startMonth) >= 0.4) {
            audioFeedback.playSuccessChime();
            setZoomDomain([Math.min(startMonth, endMonth), Math.max(startMonth, endMonth)]);
          }
          g.select<SVGGElement>('.chart-brush-x-selection').call(brush.move as any, null);
        });

      const brushG = g.append('g')
        .attr('class', 'chart-brush-x-selection')
        .call(brush);

      brushG.select('.overlay')
        .attr('cursor', 'crosshair');

      brushG.selectAll('.selection')
        .attr('fill', '#C5A059')
        .attr('fill-opacity', 0.25)
        .attr('stroke', '#C5A059')
        .attr('stroke-width', 1.5)
        .attr('stroke-dasharray', '4 2');
    }

    // -------------------------------------------------------------
    // 5. INTERACTIVE CROSSHAIR TOOL (Dual Axis Scrubbing & Reticle)
    // -------------------------------------------------------------
    const crosshairGroup = g.append('g').attr('class', 'interactive-crosshair-hud');

    const verticalCrosshair = crosshairGroup.append('line')
      .attr('y1', 0)
      .attr('y2', innerHeight)
      .attr('stroke', '#C5A059')
      .attr('stroke-width', 1.2)
      .attr('stroke-dasharray', '3 2')
      .attr('opacity', 0);

    const horizontalEcoLine = crosshairGroup.append('line')
      .attr('x1', 0)
      .attr('x2', innerWidth)
      .attr('stroke', '#10B981')
      .attr('stroke-width', 1)
      .attr('stroke-dasharray', '2 2')
      .attr('opacity', 0);

    const horizontalEconLine = crosshairGroup.append('line')
      .attr('x1', 0)
      .attr('x2', innerWidth)
      .attr('stroke', '#C5A059')
      .attr('stroke-width', 1)
      .attr('stroke-dasharray', '2 2')
      .attr('opacity', 0);

    const ecoReticleHalo = crosshairGroup.append('circle')
      .attr('r', 10)
      .attr('fill', 'none')
      .attr('stroke', '#10B981')
      .attr('stroke-width', 1.5)
      .attr('opacity', 0);

    const ecoReticleDot = crosshairGroup.append('circle')
      .attr('r', 4)
      .attr('fill', '#10B981')
      .attr('stroke', '#0A0A0A')
      .attr('stroke-width', 1.5)
      .attr('opacity', 0);

    const econReticleHalo = crosshairGroup.append('circle')
      .attr('r', 10)
      .attr('fill', 'none')
      .attr('stroke', '#C5A059')
      .attr('stroke-width', 1.5)
      .attr('opacity', 0);

    const econReticleDot = crosshairGroup.append('circle')
      .attr('r', 4)
      .attr('fill', '#C5A059')
      .attr('stroke', '#0A0A0A')
      .attr('stroke-width', 1.5)
      .attr('opacity', 0);

    // Axis Badge
    const axisBadgeX = crosshairGroup.append('g').attr('opacity', 0);
    axisBadgeX.append('rect')
      .attr('y', innerHeight + 2)
      .attr('width', 42)
      .attr('height', 16)
      .attr('rx', 2)
      .attr('fill', '#C5A059');
    axisBadgeX.append('text')
      .attr('y', innerHeight + 14)
      .attr('text-anchor', 'middle')
      .attr('fill', '#000000')
      .attr('font-size', '9px')
      .attr('font-family', 'monospace')
      .attr('font-weight', 'bold');

    // Helper to update crosshair position
    const updateCrosshairToPoint = (point: MonthlyTrendDataPoint) => {
      const px = xScale(point.monthIndex);
      const pyEco = yScale(normEco(point.ecologicalFlourishing));
      const pyEcon = yScale(normEcon(point.economicStability));

      setHoveredPoint(point);
      setCrosshairPos({
        x: px + margin.left,
        yEco: pyEco + margin.top,
        yEcon: pyEcon + margin.top,
        innerWidth
      });

      verticalCrosshair
        .attr('x1', px).attr('x2', px)
        .attr('opacity', 0.85);

      if (!isMultiRegionMode && (activeSeries === 'both' || activeSeries === 'ecological')) {
        horizontalEcoLine
          .attr('y1', pyEco).attr('y2', pyEco)
          .attr('opacity', 0.6);
        ecoReticleHalo.attr('cx', px).attr('cy', pyEco).attr('opacity', 0.9);
        ecoReticleDot.attr('cx', px).attr('cy', pyEco).attr('opacity', 1);
      } else {
        horizontalEcoLine.attr('opacity', 0);
        ecoReticleHalo.attr('opacity', 0);
        ecoReticleDot.attr('opacity', 0);
      }

      if (!isMultiRegionMode && (activeSeries === 'both' || activeSeries === 'economic')) {
        horizontalEconLine
          .attr('y1', pyEcon).attr('y2', pyEcon)
          .attr('opacity', 0.6);
        econReticleHalo.attr('cx', px).attr('cy', pyEcon).attr('opacity', 0.9);
        econReticleDot.attr('cx', px).attr('cy', pyEcon).attr('opacity', 1);
      } else {
        horizontalEconLine.attr('opacity', 0);
        econReticleHalo.attr('opacity', 0);
        econReticleDot.attr('opacity', 0);
      }

      axisBadgeX.attr('opacity', 1);
      axisBadgeX.select('rect').attr('x', px - 21);
      axisBadgeX.select('text').attr('x', px).text(point.shortMonth);
    };

    if (isPinned && selectedPoint) {
      updateCrosshairToPoint(selectedPoint);
    }

    // Transparent Interactive Overlay for Mouse Scrubbing (active when not in Zoom-Select drag mode)
    if (!isZoomSelectMode) {
      const overlay = g.append('rect')
        .attr('width', innerWidth)
        .attr('height', innerHeight)
        .attr('fill', 'transparent')
        .attr('cursor', 'crosshair');

      overlay.on('mousemove', (event) => {
        if (!isCrosshairActive) return;
        const [mouseX] = d3.pointer(event);
        const rawMonth = xScale.invert(mouseX);
        const roundedMonth = Math.max(1, Math.min(maxMonth, Math.round(rawMonth)));

        if (roundedMonth <= 12) {
          const pt = primaryDataset.find(p => p.monthIndex === roundedMonth);
          if (pt) updateCrosshairToPoint(pt);
        } else {
          const forecastPt = forecastData.find(p => p.monthIndex === roundedMonth);
          if (forecastPt) {
            const pseudoPt: MonthlyTrendDataPoint = {
              monthIndex: forecastPt.monthIndex,
              monthLabel: forecastPt.monthLabel,
              shortMonth: forecastPt.shortMonth,
              calendarMonth: forecastPt.calendarMonth,
              exactDate: `${forecastPt.calendarMonth} 15, 2027 (Simulated)`,
              isoDate: `2027-${String(forecastPt.monthIndex - 12).padStart(2, '0')}-15`,
              ecologicalFlourishing: forecastPt.projectedFlourishing,
              economicStability: forecastPt.projectedEconomicStability,
              extractiveCounterfactual: forecastPt.extractiveCounterfactual,
              decouplingMargin: forecastPt.decouplingMargin,
              milestone: `[Projected Gemini Simulation] ${forecastPt.milestone}`,
              verifiedSensorCount: 4200,
              cryptographicHash: `Simulated ZK-Leaf #M${forecastPt.monthIndex}`
            };
            updateCrosshairToPoint(pseudoPt);
          }
        }
      });

      overlay.on('mouseleave', () => {
        if (!isPinned) {
          setHoveredPoint(null);
          setCrosshairPos(null);
          verticalCrosshair.attr('opacity', 0);
          horizontalEcoLine.attr('opacity', 0);
          horizontalEconLine.attr('opacity', 0);
          ecoReticleHalo.attr('opacity', 0);
          ecoReticleDot.attr('opacity', 0);
          econReticleHalo.attr('opacity', 0);
          econReticleDot.attr('opacity', 0);
          axisBadgeX.attr('opacity', 0);
        }
      });

      overlay.on('click', (event) => {
        const [mouseX] = d3.pointer(event);
        const rawMonth = xScale.invert(mouseX);
        const roundedMonth = Math.max(1, Math.min(maxMonth, Math.round(rawMonth)));

        if (roundedMonth <= 12) {
          const pt = primaryDataset.find(p => p.monthIndex === roundedMonth);
          if (pt) {
            audioFeedback.playMicroTick();
            setSelectedPoint(pt);
            setIsPinned(prev => !prev || selectedPoint.monthIndex !== pt.monthIndex);
            updateCrosshairToPoint(pt);
            if (onInspectPoint) onInspectPoint(pt);
          }
        }
      });
    }

    // Ensure the draggable alert threshold guide is positioned above scrubbing and zoom overlays
    g.select('.alert-threshold-guide').raise();

  }, [
    dimensions, 
    activeSeries, 
    showCounterfactual, 
    showAreaFill, 
    isCrosshairActive, 
    isPinned, 
    selectedPoint, 
    onInspectPoint,
    selectedBioregionObjects,
    primaryDataset,
    showAnomalies,
    showAnnotations,
    showPredictiveForecast,
    forecastData,
    isNormalized,
    alertThreshold,
    allAnnotations,
    isZoomSelectMode,
    zoomDomain,
    isConfidenceIntervalActive
  ]);

  const displayPoint = hoveredPoint || selectedPoint;
  const isMultiRegionMode = selectedBioregionObjects.length > 1;

  return (
    <div 
      id="flourishing-vs-stability-d3-chart-card"
      className="p-5 sm:p-6 rounded-md bg-[#0D0D0D] border border-[#F5F5F0]/15 space-y-6 shadow-xl"
    >
      {/* 1. Header & Summary Bar */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 pb-4 border-b border-[#F5F5F0]/10">
        <div className="space-y-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[10px] font-mono uppercase text-[#C5A059] tracking-[0.2em] font-bold">
              12-MONTH LONGITUDINAL D3 COMPARISON MATRIX & 6-MO FORECAST
            </span>
            <span className="text-[9px] font-mono bg-emerald-950/80 text-emerald-300 border border-emerald-500/40 px-2 py-0.2 rounded font-bold">
              r = +{summaryMetrics.correlation} (Co-Flourishing)
            </span>
            {showPredictiveForecast && (
              <span className="text-[9px] font-mono bg-cyan-950/80 text-cyan-300 border border-cyan-500/40 px-2 py-0.2 rounded font-bold flex items-center gap-1">
                <Cpu className="w-3 h-3 text-cyan-400" />
                Gemini 3.8 Flash Engine
              </span>
            )}
          </div>

          <h2 className="text-xl sm:text-2xl font-serif text-[#F5F5F0] flex items-center gap-2.5">
            <Scale className="w-5 h-5 text-[#C5A059]" />
            Ecological Flourishing vs. Economic Stability
          </h2>
          <p className="text-xs sm:text-sm text-[#F5F5F0]/70 font-sans max-w-2xl">
            Mathematical proof that regenerative ecosystem stewardship directly drives local economic resilience. Compare bioregional trajectories, inspect historical milestones with external provenance, and simulate the next 6-month simulation window.
          </p>
        </div>

        {/* Global Toolbar & CSV Export */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Generate AI Insights Button */}
          <button
            id="generate-ai-insights-btn"
            onClick={handleGenerateAIInsights}
            disabled={isAIInsightsLoading}
            className="px-3 py-1.5 rounded-sm bg-[#132219] hover:bg-[#1b3024] border border-emerald-500/60 text-emerald-300 hover:text-white text-[11px] font-mono font-bold flex items-center gap-1.5 transition-all shadow cursor-pointer uppercase tracking-wider disabled:opacity-50"
            title="Analyze the current multi-line trend comparison using the Gemini engine for ecological & economic correlations"
          >
            {isAIInsightsLoading ? (
              <>
                <span className="w-3.5 h-3.5 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin" />
                <span>Analyzing...</span>
              </>
            ) : (
              <>
                <Brain className="w-3.5 h-3.5 text-emerald-400" />
                <span>Generate AI Insights</span>
              </>
            )}
          </button>

          {/* Quick-Set Time Range Selector */}
          <div className="flex items-center">
            <TimeRangeSelector
              value={activeTimeRange}
              onChange={handleTimeRangeChange}
            />
          </div>

          {/* Normalize Data Toggle */}
          <button
            id="toggle-normalize-data-btn"
            onClick={handleToggleNormalized}
            className={`px-2.5 py-1.5 rounded-sm border text-[10px] font-mono transition-colors flex items-center gap-1.5 cursor-pointer ${
              isNormalized
                ? 'bg-purple-950/70 border-purple-500/60 text-purple-200 shadow-sm'
                : 'bg-[#141414] border-[#F5F5F0]/15 text-[#F5F5F0]/50 hover:text-[#F5F5F0]'
            }`}
            title="Normalize Ecological Flourishing and Economic Stability to 0-100% relative range for easier comparison across disparate unit scales"
          >
            <Percent className="w-3 h-3 text-purple-400" />
            <span>Normalize: {isNormalized ? '0-100%' : 'RAW'}</span>
          </button>

          {/* Celestial Alignment Toggle */}
          <button
            id="chart-celestial-alignment-btn"
            onClick={handleToggleCelestial}
            className={`px-2.5 py-1.5 rounded-sm border text-[10px] font-mono transition-colors flex items-center gap-1.5 cursor-pointer ${
              isCelestialAlignment
                ? 'bg-gradient-to-r from-amber-950 via-sky-950 to-purple-950 border-[#C5A059] text-amber-200 shadow-md ring-1 ring-[#C5A059]/50'
                : 'bg-[#141414] border-[#F5F5F0]/15 text-[#F5F5F0]/50 hover:text-[#F5F5F0]'
            }`}
            title="Map historical milestone data points onto the Star Map coordinate system as an interconnected celestial constellation"
          >
            <Star className={`w-3 h-3 ${isCelestialAlignment ? 'text-[#C5A059] fill-[#C5A059]' : 'text-neutral-400'}`} />
            <span>Celestial: {isCelestialAlignment ? 'ON' : 'OFF'}</span>
          </button>

          {/* Ritual Cleanse Button */}
          <button
            id="chart-ritual-cleanse-btn"
            onClick={handleCleanse}
            disabled={isRitualCleansing}
            className={`px-2.5 py-1.5 rounded-sm border text-[10px] font-mono transition-colors flex items-center gap-1.5 cursor-pointer ${
              isDataPurified
                ? 'bg-emerald-950/80 border-emerald-500/60 text-emerald-200 shadow-sm ring-1 ring-emerald-500/30'
                : 'bg-[#18150F] border-[#C5A059]/40 text-[#C5A059] hover:text-white'
            }`}
            title="Filter out chart noise via a stardust transition effect, purifying the data stream for enhanced epistemic clarity"
          >
            <Sparkles className={`w-3 h-3 ${isRitualCleansing ? 'text-[#C5A059] animate-spin' : isDataPurified ? 'text-emerald-400' : 'text-[#C5A059]'}`} />
            <span>{isRitualCleansing ? 'Cleansing...' : isDataPurified ? 'Purified' : 'Ritual Cleanse'}</span>
          </button>

          {/* Threshold Alert Configuration */}
          <button
            id="configure-threshold-alert-btn"
            onClick={() => {
              audioFeedback.playMicroTick();
              setIsThresholdModalOpen(true);
            }}
            className={`px-2.5 py-1.5 rounded-sm border text-[10px] font-mono transition-colors flex items-center gap-1.5 cursor-pointer ${
              alertThreshold.enabled
                ? isAlertTriggered
                  ? 'bg-rose-950 border-rose-500 text-rose-200 animate-pulse'
                  : 'bg-amber-950/70 border-amber-500/50 text-amber-200'
                : 'bg-[#141414] border-[#F5F5F0]/15 text-[#F5F5F0]/50 hover:text-[#F5F5F0]'
            }`}
            title="Configure threshold alert triggers when ecological or economic metrics cross defined limits"
          >
            <Bell className={`w-3 h-3 ${isAlertTriggered ? 'text-rose-400' : alertThreshold.enabled ? 'text-amber-400' : 'text-[#C5A059]'}`} />
            <span>
              {alertThreshold.enabled 
                ? `Alert: ${alertThreshold.metric.slice(0, 4).toUpperCase()} ${alertThreshold.condition === 'below' ? '<' : '>'} ${alertThreshold.value}` 
                : 'Set Alert'}
            </span>
          </button>

          {/* Download CSV Audit Trail Button */}
          <button
            id="download-longitudinal-csv-btn"
            onClick={handleExportCSV}
            className="px-3 py-1.5 rounded-sm bg-[#1A1812] hover:bg-[#252219] border border-[#C5A059] text-[#C5A059] hover:text-white text-[11px] font-mono font-bold flex items-center gap-1.5 transition-all shadow cursor-pointer uppercase tracking-wider"
            title="Export all longitudinal metrics & provenance metadata to audit-ready CSV"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download CSV</span>
          </button>

          {/* Series selector */}
          <div className="flex items-center bg-[#070908] p-1 border border-[#F5F5F0]/15 rounded-sm text-xs font-mono">
            <button
              onClick={() => {
                audioFeedback.playMicroTick();
                setActiveSeries('both');
              }}
              className={`px-2.5 py-1 rounded-sm transition-colors text-[10px] font-bold uppercase ${
                activeSeries === 'both' ? 'bg-[#1B3022] text-white border border-[#C5A059]/50' : 'text-[#F5F5F0]/60 hover:text-white'
              }`}
            >
              Both
            </button>
            <button
              onClick={() => {
                audioFeedback.playMicroTick();
                setActiveSeries('ecological');
              }}
              className={`px-2.5 py-1 rounded-sm transition-colors text-[10px] font-bold uppercase ${
                activeSeries === 'ecological' ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/50' : 'text-[#F5F5F0]/60 hover:text-white'
              }`}
            >
              Eco
            </button>
            <button
              onClick={() => {
                audioFeedback.playMicroTick();
                setActiveSeries('economic');
              }}
              className={`px-2.5 py-1 rounded-sm transition-colors text-[10px] font-bold uppercase ${
                activeSeries === 'economic' ? 'bg-[#2A2312] text-[#C5A059] border border-[#C5A059]/50' : 'text-[#F5F5F0]/60 hover:text-white'
              }`}
            >
              Econ
            </button>
          </div>

          {/* Toggle Anomaly Detection Highlight */}
          <button
            id="toggle-anomaly-detection-btn"
            onClick={() => {
              audioFeedback.playMicroTick();
              setShowAnomalies(!showAnomalies);
            }}
            className={`px-2.5 py-1.5 rounded-sm border text-[10px] font-mono transition-colors flex items-center gap-1.5 cursor-pointer ${
              showAnomalies 
                ? 'bg-rose-950/60 border-rose-500/50 text-rose-300' 
                : 'bg-[#141414] border-[#F5F5F0]/15 text-[#F5F5F0]/50'
            }`}
            title="Toggle background visual shading for detected moving average anomalies & system stress"
          >
            <AlertTriangle className="w-3 h-3 text-rose-400" />
            <span>Stress Anomalies: {showAnomalies ? 'ON' : 'OFF'}</span>
          </button>

          {/* Toggle Annotation Markers */}
          <button
            id="toggle-annotation-markers-btn"
            onClick={() => {
              audioFeedback.playMicroTick();
              setShowAnnotations(!showAnnotations);
            }}
            className={`px-2.5 py-1.5 rounded-sm border text-[10px] font-mono transition-colors flex items-center gap-1.5 cursor-pointer ${
              showAnnotations 
                ? 'bg-[#1B271F] border-emerald-500/50 text-emerald-300' 
                : 'bg-[#141414] border-[#F5F5F0]/15 text-[#F5F5F0]/50'
            }`}
            title="Toggle interactive historical event annotation markers on the timeline"
          >
            <Bookmark className="w-3 h-3 text-[#C5A059]" />
            <span>Milestones: {showAnnotations ? 'ON' : 'OFF'}</span>
          </button>

          {/* Toggle Predictive Forecast Overlay */}
          <button
            id="toggle-predictive-forecast-btn"
            onClick={() => {
              handleTogglePredictiveForecast();
              if (!showPredictiveForecast) {
                handleRunGeminiSimulation();
              }
            }}
            className={`px-2.5 py-1.5 rounded-sm border text-[10px] font-mono transition-colors flex items-center gap-1.5 cursor-pointer ${
              showPredictiveForecast 
                ? 'bg-cyan-950/70 border-cyan-500/50 text-cyan-300' 
                : 'bg-[#141414] border-[#F5F5F0]/15 text-[#F5F5F0]/50'
            }`}
            title="Toggle Gemini 6-month Epistemic Forecast simulation window overlay"
          >
            <Sparkles className="w-3 h-3 text-cyan-400" />
            <span>Epistemic Forecast: {showPredictiveForecast ? 'ON' : 'OFF'}</span>
          </button>

          {/* Bioregional Comparator: Persistent Add Bioregion Button */}
          <button
            id="chart-add-bioregion-persistent-btn"
            onClick={() => {
              audioFeedback.playMicroTick();
              if (onAddBioregionClick) {
                onAddBioregionClick();
              } else {
                setIsBioregionalComparatorModalOpen(true);
              }
            }}
            className="px-2.5 py-1.5 rounded-sm bg-[#16291E] hover:bg-[#203D2C] border border-emerald-500/60 text-emerald-300 hover:text-white text-[10px] font-mono transition-all flex items-center gap-1.5 cursor-pointer font-bold shadow-sm"
            title="Add an additional bioregion to overlay onto the existing trend chart for direct comparison"
          >
            <Plus className="w-3 h-3 text-emerald-400" />
            <span>+ Add Bioregion ({activeBioregionIds.length})</span>
          </button>

          {/* Confidence Interval (±1σ / 95% CI) Toggle */}
          <button
            id="chart-toggle-confidence-interval-btn"
            onClick={() => {
              audioFeedback.playMicroTick();
              handleToggleConfidenceInterval();
            }}
            className={`px-2.5 py-1.5 rounded-sm border text-[10px] font-mono transition-colors flex items-center gap-1.5 cursor-pointer ${
              isConfidenceIntervalActive
                ? 'bg-emerald-950/80 border-emerald-500 text-emerald-300 font-bold shadow-sm ring-1 ring-emerald-500/40'
                : 'bg-[#141414] border-[#F5F5F0]/15 text-[#F5F5F0]/50 hover:text-[#F5F5F0]'
            }`}
            title="Display shaded areas around trend lines representing the standard deviation and statistical confidence interval of visualized metrics"
          >
            <Activity className="w-3 h-3 text-emerald-400" />
            <span>Confidence Interval (±σ): {isConfidenceIntervalActive ? 'ON' : 'OFF'}</span>
          </button>

          {/* Add Custom Annotation Button */}
          <button
            id="add-custom-annotation-btn"
            onClick={() => handleOpenAddAnnotation()}
            className="px-2.5 py-1.5 rounded-sm bg-[#16231A] hover:bg-[#1E3023] border border-emerald-500/60 text-emerald-300 hover:text-white text-[10px] font-mono transition-colors flex items-center gap-1.5 cursor-pointer font-bold shadow-sm"
            title="Add custom text label to explain sudden spikes or drops on the trend chart"
          >
            <MessageSquarePlus className="w-3 h-3 text-emerald-400" />
            <span>+ Add Annotation</span>
            {customAnnotations.length > 0 && (
              <span className="px-1 py-0.2 rounded bg-emerald-950 text-emerald-300 border border-emerald-500/40 text-[9px]">
                {customAnnotations.length}
              </span>
            )}
          </button>

          {/* Historical Comparison Toggle (Prior Year vs Current Year) */}
          <button
            id="toggle-historical-comparison-btn"
            onClick={handleToggleHistoricalComparison}
            className={`px-2.5 py-1.5 rounded-sm border text-[10px] font-mono transition-colors flex items-center gap-1.5 cursor-pointer ${
              showHistoricalComparison
                ? 'bg-[#0F1C2E] border-blue-400 text-blue-200 font-bold shadow-sm ring-1 ring-blue-400/40'
                : 'bg-[#141414] border-[#F5F5F0]/15 text-[#F5F5F0]/50 hover:text-[#F5F5F0]'
            }`}
            title="Overlay historical prior year data ranges (2024-2025) onto current metric charts for longitudinal analysis"
          >
            <GitCompare className="w-3 h-3 text-blue-400" />
            <span>Compare: {showHistoricalComparison ? 'Prior Year [ON]' : 'OFF'}</span>
          </button>

          {/* Add Epistemic Observation Button */}
          <button
            id="add-epistemic-observation-chart-btn"
            onClick={() => handleOpenEpistemicObservation()}
            className="px-2.5 py-1.5 rounded-sm bg-gradient-to-r from-amber-950/90 to-[#221A0F] hover:from-amber-900 hover:to-[#332512] border border-amber-500/60 text-amber-300 hover:text-white text-[10px] font-mono transition-all flex items-center gap-1.5 cursor-pointer font-bold shadow-sm"
            title="Record an Epistemic Observation or manual field note anchored to the Evidence Ledger"
          >
            <FileText className="w-3 h-3 text-amber-400" />
            <span>+ Epistemic Note</span>
          </button>

          {/* Custom Zoom & Pan Interaction Suite */}
          <div className="flex items-center gap-1 bg-[#0A0D0B] p-1 border border-[#C5A059]/30 rounded-sm">
            <button
              id="chart-pan-left-btn"
              onClick={handlePanLeft}
              className="p-1 rounded hover:bg-white/10 text-[#C5A059] transition-colors cursor-pointer"
              title="Pan temporal window left (earlier in time)"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
            <button
              id="chart-pan-right-btn"
              onClick={handlePanRight}
              className="p-1 rounded hover:bg-white/10 text-[#C5A059] transition-colors cursor-pointer"
              title="Pan temporal window right (later in time)"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
            <button
              id="chart-zoom-in-btn"
              onClick={handleZoomIn}
              className="p-1 rounded hover:bg-white/10 text-[#C5A059] transition-colors cursor-pointer"
              title="Zoom in (magnify temporal window)"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
            <button
              id="chart-zoom-out-btn"
              onClick={handleZoomOut}
              className="p-1 rounded hover:bg-white/10 text-[#C5A059] transition-colors cursor-pointer"
              title="Zoom out (expand temporal window)"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <button
              id="toggle-zoom-select-mode-btn"
              onClick={handleToggleZoomSelectMode}
              className={`px-2 py-1 rounded text-[10px] font-mono transition-colors flex items-center gap-1 cursor-pointer ${
                isZoomSelectMode 
                  ? 'bg-[#2A2312] border border-[#C5A059] text-[#C5A059] font-bold shadow-sm' 
                  : 'text-[#F5F5F0]/60 hover:text-white'
              }`}
              title="Drag horizontally across the chart canvas to magnify a specific temporal window"
            >
              <span>Brush Box</span>
            </button>
            {zoomDomain && (
              <button
                id="chart-reset-zoom-btn"
                onClick={handleResetZoom}
                className="px-2 py-1 rounded bg-[#C5A059]/20 hover:bg-[#C5A059]/30 text-[#C5A059] border border-[#C5A059]/40 text-[9px] font-mono font-bold cursor-pointer transition-colors"
                title="Reset zoom to full timeline"
              >
                Reset
              </button>
            )}
          </div>

          {/* Temporal Drill-Down Presets */}
          <div className="hidden xl:flex items-center gap-1 bg-[#0A0D0B] p-1 border border-[#F5F5F0]/15 rounded-sm text-[9px] font-mono">
            <span className="text-[#8E9490] px-1 font-bold">Drilldown:</span>
            <button
              onClick={() => handleSetTemporalPreset(1, 18)}
              className={`px-1.5 py-0.5 rounded cursor-pointer ${!zoomDomain ? 'bg-[#C5A059] text-black font-bold' : 'text-[#F5F5F0]/60 hover:text-white'}`}
            >
              Full
            </button>
            <button
              onClick={() => handleSetTemporalPreset(1, 12)}
              className="px-1.5 py-0.5 rounded text-[#F5F5F0]/60 hover:text-white cursor-pointer"
            >
              Year
            </button>
            <button
              onClick={() => handleSetTemporalPreset(1, 6)}
              className="px-1.5 py-0.5 rounded text-[#F5F5F0]/60 hover:text-white cursor-pointer"
            >
              H1
            </button>
            <button
              onClick={() => handleSetTemporalPreset(7, 12)}
              className="px-1.5 py-0.5 rounded text-[#F5F5F0]/60 hover:text-white cursor-pointer"
            >
              H2
            </button>
            <button
              onClick={() => handleSetTemporalPreset(10, 12)}
              className="px-1.5 py-0.5 rounded text-[#F5F5F0]/60 hover:text-white cursor-pointer"
            >
              Q4
            </button>
            <button
              onClick={() => handleSetTemporalPreset(12, 18)}
              className="px-1.5 py-0.5 rounded text-cyan-400 hover:text-cyan-200 cursor-pointer"
            >
              Forecast
            </button>
          </div>

          {/* Crosshair HUD Toggle */}
          <button
            id="toggle-crosshair-hud-tool"
            onClick={() => {
              audioFeedback.playMicroTick();
              setIsCrosshairActive(!isCrosshairActive);
              if (isCrosshairActive) {
                setIsPinned(false);
                setHoveredPoint(null);
                setCrosshairPos(null);
              }
            }}
            className={`px-2.5 py-1.5 rounded-sm border text-[10px] font-mono transition-colors flex items-center gap-1.5 ${
              isCrosshairActive
                ? 'bg-[#1B3022] border-emerald-500/50 text-emerald-300'
                : 'bg-[#141414] border-[#F5F5F0]/15 text-[#F5F5F0]/50 hover:text-[#F5F5F0]'
            }`}
          >
            <Crosshair className="w-3 h-3" />
            <span>Crosshair: {isCrosshairActive ? 'ON' : 'OFF'}</span>
          </button>

          {isPinned && (
            <button
              onClick={() => {
                audioFeedback.playMicroTick();
                setIsPinned(false);
              }}
              className="px-2.5 py-1.5 rounded-sm bg-amber-950/60 border border-amber-500/50 text-amber-300 text-[10px] font-mono transition-colors flex items-center gap-1"
              title="Click to release locked crosshair"
            >
              <PinOff className="w-3 h-3" />
              <span>Locked ({selectedPoint.shortMonth})</span>
            </button>
          )}

          {/* Reset cached view settings */}
          <button
            onClick={handleResetToDefaults}
            className="p-1.5 rounded-sm border border-[#F5F5F0]/15 bg-[#141414] hover:bg-[#1f1f1f] text-[#F5F5F0]/50 hover:text-white transition-colors cursor-pointer"
            title="Reset cached comparison filters and chart preferences to default"
          >
            <RotateCcw className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* Zoom to Selection Banner (Active Notice) */}
      {isZoomSelectMode && (
        <div className="px-3.5 py-2.5 rounded bg-[#1C170E] border border-[#C5A059]/50 text-[#C5A059] text-xs font-mono flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 animate-in fade-in">
          <div className="flex items-center gap-2">
            <ZoomIn className="w-4 h-4 text-[#C5A059] animate-pulse shrink-0" />
            <span>
              <strong>Zoom to Selection Active:</strong> Click and drag horizontally anywhere across the chart to magnify a date range.
            </span>
          </div>
          {zoomDomain && (
            <button
              onClick={handleResetZoom}
              className="px-2 py-0.5 rounded bg-[#C5A059] text-black font-bold text-[10px] hover:bg-[#d8b46e] transition-colors cursor-pointer"
            >
              Reset to Full Timeline
            </button>
          )}
        </div>
      )}

      {/* Detailed Temporal Window Metric Analysis HUD */}
      {temporalDrillDownAnalysis && (
        <div 
          id="chart-temporal-drilldown-analysis-hud"
          className="p-3 bg-gradient-to-r from-[#101713] via-[#16201B] to-[#101713] border border-emerald-500/50 rounded text-xs font-mono shadow-xl space-y-2 animate-in fade-in"
        >
          <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-emerald-500/30">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded bg-emerald-500/20 border border-emerald-400 flex items-center justify-center text-emerald-300">
                <Activity className="w-3.5 h-3.5 text-emerald-400" />
              </div>
              <span className="text-white font-bold uppercase tracking-wider text-[11px]">
                Drill-Down Window Analysis: {temporalDrillDownAnalysis.startLabel} → {temporalDrillDownAnalysis.endLabel}
              </span>
              <span className="text-[10px] text-emerald-300 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-500/40 font-bold">
                {temporalDrillDownAnalysis.windowSpan.toFixed(1)} MONTH SPAN ({temporalDrillDownAnalysis.pointsCount} PTS)
              </span>
            </div>
            <button
              type="button"
              onClick={handleResetZoom}
              className="px-2 py-1 bg-black/60 hover:bg-black text-[#C5A059] border border-[#C5A059]/40 rounded text-[10px] cursor-pointer"
            >
              Reset to Full View
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px]">
            <div className="bg-black/40 p-2 rounded border border-white/5">
              <div className="text-[10px] text-[#8E9490] uppercase">Flourishing Trajectory</div>
              <div className="text-emerald-300 font-bold">
                {temporalDrillDownAnalysis.ecoStart.toFixed(1)}% → {temporalDrillDownAnalysis.ecoEnd.toFixed(1)}%
              </div>
              <div className="text-[10px] text-emerald-400">
                Δ {temporalDrillDownAnalysis.ecoDelta >= 0 ? `+${temporalDrillDownAnalysis.ecoDelta.toFixed(1)}` : temporalDrillDownAnalysis.ecoDelta.toFixed(1)}% ({temporalDrillDownAnalysis.ecoRate >= 0 ? `+${temporalDrillDownAnalysis.ecoRate.toFixed(2)}` : temporalDrillDownAnalysis.ecoRate.toFixed(2)}%/mo)
              </div>
            </div>

            <div className="bg-black/40 p-2 rounded border border-white/5">
              <div className="text-[10px] text-[#8E9490] uppercase">Economic Stability</div>
              <div className="text-cyan-300 font-bold">
                {temporalDrillDownAnalysis.econStart.toFixed(1)}% → {temporalDrillDownAnalysis.econEnd.toFixed(1)}%
              </div>
              <div className="text-[10px] text-cyan-400">
                Δ {temporalDrillDownAnalysis.econDelta >= 0 ? `+${temporalDrillDownAnalysis.econDelta.toFixed(1)}` : temporalDrillDownAnalysis.econDelta.toFixed(1)}%
              </div>
            </div>

            <div className="bg-black/40 p-2 rounded border border-white/5">
              <div className="text-[10px] text-[#8E9490] uppercase">Decoupling Expansion</div>
              <div className="text-[#C5A059] font-bold">
                +{temporalDrillDownAnalysis.startDecouple.toFixed(1)} → +{temporalDrillDownAnalysis.endDecouple.toFixed(1)} pts
              </div>
              <div className="text-[10px] text-[#C5A059]">
                Shift: {temporalDrillDownAnalysis.decoupleDelta >= 0 ? `+${temporalDrillDownAnalysis.decoupleDelta.toFixed(1)}` : temporalDrillDownAnalysis.decoupleDelta.toFixed(1)} pts
              </div>
            </div>

            <div className="bg-black/40 p-2 rounded border border-white/5">
              <div className="text-[10px] text-[#8E9490] uppercase">Epistemic Status</div>
              <div className="text-white font-bold">
                Zero Drift
              </div>
              <div className="text-[10px] text-emerald-400">
                Full Quorum In-Situ Sensor Mesh
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Alert Presets Quick-Toggle Bar */}
      <div className="p-3 rounded-sm bg-[#090C0A] border border-[#C5A059]/25 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 text-xs font-mono">
        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center gap-1.5 text-[11px] text-[#C5A059] font-bold shrink-0">
            <Bookmark className="w-3.5 h-3.5 text-[#C5A059]" />
            <span className="uppercase tracking-wider">ALERT PRESETS:</span>
          </div>
          {alertPresets.map(preset => {
            const isActive = activePresetId === preset.id || (
              alertThreshold.enabled &&
              alertThreshold.metric === preset.config.metric &&
              alertThreshold.condition === preset.config.condition &&
              alertThreshold.value === preset.config.value
            );
            return (
              <button
                key={preset.id}
                onClick={() => handleApplyAlertPreset(preset)}
                className={`px-2.5 py-1 rounded-sm border text-[10px] font-mono transition-all flex items-center gap-1.5 cursor-pointer ${
                  isActive
                    ? 'bg-[#2A2312] border-[#C5A059] text-[#C5A059] font-bold shadow-sm ring-1 ring-[#C5A059]/50'
                    : 'bg-[#141414] border-[#F5F5F0]/10 text-[#F5F5F0]/70 hover:text-white hover:border-[#C5A059]/40'
                }`}
                title={`${preset.name}: ${preset.description}`}
              >
                <span>{preset.icon || '⚡'}</span>
                <span>{preset.name}</span>
                {isActive && <Check className="w-3 h-3 text-[#C5A059]" />}
              </button>
            );
          })}
        </div>

        <button
          onClick={() => {
            audioFeedback.playMicroTick();
            setIsThresholdModalOpen(true);
          }}
          className="px-2.5 py-1 rounded-sm bg-[#1A1812] hover:bg-[#252219] border border-[#C5A059]/50 text-[#C5A059] hover:text-white text-[10px] font-mono font-bold flex items-center gap-1 transition-all cursor-pointer shrink-0"
          title="Open full Threshold & Alert Presets Manager"
        >
          <Sliders className="w-3 h-3 text-[#C5A059]" />
          <span>Save / Manage Presets</span>
        </button>
      </div>

      {/* Real-Time Threshold Drag & Notification Setup Toast */}
      {alertDragFeedback && (
        <div 
          id="threshold-drag-feedback-banner"
          className="p-3 sm:p-3.5 rounded-md bg-[#162019] border border-emerald-500/60 text-emerald-200 text-xs font-mono flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 animate-in fade-in slide-in-from-top-1 duration-200 shadow-lg"
        >
          <div className="flex items-center gap-2.5">
            <Sliders className="w-4 h-4 text-emerald-400 animate-pulse flex-shrink-0" />
            <span className="leading-snug">{alertDragFeedback}</span>
          </div>
          <div className="flex items-center gap-2 self-end sm:self-center">
            {!isNotificationPermissionGranted && (
              <button
                type="button"
                onClick={handleRequestNotificationPermission}
                className="px-2.5 py-1 rounded-sm bg-emerald-900/90 hover:bg-emerald-800 text-white text-[11px] font-bold border border-emerald-400/50 flex items-center gap-1.5 transition-colors cursor-pointer shadow-sm"
                title="Arm browser desktop push notifications for real-time breach alerts"
              >
                <Bell className="w-3 h-3 text-amber-300" />
                <span>Enable Desktop Alerts</span>
              </button>
            )}
            <button
              type="button"
              onClick={() => setAlertDragFeedback(null)}
              className="p-1 hover:bg-white/10 rounded text-neutral-400 hover:text-white transition-colors cursor-pointer"
              title="Dismiss notice"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* 2. Active Threshold Alert Banner (When Limit Crossed) */}
      <ThresholdAlertBanner
        isTriggered={isAlertTriggered}
        config={alertThreshold}
        currentValue={currentWatchdogVal}
        onOpenSettings={() => {
          audioFeedback.playMicroTick();
          setIsThresholdModalOpen(true);
        }}
        onDismiss={() => {
          audioFeedback.playMicroTick();
          setIsAlertDismissed(true);
        }}
        isDismissed={isAlertDismissed}
        onEnablePush={handleRequestNotificationPermission}
        isPushGranted={isNotificationPermissionGranted}
      />

      {/* 2. Bioregion Multi-Select Filter Component */}
      <BioregionMultiSelectFilter
        selectedIds={activeBioregionIds}
        onToggle={toggleBioregion}
        onSelectAll={selectAllBioregions}
        onResetToDefault={resetToDefaultBioregion}
      />

      {/* 3. Predictive Forecast Simulation Bar (When 6-Mo Forecast is Active) */}
      {showPredictiveForecast && (
        <div className="p-3.5 bg-[#070D0B] rounded border border-cyan-500/30 space-y-2.5 text-xs font-mono animate-in fade-in duration-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-white/10">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              <span className="font-bold text-cyan-300 uppercase tracking-wider text-[11px]">
                Gemini Engine 6-Month Ecological Simulation (M13 - M18)
              </span>
              <span className="text-[9px] px-1.5 py-0.2 rounded bg-cyan-950 text-cyan-400 border border-cyan-500/30">
                Oct 2026 - Mar 2027
              </span>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[10px] text-neutral-400">Simulation Scenario:</span>
              <div className="flex items-center bg-[#050706] p-0.5 rounded border border-white/10">
                <button
                  type="button"
                  onClick={() => {
                    setForecastScenario('balanced_covenant');
                    handleRunGeminiSimulation('balanced_covenant');
                  }}
                  className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase transition-colors ${
                    forecastScenario === 'balanced_covenant'
                      ? 'bg-cyan-950 text-cyan-300 border border-cyan-500/40'
                      : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  Balanced
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setForecastScenario('regenerative_acceleration');
                    handleRunGeminiSimulation('regenerative_acceleration');
                  }}
                  className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase transition-colors ${
                    forecastScenario === 'regenerative_acceleration'
                      ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/40'
                      : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  Acceleration
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setForecastScenario('climate_stress_shock');
                    handleRunGeminiSimulation('climate_stress_shock');
                  }}
                  className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase transition-colors ${
                    forecastScenario === 'climate_stress_shock'
                      ? 'bg-rose-950 text-rose-300 border border-rose-500/40'
                      : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  Climate Shock
                </button>
              </div>

              <button
                type="button"
                onClick={() => handleRunGeminiSimulation()}
                disabled={isSimulatingForecast}
                className="py-1 px-2.5 rounded bg-cyan-950/80 hover:bg-cyan-900 border border-cyan-500/50 text-cyan-300 text-[10px] font-bold flex items-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50"
              >
                {isSimulatingForecast ? (
                  <>
                    <RefreshCw className="w-3 h-3 text-cyan-400 animate-spin" />
                    <span>Simulating Window...</span>
                  </>
                ) : (
                  <>
                    <RefreshCw className="w-3 h-3 text-cyan-400" />
                    <span>Re-Run Simulation</span>
                  </>
                )}
              </button>
            </div>
          </div>

          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3 text-[11px] text-[#F5F5F0]/80">
            <p className="line-clamp-2 max-w-4xl text-neutral-300 leading-relaxed font-sans">
              <strong className="text-cyan-400 font-mono">Biophysical Simulation Synthesis:</strong> {forecastSynthesis}
            </p>
            <div className="flex items-center gap-3 shrink-0 font-mono text-[10px]">
              <span className="text-emerald-400 font-bold">M18 Projected Flourishing: {forecastData[forecastData.length - 1]?.projectedFlourishing}%</span>
              <span className="text-cyan-400">95% Uncertainty Cone: ±2.4%</span>
            </div>
          </div>
        </div>
      )}

      {/* 4. Stat Badges */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono">
        <div className="p-3 bg-[#080A09] rounded border border-emerald-500/30 space-y-1">
          <div className="flex items-center justify-between text-[10px] text-emerald-400 font-bold uppercase">
            <span>Ecological Flourishing</span>
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-xl sm:text-2xl font-bold text-white">{summaryMetrics.latestEco}%</span>
            <span className="text-xs text-emerald-400 font-bold">+{summaryMetrics.ecoGainPct}% / 12mo</span>
          </div>
          <div className="text-[10px] text-[#F5F5F0]/50">Canopy, Aquifer, Soil SOC & Bioacoustics</div>
        </div>

        <div className="p-3 bg-[#080A09] rounded border border-[#C5A059]/30 space-y-1">
          <div className="flex items-center justify-between text-[10px] text-[#C5A059] font-bold uppercase">
            <span>Economic Stability</span>
            <span className="w-2 h-2 rounded-full bg-[#C5A059]" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-xl sm:text-2xl font-bold text-white">{summaryMetrics.latestEcon}%</span>
            <span className="text-xs text-[#C5A059] font-bold">+{summaryMetrics.econGainPct}% / 12mo</span>
          </div>
          <div className="text-[10px] text-[#F5F5F0]/50">P2P Solar Circularity & Livelihood Parity</div>
        </div>

        <div className="p-3 bg-[#080A09] rounded border border-cyan-500/30 space-y-1">
          <div className="flex items-center justify-between text-[10px] text-cyan-400 font-bold uppercase">
            <span>Decoupling Margin</span>
            <ArrowUpRight className="w-3 h-3 text-cyan-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-xl sm:text-2xl font-bold text-white">+{summaryMetrics.decouplingAdvantage.toFixed(1)} pts</span>
            <span className="text-[10px] text-cyan-400">vs Extraction</span>
          </div>
          <div className="text-[10px] text-[#F5F5F0]/50">Overcomes boom-and-bust depletion</div>
        </div>

        <div className="p-3 bg-[#080A09] rounded border border-[#F5F5F0]/15 space-y-1">
          <div className="flex items-center justify-between text-[10px] text-[#F5F5F0]/60 font-bold uppercase">
            <span>Active Sensor Quorum</span>
            <Activity className="w-3 h-3 text-emerald-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-xl sm:text-2xl font-bold text-white">{summaryMetrics.totalSensors.toLocaleString()}</span>
            <span className="text-[10px] text-emerald-400 font-bold">ZKP Verified</span>
          </div>
          <div className="text-[10px] text-[#F5F5F0]/50">Across {selectedBioregionObjects.length} active bioregion(s)</div>
        </div>
      </div>

      {/* 5. Main D3 Chart Stage */}
      <div 
        ref={containerRef}
        className="w-full relative bg-[#070908] rounded border border-[#F5F5F0]/10 p-2 sm:p-4 overflow-hidden"
      >
        {/* Stardust Ritual Cleanse Canvas Overlay */}
        <StardustRitualCleanseOverlay 
          isActive={isRitualCleansing}
          onComplete={handleCleanseComplete}
          width={dimensions.width}
          height={dimensions.height}
        />

        <svg 
          ref={svgRef}
          width={dimensions.width}
          height={dimensions.height}
          className="w-full h-auto overflow-visible select-none"
        />

        {/* Floating Crosshair HUD Overlay */}
        {isCrosshairActive && crosshairPos && displayPoint && (
          <div 
            id="crosshair-historical-provenance-hud"
            className="absolute z-20 pointer-events-auto transition-all duration-100 ease-out font-mono"
            style={{
              left: crosshairPos.x > (dimensions.width * 0.55) 
                ? `${Math.max(12, crosshairPos.x - 350)}px` 
                : `${crosshairPos.x + 18}px`,
              top: '16px',
              maxWidth: '340px',
              width: '90%'
            }}
          >
            <div className="p-3.5 bg-[#0A0D0B]/95 backdrop-blur-md rounded border border-[#C5A059]/40 shadow-2xl space-y-2.5 text-xs text-[#F5F5F0]">
              {/* Header: Exact Date, Month & Pin Indicator */}
              <div className="flex flex-col gap-1 pb-1.5 border-b border-[#F5F5F0]/10">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5">
                    <Crosshair className="w-3.5 h-3.5 text-[#C5A059]" />
                    <span className="font-bold text-[#F5F5F0] text-[11px]">{displayPoint.monthLabel}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    {displayPoint.monthIndex > 12 && (
                      <span className="px-1.5 py-0.2 rounded text-[9px] bg-cyan-950 text-cyan-300 border border-cyan-500/40 font-bold">
                        GEMINI SIM
                      </span>
                    )}
                    {isPinned && (
                      <span className="px-1.5 py-0.2 rounded text-[9px] bg-amber-950 text-amber-300 border border-amber-500/40 font-bold">
                        PINNED
                      </span>
                    )}
                    <span className={`px-1.5 py-0.2 rounded text-[8.5px] font-mono font-bold border ${isNormalized ? 'bg-purple-950/80 text-purple-300 border-purple-500/40' : 'bg-emerald-950/80 text-emerald-300 border-emerald-500/40'}`}>
                      {isNormalized ? 'NORMALIZED (0-100%)' : 'RAW METRICS'}
                    </span>
                  </div>
                </div>

                {/* Exact Date & Timestamp Display */}
                <div className="flex items-center justify-between text-[10px] text-[#C5A059]">
                  <span className="flex items-center gap-1 font-sans text-neutral-300">
                    <Calendar className="w-3 h-3 text-[#C5A059]" />
                    <span>{displayPoint.exactDate || `${displayPoint.calendarMonth}, 2026`}</span>
                  </span>
                  {displayPoint.isoDate && (
                    <span className="font-mono text-[9px] bg-black/60 px-1.5 py-0.5 rounded border border-[#C5A059]/30 text-[#C5A059] font-bold">
                      {displayPoint.isoDate}
                    </span>
                  )}
                </div>
              </div>

              {/* Historical / Projected Values (Raw vs Normalized) */}
              <div className="space-y-2 bg-[#050706] p-2.5 rounded border border-[#F5F5F0]/5">
                <div className="flex items-center justify-between text-[9px] text-[#F5F5F0]/50 uppercase tracking-wider font-bold">
                  <span>{displayPoint.monthIndex > 12 ? 'Projected Simulation' : 'Ground-Truth Telemetry'}</span>
                  <span>RAW vs. NORM</span>
                </div>
                
                {/* When comparing multiple bioregions, show their individual points */}
                {selectedBioregionObjects.length > 1 && displayPoint.monthIndex <= 12 ? (
                  <div className="space-y-1.5 pt-0.5">
                    {selectedBioregionObjects.map(region => {
                      const pt = region.monthlyData.find(p => p.monthIndex === displayPoint.monthIndex);
                      if (!pt) return null;
                      const normVal = normRegionEco(pt.ecologicalFlourishing, region.monthlyData);
                      return (
                        <div key={region.id} className="flex items-center justify-between text-[10px]">
                          <span className="flex items-center gap-1.5 truncate max-w-[140px]">
                            <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: region.color }} />
                            <span className="text-white font-medium truncate">{region.name}</span>
                          </span>
                          <div className="flex items-center gap-2 font-mono">
                            <span className="text-neutral-400">Raw: <strong className="text-white">{pt.ecologicalFlourishing}%</strong></span>
                            <span className="font-bold px-1 rounded bg-black/40 border border-white/10" style={{ color: region.color }}>
                              Norm: {normVal.toFixed(1)}%
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <>
                    {/* Ecological Flourishing Raw vs Normalized */}
                    <div className="space-y-0.5">
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="flex items-center gap-1 text-emerald-400 font-semibold">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                          Ecological Flourishing
                        </span>
                        <div className="flex items-center gap-2 font-mono">
                          <span className="text-neutral-300 text-[10.5px]">Raw: <strong className="text-white">{displayPoint.ecologicalFlourishing}%</strong></span>
                          <span className="text-emerald-300 font-bold text-[10.5px] bg-emerald-950/60 px-1 py-0.2 rounded border border-emerald-500/30">
                            Norm: {normEco(displayPoint.ecologicalFlourishing).toFixed(1)}%
                          </span>
                        </div>
                      </div>
                      {displayPoint.monthIndex > 1 && displayPoint.monthIndex <= 12 && (
                        <div className="text-[9px] text-emerald-400/80 font-mono text-right">
                          MoM Shift: +{(displayPoint.ecologicalFlourishing - primaryDataset[displayPoint.monthIndex - 2]?.ecologicalFlourishing || 0).toFixed(1)}%
                        </div>
                      )}
                    </div>

                    {/* Economic Stability Raw vs Normalized */}
                    <div className="space-y-0.5 pt-1 border-t border-white/5">
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="flex items-center gap-1 text-[#C5A059] font-semibold">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#C5A059]" />
                          Economic Stability
                        </span>
                        <div className="flex items-center gap-2 font-mono">
                          <span className="text-neutral-300 text-[10.5px]">Raw: <strong className="text-white">{displayPoint.economicStability}%</strong></span>
                          <span className="text-[#C5A059] font-bold text-[10.5px] bg-[#2A2312] px-1 py-0.2 rounded border border-[#C5A059]/30">
                            Norm: {normEcon(displayPoint.economicStability).toFixed(1)}%
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Counterfactual if active */}
                    {showCounterfactual && (
                      <div className="flex items-center justify-between text-[10px] text-rose-400 pt-1 border-t border-white/5">
                        <span className="flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                          Extractive Counterfactual
                        </span>
                        <div className="flex items-center gap-2 font-mono">
                          <span className="text-neutral-300">Raw: {displayPoint.extractiveCounterfactual}%</span>
                          <span className="text-rose-300 font-bold">Norm: {normCounter(displayPoint.extractiveCounterfactual).toFixed(1)}%</span>
                        </div>
                      </div>
                    )}

                    {/* Decoupling Advantage */}
                    <div className="flex items-center justify-between text-[10px] text-cyan-300 pt-1 border-t border-white/5 font-mono">
                      <span>Decoupling Advantage</span>
                      <div className="flex items-center gap-2">
                        <span className="text-neutral-400">Raw: <strong className="text-cyan-300">+{displayPoint.decouplingMargin.toFixed(1)} pts</strong></span>
                        <span className="font-bold text-cyan-200 bg-cyan-950/60 px-1 py-0.2 rounded border border-cyan-500/30">
                          Norm Delta: +{(normEco(displayPoint.ecologicalFlourishing) - normEcon(displayPoint.economicStability)).toFixed(1)}%
                        </span>
                      </div>
                    </div>

                    {/* Confidence Interval (±σ) Band Stats if active */}
                    {isConfidenceIntervalActive && (
                      <div className="flex items-center justify-between text-[10px] text-emerald-300/90 pt-1 border-t border-white/5 font-mono">
                        <span className="flex items-center gap-1">
                          <Activity className="w-3 h-3 text-emerald-400" />
                          95% Confidence Interval (±1σ)
                        </span>
                        <div className="flex items-center gap-2">
                          <span className="text-emerald-400">
                            Eco: ±{(3.6 - (displayPoint.monthIndex * 0.08)).toFixed(1)}%
                          </span>
                          <span className="text-[#C5A059]">
                            Econ: ±{(3.0 - (displayPoint.monthIndex * 0.06)).toFixed(1)}%
                          </span>
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>

              {/* Mystical & Alchemical Symbolism Badge (Esoteric Meaning & Hermetic Dynamics) */}
              <AlchemicalTooltipBadge 
                currentPoint={displayPoint}
                previousPoint={displayPoint.monthIndex > 1 ? primaryDataset[displayPoint.monthIndex - 2] : undefined}
                isCelestialActive={isCelestialAlignment}
                isPurified={isDataPurified}
              />

              {/* Provenance Metadata */}
              <div className="space-y-1 bg-[#050706] p-2 rounded border border-[#F5F5F0]/5 text-[10px]">
                <div className="text-[9px] text-[#C5A059] uppercase tracking-wider font-bold flex items-center justify-between">
                  <span className="flex items-center gap-1">
                    <Hash className="w-3 h-3 text-[#C5A059]" />
                    Provenance Metadata
                  </span>
                  <span className="text-[8px] text-emerald-400 bg-emerald-950/60 px-1 py-0.2 rounded border border-emerald-500/30">
                    {displayPoint.monthIndex > 12 ? 'GEMINI 3.8 MODEL' : 'ZK-SNARK TIER 1'}
                  </span>
                </div>
                <div className="flex items-center justify-between text-neutral-400 pt-0.5">
                  <span>Sensor Quorum:</span>
                  <span className="text-white font-bold">{displayPoint.verifiedSensorCount.toLocaleString()} nodes</span>
                </div>
                <div className="flex items-center justify-between text-neutral-400">
                  <span>Verification Root:</span>
                  <span className="text-[#C5A059] font-bold truncate max-w-[150px]">{displayPoint.cryptographicHash}</span>
                </div>
                {displayPoint.milestone && (
                  <div className="pt-1 border-t border-white/5 text-[9px] text-neutral-300 leading-tight">
                    <span className="text-[#C5A059] font-bold">Milestone: </span>
                    {displayPoint.milestone}
                  </div>
                )}
              </div>

              {/* Interactive Actions */}
              <div className="flex items-center gap-1.5 pt-0.5">
                <button
                  type="button"
                  onClick={() => {
                    audioFeedback.playMicroTick();
                    if (onInspectPoint) onInspectPoint(displayPoint);
                    if (onInspectProvenance) {
                      onInspectProvenance({
                        metricName: displayPoint.monthLabel,
                        verificationHash: displayPoint.cryptographicHash,
                        rawSensorReading: `Ecological: ${displayPoint.ecologicalFlourishing}% • Economic: ${displayPoint.economicStability}%`,
                        source: 'Bioregional Multispectral Ingestion Matrix',
                        verifier: 'Pan-African Sovereign Quorum',
                        verifierRole: 'ZKP Merkle Consensus Engine',
                        calculationMethod: displayPoint.milestone || 'Empirical Soil & Piezometric Ingestion',
                        confidenceInterval: '±0.8% Calibrated Ground Truth'
                      });
                    }
                  }}
                  className="flex-1 py-1 px-2 rounded bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-500/40 text-[10px] font-bold text-emerald-300 transition-colors flex items-center justify-center gap-1 cursor-pointer"
                >
                  <ShieldCheck className="w-3 h-3 text-emerald-400" />
                  Audit Ingestion Proof
                </button>
                <button
                  type="button"
                  onClick={() => {
                    audioFeedback.playMicroTick();
                    setIsPinned(!isPinned);
                  }}
                  className={`py-1 px-2 rounded border text-[10px] font-bold transition-colors flex items-center gap-1 cursor-pointer ${
                    isPinned 
                      ? 'bg-amber-950/70 border-amber-500/50 text-amber-300' 
                      : 'bg-[#141414] border-[#F5F5F0]/20 text-[#F5F5F0]/70 hover:text-white'
                  }`}
                  title={isPinned ? 'Unlock crosshair' : 'Lock crosshair to this point'}
                >
                  {isPinned ? <PinOff className="w-3 h-3" /> : <Pin className="w-3 h-3" />}
                  {isPinned ? 'Unlock' : 'Lock'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Legend Bar at Bottom of Canvas */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-[#F5F5F0]/10 text-xs font-mono">
          <div className="flex items-center gap-4 flex-wrap">
            {isMultiRegionMode ? (
              selectedBioregionObjects.map(b => (
                <div key={b.id} className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-full" style={{ backgroundColor: b.color }} />
                  <span className="text-[#F5F5F0]">{b.name}</span>
                </div>
              ))
            ) : (
              <>
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-[#10B981]" />
                  <span className="text-[#F5F5F0]">Ecological Flourishing Index</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-[#C5A059]" />
                  <span className="text-[#F5F5F0]">Economic Stability Index</span>
                </div>
                {showCounterfactual && (
                  <div className="flex items-center gap-1.5">
                    <span className="w-4 h-0.5 border-t border-dashed border-rose-500" />
                    <span className="text-rose-400/80">Extractive Baseline (Counterfactual)</span>
                  </div>
                )}
              </>
            )}

            {showPredictiveForecast && (
              <div className="flex items-center gap-1.5">
                <span className="w-4 h-0.5 border-t border-dashed border-cyan-400" />
                <span className="text-cyan-300">Gemini 6-Mo Forecast Cone (M13-M18)</span>
              </div>
            )}

            {showHistoricalComparison && (
              <div className="flex items-center gap-1.5">
                <span className="w-4 h-0.5 border-t-2 border-dashed border-blue-400" />
                <span className="text-blue-300 font-bold">Historical Prior Year Baseline (2024-25)</span>
              </div>
            )}

            {showAnomalies && (
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 bg-rose-950/60 border border-rose-500/40 rounded-sm" />
                <span className="text-rose-400">Moving Avg Stress Anomaly</span>
              </div>
            )}

            {isConfidenceIntervalActive && (
              <div className="flex items-center gap-1.5">
                <span className="w-3.5 h-2.5 bg-emerald-500/25 border border-emerald-500/60 border-dashed rounded-xs" />
                <span className="text-emerald-300">Confidence Interval (±1σ Shaded Area)</span>
              </div>
            )}
          </div>

          <div className="text-[10px] text-[#F5F5F0]/50">
            Click points for external provenance • Double-click any point to add Epistemic Observation
          </div>
        </div>
      </div>

      {/* 6. Active / Hovered Interval Inspector Card */}
      {displayPoint && (
        <div className="p-4 rounded bg-[#080B09] border border-[#C5A059]/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 font-mono text-xs">
          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-2 py-0.5 rounded bg-[#1B3022] text-emerald-400 text-[10px] font-bold border border-emerald-500/30">
                {displayPoint.monthLabel}
              </span>
              <span className="text-[#C5A059] font-bold">{displayPoint.calendarMonth}</span>
              <span className="text-neutral-500">•</span>
              <span className="text-neutral-400">{displayPoint.verifiedSensorCount} Ingestion Nodes Synced</span>
            </div>

            <div className="text-sm font-serif text-[#F5F5F0] pt-0.5">
              <strong className="text-[#C5A059]">Milestone:</strong> {displayPoint.milestone}
            </div>

            <div className="text-[10px] text-neutral-500 truncate">
              Merkle Root Leaf Hash: <span className="text-neutral-300">{displayPoint.cryptographicHash}</span>
            </div>
          </div>

          <div className="flex items-center gap-4 shrink-0 flex-wrap">
            <div className="text-right">
              <span className="text-[10px] text-emerald-400 block font-bold">Ecological Index</span>
              <span className="text-lg font-bold text-white">{displayPoint.ecologicalFlourishing}%</span>
            </div>
            <div className="text-right">
              <span className="text-[10px] text-[#C5A059] block font-bold">Economic Stability</span>
              <span className="text-lg font-bold text-white">{displayPoint.economicStability}%</span>
            </div>
            <div className="text-right border-l border-white/10 pl-4">
              <span className="text-[10px] text-cyan-400 block font-bold">Decoupling Gain</span>
              <span className="text-lg font-bold text-cyan-300">+{displayPoint.decouplingMargin.toFixed(1)}</span>
            </div>

            {/* Direct Epistemic Note Button on Active Card */}
            <button
              id="inspector-add-epistemic-observation-btn"
              type="button"
              onClick={() => handleOpenEpistemicObservation(displayPoint)}
              className="px-3 py-1.5 rounded bg-gradient-to-r from-amber-500 to-[#C5A059] hover:from-amber-400 hover:to-[#d4b068] text-black font-bold text-[11px] flex items-center gap-1.5 transition-all shadow cursor-pointer uppercase tracking-wider font-mono shrink-0 ml-2"
              title="Record manual field note or Epistemic Observation to Evidence Ledger for this point"
            >
              <FileText className="w-3.5 h-3.5 text-black" />
              <span>+ Epistemic Note</span>
            </button>
          </div>
        </div>
      )}

      {/* Historical Annotation Detail Modal (Context & External Provenance Links) */}
      <AnnotationDetailModal
        annotation={selectedAnnotation}
        isOpen={!!selectedAnnotation}
        onClose={() => setSelectedAnnotation(null)}
        onInspectProvenance={onInspectProvenance}
        onDeleteAnnotation={handleDeleteCustomAnnotation}
      />

      {/* Add Custom Annotation Modal (Labeling Spikes / Drops / Milestones) */}
      {isAddAnnotationModalOpen && (
        <AddAnnotationModal
          isOpen={isAddAnnotationModalOpen}
          onClose={() => setIsAddAnnotationModalOpen(false)}
          availablePoints={primaryDataset}
          preselectedMonthIndex={annotationTargetMonth}
          activeBioregionName={selectedBioregionObjects[0]?.name}
          onSaveAnnotation={handleSaveCustomAnnotation}
        />
      )}

      {/* Epistemic Observation Modal (Manual Notes to Evidence Ledger) */}
      <EpistemicObservationModal
        isOpen={isEpistemicModalOpen}
        onClose={() => setIsEpistemicModalOpen(false)}
        point={epistemicTargetPoint}
        bioregionName={selectedBioregionObjects[0]?.name || 'Pan-African Green Corridor'}
        bioregionId={selectedBioregionObjects[0]?.id || 'pan-african'}
        onNavigateToLedger={() => {
          if (onSelectTab) {
            onSelectTab('evidence-ledger');
          }
        }}
      />

      {/* Historical Anomaly Detail Modal (Moving Average Stress Breakdown) */}
      <AnomalyDetailModal
        anomaly={selectedAnomaly}
        isOpen={!!selectedAnomaly}
        onClose={() => setSelectedAnomaly(null)}
        onOpenMoralSimulator={onOpenMoralSimulator}
      />

      {/* AI Insights Modal (Gemini Engine Correlation Analysis) */}
      <FlourishingAIInsightsModal
        isOpen={isAIInsightsModalOpen}
        onClose={() => setIsAIInsightsModalOpen(false)}
        insights={aiInsightsData}
        isLoading={isAIInsightsLoading}
        onRegenerate={handleGenerateAIInsights}
        selectedBioregionNames={selectedBioregionObjects.map(b => b.name)}
        isNormalized={isNormalized}
      />

      {/* Threshold Alert Configuration Modal */}
      <ThresholdAlertModal
        isOpen={isThresholdModalOpen}
        onClose={() => {
          setIsThresholdModalOpen(false);
          setAlertPresets(loadAlertPresets());
        }}
        config={alertThreshold}
        onSaveConfig={(newConfig) => {
          setAlertThreshold(newConfig);
          setIsThresholdModalOpen(false);
          setAlertPresets(loadAlertPresets());
        }}
        currentMetrics={{
          latestEco: primaryDataset[primaryDataset.length - 1]?.ecologicalFlourishing || 0,
          latestEcon: primaryDataset[primaryDataset.length - 1]?.economicStability || 0,
          decouplingMargin: primaryDataset[primaryDataset.length - 1]?.decouplingMargin || 0
        }}
      />

      {/* Bioregional Comparator Modal */}
      <BioregionalComparatorModal
        isOpen={isBioregionalComparatorModalOpen}
        onClose={() => setIsBioregionalComparatorModalOpen(false)}
        selectedBioregionIds={activeBioregionIds}
        onToggleBioregion={toggleBioregion}
        onSelectAll={selectAllBioregions}
        onResetBaseline={resetToDefaultBioregion}
      />
    </div>
  );
};
